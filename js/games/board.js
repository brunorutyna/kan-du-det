// "board" (new in Del 4): a grid of big tiles (a stage of characters, or the rooms of a house) and a list of requests.
//  stage: rounds come one by one; a description names one tile (or "Ingen af dem"); tap it; then an optional follow-up pick.
//  map:   all open requests are visible at once; YOU choose the order by tapping a room. A request's room may be locked
//         (opens when an item is collected) and a request may be silent (appears when an item is collected).
//         Each found item: pick the movement sentence, then the hand-over sentence.
// params: { id, title, sub, mode: 'stage'|'map', cols, tiles: [{ id, e, label, level, lock, twin }],
//           rounds (stage): [{ desc, en, target, hint, follow: { q, right, wrong, why } }],
//           requests (map): [{ id, who, e, item, clue, en, room, needs, steps: [{ q, right, wrong, why }] }],
//           twinFlag: flag name that turns on mirror twins (stage) }
(function (K) {
  'use strict';
  const el = K.el;
  const allTexts = (p) => [].concat(
    (p.tiles || []).map((t) => t.label),
    (p.rounds || []).flatMap((r) => [r.desc, r.follow && r.follow.q, r.follow && r.follow.right]),
    (p.requests || []).flatMap((r) => [r.clue, r.item].concat((r.steps || []).flatMap((x) => [x.q, x.right]))),
  ).filter(Boolean);
  // map reachability: collect greedily; every request must be reachable in some order
  K.boardReach = function (p) {
    const got = new Set(), done = new Set();
    let moved = true;
    while (moved) {
      moved = false;
      (p.requests || []).forEach((r) => {
        if (done.has(r.id)) return;
        const room = (p.tiles || []).find((t) => t.id === r.room);
        if (r.needs && !got.has(r.needs)) return;
        if (!room || (room.lock && !got.has(room.lock))) return;
        done.add(r.id); got.add(r.id); moved = true;
      });
    }
    return (p.requests || []).filter((r) => !done.has(r.id)).map((r) => r.id);
  };
  K.game('board', {
    title: 'Board',
    texts: allTexts,
    lint(p) {
      const e = [], ids = new Set((p.tiles || []).map((t) => t.id));
      (p.tiles || []).forEach((t) => { if (!t.e) e.push(`tile ${t.id}: no emoji`); });
      if (p.mode === 'stage') (p.rounds || []).forEach((r, i) => {
        if (!ids.has(r.target) && r.target !== 'ingen') e.push(`round ${i}: unknown target ${r.target}`);
        if (r.follow && (!r.follow.wrong || r.follow.wrong.length < 2 || r.follow.wrong.includes(r.follow.right))) e.push(`round ${i}: follow-up needs right + 2 different wrong`);
      });
      if (p.mode === 'map') {
        (p.requests || []).forEach((r) => {
          if (!ids.has(r.room)) e.push(`request ${r.id}: unknown room ${r.room}`);
          (r.steps || []).forEach((x, k) => { if (!x.wrong || x.wrong.length < 2 || x.wrong.includes(x.right)) e.push(`request ${r.id} step ${k}: right + 2 different wrong`); });
        });
        const stuck = K.boardReach(p);
        if (stuck.length) e.push(`requests never reachable: ${stuck.join(', ')}`);
      }
      const n = (p.tiles || []).length * (p.twinFlag ? 2 : 1) + (p.mode === 'stage' ? 1 : 0);
      if (n > 12) e.push(`too many tiles (${n}) for a phone`);
      return e;
    },
    screen(root, p, s) {
      const st = K.st || { flags: {} };
      const { game, body } = K.frame(root, p.title, p.sub);
      const twins = !!(p.twinFlag && st.flags && st.flags[p.twinFlag]);
      if (twins) game.classList.add('trip-bg');
      let score = 0, total = 0;
      const board = el('div', 'board ' + (p.mode || 'stage')); board.style.setProperty('--cols', String(p.cols || 3));
      const info = el('div', 'binfo');
      const opts = el('div', 'opts');
      body.appendChild(info); body.appendChild(board); body.appendChild(opts);
      let onTile = () => {};
      const tileEls = {};
      const tiles = (p.tiles || []).slice();
      function drawTiles(got) {
        board.innerHTML = '';
        const list = [];
        tiles.forEach((t) => {
          list.push(t);
          if (twins && p.mode === 'stage') list.push(Object.assign({}, t, { id: t.id + '~', twinOf: t.id }));
        });
        if (p.mode === 'stage') list.push({ id: 'ingen', e: '∅', label: 'Ingen af dem' });
        list.forEach((t) => {
          const locked = t.lock && !(got && got.has(t.lock));
          const b = s.btn(board, `<span class="te">${t.e}</span><span class="tl">${locked ? '🔒' : K.esc(t.label)}</span>`, (e, bb) => onTile(t, bb), { cls: 'tile-b' + (t.twinOf ? ' mirror' : '') + (locked ? ' locked' : '') + (t.level ? ' lv-' + t.level : ''), data: { tile: t.id } });
          tileEls[t.id] = b;
        });
      }
      function pick(q, right, wrong, why) {
        return new Promise((res) => {
          opts.innerHTML = '';
          opts.appendChild(el('div', 'prompt', K.da(q)));
          const g = el('div', 'opts-in'); opts.appendChild(g);
          K.shuffle([right].concat(wrong.slice(0, 2))).forEach((o) => s.btn(g, K.da(o), async (e, b) => {
            const ok = o === right; total++;
            b.classList.add(ok ? 'is-ok' : 'is-no'); K.tally(p.id, ok);
            if (ok) { score++; K.ART.pop(b); K.VOICE.say(right, null, true); } else K.ART.shake(b);
            K.feedback(s, opts, ok, right, why);
            await K.after(s, opts, ok);
            res(ok);
          }, { answer: true, cls: 'opt', data: { right: o === right ? '1' : '0' } }));
          s.unlock();
          s.bot = (mode) => { if (s.locked) return null; const v = [...g.querySelectorAll('[data-right]')]; return mode === 'wrong' && Math.random() < 0.4 ? v.find((x) => x.dataset.right === '0') : v.find((x) => x.dataset.right === '1'); };
        });
      }
      async function stage() {
        drawTiles();
        const rounds = p.keep ? p.rounds.slice() : K.shuffle(p.rounds.filter((r) => !r.last)).concat(p.rounds.filter((r) => r.last));
        for (let i = 0; i < rounds.length; i++) {
          const r = rounds[i];
          opts.innerHTML = '';
          info.innerHTML = `<div class="progress">${i + 1} / ${rounds.length}</div><div class="line"><div class="da">${K.da(r.desc)}</div>${twins && r.hint ? `<div class="small">(${K.esc(r.hint)})</div>` : ''}</div>`;
          K.VOICE.say(r.desc, null, i > 0);
          s.unlock();
          const ok = await new Promise((res) => {
            onTile = async (t, b) => {
              if (s.locked) return; s.locked = true;
              const hit = t.id === r.target; total++;
              K.tally(p.id, hit);
              b.classList.add(hit ? 'is-ok' : 'is-no');
              if (hit) { score++; K.ART.pop(b); K.SFX.play('ok'); } else K.ART.shake(b);
              const right = r.target === 'ingen' ? 'Ingen af dem' : (tiles.find((x) => x.id === r.target) || {}).label;
              K.feedback(s, opts, hit, right, t.twinOf ? 'A mirror twin: the smoke shows everyone twice.' : r.why);
              await K.after(s, opts, hit);
              Object.values(tileEls).forEach((x) => x.classList.remove('is-ok', 'is-no'));
              res(hit);
            };
            s.bot = (mode) => { if (s.locked) return null; const want = mode === 'wrong' && Math.random() < 0.4 ? (tiles[0].id === r.target ? tiles[1].id : tiles[0].id) : r.target; return tileEls[want]; };
          });
          if (r.follow) await pick(r.follow.q, r.follow.right, r.follow.wrong, r.follow.why);
          void ok;
        }
        finish();
      }
      async function map() {
        const got = new Set(), done = new Set();
        const bag = el('div', 'bag'); body.insertBefore(bag, opts);
        const sand = el('div', 'sand small'); body.insertBefore(sand, opts); let sandN = 0;
        let here = (tiles.find((t) => t.start) || tiles[0]).id;
        drawTiles(got);
        const open = () => p.requests.filter((r) => !done.has(r.id) && (!r.needs || got.has(r.needs)));
        while (done.size < p.requests.length) {
          opts.innerHTML = '';
          Object.values(tileEls).forEach((x) => x.classList.toggle('here', x.dataset.tile === here));
          info.innerHTML = `<div class="progress">${done.size} / ${p.requests.length}</div>` + open().map((r) => `<div class="req">${r.e || ''} <b>${K.esc(K.CAST[r.who] ? K.CAST[r.who].name : r.who)}:</b> ${K.da(r.clue)}</div>`).join('');
          s.unlock();
          const req = await new Promise((res) => {
            onTile = async (t, b) => {
              if (s.locked) return;
              if (t.lock && !got.has(t.lock)) { K.ART.shake(b); K.SFX.play('bad'); return; } // locked: not a mistake, just shut
              s.locked = true;
              const r = open().find((x) => x.room === t.id);
              if (!r) { K.tally(p.id, false); total++; sandN++; sand.textContent = '⏳'.repeat(Math.min(sandN, 8)) + ' Sand drysser ned. Der er ikke noget her.'; K.ART.shake(b); K.SFX.play('bad'); s.locked = false; return; }
              here = t.id; Object.values(tileEls).forEach((x) => x.classList.toggle('here', x.dataset.tile === here)); K.ART.pop(b);
              res(r);
            };
            s.bot = (mode) => {
              if (s.locked) return null;
              const o = open();
              if (mode === 'wrong' && Math.random() < 0.25) { const empty = tiles.find((t) => !(t.lock && !got.has(t.lock)) && !o.some((r) => r.room === t.id)); if (empty) return tileEls[empty.id]; }
              return o.length ? tileEls[o[0].room] : null;
            };
          });
          for (const x of req.steps) await pick(x.q, x.right, x.wrong, x.why);
          done.add(req.id); got.add(req.id);
          bag.innerHTML = '🎒 ' + p.requests.filter((r) => done.has(r.id)).map((r) => r.e || '•').join(' ');
          K.ART.pop(bag);
          drawTiles(got);
        }
        finish();
      }
      async function finish() {
        opts.innerHTML = ''; info.innerHTML = ''; s.bot = null;
        await K.stamp(s, body, p.id, score, Math.max(1, total));
        s.finish();
      }
      (p.mode === 'map' ? map : stage)();
    },
  });
})(window.K = window.K || {});
