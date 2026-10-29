// Kan du det?! — engine: save, screens, comic panels, tappable Danish, HUD, feedback.
(function (K) {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const wait = (ms) => new Promise((r) => setTimeout(r, K.fast ? Math.min(ms, 30) : ms));
  K.$ = $; K.el = el; K.wait = wait;
  K.fast = /[?&]fast/.test(location.search);

  // ---------- save ----------
  const KEY = 'kandudet.v1';
  const DEF_SETTINGS = { music: true, voice: true, sfx: true, anim: true };
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  K.save = load();
  K.save.settings = Object.assign({}, DEF_SETTINGS, K.save.settings || {});
  K.save.stats = Object.assign({ runs: 0, done: 0, endings: {}, best: null, ranks: {}, missed: {}, unlocked: {} }, K.save.stats || {});
  K.settings = K.save.settings;
  K.persist = function () { try { localStorage.setItem(KEY, JSON.stringify(K.save)); } catch (e) {} };

  K.newRun = function () {
    return {
      step: 0, socks: 400, mistakes: [], tags: [], bound: [], follower: null, gunMine: false,
      scarf: null, jacket: null, stirren: [], auction: null, money: 1000, flat: [], ending: null,
      english: 0, ranks: {}, fixed: 0, recoloured: false, suit: false, clock: '08:00', who: 'holger', socksHidden: true,
    };
  };

  // ---------- Danish text: every word tappable ----------
  const WORD = /([A-Za-zÆØÅæøåÉé'-]+)/;
  function glossOf(w) {
    const k = w.toLowerCase().replace(/^'+|'+$/g, '');
    return K.DICT[k] || K.DICT[k.replace(/(en|et|ne|erne|ene)$/, '')] || null;
  }
  K.glossOf = glossOf;
  function daHTML(text) {
    return String(text).split(WORD).map((part, i) => {
      if (i % 2 === 1) return `<span class="w" data-w="${part}">${part}</span>`;
      return part.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    }).join('');
  }
  K.daHTML = daHTML;
  let tipEl = null;
  function showTip(span) {
    hideTip();
    const g = glossOf(span.dataset.w); if (!g) return;
    tipEl = el('div', 'tip', `<b>${span.dataset.w}</b> ${g}`);
    document.body.appendChild(tipEl);
    const r = span.getBoundingClientRect();
    const x = Math.max(8, Math.min(window.innerWidth - tipEl.offsetWidth - 8, r.left + r.width / 2 - tipEl.offsetWidth / 2));
    tipEl.style.left = x + 'px'; tipEl.style.top = Math.max(8, r.top - tipEl.offsetHeight - 8) + 'px';
    setTimeout(hideTip, 2600);
  }
  function hideTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
  // Tap a word: show its meaning. Long-press inside buttons does the same without pressing them.
  document.addEventListener('click', (e) => {
    const w = e.target.closest && e.target.closest('.w');
    if (w && !w.closest('button')) { e.stopPropagation(); showTip(w); return; }
    if (!w) hideTip();
  }, true);
  let lp = null;
  document.addEventListener('pointerdown', (e) => {
    const w = e.target.closest && e.target.closest('button .w'); if (!w) return;
    lp = setTimeout(() => { lp = 'fired'; showTip(w); }, 450);
  });
  document.addEventListener('pointerup', () => { if (lp && lp !== 'fired') clearTimeout(lp); });
  document.addEventListener('click', (e) => { if (lp === 'fired') { lp = null; e.stopPropagation(); e.preventDefault(); } }, true);

  // ---------- HUD ----------
  const WHO = {
    gun: { name: 'Mærkepistolen', cls: 'cap' }, holger: { name: 'Holger', cls: 'b-holger' }, ellen: { name: 'Ellen', cls: 'b-ellen' },
    lilla: { name: 'Kvinden i lilla', cls: 'b-rival' }, donor1: { name: 'Manden i ternet', cls: 'b-rival' }, donor2: { name: 'Damen med prikker', cls: 'b-rival' },
    donor3: { name: 'Den lille dame', cls: 'b-rival' }, auctioneer: { name: 'Auktionarius', cls: 'b-rival' }, impostor: { name: '"Holger"', cls: 'b-rival' },
    manden: { name: 'Manden', cls: 'b-holger' }, sok: { name: 'Sokken', cls: 'b-sock' }, stol: { name: 'Stolen', cls: 'b-sock' }, crowd: { name: 'Folk', cls: 'b-rival' },
    seller: { name: 'Sælgeren', cls: 'b-rival' }, kommode: { name: 'Kommoden', cls: 'b-rival' },
  };
  K.WHO = WHO;
  // which recorded voice each speaker uses (tools/voices.py reads this)
  K.VOICE_OF = { gun: 'Orus', holger: 'Puck', manden: 'Puck', ellen: 'Aoede', lilla: 'Leda', donor1: 'Algieba', donor2: 'Kore', donor3: 'Gacrux',
    auctioneer: 'Sadachbia', impostor: 'Fenrir', sok: 'Achird', stol: 'Zubenelgenubi', crowd: 'Algenib', seller: 'Schedar', kommode: 'Rasalgethi', w: 'Iapetus', we: 'Aoede' };

  function hud() {
    const h = $('#hud'); if (!h) return;
    const st = K.st;
    h.hidden = !st;
    if (!st) return;
    $('#crate').hidden = !!st.socksHidden;
    document.body.classList.toggle('gun-green', !!st.recoloured);
    $('#socks').textContent = st.socks;
    $('#clock').textContent = st.clock || '';
  }
  K.hud = hud;
  K.sock = function (n, why) {
    const st = K.st; if (!st || !n) return;
    st.socks = Math.max(0, st.socks + n);
    hud();
    const b = $('#crate'); if (b) { b.classList.remove('bump', 'drop'); void b.offsetWidth; b.classList.add(n > 0 ? 'bump' : 'drop'); }
    K.audio.sfx(n > 0 ? 'sock' : 'unsock');
    if (why && !st.socksHidden) toast((n > 0 ? '+' : '') + n + ' sok · ' + why, n > 0 ? 'bad' : 'good');
  };
  function toast(t, cls) {
    const e = el('div', 'toast ' + (cls || ''), t); document.body.appendChild(e);
    setTimeout(() => e.classList.add('out'), 1600); setTimeout(() => e.remove(), 2200);
  }
  K.toast = toast;

  // A mistake on a phrase: remembered for spaced review and (on Saturday) as Holger's fingerprint.
  K.mistake = function (rec) {
    const st = K.st; if (st) st.mistakes.push(rec);
    const m = K.save.stats.missed; m[rec.right] = (m[rec.right] || 0) + 1;
    const r = K.save.stats.review = K.save.stats.review || {};
    if (rec.noun && rec.adj && rec.det && K.N[rec.noun] && K.A[rec.adj]) r[rec.right] = { noun: rec.noun, adj: rec.adj, det: rec.det };
  };
  // spaced review: phrases missed in earlier runs come back (most-missed first)
  K.reviewItems = function (k) {
    const m = K.save.stats.missed, r = K.save.stats.review || {};
    return Object.keys(r).filter((p) => m[p] > 0).sort((a, b) => m[b] - m[a]).slice(0, k).map((p) => r[p]);
  };
  K.gotRight = function (right) { const m = K.save.stats.missed; if (m[right]) { m[right]--; if (m[right] <= 0) delete m[right]; } };

  // ---------- feedback ----------
  K.feedback = function (root, ok, right, whyText) {
    const f = el('div', 'fb ' + (ok ? 'ok' : 'no'));
    f.innerHTML = ok ? `<span class="fx">${K.pick(['SIKKE!', 'PRÆCIS!', 'JA!', 'FLOT!'])}</span>` :
      `<span class="fx">${K.pick(['NEJ!', 'AV!', 'BEIGE…'])}</span><div class="right">${daHTML(right)}</div>` + (whyText ? `<button class="why" type="button">Hvorfor?</button><div class="rule" hidden>${whyText}</div>` : '');
    root.appendChild(f);
    const w = f.querySelector('.why'); if (w) w.onclick = () => { f.querySelector('.rule').hidden = false; w.remove(); };
    K.audio.sfx(ok ? 'ok' : 'bad');
    return f;
  };

  // ---------- screens ----------
  function screen(cls) {
    const s = $('#screen'); s.className = 'screen ' + (cls || ''); s.innerHTML = ''; hideTip();
    return s;
  }
  K.screen = screen;

  // Comic panel with lines. Lines appear one by one; only Videre (or empty space below) advances.
  K.panel = async function (p) {
    const st = K.st;
    const s = screen('panel ' + (p.fx || ''));
    const art = el('div', 'art');
    if (p.img) { const im = el('img'); im.src = 'img/' + p.img + '.webp'; im.alt = ''; art.appendChild(im); }
    if (p.sfx) { const sx = el('div', 'onoma ' + (p.sfxCls || ''), p.sfx); art.appendChild(sx); }
    if (p.overlay) art.appendChild(p.overlay(st));
    s.appendChild(art);
    const box = el('div', 'lines'); s.appendChild(box);
    const bar = el('div', 'bar'); s.appendChild(bar);
    const next = el('button', 'next', 'Videre ▸'); next.type = 'button'; bar.appendChild(next);
    if (p.sound) K.audio.sfx(p.sound);
    const lines = (p.lines || []).map((l) => (typeof l === 'function' ? l(st) : l)).flat().filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const row = renderLine(l);
      box.appendChild(row); row.scrollIntoView({ block: 'end', behavior: K.fast ? 'auto' : 'smooth' });
      let spoken = Promise.resolve();
      if (l.da && l.w) spoken = K.audio.say(l.w, l.da);
      // English captions and thoughts flow on by themselves; the player taps after Danish lines and at the end
      if (!l.da && i < lines.length - 1) { await wait(350); continue; }
      await new Promise((res) => { next.onclick = () => { K.audio.sfx('tap'); res(); }; box.onclick = (e) => { if (e.target === box) res(); }; });
      if (l.da && l.w && !K.fast) await Promise.race([spoken, wait(10)]);
    }
    next.onclick = null;
  };
  function renderLine(l) {
    if (l.cap) return el('div', 'cap-en', l.cap);
    if (l.th) return el('div', 'think', l.th);
    const w = WHO[l.w] || { name: l.w, cls: 'b-rival' };
    const row = el('div', 'line ' + w.cls);
    if (w.cls !== 'cap') row.appendChild(el('div', 'who', l.name || w.name));
    const t = el('div', 'da', daHTML(l.da)); row.appendChild(t);
    const tools = el('div', 'tools');
    const hear = el('button', 'mini', '▶'); hear.type = 'button'; hear.title = 'Hør'; hear.onclick = (e) => { e.stopPropagation(); K.audio.say(l.w, l.da, true); };
    tools.appendChild(hear);
    if (l.en) {
      const tr = el('button', 'mini', 'EN'); tr.type = 'button'; tr.title = 'Oversæt (koster en sok)';
      tr.onclick = (e) => { e.stopPropagation(); if (tr.dataset.done) return; tr.dataset.done = 1; row.appendChild(el('div', 'en', l.en)); if (K.st) { K.st.english++; K.sock(1, 'engelsk'); } };
      tools.appendChild(tr);
    }
    row.appendChild(tools);
    return row;
  }
  K.renderLine = renderLine;

  // Time / chapter card.
  K.card = async function (title, sub, cls) {
    const s = screen('card ' + (cls || ''));
    s.appendChild(el('div', 'big', title));
    if (sub) s.appendChild(el('div', 'sub', sub));
    K.audio.sfx('zoom');
    await wait(2200);
  };

  // Choice in Danish (or English, with a cost). options: [{da|en, ...}] → index
  K.choose = function (prompt, options, who) {
    return new Promise((res) => {
      const s = $('#screen');
      const c = el('div', 'choice');
      if (prompt) c.appendChild(el('div', 'prompt', prompt));
      options.forEach((o, i) => {
        const b = el('button', 'opt' + (o.en && !o.da ? ' english' : ''), o.da ? daHTML(o.da) : o.en); b.type = 'button';
        b.onclick = () => { K.audio.sfx('tap'); c.remove(); if (o.da && who) K.audio.say(who, o.da); res(i); };
        c.appendChild(b);
      });
      s.appendChild(c); c.scrollIntoView({ block: 'end' });
    });
  };

  // Full-screen game frame
  K.gameFrame = function (title, sub) {
    const s = screen('game');
    const head = el('div', 'ghead', `<div class="gt">${title}</div>` + (sub ? `<div class="gs">${sub}</div>` : ''));
    s.appendChild(head);
    const body = el('div', 'gbody'); s.appendChild(body);
    return { s, body, head };
  };
  K.rank = function (score, max) { const r = max ? score / max : 1; return r >= 0.95 ? 'S' : r >= 0.8 ? 'A' : r >= 0.6 ? 'B' : 'C'; };
  K.resultStamp = async function (id, score, max, extra) {
    const r = K.rank(score, max);
    const best = K.save.stats.ranks[id];
    if (!best || 'SABC'.indexOf(r) < 'SABC'.indexOf(best)) K.save.stats.ranks[id] = r;
    K.save.stats.unlocked[id] = true; K.persist();
    if (K.st) K.st.ranks[id] = r;
    const s = $('#screen');
    const st = el('div', 'stamp', `<div class="rk rk-${r}">${r}</div><div class="sc">${score} / ${max}</div>` + (extra ? `<div class="ex">${extra}</div>` : ''));
    const b = el('button', 'next', 'Videre ▸'); b.type = 'button'; st.appendChild(b);
    s.appendChild(st); K.audio.sfx('boom');
    await new Promise((res) => (b.onclick = res));
  };

  // ---------- object cards: white ink drawings tinted to the exact colour and pattern ----------
  const imgCache = {}, cardCache = {};
  function loadImg(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
    return imgCache[src];
  }
  K.loadImg = loadImg;
  // returns a canvas (size px) of noun in colour adj (+ pattern adj)
  K.objCanvas = async function (noun, colour, pattern, size) {
    size = size || 256;
    const key = [noun, colour, pattern, size].join('|');
    if (cardCache[key]) { const c = document.createElement('canvas'); c.width = c.height = size; c.getContext('2d').drawImage(cardCache[key], 0, 0); return c; }
    const n = K.N[noun]; const img = await loadImg('img/o/' + (n ? n.art : noun) + '.webp');
    const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
    if (!img) { g.fillStyle = '#ccc'; g.fillRect(0, 0, size, size); return c; }
    g.drawImage(img, 0, 0, size, size);
    const tint = document.createElement('canvas'); tint.width = tint.height = size; const t = tint.getContext('2d');
    const col = colour ? K.A[colour].col : '#ffffff';
    t.fillStyle = col; t.fillRect(0, 0, size, size);
    if (pattern) {
      const pc = K.A[pattern].pat; t.fillStyle = pattern === 'ternet' ? 'rgba(0,0,0,.28)' : (colour === 'sort' ? '#fff' : '#111');
      const st = size / 12;
      if (pc === 'dots') for (let y = st / 2; y < size; y += st) for (let x = (Math.round(y / st) % 2) * st / 2; x < size; x += st) { t.beginPath(); t.arc(x, y, st * 0.22, 0, 7); t.fill(); }
      if (pc === 'stripes') for (let x = 0; x < size; x += st) t.fillRect(x, 0, st * 0.4, size);
      if (pc === 'checks') { for (let x = 0; x < size; x += st * 2) t.fillRect(x, 0, st, size); for (let y = 0; y < size; y += st * 2) t.fillRect(0, y, size, st); }
    }
    g.globalCompositeOperation = 'multiply'; g.drawImage(tint, 0, 0);
    g.globalCompositeOperation = 'destination-in'; g.drawImage(img, 0, 0, size, size);
    g.globalCompositeOperation = 'source-over';
    const keep = document.createElement('canvas'); keep.width = keep.height = size; keep.getContext('2d').drawImage(c, 0, 0); cardCache[key] = keep;
    return c;
  };
  K.objImg = async function (noun, colour, pattern, size) { const c = await K.objCanvas(noun, colour, pattern, size); const i = new Image(); i.src = c.toDataURL(); i.className = 'obj'; i.alt = ''; return i; };

  // ---------- story runner ----------
  K.runStory = async function () {
    const st = K.st;
    while (st.step < K.STORY.length) {
      const s = K.STORY[st.step];
      K.persist();
      try { await runStep(s); }
      catch (e) { console.error(e); showError(e); return; }
      st.step++;
      K.save.run = st; K.persist();
    }
  };
  async function runStep(s) {
    const st = K.st;
    if (s.if && !s.if(st)) return;
    if (s.clock) { st.clock = s.clock; hud(); }
    if (s.who) st.who = s.who;
    if (s.music) K.audio.playMusic(s.music);
    if (s.t === 'card') return K.card(s.title, s.sub, s.cls);
    if (s.t === 'panel') return K.panel(s);
    if (s.t === 'do') return s.fn(st);
    if (s.t === 'choice') {
      if (s.panel) await K.panel(s.panel);
      const opts = typeof s.options === 'function' ? s.options(st) : s.options;
      const i = await K.choose(s.prompt, opts, s.who);
      if (opts[i].fn) await opts[i].fn(st);
      if (opts[i].after) await K.panel({ img: s.panel && s.panel.img, lines: opts[i].after });
      return;
    }
    if (s.t === 'game') {
      const g = K.G[s.id];
      return g.run(Object.assign({ story: true }, s.params || {}));
    }
  }
  function showError(e) {
    const s = $('#screen');
    const b = el('div', 'err', `Noget gik galt (${String(e && e.message || e).slice(0, 120)}). <button type="button">Prøv igen</button>`);
    s.appendChild(b); b.querySelector('button').onclick = () => K.runStory();
    window.__kddErrors = (window.__kddErrors || []).concat(String(e && e.stack || e));
  }
  window.addEventListener('error', (e) => { window.__kddErrors = (window.__kddErrors || []).concat(String(e.message)); });
  window.addEventListener('unhandledrejection', (e) => { window.__kddErrors = (window.__kddErrors || []).concat(String(e.reason && e.reason.stack || e.reason)); });
})(window.K = window.K || {});
