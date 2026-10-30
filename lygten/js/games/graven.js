// Graven (dig): pick one of three half-buried things, then name it. Right: it is yours. Wrong: −1 water.
// Oasen (oasis): refill water, then win back sold or missed words (a sold thing returns to the pack).
(function (K) {
  'use strict';
  const el = K.el;
  const gender = (t) => (t.da.startsWith('et par') ? `Pairs: et par ${t.word}.` : t.da.startsWith('et ') ? `${t.word} is an et-word: ${t.da}.` : `${t.word} is an en-word: ${t.da}.`);
  K.genderRule = gender;

  // one naming round for thing t; resolves true/false after feedback
  K.nameRound = function (s, body, t, label) {
    return new Promise((res) => {
      body.appendChild(el('div', 'bigthing pop', t.e));
      body.appendChild(el('div', 'prompt', K.da(label || 'Hvad er det?')));
      const grid = el('div', 'opts'); body.appendChild(grid);
      const answer = async (ok, b) => {
        b.classList.add(ok ? 'is-ok' : 'is-no');
        if (ok) { K.ART.pop(b); const q = b.getBoundingClientRect(); K.ART.burst(q.left + q.width / 2, q.top + q.height / 2); K.VOICE.say(t.da, null, true); } else K.ART.shake(b);
        K.feedback(s, body, ok, t.da, gender(t));
        res(ok);
      };
      K.shuffle([t.da].concat(t.lies)).forEach((o) => s.btn(grid, K.da(o), (e, b) => answer(o === t.da, b), { answer: true, cls: 'opt', data: { right: o === t.da ? '1' : '0' } }));
      s.btn(body, 'Jeg ved det ikke (EN)', (e, b) => { if (K.st) K.st.english++; answer(false, b); }, { answer: true, cls: 'ghost small english', data: { right: '0' } });
      s.bot = (mode) => {
        const v = [...grid.querySelectorAll('[data-right]')];
        if (s.locked || !v.length) return null;
        if (mode === 'wrong' && Math.random() < 0.5) return v.find((b) => b.dataset.right === '0');
        return v.find((b) => b.dataset.right === '1');
      };
    });
  };

  K.game('graven', {
    title: 'Klitten',
    texts: () => K.THINGS.map((t) => t.da).concat(['Hvad vil du grave op?', 'Hvad er det?', 'Tasken er fuld.']),
    lint() {
      const e = [], trues = new Set(K.THINGS.map((t) => t.da));
      K.THINGS.forEach((t) => {
        if (!t.e || !t.word || !t.tags || !t.tags.length || !t.sikke) e.push(`thing ${t.id}: missing e/word/tags/sikke`);
        if (!t.lies || t.lies.length !== 3 || new Set(t.lies).size !== 3) e.push(`thing ${t.id}: needs 3 different lies`);
        (t.lies || []).forEach((l) => { if (trues.has(l)) e.push(`thing ${t.id}: lie "${l}" is a true name`); });
        if (!/^(en|et|et par) /.test(t.da)) e.push(`thing ${t.id}: da must start with en/et/et par`);
        if (!K.RIDDLES.some((r) => t.tags.includes(r.tag))) e.push(`thing ${t.id}: no riddle accepts it`);
        if (t.fx && !K.FX[t.fx]) e.push(`thing ${t.id}: unknown fx ${t.fx}`);
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st;
      const { body } = K.frame(root, p.circle ? 'Dag 1' : 'Klitten', 'Noget stikker op af sandet.');
      let pool, digs;
      if (p.circle) { pool = st.left.filter((id) => !st.pack.includes(id)); while (pool.length < 2) { const f = K.THINGS.find((t) => !st.pack.includes(t.id) && !pool.includes(t.id)); pool.push(f.id); } digs = 2; }
      else if (p.day1) { const fx = K.shuffle(['kasket', 'toerklaede']); pool = [fx[0]].concat(K.shuffle(K.THINGS.filter((t) => !t.fx)).slice(0, 2).map((t) => t.id)); digs = 1; }
      else {
        const free = K.THINGS.filter((t) => !st.pack.includes(t.id) && !st.sold.includes(t.id));
        pool = K.shuffle(free).slice(0, 3).map((t) => t.id); digs = 2;
      }
      pool = K.shuffle(pool);
      let dug = 0;
      function pickPhase() {
        s.unlock(); body.innerHTML = '';
        if (dug >= digs || !pool.length) return finish();
        K.hud(s, body);
        body.appendChild(el('div', 'prompt', K.da('Hvad vil du grave op?')));
        const row = el('div', 'mounds'); body.appendChild(row);
        pool.forEach((id) => {
          const t = K.T[id];
          s.btn(row, `<span class="half">${t.e}</span>${t.fx ? `<i class="fxi">${K.FX[t.fx].icon}</i>` : ''}`, () => namePhase(id), { cls: 'mound', data: { id } });
        });
        body.appendChild(el('div', 'small', 'A small sign in a corner (☀ 🌪 ☾ 💧) means the thing helps on the way.'));
        s.bot = () => row.querySelector('.mound');
      }
      async function namePhase(id) {
        body.innerHTML = ''; pool = pool.filter((x) => x !== id); dug++;
        const t = K.T[id];
        const ok = await K.nameRound(s, body, t);
        K.tally(st, 'Klitten', ok);
        if (ok) { if (!K.addThing(st, id)) { K.toast('Tasken er fuld.'); K.water(st, 1); } }
        else K.water(st, -1);
        await K.after(s, body, ok);
        pickPhase();
      }
      function finish() {
        if (p.day1) { st.left = pool.slice(); K.persist(); }
        s.bot = null;
        K.leave(s);
      }
      pickPhase();
    },
  });

  K.game('oasen', {
    title: 'Oasen',
    texts: () => ['Kan du huske ordene?'],
    lint: () => [],
    screen(root, p, s) {
      const st = K.st;
      const { body } = K.frame(root, 'Oasen', 'Vand! Og ord, du har mistet.');
      K.water(st, K.maxWater(st));
      const missed = K.save.stats.missed;
      const want = K.THINGS.filter((t) => st.sold.includes(t.id) || missed[t.da]).slice(0, 3);
      let i = 0;
      async function round() {
        s.unlock(); body.innerHTML = '';
        K.hud(s, body);
        if (i >= want.length) {
          body.appendChild(el('div', 'narr', want.length ? 'You rest in the shade until the sun goes down.' : 'Shade, water, nothing to remember. You sleep.'));
          const b = s.btn(body, 'Videre ▸', () => K.leave(s), { cls: 'next', data: { next: '1' } });
          s.bot = () => b; return;
        }
        const t = want[i++];
        body.appendChild(el('div', 'small', st.sold.includes(t.id) ? 'A word you sold. Say it, and it is yours again.' : 'A word you missed.'));
        const ok = await K.nameRound(s, body, t, 'Kan du huske ordene?');
        K.tally(st, 'Oasen', ok);
        if (ok && st.sold.includes(t.id) && K.addThing(st, t.id)) { st.sold = st.sold.filter((x) => x !== t.id); K.persist(); K.toast(t.e + ' ' + t.da); }
        await K.after(s, body, ok);
        round();
      }
      round();
    },
  });
})(window.K = window.K || {});
