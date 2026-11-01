// Komplimenter: build the compliment the scorpion begs for, from tiles (the kit's build rules).
// Every right compliment lights one more segment of his tail. params: { id, title, sub, rounds: [{ e, col, pat, answers, traps, why }] }
(function (K) {
  'use strict';
  const el = K.el;
  const words = (t) => String(t).replace(/[.,!?;:]/g, ' ').split(/\s+/).filter(Boolean);
  const tileOf = (w) => w.toLowerCase();
  const norm = (arr) => arr.map((w) => w.toLowerCase()).join(' ');
  function tilesFor(r) {
    const need = {};
    r.answers.forEach((a) => { const c = {}; words(a).forEach((w) => { const t = tileOf(w); c[t] = (c[t] || 0) + 1; }); Object.entries(c).forEach(([t, n]) => { need[t] = Math.max(need[t] || 0, n); }); });
    const out = []; Object.entries(need).forEach(([t, n]) => { for (let i = 0; i < n; i++) out.push(t); });
    const drunk = r.drunk && K.st && K.st.__drunkFlag && K.st.flags[K.st.__drunkFlag] ? [r.drunk] : [];
    return out.concat((r.traps || []).concat(drunk).map(tileOf));
  }
  K.game('komplimenter', {
    title: 'Komplimenter',
    texts: (p) => p.rounds.flatMap((r) => r.answers.concat(r.traps || [], r.drunk ? [r.drunk] : [], r.ask ? [r.ask] : [])),
    lint(p) {
      const e = [];
      p.rounds.forEach((r, i) => {
        if (!r.answers || !r.answers.length) e.push(`round ${i}: no answers`);
        (r.traps || []).forEach((t) => { if (r.answers.some((a) => words(a).map(tileOf).includes(tileOf(t)))) e.push(`round ${i}: trap "${t}" is also an answer word`); });
        if (tilesFor(r).length > 13) e.push(`round ${i}: too many tiles`);
        if (r.drunk && r.answers.some((a) => words(a).map(tileOf).includes(tileOf(r.drunk)))) e.push(`round ${i}: drunk tile is an answer word`);
      });
      return e;
    },
    screen(root, p, s) {
      const { body } = K.frame(root, p.title, p.sub);
      if (K.st) K.st.__drunkFlag = p.drunkFlag || null;
      const rounds = K.shuffle(p.rounds).slice(0, p.n || p.rounds.length);
      let i = 0, score = 0;
      function tail() {
        const t = el('div', 'tail');
        for (let k = 0; k < rounds.length; k++) t.appendChild(el('span', k < score ? 'lit' : '', ''));
        return t;
      }
      function round() {
        s.unlock(); body.innerHTML = '';
        if (i >= rounds.length) return done();
        const r = rounds[i];
        const sg = el('div', 'qstage'); body.appendChild(sg);
        const a = K.ART.actor(p.actor || 'skorpion'); sg.appendChild(a); a.appendChild(tail());
        if (r.e) sg.appendChild(r.col ? K.item(r.e, r.col, r.pat, true) : el('div', 'bigthing', r.e));
        body.appendChild(el('div', 'prompt', K.da(r.ask || p.ask || 'Sig noget pænt!') + ` <span class="small">(${K.esc(r.en || p.askEn || 'Build the compliment.')})</span>`));
        const built = el('div', 'built'); body.appendChild(built);
        const pool = el('div', 'pool'); body.appendChild(pool);
        const bar = el('div', 'row'); body.appendChild(bar);
        const picked = [];
        const draw = () => {
          built.innerHTML = picked.length ? '' : '<span class="ph">…</span>';
          picked.forEach((t, k) => s.btn(built, K.esc(k === 0 ? t[0].toUpperCase() + t.slice(1) : t), () => { picked.splice(k, 1); pool.querySelector(`[data-k="${t.__k}"]`).hidden = false; draw(); }, { cls: 'tile in' }));
          if (picked.length) built.appendChild(el('span', 'bang', r.end || p.end || '!'));
          doneB.disabled = !picked.length;
        };
        K.shuffle(tilesFor(r)).forEach((t, k) => {
          const b = s.btn(pool, K.da(t), () => { const w = new String(t); w.__k = k; picked.push(w); b.hidden = true; draw(); }, { cls: 'tile', data: { k: String(k), w: t } });
        });
        const doneB = s.btn(bar, p.sayBtn || 'Sig det', async () => {
          const ok = r.answers.some((x) => norm(words(x)) === norm(picked.map(String)));
          K.tally(p.id, ok);
          pool.querySelectorAll('button').forEach((b) => { b.disabled = true; });
          if (ok) { score++; K.ART.pop(built); K.VOICE.say(r.answers[0], null, true); const lit = body.querySelectorAll('.tail span')[score - 1]; if (lit) lit.classList.add('lit'); } else K.ART.shake(built);
          K.feedback(s, body, ok, r.answers[0] + (r.end || p.end || '!'), r.why);
          await K.after(s, body, ok);
          i++; round();
        }, { answer: true, cls: 'main', data: { done: '1' } });
        draw();
        s.bot = (mode) => {
          if (s.locked) return null;
          const target = words(r.answers[0]).map(tileOf);
          const free = [...pool.querySelectorAll('.tile')].filter((b) => !b.hidden);
          if (mode === 'wrong' && r.__w == null) r.__w = Math.random() < 0.5;
          if (mode === 'wrong' && r.__w) return picked.length >= 2 || !free.length ? doneB : free[0];
          if (picked.length >= target.length) return doneB;
          return free.find((b) => b.dataset.w === target[picked.length]) || doneB;
        };
      }
      async function done() { body.innerHTML = ''; s.bot = null; await K.stamp(s, body, p.id, score, rounds.length); s.finish(); }
      round();
    },
  });
})(window.K = window.K || {});
