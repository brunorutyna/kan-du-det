// "riff" (new in Del 4): a real-time catcher in a sandstorm. Words fall; drag the sponge left/right with one thumb and
// soak up only the words that fit the wave's rule. A wrong soak costs a note; a word you let fall costs nothing.
// One pickup per wave: 🧲 pulls the next 3 fitting words, or 🧽 makes the sponge wide for the next 8 words. No clock.
// High (p.highFlag): words fall 40% slower and each right catch counts double on the meter, but fitting words fall
// together with an agreement twin that looks right and is not.
// params: { id, title, sub, need, highFlag, waves: [{ rule, en, fits: [...], others: [...], twins: { fit: lie }, pickup }] }
(function (K) {
  'use strict';
  const el = K.el;
  K.game('riff', {
    title: 'Riffet',
    texts: (p) => p.waves.flatMap((w) => [w.rule].concat(w.fits, w.others, Object.values(w.twins || {}))),
    lint(p) {
      const e = [];
      p.waves.forEach((w, i) => {
        if (!w.rule || w.fits.length < 4 || w.others.length < 3) e.push(`wave ${i}: needs a rule, ≥4 fits and ≥3 others`);
        w.fits.forEach((x) => { if (w.others.includes(x)) e.push(`wave ${i}: "${x}" both fits and does not`); });
        Object.entries(w.twins || {}).forEach(([a, b]) => { if (!w.fits.includes(a)) e.push(`wave ${i}: twin for unknown word ${a}`); if (w.fits.includes(b)) e.push(`wave ${i}: twin "${b}" is itself a fitting word`); });
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st || { flags: {} };
      const high = !!(p.highFlag && st.flags && st.flags[p.highFlag]);
      const { game, body } = K.frame(root, p.title, p.sub);
      game.classList.add(high ? 'trip-bg' : 'storm-bg');
      s.busy = true; // real time: the watchdog must not fire
      const need = p.need || 6;
      const head = el('div', 'rhead'); body.appendChild(head);
      const meter = el('div', 'meter'); body.appendChild(meter);
      const field = el('div', 'rfield'); body.appendChild(field);
      const sponge = el('div', 'rsponge', '🧽'); field.appendChild(sponge);
      const note = el('div', 'small dnote', 'Træk med tommelfingeren. Fang kun det, der passer.'); body.appendChild(note);
      let pid = null, wi = -1, caught = 0, right = 0, answered = 0, notes = 0, x = 0.5, botX = null, magnet = 0, wide = 0, pickupDone = false, pause = 0;
      const words = [];
      const W = () => field.clientWidth || 360, H = () => field.clientHeight || 420;
      const drawMeter = () => { meter.innerHTML = '♪'.repeat(Math.min(notes, 40)) || '<span class="small">…</span>'; };
      // one thumb: the sponge follows the finger, 60 px above it so the thumb never hides it
      const move = (ev) => { const r = field.getBoundingClientRect(); x = Math.max(0.06, Math.min(0.94, (ev.clientX - r.left) / r.width)); botX = null; };
      s.on(field, 'pointerdown', (ev) => { move(ev); pid = ev.pointerId; try { field.setPointerCapture(pid); } catch (e) { /* */ } });
      s.on(field, 'pointermove', (ev) => { if (ev.buttons || ev.pointerType === 'touch') move(ev); });
      s.cleanup.push(() => { try { if (pid != null) field.releasePointerCapture(pid); } catch (e) { /* */ } });
      function nextWave() {
        wi++; caught = 0; magnet = 0; wide = 0; pickupDone = false;
        words.forEach((w) => w.node.remove()); words.length = 0;
        if (wi >= p.waves.length) return finish();
        const w = p.waves[wi];
        head.innerHTML = `<div class="progress">Bølge ${wi + 1} / ${p.waves.length}</div><div class="rrule">${K.da(w.rule)}</div><div class="small">${K.esc(w.en || '')}</div>`;
        K.ART.pop(head); pause = 0.9;
      }
      function spawn() {
        const w = p.waves[wi]; if (!w) return;
        if (!pickupDone && caught >= 2) { pickupDone = true; return add(w.pickup === 'wide' ? '🧽' : '🧲', 'pickup'); }
        const fit = Math.random() < 0.5;
        const word = K.pick(fit ? w.fits : w.others);
        add(word, fit ? 'fit' : 'other');
        if (high && fit && w.twins && w.twins[word]) add(w.twins[word], 'twin', true);
      }
      function add(text, kind, near) {
        const node = el('div', 'rword' + (kind === 'pickup' ? ' pickup' : '') + (kind === 'twin' ? ' mirror' : ''), kind === 'pickup' ? text : K.da(text));
        field.appendChild(node);
        const last = words[words.length - 1];
        const fx = near && last ? Math.max(0.1, Math.min(0.9, last.x + (Math.random() < 0.5 ? -0.28 : 0.28))) : 0.12 + Math.random() * 0.76;
        words.push({ node, text, kind, x: fx, y: -40 });
      }
      function soak(wd) {
        if (!p.waves[wi]) return; // the wave just ended
        wd.node.remove(); words.splice(words.indexOf(wd), 1);
        if (wd.kind === 'pickup') { if (wd.text === '🧲') magnet = 3; else wide = 8; sponge.classList.toggle('wide', wide > 0); K.SFX.play('up'); return; }
        const ok = wd.kind === 'fit'; answered++;
        K.tally(p.id, ok);
        if (ok) { right++; caught++; notes += high ? 2 : 1; if (magnet) magnet--; K.SFX.play('ok'); K.ART.pop(sponge); }
        else { notes = Math.max(0, notes - 1); K.SFX.play('bad'); K.ART.shake(sponge); const fitTo = Object.entries(p.waves[wi].twins || {}).find(([, b]) => b === wd.text); note.innerHTML = `${K.da(wd.text)} ✗` + (fitTo ? ` → ${K.da(fitTo[0])}` : ' (passer ikke)'); if (fitTo) K.mistake(fitTo[0]); }
        if (wide) { wide--; sponge.classList.toggle('wide', wide > 0); }
        drawMeter();
        if (caught >= need) nextWave();
      }
      let since = 0;
      s.loop((dt) => {
        if (wi >= p.waves.length || wi < 0) return;
        sponge.style.transform = `translate(${x * W() - 28}px, ${H() - 70}px)`;
        if (pause > 0) { pause -= dt; return; }
        const speed = (60 + wi * 18) * (wi < 2 ? 1 : 1.15) * (high ? 0.6 : 1) * (K.fast ? 5 : 1); // px/s; first two waves slow
        since += dt;
        if (since > (K.fast ? 0.15 : 1.1) && words.length < 8) { since = 0; spawn(); }
        if (botX != null) x += Math.max(-1.5 * dt * (K.fast ? 6 : 1), Math.min(1.5 * dt * (K.fast ? 6 : 1), botX - x));
        const w = W(), h = H(), sy = h - 70, half = (wide ? 0.16 : 0.09);
        sponge.style.transform = `translate(${x * w - 28}px, ${sy}px)`;
        const wave = wi;
        for (const wd of words.slice()) {
          if (wi !== wave || !wd.node.isConnected) break; // a catch ended the wave: the rest of this frame is stale
          wd.y += speed * dt;
          if (magnet && wd.kind === 'fit') wd.x += (x - wd.x) * Math.min(1, dt * 2.5);
          wd.node.style.transform = `translate(calc(${wd.x * w}px - 50%), ${wd.y}px)`;
          if (wd.y > sy - 26 && wd.y < sy + 30 && Math.abs(wd.x - x) < half + 0.06) soak(wd);
          else if (wd.y > h) { wd.node.remove(); words.splice(words.indexOf(wd), 1); }
        }
      });
      // playtest: steer toward the lowest fitting word (or, in 'wrong' mode, sometimes toward a wrong one); the click is a no-op
      s.bot = (mode) => {
        const fits = words.filter((wd) => (mode === 'wrong' && Math.random() < 0.3 ? wd.kind !== 'fit' : wd.kind === 'fit' || wd.kind === 'pickup'));
        const t = fits.sort((a, b) => b.y - a.y)[0];
        if (t) botX = t.x;
        return sponge;
      };
      async function finish() {
        s.busy = false; s.bot = null;
        words.forEach((w) => w.node.remove()); words.length = 0; field.remove(); note.remove();
        if (K.st && !K.st.replay) K.st.riffNotes = notes;
        await K.stamp(s, body, p.id, right, Math.max(1, answered));
        s.finish();
      }
      drawMeter(); nextWave();
    },
  });
})(window.K = window.K || {});
