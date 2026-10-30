// "quiz": the pick-one game with a stage per variant (all on the kit's pick rules).
//  firbenet: the lizard wears each purchase; every wrong answer sticks one more wooden T on him.
//  puklen:   the camel empties his hump; every right answer throws the thing onto the pile (the pile is the grade).
//            After the dew (flags.drank1) the art shows the WRONG colour; the camel always says the true one.
//  gruppen:  a creature says an opinion; a cue says what kind of reaction it wants (❗ surprise, 🤝 agree).
//  replay:   you are the mushroom, rehearsing.   review: spore clouds over the camp; every right answer soaks one up.
// params: { id, title, sub, variant, n, rounds: [{ e, col, pat, lieCol, who, say, cue, prompt, right, wrong, colWrong, says, why }] }
(function (K) {
  'use strict';
  const el = K.el;
  K.game('quiz', {
    title: 'Quiz',
    texts: (p) => p.rounds.flatMap((r) => [r.right, r.say, r.prompt, r.says, r.colWrong].filter(Boolean)),
    lint(p) {
      const e = [];
      p.rounds.forEach((r, i) => {
        if (!r.right || !r.wrong || r.wrong.length < 2) e.push(`round ${i}: needs right + 2 wrong`);
        if ((r.wrong || []).includes(r.right) || r.colWrong === r.right) e.push(`round ${i}: a wrong option equals the right one`);
        if (r.col && !K.COLORS[r.col]) e.push(`round ${i}: unknown colour ${r.col}`);
        if (r.lieCol && !K.COLORS[r.lieCol]) e.push(`round ${i}: unknown lieCol ${r.lieCol}`);
        if (r.who && !K.CAST[r.who]) e.push(`round ${i}: unknown speaker ${r.who}`);
        if (p.variant === 'puklen' && r.lieCol && !(r.colWrong && r.says)) e.push(`round ${i}: puklen lie colour needs colWrong and says`);
        if (p.variant === 'gruppen' && !r.cue) e.push(`round ${i}: gruppen needs a cue`);
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st || { flags: {} };
      const v = p.variant;
      const drunk = v === 'puklen' && st.flags.drank1;
      const { game, body } = K.frame(root, p.title, p.sub);
      if (drunk || v === 'review') game.classList.add('trip-bg');
      if (v === 'puklen') K.MUSIC.set(drunk ? 'trip' : 'calm');
      const rounds = (p.keep ? p.rounds.slice() : K.shuffle(p.rounds)).slice(0, p.n || p.rounds.length);
      let i = 0, score = 0, ts = 0;
      const pile = [];
      function stage(r) {
        const sg = el('div', 'qstage'); body.appendChild(sg);
        if (v === 'firbenet') {
          const a = K.ART.actor('firben'); sg.appendChild(a);
          const tt = el('div', 'tstack', ts ? '<b>T</b>'.repeat(ts) : ''); a.appendChild(tt);
          sg.appendChild(K.item(r.e, r.col, r.pat, true));
        } else if (v === 'puklen') {
          sg.appendChild(K.ART.actor('kamel'));
          const it = K.item(r.e, drunk && r.lieCol ? r.lieCol : r.col, r.pat, true); it.classList.add('outof'); sg.appendChild(it);
          const pl = el('div', 'pile', pile.join('') || '<span class="small">Bunken er tom.</span>'); body.appendChild(pl);
          if (drunk && r.says) { const l = el('div', 'line', `<div class="who">Kamelen</div><div class="da">${K.da(r.says)}</div>`); l.style.borderColor = K.CAST.kamel.color; body.appendChild(l); }
          return it;
        } else if (v === 'gruppen' || v === 'replay') {
          sg.appendChild(K.ART.actor(r.who || (v === 'replay' ? 'flue' : 'kaktus')));
          if (r.say) { const c = K.CAST[r.who]; const l = el('div', 'line', `<div class="who">${K.esc(c.name)}</div><div class="da">${K.da(r.say)}</div>`); l.style.borderColor = c.color; body.appendChild(l); K.VOICE.say(r.say, r.who, i > 0); }
          if (r.cue) body.appendChild(el('div', 'cue', r.cue === '❗' ? '❗ Be surprised' : '🤝 Agree'));
        } else if (v === 'review') {
          const sp = K.ART.actor('svampen'); sp.style.setProperty('--grow', String(1 + score * 0.12)); sp.classList.add('grows'); sg.appendChild(sp);
          sg.appendChild(el('div', 'clouds', '☁️'.repeat(Math.max(0, rounds.length - i))));
          if (r.e) sg.appendChild(K.item(r.e, r.col, r.pat));
        }
        return null;
      }
      function round() {
        s.unlock(); body.innerHTML = '';
        if (i >= rounds.length) return done();
        const r = rounds[i];
        body.appendChild(el('div', 'progress', `${i + 1} / ${rounds.length}`));
        const flying = stage(r);
        if (r.prompt) body.appendChild(el('div', 'prompt', K.da(r.prompt)));
        const grid = el('div', 'opts'); body.appendChild(grid);
        const opts = [r.right].concat(r.wrong.slice(0, drunk && r.colWrong ? 1 : 2), drunk && r.colWrong ? [r.colWrong] : []);
        K.shuffle(opts).forEach((o) => s.btn(grid, K.da(o), (e, b) => answer(r, o === r.right, b, flying), { answer: true, cls: 'opt', data: { right: o === r.right ? '1' : '0' } }));
        s.btn(body, 'Jeg ved det ikke (EN)', (e, b) => { if (K.st) K.st.english++; answer(r, false, b, flying); }, { answer: true, cls: 'ghost small english', data: { right: '0' } });
        s.bot = (mode) => {
          const vv = [...grid.querySelectorAll('[data-right]')];
          if (s.locked || !vv.length) return null;
          if (mode === 'wrong' && Math.random() < 0.5) return vv.find((b) => b.dataset.right === '0');
          return vv.find((b) => b.dataset.right === '1');
        };
      }
      async function answer(r, ok, b, flying) {
        b.classList.add(ok ? 'is-ok' : 'is-no');
        K.tally(p.id, ok);
        if (ok) {
          score++; K.ART.pop(b); const q = b.getBoundingClientRect(); K.ART.burst(q.left + q.width / 2, q.top + q.height / 2); K.VOICE.say(r.right, null, true);
          if (v === 'puklen') { pile.push(r.e); if (flying) flying.classList.add('fly'); }
        } else {
          K.ART.shake(b);
          if (v === 'firbenet') { ts++; const t = body.querySelector('.tstack'); if (t) { t.innerHTML = '<b>T</b>'.repeat(ts); K.ART.pop(t); } }
          if (v === 'puklen' && flying) flying.classList.add('back');
        }
        K.feedback(s, body, ok, r.right, r.why);
        await K.after(s, body, ok);
        i++; round();
      }
      async function done() {
        body.innerHTML = '';
        if (v === 'firbenet' && ts) body.appendChild(el('div', 'narr', `The lizard is now wearing ${ts} wooden T${ts > 1 ? "'s" : ''}. He thinks it suits him.`));
        if (v === 'puklen') body.appendChild(el('div', 'pile big', pile.join('') || '…'));
        s.bot = null;
        await K.stamp(s, body, p.id, score, rounds.length);
        s.finish();
      }
      round();
    },
  });
})(window.K = window.K || {});
