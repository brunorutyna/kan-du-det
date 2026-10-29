// Kan du det?! — Sunday mini-games and the finale. SPOILERS in comments.
(function (K) {
  'use strict';
  const el = K.el, wait = K.wait;

  // ============ 6. Stirren igen ============
  // Saturday 11:50 from Ellen's side. Holger's reactions are fixed (the player's own); Ellen must say what produces them.
  const PRED = { slips: 'flot', hue: 'flot', sko: 'flot', skjorte: 'flot', kasket: 'flot' };
  function statement(o, v, pol) {
    if (o.v === v && o.pol === pol) return o.da;
    const d = K.np('def', [o.adj], o.noun);
    const pred = K.adjForm(PRED[o.noun] || 'flot', o.noun, 'pred');
    if (v === 'er') return pol > 0 ? `Jeg er vild med ${d}.` : `Jeg er ikke så vild med ${d}.`;
    if (v === 'kan') return pol > 0 ? `Jeg kan godt lide ${d}.` : `Jeg kan ikke lide ${d}.`;
    return pol > 0 ? `Jeg synes, ${d} er ${pred}.` : `Jeg synes ikke, ${d} er så ${pred}.`;
  }
  // which (verb, polarity) produce a given reaction text
  function producers(said) {
    const out = [];
    ['er', 'kan', 'synes'].forEach((v) => [1, -1].forEach((pol) => { const r = K.reactions(v, pol); if (said === r.agree || said === r.surprise) out.push([v, pol]); }));
    return out;
  }
  K.stirrenTable = function () {
    // for lint: every possible Saturday reaction has ≥1 producing and ≥2 non-producing Ellen lines
    const rows = [];
    K.OPIN.forEach((o) => ['er', 'kan', 'synes'].forEach((v) => [1, -1].forEach((pol) => {
      const r = K.reactions(v, pol);
      [r.agree, r.surprise].forEach((said) => {
        const prod = producers(said);
        const all = []; ['er', 'kan', 'synes'].forEach((v2) => [1, -1].forEach((p2) => all.push([v2, p2])));
        const yes = all.filter(([a, b]) => prod.some(([c, d]) => a === c && b === d)).length, no = all.length - yes;
        rows.push({ item: o.noun, said, yes, no });
      });
    })));
    return rows;
  };
  K.G.stirrenIgen = {
    title: 'Stirren igen', sub: 'Lørdag 11:50 — fra den anden side',
    lines() { const L = []; K.OPIN.forEach((o) => ['er', 'kan', 'synes'].forEach((v) => [1, -1].forEach((pol) => L.push({ w: 'ellen', da: statement(o, v, pol) })))); return L; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Stirren igen', 'Han har allerede svaret. Hvad sagde du?');
      const stage = el('div', 'stage stare flip'); const bg = el('img', 'donor'); bg.src = 'img/holger.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
      const sat = (st.stirren && st.stirren.length) ? st.stirren : K.OPIN.map((o, i) => { const r = K.reactions(o.v, o.pol); return { i, said: K.pick([r.agree, r.surprise]), kind: 'agree' }; });
      let score = 0, max = 0;
      for (const rec of sat) {
        const o = K.OPIN[rec.i];
        const area = el('div', 'sal');
        area.appendChild(el('div', 'frame', 'Holger svarer:'));
        area.appendChild(K.renderLine({ w: 'holger', da: rec.said }));
        stage.appendChild(area);
        if (rec.said !== '…') await K.audio.say('holger', rec.said);
        const prod = rec.said === '…' ? [] : producers(rec.said);
        let opts;
        if (!prod.length) {
          // silence on Saturday: anything works; Ellen remembers saying it anyway
          opts = [[o.v, o.pol]];
        } else {
          const right = prod[0];
          const others = [];
          ['er', 'kan', 'synes'].forEach((v) => [1, -1].forEach((pol) => { if (!prod.some(([a, b]) => a === v && b === pol)) others.push([v, pol]); }));
          opts = [right].concat(K.shuffle(others).slice(0, 2));
        }
        max++;
        const texts = opts.map(([v, pol]) => statement(o, v, pol));
        const right = texts[0];
        const pick = await new Promise((res) => {
          const box = el('div', 'opts');
          K.shuffle(texts).forEach((t) => { const b = el('button', 'opt', K.daHTML(t)); b.type = 'button'; b.onclick = () => { box.remove(); res(t); }; box.appendChild(b); });
          area.appendChild(box);
        });
        await K.audio.say('ellen', pick);
        if (pick === right) {
          score++; K.feedback(area, true);
          if (right !== o.da) area.appendChild(el('div', 'think', 'That is not what you said on Saturday. Is it? His answer says it is.'));
        } else {
          K.sock(1, 'svaret passer ikke');
          const [v, pol] = opts[0];
          K.feedback(area, false, right, `"${rec.said}" repeats the verb ${v} and answers a ${pol > 0 ? 'positive' : 'negative'} sentence.`);
        }
        await wait(K.fast ? 50 : 1800);
        area.remove();
      }
      await K.resultStamp('stirrenIgen', score, max);
      return score;
    },
  };

  // ============ 7. Rettelser ============
  const SEED = [['indef', 'groen', 'sofa', 'en grønt sofa'], ['def', 'gul', 'lampe', 'den gul lampe'], ['indef', 'hvid', 'taeppe', 'et hvid tæppe'], ['def', 'stor', 'reol', 'den stor reol']];
  K.G.rettelser = {
    title: 'Rettelser', sub: 'Ret mærkerne',
    lines() { return [{ w: 'gun', da: 'Den kan du ikke rette. Den er rød.' }]; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Rettelser', 'Tryk på et mærke. Er det rigtigt?');
      // Holger's tags (unique), wrong ones first
      const seen = new Set(); let tags = [];
      (st.tags || []).forEach((t) => { if (!seen.has(t.text) && t.right) { seen.add(t.text); tags.push(Object.assign({ hand: 'holger' }, t)); } });
      const wrong = tags.filter((t) => !t.ok).slice(0, 6), right = K.shuffle(tags.filter((t) => t.ok)).slice(0, 3);
      tags = wrong.concat(right);
      // phrases missed in earlier runs come back as other people's tags
      K.reviewItems(3).forEach((r) => { const right = K.np(r.det, [r.adj], r.noun); if (tags.some((t) => t.right === right)) return; const w = K.wrongForms(r.det, r.adj, r.noun, 1)[0]; if (w) tags.push({ det: r.det, adj: r.adj, noun: r.noun, text: w, right, ok: false, hand: 'other' }); });
      SEED.forEach(([det, adj, noun, text]) => { if (tags.filter((t) => !t.ok).length < 4) tags.push({ det, adj, noun, text, right: K.np(det, [adj], noun), ok: false, hand: 'other' }); });
      while (tags.length < 6) { const [det, adj, noun] = K.pick([['indef', 'roed', 'stol'], ['def', 'sort', 'seng'], ['indef', 'blaa', 'kjole']]); const r = K.np(det, [adj], noun); if (!tags.some((t) => t.text === r)) tags.push({ det, adj, noun, text: r, right: r, ok: true, hand: 'other' }); }
      // the scarf tag
      if (st.scarf === 'roed') tags.push({ det: 'def', adj: 'roed', noun: 'toerklaede', text: 'det røde tørklæde', right: 'det røde tørklæde', ok: true, hand: 'holger', scarf: true, colour: 'groen' });
      if (st.scarf === 'sock') tags.push({ det: 'def', adj: 'groen', noun: 'toerklaede', text: 'det grønt tørklæde', right: 'det grønne tørklæde', ok: false, hand: 'holger', scarf: true });
      tags = K.shuffle(tags);
      const grid = el('div', 'tags'); body.appendChild(grid);
      let score = 0; const max = tags.length;
      let left = tags.length;
      const done = el('button', 'next', 'Færdig ▸'); done.type = 'button';
      for (const t of tags) {
        const cell = el('button', 'tagcell ' + t.hand); cell.type = 'button';
        const colour = t.colour || t.adj; const isCol = K.COLOURS.includes(colour);
        const img = await K.objImg(t.noun, isCol ? colour : null, K.PATTERNS.includes(t.adj) ? t.adj : null, 120);
        cell.appendChild(img);
        if (t.scarf && st.scarf === 'sock') { img.src = (await K.objCanvas('sokker', 'beige', null, 120)).toDataURL(); }
        const lbl = el('div', 'tagtext', K.daHTML(t.text)); cell.appendChild(lbl);
        cell.onclick = async () => {
          if (cell.classList.contains('judged')) return;
          const opts = [{ t: 'Det er rigtigt.', keep: true }];
          const fixes = K.shuffle([t.right].concat(K.wrongForms(t.det, t.adj, t.noun, 2)).filter((x) => x !== t.text)).slice(0, 3);
          if (t.scarf && st.scarf === 'roed') fixes.unshift('det grønne tørklæde');
          fixes.forEach((f) => opts.push({ t: f }));
          const ov = el('div', 'modal'); ov.appendChild(el('div', 'prompt', 'Mærket siger: ' + K.daHTML(t.text)));
          const box = el('div', 'opts'); ov.appendChild(box); body.appendChild(ov);
          const pick = await new Promise((res) => [...new Set(opts.map((o) => o.t))].forEach((x) => { const b = el('button', 'opt', K.daHTML(x)); b.type = 'button'; b.onclick = () => res(x); box.appendChild(b); }));
          ov.remove();
          if (t.scarf && st.scarf === 'roed' && pick === 'det grønne tørklæde') {
            body.appendChild(K.renderLine({ w: 'gun', da: 'Den kan du ikke rette. Den er rød.', en: 'You cannot fix that one. It is red.' }));
            K.audio.say('gun', 'Den kan du ikke rette. Den er rød.');
            K.audio.sfx('bad'); return;
          }
          cell.classList.add('judged'); left--;
          if (pick === 'Det er rigtigt.') {
            if (t.ok) { score++; cell.classList.add('good'); K.audio.sfx('ok'); }
            else { cell.classList.add('bad'); K.sock(1, 'fejlen blev'); K.toast('Rigtigt: ' + t.right, 'bad'); }
          } else if (pick === t.right && !t.ok) {
            score++; st.fixed++; cell.classList.add('good'); lbl.innerHTML = K.daHTML(t.right); K.sock(-1, 'rettet'); K.gotRight(t.right);
            if (t.scarf) { st.scarf = 'groen'; st.scarfFixed = true; img.src = (await K.objCanvas('toerklaede', 'groen', null, 120)).toDataURL(); K.toast('Tørklædet er tilbage!', 'good'); }
          } else {
            cell.classList.add('bad'); K.sock(1, 'ny fejl'); lbl.innerHTML = K.daHTML(pick); K.toast('Rigtigt: ' + t.right, 'bad');
          }
          if (left <= 0) done.classList.add('pulse');
        };
        grid.appendChild(cell);
      }
      body.appendChild(done);
      await new Promise((res) => (done.onclick = res));
      await K.resultStamp('rettelser', score, max);
      return score;
    },
  };

  // ============ 8. Auktionen ============
  // The game you must lose: praise drives the price up; honest criticism brings the real lot forward.
  const AUC = {
    open: 'Lot nummer et: det ternede jakkesæt! Sikke et jakkesæt! Hvem byder?',
    pushes: ['Hvor er det et flot jakkesæt!', 'Se de lækre knapper!', 'Det passer perfekt til damen i rødt!', 'Det er et unikt jakkesæt!', 'Sidste chance!'],
    up: 'Damen i rødt byder! Prisen stiger!', down: 'Prisen falder…', withdraw: 'Okay, okay. Jakkesættet går tilbage. Næste lot!',
    sold: 'Solgt! Til damen i rødt!', next: 'Næste lot:', crowdLeave: 'Folk går.',
  };
  const ELLEN_PRAISE = [['Sikke et flot jakkesæt!', true], ['Hvor er det et lækkert jakkesæt!', true], ['Sikke en flot jakkesæt!', false], ['Hvor er det et lækker jakkesæt!', false]];
  const ELLEN_CRIT = [['Det er jeg ikke så vild med.', true], ['Det er lidt for dyrt.', true], ['Det er alt for stort.', true], ['Det kan jeg ikke lide.', true], ['Den er lidt for dyr.', false], ['Det er alt for stor.', false], ['Det er jeg ikke så vild.', false]];
  const FIX = {
    'Sikke en flot jakkesæt!': ['Sikke et flot jakkesæt!', 'et jakkesæt: Sikke et …'],
    'Hvor er det et lækker jakkesæt!': ['Hvor er det et lækkert jakkesæt!', 'et-word: lækker → lækkert'],
    'Den er lidt for dyr.': ['Det er lidt for dyrt.', 'et jakkesæt → det, and the adjective takes -t: dyrt'],
    'Det er alt for stor.': ['Det er alt for stort.', 'et jakkesæt → stort (-t after er)'],
    'Det er jeg ikke så vild.': ['Det er jeg ikke så vild med.', 'vild med: the med belongs to the phrase'],
  };
  K.G.auktion = {
    title: 'Auktionen', sub: 'Hvem byder?',
    lines() {
      const L = [AUC.open, AUC.up, AUC.down, AUC.withdraw, AUC.sold, AUC.next, ...AUC.pushes].map((t) => ({ w: 'auctioneer', da: t }));
      ['det grønne tørklæde', 'det røde tørklæde', 'et grønt tørklæde', 'en beige sok'].forEach((x) => L.push({ w: 'auctioneer', da: AUC.next + ' ' + x + '!' }));
      ELLEN_PRAISE.concat(ELLEN_CRIT).forEach(([t]) => L.push({ w: 'ellen', da: t }));
      L.push({ w: 'crowd', da: AUC.crowdLeave });
      return L;
    },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Auktionen', 'Pung: ' + (st.money || 1000) + ' kr.');
      const stage = el('div', 'stage auc'); const bg = el('img', 'donor'); bg.src = 'img/auction.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
      const meter = el('div', 'auc-meter', '<div class="price">400 kr.</div><div class="curtain"><span>Bag tæppet:</span> <i></i></div><div class="crowd">Folk: <b>40</b></div>'); stage.appendChild(meter);
      let price = 400, crowd = 40, praised = 0, crit = 0, behind = 0, score = 0, rounds = 0;
      const show = () => { meter.querySelector('.price').textContent = price + ' kr.'; meter.querySelector('.crowd b').textContent = crowd; meter.querySelector('.curtain i').style.width = Math.min(100, behind) + '%'; };
      const area = el('div', 'sal'); stage.appendChild(area);
      const say = async (w, t, en) => { area.innerHTML = ''; area.appendChild(K.renderLine({ w, da: t, en })); await K.audio.say(w, t); };
      await say('auctioneer', AUC.open, 'Lot number one: the checked suit! What a suit! Who bids?');
      let result = null;
      while (!result) {
        rounds++;
        const praise = K.shuffle(ELLEN_PRAISE).slice(0, 2), critic = K.shuffle(ELLEN_CRIT).slice(0, 2);
        // make sure at least one correct of each kind
        if (!praise.some((x) => x[1])) praise[0] = ELLEN_PRAISE[0];
        if (!critic.some((x) => x[1])) critic[0] = ELLEN_CRIT[0];
        const pick = await new Promise((res) => {
          const box = el('div', 'opts');
          K.shuffle(praise.concat(critic)).forEach((x) => { const b = el('button', 'opt', K.daHTML(x[0])); b.type = 'button'; b.onclick = () => { box.remove(); res(x); }; box.appendChild(b); });
          area.appendChild(box);
        });
        await say('ellen', pick[0]);
        const isPraise = ELLEN_PRAISE.includes(pick);
        if (!pick[1]) { const f = FIX[pick[0]] || ['', '']; K.sock(1, 'forkert dansk'); K.feedback(area, false, f[0], f[1]); await wait(1800); continue; }
        if (isPraise) {
          praised++; price = Math.min(st.money || 1000, price + 300); crowd += 15; behind += 34; show();
          stage.classList.add('hitboss'); setTimeout(() => stage.classList.remove('hitboss'), 300);
          await say('auctioneer', AUC.up, 'The lady in red bids! The price is rising!');
          if (behind >= 100 || price >= (st.money || 1000)) { K.audio.sfx('gavel'); await say('auctioneer', AUC.sold, 'Sold! To the lady in red!'); result = 'won'; break; }
          await say('auctioneer', AUC.pushes[Math.min(praised, AUC.pushes.length - 1)]);
        } else {
          crit++; score++; price = Math.max(50, price - 120); crowd = Math.max(3, crowd - 12); show();
          await say('auctioneer', AUC.down, 'The price is falling…');
          if (crit >= 3) { await say('auctioneer', AUC.withdraw, 'Okay, okay. The suit goes back. Next lot!'); result = 'lost'; break; }
          await say('crowd', AUC.crowdLeave, 'People leave.');
        }
        if (rounds > 12) result = 'lost';
      }
      st.auction = result;
      if (result === 'won') { st.money = 0; st.suit = true; }
      else { st.money = (st.money || 1000) - 50; }
      const lot = { groen: 'det grønne tørklæde', roed: 'det røde tørklæde', generic: 'et grønt tørklæde', sock: 'en beige sok' }[st.scarf || 'generic'];
      if (result === 'lost') { K.audio.sfx('gavel'); await say('auctioneer', AUC.next + ' ' + lot + '!'); }
      await K.resultStamp('auktion', result === 'lost' ? 3 : 0, 3, result === 'lost' ? 'Du tabte. Godt.' : 'Du vandt. Desværre.');
      return result;
    },
  };

  // ============ 9. Farven (the recolour) ============
  K.G.farven = {
    title: 'Farven', sub: 'Sig det til pistolen',
    lines() { return [{ w: 'ellen', da: 'Det er ikke rødt.' }, { w: 'ellen', da: 'Det er grønt.' }, { w: 'gun', da: 'Grøn. Grønt. Grønne. Åh.' }]; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Farven', 'Sig det om tørklædet (et tørklæde): ikke rødt, men grønt.');
      const stage = el('div', 'stage'); const bg = el('img', 'donor'); bg.src = 'img/gun.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
      const targets = [['Det er ikke rødt.', ['Det', 'Den', 'er', 'ikke', 'rødt', 'rød', 'røde']], ['Det er grønt.', ['Det', 'Den', 'er', 'grønt', 'grøn', 'grønne']]];
      let tries = 0;
      for (const [target, tiles] of targets) {
        let ok = false;
        while (!ok) {
          const built = await K.buildSentence(stage, tiles, target.split(' ').length);
          const sent = built.join(' ') + '.';
          tries++;
          if (sent === target) { ok = true; await K.audio.say('ellen', target); K.feedback(stage, true); await wait(700); }
          else { K.sock(1, 'pistolen hørte forkert'); K.feedback(stage, false, target, 'tørklæde is an et-word: det … rødt / grønt.'); await wait(1800); stage.querySelectorAll('.fb').forEach((x) => x.remove()); }
        }
      }
      st.recoloured = true;
      document.body.classList.add('recolour');
      setTimeout(() => document.body.classList.remove('recolour'), 2600);
      K.audio.sfx('boom');
      stage.appendChild(K.renderLine({ w: 'gun', da: 'Grøn. Grønt. Grønne. Åh.', en: 'Green. Green. Green. Oh.' }));
      await K.audio.say('gun', 'Grøn. Grønt. Grønne. Åh.');
      if (st.scarf === 'roed') { st.scarf = 'groen'; st.scarfViaGun = true; }
      (st.tags || []).forEach((t) => { if (t.adj === 'roed' && t.noun === 'toerklaede') t.adj = 'groen'; });
      await wait(1200);
      await K.resultStamp('farven', 2, Math.max(2, tries));
      return true;
    },
  };
  // sentence builder from tiles; resolves the chosen words
  K.buildSentence = function (root, tiles, n) {
    return new Promise((res) => {
      const wrap = el('div', 'builder');
      const line = el('div', 'built'); wrap.appendChild(line);
      const pool = el('div', 'pool'); wrap.appendChild(pool);
      const picked = [];
      const redraw = () => { line.innerHTML = picked.length ? K.daHTML(picked.join(' ')) : '<span class="ph">…</span>'; };
      K.shuffle(tiles).forEach((t) => {
        const b = el('button', 'tile', K.daHTML(t)); b.type = 'button';
        b.onclick = () => { if (b.disabled) return; picked.push(t); b.disabled = true; redraw(); K.audio.sfx('tap'); if (picked.length === n) { setTimeout(() => { wrap.remove(); res(picked.slice()); }, 250); } };
        pool.appendChild(b);
      });
      const undo = el('button', 'mini undo', '↺'); undo.type = 'button';
      undo.onclick = () => { picked.length = 0; pool.querySelectorAll('.tile').forEach((b) => (b.disabled = false)); redraw(); };
      wrap.appendChild(undo);
      redraw(); root.appendChild(wrap);
    });
  };

  // ============ 10. Hvem er han? ============
  // The fingerprint: the real writer repeats exactly the mistakes on the tags.
  K.G.hvem = {
    title: 'Hvem er han?', sub: 'Hvem skrev mærkerne?',
    lines() {
      const L = [{ w: 'gun', da: 'Ham. Jeg kender hans stemme.' }, { w: 'ellen', da: 'Hvad står der her?' },
        { w: 'ellen', da: 'Det er ikke din jakke. Det er Holgers jakke.' }, { w: 'ellen', da: 'Det er ikke sin jakke. Det er Holgers jakke.' }, { w: 'ellen', da: 'Det er ikke din jakke. Det er Holger jakke.' },
        { w: 'impostor', da: 'Jeg hedder Holger. Det er min jakke.' }, { w: 'manden', da: 'Jeg … jeg kan ikke huske mit navn.' }];
      return L;
    },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Hvem er han?', 'Tre mænd. Én skrev mærkerne.');
      const men = [{ w: 'manden', img: 'manden', label: 'Manden' }, { w: 'impostor', img: 'impostor', label: '"Holger"' }, { w: 'seller', img: 'seller', label: 'Sælgeren' }];
      const row = el('div', 'lineup'); body.appendChild(row);
      const cells = K.shuffle(men).map((m) => { const c = el('button', 'man'); c.type = 'button'; c.dataset.w = m.w; c.innerHTML = `<img src="img/${m.img}.webp" alt=""><span>${m.label}</span>`; row.appendChild(c); return c; });
      const area = el('div', 'sal'); body.appendChild(area);
      const sat = []; const seen = new Set();
      (st.mistakes || []).filter((m) => m.day === 'holger' && m.noun && m.adj && m.det && K.N[m.noun]).forEach((m) => { if (!seen.has(m.said)) { seen.add(m.said); sat.push(m); } });
      const rounds = K.shuffle(sat).slice(0, 3);
      let score = 0;
      if (!rounds.length) {
        // a perfect Saturday: the gun knows its old owner's voice
        area.appendChild(K.renderLine({ w: 'gun', da: 'Ham. Jeg kender hans stemme.', en: 'Him. I know his voice.' }));
        await K.audio.say('gun', 'Ham. Jeg kender hans stemme.');
        cells.find((c) => c.dataset.w === 'manden').classList.add('glow');
        await new Promise((res) => cells.forEach((c) => (c.onclick = () => { if (c.dataset.w === 'manden') { score++; res(); } else K.audio.sfx('bad'); })));
      }
      for (const m of rounds) {
        area.innerHTML = '';
        const tagEl = el('div', 'tagtext big', K.daHTML(m.said)); area.appendChild(el('div', 'frame', 'Mærket:')); area.appendChild(tagEl);
        const others = K.allForms(m.det, m.adj, m.noun).filter((f) => f !== m.said && f !== m.right);
        const lines = { manden: m.said, impostor: m.right, seller: others.length ? K.pick(others) : m.right };
        area.appendChild(el('div', 'frame', 'Tryk på en mand for at høre ham. Tryk igen for at vælge ham.'));
        const choice = await new Promise((res) => cells.forEach((c) => {
          c.onclick = async () => {
            if (c.classList.contains('heard')) { res(c.dataset.w); return; }
            cells.forEach((x) => x.classList.remove('heard'));
            c.classList.add('heard');
            area.querySelectorAll('.line').forEach((x) => x.remove());
            area.appendChild(K.renderLine({ w: c.dataset.w, da: K.cap(lines[c.dataset.w]) + '.' }));
            K.audio.say(c.dataset.w, K.cap(lines[c.dataset.w]) + '.');
          };
        }));
        cells.forEach((x) => x.classList.remove('heard'));
        if (choice === 'manden') { score++; K.feedback(area, true); }
        else { K.sock(1, 'forkert mand'); K.feedback(area, false, 'Manden sagde: ' + m.said, 'The writer makes the same mistake as the tag.'); }
        await wait(K.fast ? 50 : 1600);
      }
      area.innerHTML = '';
      cells.forEach((c) => { c.onclick = null; c.disabled = true; });
      if (st.jacket === 'gen') {
        area.appendChild(K.renderLine({ w: 'impostor', da: 'Jeg hedder Holger. Det er min jakke.', en: 'My name is Holger. It is my jacket.' }));
        await K.audio.say('impostor', 'Jeg hedder Holger. Det er min jakke.');
        const opts = ['Det er ikke din jakke. Det er Holgers jakke.', 'Det er ikke sin jakke. Det er Holgers jakke.', 'Det er ikke din jakke. Det er Holger jakke.'];
        const sh = K.shuffle(opts);
        const i = await K.choose('', sh.map((d) => ({ da: d })), 'ellen');
        if (sh[i] === opts[0]) { st.namedBack = true; score++; K.feedback(area, true); }
        else { K.sock(1, 'navnet blev hos ham'); K.feedback(area, false, opts[0], 'Talking to him: din jakke (your). A name owns with -s: Holgers jakke. Never sin here: sin points back to the subject of the same sentence.'); }
        await wait(K.fast ? 50 : 1600);
      }
      await K.resultStamp('hvem', score, Math.max(1, rounds.length || 1) + (st.jacket === 'gen' ? 1 : 0));
      return score;
    },
  };

  // ============ 11. Mit, mit, mine ============
  K.G.mine = {
    title: 'Min, mit, mine', sub: 'Tag det, der er dit',
    lines() { return [{ w: 'ellen', da: 'Nej tak.' }]; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Min, mit, mine', 'Lejligheden er lille. Gør krav på tingene.');
      const stage = el('div', 'stage'); const bg = el('img', 'donor'); bg.src = 'img/flat.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
      const shelf = el('div', 'shelf'); stage.appendChild(shelf);
      let items = (st.bound || []).filter((b) => K.N[b.noun] && K.A[b.adj]).slice(0, 4).map((b) => ({ noun: b.noun, adj: b.adj, bound: true }));
      const extra = [['sofa', 'blaa'], ['hylder', 'gul'], ['puder', 'prikket'], ['bord', 'hvid'], ['lampe', 'sort'], ['taeppe', 'ternet']];
      K.shuffle(extra).forEach(([noun, adj]) => { if (items.length < 6) items.push({ noun, adj, bound: false }); });
      if (st.scarf === 'groen') items.push({ noun: 'toerklaede', adj: 'groen', bound: true, scarf: true });
      items = K.shuffle(items);
      let score = 0;
      for (const it of items) {
        const area = el('div', 'sal');
        const c = await K.cardFor(it.noun, [it.adj], 150); c.classList.add('slide-in'); area.appendChild(c);
        if (it.bound) area.appendChild(el('div', 'note unik', 'UNIK'));
        stage.appendChild(area);
        const right = K.np('min', [it.adj], it.noun);
        const r = await K.phraseChoice(area, right, K.wrongForms('min', it.adj, it.noun, 2), it.scarf ? 0 : 9);
        if (r.ok) {
          score++; K.feedback(area, true); K.gotRight(right);
          st.flat.push(right);
          const mini = await K.cardFor(it.noun, [it.adj], 56); shelf.appendChild(mini);
        } else {
          K.sock(1, r.timeout ? 'for sent' : 'forkert endelse');
          K.feedback(area, false, right, K.why('min', it.adj, it.noun));
          K.mistake({ said: r.said || '', right, noun: it.noun, adj: it.adj, det: 'min', day: 'ellen' });
          if (it.scarf) { st.flat.push(right); }
        }
        await wait(r.ok ? 700 : 1900);
        area.remove();
      }
      await K.resultStamp('mine', score, items.length);
      return score;
    },
  };

  // ============ 12. Sokkerne (finale) ============
  const F_NOUNS = ['sofa', 'lampe', 'bord', 'seng', 'skab', 'taeppe', 'gardiner', 'puder', 'stol', 'reol', 'kommode', 'laenestol'];
  const F_ADJ = ['roed', 'hvid', 'groen', 'gul', 'brun', 'sort', 'blaa', 'graa', 'orange', 'gammel', 'ny', 'stor', 'lille'];
  K.G.sokkerne = {
    title: 'Sokkerne', sub: 'Dine egne ting',
    lines() { return [{ w: 'sok', da: 'Jeg er den beige sok.' }, { w: 'sok', da: 'Endelig. Nogen sagde den.' }]; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Sokkerne', 'Tænk på dit eget hjem. Hvad har du?');
      const crate = el('div', 'bigcrate', `<img src="img/crate.webp" alt=""><div class="count">${st.socks}</div>`); body.appendChild(crate);
      const made = el('div', 'made'); body.appendChild(made);
      const area = el('div', 'sal'); body.appendChild(area);
      const step = async (label, options, render) => {
        area.innerHTML = ''; area.appendChild(el('div', 'frame', label));
        const box = el('div', 'tiles'); area.appendChild(box);
        return new Promise((res) => options.forEach((o) => { const b = el('button', 'tile', render ? render(o) : K.daHTML(o)); b.type = 'button'; b.onclick = () => { K.audio.sfx('tap'); res(o); }; box.appendChild(b); }));
      };
      let score = 0;
      const ROUNDS = K.fast ? 2 : 4;
      for (let i = 0; i < ROUNDS; i++) {
        const noun = await step('En ting i dit hjem:', K.shuffle(F_NOUNS).slice(0, 6), (n) => K.daHTML(K.nounForm(n)));
        const det = await step('Din, dit eller dine?', ['min', 'mit', 'mine']);
        const adj = await step('Hvilken farve?', K.shuffle(F_ADJ).slice(0, 6), (a) => K.daHTML(K.A[a].base));
        const right = K.adjForm(adj, noun, 'def');
        const forms = K.shuffle([...new Set([right].concat(K.adjVariants(adj)))].slice(0, 3).concat(right)).filter((v, j, a) => a.indexOf(v) === j);
        const form = await step('Med den rigtige endelse:', forms);
        const said = `${det} ${form} ${K.nounForm(noun)}`, ok = said === K.np('min', [adj], noun);
        area.innerHTML = ''; const thrown = el('div', 'thrown', K.daHTML(said)); area.appendChild(thrown);
        await wait(500);
        if (ok) {
          score++; K.sock(-1, 'en ting igen');
          const img = await K.cardFor(noun, [adj], 90); img.classList.add('popout'); made.appendChild(img);
          K.audio.sfx('unsock');
        } else {
          K.sock(1, 'en sok mere');
          K.feedback(area, false, K.np('min', [adj], noun), K.why('min', adj, noun));
          await wait(1800);
        }
        crate.querySelector('.count').textContent = st.socks;
      }
      // the last sock
      area.innerHTML = '';
      area.appendChild(K.renderLine({ w: 'sok', da: 'Jeg er den beige sok.', en: 'I am the beige sock.' }));
      await K.audio.say('sok', 'Jeg er den beige sok.');
      let ok = false;
      while (!ok) {
        const built = await K.buildSentence(area, ['den', 'det', 'de', 'beige', 'beiget', 'beigee', 'sok'], 3);
        ok = built.join(' ') === 'den beige sok';
        if (!ok) { K.feedback(area, false, 'den beige sok', 'en sok → den; beige never changes.'); await wait(1600); area.querySelectorAll('.fb').forEach((x) => x.remove()); }
      }
      K.sock(-1, 'den beige sok');
      area.appendChild(K.renderLine({ w: 'sok', da: 'Endelig. Nogen sagde den.', en: 'Finally. Someone said "the".' }));
      await K.audio.say('sok', 'Endelig. Nogen sagde den.');
      await wait(900);
      await K.resultStamp('sokkerne', score + 1, ROUNDS + 1);
      return score;
    },
  };
})(window.K = window.K || {});
