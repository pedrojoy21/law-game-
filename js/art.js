'use strict';
// =====================================================================
//  ART: everything is drawn procedurally with rectangles (no image files)
// =====================================================================
const INK = '#1b1b24', PAPER = '#f4f1e8';

function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function shade(h, a) { // a in [-1,1]
  const [r, g, b] = hex2rgb(h);
  const f = v => Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

// ---------------------------------------------------------------------
//  Characters  (look: {skin, hair, style, top, tie, pants, glasses, beard, robe})
// ---------------------------------------------------------------------
function drawPerson(c, x, y, L, o = {}) {
  const s = o.scale || 1, dir = o.dir || 'down', walking = !!o.walking, f = o.frame || 0;
  const r = (rx, ry, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x + rx * s), Math.round(y + ry * s), Math.ceil(w * s), Math.ceil(h * s)); };
  const sk = L.skin, hr = L.hair, top = L.top, dk = shade(top, -0.28);
  const pants = L.pants || (L.robe ? '#111' : shade(top, -0.4));
  // shadow
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(Math.round(x + 1 * s), Math.round(y + 22.5 * s), Math.ceil(10 * s), Math.ceil(2 * s));
  const step = walking ? (Math.floor(f) % 2) : -1;
  // legs + shoes
  r(3, 17, 3, step === 0 ? 4 : 5, pants); r(6, 17, 3, step === 1 ? 4 : 5, pants);
  r(3, step === 0 ? 21 : 22, 3, 1, '#15151c'); r(6, step === 1 ? 21 : 22, 3, 1, '#15151c');
  // body
  r(1, 9, 10, 8, top);
  if (L.robe) r(1, 9, 10, 13, top);
  const sw = walking ? (step === 0 ? 1 : -1) : 0;
  r(0, 10 + (dir === 'down' || dir === 'up' ? sw * 0.5 : 0), 1, 6, dk); r(11, 10 - (dir === 'down' || dir === 'up' ? sw * 0.5 : 0), 1, 6, dk);
  r(0, 16, 1, 1, sk); r(11, 16, 1, 1, sk);
  if (dir === 'down') {
    if (L.tie) { r(4, 9, 4, 1, PAPER); r(5, 10, 2, 4, L.tie); }
    else r(4, 9, 4, 1, shade(top, 0.25));
  }
  if (dir === 'left') r(1, 10, 2, 6, dk);
  if (dir === 'right') r(9, 10, 2, 6, dk);
  // head
  r(2, 1, 8, 8, sk); r(3, 0.5, 6, 0.5, sk);
  // face
  if (dir === 'down') {
    r(4, 4, 1, 2, INK); r(7, 4, 1, 2, INK); r(5, 7, 2, 1, '#9a5a4a');
    if (L.glasses) { r(3, 4, 2, 2, '#2a2a33'); r(7, 4, 2, 2, '#2a2a33'); r(5, 4, 2, 1, '#2a2a33'); r(4, 4, 1, 1, '#9fd3ff'); r(7, 4, 1, 1, '#9fd3ff'); }
  } else if (dir === 'left') { r(3, 4, 1, 2, INK); r(3, 7, 2, 1, '#9a5a4a'); if (L.glasses) r(2, 4, 3, 1, '#2a2a33'); }
  else if (dir === 'right') { r(8, 4, 1, 2, INK); r(7, 7, 2, 1, '#9a5a4a'); if (L.glasses) r(7, 4, 3, 1, '#2a2a33'); }
  // hair
  const st = L.style || 'short';
  if (dir === 'up') {
    if (st !== 'bald') r(2, 0, 8, 7, hr); else r(2, 4, 8, 2, hr);
    if (st === 'long') r(1, 2, 10, 9, hr);
    if (st === 'bob') r(1, 2, 10, 6, hr);
    if (st === 'bun') r(4, -2, 4, 3, hr);
    if (st === 'curly') r(1, -1, 10, 7, hr);
  } else {
    if (st !== 'bald') {
      r(2, 0, 8, 3, hr);
      if (dir === 'down') { r(2, 3, 1, 2, hr); r(9, 3, 1, 2, hr); }
      if (dir === 'left') r(6, 2, 4, 4, hr);
      if (dir === 'right') r(2, 2, 4, 4, hr);
    } else { r(2, 3, 1, 2, hr); r(9, 3, 1, 2, hr); }
    if (st === 'long') { r(1, 2, 1, 9, hr); r(10, 2, 1, 9, hr); }
    if (st === 'bob') { r(1, 2, 1, 6, hr); r(10, 2, 1, 6, hr); }
    if (st === 'bun') r(4, -2, 4, 2, hr);
    if (st === 'curly') { r(1, -1, 10, 3, hr); r(1, 2, 1, 4, hr); r(10, 2, 1, 4, hr); }
    if (st === 'spiky') { r(2, -1, 1, 1, hr); r(4, -1, 1, 1, hr); r(6, -1, 1, 1, hr); r(8, -1, 1, 1, hr); }
  }
  if (L.beard && dir !== 'up') { r(2, 6, 8, 3, hr); if (dir === 'down') r(5, 7, 2, 1, shade(hr, -0.4)); }
}

// 32x32 portrait bust. mood: normal | happy | angry | sweat | shock | sad
function drawPortrait(c, L, mood = 'normal', bg = '#2b3350') {
  c.clearRect(0, 0, 32, 32);
  R(c, 0, 0, 32, 32, bg);
  R(c, 0, 26, 32, 6, shade(bg, -0.2));
  const sk = L.skin, hr = L.hair, top = L.top, st = L.style || 'short', skd = shade(sk, -0.14);
  // long hair behind shoulders
  if (st === 'long') R(c, 6, 7, 20, 20, shade(hr, -0.1));
  // body
  R(c, 4, 24, 24, 8, top); R(c, 2, 27, 28, 5, top); R(c, 4, 24, 1, 8, shade(top, -0.25)); R(c, 27, 24, 1, 8, shade(top, -0.25));
  // neck
  R(c, 13, 20, 6, 5, skd);
  if (L.robe) { R(c, 12, 24, 8, 3, PAPER); R(c, 15, 24, 2, 2, '#ddd'); }
  else if (L.tie) { R(c, 12, 24, 3, 3, PAPER); R(c, 17, 24, 3, 3, PAPER); R(c, 15, 24, 2, 8, L.tie); R(c, 14, 24, 4, 2, L.tie); }
  else { R(c, 12, 24, 8, 2, shade(top, 0.25)); }
  // head
  R(c, 9, 6, 14, 15, sk); R(c, 10, 5, 12, 1, sk); R(c, 10, 21, 12, 1, sk); R(c, 8, 12, 1, 4, sk); R(c, 23, 12, 1, 4, sk);
  R(c, 9, 18, 14, 3, skd); R(c, 10, 21, 12, 1, skd);
  // eyes & brows
  const brow = shade(hr === '#e8e8e8' ? '#a0a0a0' : hr, -0.2);
  if (mood === 'happy') { R(c, 11, 13, 4, 1, INK); R(c, 17, 13, 4, 1, INK); R(c, 11, 12, 1, 1, INK); R(c, 14, 12, 1, 1, INK); R(c, 17, 12, 1, 1, INK); R(c, 20, 12, 1, 1, INK); }
  else if (mood === 'shock') { R(c, 11, 11, 4, 4, PAPER); R(c, 17, 11, 4, 4, PAPER); R(c, 12, 12, 2, 2, INK); R(c, 18, 12, 2, 2, INK); }
  else { R(c, 12, 12, 3, 3, PAPER); R(c, 17, 12, 3, 3, PAPER); R(c, 13, 12, 2, 3, INK); R(c, 18, 12, 2, 3, INK); R(c, 13, 12, 1, 1, '#fff'); R(c, 18, 12, 1, 1, '#fff'); }
  if (mood === 'angry') { R(c, 11, 10, 2, 1, brow); R(c, 13, 11, 2, 1, brow); R(c, 17, 11, 2, 1, brow); R(c, 19, 10, 2, 1, brow); }
  else if (mood === 'sad' || mood === 'sweat') { R(c, 11, 11, 2, 1, brow); R(c, 13, 10, 2, 1, brow); R(c, 17, 10, 2, 1, brow); R(c, 19, 11, 2, 1, brow); }
  else if (mood === 'shock') { R(c, 11, 9, 4, 1, brow); R(c, 17, 9, 4, 1, brow); }
  else { R(c, 11, 10, 4, 1, brow); R(c, 17, 10, 4, 1, brow); }
  // nose
  R(c, 15, 15, 2, 2, skd); R(c, 16, 14, 1, 1, skd);
  // mouth
  const m = '#7a3b3b';
  if (mood === 'happy') { R(c, 13, 18, 6, 1, m); R(c, 12, 17, 1, 1, m); R(c, 19, 17, 1, 1, m); R(c, 14, 19, 4, 1, '#c96a6a'); }
  else if (mood === 'shock') { R(c, 14, 18, 4, 3, '#3a1a1a'); }
  else if (mood === 'angry') { R(c, 13, 19, 6, 1, m); R(c, 13, 18, 1, 1, m); R(c, 18, 18, 1, 1, m); }
  else if (mood === 'sad' || mood === 'sweat') { R(c, 14, 19, 4, 1, m); R(c, 13, 20, 1, 1, m); R(c, 18, 20, 1, 1, m); }
  else R(c, 14, 19, 4, 1, m);
  // beard
  if (L.beard) { R(c, 9, 17, 14, 5, hr); R(c, 10, 22, 12, 1, hr); R(c, 13, 16, 6, 1, hr); R(c, 14, 19, 4, 1, shade(hr, -0.4)); }
  // hair
  if (st === 'short' || st === 'bun' || st === 'spiky' || st === 'long' || st === 'bob') {
    R(c, 8, 3, 16, 4, hr); R(c, 9, 2, 14, 1, hr); R(c, 8, 7, 2, 5, hr); R(c, 22, 7, 2, 5, hr); R(c, 10, 7, 7, 1, hr);
    R(c, 10, 3, 6, 1, shade(hr, 0.25));
  }
  if (st === 'long') { R(c, 6, 6, 3, 19, hr); R(c, 23, 6, 3, 19, hr); }
  if (st === 'bob') { R(c, 6, 6, 3, 13, hr); R(c, 23, 6, 3, 13, hr); }
  if (st === 'bun') { R(c, 12, 0, 8, 3, hr); R(c, 13, 0, 3, 1, shade(hr, 0.25)); }
  if (st === 'spiky') { for (let i = 0; i < 5; i++) R(c, 9 + i * 3, 0, 2, 3, hr); }
  if (st === 'curly') {
    R(c, 6, 2, 20, 6, hr); R(c, 5, 5, 3, 10, hr); R(c, 24, 5, 3, 10, hr);
    for (let i = 0; i < 6; i++) R(c, 7 + i * 3, 1, 2, 1, hr);
    R(c, 9, 3, 3, 1, shade(hr, 0.25)); R(c, 17, 4, 3, 1, shade(hr, 0.25));
  }
  if (st === 'bald') { R(c, 8, 10, 2, 5, hr); R(c, 22, 10, 2, 5, hr); R(c, 12, 6, 4, 1, shade(sk, 0.25)); }
  // glasses
  if (L.glasses) {
    const g = '#22222b';
    R(c, 11, 11, 5, 1, g); R(c, 11, 15, 5, 1, g); R(c, 11, 11, 1, 5, g); R(c, 15, 11, 1, 5, g);
    R(c, 16, 11, 5, 1, g); R(c, 16, 15, 5, 1, g); R(c, 16, 11, 1, 5, g); R(c, 20, 11, 1, 5, g);
    R(c, 9, 12, 2, 1, g); R(c, 21, 12, 2, 1, g);
  }
  if (mood === 'sweat') { R(c, 24, 7, 2, 3, '#9fd3ff'); R(c, 25, 10, 1, 1, '#9fd3ff'); R(c, 6, 11, 1, 2, '#9fd3ff'); }
}

// ---------------------------------------------------------------------
//  Shared scene helpers
// ---------------------------------------------------------------------
function skyline(c, x, y, w, h, t, night) {
  R(c, x, y, w, h, night ? '#141a35' : '#8ecae6');
  if (!night) R(c, x, y + h * 0.6, w, h * 0.4, '#b9e0f0');
  let bx = x; let i = 0;
  while (bx < x + w) {
    const bw = 8 + ((i * 7) % 9), bh = h * 0.35 + ((i * 13) % 11) * h * 0.04;
    R(c, bx, y + h - bh, Math.min(bw, x + w - bx), bh, night ? '#232a4d' : '#6c7a99');
    for (let wy = y + h - bh + 2; wy < y + h - 2; wy += 4)
      for (let wx = bx + 2; wx < Math.min(bx + bw - 1, x + w - 1); wx += 3) {
        const on = night ? ((wx * 3 + wy * 7 + i + Math.floor(t * 0.3)) % 5 === 0) : false;
        R(c, wx, wy, 1, 2, on ? '#ffe28a' : (night ? '#2e365e' : '#8a98b8'));
      }
    bx += bw + 1; i++;
  }
}
function windowFrame(c, x, y, w, h, t, night) {
  R(c, x - 2, y - 2, w + 4, h + 4, '#3b2a20');
  skyline(c, x, y, w, h, t, night);
  R(c, x + w / 2 - 1, y, 2, h, '#3b2a20'); R(c, x, y + h / 2 - 1, w, 2, '#3b2a20');
  R(c, x - 3, y + h + 2, w + 6, 2, '#5a4030');
}
function planks(c, y, h, a, b) {
  R(c, 0, y, 320, h, a);
  for (let row = 0; row * 6 < h; row++) {
    const yy = y + row * 6;
    R(c, 0, yy, 320, 1, b);
    for (let x = (row % 2) * 20; x < 320; x += 40) R(c, x, yy, 1, 6, b);
  }
}
function tiles(c, y, h, a, b, size = 10) {
  for (let ty = 0; ty * size < h; ty++) for (let tx = 0; tx * size < 320; tx++)
    R(c, tx * size, y + ty * size, size, size, (tx + ty) % 2 ? a : b);
}
function carpet(c, y, h, a, b) {
  R(c, 0, y, 320, h, a);
  for (let yy = y + 2; yy < y + h; yy += 4) for (let x = (yy % 8 ? 0 : 2); x < 320; x += 4) R(c, x, yy, 1, 1, b);
}
function wall(c, h, col, trim) {
  R(c, 0, 0, 320, h, col);
  for (let x = 0; x < 320; x += 16) R(c, x, 0, 1, h, shade(col, -0.06));
  if (trim) { R(c, 0, h - 10, 320, 10, trim); R(c, 0, h - 11, 320, 1, shade(trim, 0.3)); }
}
function light(c, x, y) { R(c, x - 8, y, 16, 3, '#e8e4d0'); c.fillStyle = 'rgba(255,250,210,0.08)'; c.beginPath(); c.moveTo(x - 8, y + 3); c.lineTo(x + 8, y + 3); c.lineTo(x + 30, y + 90); c.lineTo(x - 30, y + 90); c.fill(); }

// ---------------------------------------------------------------------
//  Office (hub)
// ---------------------------------------------------------------------
function drawOffice(c, t, S) {
  const fancy = S && S.owned && S.owned.office;
  wall(c, 66, fancy ? '#4a3b5c' : '#56658a', fancy ? '#2e2240' : '#38415e');
  planks(c, 66, 114, fancy ? '#6b4a32' : '#8a5a3c', fancy ? '#563a26' : '#744a30');
  // window
  windowFrame(c, 140, 10, 60, 32, t, false);
  // case board
  R(c, 72, 8, 48, 34, '#5a3a22'); R(c, 74, 10, 44, 30, '#c49a6c');
  const pins = [[77, 13, '#fff'], [90, 12, '#ffe28a'], [104, 14, '#fff'], [79, 26, '#bde0fe'], [94, 25, '#fff'], [106, 28, '#ffc8dd']];
  pins.forEach(([px, py, col]) => { R(c, px, py, 9, 10, col); R(c, px + 4, py, 1, 1, '#c0392b'); R(c, px + 1, py + 3, 6, 1, '#aaa'); R(c, px + 1, py + 5, 5, 1, '#aaa'); });
  R(c, 82, 18, 20, 1, '#c0392b'); R(c, 98, 22, 1, 6, '#c0392b');
  // diplomas
  [[18, 14], [38, 14], [124, 20]].forEach(([dx, dy], i) => { if (i === 2 && !(S && S.rank >= 2)) return; R(c, dx, dy, 14, 11, '#b8860b'); R(c, dx + 1, dy + 1, 12, 9, PAPER); R(c, dx + 3, dy + 3, 8, 1, '#888'); R(c, dx + 3, dy + 5, 6, 1, '#888'); R(c, dx + 9, dy + 7, 2, 2, '#c0392b'); });
  // bookshelf
  R(c, 208, 8, 42, 60, '#4a2e1c'); R(c, 210, 10, 38, 56, '#2e1c12');
  for (let sh = 0; sh < 4; sh++) {
    const sy = 10 + sh * 14; R(c, 210, sy + 12, 38, 2, '#4a2e1c');
    for (let b = 0; b < 9; b++) { const cols = ['#8e2c2c', '#2c4a8e', '#2c8e5a', '#8e7a2c', '#5a2c8e', '#a0522d']; R(c, 211 + b * 4, sy + 2 + (b % 3), 3, 10 - (b % 3), cols[(b + sh * 2) % cols.length]); R(c, 211 + b * 4, sy + 5, 3, 1, '#d4af37'); }
  }
  // wardrobe
  R(c, 260, 6, 44, 64, '#6b4226'); R(c, 262, 8, 19, 60, '#7d5030'); R(c, 283, 8, 19, 60, '#7d5030');
  R(c, 279, 36, 2, 6, '#d4af37'); R(c, 284, 36, 2, 6, '#d4af37'); R(c, 266, 12, 11, 2, '#5a3820'); R(c, 287, 12, 11, 2, '#5a3820');
  // rug
  R(c, 120, 108, 110, 52, fancy ? '#1f4e5a' : '#7a2e3a'); R(c, 123, 111, 104, 46, fancy ? '#2d6b7a' : '#93404c');
  R(c, 128, 116, 94, 36, fancy ? '#1f4e5a' : '#7a2e3a'); R(c, 131, 119, 88, 30, fancy ? '#2d6b7a' : '#93404c');
  // desk
  R(c, 66, 82, 68, 4, '#9b6b45'); R(c, 66, 86, 68, 16, '#6b4428'); R(c, 70, 90, 20, 8, '#5a3820'); R(c, 110, 90, 20, 8, '#5a3820'); R(c, 79, 93, 2, 2, '#d4af37'); R(c, 119, 93, 2, 2, '#d4af37');
  // monitor
  R(c, 76, 66, 22, 15, '#22222b'); R(c, 78, 68, 18, 11, '#2d6b9a'); R(c, 85, 81, 4, 2, '#22222b'); R(c, 81, 82, 12, 1, '#22222b');
  if (Math.floor(t * 2) % 2) R(c, 80, 75, 4, 1, '#bde0fe'); R(c, 80, 70, 12, 1, '#bde0fe'); R(c, 80, 72, 9, 1, '#bde0fe');
  // desk items
  R(c, 104, 76, 12, 6, PAPER); R(c, 105, 75, 12, 6, '#fff'); R(c, 122, 74, 4, 8, '#2c3e50'); R(c, 121, 73, 6, 2, '#d4af37');
  // lamp
  R(c, 126, 70, 6, 3, '#2c8e5a'); R(c, 128, 73, 1, 9, '#d4af37');
  // trophy cabinet
  R(c, 4, 108, 28, 44, '#5a3820'); R(c, 6, 110, 24, 40, '#a8d8ea'); R(c, 6, 124, 24, 1, '#5a3820'); R(c, 6, 138, 24, 1, '#5a3820');
  const won = S ? Object.values(S.cases || {}).filter(v => v.res === 'won').length : 0;
  for (let i = 0; i < Math.min(won, 9); i++) { const tx = 8 + (i % 3) * 8, ty = 113 + Math.floor(i / 3) * 14; R(c, tx, ty, 5, 5, '#d4af37'); R(c, tx + 2, ty + 5, 1, 3, '#d4af37'); R(c, tx + 1, ty + 8, 3, 1, '#b8860b'); }
  // coffee table + machine
  R(c, 278, 134, 30, 4, '#9b6b45'); R(c, 280, 138, 2, 14, '#6b4428'); R(c, 304, 138, 2, 14, '#6b4428');
  R(c, 284, 118, 16, 16, '#3a3a44'); R(c, 286, 120, 12, 5, '#22222b'); R(c, 290, 126, 4, 6, '#15151c'); R(c, 296, 121, 1, 1, Math.floor(t * 3) % 2 ? '#e74c3c' : '#7a1a1a');
  R(c, 300, 130, 4, 4, PAPER);
  if (Math.floor(t * 1.5) % 3 === 0) { R(c, 301, 126, 1, 2, '#ddd'); } else R(c, 302, 125, 1, 2, '#ddd');
  // plant
  R(c, 196, 138, 12, 10, '#a0522d'); R(c, 197, 136, 10, 2, '#8b4513');
  [[194, 126], [200, 122], [206, 127], [198, 130], [203, 131]].forEach(([lx, ly]) => R(c, lx, ly, 5, 8, '#2c8e5a'));
  R(c, 199, 124, 2, 12, '#1e6b3a');
  if (fancy) { R(c, 160, 52, 20, 10, '#d4af37'); R(c, 162, 54, 16, 6, '#b8860b'); }
}
const OFFICE_SOLIDS = [[66, 80, 68, 22], [208, 56, 42, 12], [260, 58, 44, 12], [4, 106, 28, 46], [278, 116, 30, 36], [194, 130, 14, 18]];
const OFFICE_OBJS = [
  { id: 'board', label: 'Case Board', rect: [72, 8, 48, 34], spot: [140, 78] },
  { id: 'computer', label: 'Computer', rect: [66, 64, 68, 38], spot: [100, 112] },
  { id: 'shelf', label: 'Law Library', rect: [208, 8, 42, 60], spot: [229, 78] },
  { id: 'wardrobe', label: 'Wardrobe & Shop', rect: [260, 6, 44, 64], spot: [282, 80] },
  { id: 'trophy', label: 'Trophy Case', rect: [4, 108, 28, 44], spot: [42, 132] },
  { id: 'coffee', label: 'Coffee Machine', rect: [278, 116, 30, 36], spot: [266, 140] },
];

// ---------------------------------------------------------------------
//  Courtroom
// ---------------------------------------------------------------------
function drawCourt(c, t, st) {
  // back wall
  R(c, 0, 0, 320, 96, '#6b3f24');
  for (let x = 0; x < 320; x += 32) { R(c, x + 2, 6, 28, 58, '#5a321c'); R(c, x + 4, 8, 24, 54, '#6b3f24'); }
  R(c, 0, 64, 320, 32, '#5a321c'); R(c, 0, 64, 320, 2, '#8a5634');
  // seal
  c.fillStyle = '#b8860b'; c.beginPath(); c.arc(160, 18, 13, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d4af37'; c.beginPath(); c.arc(160, 18, 11, 0, Math.PI * 2); c.fill();
  R(c, 159, 9, 2, 16, '#8a6410'); R(c, 152, 12, 16, 2, '#8a6410'); R(c, 152, 14, 1, 5, '#8a6410'); R(c, 167, 14, 1, 5, '#8a6410'); R(c, 150, 19, 5, 1, '#8a6410'); R(c, 165, 19, 5, 1, '#8a6410');
  // flags
  [[114, '#2c4a8e'], [200, '#8e2c2c']].forEach(([fx, col]) => { R(c, fx, 4, 2, 60, '#d4af37'); R(c, fx + 2, 6, 12, 16, col); R(c, fx + 2, 6, 12, 2, PAPER); R(c, fx + 2, 12, 12, 2, PAPER); });
  // floor
  R(c, 0, 96, 320, 84, '#3d2b22'); R(c, 128, 96, 64, 84, '#2f4a3a');
  for (let y = 100; y < 180; y += 8) R(c, 0, y, 128, 1, '#35251d');
  // judge
  if (st.judge) drawPerson(c, 148, 18, st.judge, { scale: 2 });
  if (st.gavel) { R(c, 186, 46, 10, 4, '#5a321c'); R(c, 190, 50, 2, 6, '#5a321c'); }
  // bench
  R(c, 104, 50, 112, 6, '#8a5634'); R(c, 106, 56, 108, 40, '#5a321c'); R(c, 112, 62, 96, 28, '#4a2814'); R(c, 150, 66, 20, 18, '#b8860b'); R(c, 152, 68, 16, 14, '#d4af37');
  // witness stand
  if (st.witness) drawPerson(c, 232, 44, st.witness, { scale: 2, dir: 'left' });
  R(c, 222, 74, 46, 4, '#8a5634'); R(c, 224, 78, 42, 24, '#5a321c'); R(c, 228, 82, 34, 16, '#4a2814');
  R(c, 240, 66, 2, 8, '#333'); R(c, 238, 64, 6, 3, '#222');
  // jury box
  if (st.jury) {
    const J = st.jurors || [];
    for (let i = 0; i < 6; i++) { const L = J[i]; if (L) drawPerson(c, 14 + (i % 3) * 26 + (i >= 3 ? 13 : 0), 58 + (i >= 3 ? 10 : 0), L, { scale: 1.1, dir: 'right' }); }
    R(c, 6, 82, 96, 4, '#8a5634'); R(c, 8, 86, 92, 22, '#5a321c'); R(c, 12, 90, 84, 14, '#4a2814');
  }
  // counsel tables + lawyers
  if (st.you) drawPerson(c, 40, 104, st.you, { scale: 2, dir: 'right' });
  if (st.client) drawPerson(c, 82, 106, st.client, { scale: 2, dir: 'down' });
  if (st.opp) drawPerson(c, 256, 104, st.opp, { scale: 2, dir: 'left' });
  if (st.opp2) drawPerson(c, 214, 106, st.opp2, { scale: 2, dir: 'down' });
  [[20, 104], [196, 104]].forEach(([tx]) => { R(c, tx, 140, 104, 5, '#9b6b45'); R(c, tx + 2, 145, 100, 20, '#6b4428'); R(c, tx + 6, 149, 92, 12, '#5a3820'); });
  R(c, 40, 136, 14, 5, PAPER); R(c, 60, 137, 10, 4, '#c49a6c'); R(c, 230, 136, 16, 5, PAPER); R(c, 270, 136, 10, 4, '#2c3e50');
  // rail
  R(c, 0, 168, 320, 3, '#8a5634'); for (let x = 4; x < 320; x += 10) R(c, x, 171, 3, 9, '#6b4428');
}

// ---------------------------------------------------------------------
//  Investigation locations
// ---------------------------------------------------------------------
const LOC_BG = {
  store(c, t) {
    wall(c, 100, '#d8c9a0', '#9b8a5a'); tiles(c, 100, 80, '#e8e4d8', '#c8c4b8');
    for (let i = 0; i < 3; i++) light(c, 60 + i * 100, 0);
    R(c, 20, 20, 300, 4, '#7d6a3a');
    R(c, 14, 4, 90, 12, '#c0392b'); R(c, 18, 7, 82, 6, '#e74c3c');
  },
  grocery(c, t) {
    wall(c, 100, '#e0ecd8', '#6b9a5a'); tiles(c, 100, 80, '#f0f0ea', '#d8d8d0', 12);
    for (let i = 0; i < 3; i++) light(c, 60 + i * 100, 0);
    for (let i = 0; i < 4; i++) { const fx = 120 + i * 48; R(c, fx, 34, 44, 66, '#9aa5b0'); R(c, fx + 3, 37, 38, 58, '#bde0fe'); R(c, fx + 3, 60, 38, 1, '#9aa5b0'); for (let j = 0; j < 5; j++) { R(c, fx + 5 + j * 7, 44, 5, 12, ['#e74c3c', '#f1c40f', '#27ae60', '#3498db', '#e67e22'][(i + j) % 5]); R(c, fx + 5 + j * 7, 66, 5, 12, ['#9b59b6', '#ecf0f1', '#e74c3c', '#f1c40f', '#27ae60'][(i + j) % 5]); } R(c, fx + 18, 26, 8, 6, '#2c3e50'); R(c, fx + 20, 28, 4, 2, PAPER); }
  },
  apartment(c, t) {
    wall(c, 100, '#9a8a9a', '#6a5a6a'); for (let x = 4; x < 320; x += 12) for (let y = 6; y < 88; y += 12) R(c, x, y, 2, 2, '#8a7a8a');
    planks(c, 100, 80, '#7d5135', '#6a442c');
    windowFrame(c, 120, 18, 50, 40, t, false);
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(120, 18, 50, 8);
    R(c, 20, 66, 70, 26, '#5a6b8a'); R(c, 16, 60, 78, 10, '#4a5a78'); R(c, 20, 92, 4, 8, '#333'); R(c, 86, 92, 4, 8, '#333');
    R(c, 26, 70, 18, 10, '#e9c46a');
  },
  street(c, t, night) {
    skyline(c, 0, 0, 320, 110, t, !!night);
    R(c, 0, 110, 320, 18, '#9a9a9a'); R(c, 0, 110, 320, 2, '#bbb'); for (let x = 0; x < 320; x += 20) R(c, x, 112, 1, 16, '#8a8a8a');
    R(c, 0, 128, 320, 52, '#3a3a44'); for (let x = 0; x < 320; x += 30) R(c, x, 152, 16, 2, '#f1c40f');
    [40, 200].forEach(lx => { R(c, lx, 60, 3, 52, '#2c2c34'); R(c, lx - 4, 58, 11, 4, '#2c2c34'); R(c, lx - 2, 62, 7, 2, night ? '#ffe28a' : '#ddd'); if (night) { c.fillStyle = 'rgba(255,230,140,0.1)'; c.beginPath(); c.moveTo(lx - 2, 64); c.lineTo(lx + 5, 64); c.lineTo(lx + 22, 128); c.lineTo(lx - 18, 128); c.fill(); } });
  },
  night(c, t) { LOC_BG.street(c, t, true); },
  alley(c, t) {
    R(c, 0, 0, 320, 180, '#1c1a24');
    for (let y = 0; y < 120; y += 6) for (let x = (y / 6 % 2) * 8; x < 320; x += 16) R(c, x, y, 15, 5, '#3a2a2a');
    R(c, 0, 120, 320, 60, '#2a2a30'); R(c, 150, 120, 4, 60, '#202026');
    R(c, 260, 20, 30, 8, '#ff5d73'); R(c, 262, 22, 26, 4, '#ff9fb0');
    R(c, 30, 30, 20, 60, '#3a3a44'); R(c, 32, 32, 16, 56, '#2c2c34'); R(c, 34, 60, 2, 4, '#888');
    R(c, 100, 10, 2, 110, '#555');
  },
  bar(c, t) {
    wall(c, 100, '#2a1f2e', '#1a121e'); planks(c, 100, 80, '#4a2e1c', '#3a2214');
    R(c, 20, 20, 200, 4, '#5a3a22'); R(c, 20, 44, 200, 4, '#5a3a22');
    for (let i = 0; i < 24; i++) R(c, 24 + i * 8, 8 + (i % 3), 4, 12 - (i % 3), ['#2ecc71', '#e67e22', '#8e44ad', '#f1c40f', '#c0392b'][i % 5]);
    for (let i = 0; i < 24; i++) R(c, 24 + i * 8, 32 + (i % 2), 4, 12 - (i % 2), ['#d35400', '#16a085', '#7f8c8d', '#e74c3c'][i % 4]);
    const on = Math.floor(t * 1.5) % 4 !== 0;
    R(c, 236, 14, 70, 22, '#111'); c.fillStyle = on ? '#4cc9f0' : '#1a4a5a'; c.font = '10px monospace'; c.fillText('JAZZ', 252, 30);
    R(c, 0, 80, 230, 6, '#7a4a2a'); R(c, 0, 86, 230, 18, '#5a321c');
    for (let i = 0; i < 5; i++) { R(c, 20 + i * 44, 104, 10, 3, '#8e2c2c'); R(c, 24 + i * 44, 107, 2, 12, '#333'); }
  },
  corporate(c, t, night) {
    wall(c, 100, '#9aa8b8', '#6a7888'); carpet(c, 100, 80, '#4a5568', '#3e4858');
    windowFrame(c, 110, 12, 100, 50, t, !!night);
    for (let i = 0; i < 3; i++) light(c, 50 + i * 110, 0);
    R(c, 10, 70, 70, 4, '#bfc8d4'); R(c, 10, 74, 4, 26, '#8a96a6'); R(c, 76, 74, 4, 26, '#8a96a6');
    R(c, 240, 70, 70, 4, '#bfc8d4'); R(c, 240, 74, 4, 26, '#8a96a6'); R(c, 306, 74, 4, 26, '#8a96a6');
    if (night) { c.fillStyle = 'rgba(10,10,40,0.35)'; c.fillRect(0, 0, 320, 180); }
  },
  corpnight(c, t) { LOC_BG.corporate(c, t, true); },
  warehouse(c, t) {
    R(c, 0, 0, 320, 110, '#5a5a5a'); for (let x = 0; x < 320; x += 20) R(c, x, 0, 1, 110, '#4e4e4e');
    R(c, 0, 0, 320, 6, '#3a3a3a'); R(c, 0, 110, 320, 70, '#7a7a72'); for (let x = 0; x < 320; x += 40) R(c, x, 110, 1, 70, '#6a6a62');
    R(c, 220, 24, 80, 86, '#4a4a52'); for (let y = 26; y < 110; y += 5) R(c, 222, y, 76, 1, '#3a3a42');
    R(c, 10, 30, 90, 4, '#c0392b'); R(c, 10, 64, 90, 4, '#c0392b'); R(c, 10, 30, 4, 80, '#c0392b'); R(c, 96, 30, 4, 80, '#c0392b');
    for (let i = 0; i < 4; i++) { R(c, 16 + i * 20, 46, 16, 18, '#b07a4a'); R(c, 16 + i * 20, 54, 16, 1, '#8a5a30'); R(c, 16 + i * 20, 12 + 0, 0, 0, '#000'); }
    for (let i = 0; i < 4; i++) { R(c, 16 + i * 20, 80, 16, 30, '#a06a3a'); R(c, 16 + i * 20, 92, 16, 1, '#8a5a30'); }
    light(c, 160, 6);
  },
  hospital(c, t) {
    wall(c, 100, '#cfe8dc', '#9ac0b0'); tiles(c, 100, 80, '#e8f0ec', '#d8e4de', 16);
    light(c, 100, 0); light(c, 220, 0);
    R(c, 20, 8, 4, 92, '#bbb'); R(c, 18, 8, 80, 3, '#999'); for (let i = 0; i < 6; i++) R(c, 24 + i * 12, 11, 11, 86, i % 2 ? '#a8d8ea' : '#9accde');
    R(c, 150, 24, 30, 22, '#222'); R(c, 152, 26, 26, 18, '#0a2a1a'); const p = Math.floor(t * 20) % 26; R(c, 152 + p, 34, 2, 2, '#2ecc71'); R(c, 152, 36, 26, 1, '#1e6b3a');
    R(c, 220, 20, 40, 24, PAPER); R(c, 224, 26, 32, 2, '#3498db'); R(c, 238, 22, 4, 20, '#e74c3c'); R(c, 230, 30, 20, 4, '#e74c3c');
  },
  bakery(c, t) {
    wall(c, 100, '#f3d9b1', '#c49a6c'); tiles(c, 100, 80, '#f8f0e0', '#e0c8a0', 12);
    for (let i = 0; i < 2; i++) { const ox = 20 + i * 70; R(c, ox, 30, 60, 70, '#7f8c8d'); R(c, ox + 6, 40, 48, 30, '#2c2c34'); R(c, ox + 8, 42, 44, 26, '#3a2a20'); R(c, ox + 6, 76, 48, 4, '#555'); }
    R(c, 170, 70, 140, 6, '#c49a6c'); R(c, 170, 76, 140, 24, '#8a5a3c'); R(c, 174, 50, 132, 20, '#bde0fe');
    for (let i = 0; i < 8; i++) { R(c, 178 + i * 16, 60, 10, 6, ['#d4a056', '#c47a3a', '#e8c48a'][i % 3]); }
    R(c, 200, 10, 80, 14, '#8e2c2c'); R(c, 204, 13, 72, 8, '#c0392b');
  },
  house(c, t, burned) {
    wall(c, 100, burned ? '#3a3330' : '#c9a98a', burned ? '#2a2420' : '#8a6a4a'); planks(c, 100, 80, burned ? '#3a2a20' : '#9b6b45', burned ? '#2a1a12' : '#7d5135');
    windowFrame(c, 220, 16, 50, 40, t, false);
    if (burned) { c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(220, 16, 50, 40); for (let i = 0; i < 30; i++) R(c, (i * 37) % 320, (i * 23) % 100, 6 + (i % 5) * 4, 3 + (i % 3) * 3, '#1a1614'); }
    R(c, 30, 40, 50, 60, burned ? '#2a2420' : '#8a5a3c'); R(c, 38, 60, 34, 40, '#2a1a12');
    if (!burned) { const fl = Math.floor(t * 8) % 3; R(c, 46, 82 - fl, 18, 12 + fl, '#e67e22'); R(c, 50, 86 - fl, 10, 8, '#f1c40f'); }
    R(c, 26, 36, 58, 6, burned ? '#2a2420' : '#6b4428');
    if (!burned) { R(c, 110, 72, 80, 24, '#5a8a6a'); R(c, 106, 64, 88, 10, '#4a7a5a'); }
  },
  burned(c, t) { LOC_BG.house(c, t, true); },
  police(c, t) {
    wall(c, 100, '#a8b0b8', '#6a7480'); tiles(c, 100, 80, '#c8ccd0', '#b0b4b8', 16);
    light(c, 80, 0); light(c, 240, 0);
    R(c, 120, 10, 80, 30, '#2c3e50'); R(c, 124, 14, 72, 22, '#34495e'); c.fillStyle = PAPER; c.font = '8px monospace'; c.fillText('EVIDENCE', 140, 28);
    R(c, 8, 20, 4, 80, '#555'); R(c, 308, 20, 4, 80, '#555');
  },
  firehouse(c, t) {
    wall(c, 100, '#c0392b', '#7a1a1a'); R(c, 0, 100, 320, 80, '#8a8a82'); for (let x = 0; x < 320; x += 32) R(c, x, 100, 1, 80, '#7a7a72');
    R(c, 160, 20, 140, 80, '#b0b0b8'); for (let y = 22; y < 100; y += 6) R(c, 162, y, 136, 1, '#9a9aa2');
    R(c, 20, 20, 30, 30, PAPER); R(c, 24, 24, 22, 4, '#c0392b'); R(c, 24, 32, 18, 2, '#888'); R(c, 24, 36, 20, 2, '#888');
    light(c, 100, 0);
  },
  school(c, t) {
    wall(c, 100, '#f0e6c8', '#c0a870'); planks(c, 100, 80, '#b08860', '#9a7450');
    R(c, 60, 14, 160, 54, '#5a3a22'); R(c, 63, 17, 154, 48, '#2f4a3a'); c.fillStyle = '#e8e8e8'; c.font = '8px monospace'; c.fillText('2 + 2 = 4   ABC', 90, 36); c.fillText('Reading Week!', 96, 52);
    R(c, 63, 66, 154, 3, '#8a6a4a');
    for (let i = 0; i < 5; i++) { R(c, 10 + i * 16, 8, 12, 14, ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'][i]); }
    windowFrame(c, 240, 16, 60, 40, t, false);
  },
  library(c, t) {
    wall(c, 100, '#6b4a32', '#4a2e1c'); carpet(c, 100, 80, '#5a2e2e', '#4a2424');
    for (let s = 0; s < 4; s++) { const sx = 6 + s * 80; R(c, sx, 6, 70, 94, '#3a2214'); for (let sh = 0; sh < 6; sh++) { R(c, sx + 2, 8 + sh * 15 + 13, 66, 2, '#5a3a22'); for (let b = 0; b < 16; b++) R(c, sx + 3 + b * 4, 10 + sh * 15 + (b % 3), 3, 11 - (b % 3), ['#8e2c2c', '#2c4a8e', '#2c8e5a', '#8e7a2c', '#5a2c8e'][(b + sh + s) % 5]); } }
    light(c, 160, 0);
  },
  lab(c, t) {
    wall(c, 100, '#dfe6ee', '#9aa8b8'); tiles(c, 100, 80, '#eef2f6', '#d4dce4', 10);
    light(c, 80, 0); light(c, 240, 0);
    R(c, 10, 64, 140, 6, '#2c3e50'); R(c, 12, 70, 136, 30, '#5d6d7e');
    for (let i = 0; i < 5; i++) { R(c, 20 + i * 26, 50, 6, 14, '#bde0fe'); R(c, 20 + i * 26, 58, 6, 6, ['#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#3498db'][i]); }
    R(c, 200, 14, 100, 50, '#2c2c34'); R(c, 204, 18, 92, 42, '#0a2a1a'); for (let i = 0; i < 9; i++) R(c, 208 + i * 10, 56 - ((i * 7 + 3) % 30), 6, ((i * 7 + 3) % 30), i === 6 ? '#e74c3c' : '#2ecc71');
  },
  diner(c, t) {
    wall(c, 100, '#bde0fe', '#e74c3c'); tiles(c, 100, 80, '#f4f1e8', '#1b1b24', 10);
    windowFrame(c, 30, 14, 80, 40, t, false); windowFrame(c, 200, 14, 80, 40, t, false);
    R(c, 10, 74, 120, 6, '#c0392b'); R(c, 10, 80, 120, 20, '#e74c3c'); R(c, 190, 74, 120, 6, '#c0392b'); R(c, 190, 80, 120, 20, '#e74c3c');
    R(c, 136, 4, 48, 14, '#1b1b24'); c.fillStyle = '#ff9fb0'; c.font = '8px monospace'; c.fillText('DINER', 146, 14);
  },
  park(c, t) {
    R(c, 0, 0, 320, 90, '#8ecae6'); R(c, 0, 60, 320, 30, '#b9e0f0');
    [[40, 30], [120, 20], [250, 26]].forEach(([cx, cy], i) => { const x = (cx + t * 4 * (i + 1)) % 360 - 20; R(c, x, cy, 30, 8, '#fff'); R(c, x + 6, cy - 4, 16, 6, '#fff'); });
    R(c, 0, 90, 320, 90, '#5aa05a'); for (let i = 0; i < 80; i++) R(c, (i * 41) % 320, 92 + (i * 17) % 86, 1, 2, '#4a904a');
    R(c, 20, 100, 280, 2, PAPER); R(c, 160, 100, 2, 70, PAPER); R(c, 20, 168, 280, 2, PAPER);
    R(c, 10, 110, 4, 40, PAPER); R(c, 10, 110, 14, 2, PAPER); R(c, 296, 110, 14, 2, PAPER); R(c, 306, 110, 4, 40, PAPER);
  },
  harbor(c, t) {
    skyline(c, 0, 0, 320, 70, t, true);
    R(c, 0, 70, 320, 50, '#14213d'); for (let i = 0; i < 30; i++) { const wx = (i * 53 + Math.floor(t * 10)) % 320; R(c, wx, 74 + (i * 7) % 44, 6, 1, '#2a3a6a'); }
    R(c, 0, 120, 320, 60, '#5a4a3a'); for (let x = 0; x < 320; x += 12) R(c, x, 120, 1, 60, '#4a3a2a');
    R(c, 260, 20, 10, 50, PAPER); R(c, 258, 16, 14, 6, '#c0392b'); if (Math.floor(t * 2) % 2) { c.fillStyle = 'rgba(255,240,150,0.25)'; c.beginPath(); c.moveTo(265, 18); c.lineTo(180, 8); c.lineTo(180, 30); c.fill(); }
  },
};

// Props for hotspots: [w,h,drawFn]
const PROPS = {
  register: [28, 22, (c, x, y) => { R(c, x - 20, y + 12, 68, 30, '#8a5a3c'); R(c, x - 20, y + 10, 68, 3, '#a87a50'); R(c, x, y, 28, 12, '#555'); R(c, x + 2, y + 2, 14, 6, '#2ecc71'); R(c, x + 18, y + 2, 8, 8, '#777'); R(c, x + 4, y - 6, 10, 6, '#333'); }],
  camera: [16, 10, (c, x, y, t) => { R(c, x + 6, y - 6, 2, 6, '#444'); R(c, x, y, 14, 8, '#ddd'); R(c, x + 12, y + 2, 4, 4, '#333'); R(c, x + 2, y + 2, 2, 2, Math.floor(t * 2) % 2 ? '#e74c3c' : '#600'); }],
  shelf: [44, 40, (c, x, y) => { R(c, x, y, 44, 40, '#7d6a3a'); for (let i = 0; i < 3; i++) { R(c, x + 2, y + 12 + i * 13, 40, 2, '#5a4a2a'); for (let j = 0; j < 6; j++) R(c, x + 4 + j * 7, y + 4 + i * 13, 5, 8, ['#e74c3c', '#3498db', '#f1c40f', '#ecf0f1', '#9b59b6'][(i + j) % 5]); } }],
  papers: [16, 12, (c, x, y) => { R(c, x, y + 2, 14, 10, '#ccc'); R(c, x + 2, y, 14, 10, PAPER); R(c, x + 4, y + 3, 9, 1, '#888'); R(c, x + 4, y + 5, 7, 1, '#888'); R(c, x + 4, y + 7, 8, 1, '#888'); }],
  clipboard: [12, 16, (c, x, y) => { R(c, x, y, 12, 16, '#8a5a3c'); R(c, x + 1, y + 2, 10, 13, PAPER); R(c, x + 4, y, 4, 3, '#999'); R(c, x + 3, y + 6, 6, 1, '#888'); R(c, x + 3, y + 9, 5, 1, '#888'); }],
  cabinet: [24, 36, (c, x, y) => { R(c, x, y, 24, 36, '#7f8c8d'); for (let i = 0; i < 3; i++) { R(c, x + 2, y + 2 + i * 11, 20, 10, '#95a5a6'); R(c, x + 9, y + 6 + i * 11, 6, 2, '#555'); } }],
  desk: [44, 24, (c, x, y) => { R(c, x, y, 44, 4, '#9b6b45'); R(c, x + 2, y + 4, 40, 20, '#6b4428'); R(c, x + 6, y + 8, 14, 6, '#5a3820'); R(c, x + 12, y + 10, 2, 2, '#d4af37'); }],
  computer: [22, 20, (c, x, y, t) => { R(c, x, y, 22, 15, '#22222b'); R(c, x + 2, y + 2, 18, 11, '#2d6b9a'); R(c, x + 4, y + 4, 10, 1, '#bde0fe'); R(c, x + 4, y + 6, 12, 1, '#bde0fe'); if (Math.floor(t * 2) % 2) R(c, x + 4, y + 8, 3, 1, '#bde0fe'); R(c, x + 9, y + 15, 4, 3, '#22222b'); R(c, x + 4, y + 18, 14, 2, '#333'); }],
  machine: [30, 40, (c, x, y, t) => { R(c, x, y, 30, 40, '#6a6a72'); R(c, x + 3, y + 4, 24, 12, '#3a3a42'); R(c, x + 6, y + 7, 6, 6, Math.floor(t * 2) % 2 ? '#e74c3c' : '#7a1a1a'); R(c, x + 16, y + 8, 8, 2, '#2ecc71'); R(c, x + 4, y + 22, 22, 2, '#555'); R(c, x + 4, y + 28, 22, 2, '#555'); R(c, x + 10, y + 34, 10, 6, '#444'); }],
  boiler: [36, 50, (c, x, y) => { R(c, x, y, 36, 50, '#8a5a3a'); R(c, x + 2, y + 2, 32, 46, '#7a4a2a'); for (let i = 0; i < 6; i++) R(c, x + 4 + (i * 5) % 26, y + 6 + i * 7, 3, 2, '#5a3018'); R(c, x + 12, y - 10, 6, 10, '#666'); R(c, x + 20, y + 14, 12, 8, '#e74c3c'); R(c, x + 22, y + 16, 8, 4, PAPER); }],
  locker: [24, 50, (c, x, y) => { R(c, x, y, 24, 50, '#5d6d7e'); R(c, x + 2, y + 2, 20, 46, '#7f8c8d'); for (let i = 0; i < 4; i++) R(c, x + 5, y + 6 + i * 3, 14, 1, '#5d6d7e'); R(c, x + 17, y + 24, 3, 6, '#333'); }],
  sign: [14, 22, (c, x, y) => { R(c, x, y, 14, 14, '#f1c40f'); R(c, x + 2, y + 2, 10, 10, '#f39c12'); R(c, x + 6, y + 4, 2, 5, '#1b1b24'); R(c, x + 6, y + 10, 2, 1, '#1b1b24'); R(c, x + 6, y + 14, 2, 8, '#555'); }],
  puddle: [34, 8, (c, x, y, t) => { c.fillStyle = 'rgba(120,180,230,0.65)'; c.fillRect(x, y + 2, 34, 4); c.fillRect(x + 4, y, 24, 8); R(c, x + 8 + Math.floor(t * 3) % 10, y + 3, 4, 1, '#fff'); }],
  radiator: [30, 22, (c, x, y) => { R(c, x, y, 30, 22, '#c8ccd0'); for (let i = 0; i < 7; i++) R(c, x + 2 + i * 4, y + 2, 2, 18, '#a8acb0'); R(c, x + 26, y + 18, 6, 2, '#888'); R(c, x + 6, y - 2, 4, 2, '#9fd3ff'); }],
  thermostat: [10, 14, (c, x, y) => { R(c, x, y, 10, 14, PAPER); R(c, x + 4, y + 2, 2, 9, '#e74c3c'); R(c, x + 3, y + 10, 4, 3, '#e74c3c'); R(c, x + 4, y + 2, 2, 5, PAPER); }],
  trash: [14, 18, (c, x, y) => { R(c, x, y, 14, 3, '#555'); R(c, x + 1, y + 3, 12, 15, '#7f8c8d'); R(c, x + 3, y + 5, 1, 11, '#5d6d7e'); R(c, x + 7, y + 5, 1, 11, '#5d6d7e'); }],
  dumpster: [50, 32, (c, x, y) => { R(c, x, y, 50, 6, '#1e5a3a'); R(c, x + 2, y + 6, 46, 24, '#2c7a4a'); R(c, x + 6, y + 12, 38, 2, '#1e5a3a'); R(c, x + 4, y + 30, 4, 2, '#222'); R(c, x + 42, y + 30, 4, 2, '#222'); }],
  box: [24, 20, (c, x, y) => { R(c, x, y, 24, 20, '#b07a4a'); R(c, x, y + 8, 24, 2, '#8a5a30'); R(c, x + 10, y, 4, 20, '#c89a6a'); }],
  crates: [40, 30, (c, x, y) => { R(c, x, y + 10, 22, 20, '#b07a4a'); R(c, x + 18, y + 4, 22, 26, '#a06a3a'); R(c, x + 4, y, 16, 12, '#c08a5a'); R(c, x + 22, y + 12, 14, 6, PAPER); R(c, x + 24, y + 14, 10, 1, '#c0392b'); }],
  plaque: [20, 16, (c, x, y) => { R(c, x, y, 20, 16, '#b8860b'); R(c, x + 2, y + 2, 16, 12, '#d4af37'); R(c, x + 5, y + 5, 10, 1, '#8a6410'); R(c, x + 5, y + 8, 8, 1, '#8a6410'); }],
  drawing: [18, 16, (c, x, y) => { R(c, x, y, 18, 16, PAPER); R(c, x + 2, y + 6, 3, 6, '#3498db'); R(c, x + 7, y + 7, 3, 5, '#e74c3c'); R(c, x + 12, y + 8, 2, 4, '#f1c40f'); R(c, x + 2, y + 2, 14, 2, '#f1c40f'); R(c, x + 2, y + 13, 14, 1, '#2ecc71'); }],
  fridge: [28, 56, (c, x, y) => { R(c, x, y, 28, 56, '#ecf0f1'); R(c, x, y + 20, 28, 2, '#bdc3c7'); R(c, x + 22, y + 6, 2, 10, '#95a5a6'); R(c, x + 22, y + 26, 2, 14, '#95a5a6'); }],
  tablet: [16, 12, (c, x, y) => { R(c, x, y, 16, 12, '#222'); R(c, x + 1, y + 1, 14, 10, '#3a7ab0'); R(c, x + 3, y + 3, 4, 3, PAPER); R(c, x + 9, y + 3, 4, 3, '#f1c40f'); R(c, x + 3, y + 7, 10, 1, PAPER); }],
  heater: [22, 26, (c, x, y) => { R(c, x, y, 22, 26, '#2a2420'); R(c, x + 2, y + 2, 18, 18, '#1a1410'); for (let i = 0; i < 4; i++) R(c, x + 4, y + 5 + i * 4, 14, 1, '#5a3a22'); R(c, x + 6, y + 22, 10, 4, '#444'); R(c, x + 14, y - 3, 6, 3, '#3a3330'); }],
  mailbox: [16, 24, (c, x, y) => { R(c, x, y, 16, 10, '#2c4a8e'); R(c, x + 2, y + 2, 12, 2, '#1e3a6e'); R(c, x + 6, y + 10, 4, 14, '#555'); R(c, x + 12, y - 4, 2, 6, '#e74c3c'); R(c, x + 2, y + 5, 10, 3, PAPER); }],
  bench: [44, 16, (c, x, y) => { R(c, x, y, 44, 4, '#8a5a3c'); R(c, x, y + 6, 44, 3, '#8a5a3c'); R(c, x + 2, y + 9, 3, 7, '#333'); R(c, x + 39, y + 9, 3, 7, '#333'); }],
  board: [30, 22, (c, x, y) => { R(c, x, y, 30, 22, '#5a3a22'); R(c, x + 2, y + 2, 26, 18, '#c49a6c'); R(c, x + 4, y + 4, 8, 6, PAPER); R(c, x + 15, y + 5, 9, 7, '#bde0fe'); R(c, x + 6, y + 12, 9, 6, '#ffe28a'); }],
  car: [70, 30, (c, x, y) => { R(c, x + 14, y, 40, 12, '#2c3e50'); R(c, x + 18, y + 2, 14, 8, '#9fd3ff'); R(c, x + 35, y + 2, 15, 8, '#9fd3ff'); R(c, x, y + 10, 70, 14, '#34495e'); R(c, x + 66, y + 13, 4, 4, '#f1c40f'); R(c, x, y + 13, 3, 4, '#e74c3c'); R(c, x + 10, y + 20, 12, 10, '#111'); R(c, x + 48, y + 20, 12, 10, '#111'); R(c, x + 14, y + 23, 4, 4, '#888'); R(c, x + 52, y + 23, 4, 4, '#888'); }],
  oven: [30, 34, (c, x, y) => { R(c, x, y, 30, 34, '#95a5a6'); R(c, x + 3, y + 8, 24, 18, '#2c2c34'); R(c, x + 5, y + 10, 20, 14, '#3a2a20'); for (let i = 0; i < 4; i++) R(c, x + 4 + i * 6, y + 2, 3, 3, '#333'); }],
  book: [18, 12, (c, x, y) => { R(c, x, y, 18, 12, '#8e2c2c'); R(c, x + 2, y + 1, 14, 10, PAPER); R(c, x + 8, y, 2, 12, '#5a1a1a'); R(c, x + 3, y + 3, 4, 1, '#888'); R(c, x + 11, y + 3, 4, 1, '#888'); }],
  window: [40, 30, (c, x, y, t) => { windowFrame(c, x, y, 40, 30, t, false); }],
  phone: [10, 16, (c, x, y) => { R(c, x, y, 10, 16, '#222'); R(c, x + 1, y + 2, 8, 11, '#3a7ab0'); R(c, x + 4, y + 14, 2, 1, '#666'); }],
  bulletin: [36, 26, (c, x, y) => { R(c, x, y, 36, 26, '#5a3a22'); R(c, x + 2, y + 2, 32, 22, '#c49a6c'); R(c, x + 4, y + 4, 10, 8, PAPER); R(c, x + 17, y + 4, 12, 10, '#ffe28a'); R(c, x + 6, y + 14, 12, 8, '#bde0fe'); R(c, x + 22, y + 16, 9, 6, PAPER); }],
  goal: [40, 30, (c, x, y) => { R(c, x, y, 40, 3, PAPER); R(c, x, y, 3, 30, PAPER); R(c, x + 37, y, 3, 30, PAPER); for (let i = 1; i < 8; i++) R(c, x + i * 5, y + 3, 1, 27, '#ddd'); for (let j = 1; j < 6; j++) R(c, x + 3, y + j * 5, 34, 1, '#ddd'); }],
  person: [12, 24, () => {}],
};

function drawProp(c, h, t) {
  if (h.prop === 'person') { drawPerson(c, h.x, h.y, h.look, { scale: h.scale || 1.5, dir: h.dir || 'down' }); return; }
  const p = PROPS[h.prop] || PROPS.papers; p[2](c, h.x, h.y, t);
}
function propRect(h) {
  if (h.prop === 'person') { const s = h.scale || 1.5; return [h.x, h.y, 12 * s, 24 * s]; }
  const p = PROPS[h.prop] || PROPS.papers; return [h.x, h.y, p[0], p[1]];
}
function sparkle(c, x, y, t) {
  const k = Math.floor(t * 4) % 4; if (k === 3) return;
  const col = k === 1 ? '#fff' : '#ffd166';
  R(c, x, y - 2 - k, 1, 2 + k * 2 + 1, col); R(c, x - 2 - k, y, 2 + k * 2 + 1, 1, col);
}

// ---------------------------------------------------------------------
//  Title screen
// ---------------------------------------------------------------------
function drawTitle(c, t) {
  skyline(c, 0, 0, 320, 180, t, true);
  c.fillStyle = 'rgba(10,10,30,0.4)'; c.fillRect(0, 0, 320, 180);
  // courthouse
  R(c, 90, 70, 140, 110, '#cfc8b8'); R(c, 80, 60, 160, 12, '#e0d8c8');
  c.fillStyle = '#e0d8c8'; c.beginPath(); c.moveTo(78, 60); c.lineTo(160, 28); c.lineTo(242, 60); c.fill();
  c.fillStyle = '#b8b0a0'; c.beginPath(); c.moveTo(100, 58); c.lineTo(160, 36); c.lineTo(220, 58); c.fill();
  for (let i = 0; i < 6; i++) { R(c, 98 + i * 24, 74, 10, 86, '#ece6d8'); R(c, 96 + i * 24, 72, 14, 3, PAPER); R(c, 96 + i * 24, 158, 14, 3, PAPER); }
  R(c, 70, 160, 180, 6, '#b8b0a0'); R(c, 60, 166, 200, 6, '#a8a090'); R(c, 50, 172, 220, 8, '#989080');
  // scales of justice
  const sw = Math.sin(t * 1.5) * 2;
  R(c, 159, 40, 2, 14, '#d4af37'); R(c, 150, 42 + sw, 20, 1, '#d4af37'); R(c, 148, 44 + sw, 6, 2, '#d4af37'); R(c, 166, 44 - sw, 6, 2, '#d4af37');
}

// ---------------------------------------------------------------------
//  Evidence icons (16x16)
// ---------------------------------------------------------------------
function drawIcon(c, icon) {
  c.clearRect(0, 0, 16, 16);
  const r = (x, y, w, h, col) => R(c, x, y, w, h, col);
  switch (icon) {
    case 'photo': r(1, 3, 14, 11, PAPER); r(2, 4, 12, 8, '#3a7ab0'); r(2, 9, 12, 3, '#2c8e5a'); r(10, 5, 2, 2, '#f1c40f'); break;
    case 'receipt': r(4, 1, 8, 14, PAPER); for (let i = 0; i < 5; i++) r(5, 3 + i * 2, 6 - (i % 2) * 2, 1, '#888'); r(4, 14, 2, 1, '#0b0d16'); r(8, 14, 2, 1, '#0b0d16'); break;
    case 'video': r(1, 4, 11, 8, '#333'); r(12, 5, 3, 6, '#555'); r(3, 6, 4, 4, '#e74c3c'); r(8, 6, 2, 2, '#ddd'); break;
    case 'phone': r(4, 1, 8, 14, '#222'); r(5, 2, 6, 10, '#3a7ab0'); r(6, 4, 4, 1, PAPER); r(6, 6, 3, 1, PAPER); r(7, 13, 2, 1, '#666'); break;
    case 'knife': r(3, 9, 5, 3, '#5a3a22'); r(8, 8, 1, 5, '#888'); r(9, 9, 6, 2, '#ddd'); r(14, 10, 1, 1, '#ddd'); break;
    case 'chart': r(1, 1, 14, 14, PAPER); r(3, 9, 2, 5, '#3498db'); r(6, 6, 2, 8, '#e74c3c'); r(9, 4, 2, 10, '#2ecc71'); r(12, 7, 2, 7, '#f1c40f'); break;
    case 'letter': r(1, 4, 14, 9, PAPER); r(1, 4, 1, 9, '#bbb'); for (let i = 0; i < 7; i++) { r(1 + i, 4 + i * 0.6, 1, 1, '#999'); r(14 - i, 4 + i * 0.6, 1, 1, '#999'); } r(11, 5, 3, 3, '#e74c3c'); break;
    case 'badge': r(5, 1, 6, 4, '#c0392b'); r(4, 5, 8, 8, '#d4af37'); r(6, 7, 4, 4, '#b8860b'); r(7, 8, 2, 2, PAPER); break;
    case 'medical': r(2, 1, 12, 14, PAPER); r(7, 3, 2, 7, '#e74c3c'); r(4, 5, 8, 2, '#e74c3c'); r(4, 12, 8, 1, '#888'); break;
    case 'money': r(1, 4, 14, 8, '#2ecc71'); r(2, 5, 12, 6, '#27ae60'); r(6, 6, 4, 4, '#2ecc71'); r(7, 7, 2, 2, '#1e8449'); break;
    case 'bank': r(2, 6, 12, 8, '#bdc3c7'); r(1, 4, 14, 2, '#95a5a6'); r(8, 1, 1, 3, '#95a5a6'); for (let i = 0; i < 4; i++) r(3 + i * 3, 7, 1, 6, '#7f8c8d'); r(1, 14, 14, 1, '#7f8c8d'); break;
    case 'watch': r(6, 1, 4, 3, '#888'); r(6, 12, 4, 3, '#888'); r(4, 4, 8, 8, '#ddd'); r(5, 5, 6, 6, PAPER); r(8, 6, 1, 3, '#222'); r(8, 8, 2, 1, '#222'); break;
    case 'contract': r(2, 1, 12, 14, PAPER); for (let i = 0; i < 4; i++) r(4, 3 + i * 2, 8, 1, '#888'); r(4, 12, 5, 1, '#2c4a8e'); r(10, 11, 3, 3, '#c0392b'); break;
    case 'email': r(1, 2, 14, 11, '#22222b'); r(2, 3, 12, 9, '#2d6b9a'); r(3, 4, 10, 6, PAPER); r(3, 4, 5, 3, '#bbb'); r(8, 4, 5, 3, '#bbb'); r(6, 13, 4, 2, '#22222b'); break;
    case 'ticket': r(1, 4, 14, 8, '#f1c40f'); r(3, 6, 6, 1, '#1b1b24'); r(3, 8, 8, 1, '#1b1b24'); r(12, 5, 2, 6, '#e67e22'); break;
    case 'glove': r(3, 6, 9, 8, '#5a3a22'); r(3, 2, 2, 5, '#5a3a22'); r(5, 1, 2, 5, '#5a3a22'); r(7, 1, 2, 5, '#5a3a22'); r(9, 2, 2, 5, '#5a3a22'); r(12, 7, 3, 2, '#5a3a22'); r(6, 9, 3, 2, '#8e1b1b'); break;
    case 'calendar': r(1, 3, 14, 12, PAPER); r(1, 3, 14, 3, '#e74c3c'); r(4, 1, 2, 4, '#555'); r(10, 1, 2, 4, '#555'); for (let i = 0; i < 9; i++) r(3 + (i % 3) * 4, 7 + Math.floor(i / 3) * 3, 2, 2, i === 4 ? '#e74c3c' : '#888'); break;
    case 'camera': r(1, 5, 14, 9, '#333'); r(4, 3, 4, 2, '#333'); r(5, 7, 6, 6, '#666'); r(6, 8, 4, 4, '#3a7ab0'); r(12, 6, 2, 1, '#f1c40f'); break;
    case 'fire': r(5, 2, 2, 3, '#e74c3c'); r(4, 5, 8, 8, '#e74c3c'); r(9, 3, 2, 3, '#e67e22'); r(5, 7, 6, 6, '#f39c12'); r(6, 10, 4, 3, '#f1c40f'); break;
    case 'thermometer': r(7, 1, 3, 11, PAPER); r(8, 6, 1, 6, '#3498db'); r(6, 11, 5, 4, '#3498db'); r(10, 3, 2, 1, '#888'); r(10, 6, 2, 1, '#888'); break;
    case 'drawing': r(1, 2, 14, 12, PAPER); r(3, 6, 2, 5, '#3498db'); r(6, 7, 2, 4, '#e74c3c'); r(10, 8, 2, 3, '#f1c40f'); r(2, 3, 12, 1, '#f1c40f'); r(2, 12, 12, 1, '#2ecc71'); break;
    case 'flour': r(3, 3, 10, 12, '#ecf0f1'); r(4, 1, 8, 3, '#d5d8dc'); r(5, 7, 6, 4, '#c49a6c'); break;
    default: r(2, 1, 12, 14, PAPER); r(9, 1, 5, 4, '#ccc'); for (let i = 0; i < 5; i++) r(4, 5 + i * 2, 8 - (i % 2) * 3, 1, '#888');
  }
}
