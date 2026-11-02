// "talk" (new in Del 5): a conversation, one exchange at a time, at your own pace.
// She says a line; you pick one of three replies. Replies differ in MEANING (moves the bond, shown only by her face)
// and in GRAMMAR (one is wrong: she misreads it). There is no meter with a "good" end: her face is the meter.
// A reply can need a piece of you (needs: 'stemme'): if flags['lost_stemme'] is set, it is shown greyed out.
// params: { id, title, sub, who, flag ('bond'), exchanges: [{ says: string | (st) => string, en,
//           replies: [{ da, ok, fix (the right version, for a wrong one), bond: -1|0|1, reply, en, needs, set }] }] }
(function (K) {
  'use strict';
  const el = K.el;
  const clamp = (n) => Math.max(-3, Math.min(3, n | 0));
  K.bondOf = (st) => clamp(((st && st.flags) || {}).bond || 0);
  const sayOf = (x, st) => (typeof x.says === 'function' ? x.says(st) : x.says);
  const NEEDS = { stemme: 'din stemme', minder: 'dine minder', droemme: 'dine drømme', appetit: 'din appetit', tanker: 'dine tanker', skam: 'din skam', navn: 'dit navn' };
  K.NEEDS = NEEDS;
  const stageLine = (d) => (d > 0 ? 'Hun rykker tættere på.' : d < 0 ? 'Hun kigger væk.' : 'Hun ser på dig.');
  K.game('talk', {
    title: 'Samtalen',
    texts(p) {
      const out = ['Hun rykker tættere på.', 'Hun kigger væk.', 'Hun ser på dig.'];
      for (let b = -3; b <= 3; b++) [false, true].forEach((h) => p.exchanges.forEach((x) => out.push(sayOf(x, { flags: { bond: b, holdt: h } }))));
      p.exchanges.forEach((x) => x.replies.forEach((r) => { out.push(r.da, r.reply); if (r.fix) out.push(r.fix); }));
      return out.filter(Boolean);
    },
    lint(p) {
      const e = [];
      (p.exchanges || []).forEach((x, i) => {
        if (!x.replies || x.replies.length !== 3) e.push(`exchange ${i}: needs exactly 3 replies`);
        const okFree = x.replies.filter((r) => r.ok && !r.needs);
        if (!okFree.length) e.push(`exchange ${i}: no grammatical reply that is always available (every lost-piece combination must leave one)`);
        x.replies.forEach((r, k) => {
          if (!r.reply) e.push(`exchange ${i} reply ${k}: no answer line from her`);
          if (!r.ok && !r.fix) e.push(`exchange ${i} reply ${k}: a wrong reply needs fix (the right version)`);
          if (r.ok && r.fix) e.push(`exchange ${i} reply ${k}: a right reply has a fix`);
          if (r.needs && !NEEDS[r.needs]) e.push(`exchange ${i} reply ${k}: unknown piece ${r.needs}`);
          if (r.fix && r.fix === r.da) e.push(`exchange ${i} reply ${k}: fix equals the wrong reply`);
        });
        if (!x.replies.some((r) => !r.ok)) e.push(`exchange ${i}: needs one grammatically wrong reply`);
      });
      return e;
    },
    screen(root, p, s) {
      const st = K.st || { flags: {} };
      const F = st.flags || (st.flags = {});
      if (F.bond == null) F.bond = 0;
      const { game, body } = K.frame(root, p.title, p.sub);
      game.classList.add('talk-g');
      const c = K.CAST[p.who || 'flue'];
      const face = el('div', 'face', `<div class="fe">${c.e}</div><div class="name">${K.esc(c.name)}</div>`);
      const prog = el('div', 'progress');
      const log = el('div', 'tlog');
      const opts = el('div', 'opts');
      body.append(prog, face, log, opts);
      const paint = () => {
        const b = K.bondOf(st);
        face.style.setProperty('--b', String(b));
        face.dataset.b = String(b);
      };
      paint();
      let score = 0, total = 0;
      const line = (who, da, en) => {
        const cc = K.CAST[who] || { name: who, color: '#888' };
        const row = el('div', 'line'); row.style.borderColor = cc.color;
        row.appendChild(el('div', 'who', K.esc(cc.name)));
        row.appendChild(el('div', 'da', K.da(da)));
        const tools = el('div', 'tools'); row.appendChild(tools);
        s.btn(tools, '▶', () => K.VOICE.say(da, who, 'replay'), { cls: 'mini', silent: true });
        if (en) s.btn(tools, 'EN', (ev, b) => { b.remove(); row.appendChild(el('div', 'en', K.esc(en))); if (K.st) K.st.english++; }, { cls: 'mini' });
        log.appendChild(row); row.scrollIntoView({ block: 'end', behavior: K.fast ? 'auto' : 'smooth' });
        return row;
      };
      const next = () => new Promise((res) => { const b = s.btn(opts, 'Videre ▸', () => res(), { cls: 'next', data: { next: '1' } }); b.scrollIntoView({ block: 'end' }); });
      (async () => {
        for (let i = 0; i < p.exchanges.length; i++) {
          const x = p.exchanges[i];
          log.innerHTML = ''; opts.innerHTML = '';
          prog.textContent = `${i + 1} / ${p.exchanges.length}`;
          const said = sayOf(x, st);
          line(p.who || 'flue', said, x.en);
          K.VOICE.say(said, p.who || 'flue', i > 0);
          s.unlock();
          const r = await new Promise((res) => {
            K.shuffle(x.replies).forEach((rp) => {
              const gone = rp.needs && F['lost_' + rp.needs];
              const b = s.btn(opts, K.da(rp.da) + (gone ? `<span class="need">(du har ikke ${K.esc(NEEDS[rp.needs])})</span>` : ''), () => res(rp),
                { answer: true, cls: 'opt' + (gone ? ' gone' : ''), data: { ok: rp.ok ? '1' : '0' } });
              if (gone) b.disabled = true;
            });
            s.bot = (mode) => {
              if (s.locked) return null;
              const v = [...opts.querySelectorAll('.opt')].filter((b) => !b.disabled);
              if (mode === 'wrong' && Math.random() < 0.4) return v.find((b) => b.dataset.ok === '0') || v[0];
              const good = v.filter((b) => b.dataset.ok === '1');
              return good[Math.floor(Math.random() * good.length)] || v[0];
            };
          });
          s.bot = null;
          opts.innerHTML = '';
          total++; K.tally(p.id, !!r.ok);
          line('svampen', r.da);
          K.VOICE.say(r.da, 'svampen', true);
          if (r.ok) { score++; K.SFX.play('ok'); } else K.feedback(s, log, false, r.fix, r.why || 'She hears something else.');
          if (r.set) Object.assign(F, r.set);
          const d = r.ok ? (r.bond || 0) : 0;
          F.bond = clamp((F.bond || 0) + d);
          line(p.who || 'flue', r.reply, r.en);
          K.VOICE.say(r.reply, p.who || 'flue', false);
          paint(); K.ART.pop(face);
          log.appendChild(el('div', 'narr stage-l', K.da(stageLine(d))));
          await next();
        }
        log.innerHTML = ''; opts.innerHTML = ''; s.bot = null;
        await K.stamp(s, body, p.id, score, Math.max(1, total));
        s.finish();
      })().catch(K.report);
    },
  });
})(window.K = window.K || {});
