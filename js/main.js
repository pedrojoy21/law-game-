'use strict';
// =====================================================================
//  MAIN: save data, office hub, the case pipeline, trial, career
// =====================================================================
const SAVE_KEY = 'pixelcounsel_save_v1';
let S = null;   // persistent save
let K = null;   // current case runtime state

const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
const pick = a => a[Math.floor(Math.random() * a.length)];
const arr = v => v == null ? [] : (Array.isArray(v) ? v : [v]);

function newSave(name, look) {
  return { v: 1, name, look, money: 500, rep: 0, rank: 0, sp: 1, skills: { inv: 0, per: 0, crs: 0, neg: 0 }, owned: {}, cases: {}, studied: false, week: 1, tut: {}, ended: false, stats: { won: 0, lost: 0, deals: 0, earned: 0, small: 0 } };
}
function persist() { try { if (S) localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { } }
function loadSave() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); return s && s.v === 1 ? s : null; } catch (e) { return null; } }

// ---------- Speakers & text ----------
UI.speaker = who => {
  if (who === 'you') return { name: S ? S.name : 'You', look: S && S.look, bg: '#24425a' };
  if (who === 'narr' || !who) return { name: '' };
  if (who === 'mentor') return MENTOR;
  if (who === 'fore') return { name: 'Jury Foreperson', look: K && K.foreLook, bg: '#2b3a2b' };
  if (K && K.c.people[who]) return K.c.people[who];
  return { name: who };
};
UI.format = s => String(s).replace(/\{name\}/g, S ? S.name : 'Counselor');
async function lines(a) { if (!a) return; for (const l of a) await say(l[0], l[1], l[2]); hideDialog(); }
async function sayH(who, text, mood) { await say(who, text, mood); hideDialog(); }

// ---------- HUD ----------
function hud(mode) {
  const h = $('#hud');
  if (!S) { h.classList.add('hidden'); return; }
  h.classList.remove('hidden');
  const left = $('#hudleft');
  if (mode === 'trial') { left.classList.add('hidden'); return; }
  left.classList.remove('hidden');
  if (mode === 'case' && K) {
    left.innerHTML = `<div class="rank">${esc(K.c.title)}</div><div>${esc(K.c.area)}</div>` + (K.days != null ? `<div class="rep">DAYS LEFT: ${K.days}</div>` : '');
    return;
  }
  const next = RANKS[S.rank + 1];
  left.innerHTML = `<div>${esc(S.name)}</div><div class="rank">${RANKS[S.rank].name}</div><div class="money">${fmt(S.money)}</div><div class="rep">REP ${S.rep}${next ? ' / ' + next.rep : ''}</div>`;
}
function meter() {
  if (!K) return;
  $('#meterfill').style.width = clamp(K.p, 0, 100) + '%';
  $('#meterline').style.left = K.c.threshold + '%';
  $('#hearts').textContent = '♥'.repeat(Math.max(0, K.hearts)) + '♡'.repeat(Math.max(0, K.maxHearts - K.hearts));
}
$('#btnMute').onclick = e => { e.stopPropagation(); Snd.muted = !Snd.muted; $('#btnMute').textContent = Snd.muted ? 'SND:OFF' : 'SND:ON'; };
$('#btnEvidence').onclick = e => { e.stopPropagation(); if (K && !UI.panelOpen) caseFile(); };
UI.onCaseFile = () => { if (K && !UI.panelOpen) { caseFile(); return true; } return false; };

// ---------- Helpers ----------
function has(x) { return !x || (K && (K.ev.has(x) || K.flags.has(x))); }
function addFlag(f) { if (f && K) K.flags.add(f); }
function gainEv(id) {
  if (!K || K.ev.has(id)) return;
  K.ev.add(id); Snd.item();
  toast('EVIDENCE ADDED: ' + K.c.evidence[id].name, 'gold');
}
async function sway(n, why) {
  if (!K || !n) return;
  K.p = clamp(K.p + n, 0, 100); meter();
  toast(`JURY ${n > 0 ? '+' : ''}${n}${why ? ' — ' + why : ''}`, n > 0 ? '' : 'bad');
}
function invDays() { return 3 + S.skills.inv + (S.owned.notes ? 1 : 0) + (S.owned.para ? 1 : 0); }
function sideWord(c) { return c.side === 'plaintiff' ? 'plaintiff' : 'defense'; }
function sideText(c) { return c.kind === 'criminal' ? 'Defense' : (c.side === 'plaintiff' ? 'Plaintiff' : 'Defense'); }

function evCanvas(icon) { const cvs = document.createElement('canvas'); cvs.width = 16; cvs.height = 16; drawIcon(cvs.getContext('2d'), icon); return cvs; }
function evidencePanel(pickMode, title) {
  return panel((p, close) => {
    p.innerHTML = `<button class="btn close">${pickMode ? 'CANCEL' : 'CLOSE'}</button><h2>${esc(title || (pickMode ? 'Present which evidence?' : 'Case File: ' + K.c.title))}</h2>`;
    p.querySelector('.close').onclick = () => close(null);
    if (!pickMode) { const sm = document.createElement('p'); sm.className = 'muted'; sm.textContent = K.c.summary; p.appendChild(sm); }
    const g = document.createElement('div'); g.className = 'evgrid'; p.appendChild(g);
    [...K.ev].forEach(id => {
      const e = K.c.evidence[id]; const d = document.createElement('div'); d.className = 'ev' + (pickMode ? ' pick' : '');
      d.appendChild(evCanvas(e.icon));
      const t = document.createElement('div'); t.innerHTML = `<b>${esc(e.name)}</b><span>${esc(e.desc)}</span>`; d.appendChild(t);
      if (pickMode) d.onclick = () => { Snd.select(); close(id); };
      g.appendChild(d);
    });
    if (!K.ev.size) g.innerHTML = '<p class="muted">No evidence yet.</p>';
  });
}
const caseFile = () => evidencePanel(false);
const pickEvidence = () => evidencePanel(true);

// =====================================================================
//  OFFICE HUB
// =====================================================================
const office = {
  px: 160, py: 140, dir: 'down', walking: false, frame: 0, target: null, pending: null, control: false, npcs: [], near: null, stuck: 0,
  place(x, y, dir) { this.px = x; this.py = y; this.dir = dir || 'down'; this.target = null; this.pending = null; },
  blocked(x, y) { return OFFICE_SOLIDS.some(([sx, sy, sw, sh]) => x + 4 > sx && x - 4 < sx + sw && y > sy && y - 3 < sy + sh); },
  update(dt) {
    if (!this.control || UI.busy) { this.walking = false; if (!this.control) setPrompt(null); return; }
    let vx = 0, vy = 0;
    if (keys['arrowleft'] || keys['a']) vx -= 1; if (keys['arrowright'] || keys['d']) vx += 1;
    if (keys['arrowup'] || keys['w']) vy -= 1; if (keys['arrowdown'] || keys['s']) vy += 1;
    if (vx || vy) { this.target = null; this.pending = null; }
    else if (this.target) {
      const dx = this.target[0] - this.px, dy = this.target[1] - this.py, d = Math.hypot(dx, dy);
      if (d < 2 || this.stuck > 0.35) { this.target = null; this.stuck = 0; if (this.pending) { const o = this.pending; this.pending = null; this.face(o); this.interact(o); } }
      else { vx = dx / d; vy = dy / d; }
    }
    if (vx || vy) {
      const n = Math.hypot(vx, vy), sp = 75 * dt, ox = this.px, oy = this.py;
      vx /= n; vy /= n;
      const nx = clamp(this.px + vx * sp, 8, 312), ny = clamp(this.py + vy * sp, 72, 174);
      if (!this.blocked(nx, this.py)) this.px = nx;
      if (!this.blocked(this.px, ny)) this.py = ny;
      if (Math.hypot(this.px - ox, this.py - oy) < sp * 0.3) this.stuck += dt; else this.stuck = 0;
      this.walking = true; const f0 = Math.floor(this.frame); this.frame += dt * 7; if (Math.floor(this.frame) !== f0) Snd.step();
      this.dir = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'left' : 'right') : (vy < 0 ? 'up' : 'down');
    } else this.walking = false;
    this.near = OFFICE_OBJS.find(o => Math.hypot(o.spot[0] - this.px, o.spot[1] - this.py) < 18) || null;
    setPrompt(this.near ? `[E] ${this.near.label}` : 'WASD / ARROWS / CLICK TO MOVE');
  },
  face(o) { const [x, y, w, h] = o.rect; const cx = x + w / 2, cy = y + h; const dx = cx - this.px, dy = cy - this.py; this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); },
  draw(c, t) {
    drawOffice(c, t, S);
    const actors = this.npcs.map(n => ({ y: n.y, f: () => drawPerson(c, n.x - 6, n.y - 24, n.look, { dir: n.dir }) }));
    if (S) actors.push({ y: this.py, f: () => drawPerson(c, Math.round(this.px - 6), Math.round(this.py - 24), S.look, { dir: this.dir, walking: this.walking, frame: this.frame }) });
    actors.sort((a, b) => a.y - b.y).forEach(a => a.f());
    if (this.control && this.near) { const [x, y, w] = this.near.rect; const b = Math.floor(t * 3) % 2; R(c, x + w / 2 - 2, y - 7 + b, 5, 2, '#ffd166'); R(c, x + w / 2 - 1, y - 5 + b, 3, 2, '#ffd166'); R(c, x + w / 2, y - 3 + b, 1, 1, '#ffd166'); }
  },
  objAt(x, y) { return OFFICE_OBJS.find(o => { const [ox, oy, w, h] = o.rect; return x >= ox && x <= ox + w && y >= oy && y <= oy + h; }); },
  click(x, y) {
    if (!this.control) return;
    const o = this.objAt(x, y);
    if (o) { if (Math.hypot(o.spot[0] - this.px, o.spot[1] - this.py) < 18) { this.face(o); this.interact(o); } else { this.target = o.spot.slice(); this.pending = o; } }
    else { this.target = [x, clamp(y, 72, 174)]; this.pending = null; }
  },
  hover(x, y) { if (!this.control) return null; const o = this.objAt(x, y); return o ? o.label : null; },
  key(k) { if (this.control && (k === 'e' || k === ' ' || k === 'enter') && this.near) { this.face(this.near); this.interact(this.near); } },
  async interact(o) {
    if (!this.control || UI.busy) return;
    this.control = false; setPrompt(null); this.walking = false;
    try { await HUB[o.id](); } catch (e) { console.error(e); }
    hideDialog(); persist(); hud();
    if (!K) this.control = true;
  },
};

const COFFEE = [
  'The coffee machine gurgles ominously, then produces something technically drinkable.',
  'You pour a cup. It tastes like ambition and burnt beans.',
  'Fun fact: "objection, Your Honor, I need more coffee" is not a valid objection.',
  'A sticky note on the machine: "Whoever keeps taking the last cup — I WILL sue."',
  'You sip the coffee and feel 4% more persuasive. (Not really.)',
];
const MENTOR_TIPS = [
  'Interview your client thoroughly. They often know where the evidence is hiding — and some clues won\'t make sense until they tell you.',
  'Investigation days are precious. Visit the places that matter most first.',
  'A motion with nothing behind it just annoys the judge. File motions you can back up.',
  'On cross-examination, press when something sounds vague. Present evidence when something is flat-out wrong.',
  'Hearsay is repeating what someone else said. Speculation is guessing. Relevance is... well, whether it matters.',
  'In closing, only argue what you actually proved in court. Juries remember.',
  'A plea deal or settlement is a sure thing. A trial is a gamble. Know your case\'s strength before you roll the dice.',
  'Lost a case? File an appeal from the Case Board. You\'ll get another shot.',
  'Small claims cases are quick reputation. Every great lawyer started small.',
];

const HUB = {
  async board() {
    const avail = CASES.filter(c => c.rank <= S.rank);
    const locked = CASES.filter(c => c.rank > S.rank);
    const opts = avail.map(c => {
      const st = S.cases[c.id]; let tag = 'NEW', cls = 'gold';
      if (st) { if (st.res === 'won') { tag = 'WON'; cls = ''; } else if (st.res === 'deal') { tag = 'SETTLED'; cls = ''; } else { tag = 'APPEAL'; cls = 'red'; } }
      return { label: c.title, sub: `${c.kind === 'criminal' ? 'Criminal' : 'Civil'} · ${c.area} · You: ${sideText(c)}`, tag, tagCls: cls, disabled: st && st.res !== 'lost' };
    });
    if (locked.length) opts.push({ label: `??? (${locked.length} more case${locked.length > 1 ? 's' : ''})`, sub: `Unlocks at ${RANKS[locked[0].rank].name}`, disabled: true });
    opts.push({ label: 'Small Claims Court', sub: 'A quick one-hearing case. Small fee, small reputation. Always available.', tag: 'QUICK' });
    opts.push({ label: 'Close' });
    const i = await choose(opts, { title: 'CASE BOARD — pick your next case', cancel: opts.length - 1 });
    if (i < avail.length) {
      const c = avail[i], appeal = !!S.cases[c.id];
      const pay = c.side === 'plaintiff' ? `Contingency: 1/3 of any award (claim: ${fmt(c.damages)})` : `Fee: ${fmt(c.fee)}`;
      await say('narr', `**${c.title}** — ${c.summary}`);
      const j = await choose([{ label: appeal ? 'File the appeal' : 'Take the case', sub: `${pay} · Reputation: +${c.rep}${appeal ? ' (appeals pay 75%)' : ''}` }, 'Not yet'], { title: c.court, cancel: 1 });
      hideDialog();
      if (j === 0) await runCase(c, appeal);
    } else if (opts[i].label === 'Small Claims Court') {
      await runCase(makeSmallClaim(), false);
    }
  },
  async computer() {
    const i = await choose(['Career summary', 'Read email', 'Save game', 'How to play', 'Delete save & restart', 'Close'], { title: 'COMPUTER', cancel: 5 });
    if (i === 0) await careerPanel();
    if (i === 1) { await say('mentor', pick(MENTOR_TIPS)); hideDialog(); }
    if (i === 2) { persist(); toast('GAME SAVED'); }
    if (i === 3) await helpPanel();
    if (i === 4) {
      const j = await choose(['Yes, delete everything', 'No!'], { title: 'Really delete your save? This cannot be undone.', cancel: 1 });
      if (j === 0) { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } location.reload(); }
    }
  },
  async shelf() {
    while (true) {
      const i = await choose([
        { label: 'Study for the bar', sub: S.studied ? 'Already studied. Come back after your next case.' : '3 law questions. +5 rep each, +1 skill point for a perfect score.', disabled: S.studied },
        { label: `Train skills (${S.sp} point${S.sp === 1 ? '' : 's'})`, sub: 'Spend skill points from promotions and studying.' },
        'Close'], { title: 'LAW LIBRARY', cancel: 2 });
      if (i === 0) await study();
      else if (i === 1) await skillsPanel();
      else break;
    }
  },
  async wardrobe() {
    const i = await choose(['Shop for upgrades', 'Change your look', 'Close'], { title: 'WARDROBE', cancel: 2 });
    if (i === 0) await shopPanel();
    if (i === 1) { const look = await creator(true); if (look) { S.look = look.look; toast('LOOKING SHARP'); } }
  },
  async trophy() {
    const done = CASES.filter(c => S.cases[c.id]);
    if (!done.length && !S.stats.small) { await sayH('narr', 'An empty trophy case. For now.'); return; }
    await panel((p, close) => {
      p.innerHTML = `<button class="btn close">CLOSE</button><h2>Trophy Case</h2>` +
        done.map(c => { const r = S.cases[c.id].res; return `<div class="row"><span class="${r === 'won' ? 'good' : r === 'deal' ? 'gold' : 'bad'}">${r === 'won' ? '★ WON' : r === 'deal' ? '◆ SETTLED' : '✖ LOST'}</span> <span>${esc(c.title)}</span> <span class="muted">— ${esc(c.area)}</span></div>`; }).join('') +
        `<h3>Small claims won: ${S.stats.small}</h3>`;
      p.querySelector('.close').onclick = () => close();
    });
  },
  async coffee() { await sayH('narr', pick(COFFEE)); },
};

async function careerPanel() {
  const st = S.stats, next = RANKS[S.rank + 1];
  await panel((p, close) => {
    p.innerHTML = `<button class="btn close">CLOSE</button><h2>${esc(S.name)} — ${RANKS[S.rank].name}</h2>
      <div class="row">Money: <span class="good">${fmt(S.money)}</span></div>
      <div class="row">Reputation: <span class="gold">${S.rep}</span>${next ? ` <span class="muted">(${next.rep - S.rep} more for ${next.name})</span>` : ' <span class="gold">(top of the ladder!)</span>'}</div>
      <div class="row">Cases won: <span class="good">${st.won}</span> · lost: <span class="bad">${st.lost}</span> · deals/settlements: <span class="gold">${st.deals}</span> · small claims: ${st.small}</div>
      <div class="row">Total earned: ${fmt(st.earned)} · Weeks in practice: ${S.week}</div>
      <h3>Career ladder</h3>` + RANKS.map((r, i) => `<div class="row"><span class="${i <= S.rank ? 'good' : 'muted'}">${i <= S.rank ? '✔' : '·'} ${r.name}</span> <span class="muted">${r.rep} rep</span></div>`).join('') +
      `<h3>Skills</h3>` + Object.entries(SKILLS).map(([k, v]) => `<div class="row">${v.name}: <span class="gold">${'■'.repeat(S.skills[k])}${'□'.repeat(3 - S.skills[k])}</span></div>`).join('');
    p.querySelector('.close').onclick = () => close();
  });
}
async function helpPanel() {
  await panel((p, close) => {
    p.innerHTML = `<button class="btn close">CLOSE</button><h2>How to Play</h2>
    <p><b class="gold">The office.</b> Walk with WASD/arrow keys or click. Press E (or click) to use things. The <b class="gold">Case Board</b> has your cases; the <b class="gold">Law Library</b> lets you study and train; the <b class="gold">Wardrobe</b> sells upgrades.</p>
    <p><b class="gold">Every case runs the full process:</b></p>
    <p>1. <b>Client interview</b> — ask questions. Clients reveal facts, hand over evidence, and point you to leads.<br>
    2. <b>Investigation</b> — you have limited days. Visit locations and click sparkling objects and people to find evidence.<br>
    3. <b>Pretrial motions</b> — file up to two motions. Backed-up motions can win evidence or exclude the other side's. Baseless ones annoy the judge.<br>
    4. <b>Plea deal / settlement</b> — take a guaranteed (smaller) outcome, counter-offer, or go to trial.<br>
    5. <b>Trial</b> — jury selection, opening statement, cross-examining opposing witnesses, questioning your own, closing arguments.<br>
    6. <b>Verdict</b> — if the jury meter ends past the gold line, you win.</p>
    <p><b class="gold">Cross-examination:</b> step through statements with PREV/NEXT. <b>PRESS</b> for details. <b>PRESENT</b> evidence that contradicts a statement. <b>OBJECT</b> to hearsay, speculation, irrelevant claims or character attacks. Mistakes cost the judge's patience (♥).</p>
    <p><b class="gold">Direct examination:</b> ask open questions. Leading questions ("isn't it true...") get objected to. Off-topic ones waste the jury's time. Some answers only work if you prepared during investigation.</p>
    <p><b class="gold">Career:</b> reputation earns promotions from Law Clerk to Name Partner, unlocking bigger cases. Press C any time during a case to open the case file.</p>`;
    p.querySelector('.close').onclick = () => close();
  });
}
async function study() {
  const qs = shuffle(QUIZ).slice(0, 3); let right = 0;
  for (let n = 0; n < qs.length; n++) {
    const q = qs[n]; const order = shuffle(q.a.map((a, i) => i));
    const i = await choose(order.map(k => q.a[k]), { title: `Question ${n + 1}/3: ${q.q}` });
    if (order[i] === q.c) { right++; Snd.good(); S.rep += 5; toast('CORRECT! +5 REP'); await sayH('mentor', 'Correct. ' + q.why, 'happy'); }
    else { Snd.bad(); await sayH('mentor', `Not quite. The answer is "${q.a[q.c]}". ${q.why}`); }
  }
  S.studied = true;
  if (right === 3) { S.sp++; Snd.fanfare(); toast('PERFECT SCORE! +1 SKILL POINT', 'gold'); }
  persist(); hud(); await checkRank();
}
async function skillsPanel() {
  await panel((p, close) => {
    const render = () => {
      p.innerHTML = `<button class="btn close">DONE</button><h2>Train Skills — ${S.sp} point${S.sp === 1 ? '' : 's'}</h2>` +
        Object.entries(SKILLS).map(([k, v]) => `<div class="skillrow"><div class="nm"><b class="gold">${v.name}</b><br><span class="muted">${v.desc}</span></div><div class="pips">${'■'.repeat(S.skills[k])}${'□'.repeat(3 - S.skills[k])}</div><button class="btn" data-k="${k}" ${S.sp < 1 || S.skills[k] >= 3 ? 'disabled' : ''}>+ TRAIN</button></div>`).join('') +
        `<p class="muted">Earn skill points from promotions (+2) and perfect study sessions (+1).</p>`;
      p.querySelector('.close').onclick = () => close();
      p.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k; if (S.sp > 0 && S.skills[k] < 3) { S.sp--; S.skills[k]++; Snd.good(); persist(); render(); } });
    };
    render();
  });
}
async function shopPanel() {
  await panel((p, close) => {
    const render = () => {
      p.innerHTML = `<button class="btn close">DONE</button><h2>Upgrades — <span class="good">${fmt(S.money)}</span></h2>` +
        SHOP.map(it => `<div class="skillrow"><div class="nm"><b class="gold">${it.name}</b><br><span class="muted">${it.desc}</span></div><div class="pips">${fmt(it.price)}</div>${S.owned[it.id] ? '<span class="good">OWNED</span>' : `<button class="btn" data-id="${it.id}" ${S.money < it.price ? 'disabled' : ''}>BUY</button>`}</div>`).join('');
      p.querySelector('.close').onclick = () => close();
      p.querySelectorAll('[data-id]').forEach(b => b.onclick = () => { const it = SHOP.find(x => x.id === b.dataset.id); if (S.money >= it.price) { S.money -= it.price; S.owned[it.id] = true; Snd.fanfare(); persist(); hud(); render(); } });
    };
    render();
  });
}

const PROMO = [null,
  'Junior Associate! You\'ve earned it. Tougher cases are on the board now — a DUI and a housing court fight.',
  'Associate. Contract disputes and violent felonies are yours now. Keep your wits about you.',
  'Senior Associate. Employment and family court. Real lives on the line — children\'s, too.',
  'Partner. The biggest cases this firm takes: product liability against a corporation... and a murder trial.',
  null];
async function checkRank() {
  while (S.rank < RANKS.length - 1 && S.rep >= RANKS[S.rank + 1].rep) {
    S.rank++; S.sp += 2; persist(); hud();
    Snd.fanfare(); flash('#ffd166', 0.3);
    await banner('PROMOTED!', 'green', RANKS[S.rank].name + '  ·  +2 skill points', 2000);
    if (PROMO[S.rank]) await sayH('mentor', PROMO[S.rank], 'happy');
  }
  if (S.rank === RANKS.length - 1 && !S.ended) {
    S.ended = true; persist();
    office.npcs = [{ look: MENTOR.look, x: 150, y: 120, dir: 'right' }];
    await lines([
      ['mentor', '{name}. Do you remember the day you walked in here? Nervous. Tie crooked.', 'happy'],
      ['mentor', 'Look at you now. Every client who walked through that door got a real fight.'],
      ['mentor', 'So as of today, the sign on the door changes. **Steele & {name}.** Name Partner.', 'happy'],
    ]);
    Snd.fanfare(); await banner('NAME PARTNER', 'green', 'You made it to the top of the firm!', 2600);
    await lines([['mentor', 'Don\'t let it go to your head. There are always more people who need a good lawyer.'], ['narr', 'Thanks for playing Pixel Counsel! Keep taking cases, small claims, and appeals as long as you like.']]);
    office.npcs = [];
  }
}

// =====================================================================
//  CASE PIPELINE
// =====================================================================
async function runCase(c, appeal) {
  K = { c, ev: new Set(c.start || []), flags: new Set(), p: 40, hearts: 3, maxHearts: 3, mb: 0, appeal, seen: new Set(), days: null, dealAmount: 0, foreLook: JUROR_LOOKS() };
  K.maxHearts = K.hearts = 3 + S.skills.crs;
  office.control = false; setPrompt(null);
  $('#btnEvidence').classList.remove('hidden');
  hud('case');
  let res;
  if (!c.quick) {
    setScene(office);
    office.npcs = [{ look: c.people.client.look, x: 150, y: 124, dir: 'right' }];
    office.place(176, 124, 'left');
    Snd.gavel();
    await banner(c.title.toUpperCase(), 'blue', `${c.kind === 'criminal' ? 'Criminal' : 'Civil'} — ${c.area}`, 1600);
    if (appeal) await sayH('narr', 'The appeals court agreed the case deserves another look. A new trial — a fresh chance to get it right.');
    await lines(c.intro);
    await interview();
    office.npcs = [];
    await investigate();
    await pretrial();
    if (await offerStage()) res = 'deal';
  }
  if (!res) res = (await trial()) ? 'won' : 'lost';
  await finish(res);
}

async function interview() {
  const c = K.c, asked = new Set();
  if (!S.tut.interview) { S.tut.interview = 1; await sayH('mentor', 'Tip: ask your client everything. Some evidence and leads only show up if you ask the right question.'); }
  while (true) {
    const opts = c.interview.map((q, i) => ({ label: q.q, disabled: asked.has(i), tag: asked.has(i) ? 'ASKED' : '' }));
    opts.push({ label: 'That\'s all I need for now.', sub: asked.size < c.interview.length ? 'You haven\'t asked everything yet.' : '' });
    const i = await choose(opts, { title: 'Interview: ' + c.people.client.name });
    if (i === c.interview.length) break;
    asked.add(i); const q = c.interview[i];
    await say('you', q.q); await lines(q.a);
    if (q.ev) gainEv(q.ev); if (q.flag) addFlag(q.flag);
  }
  await sayH('you', 'Okay. Leave it with me. I\'m going to start digging.');
}

async function investigate() {
  const c = K.c;
  K.days = invDays(); hud('case');
  await sayH('narr', `INVESTIGATION. You have **${K.days} days** before the pretrial hearing. Each location visit takes one day.`);
  while (K.days > 0) {
    const opts = c.locations.map(l => {
      const left = l.spots.filter((h, j) => !K.seen.has(l.id + ':' + j)).length;
      const visited = K.visited && K.visited.has(l.id);
      return { label: l.name, tag: S.owned.para ? (left ? `${left} CLUE${left > 1 ? 'S' : ''} LEFT` : 'DONE') : (visited ? 'VISITED' : ''), tagCls: S.owned.para && left ? 'gold' : '' };
    });
    opts.push({ label: 'Review the case file' }, { label: 'Wrap up the investigation', sub: 'Head to the pretrial hearing now.' });
    const i = await choose(opts, { title: `INVESTIGATION — ${K.days} day${K.days > 1 ? 's' : ''} left` });
    if (i === c.locations.length) { await caseFile(); continue; }
    if (i === c.locations.length + 1) break;
    const loc = c.locations[i];
    K.days--; (K.visited = K.visited || new Set()).add(loc.id); hud('case');
    await explore(loc);
  }
  K.days = null; hud('case');
  setScene(office);
}

function explore(loc) {
  return new Promise(async resolve => {
    let busy = true;
    const keyOf = h => loc.id + ':' + loc.spots.indexOf(h);
    const hit = (x, y) => { for (let j = loc.spots.length - 1; j >= 0; j--) { const h = loc.spots[j], [rx, ry, rw, rh] = propRect(h); if (x >= rx - 3 && x <= rx + rw + 3 && y >= ry - 3 && y <= ry + rh + 3) return h; } return null; };
    const sc = {
      draw(c, t) {
        (LOC_BG[loc.bg] || LOC_BG.corporate)(c, t);
        loc.spots.forEach(h => drawProp(c, h, t));
        loc.spots.forEach(h => { if (!K.seen.has(keyOf(h))) { const [x, y, w] = propRect(h); sparkle(c, x + w / 2, y - 5, t); } });
        R(c, 0, 0, 320, 11, 'rgba(0,0,0,0.55)'); c.fillStyle = '#ffd166'; c.font = '8px "Press Start 2P", monospace'; c.textAlign = 'center'; c.fillText(loc.name.toUpperCase(), 160, 9); c.textAlign = 'left';
      },
      hover(x, y) { if (busy) return null; const h = hit(x, y); return h ? h.label : null; },
      async click(x, y) {
        if (busy) return; const h = hit(x, y); if (!h) return;
        busy = true; setPrompt(null);
        if (h.needs && !has(h.needs)) await lines(h.alt || [['narr', 'Nothing useful here... yet.']]);
        else { await lines(h.text); if (h.ev) gainEv(h.ev); addFlag(h.flag); addFlag(h.also); K.seen.add(keyOf(h)); }
        busy = false; setPrompt('CLICK OBJECTS & PEOPLE · LEAVE WHEN DONE');
      },
      key(k) { if (k === 'escape' || k === 'l') leave(); },
    };
    const btn = $('#btnLeave');
    const leave = () => { if (busy) return; busy = true; btn.classList.add('hidden'); btn.onclick = null; setPrompt(null); resolve(); };
    btn.onclick = e => { e.stopPropagation(); leave(); };
    setScene(sc);
    await lines(loc.intro);
    busy = false; btn.classList.remove('hidden');
    setPrompt('CLICK OBJECTS & PEOPLE · LEAVE WHEN DONE');
  });
}

function courtScene(st) { return { draw: (c, t) => drawCourt(c, t, st) }; }

async function pretrial() {
  const c = K.c;
  const st = { judge: c.people.judge.look, you: S.look, client: c.people.client.look, opp: c.people.opp.look, gavel: true };
  setScene(courtScene(st));
  Snd.gavel();
  await banner('PRETRIAL HEARING', 'blue', c.court, 1500);
  await say('judge', 'We\'re here for pretrial motions. Counsel, anything to file before trial?');
  if (!S.tut.motions) { S.tut.motions = 1; await say('mentor', 'Motions are requests to the judge. Granted motions can win you evidence or strengthen your position. But a motion with nothing behind it just irritates the judge.'); }
  let filed = 0; const max = 2, used = new Set();
  while (filed < max) {
    const opts = c.motions.map((m, i) => ({ label: m.name, sub: m.desc, disabled: used.has(i) }));
    opts.push({ label: filed ? 'No further motions, Your Honor.' : 'No motions, Your Honor.' });
    const i = await choose(opts, { title: `PRETRIAL MOTIONS — you may file ${max - filed} more` });
    if (i === c.motions.length) break;
    used.add(i); filed++;
    const m = c.motions[i];
    await say('you', `Your Honor, the ${sideWord(c)} files a ${m.name}.`);
    const ok = m.always || (m.needs && has(m.needs));
    if (ok) {
      Snd.gavel(); shake(2, 0.2); await banner('GRANTED', 'green', '', 1000);
      await lines(m.win); if (m.gives) gainEv(m.gives); addFlag(m.setFlag); K.mb += m.bonus || 0;
      if (m.bonus) toast(`CASE STRENGTH +${m.bonus}`);
    } else {
      Snd.bad(); await banner('DENIED', 'red', '', 1000);
      await lines(m.lose); K.mb -= 2; toast('CASE STRENGTH -2 — the judge is unimpressed', 'bad');
    }
  }
  await sayH('judge', 'Very well. We\'ll proceed toward trial.');
}

function strength() {
  const c = K.c; let key = 0;
  c.witnesses.forEach(w => (w.testimony || []).forEach(s => { if (arr(s.contra).some(id => K.ev.has(id))) key++; }));
  return clamp(38 + K.mb + key * 5 + S.skills.per * 3 + (S.owned.suit1 ? 3 : 0) + (S.owned.suit2 ? 4 : 0), 0, 100);
}
function strengthLabel(s) { return s < 45 ? 'WEAK' : s < 58 ? 'SHAKY' : s < 70 ? 'SOLID' : 'VERY STRONG'; }

async function offerStage() {
  const c = K.c, s = strength(), plaintiff = c.side === 'plaintiff';
  let amount = plaintiff ? Math.round(c.damages * clamp(0.15 + s / 220, 0.15, 0.65) * (1 + 0.08 * S.skills.neg) / 1000) * 1000 : 0;
  let text = plaintiff ? `My client will settle for ${fmt(amount)}. Take it or leave it.` : c.offer.text;
  let countered = false;
  await say('opp', c.kind === 'criminal' ? 'Before we waste the jury\'s time, the People are prepared to offer a deal.' : 'Before trial, my client is willing to make an offer.');
  if (!S.tut.offer) { S.tut.offer = 1; await say('mentor', 'An offer is a guaranteed outcome — smaller pay and reputation, but no risk. A trial could win big... or lose everything. Your call.'); }
  while (true) {
    showLine('opp', text);
    const opts = [
      { label: plaintiff ? 'Accept the settlement' : 'Accept the deal', sub: plaintiff ? `Your 1/3 cut: ${fmt(amount / 3)} · Rep: +${Math.round(c.rep * 0.5)}` : `Fee: ${fmt(c.fee * 0.8)} · Rep: +${Math.round(c.rep * 0.4)}` },
      { label: 'Counter-offer', sub: countered ? 'You already countered.' : `Negotiation check (skill ${S.skills.neg}/3). If it fails, the offer is withdrawn.`, disabled: countered },
      { label: 'Reject — see you at trial', sub: `Your read on the case: ${strengthLabel(s)}` },
    ];
    const i = await choose(opts, { title: `OFFER ON THE TABLE — case strength: ${strengthLabel(s)}` });
    hideDialog();
    if (i === 0) {
      await say('you', 'We accept.');
      K.dealAmount = amount;
      return true;
    }
    if (i === 1) {
      countered = true;
      await say('you', pick(['We both know how this ends at trial. Do better.', 'My client deserves more than that, and you know it.', 'I\'ve seen your witness list. Try again.']));
      const chance = clamp(0.3 + 0.17 * S.skills.neg + (s - 50) / 150, 0.1, 0.95);
      if (Math.random() < chance) {
        Snd.good();
        if (plaintiff) { amount = Math.round(amount * 1.4 / 1000) * 1000; text = `...Fine. ${fmt(amount)}. Final offer.`; }
        else text = '...Fine. ' + c.offer.better;
        await say('opp', 'Hmm. Let me make a call.', 'sweat');
      } else {
        Snd.bad(); await sayH('opp', 'Then I guess we\'ll let the jury decide. Offer withdrawn.', 'angry');
        return false;
      }
      continue;
    }
    await sayH('you', 'We\'ll take our chances at trial.');
    return false;
  }
}

// =====================================================================
//  TRIAL
// =====================================================================
async function trial() {
  const c = K.c;
  const st = { judge: c.people.judge.look, you: S.look, client: c.people.client.look, opp: c.people.opp.look, jury: !!c.jury, jurors: [], gavel: true };
  if (c.quick) st.opp = null;
  setScene(courtScene(st));
  K.p = clamp(40 + S.skills.per * 3 + (S.owned.suit1 ? 3 : 0) + (S.owned.suit2 ? 4 : 0) + (c.quick ? 0 : K.mb), 0, 100);
  hud('trial'); $('#trialbar').classList.remove('hidden'); $('#trialbar .tlabel').textContent = c.jury ? 'JURY' : 'JUDGE'; meter();
  Snd.gavel(); shake(2, 0.2);
  await banner(c.quick ? 'SMALL CLAIMS' : 'TRIAL', '', c.court, 1500);
  if (!S.tut.meter) { S.tut.meter = 1; await say('mentor', `The bar at the top shows how convinced the ${c.jury ? 'jury' : 'judge'} is. Push it past the **gold line** by the end and you win. The hearts are the judge's patience.`); }
  await say('judge', `Court is now in session. ${c.quick ? 'This is small claims court — we keep things quick here.' : 'We\'ll hear the matter of ' + c.title + '.'}`);
  if (c.jury) await jurySelection(st);
  if (!c.quick) {
    if (c.side === 'plaintiff') { await opening(); await lines(c.oppOpening); }
    else { await lines(c.oppOpening); await opening(); }
  }
  let ws = c.witnesses.slice();
  if (c.side === 'plaintiff') ws.sort((a, b) => (a.side === 'own' ? -1 : 1) - (b.side === 'own' ? -1 : 1));
  for (const w of ws) { if (w.side === 'opp') await crossExam(w, st); else await directExam(w, st); }
  await closing();
  return await verdict(st);
}

async function jurySelection(st) {
  const c = K.c, idx = c.kind === 'criminal' ? 0 : (c.side === 'plaintiff' ? 1 : 2);
  const pool = shuffle(JURORS).slice(0, 6).map(j => Object.assign({}, j, { look: JUROR_LOOKS() }));
  st.jurors = pool.map(j => j.look);
  await say('judge', 'We\'ll begin jury selection. Each side may excuse jurors it believes can\'t be fair.');
  if (!S.tut.jury) { S.tut.jury = 1; await say('mentor', 'Read each juror\'s background. Excuse the two most likely to be biased against your client.'); }
  hideDialog();
  let strikes = 2; const struck = new Set();
  while (strikes > 0) {
    const opts = pool.map((j, k) => ({ label: `Juror ${k + 1}: ${j.job}`, sub: j.hint, disabled: struck.has(k), tag: struck.has(k) ? 'EXCUSED' : '' }));
    opts.push({ label: 'Accept the jury as is' });
    const i = await choose(opts, { title: `JURY SELECTION — ${strikes} strike${strikes > 1 ? 's' : ''} left` });
    if (i === pool.length) break;
    struck.add(i); strikes--; st.jurors[i] = null;
    await sayH('you', `The ${sideWord(c)} thanks and excuses Juror ${i + 1}.`);
  }
  let left = pool.map((j, k) => k).filter(k => !struck.has(k));
  const best = left.reduce((a, k) => pool[k].b[idx] > pool[a].b[idx] ? k : a, left[0]);
  if (pool[best].b[idx] > 1) { struck.add(best); st.jurors[best] = null; await sayH('opp', `The ${c.side === 'plaintiff' ? 'defense' : (c.kind === 'criminal' ? 'People' : 'plaintiff')} excuses Juror ${best + 1}, the ${pool[best].job.toLowerCase()}.`); }
  left = pool.map((j, k) => k).filter(k => !struck.has(k));
  const bias = left.reduce((s, k) => s + pool[k].b[idx], 0);
  struck.forEach(k => { st.jurors[k] = JUROR_LOOKS(); });
  await sayH('judge', 'Alternates will fill the empty seats. The jury is sworn in.');
  await sway(clamp(Math.round(bias * 0.8), -10, 10), 'Jury makeup');
}

async function opening() {
  const c = K.c;
  const opts = shuffle(c.opening);
  const i = await choose(opts.map(o => o.t), { title: 'OPENING STATEMENT — set the theme of your case' });
  await say('you', opts[i].t);
  const s = opts[i].s;
  if (s > 0) await sayH('narr', 'The jury leans in. That\'s a theme they can follow.');
  else if (s < 0) await sayH('narr', 'A few jurors frown. That came across badly.');
  else await sayH('narr', 'The jury listens politely, but you haven\'t given them much to hold onto.');
  await sway(s, 'Opening statement');
}

function judgeQuip() { return pick(['And how exactly does that contradict the witness, counsel?', 'I fail to see the connection, counsel.', 'Counsel, are you just guessing?', 'That has nothing to do with this statement.']); }
async function penalty() {
  K.hearts--; Snd.bad(); shake(3, 0.3); meter();
  await sway(-3, 'The judge is losing patience');
  if (K.hearts <= 0) {
    await sayH('judge', 'Counsel! One more stunt like that and I\'ll hold you in contempt of court!', 'angry');
    await sway(-8, 'Contempt warning');
    K.hearts = 1; meter();
  }
}

async function crossExam(w, st) {
  const c = K.c, P = c.people[w.who];
  st.witness = P.look;
  await lines(w.intro);
  await sayH('narr', `${P.name} gives damaging testimony against your client.`);
  await sway(-(w.damage || 10), `${P.name}'s testimony`);
  await say('judge', 'Your witness, counsel.');
  if (!S.tut.cross) { S.tut.cross = 1; await say('mentor', 'CROSS-EXAMINATION. Step through each statement. **PRESS** for details. **PRESENT** evidence when a statement is a lie. **OBJECT** when it\'s hearsay, speculation, irrelevant, or a character attack.'); }
  const T = w.testimony, ss = T.map(() => ({ done: false, struck: false }));
  let i = 0;
  while (true) {
    const s = T[i], x = ss[i];
    const flagged = S.skills.crs >= 2 && ((s.contra && arr(s.contra).length && !x.done) || (s.obj && !x.struck));
    showLine(w.who, s.t, x.done ? 'sweat' : 'normal', { cls: x.struck ? 'stricken' : x.done ? 'refuted' : '' });
    const a = await choose([
      { label: '◀ PREV', disabled: i === 0 }, { label: 'NEXT ▶', disabled: i === T.length - 1 },
      { label: 'PRESS' }, { label: 'PRESENT' }, { label: 'OBJECT' }, { label: 'END CROSS' },
    ], { dock: true, title: `STATEMENT ${i + 1} OF ${T.length}${x.struck ? ' (STRICKEN)' : x.done ? ' (REFUTED)' : ''}${flagged ? '  ⚑ SOMETHING\'S OFF' : ''}` });
    if (a === 0) { i--; continue; }
    if (a === 1) { i++; continue; }
    if (a === 5) {
      const j = await choose(['No further questions, Your Honor.', 'Wait — keep questioning.'], { title: 'End your cross-examination?', cancel: 1 });
      if (j === 0) { await say('you', 'No further questions, Your Honor.'); break; }
      continue;
    }
    if (x.struck) { await sayH('judge', 'That statement has been stricken from the record, counsel. Move on.'); continue; }
    if (a === 2) {
      await say('you', pick(['Could you elaborate on that?', 'Are you absolutely certain about that?', 'Tell the jury more about that.', 'What exactly do you mean?']));
      if (s.press) { await lines(s.press); if (s.reveal) gainEv(s.reveal); }
      else await sayH(w.who, pick(['I stand by what I said.', 'I already told you. That\'s what happened.', 'There\'s nothing more to say about it.']));
      continue;
    }
    if (a === 3) {
      const id = await pickEvidence();
      if (!id) continue;
      if (x.done) { await sayH('judge', 'You\'ve already made that point, counsel.'); continue; }
      if (arr(s.contra).includes(id)) {
        Snd.objection(); flash('#fff', 0.2); shake(4, 0.4);
        await banner('CONTRADICTION!', 'red', K.c.evidence[id].name, 1100);
        await lines(s.hit || [['you', `The ${K.c.evidence[id].name} says otherwise: ${K.c.evidence[id].desc}`], [w.who, 'I... well...', 'sweat']]);
        x.done = true; addFlag(s.flag); Snd.good();
        await sway(10, 'Testimony contradicted');
      } else {
        await say('you', `Your Honor, I present the ${K.c.evidence[id].name}!`);
        await sayH('judge', judgeQuip(), 'angry');
        await penalty();
      }
      continue;
    }
    if (a === 4) {
      if (x.done) { await sayH('judge', 'You\'ve already discredited that statement, counsel.'); continue; }
      const types = ['Hearsay', 'Speculation', 'Relevance', 'Improper Character'];
      const j = await choose([...types.map(t => ({ label: t, sub: OBJ_DESC[t] })), 'Never mind'], { title: 'OBJECT — on what grounds?', cancel: 4 });
      if (j === 4) continue;
      Snd.objection(); shake(3, 0.25);
      await banner('OBJECTION!', 'red', types[j], 900);
      await say('you', `Objection, Your Honor! ${OBJ_LINE[types[j]]}`);
      if (arr(s.obj).includes(types[j])) {
        Snd.gavel();
        await sayH('judge', 'Sustained. The jury will disregard that statement.');
        x.struck = true; await sway(5, 'Objection sustained');
      } else {
        Snd.gavel();
        await sayH('judge', 'Overruled.', 'angry');
        await penalty();
      }
      continue;
    }
  }
  hideDialog();
  if (w.breakdown && w.breakdown.needs.every(f => K.flags.has(f))) {
    Snd.objection(); flash('#ff5d73', 0.3); shake(6, 0.6);
    await banner('BREAKDOWN!', 'red', P.name + ' cracks under pressure', 1600);
    await lines(w.breakdown.lines);
    await sway(w.breakdown.bonus, 'The witness breaks down');
  }
  st.witness = null;
  await sayH('judge', 'The witness may step down.');
}
const OBJ_DESC = { Hearsay: 'Repeating what someone else said out of court.', Speculation: 'Guessing about facts or someone\'s thoughts.', Relevance: 'Has nothing to do with the case.', 'Improper Character': 'Attacking someone\'s character instead of the facts.' };
const OBJ_LINE = { Hearsay: 'That\'s hearsay!', Speculation: 'The witness is speculating!', Relevance: 'Relevance? That has nothing to do with this case!', 'Improper Character': 'That\'s improper character evidence!' };

async function directExam(w, st) {
  const c = K.c, P = c.people[w.who];
  st.witness = P.look;
  await lines(w.intro);
  if (!S.tut.direct) { S.tut.direct = 1; await say('mentor', 'DIRECT EXAMINATION. This is your witness. Ask open questions that let them tell the story. Avoid **leading** questions that suggest the answer, and anything off-topic.'); }
  hideDialog();
  for (let n = 0; n < w.rounds.length; n++) {
    const opts = shuffle(w.rounds[n]);
    const i = await choose(opts.map(o => o.q), { title: `DIRECT EXAMINATION of ${P.name} — question ${n + 1} of ${w.rounds.length}` });
    const o = opts[i];
    await say('you', o.q);
    if (o.k === 'lead') {
      Snd.objection(); shake(3, 0.25); await banner('OBJECTION!', 'red', 'Leading the witness', 900);
      await say('opp', 'Objection! Counsel is leading the witness.', 'angry');
      Snd.gavel(); await sayH('judge', 'Sustained. Ask a proper question, counsel.');
      await sway(-4, 'Leading question');
    } else if (o.k === 'off') {
      await say(w.who, pick(['Um... I guess? Is that important?', 'I\'m... not sure why that matters.', 'Uh. Sure?']), 'sweat');
      await sayH('judge', 'Where is this going, counsel? Move along.', 'angry');
      await sway(-3, 'Off-topic question');
    } else if (o.needs && !has(o.needs)) {
      await say(w.who, 'I... I\'m not really sure. I don\'t think I can say.', 'sweat');
      await sayH('narr', 'Your witness wasn\'t prepared for that one — you never laid the groundwork during the investigation.');
      await sway(-1, 'Unprepared witness');
    } else {
      await lines(o.r); await sway(5, 'Strong testimony');
    }
  }
  await say('you', 'Thank you. No further questions.');
  await sayH('opp', pick(['No questions for this witness.', 'Nothing from us, Your Honor.', 'We\'ll pass.']));
  st.witness = null;
}

async function closing() {
  const c = K.c, picks = c.closePicks || 3;
  await say('judge', 'We\'ll now hear closing arguments.');
  if (c.side !== 'plaintiff') await say('opp', c.kind === 'criminal' ? 'The evidence points one way: guilty. Do your duty.' : 'The facts are on our side. Rule accordingly.');
  if (!S.tut.closing) { S.tut.closing = 1; await say('mentor', `Pick your ${picks} strongest points. Arguments backed by what you actually proved in court hit hardest. Unproven claims fall flat.`); }
  hideDialog();
  let pool = shuffle(c.closing);
  for (let n = 0; n < picks && pool.length; n++) {
    const i = await choose(pool.map(o => o.t), { title: `CLOSING ARGUMENT — point ${n + 1} of ${picks}` });
    const o = pool[i]; pool = pool.filter((_, k) => k !== i);
    await say('you', o.t);
    if (o.bad) { await sayH('narr', pick(['A juror visibly rolls her eyes.', 'Someone in the gallery snorts.', 'The judge raises an eyebrow.'])); await sway(-6, 'Weak argument'); }
    else if (has(o.needs)) { await sayH('narr', pick(['Several jurors nod slowly.', 'A juror writes something down and underlines it.', 'You can feel the room shift.'])); await sway(6, 'Persuasive point'); }
    else { await sayH('narr', 'It sounds good — but you never actually proved that in court. The jury isn\'t convinced.'); await sway(1, 'Unproven point'); }
  }
  if (c.side === 'plaintiff') await sayH('opp', 'The plaintiff hasn\'t proven their case. Rule for the defense.');
}

async function verdict(st) {
  const c = K.c;
  if (c.jury) await sayH('judge', 'The jury will now retire to deliberate.');
  else await sayH('judge', 'I\'ll take a brief recess to consider.');
  const save = st.jurors; st.jurors = []; await sleep(900); st.jurors = save;
  Snd.gavel();
  const won = K.p >= c.threshold;
  if (c.jury) { await say('judge', 'Has the jury reached a verdict?'); await say('fore', 'We have, Your Honor.'); }
  else await say('judge', 'I\'ve reached my decision.');
  hideDialog(); await sleep(400);
  let text;
  if (c.kind === 'criminal') text = won ? 'NOT GUILTY' : 'GUILTY';
  else if (c.side === 'plaintiff') text = won ? 'FOR THE PLAINTIFF' : 'FOR THE DEFENSE';
  else text = won ? 'FOR THE DEFENSE' : (c.quick ? 'CLAIM UPHELD' : 'FOR THE PLAINTIFF');
  if (c.quick) text = won ? 'CASE WON' : 'CASE LOST';
  if (won) { Snd.fanfare(); flash('#ffd166', 0.3); } else Snd.sad();
  await banner(text, won ? 'green' : 'red', won ? 'You won the case!' : 'You lost the case.', 2200);
  return won;
}

async function finish(res) {
  const c = K.c;
  let fee = 0, rep = 0, award = 0;
  if (c.quick) { fee = res === 'won' ? c.fee : 100; rep = res === 'won' ? c.rep : 3; }
  else if (res === 'won') {
    if (c.side === 'plaintiff') { award = Math.round(c.damages * clamp(0.6 + (K.p - c.threshold) / 80, 0.6, 1.2) / 1000) * 1000; fee = award / 3; }
    else fee = c.fee;
    rep = c.rep;
  } else if (res === 'deal') {
    if (c.side === 'plaintiff') { award = K.dealAmount; fee = award / 3; rep = c.rep * 0.5; }
    else { fee = c.fee * 0.8; rep = c.rep * 0.4; }
  } else { fee = c.side === 'plaintiff' ? 0 : c.fee * 0.5; rep = c.rep * 0.2; }
  const mult = (K.appeal ? 0.75 : 1);
  fee = Math.round(fee * mult * (S.owned.office ? 1.1 : 1)); rep = Math.round(rep * mult);
  await lines(res === 'won' ? c.win : res === 'deal' ? c.deal : c.lose);
  S.money += fee; S.rep += rep; S.stats.earned += fee; S.week++; S.studied = false;
  if (c.quick) { if (res === 'won') S.stats.small++; }
  else {
    S.cases[c.id] = { res };
    if (res === 'won') S.stats.won++; else if (res === 'deal') S.stats.deals++; else S.stats.lost++;
  }
  persist();
  $('#trialbar').classList.add('hidden');
  await panel((p, close) => {
    const head = res === 'won' ? '<span class="good">CASE WON</span>' : res === 'deal' ? '<span class="gold">CASE SETTLED</span>' : '<span class="bad">CASE LOST</span>';
    p.innerHTML = `<h2>${head} — ${esc(c.title)}</h2>` +
      (c.quick ? '' : `<div class="row">Final ${c.jury ? 'jury' : 'judge'} support: <b class="gold">${Math.round(K.p)}%</b> <span class="muted">(needed ${c.threshold}%)</span></div>`) +
      (award ? `<div class="row">${res === 'deal' ? 'Settlement' : 'Jury award'}: <b class="good">${fmt(award)}</b> <span class="muted">(your share: 1/3)</span></div>` : '') +
      `<div class="row">Fees earned: <b class="good">+${fmt(fee)}</b></div><div class="row">Reputation: <b class="gold">+${rep}</b></div>` +
      (K.appeal ? '<div class="row muted">Appeal: rewards at 75%.</div>' : '') +
      (res === 'lost' && !c.quick ? '<p class="muted">You can file an appeal from the Case Board to try this case again.</p>' : '') +
      `<p class="muted">Tip: ${esc(pick(MENTOR_TIPS))}</p><div class="row"><button class="btn primary">BACK TO THE OFFICE</button></div>`;
    p.querySelector('.primary').onclick = () => close();
  }, { noEsc: true });
  $('#btnEvidence').classList.add('hidden');
  K = null;
  setScene(office); office.npcs = []; office.place(150, 140, 'down');
  hud();
  await checkRank();
  hud(); persist();
}

// ---------- Small claims generator ----------
function makeSmallClaim() {
  const T = pick(SMALL_CLAIMS);
  const ev = {}; Object.entries(T.ev).forEach(([k, v]) => { ev[k] = { name: v[0], icon: v[1], desc: v[2] }; });
  const judge = pick([J_OAKES, J_MBEKI, J_REYES, J_WHIT]);
  const testimony = T.test.map((s, i) => {
    const o = { t: s.t };
    if (s.contra) { const first = arr(s.contra)[0]; o.contra = s.contra; o.flag = 'p' + i; o.hit = [['you', `That's not what the **${ev[first].name}** shows. ${ev[first].desc}`], ['w', 'I... well... that is...', 'sweat']]; }
    if (s.obj) o.obj = s.obj;
    return o;
  });
  const flags = testimony.filter(t => t.flag).map(t => t.flag);
  return {
    id: 'small', quick: true, title: T.title, kind: 'civil', area: T.area, side: 'small', fee: 450 + S.rank * 150, rep: 15, threshold: 52, jury: false, court: 'Small Claims Court',
    summary: T.summary, closePicks: 2,
    people: { client: { name: T.client[0], look: T.client[1] }, judge, opp: { name: T.wit[0], look: T.wit[1] }, w: { name: T.wit[0], look: T.wit[1] } },
    evidence: ev, start: Object.keys(ev),
    witnesses: [{ who: 'w', side: 'opp', damage: 10, intro: [['narr', T.summary], ['client', 'Thanks for helping on such short notice. Everything I have is in the file.'], ['judge', `${T.wit[0].split(' (')[0]}, tell the court your side.`], ['w', 'Gladly. This whole thing is ridiculous.', 'angry']], testimony }],
    closing: [
      { t: 'The evidence contradicts the testimony at every turn.', needs: flags[0] },
      { t: 'The documents in the file speak for themselves.', needs: flags[1] },
      { t: 'The other side simply isn\'t credible.', needs: flags[2] || flags[0] },
      { t: 'My client is a very nice person.', bad: true },
    ],
    win: [['client', 'We won! Thank you so much!', 'happy']], lose: [['client', 'Oh well. Thanks for trying.', 'sad']], deal: [],
  };
}

// =====================================================================
//  TITLE, CHARACTER CREATION, INTRO
// =====================================================================
function creator(editing) {
  const cur = editing ? S.look : null;
  const st = {
    name: editing ? S.name : '',
    skin: cur ? Math.max(0, SKIN.indexOf(cur.skin)) : 1,
    style: cur ? Math.max(0, HAIRSTYLES.indexOf(cur.style)) : 0,
    hair: cur ? Math.max(0, Object.values(HAIRC).indexOf(cur.hair)) : 1,
    suit: cur ? Math.max(0, Object.values(SUITS).indexOf(cur.top)) : 0,
    tie: cur ? Math.max(0, Object.values(TIES).indexOf(cur.tie)) : 0,
    glasses: cur ? !!cur.glasses : false,
  };
  const make = () => ({ skin: SKIN[st.skin], hair: Object.values(HAIRC)[st.hair], style: HAIRSTYLES[st.style], top: Object.values(SUITS)[st.suit], tie: Object.values(TIES)[st.tie], glasses: st.glasses });
  return panel((p, close) => {
    p.innerHTML = `${editing ? '<button class="btn close">CANCEL</button>' : ''}<h2>${editing ? 'Change Your Look' : 'Create Your Lawyer'}</h2>
      <div class="creator"><canvas width="32" height="32"></canvas><div class="ctrls">
      ${editing ? '' : '<div class="row"><span class="lbl">NAME</span><input type="text" maxlength="16" placeholder="Your name" id="cname"></div>'}
      ${['skin', 'style', 'hair', 'suit', 'tie'].map(k => `<div class="row"><span class="lbl">${{ skin: 'SKIN', style: 'HAIR', hair: 'COLOR', suit: 'SUIT', tie: 'TIE' }[k]}</span><button class="btn" data-k="${k}" data-d="-1">◀</button><span class="val" id="v-${k}"></span><button class="btn" data-k="${k}" data-d="1">▶</button></div>`).join('')}
      <div class="row"><span class="lbl">GLASSES</span><button class="btn" id="cgl"></button></div>
      <div class="row"><button class="btn primary" id="cgo">${editing ? 'SAVE LOOK' : 'START YOUR CAREER'}</button></div>
      <div class="row muted" id="cerr"></div></div></div>`;
    const cvs = p.querySelector('canvas'), cx = cvs.getContext('2d');
    const sizes = { skin: SKIN.length, style: HAIRSTYLES.length, hair: Object.keys(HAIRC).length, suit: Object.keys(SUITS).length, tie: Object.keys(TIES).length };
    const names = { skin: SKIN.map((_, i) => 'Tone ' + (i + 1)), style: HAIRSTYLES.map(s => s[0].toUpperCase() + s.slice(1)), hair: Object.keys(HAIRC).map(s => s[0].toUpperCase() + s.slice(1)), suit: Object.keys(SUITS), tie: Object.keys(TIES) };
    const render = () => { drawPortrait(cx, make(), 'happy', '#24425a'); Object.keys(sizes).forEach(k => { p.querySelector('#v-' + k).textContent = names[k][st[k]]; }); p.querySelector('#cgl').textContent = st.glasses ? 'ON' : 'OFF'; };
    p.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k; st[k] = (st[k] + (+b.dataset.d) + sizes[k]) % sizes[k]; Snd.select(); render(); });
    p.querySelector('#cgl').onclick = () => { st.glasses = !st.glasses; Snd.select(); render(); };
    const nameEl = p.querySelector('#cname'); if (nameEl) { nameEl.value = st.name; setTimeout(() => nameEl.focus(), 50); nameEl.onkeydown = e => { if (e.key === 'Enter') p.querySelector('#cgo').click(); }; }
    p.querySelector('#cgo').onclick = () => {
      const name = nameEl ? nameEl.value.trim().replace(/[^\p{L}\p{N} .'-]/gu, '').slice(0, 16) : st.name;
      if (!name) { p.querySelector('#cerr').textContent = 'Every lawyer needs a name!'; return; }
      Snd.good(); close({ name, look: make() });
    };
    const cl = p.querySelector('.close'); if (cl) cl.onclick = () => close(null);
    render();
  }, { noEsc: !editing });
}

const titleScene = {
  draw(c, t) {
    drawTitle(c, t);
    c.textAlign = 'center';
    c.font = '16px "Press Start 2P", monospace'; c.fillStyle = '#3a0a12'; c.fillText('PIXEL COUNSEL', 162, 26);
    c.fillStyle = '#ffd166'; c.fillText('PIXEL COUNSEL', 160, 24);
    c.font = '6px "Press Start 2P", monospace'; c.fillStyle = '#f4f1e8'; c.fillText('FROM LAW CLERK TO NAME PARTNER', 160, 36);
    c.textAlign = 'left';
  },
};

async function titleMenu() {
  setScene(titleScene); hud();
  const saved = loadSave();
  while (true) {
    const i = await choose([
      { label: 'New Career', sub: saved ? 'Starts over (your old save will be replaced).' : 'Start as a fresh-faced law clerk.' },
      { label: 'Continue', sub: saved ? `${saved.name} — ${RANKS[saved.rank].name}, ${fmt(saved.money)}` : 'No saved game yet.', disabled: !saved },
      'How to Play',
    ], { title: 'PIXEL COUNSEL' });
    if (i === 2) { await helpPanel(); continue; }
    if (i === 1) { S = saved; return enterOffice(false); }
    const r = await creator(false);
    S = newSave(r.name, r.look); persist();
    return enterOffice(true);
  }
}

async function enterOffice(intro) {
  setScene(office); office.place(150, 150, 'up'); hud();
  if (intro) {
    office.npcs = [{ look: MENTOR.look, x: 150, y: 118, dir: 'down' }];
    await lines([
      ['mentor', 'Welcome to Steele & Associates, {name}. I\'m Margaret Steele, senior partner. And now your boss.', 'happy'],
      ['mentor', 'You passed the bar, so you can practice law. Whether you\'re any good at it... we\'ll find out.'],
      ['mentor', 'Your cases are on the **Case Board** on the wall. Criminal defense, injury claims, contracts, custody, housing... we take it all.'],
      ['mentor', 'Every case runs the whole process: interview the client, investigate, file motions, weigh any deal, and then — if it comes to it — trial.'],
      ['mentor', 'Win and you build **reputation**. Enough reputation and you\'ll be promoted. Law Clerk today. Name Partner, if you\'re very good.'],
      ['mentor', 'The **Law Library** is for studying and training skills. The **Wardrobe** is where your fees buy upgrades. The **computer** has your career stats.'],
      ['mentor', 'Move with WASD or the arrow keys — or just click. Press E to use things. Now get to work.'],
    ]);
    office.npcs = [];
  }
  office.control = true; hud();
}

titleMenu();
