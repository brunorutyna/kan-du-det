// Stenene: a path of stepping stones over loose sand. Each pair: one true phrase, one of the lantern's lies.
// Step on the true one: +1 water (the stone is damp underneath). The lie sinks: no water, but you go on.
(function (K) {
  'use strict';
  const el = K.el;
  K.game('stenene', {
    title: 'Stenene',
    texts: () => K.STONES.map((x) => x[0]).concat(['Træd kun på de ægte sten.']),
    lint() {
      const e = [], trues = new Set(K.STONES.map((x) => x[0]));
      K.STONES.forEach(([t, l], i) => { if (t === l) e.push(`stone ${i}: lie equals truth`); if (trues.has(l)) e.push(`stone ${i}: lie "${l}" is a true phrase`); });
      return e;
    },
    screen(root, p, s) {
      const st = K.st;
      const { body } = K.frame(root, 'Stenene', 'Træd kun på de ægte sten.');
      const pairs = K.shuffle(K.STONES).slice(0, 6);
      let i = 0;
      function round() {
        s.unlock(); body.innerHTML = '';
        if (i >= pairs.length) return done();
        K.hud(s, body);
        const path = el('div', 'path'); body.appendChild(path);
        for (let k = 0; k < pairs.length; k++) path.appendChild(el('span', 'pstep' + (k < i ? ' past' : k === i ? ' now' : ''), k < i ? '●' : '○'));
        body.appendChild(el('div', 'prompt', K.da('Træd kun på de ægte sten.')));
        const [t, l] = pairs[i];
        const row = el('div', 'stones'); body.appendChild(row);
        K.shuffle([t, l]).forEach((o) => s.btn(row, K.da(o), async (e, b) => {
          const ok = o === t;
          K.tally(st, 'Stenene', ok);
          b.classList.add(ok ? 'is-ok' : 'is-no', ok ? 'step' : 'sink');
          if (ok) { K.water(st, 1); K.VOICE.say(t, null, true); } else K.ART.shake(b);
          K.feedback(s, body, ok, t, ok ? null : `${l} → ${t}`);
          await K.after(s, body, ok); i++; round();
        }, { answer: true, cls: 'stone', data: { right: o === t ? '1' : '0' } }));
        s.bot = (mode) => { if (s.locked) return null; const v = [...row.children]; return mode === 'wrong' && Math.random() < 0.5 ? v.find((b) => b.dataset.right === '0') : v.find((b) => b.dataset.right === '1'); };
      }
      function done() {
        body.innerHTML = '';
        body.appendChild(el('div', 'narr', 'Solid ground. Behind you the false stones are sinking, one by one.'));
        const b = s.btn(body, 'Videre ▸', () => K.leave(s), { cls: 'next', data: { next: '1' } });
        s.bot = () => b;
      }
      round();
    },
  });
})(window.K = window.K || {});
