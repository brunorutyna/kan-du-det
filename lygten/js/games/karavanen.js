// Karavanen (trade): the trader reads a riddle; hand her a thing from your pack that fits, or say Nej tak.
// Riddle 1 pays with a useful thing you lack (or water), riddle 2 pays 2 water. A wrong thing costs nothing.
(function (K) {
  'use strict';
  const el = K.el;
  const GIFTS = ['rygsaek', 'lampe', 'toerklaede', 'kasket'];
  K.game('karavanen', {
    title: 'Karavanen',
    texts: () => K.RIDDLES.map((r) => r.da).concat(K.THINGS.map((t) => t.sikke), [
      'Sand og ord. Det er det eneste, der er her.', 'Lygten laver den slags oaser. Læs skiltet.', 'Du har ingenting. Her, tag en slurk.',
      'Det er en aftale.', 'Ha! Det er ikke det, jeg leder efter.', 'Nej tak.', 'Nå. Så ikke.']),
    lint() {
      const e = [];
      K.RIDDLES.forEach((r) => { if (!K.THINGS.some((t) => t.tags.includes(r.tag))) e.push(`riddle ${r.tag}: no thing fits`); });
      return e;
    },
    screen(root, p, s) {
      const st = K.st;
      const { body } = K.frame(root, 'Karavanen', 'Handelskonen og hendes kamel');
      let first;
      if (st.flags.sawMirage && !st.flags.toldMirage) { st.flags.toldMirage = true; first = 'Lygten laver den slags oaser. Læs skiltet.'; }
      else if (!st.flags.metTrader) { st.flags.metTrader = true; first = 'Sand og ord. Det er det eneste, der er her.'; }
      K.persist();
      const say = (da, en) => {
        const row = el('div', 'line'); row.style.borderColor = K.CAST.konen.color;
        row.appendChild(el('div', 'who', 'Handelskonen'));
        row.appendChild(el('div', 'da', K.da(da)));
        const tools = el('div', 'tools'); row.appendChild(tools);
        s.btn(tools, '▶', () => K.VOICE.say(da, 'konen', true), { cls: 'mini', silent: true });
        if (en) s.btn(tools, 'EN', (e, b) => { b.remove(); row.appendChild(el('div', 'en', K.esc(en))); st.english++; }, { cls: 'mini' });
        body.appendChild(row); K.VOICE.say(da, 'konen', true);
        return row;
      };
      // riddle 1 fits something you carry (if anything); riddle 2 is any other
      const fits = K.shuffle(K.RIDDLES.filter((r) => st.pack.some((id) => K.T[id].tags.includes(r.tag)) && !st.usedRiddles.includes(r.tag)));
      const r1 = fits[0] || K.shuffle(K.RIDDLES)[0];
      const r2 = K.shuffle(K.RIDDLES.filter((r) => r !== r1 && !st.usedRiddles.includes(r.tag)))[0] || K.RIDDLES.find((r) => r !== r1);
      const riddles = [r1, r2];
      let i = 0;
      function head() {
        body.innerHTML = '';
        K.hud(s, body);
        const stage = el('div', 'stage small-stage'); stage.appendChild(K.ART.actor('konen', 'happy')); body.appendChild(stage);
      }
      function round() {
        s.unlock(); head();
        if (!st.pack.length) {
          say('Du har ingenting. Her, tag en slurk.', 'You have nothing. Here, have a sip.');
          K.water(st, 1);
          const b = s.btn(body, 'Videre ▸', () => K.leave(s), { cls: 'next', data: { next: '1' } });
          s.bot = () => b; return;
        }
        if (i >= riddles.length) return K.leave(s);
        if (i === 0 && first) say(first);
        const r = riddles[i];
        st.usedRiddles.push(r.tag); K.persist();
        say(r.da);
        body.appendChild(el('div', 'small', 'Give her something that fits, or say no.'));
        const grid = el('div', 'packgrid'); body.appendChild(grid);
        st.pack.forEach((id) => {
          const t = K.T[id];
          s.btn(grid, `<span class="pe">${t.e}</span><span>${K.da(t.da)}</span>`, () => give(r, t), { answer: true, cls: 'opt pick', data: { fit: t.tags.includes(r.tag) ? '1' : '0' } });
        });
        const no = s.btn(body, K.da('Nej tak.'), () => { K.VOICE.say('Nej tak.', null, true); next('Nå. Så ikke.'); }, { answer: true, cls: 'ghost', data: { fit: 'no' } });
        s.bot = (mode) => {
          if (s.locked) return null;
          const v = [...grid.querySelectorAll('.pick')];
          if (mode === 'wrong') return v[0] || no;
          return v.find((b) => b.dataset.fit === '1') || no;
        };
      }
      async function give(r, t) {
        const ok = t.tags.includes(r.tag);
        K.tally(st, 'Karavanen', ok);
        head();
        if (!ok) {
          K.SFX.play('bad');
          say('Ha! Det er ikke det, jeg leder efter.', "Ha! That's not what I'm looking for.");
          const right = K.THINGS.filter((x) => x.tags.includes(r.tag)).map((x) => x.da).join(' / ');
          body.appendChild(el('div', 'fb no', `<div class="small">She wanted:</div><div class="right">${K.da(right)}</div>`));
          K.mistake(right);
          await K.after(s, body, false);
          i++; return round();
        }
        st.pack = st.pack.filter((x) => x !== t.id); K.persist();
        K.SFX.play('ok');
        say(t.sikke, 'What a nice ' + t.word + '!');
        let gift = null;
        if (i === 0) gift = GIFTS.find((g) => !st.pack.includes(g) && !st.sold.includes(g) && g !== t.id);
        if (gift && K.addThing(st, gift)) { say('Det er en aftale.', "It's a deal."); K.toast(K.T[gift].e + ' ' + K.T[gift].da); }
        else { say('Det er en aftale.', "It's a deal."); K.water(st, 2); }
        await K.after(s, body, true);
        await s.wait(500);
        i++; round();
      }
      function next(line) { head(); say(line, 'Oh well. Not then.'); s.timer(() => { i++; round(); }, 700); }
      round();
    },
  });
})(window.K = window.K || {});
