// LYGTEN systems: run state helpers, the pack, water, the route map (hub) and small flow actions.
// New system 1: the map + run state. New system 2: the pack. Everything else is the kit.
(function (K) {
  'use strict';
  const el = K.el;
  K.T = {}; (K.THINGS || []).forEach((t) => { K.T[t.id] = t; });
  const W_FX = { sol: 'sol', storm: 'storm', nat: 'nat' };
  const PACK_MAX = 6;

  // ---------- pack and water (all values derived; every change saved at once)
  K.hasFx = (st, fx) => st.pack.some((id) => K.T[id] && K.T[id].fx === fx);
  K.maxWater = (st) => 6 + (K.hasFx(st, 'max') ? 3 : 0);
  K.water = function (st, d, quiet) {
    const before = st.water;
    st.water = Math.max(0, Math.min(K.maxWater(st), st.water + d));
    K.persist();
    const real = st.water - before;
    if (!quiet && real) K.toast((real > 0 ? '+' : '') + real + ' 💧', real > 0 ? 'good' : 'bad');
    return real;
  };
  K.cost = (node, st) => 1 + (node.w && !K.hasFx(st, W_FX[node.w]) ? 1 : 0);
  K.addThing = function (st, id) {
    if (st.pack.includes(id)) return true;
    if (st.pack.length >= PACK_MAX) return false;
    st.pack.push(id); K.persist(); return true;
  };
  K.strongest = function (st) {
    const rank = (id) => { const fx = K.T[id] && K.T[id].fx; const i = K.FX_ORDER.indexOf(fx); return i < 0 ? 99 : i; };
    return st.pack.map((id, i) => [id, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map((x) => x[0])[0] || null;
  };
  K.sell = function (st, id) {
    if (!id) return null;
    st.pack = st.pack.filter((x) => x !== id);
    st.sold.push(id); st.flags.everSold = true;
    K.mistake(K.T[id].da); // a sold word comes back for review at an oasis
    if (st.water > K.maxWater(st)) st.water = K.maxWater(st);
    K.persist();
    return K.T[id];
  };
  K.tally = function (st, game, ok) {
    const t = st.tally[game] || (st.tally[game] = { ok: 0, n: 0 });
    t.n++; if (ok) t.ok++;
    K.persist();
  };
  // Back from an encounter: to the map (hub) or to the next flow step.
  K.leave = function (s) {
    const st = K.st;
    if (s.params && s.params.hub && st) { st.at = null; st.row++; K.persist(); K.goStep(); }
    else s.finish();
  };

  // ---------- HUD: day, water, pack (tap a thing for its word)
  K.hud = function (s, parent) {
    const st = K.st; if (!st) return null;
    const h = el('div', 'hud');
    const mx = K.maxWater(st);
    h.appendChild(el('div', 'hud-day', `Dag ${st.day}`));
    h.appendChild(el('div', 'hud-water' + (st.water <= 1 ? ' low' : ''), '💧'.repeat(st.water) + '<span class="empty">' + '·'.repeat(Math.max(0, mx - st.water)) + '</span>'));
    const pk = el('div', 'hud-pack');
    st.pack.forEach((id) => {
      const t = K.T[id];
      const b = s.btn(pk, t.e, () => K.toast(t.da + (t.fx ? ' · ' + K.FX[t.fx].en : '')), { cls: 'pk', silent: true });
      if (t.fx) b.appendChild(el('i', '', K.FX[t.fx].icon));
    });
    for (let i = st.pack.length; i < PACK_MAX; i++) pk.appendChild(el('span', 'pk empty', ''));
    h.appendChild(pk);
    parent.appendChild(h);
    return h;
  };

  // ---------- map generation (curated layouts; only positions inside a row are shuffled)
  function makeMap(stretch) {
    const layouts = K.LAYOUTS[stretch];
    const rows = K.pick(layouts).map((row) => K.shuffle(row).map((n) => Object.assign({}, n, n.t === 'mirage' ? { lie: K.pick(K.MIRAGE[n.as]) } : {})));
    return { stretch, rows };
  }
  const spotLabel = (n) => (n.t === 'mirage' ? n.lie : K.SPOT[n.t].da);
  const spotOf = (n) => K.SPOT[n.t === 'mirage' ? n.as : n.t];
  const HINT = { grav: 'dig something up', karavane: 'trade things for water', skilt: 'price signs, water', oase: 'refill water', circle: '?' };

  // ---------- the map screen (the hub of a stretch)
  K.SCREENS.map = function (root, p, s) {
    const st = K.st;
    if (!st.map || st.map.stretch !== p.stretch) { st.map = makeMap(p.stretch); st.row = 0; st.stretch = p.stretch; K.persist(); }
    if (st.at) { st.at = null; st.row++; K.persist(); } // reloaded mid-encounter: that spot is forfeited (no reward replay)
    root.appendChild(K.ART.scene(st.row >= K.NIGHT_AFTER_ROW && !st.nights[p.stretch] ? 'night' : 'dune'));
    root.appendChild(el('div', 'lantern-glow'));
    const wrap = el('div', 'mapwrap'); root.appendChild(wrap);
    K.MUSIC.set('calm');

    // one ordered arrival: collapse → night offer → choose the next spot
    function arrive() {
      wrap.innerHTML = '';
      const rows = st.map.rows;
      if (st.row >= rows.length) return s.finish();
      if (st.water <= 0) return collapse();
      if (st.row === K.NIGHT_AFTER_ROW && !st.nights[p.stretch]) { st.nights[p.stretch] = true; K.persist(); if (st.pack.length) return night(); }
      choose();
    }

    function note(lines, done, choices) {
      wrap.innerHTML = '';
      K.hud(s, wrap);
      const box = el('div', 'note'); wrap.appendChild(box);
      lines.forEach((l) => {
        if (l.n) box.appendChild(el('div', 'narr', K.esc(l.n)));
        else if (l.th) box.appendChild(el('div', 'think', K.esc(l.th)));
        else {
          const c = K.CAST[l.w];
          const row = el('div', 'line'); row.style.borderColor = c.color;
          row.appendChild(el('div', 'who', K.esc(c.name)));
          row.appendChild(el('div', 'da', K.da(l.da)));
          const tools = el('div', 'tools'); row.appendChild(tools);
          s.btn(tools, '▶', () => K.VOICE.say(l.da, l.w, true), { cls: 'mini', silent: true });
          if (l.en) s.btn(tools, 'EN', (e, b) => { b.remove(); row.appendChild(el('div', 'en', K.esc(l.en))); st.english++; }, { cls: 'mini' });
          box.appendChild(row);
          K.VOICE.say(l.da, l.w, false);
        }
      });
      const bar = el('div', 'choice'); wrap.appendChild(bar);
      if (choices) {
        const bs = choices.map((c) => s.btn(bar, c.da ? K.da(c.da) : K.esc(c.en), () => { if (c.da) K.VOICE.say(c.da, null, true); c.fn(); }, { answer: true, cls: 'opt' + (c.da ? '' : ' english'), data: { k: c.k } }));
        s.bot = (mode) => bs.find((b) => b.dataset.k === (mode === 'wrong' ? 'yes' : 'no')) || bs[0];
      } else {
        const b = s.btn(bar, 'Videre ▸', () => done(), { cls: 'next', data: { next: '1' } });
        s.bot = () => b;
      }
    }

    function collapse() {
      const id = K.strongest(st);
      if (!id) { st.flags.collapsedEmpty = true; K.persist(); st.step = K.FLOW.length - 1; return K.goStep(); }
      const t = K.T[id];
      note([
        { n: 'Your legs give way. Sand in your mouth. A warm light leans over you.' },
        { w: 'lygten', da: `Du er faldet om. Jeg tager ordet '${t.word}'. Her er tre slurke vand.`, en: `You have collapsed. I take the word '${t.word}'. Here are three sips of water.` },
      ], () => { K.sell(st, id); K.water(st, 3); arrive(); });
    }

    function night() {
      const id = K.strongest(st), t = K.T[id];
      K.MUSIC.set('tense');
      const done = () => { K.MUSIC.set('calm'); arrive(); };
      note([
        { n: 'Night. The lantern drifts down beside you. It smells of warm oil and old paper.' },
        { w: 'lygten', da: `Giv mig ordet '${t.word}', så får du tre slurke vand.`, en: `Give me the word '${t.word}', and you get three sips of water.` },
      ], null, [
        { k: 'yes', da: 'Ja, tag det.', fn: () => { K.sell(st, id); K.water(st, 3); s.unlock(); note([{ n: `Your ${t.word} crumbles into sand.` }, { th: 'Water. Warm water. It tastes of nothing.' }], done); } },
        { k: 'no', da: 'Nej tak.', fn: () => { s.unlock(); note([{ n: 'The light dims, a little offended, and floats off.' }], done); } },
        { k: 'en', en: '(EN) No. (costs 1 💧)', fn: () => { st.english++; K.water(st, -1); s.unlock(); note([{ n: 'It laughs at your English. You lose a sip in the fright.' }], done); } },
      ]);
    }

    function choose() {
      wrap.innerHTML = '';
      K.hud(s, wrap);
      if (st.stretch === 1 && st.row === 0) wrap.appendChild(el('div', 'tipline', 'Hvert skridt koster vand. (Every step costs water.)'));
      wrap.appendChild(el('div', 'maptitle', K.da('Hvor vil du gå hen?')));
      const row = st.map.rows[st.row];
      const cards = el('div', 'spots'); wrap.appendChild(cards);
      row.forEach((n, i) => {
        const sp = spotOf(n), c = K.cost(n, st);
        const w = n.w ? K.WEATHER[n.w] : null;
        const html = `<div class="sp-e">${sp.e}</div><div class="sp-l">${K.da(spotLabel(n))}</div>` +
          `<div class="sp-m">${w ? `<span class="wx">${w.e} ${K.da(w.da)}</span>` : ''}<span class="cost">−${c} 💧</span><span class="days">+${n.d} d</span></div>` +
          `<div class="sp-h">${K.esc(HINT[n.t === 'mirage' ? n.as : n.t])}</div>`;
        s.btn(cards, html, () => go(n, i), { answer: true, cls: 'spot', data: { mirage: n.t === 'mirage' ? '1' : '0' } });
      });
      const nxt = st.map.rows[st.row + 1];
      if (nxt) {
        const pv = el('div', 'preview'); pv.appendChild(el('span', 'small', 'Bagefter:'));
        nxt.forEach((n) => pv.appendChild(el('span', 'pv', spotOf(n).e)));
        wrap.appendChild(pv);
      }
      s.bot = (mode) => {
        const bs = [...cards.querySelectorAll('.spot')];
        return mode === 'right' ? (bs.find((b) => b.dataset.mirage === '0') || bs[0]) : bs[0];
      };
    }

    function go(n, i) {
      K.water(st, -K.cost(n, st), true);
      st.day += n.d;
      if (n.t === 'mirage') {
        st.flags.sawMirage = true; K.persist();
        s.unlock();
        return note([
          { n: n.as === 'oase' ? 'Palms. Water glittering. You run the last bit.' : 'Camels, bells, a tent. You wave.' },
          { n: 'Then it is sand. Only sand. The sign on the post says:', },
          { w: 'lygten', da: `${n.lie}`, en: 'A label with a mistake in it.' },
          { th: 'One wrong letter. Somebody cannot spell.' },
        ], () => { st.row++; K.persist(); arrive(); });
      }
      st.at = { row: st.row, i }; K.persist();
      if (n.t === 'circle') {
        s.unlock();
        return note([
          { n: 'A dune you know. Footprints, half blown away. Yours. Two things sticking out of the sand, exactly where you left them.' },
          { th: 'Same dune. Same footprints. Mine. I have walked in a circle.' },
        ], () => K.show('graven', { hub: true, circle: true }));
      }
      const screen = { grav: 'graven', karavane: 'karavanen', skilt: 'skiltet', oase: 'oasen' }[n.t];
      K.show(screen, { hub: true, node: n });
    }

    arrive();
  };

  // ---------- small flow actions (do one thing, then the next step)
  K.ACTS = {
    sell2(st) {
      const a = K.sell(st, K.strongest(st)), b = K.sell(st, K.strongest(st));
      st.lastSold = [a, b].filter(Boolean).map((t) => t.word).join(' and ') || 'nothing';
      st.water = K.maxWater(st);
    },
    sell1(st) { K.sell(st, K.strongest(st)); st.day += 8; },
    nextStretch(st) { st.map = null; st.row = 0; st.at = null; },
    toCity(st) { st.day += 1; },
    finale(st) {
      if (st.flags.gaveAll) [...st.pack].forEach((id) => K.sell(st, id));
      st.score = 0; st.ranks = {};
      Object.entries(st.tally).forEach(([g, t]) => { st.ranks[g] = K.rank(t.ok, t.n); st.score += t.ok; const best = K.save.stats.ranks[g]; if (!best || 'SABC'.indexOf(st.ranks[g]) < 'SABC'.indexOf(best)) K.save.stats.ranks[g] = st.ranks[g]; });
    },
  };
  K.SCREENS.act = function (root, p, s) {
    K.ACTS[p.do](K.st); K.persist();
    s.bot = () => null;
    s.timer(() => s.finish(), 0);
  };
})(window.K = window.K || {});
