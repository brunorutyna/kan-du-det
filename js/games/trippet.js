// Trippet (new system 2): things drift slowly in endless loops over a swirling screen, each with a label.
// Tap the TRUE labels to anchor them (6 anchors). A lie makes the swirl stronger; nothing is lost, there is no clock.
// params: { id, title, sub, need, pairs: [[true, lie, emoji], ...] }
(function (K) {
  'use strict';
  const el = K.el;
  K.game('trippet', {
    title: 'Trippet',
    texts: (p) => p.pairs.map((x) => x[0]),
    lint(p) {
      const e = [], trues = new Set(p.pairs.map((x) => x[0]));
      p.pairs.forEach(([t, l], i) => { if (t === l) e.push(`pair ${i}: lie equals truth`); if (trues.has(l)) e.push(`pair ${i}: lie "${l}" is a true phrase`); });
      if (p.pairs.length < (p.need || 6)) e.push('not enough pairs');
      return e;
    },
    screen(root, p, s) {
      const { game, body } = K.frame(root, p.title, p.sub);
      const calm = typeof p.calm === 'function' ? p.calm(K.st || { flags: {} }) : p.calm;
      game.classList.add(calm ? 'calm-bg' : 'trip-bg');
      s.busy = true; // real-time drift: the watchdog must not fire while things float
      const need = p.need || 6;
      const field = el('div', 'drift'); body.appendChild(field);
      field.dataset.tap = '1';
      const shelf = el('div', 'anchors'); body.appendChild(shelf);
      const note = el('div', 'small dnote', 'Tap only what is really true.'); body.appendChild(note);
      const queue = K.shuffle(p.pairs);
      let qi = 0, anchored = 0, swirl = 0;
      const items = [];
      const W = () => field.clientWidth || 360, H = () => field.clientHeight || 420;
      let pairNo = 0, misses = 0;
      function spawn(label, truth, e, pair) {
        const b = s.btn(field, `<span class="de">${e || '✦'}</span>${K.da(label)}`, () => hit(it), { cls: 'floater', data: { right: truth ? '1' : '0' } });
        const it = { b, truth, label, pair, x: Math.random() * (W() - 150), y: Math.random() * (H() - 60), vx: (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 16), vy: (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 14) };
        items.push(it);
      }
      function nextPair() {
        if (qi >= queue.length) { qi = 0; }
        const [t, l, e] = queue[qi++];
        spawn(t, true, e, pairNo); spawn(l, false, e, pairNo); pairNo++;
      }
      for (let k = 0; k < 3; k++) nextPair();
      function hit(it) {
        if (it.gone) return;
        K.tally(p.id, it.truth);
        if (it.truth) {
          it.gone = true; anchored++;
          it.b.remove();
          const a = el('div', 'anchor', K.da(it.label)); shelf.appendChild(a); K.ART.pop(a);
          K.SFX.play('ok'); K.VOICE.say(it.label, null, true);
          const mate = items.find((x) => !x.gone && !x.truth && x.pair === it.pair);
          if (mate) { mate.gone = true; mate.b.remove(); }
          if (anchored >= need) return done();
          nextPair();
        } else {
          misses++; swirl = Math.min(4, swirl + 1); game.style.setProperty('--swirl', String(swirl));
          K.SFX.play('bad'); K.ART.shake(it.b);
          const right = (p.pairs.find((x) => x[1] === it.label) || [])[0];
          note.innerHTML = `${K.da(it.label)} ✗ → ${K.da(right || '')}`;
          K.mistake(right || it.label);
        }
      }
      s.loop((dt) => {
        const w = W(), h = H();
        items.forEach((it) => {
          if (it.gone) return;
          it.x += it.vx * dt * (1 + swirl * 0.25); it.y += it.vy * dt * (1 + swirl * 0.25);
          const bw = it.b.offsetWidth || 120, bh = it.b.offsetHeight || 50;
          if (it.x < 0) { it.x = 0; it.vx = Math.abs(it.vx); } if (it.x > w - bw) { it.x = Math.max(0, w - bw); it.vx = -Math.abs(it.vx); }
          if (it.y < 0) { it.y = 0; it.vy = Math.abs(it.vy); } if (it.y > h - bh) { it.y = Math.max(0, h - bh); it.vy = -Math.abs(it.vy); }
          it.b.style.transform = `translate(${it.x}px, ${it.y}px)`;
        });
      });
      s.bot = (mode) => {
        const live = items.filter((x) => !x.gone);
        const pick = mode === 'wrong' && Math.random() < 0.3 ? live.find((x) => !x.truth) : live.find((x) => x.truth);
        return pick ? pick.b : null;
      };
      async function done() {
        s.busy = false; s.bot = null;
        items.forEach((x) => { if (!x.gone) { x.gone = true; x.b.remove(); } });
        field.remove();
        await K.stamp(s, body, p.id, need, need + misses);
        s.finish();
      }
    },
  });
})(window.K = window.K || {});
