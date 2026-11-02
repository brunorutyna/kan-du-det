// "mirage" (new in Del 5): a short text shimmers on screen. One word in it is a mirage (a wrong form).
// Tap the word that lies (plain buttons: no glossary, so a long-press gives nothing away), then pick its true form.
// No time pressure. A wrong tap makes the haze thicker (a miss). With p.doubleFlag set, BOTH marked words lie.
// Text syntax: each marked word is {shown|right|other}. Every round has two marks; normally only the first lies,
// and the second shows its right form.
// params: { id, title, sub, doubleFlag, rounds: [{ text, why }] }
(function (K) {
  'use strict';
  const el = K.el;
  const MARK = /\{([^}]*)\}/g;
  const marks = (t) => [...String(t).matchAll(MARK)].map((m) => { const [shown, right, other] = m[1].split('|'); return { shown, right, other }; });
  const fill = (t, f) => { let k = 0; return String(t).replace(MARK, (m, body) => { const [shown, right] = body.split('|'); return f(k++, shown, right); }); };
  K.mirageRight = (t) => fill(t, (k, sh, r) => r);
  K.game('mirage', {
    title: 'Luftspejlinger',
    texts: (p) => p.rounds.flatMap((r) => [K.mirageRight(r.text)].concat(marks(r.text).flatMap((m) => [m.right, m.other]))),
    lint(p) {
      const e = [];
      p.rounds.forEach((r, i) => {
        const m = marks(r.text);
        if (m.length !== 2) e.push(`round ${i}: needs exactly 2 marks`);
        m.forEach((x, k) => {
          if (!x.shown || !x.right || !x.other) e.push(`round ${i} mark ${k}: needs shown|right|other`);
          if (x.shown === x.right) e.push(`round ${i} mark ${k}: the mirage equals the right form`);
          if (x.other === x.right || x.other === x.shown) e.push(`round ${i} mark ${k}: other must differ from both`);
          if (/\s/.test(x.shown)) e.push(`round ${i} mark ${k}: a mirage is one word`);
        });
        // the lying word must be unique in its sentence text, so tapping "the same word elsewhere" is never ambiguous
        const words = K.mirageRight(r.text).split(/\s+/);
        if (words.length > 26) e.push(`round ${i}: too long for a phone (${words.length} words)`);
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st || { flags: {} };
      const dbl = !!(p.doubleFlag && st.flags && st.flags[p.doubleFlag]);
      const { game, body } = K.frame(root, p.title, p.sub + (dbl ? ' To sind, to spejlinger.' : ''));
      game.classList.add('mirage-g');
      const prog = el('div', 'progress');
      const haze = el('div', 'haze small');
      const txt = el('div', 'mtext');
      const opts = el('div', 'opts');
      body.append(prog, haze, txt, opts);
      let score = 0, total = 0, misses = 0;
      const rounds = K.shuffle(p.rounds);
      const paintHaze = () => { haze.textContent = misses ? '🔥'.repeat(Math.min(misses, 10)) + ' Det flimrer.' : '☀️ Klart.'; game.style.setProperty('--haze', String(Math.min(misses, 8))); };
      paintHaze();
      (async () => {
        for (let i = 0; i < rounds.length; i++) {
          const r = rounds[i], ms = marks(r.text);
          const lying = ms.map((m, k) => k === 0 || dbl);
          const found = ms.map((m, k) => !lying[k]);
          prog.textContent = `${i + 1} / ${rounds.length}`;
          opts.innerHTML = '';
          // tokens: plain words; marked words carry their index
          txt.innerHTML = '';
          const parts = []; let k = 0;
          String(r.text).split(/(\{[^}]*\})/).forEach((chunk) => {
            if (/^\{/.test(chunk)) { const idx = k++; const m = ms[idx]; parts.push({ w: lying[idx] ? m.shown : m.right, mark: lying[idx] ? idx : -1 }); }
            else chunk.split(/\s+/).filter(Boolean).forEach((w) => parts.push({ w, mark: -1 }));
          });
          const btns = [];
          let miss = 0;
          const settle = () => found.every(Boolean);
          await new Promise((done) => {
            let onWord = null;
            parts.forEach((pt, n) => {
              const pun = (pt.w.match(/[.,!?]+$/) || [''])[0];
              const word = pt.w.slice(0, pt.w.length - pun.length);
              const b = s.btn(txt, K.esc(word), () => onWord(pt, b), { cls: 'mw', data: { m: String(pt.mark) } });
              btns.push(b);
              if (pun) txt.appendChild(el('span', 'mp', K.esc(pun)));
            });
            let picking = false;
            onWord = async (pt, b) => {
              if (picking || s.locked) return;
              if (pt.mark < 0 || found[pt.mark]) { miss++; misses++; paintHaze(); K.ART.shake(b); K.SFX.play('bad'); b.classList.add('shim'); return; }
              const m = ms[pt.mark];
              b.classList.add('caught'); picking = true;
              opts.innerHTML = '';
              opts.appendChild(el('div', 'prompt', `<b>${K.esc(m.shown)}</b> → ?`));
              const g = el('div', 'opts-in'); opts.appendChild(g);
              s.unlock();
              const ok = await new Promise((res) => {
                K.shuffle([m.right, m.shown, m.other]).forEach((o) => s.btn(g, K.da(o), async (e, bb) => {
                  const good = o === m.right;
                  bb.classList.add(good ? 'is-ok' : 'is-no');
                  if (good) K.ART.pop(bb); else K.ART.shake(bb);
                  K.feedback(s, opts, good, m.right, r.why);
                  await K.after(s, opts, good);
                  res(good);
                }, { answer: true, cls: 'opt', data: { right: o === m.right ? '1' : '0' } }));
                s.bot = (mode) => { if (s.locked) return null; const v = [...g.querySelectorAll('[data-right]')]; return mode === 'wrong' && Math.random() < 0.35 ? v.find((x) => x.dataset.right === '0') : v.find((x) => x.dataset.right === '1'); };
              });
              const clean = ok && miss === 0;
              total++; if (clean) score++; K.tally(p.id, clean);
              found[pt.mark] = true; miss = 0; picking = false;
              b.innerHTML = K.esc(m.right); b.classList.remove('caught'); b.classList.add('fixed');
              opts.innerHTML = '';
              setBot();
              s.unlock();
              if (settle()) done();
            };
            const setBot = () => {
              s.bot = (mode) => {
                if (s.locked) return null;
                const want = btns.find((x) => x.dataset.m !== '-1' && !found[+x.dataset.m]);
                if (mode === 'wrong' && Math.random() < 0.25) return btns.find((x) => x.dataset.m === '-1') || want;
                return want;
              };
            };
            setBot();
            s.unlock();
          });
          // the text settles: shown as real Danish (tappable for meanings), and spoken
          const right = K.mirageRight(r.text);
          txt.innerHTML = `<div class="da settled">${K.da(right)}</div>`;
          K.VOICE.say(right, null, true);
          if (misses > 0) misses = Math.max(0, misses - (dbl ? 2 : 1));
          paintHaze();
          s.bot = null;
          await new Promise((res) => { const b = s.btn(opts, 'Videre ▸', () => res(), { cls: 'next', data: { next: '1' } }); b.scrollIntoView({ block: 'end' }); });
        }
        txt.innerHTML = ''; opts.innerHTML = ''; haze.textContent = '';
        await K.stamp(s, body, p.id, score, Math.max(1, total));
        s.finish();
      })().catch(K.report);
    },
  });
})(window.K = window.K || {});
