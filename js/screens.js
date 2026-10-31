// Kit screens: title, card (time/chapter card), panel (story lines), choice, end.
// Every screen is (root, params, s) and leaves by s.finish() (next flow step) or K.show(id).
(function (K) {
  'use strict';
  const el = K.el, S = K.SCREENS;

  S.title = function (root, p, s) {
    K.st = null; K.ended = false;
    root.appendChild(K.ART.scene('title'));
    const box = el('div', 'title-box', `<h1>${K.esc(K.CONFIG.title)}</h1><div class="tagline">${K.esc(K.CONFIG.tagline || '')}</div>`);
    root.appendChild(box);
    const menu = el('div', 'menu'); root.appendChild(menu);
    const run = K.save.run, mid = run && run.step > 0;
    const go = (fresh) => () => { K.MUSIC.unlock(); K.start(fresh); };
    if (mid) s.btn(menu, 'Fortsæt', go(false), { cls: 'main', data: { bot: 'continue' } });
    s.btn(menu, mid ? 'Begynd forfra' : 'Begynd', go(true), { cls: mid ? '' : 'main', data: { bot: 'new' } });
    s.btn(menu, 'Indstillinger', () => K.modal((b) => { b.appendChild(el('h2', '', 'Indstillinger')); K.settingsUI(b); }));
    if (K.CONFIG.titleExtra) K.CONFIG.titleExtra(menu, s);
    if (K.CONFIG.back) s.btn(menu, K.esc(K.CONFIG.back.label), () => { location.href = K.CONFIG.back.href; }, { cls: 'ghost' });
    const st = K.save.stats;
    root.appendChild(el('div', 'foot', `Spillet ${st.done}× · Slutninger ${Object.keys(st.endings).length}/${K.CONFIG.endings || 1}`));
    s.bot = s.bot || (() => root.querySelector('[data-bot="new"]'));
  };

  // Time or chapter card: ≤ 1.1 s, a tap skips it.
  S.card = function (root, p, s) {
    const b = el('button', 'card', `<div class="big">${K.esc(p.title)}</div>` + (p.sub ? `<div class="sub">${K.esc(p.sub)}</div>` : ''));
    b.type = 'button'; b.dataset.tap = '1';
    b.onclick = () => s.finish();
    root.appendChild(b);
    s.timer(() => s.finish(), p.ms || 1100);
    s.bot = () => b;
  };

  // Story lines. Lines appear one by one; ONLY the Videre button (or empty space below the lines) advances.
  // Line kinds: {w:'castId', da, en} spoken Danish · {n:'English narration'} · {th:'inner thought'}
  S.panel = async function (root, p, s) {
    const st = K.st;
    root.appendChild(K.ART.scene(p.scene, st));
    const stage = el('div', 'stage'); root.appendChild(stage);
    const actors = {};
    (p.cast || []).forEach((id) => { const a = K.ART.actor(id, (p.mood || {})[id]); actors[id] = a; stage.appendChild(a); });
    const box = el('div', 'lines'); root.appendChild(box);
    const bar = el('div', 'bar'); root.appendChild(bar);
    let advance = null;
    const next = s.btn(bar, 'Videre ▸', () => advance && advance(), { cls: 'next', data: { next: '1' } });
    s.on(box, 'click', (e) => { if (e.target === box && advance) advance(); });
    s.bot = () => next;
    const lines = (p.lines || []).map((l) => (typeof l === 'function' ? l(st) : l)).flat().filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      Object.entries(actors).forEach(([id, a]) => a.classList.toggle('talk', id === l.w));
      const row = renderLine(s, l);
      box.appendChild(row); row.scrollIntoView({ block: 'end', behavior: K.fast ? 'auto' : 'smooth' });
      if (l.da) K.VOICE.say(l.da, l.w, false);
      if (!l.da && i < lines.length - 1) { await s.wait(150); continue; } // English flows on by itself
      await new Promise((res) => { advance = res; });
      advance = null;
    }
    s.finish();
  };
  function renderLine(s, l) {
    if (l.n) return el('div', 'narr', K.esc(l.n));
    if (l.th) return el('div', 'think', K.esc(l.th));
    const c = (K.CAST && K.CAST[l.w]) || { name: l.w || '', color: '#888' };
    const row = el('div', 'line');
    row.style.borderColor = c.color;
    row.appendChild(el('div', 'who', K.esc(c.name)));
    row.appendChild(el('div', 'da', K.da(l.da)));
    const tools = el('div', 'tools'); row.appendChild(tools);
    s.btn(tools, '▶', (e) => { e.stopPropagation(); K.VOICE.say(l.da, l.w, true); }, { cls: 'mini', silent: true });
    if (l.en) s.btn(tools, 'EN', (e, b) => { e.stopPropagation(); b.remove(); row.appendChild(el('div', 'en', K.esc(l.en))); if (K.st) K.st.english++; }, { cls: 'mini' });
    return row;
  }

  // A choice. options: [{da | en, set: {flag: value}, after: [lines]}]. English options are marked and may cost.
  S.choice = function (root, p, s) {
    root.appendChild(K.ART.scene(p.scene, K.st));
    const c = el('div', 'choice'); root.appendChild(c);
    if (p.prompt) c.appendChild(el('div', 'prompt', K.esc(p.prompt)));
    const opts = typeof p.options === 'function' ? p.options(K.st) : p.options;
    opts.forEach((o, i) => s.btn(c, o.da ? K.da(o.da) : K.esc(o.en), () => {
      if (o.set) Object.assign(K.st.flags, o.set);
      if (!o.da) K.st.english++;
      if (o.da) K.VOICE.say(o.da, p.who, false);
      if (o.after) K.show('panel', { scene: p.scene, cast: p.cast, lines: o.after, _after: true });
      else s.finish();
    }, { answer: true, cls: 'opt' + (o.da ? '' : ' english'), data: { i: String(i) } }));
    s.bot = (mode) => { const b = [...c.querySelectorAll('.opt')]; return mode === 'wrong' ? b[b.length - 1] : b[0]; };
  };

  S.end = function (root, p, s) {
    const st = K.st || K.newRun();
    const ending = K.CONFIG.ending ? K.CONFIG.ending(st) : 'slut';
    const S2 = K.save.stats;
    const open = K.CONFIG.openEnding && K.CONFIG.openEnding(st);
    if (K.save.run) { S2.done++; if (!open) S2.endings[ending] = (S2.endings[ending] || 0) + 1; else S2.part2done = (S2.part2done || 0) + 1; K.save.run = null; K.persist(); }
    K.SFX.play('win'); K.ended = true;
    root.appendChild(K.ART.scene('title'));
    const ranks = Object.entries(st.ranks).map(([id, r]) => `<div class="rk-row"><span>${K.esc(id)}</span><b class="rk rk-${r}">${r}</b></div>`).join('');
    root.appendChild(el('div', 'end-box', `<div class="big">${open ? 'Fortsættes …' : 'SLUT'}</div><div class="sub">${K.esc(open ? '' : ending)}</div>${ranks}<div class="small">Point: ${st.score}</div>`));
    const menu = el('div', 'menu'); root.appendChild(menu);
    s.btn(menu, 'Spil igen', () => (open && K.start2 ? K.start2() : K.start(true)), { cls: 'main' });
    s.btn(menu, 'Til start', () => K.show('title'));
  };
})(window.K = window.K || {});
