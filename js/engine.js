'use strict';
// =====================================================================
//  ENGINE: render loop, input, sound, dialogue/menus/panels
// =====================================================================
const W = 320, H = 180;
const $ = s => document.querySelector(s);
const cv = $('#screen'), ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---------- Sound (tiny WebAudio synth) ----------
const Snd = {
  ac: null, muted: false,
  init() { if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (this.ac && this.ac.state === 'suspended') this.ac.resume(); },
  tone(f, d = 0.05, type = 'square', v = 0.04, slide = 0, delay = 0) {
    if (this.muted || !this.ac) return;
    const t0 = this.ac.currentTime + delay, o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.linearRampToValueAtTime(Math.max(20, f + slide), t0 + d);
    g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(this.ac.destination); o.start(t0); o.stop(t0 + d + 0.02);
  },
  blip(p = 1) { this.tone((480 + Math.random() * 40) * p, 0.03, 'square', 0.018); },
  select() { this.tone(880, 0.04, 'square', 0.03); },
  good() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.12, 'square', 0.04, 0, i * 0.08)); },
  item() { [784, 988, 1175].forEach((f, i) => this.tone(f, 0.1, 'triangle', 0.06, 0, i * 0.07)); },
  bad() { this.tone(220, 0.3, 'sawtooth', 0.05, -140); },
  gavel() { this.tone(140, 0.12, 'triangle', 0.25, -60); this.tone(120, 0.15, 'triangle', 0.25, -60, 0.18); },
  objection() { this.tone(330, 0.08, 'square', 0.06); this.tone(440, 0.25, 'square', 0.06, 0, 0.08); },
  fanfare() { [392, 523, 659, 784, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.18, 'square', 0.045, 0, i * 0.13)); },
  sad() { [392, 349, 311, 262].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.06, 0, i * 0.25)); },
  step() { this.tone(90 + Math.random() * 20, 0.02, 'triangle', 0.03); },
};

// ---------- FX ----------
const FX = { shake: 0, amt: 0, flash: 0, flashCol: '#fff' };
function shake(amt = 3, dur = 0.3) { FX.shake = dur; FX.amt = amt; }
function flash(col = '#fff', dur = 0.25) { FX.flash = dur; FX.flashCol = col; }

// ---------- Scene + loop ----------
let scene = null;
function setScene(s) { scene = s; hideTooltip(); }
let lastT = 0;
function loop(ts) {
  const t = ts / 1000, dt = Math.min(0.05, t - lastT || 0); lastT = t;
  try {
    if (scene && scene.update) scene.update(dt, t);
    ctx.save();
    if (FX.shake > 0) { ctx.translate(Math.round((Math.random() - 0.5) * FX.amt * 2), Math.round((Math.random() - 0.5) * FX.amt * 2)); FX.shake -= dt; }
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    if (scene) scene.draw(ctx, t);
    ctx.restore();
    if (FX.flash > 0) { ctx.globalAlpha = Math.min(1, FX.flash * 4); ctx.fillStyle = FX.flashCol; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; FX.flash -= dt; }
  } catch (e) { console.error(e); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- Input ----------
const keys = {};
const game = $('#game');
function canvasXY(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
function inUI(el) { return el.closest && el.closest('#menu,#panel,#hudright'); }
game.addEventListener('pointerdown', e => {
  Snd.init();
  if (inUI(e.target)) return;
  if (UI.dialogActive) { UI.advance(); return; }
  if (UI.menuOpen || UI.panelOpen) return;
  const [x, y] = canvasXY(e);
  if (scene && scene.click) scene.click(x, y);
});
game.addEventListener('pointermove', e => {
  if (UI.menuOpen || UI.panelOpen || UI.dialogActive) { hideTooltip(); return; }
  const [x, y] = canvasXY(e);
  if (scene && scene.hover) {
    const label = scene.hover(x, y);
    if (label) showTooltip(label, e); else hideTooltip();
    cv.style.cursor = label ? 'pointer' : 'default';
  }
});
window.addEventListener('keydown', e => {
  Snd.init();
  if (e.target && e.target.tagName === 'INPUT') return;
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (UI.panelOpen) { if (k === 'escape' && UI.panelEsc) UI.panelEsc(); return; }
  if (k === 'c' && UI.onCaseFile && UI.onCaseFile()) return;
  if (UI.menuOpen) { UI.menuKey(k, e); return; }
  if (UI.dialogActive && (k === ' ' || k === 'enter' || k === 'z')) { e.preventDefault(); UI.advance(); return; }
  if (scene && scene.key) scene.key(k, e);
  if (k === ' ' || k.startsWith('arrow')) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

const tip = $('#tooltip');
function showTooltip(text, e) {
  const r = game.getBoundingClientRect();
  tip.textContent = text; tip.classList.remove('hidden');
  tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top) + 'px';
}
function hideTooltip() { tip.classList.add('hidden'); cv.style.cursor = 'default'; }
function setPrompt(text) { const p = $('#prompt'); if (text) { p.textContent = text; p.classList.remove('hidden'); } else p.classList.add('hidden'); }

// ---------- UI ----------
const UI = {
  dialogActive: false, menuOpen: false, panelOpen: false, busy: 0,
  _resolve: null, _typing: false, _full: '', _timer: null, menuKey: () => { }, panelEsc: null,
  advance() {
    if (!this.dialogActive) return;
    if (this._typing) { this._finishTyping(); return; }
    const r = this._resolve; this._resolve = null; this.dialogActive = false;
    Snd.select(); if (r) r();
  },
  _finishTyping() { clearInterval(this._timer); this._typing = false; $('#dtext').innerHTML = this._full; $('#dialog').classList.remove('typing'); },
};

// Speaker resolution is supplied by the game (main.js) via UI.speaker(who) -> {name, look, bg, pitch}
UI.speaker = who => ({ name: who });
UI.format = s => s;

function showDialog(who, text, mood, opts = {}) {
  const sp = typeof who === 'object' ? who : UI.speaker(who);
  const d = $('#dialog'); d.classList.remove('hidden');
  $('#dname').textContent = sp.name || '';
  const pc = $('#portrait');
  if (sp.look) { pc.classList.remove('hidden'); drawPortrait(pc.getContext('2d'), sp.look, mood || sp.mood || 'normal', sp.bg || '#2b3350'); }
  else pc.classList.add('hidden');
  const dt = $('#dtext'); dt.className = opts.cls || '';
  text = UI.format(text);
  // **highlight** markup
  const html = esc(text).replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
  return { sp, dt, html, plain: text };
}

function say(who, text, mood, opts = {}) {
  return new Promise(res => {
    UI.busy++;
    const { sp, dt, html } = showDialog(who, text, mood, opts);
    UI._full = html; UI.dialogActive = true; UI._typing = true; $('#dialog').classList.add('typing');
    // typewriter: reveal characters while preserving the highlight spans
    const tokens = []; const re = /(<span class="hl">|<\/span>|&[a-z#0-9]+;|.)/g; let m;
    while ((m = re.exec(html))) tokens.push(m[0]);
    let i = 0, out = '', open = false, n = 0;
    dt.innerHTML = '';
    clearInterval(UI._timer);
    UI._timer = setInterval(() => {
      for (let step = 0; step < 2 && i < tokens.length; step++) {
        const tk = tokens[i++];
        if (tk === '<span class="hl">') { open = true; out += tk; continue; }
        if (tk === '</span>') { open = false; out += tk; continue; }
        out += tk; n++;
        if (n % 3 === 0 && tk.trim()) Snd.blip(sp.pitch || 1);
      }
      dt.innerHTML = out + (open ? '</span>' : '');
      if (i >= tokens.length) UI._finishTyping();
    }, 16);
    UI._resolve = () => { UI.busy--; res(); };
  });
}
// Show a line without waiting (used under a docked menu)
function showLine(who, text, mood, opts = {}) {
  const { dt, html } = showDialog(who, text, mood, opts);
  UI._full = html; dt.innerHTML = html; $('#dialog').classList.remove('typing');
}
function hideDialog() { $('#dialog').classList.add('hidden'); }

// choose(options, {title, dock, cancel}) -> index (or -1 on cancel)
// option: string | {label, sub, disabled, tag, tagCls}
function choose(options, o = {}) {
  return new Promise(res => {
    UI.busy++; UI.menuOpen = true; hideTooltip();
    const m = $('#menu'); m.innerHTML = ''; m.classList.remove('hidden'); m.classList.toggle('dock', !!o.dock);
    if (o.title) { const t = document.createElement('div'); t.className = 'mtitle'; t.innerHTML = esc(UI.format(o.title)); m.appendChild(t); }
    const btns = [];
    options.forEach((op, i) => {
      if (typeof op === 'string') op = { label: op };
      const b = document.createElement('button'); b.className = 'opt';
      b.innerHTML = (o.dock ? '' : `<span class="key">${i < 9 ? i + 1 : ''}</span>`) + (op.tag ? `<span class="tag ${op.tagCls || ''}">${esc(op.tag)}</span>` : '') + esc(UI.format(op.label)) + (op.sub ? `<span class="sub">${esc(UI.format(op.sub))}</span>` : '');
      if (op.disabled) b.disabled = true;
      b.onclick = ev => { ev.stopPropagation(); if (!op.disabled) done(i); };
      m.appendChild(b); btns.push({ b, op });
    });
    let sel = btns.findIndex(x => !x.op.disabled);
    const mark = () => btns.forEach((x, j) => x.b.classList.toggle('sel', j === sel));
    if (!('ontouchstart' in window)) mark();
    function done(i) { Snd.select(); m.classList.add('hidden'); UI.menuOpen = false; UI.busy--; UI.menuKey = () => { }; res(i); }
    UI.menuKey = (k, e) => {
      const n = parseInt(k, 10);
      if (n >= 1 && n <= btns.length && !btns[n - 1].op.disabled) { e.preventDefault(); return done(n - 1); }
      const step = (o.dock ? (k === 'arrowright' || k === 'arrowdown') : k === 'arrowdown') ? 1 : (o.dock ? (k === 'arrowleft' || k === 'arrowup') : k === 'arrowup') ? -1 : 0;
      if (step) { e.preventDefault(); let j = sel; for (let c = 0; c < btns.length; c++) { j = (j + step + btns.length) % btns.length; if (!btns[j].op.disabled) break; } sel = j; mark(); Snd.blip(); }
      if ((k === 'enter' || k === ' ') && sel >= 0) { e.preventDefault(); done(sel); }
      if (k === 'escape' && o.cancel !== undefined) { e.preventDefault(); done(o.cancel); }
    };
  });
}

// Generic modal panel. build(el, close) fills it. Returns a promise resolved by close(value).
function panel(build, o = {}) {
  return new Promise(res => {
    UI.busy++; UI.panelOpen = true; hideTooltip();
    const p = $('#panel'); p.innerHTML = ''; p.classList.remove('hidden'); p.scrollTop = 0;
    const close = v => { p.classList.add('hidden'); p.innerHTML = ''; UI.panelOpen = false; UI.busy--; UI.panelEsc = null; res(v); };
    UI.panelEsc = o.noEsc ? null : () => close(null);
    build(p, close);
  });
}

function toast(text, cls = '') {
  const t = document.createElement('div'); t.className = 'toast ' + cls; t.textContent = text;
  const box = $('#toasts'); box.appendChild(t); while (box.children.length > 4) box.firstChild.remove(); setTimeout(() => t.remove(), 2600);
}
async function banner(text, cls = '', sub = '', ms = 1300) {
  const b = $('#banner'); b.className = cls; b.innerHTML = esc(text) + (sub ? `<small>${esc(sub)}</small>` : '');
  await sleep(ms); b.className = 'hidden';
}
