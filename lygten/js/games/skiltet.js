// Skiltet. Two modes:
//  fill (the flea market on the map): a price sign misses the adjective ending; tap –, -t or -e. Right: +1 water.
//  fix (your hand, the lantern's city): one word has one wrong letter; tap the wrong letter, then the right one.
(function (K) {
  'use strict';
  const el = K.el;
  const diffAt = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return i; return -1; };
  const ENDS = [['', '–'], ['t', '-t'], ['e', '-e']];
  K.game('skiltet', {
    title: 'Skiltet',
    texts: () => K.SIGNS.map((g) => g.txt.replace('_', g.ans)).concat(K.CITY.map((c) => c.txt.replace(c.bad, c.good)), [K.HAND.txt.replace(K.HAND.bad, K.HAND.good), 'Hvilken endelse?', 'Find fejlen.', 'Ret lygtens skilte.']),
    lint() {
      const e = [];
      K.SIGNS.forEach((g, i) => {
        if ((g.txt.match(/_/g) || []).length !== 1) e.push(`sign ${i}: needs exactly one _`);
        if (!['', 't', 'e'].includes(g.ans)) e.push(`sign ${i}: ans must be '', 't' or 'e'`);
        if (!K.COLORS[g.col]) e.push(`sign ${i}: unknown colour ${g.col}`);
        if (g.pat && !K.PATTERNS[g.pat]) e.push(`sign ${i}: unknown pattern`);
        if (!g.why) e.push(`sign ${i}: no why`);
      });
      K.CITY.concat([K.HAND]).forEach((c, i) => {
        if (c.bad.length !== c.good.length) e.push(`city ${i}: bad and good differ in length`);
        let d = 0; for (let k = 0; k < c.bad.length; k++) if (c.bad[k] !== c.good[k]) d++;
        if (d !== 1) e.push(`city ${i}: bad and good must differ in exactly one letter`);
        if (!c.txt.split(' ').includes(c.bad)) e.push(`city ${i}: txt does not contain the bad word`);
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st;
      const fix = p.fix;
      const { body } = K.frame(root, p.title || 'Loppemarkedet', p.sub || 'Skiltene er halvt begravet i sandet.');
      let items;
      if (fix === 'hand') items = [K.HAND];
      else if (fix === 'city') items = K.shuffle(K.CITY).slice(0, 6);
      else {
        let free = K.SIGNS.filter((g, i) => !st.usedSigns.includes(i));
        if (free.length < 2) { st.usedSigns = []; free = K.SIGNS.slice(); }
        items = K.shuffle(free).slice(0, 2);
        items.forEach((g) => st.usedSigns.push(K.SIGNS.indexOf(g))); K.persist();
      }
      let i = 0, good = 0;
      function round() {
        s.unlock(); body.innerHTML = '';
        if (i >= items.length) return done();
        if (fix !== 'hand') K.hud(s, body);
        body.appendChild(el('div', 'progress', `${i + 1} / ${items.length}`));
        const it = items[i];
        if (fix) fixRound(it); else fillRound(it);
      }
      function fillRound(g) {
        body.appendChild(K.ART.thing(null, g.col, g.pat));
        const [a, b] = g.txt.split('_');
        body.appendChild(el('div', 'sign', `${K.da(a)}<span class="gap">?</span>${K.da(b)}<div class="kr">${g.kr} kr.</div>`));
        body.appendChild(el('div', 'prompt', K.da('Hvilken endelse?')));
        const row = el('div', 'endings'); body.appendChild(row);
        ENDS.forEach(([v, label]) => s.btn(row, label, async (e, btn) => {
          const ok = v === g.ans, right = g.txt.replace('_', g.ans);
          btn.classList.add(ok ? 'is-ok' : 'is-no');
          K.tally(st, 'Skiltet', ok);
          if (ok) { good++; K.ART.pop(btn); K.VOICE.say(right, null, true); K.water(st, 1); } else K.ART.shake(btn);
          K.feedback(s, body, ok, right, g.why);
          await K.after(s, body, ok); i++; round();
        }, { answer: true, cls: 'tile end', data: { right: v === g.ans ? '1' : '0' } }));
        s.bot = (mode) => { if (s.locked) return null; const v = [...row.children]; return mode === 'wrong' && Math.random() < 0.5 ? v.find((b) => b.dataset.right === '0') : v.find((b) => b.dataset.right === '1'); };
      }
      function fixRound(c) {
        const pos = diffAt(c.bad, c.good);
        body.appendChild(K.ART.thing(null, c.col));
        const sign = el('div', 'sign fix'); body.appendChild(sign);
        body.appendChild(el('div', 'prompt', K.da('Find fejlen.') + ' <span class="small">(Tap the wrong letter.)</span>'));
        c.txt.split(' ').forEach((w, wi) => {
          if (wi) sign.appendChild(document.createTextNode(' '));
          if (w !== c.bad) { sign.appendChild(el('span', '', K.da(w))); return; }
          const word = el('span', 'letters'); sign.appendChild(word);
          [...w].forEach((ch, k) => s.btn(word, K.esc(ch), (e, b) => pickLetter(c, pos, k, b), { cls: 'letter', data: { k: String(k) } }));
        });
        let phase = 1;
        function pickLetter(c2, p2, k, b) {
          if (phase !== 1) return;
          if (k !== p2) return wrong(c, b);
          phase = 2; b.classList.add('chosen');
          const opts = K.shuffle([c.good[p2]].concat(K.shuffle('etdnæa'.split('').filter((x) => x !== c.good[p2] && x !== c.bad[p2])).slice(0, 3)));
          const row = el('div', 'endings'); body.appendChild(row);
          body.appendChild(el('div', 'small', 'Which letter belongs there?'));
          opts.forEach((o) => s.btn(row, K.esc(o), (e, bb) => (o === c.good[p2] ? right(c, b) : wrong(c, bb)), { answer: true, cls: 'tile', data: { right: o === c.good[p2] ? '1' : '0' } }));
          s.bot = (mode) => { if (s.locked) return null; const v = [...row.children]; return mode === 'wrong' && Math.random() < 0.4 ? v.find((x) => x.dataset.right === '0') : v.find((x) => x.dataset.right === '1'); };
        }
        async function right(c2, letterBtn) {
          good++; K.tally(st, fix === 'city' ? 'Byen' : 'Hånden', true);
          letterBtn.innerHTML = K.esc(c.good[pos]); letterBtn.classList.add('is-ok'); K.ART.pop(sign);
          const r = c.txt.replace(c.bad, c.good); K.VOICE.say(r, null, true);
          K.feedback(s, body, true, r);
          if (fix === 'city') sign.classList.add('brick');
          await K.after(s, body, true); i++; round();
        }
        async function wrong(c2, b) {
          s.locked = true; phase = 3;
          K.tally(st, fix === 'city' ? 'Byen' : 'Hånden', false);
          K.ART.shake(b); b.classList.add('is-no');
          const r = c.txt.replace(c.bad, c.good);
          K.feedback(s, body, false, r, `${c.bad} → ${c.good}`);
          await K.after(s, body, false); i++; round();
        }
        s.bot = (mode) => { if (s.locked) return null; const v = [...sign.querySelectorAll('.letter')]; return mode === 'wrong' && Math.random() < 0.3 ? v[(pos + 1) % v.length] : v[pos]; };
      }
      function done() {
        if (fix === 'city') { st.city = good; K.persist(); }
        if (fix === 'hand') { st.flags.handFixed = true; K.persist(); }
        s.bot = null; K.leave(s);
      }
      round();
    },
  });
})(window.K = window.K || {});
