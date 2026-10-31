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
    texts: (p) => p.rounds.flatMap((r) => [r.right, r.say, r.prompt, r.says, r.colWrong].filter(Boolean)).concat((p.fixed || []).filter((x) => /^[a-zæøå]/i.test(x))),
    lint(p) {
      const e = [];
      p.rounds.forEach((r, i) => {
        if (!r.right || !r.wrong || r.wrong.length < 2) e.push(`round ${i}: needs right + 2 wrong`);
        if ((r.wrong || []).includes(r.right) || r.colWrong === r.right) e.push(`round ${i}: a wrong option equals the right one`);
        if (r.col && !K.COLORS[r.col]) e.push(`round ${i}: unknown colour ${r.col}`);
        if (r.lieCol && !K.COLORS[r.lieCol]) e.push(`round ${i}: unknown lieCol ${r.lieCol}`);
        if (r.who && !K.CAST[r.who]) e.push(`round ${i}: unknown speaker ${r.who}`);
        if (p.variant === 'puklen' && r.lieCol && !(r.colWrong && r.says)) e.push(`round ${i}: puklen lie colour needs colWrong and says`);
        if (p.variant === 'gruppen' && !r.cue && !r.prompt) e.push(`round ${i}: gruppen needs a cue or a prompt`);
        if (p.fixed && [r.right].concat(r.wrong).some((o) => !p.fixed.includes(o))) e.push(`round ${i}: option not in the fixed list`);
        (r.cast || []).forEach((c) => { if (!K.CAST[c]) e.push(`round ${i}: unknown cast ${c}`); });
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st || { flags: {} };
      if (p.dyn) p = Object.assign({}, p, { rounds: p.dyn(K.st, p.rounds) }); // rounds built from the run (e.g. your own old mistakes)
      const v = p.variant;
      const drunk = v === 'puklen' && st.flags.drank1;
      const { game, body } = K.frame(root, p.title, p.sub);
      if (drunk || v === 'review') game.classList.add('trip-bg');
      if (v === 'puklen') K.MUSIC.set(drunk ? 'trip' : 'calm');
      const N = p.n || p.rounds.length;
      let rounds = p.keep ? p.rounds.slice(0, N) : K.shuffle(p.rounds.filter((r) => !r.must)).slice(0, N - p.rounds.filter((r) => r.must).length);
      p.rounds.filter((r) => r.must && !p.keep).forEach((r) => rounds.splice(Math.min(rounds.length, 2), 0, r)); // story rounds always come, early
      let wrongPile = 0; const rightPile = [];
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
        } else if (v === 'scene') {
          (r.cast || p.cast || []).forEach((c) => sg.appendChild(K.ART.actor(c)));
          if (r.e) sg.appendChild(el('div', 'bigthing', r.e));
          if (r.say) { const c = K.CAST[r.who]; const l = el('div', 'line', `<div class="who">${K.esc(c.name)}</div><div class="da">${K.da(r.say)}</div>`); l.style.borderColor = c.color; body.appendChild(l); K.VOICE.say(r.say, r.who, i > 0); }
          if (r.cue) body.appendChild(el('div', 'cue', r.cue === '❗' ? '❗ Be surprised' : '🤝 Agree'));
          if (p.meter) body.appendChild(el('div', 'meter', p.meter.repeat(score) + '<span class="dim">' + p.meter.repeat(Math.max(0, rounds.length - score)) + '</span>'));
          if (p.pileWrong) { const pw = el('div', 'pile wrongpile', wrongPile ? p.pileWrong.repeat(wrongPile) : ''); sg.firstChild && sg.firstChild.appendChild(pw); }
          if (p.pileRight) body.appendChild(el('div', 'pile', rightPile.join('') || '<span class="small">…</span>'));
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
        if (r.prompt) body.appendChild(el('div', 'prompt', K.da(r.prompt) + (r.hint ? ` <span class="small">(${K.esc(r.hint)})</span>` : '')));
        const grid = el('div', 'opts'); body.appendChild(grid);
        const opts = [r.right].concat(r.wrong.slice(0, drunk && r.colWrong ? 1 : 2), drunk && r.colWrong ? [r.colWrong] : []);
        (p.fixed ? opts.slice().sort((a, b) => p.fixed.indexOf(a) - p.fixed.indexOf(b)) : K.shuffle(opts)).forEach((o) => s.btn(grid, K.da(o), (e, b) => answer(r, o === r.right, b, flying), { answer: true, cls: 'opt', data: { right: o === r.right ? '1' : '0' } }));
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
        if (r.flag && K.st && !K.st.replay) { K.st.flags[r.flag] = ok; K.persist(); } // a story round: its answer changes a later line
        if (ok) {
          score++; K.ART.pop(b); const q = b.getBoundingClientRect(); K.ART.burst(q.left + q.width / 2, q.top + q.height / 2); K.VOICE.say(r.right, null, true);
          if (v === 'puklen') { pile.push(r.e); if (flying) flying.classList.add('fly'); }
          if (p.pileRight && r.e) rightPile.push(r.e);
        } else {
          K.ART.shake(b);
          if (v === 'firbenet') { ts++; const t = body.querySelector('.tstack'); if (t) { t.innerHTML = '<b>T</b>'.repeat(ts); K.ART.pop(t); } }
          if (v === 'puklen' && flying) flying.classList.add('back');
          if (p.pileWrong) { wrongPile++; const w = body.querySelector('.wrongpile'); if (w) { w.innerHTML = p.pileWrong.repeat(wrongPile); K.ART.pop(w); } }
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
