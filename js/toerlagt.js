// TØRLAGT systems: creature tokens, the trip look, item cards, the lesson screen (new system 1),
// flow actions, chapter tracking and chapter replay, tally and endings.
(function (K) {
  'use strict';
  const el = K.el;

  // ---------- creature tokens (emoji in the prototype). mood 'tint' = lilla after the trip.
  const baseActor = K.ART.actor;
  K.ART.actor = function (id, mood) {
    const c = K.CAST && K.CAST[id];
    if (!c || !c.e) return baseActor(id, mood);
    const d = el('div', 'actor bob creature' + (mood ? ' m-' + mood : ''));
    d.dataset.actor = id;
    d.innerHTML = `<div class="cre">${c.e}</div><div class="name">${K.esc(c.name)}</div>`;
    return d;
  };
  // the trip look: scenes marked trip (or any scene while K.st.tripNow) get a slow colour swirl. Text is never filtered.
  const baseScene = K.ART.scene;
  K.ART.scene = function (id, st) {
    const d = baseScene(id, st);
    const sc = K.SCENES[id] || {};
    if (sc.trip || (st && st.tripNow)) d.classList.add('trip');
    return d;
  };
  // a thing: a card in its colour (and pattern) with the emoji on it
  K.item = function (e, col, pat, big) {
    const w = el('div', 'item' + (big ? ' big' : ''));
    w.appendChild(K.ART.thing(null, col, pat));
    w.appendChild(el('div', 'item-e', e));
    return w;
  };
  // [x] inside an example marks the ending: shown highlighted
  K.mark = (t) => String(t).split(/(\[[^\]]*\])/).map((part) => (part.startsWith('[') ? `<b class="end">${K.esc(part.slice(1, -1))}</b>` : K.da(part))).join('');
  K.plain = (t) => String(t).replace(/[[\]]/g, '');

  // ---------- tally (story runs only) and endings
  K.tally = function (game, ok) {
    const st = K.st; if (!st || st.replay) return;
    const t = st.tally[game] || (st.tally[game] = { ok: 0, n: 0 });
    t.n++; if (ok) t.ok++; K.persist();
  };
  K.accuracy = (st) => { let ok = 0, n = 0; Object.values(st.tally || {}).forEach((t) => { ok += t.ok; n += t.n; }); return n ? ok / n : 1; };
  K.endingOf = function (st) {
    const f = st.flags;
    if (f.final) return K.ENDINGS.blomstret;
    const clean = !f.drank1 && !f.stayed2;
    if (clean && K.accuracy(st) >= 0.9) return K.ENDINGS.hvid;
    if (clean) return K.ENDINGS.toerlagt;
    return K.ENDINGS.tilbagefald;
  };

  // ---------- flow: chapter cards remember how far you got; replay one chapter from the title
  K.SCREENS.act = function (root, p, s) {
    const st = K.st;
    if (p.do === 'ranks' && !st.replay) {
      st.ranks = {}; st.score = 0;
      Object.entries(st.tally).forEach(([g, t]) => { st.ranks[g] = K.rank(t.ok, t.n); st.score += t.ok; const b = K.save.stats.ranks[g]; if (!b || 'SABC'.indexOf(st.ranks[g]) < 'SABC'.indexOf(b)) K.save.stats.ranks[g] = st.ranks[g]; });
    }
    K.persist();
    s.bot = () => null;
    s.timer(() => s.finish(), 0);
  };
  const baseGo = K.goStep;
  K.goStep = function () {
    const st = K.st;
    if (st && st.replay) {
      const end = K.chapterEnd(st.replay);
      while (st.step < end && K.FLOW[st.step] && !K.FLOW[st.step].replay) st.step++;
      if (st.step >= end) { K.st = null; return K.show('title'); }
    }
    const step = st && K.FLOW[st.step];
    if (step && step.ch && !st.replay) { const S = K.save.stats; S.reached = Math.max(S.reached || 1, step.ch); }
    return baseGo();
  };
  K.chapterStart = (ch) => K.FLOW.findIndex((x) => x.ch === ch);
  K.chapterEnd = (ch) => { const i = K.FLOW.findIndex((x) => x.ch === ch + 1); return i < 0 ? K.FLOW.length : i; };
  K.replay = function (ch) {
    K.st = Object.assign(K.newRun(), { replay: ch, step: K.chapterStart(ch) });
    K.goStep();
  };
  K.CONFIG.titleExtra = function (menu, s) {
    const n = K.save.stats.reached || 0;
    if (n < 1) return;
    s.btn(menu, 'Kapitler', () => K.modal((box, close) => {
      box.appendChild(el('h2', '', 'Kapitler'));
      box.appendChild(el('div', 'small', 'Replay a lesson and its game for a better rank. The story is not changed.'));
      K.CHAPTERS.forEach((c, i) => {
        const ch = i + 1;
        const b = el('button', 'btn' + (ch > n ? ' locked' : ''), `<b>${ch}. ${K.esc(c.title)}</b> <span class="small">${ch > n ? 'Låst' : K.esc(c.topic)}</span>`);
        b.type = 'button'; b.dataset.tap = '1'; b.disabled = ch > n;
        b.onclick = () => { close(); K.replay(ch); };
        box.appendChild(b);
      });
    }), { cls: 'ghost' });
  };

  // ---------- the lesson screen: a creature explains one rule, shows examples, asks one try
  K.SCREENS.lesson = function (root, p, s) {
    const st = K.st;
    root.appendChild(K.ART.scene(p.scene || 'lejr', null)); // never the trip filter on a lesson
    const box = el('div', 'lesson'); root.appendChild(box);
    const head = el('div', 'lhead'); box.appendChild(head);
    head.appendChild(K.ART.actor(p.who, (p.mood || null)));
    const c = K.CAST[p.who];
    const say = el('div', 'line'); say.style.borderColor = c.color;
    say.innerHTML = `<div class="who">${K.esc(c.name)}</div><div class="da">${K.da(p.say.da)}</div>`;
    const tools = el('div', 'tools'); say.appendChild(tools);
    s.btn(tools, '▶', () => K.VOICE.say(p.say.da, p.who, true), { cls: 'mini', silent: true });
    if (p.say.en) s.btn(tools, 'EN', (e, b) => { b.remove(); say.appendChild(el('div', 'en', K.esc(p.say.en))); }, { cls: 'mini' });
    head.appendChild(say);
    K.VOICE.say(p.say.da, p.who, false);
    box.appendChild(el('div', 'ltitle', K.esc(p.title)));
    box.appendChild(el('div', 'lrule', K.esc(p.rule)));
    const ex = el('div', 'lex'); box.appendChild(ex);
    p.ex.forEach((x) => { const r = el('div', 'lexrow', K.mark(x)); ex.appendChild(r); });
    // one try
    const t = p.try;
    const tr = el('div', 'ltry'); box.appendChild(tr);
    if (t.e) tr.appendChild(K.item(t.e, t.col, t.pat));
    tr.appendChild(el('div', 'prompt', K.da(t.q) + (t.hint ? ` <span class="small">(${K.esc(t.hint)})</span>` : '')));
    const opts = el('div', 'opts'); tr.appendChild(opts);
    K.shuffle([t.right].concat(t.wrong)).forEach((o) => s.btn(opts, K.da(o), async (e, b) => {
      const ok = o === t.right;
      b.classList.add(ok ? 'is-ok' : 'is-no');
      if (ok) { K.ART.pop(b); K.VOICE.say(t.right, null, true); } else K.ART.shake(b);
      K.tally('Lektion', ok);
      K.feedback(s, tr, ok, t.right, t.why || p.rule);
      await K.after(s, tr, ok);
      s.finish();
    }, { answer: true, cls: 'opt', data: { right: o === t.right ? '1' : '0' } }));
    s.bot = (mode) => { if (s.locked) return null; const v = [...opts.children]; return mode === 'wrong' && Math.random() < 0.4 ? v.find((b) => b.dataset.right === '0') : v.find((b) => b.dataset.right === '1'); };
  };
})(window.K = window.K || {});
