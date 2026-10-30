// dansk-kit core: save, screen router, screen context (timers, listeners, loop, input lock),
// error box + watchdog, version sticker, tappable Danish, feedback, flow runner.
// Game code never touches timers or listeners directly: it uses the screen context `s`,
// so everything dies with the screen and stale async chains simply stop.
(function (K) {
  'use strict';
  const isBrowser = typeof document !== 'undefined' && !!document.createElement;
  K.fast = isBrowser && /[?&]fast/.test(location.search);
  K.debug = isBrowser && /[?&]debug/.test(location.search);
  const $ = (q, r) => (r || document).querySelector(q);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const ms = (n) => (K.fast ? Math.min(n, 30) : n);
  K.$ = $; K.el = el;
  K.pick = (a) => a[Math.floor(Math.random() * a.length)];
  K.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  K.esc = (t) => String(t).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  // A promise that never blocks the game: resolves when p settles or after `limit` ms, whichever first.
  K.timeout = (p, limit) => Promise.race([Promise.resolve(p).catch(() => {}), new Promise((r) => setTimeout(r, ms(limit)))]);

  // ---------- errors ----------
  window.__errors = window.__errors || [];
  let errBox = null;
  K.report = function (e) {
    const msg = String((e && (e.stack || e.message)) || e);
    window.__errors.push(msg);
    console.error(e);
    if (!isBrowser || errBox) return;
    errBox = el('div', 'errbox', `<b>Noget gik galt.</b><small>${K.esc(String((e && e.message) || e).slice(0, 140))}</small>`);
    const go = el('button', 'btn', 'Fortsæt'); go.type = 'button'; go.dataset.tap = '1';
    go.onclick = () => { errBox.remove(); errBox = null; K.resume(); };
    const home = el('button', 'btn ghost', 'Til start'); home.type = 'button'; home.dataset.tap = '1';
    home.onclick = () => { errBox.remove(); errBox = null; K.show('title'); };
    errBox.append(go, home); document.body.appendChild(errBox);
  };
  if (isBrowser) {
    window.addEventListener('error', (e) => K.report(e.error || e.message));
    window.addEventListener('unhandledrejection', (e) => K.report(e.reason));
  }
  // Wrap any callback so it never runs on a dead screen and never throws into the void.
  const guard = (s, fn) => function () { if (s && !s.alive()) return; try { return fn.apply(this, arguments); } catch (e) { K.report(e); } };

  // ---------- save (versioned; old saves load with defaults) ----------
  const SAVE_V = 1;
  const defaults = () => ({ v: SAVE_V, settings: { music: true, sfx: true, voice: true }, stats: { runs: 0, done: 0, ranks: {}, endings: {}, missed: {} }, run: null });
  K.loadSave = function () {
    let s = {};
    try { s = JSON.parse(localStorage.getItem('dk.' + K.CONFIG.id)) || {}; } catch (e) { s = {}; }
    const d = defaults();
    const out = Object.assign(d, s);
    out.settings = Object.assign(d.settings, s.settings || {});
    out.stats = Object.assign(defaults().stats, s.stats || {});
    if (s.v !== SAVE_V) { out.run = K.migrate ? K.migrate(s) : null; out.v = SAVE_V; } // a run from an older version is dropped unless the game migrates it
    K.save = out; K.settings = out.settings;
    return out;
  };
  K.persist = function () { try { localStorage.setItem('dk.' + K.CONFIG.id, JSON.stringify(K.save)); } catch (e) { /* private mode: play on */ } };

  // ---------- screen router ----------
  K.SCREENS = K.SCREENS || {};
  let cur = null, token = 0;
  const modals = new Set();
  function makeCtx(t, id) {
    const timers = new Set(), offs = [];
    const s = {
      id, token: t, locked: false, busy: false, bot: null, cleanup: [], finished: false,
      alive: () => t === token,
      timer(fn, n) { const h = setTimeout(() => { timers.delete(h); guard(s, fn)(); }, ms(n)); timers.add(h); return h; },
      every(fn, n) { const h = setInterval(guard(s, fn), n); timers.add(h); return h; },
      // resolves only while the screen is alive; on a dead screen the chain just stops (the run token)
      wait(n) { return new Promise((r) => s.timer(r, n)); },
      on(target, ev, fn, opt) { const g = guard(s, fn); target.addEventListener(ev, g, opt); offs.push(() => target.removeEventListener(ev, g, opt)); },
      // requestAnimationFrame loop that cannot die: errors are reported, the next frame is always scheduled
      loop(fn) {
        let last = performance.now();
        const step = (now) => { if (!s.alive()) return; try { fn(Math.min(0.05, (now - last) / 1000), now); } catch (e) { K.report(e); } last = now; requestAnimationFrame(step); };
        requestAnimationFrame(step);
      },
      // a tappable button. opts.answer: the tap completes an answer, so further taps are locked until s.unlock()
      btn(parent, html, fn, opts) {
        opts = opts || {};
        const b = el('button', 'btn ' + (opts.cls || ''), html); b.type = 'button'; b.dataset.tap = '1';
        if (opts.data) Object.assign(b.dataset, opts.data);
        b.addEventListener('click', guard(s, (e) => {
          if (opts.answer) { if (s.locked) return; s.locked = true; }
          if (!opts.silent) K.SFX.play('tap');
          fn(e, b);
        }));
        if (parent) parent.appendChild(b);
        return b;
      },
      unlock() { s.locked = false; },
      finish(result) { if (!s.alive() || s.finished) return; s.finished = true; K.next(result); },
    };
    s._dispose = () => { timers.forEach((h) => { clearTimeout(h); clearInterval(h); }); offs.forEach((f) => f()); s.cleanup.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); };
    return s;
  }
  // Show a screen. Kills the old one completely first: timers, listeners, overlays, voice queue, modals.
  K.show = function (id, params) {
    const S = K.SCREENS[id];
    if (!S) { K.report(new Error('unknown screen: ' + id)); return; }
    if (cur) cur._dispose();
    modals.forEach((m) => m.remove()); modals.clear();
    K.VOICE.stop(); hideTip();
    const t = ++token;
    const root = $('#screen'); root.className = 'screen s-' + id; root.innerHTML = '';
    cur = makeCtx(t, id); cur.params = params || {}; K.cur = cur;
    if (id !== 'title') addMenuButton(root, cur);
    try { const r = S(root, params || {}, cur); if (r && r.catch) r.catch(K.report); } catch (e) { K.report(e); }
    return cur;
  };
  // A modal over the current screen (settings, journal). Closed by the router; elements looked up inside it only.
  K.modal = function (build) {
    const m = el('div', 'modal'); const box = el('div', 'mbox'); m.appendChild(box);
    const close = () => { m.remove(); modals.delete(m); };
    const x = el('button', 'btn ghost mclose', 'Luk'); x.type = 'button'; x.dataset.tap = '1'; x.onclick = close;
    build(box, close); box.appendChild(x);
    m.addEventListener('click', (e) => { if (e.target === m) close(); });
    document.body.appendChild(m); modals.add(m);
    return { el: m, close };
  };
  function addMenuButton(root, s) {
    const b = el('button', 'menu-btn', '☰'); b.type = 'button'; b.dataset.tap = '1'; b.setAttribute('aria-label', 'Menu');
    b.onclick = () => K.modal((box, close) => {
      box.appendChild(el('h2', '', 'Menu'));
      K.settingsUI(box);
      const home = el('button', 'btn', 'Til start'); home.type = 'button'; home.dataset.tap = '1';
      home.onclick = () => { close(); K.show('title'); };
      box.appendChild(home);
    });
    root.appendChild(b);
  }
  K.settingsUI = function (box) {
    [['music', 'Musik'], ['sfx', 'Lyde'], ['voice', 'Dansk stemme']].forEach(([k, label]) => {
      const row = el('label', 'toggle', `<input type="checkbox" ${K.settings[k] ? 'checked' : ''}> ${label}`);
      row.querySelector('input').addEventListener('change', (e) => { K.settings[k] = e.target.checked; K.persist(); if (k === 'music') K.MUSIC.refresh(); });
      box.appendChild(row);
    });
    const test = el('button', 'btn ghost', '▶ Test stemmen'); test.type = 'button'; test.dataset.tap = '1';
    test.onclick = () => K.VOICE.say('Hej! Kan du høre mig?', null, true);
    box.appendChild(test);
    box.appendChild(el('div', 'small', K.VOICE.available() ? 'Dansk stemme fundet.' : 'Ingen dansk stemme på denne telefon. Teksten er altid på skærmen.'));
  };

  // ---------- watchdog: never leave the player with nothing to tap ----------
  if (isBrowser) {
    let idle = 0;
    setInterval(() => {
      if (!cur || errBox || cur.busy) { idle = 0; return; }
      const any = [...document.querySelectorAll('#screen [data-tap], .modal [data-tap], #screen button, .modal button')]
        .some((b) => !b.disabled && b.offsetParent !== null && !b.classList.contains('menu-btn'));
      idle = any ? 0 : idle + 1;
      if (idle >= 8) { idle = 0; K.report(new Error('stuck: nothing to tap on screen "' + cur.id + '"')); }
    }, 1000);
  }

  // ---------- version sticker: an open game offers the new version ----------
  K.checkVersion = async function () {
    if (!isBrowser || K.debug) return;
    try {
      const v = (await (await fetch('version.txt?' + Date.now(), { cache: 'no-store' })).text()).trim();
      if (/^\d{14}$/.test(v) && v > K.VERSION && !$('.newver')) {
        const b = el('button', 'newver', 'Ny version ↻'); b.type = 'button';
        b.onclick = () => { K.persist(); location.reload(); };
        document.body.appendChild(b);
      }
    } catch (e) { /* offline */ }
  };

  // ---------- Danish text: every word tappable ----------
  const WORD = /([A-Za-zÆØÅæøåÉé'-]+)/;
  K.glossOf = function (w) {
    const k = String(w).toLowerCase().replace(/^'+|'+$/g, '');
    if (K.NAMES && K.NAMES.includes(w)) return 'navn';
    const D = K.DICT;
    return D[k] || D[k.replace(/(erne|ene|en|et|ne|er|e|t|s)$/, '')] || null;
  };
  K.da = function (text) {
    return String(text).split(WORD).map((part, i) => (i % 2 ? `<span class="w" data-w="${part}">${part}</span>` : K.esc(part))).join('');
  };
  let tipEl = null, tipT = null;
  function showTip(span) {
    hideTip();
    const g = K.glossOf(span.dataset.w); if (!g) return;
    tipEl = el('div', 'tip', `<b>${K.esc(span.dataset.w)}</b> ${K.esc(g)}`);
    document.body.appendChild(tipEl);
    const r = span.getBoundingClientRect();
    tipEl.style.left = Math.max(8, Math.min(innerWidth - tipEl.offsetWidth - 8, r.left + r.width / 2 - tipEl.offsetWidth / 2)) + 'px';
    tipEl.style.top = Math.max(8, r.top - tipEl.offsetHeight - 8) + 'px';
    tipT = setTimeout(hideTip, 2600);
  }
  function hideTip() { if (tipEl) { tipEl.remove(); tipEl = null; clearTimeout(tipT); } }
  if (isBrowser) {
    // tap a word outside buttons: its meaning; long-press inside a button: the same, without pressing it
    document.addEventListener('click', (e) => {
      const w = e.target.closest && e.target.closest('.w');
      if (w && !w.closest('button')) { e.stopPropagation(); showTip(w); return; }
      if (!w) hideTip();
    }, true);
    let lp = null;
    document.addEventListener('pointerdown', (e) => { const w = e.target.closest && e.target.closest('button .w'); if (w) lp = setTimeout(() => { lp = 'fired'; showTip(w); }, 450); });
    document.addEventListener('pointerup', () => { if (lp && lp !== 'fired') clearTimeout(lp); });
    document.addEventListener('click', (e) => { if (lp === 'fired') { lp = null; e.stopPropagation(); e.preventDefault(); } }, true);
  }

  // ---------- feedback ----------
  K.toast = function (t, cls) {
    const e = el('div', 'toast ' + (cls || ''), K.esc(t)); document.body.appendChild(e);
    setTimeout(() => e.classList.add('out'), 1400); setTimeout(() => e.remove(), 2000);
  };
  // Right/wrong feedback. A wrong answer shows the right Danish and an optional rule ("Hvorfor?").
  K.feedback = function (s, root, ok, right, rule) {
    const f = el('div', 'fb ' + (ok ? 'ok' : 'no'));
    f.innerHTML = ok ? `<span class="fx">${K.pick(K.CONFIG.yes || ['Ja!'])}</span>`
      : `<span class="fx">${K.pick(K.CONFIG.no || ['Nej!'])}</span><div class="right">${K.da(right)}</div>`;
    if (!ok && rule) {
      const r = el('div', 'rule', rule); r.hidden = true;
      s.btn(f, 'Hvorfor?', (e, b) => { r.hidden = false; b.remove(); }, { cls: 'ghost small', silent: true });
      f.appendChild(r);
    }
    root.appendChild(f);
    K.SFX.play(ok ? 'ok' : 'bad');
    if (!ok && right) K.mistake(right);
    else if (ok && right) K.gotRight(right);
    return f;
  };
  // After an answer: right → move on after ~0.4 s; wrong → wait for one tap so the correction can be read.
  K.after = function (s, root, ok) {
    if (ok || K.fast) return s.wait(ok ? 400 : 30);
    return new Promise((res) => { const b = s.btn(root, 'Videre ▸', () => { b.remove(); res(); }, { cls: 'next small', data: { next: '1' } }); b.scrollIntoView({ block: 'end' }); });
  };
  // Missed phrases come back in later runs (spaced review).
  K.mistake = (p) => { const m = K.save.stats.missed; m[p] = (m[p] || 0) + 1; };
  K.gotRight = (p) => { const m = K.save.stats.missed; if (m[p]) { m[p]--; if (m[p] <= 0) delete m[p]; } };
  K.rank = (score, max) => { const r = max ? score / max : 1; return r >= 0.95 ? 'S' : r >= 0.8 ? 'A' : r >= 0.6 ? 'B' : 'C'; };
  K.score = function (id, score, max) {
    const r = K.rank(score, max), best = K.save.stats.ranks[id];
    if (!best || 'SABC'.indexOf(r) < 'SABC'.indexOf(best)) K.save.stats.ranks[id] = r;
    if (K.st) { K.st.ranks[id] = r; K.st.score += score; }
    K.persist(); return r;
  };

  // ---------- mini-games ----------
  // K.game(id, { title, screen(root, params, s), texts(params) → [Danish strings], lint(params) → [errors] })
  // The screen must set s.bot = (mode) => element to tap ('right' | 'wrong'), so the playtest can play it.
  K.GAMES = K.GAMES || {};
  K.game = function (id, def) { K.GAMES[id] = def; K.SCREENS[id] = def.screen; };
  // Full-screen game frame (covers the whole screen; the playtest checks it).
  K.frame = function (root, title, sub) {
    const g = el('div', 'game');
    g.appendChild(el('div', 'ghead', `<div class="gt">${K.esc(title)}</div>` + (sub ? `<div class="gs">${K.esc(sub)}</div>` : '')));
    const body = el('div', 'gbody'); g.appendChild(body); root.appendChild(g);
    return { game: g, body };
  };
  // Rank stamp at the end of a mini-game; resolves on Videre.
  K.stamp = function (s, root, id, score, max) {
    const r = K.score(id, score, max);
    K.SFX.play(r === 'C' ? 'lose' : 'up');
    const st = el('div', 'stamp', `<div class="rk rk-${r}">${r}</div><div class="sc">${score} / ${max}</div>`);
    root.appendChild(st);
    return new Promise((res) => s.btn(st, 'Videre ▸', res, { cls: 'next', data: { next: '1' } }));
  };

  // ---------- flow: the game is a list of steps in data (K.FLOW) ----------
  K.newRun = () => Object.assign({ step: 0, score: 0, ranks: {}, flags: {}, english: 0 }, K.CONFIG.run ? K.CONFIG.run() : {});
  K.start = function (fresh) {
    if (fresh || !K.save.run) { K.save.stats.runs++; K.save.run = K.newRun(); }
    K.st = K.save.run; K.persist();
    K.goStep();
  };
  K.goStep = function () {
    const st = K.st;
    while (st.step < K.FLOW.length && K.FLOW[st.step].if && !K.FLOW[st.step].if(st)) st.step++;
    if (st.step >= K.FLOW.length) return K.show('end');
    const step = K.FLOW[st.step];
    if (step.music !== undefined) K.MUSIC.set(step.music);
    K.show(step.screen, step);
  };
  K.next = function () { if (!K.st) return K.show('title'); K.st.step++; K.persist(); K.goStep(); };
  K.resume = function () { if (K.st) K.goStep(); else K.show('title'); };
})(window.K = window.K || {});
