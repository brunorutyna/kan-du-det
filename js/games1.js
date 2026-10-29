// Kan du det?! — Saturday mini-games. SPOILERS in comments.
(function (K) {
  'use strict';
  const el = K.el, wait = K.wait;
  K.G = K.G || {};

  // Every option a phrase item could show (for voice pre-rendering and for Holger's fingerprint).
  K.allForms = function (det, adj, noun) {
    const right = K.np(det, [adj], noun);
    const out = [right];
    K.adjVariants(adj).forEach((f) => { const w = K.npWith(det, adj, noun, f); if (!out.includes(w)) out.push(w); });
    const n = K.N[noun];
    if ((det === 'indef' || det === 'def') && n.g !== 'p') {
      const other = n.g === 'c' ? 'n' : 'c';
      const sw = right.replace(/^(en|et|den|det) /, K.ART[det][other] + ' ');
      if (!out.includes(sw)) out.push(sw);
    }
    return out;
  };
  // a tag record on Saturday: what Holger wrote on a thing
  function tag(st, noun, adj, det, said) {
    const right = K.np(det, [adj], noun);
    st.tags.push({ noun, adj, det, text: said, right, ok: said === right });
  }
  function fingerprint(st, noun, adj, det, said) {
    const right = K.np(det, [adj], noun);
    if (said !== right) K.mistake({ said, right, noun, adj, det, day: st.who });
    else K.gotRight(right);
  }
  K.fingerprint = fingerprint;

  // Countdown bar helper
  function timer(root, secs, onEnd) {
    const bar = el('div', 'timer'); const fill = el('div', 'fill'); bar.appendChild(fill); root.appendChild(bar);
    const t0 = performance.now(); let stopped = false;
    const ms = K.fast ? 60000 : secs * 1000;
    (function tick() { if (stopped) return; const f = 1 - (performance.now() - t0) / ms; fill.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) { stopped = true; onEnd(); } else requestAnimationFrame(tick); })();
    return { stop() { stopped = true; bar.remove(); }, left() { return Math.max(0, 1 - (performance.now() - t0) / ms); } };
  }
  K.timer = timer;

  // Options: buttons with full phrases, one right. Resolves {said, ok, timeout}
  function phraseChoice(root, right, wrongs, secs) {
    return new Promise((res) => {
      const box = el('div', 'opts');
      const opts = K.shuffle([right].concat(wrongs));
      let done = false;
      const tm = secs ? timer(root, secs, () => { if (done) return; done = true; box.remove(); res({ said: null, ok: false, timeout: true }); }) : null;
      opts.forEach((o) => {
        const b = el('button', 'opt', K.daHTML(o)); b.type = 'button';
        b.onclick = () => { if (done) return; done = true; if (tm) tm.stop(); box.remove(); res({ said: o, ok: o === right, left: tm ? tm.left() : 1 }); };
        box.appendChild(b);
      });
      root.appendChild(box);
    });
  }
  K.phraseChoice = phraseChoice;

  async function card(noun, adjs, size) {
    const colour = adjs.find((a) => K.COLOURS.includes(a)), pat = adjs.find((a) => K.PATTERNS.includes(a));
    return K.objImg(noun, colour, pat, size || 220);
  }
  K.cardFor = card;

  // ============ 1. Containerne ============
  // Name each thing: definite binds it (Unika), indefinite keeps it generic (skip). Wrong Danish = a beige sock.
  const CONT_ITEMS = [
    { noun: 'kommode', adj: 'roed', kind: 'unik' },
    { noun: 'stole', adj: 'graa', kind: 'generic', chairs: true },
    { noun: 'lampe', adj: 'hvid', kind: 'unik' },
    { noun: 'sokker', adj: 'sort', kind: 'generic' },
    { noun: 'skab', adj: 'gul', kind: 'unik' },
    { noun: 'bukser', adj: 'brun', kind: 'generic' },
    { noun: 'taeppe', adj: 'stribet', kind: 'unik' },
    { noun: 'hue', adj: 'blaa', kind: 'generic' },
    { noun: 'laenestol', adj: 'groen', kind: 'unik' },
    { noun: 'slips', adj: 'prikket', kind: 'generic' },
    { noun: 'gardin', adj: 'lyseroed', kind: 'unik' },
  ];
  const NOTE = { unik: 'Der er kun én.', generic: 'Der er hundredvis af dem.' };
  K.G.containerne = {
    title: 'Containerne', sub: 'Unika eller containeren?',
    lines() {
      const L = CONT_ITEMS.filter((it) => it.adj === 'groen').map((it) => ({ w: 'gun', da: K.cap(K.np('indef', ['roed'], it.noun)) + '.' }));
      L.push({ w: 'gun', da: 'Den, det, de: så bliver den unik.' }, { w: 'gun', da: 'En, et, nogle: så er den bare en af mange.' }, { w: 'stol', da: 'Mig? Den grå stol? Tak!' });
      Object.values(NOTE).forEach((t) => L.push({ w: 'gun', da: t }));
      return L;
    },
    phrases() { return CONT_ITEMS.map((it) => [it.kind === 'unik' ? 'def' : 'indef', it.adj, it.noun]); },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Containerne', '08:12 · Navngiv tingene');
      const items = p.story ? CONT_ITEMS : K.shuffle(CONT_ITEMS).slice(0, 8);
      let score = 0;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        body.innerHTML = '';
        const belt = el('div', 'belt'); body.appendChild(belt);
        const c = await card(it.noun, [it.adj]); c.classList.add('slide-in'); belt.appendChild(c);
        const note = el('div', 'note ' + it.kind, K.daHTML(NOTE[it.kind])); belt.appendChild(note);
        const bins = el('div', 'bins', '<div class="bin unika">UNIKA</div><div class="bin skip">CONTAINEREN</div>'); body.appendChild(bins);
        if (i === 0 && p.story) {
          const tipBox = el('div', 'tipbox'); tipBox.appendChild(K.renderLine({ w: 'gun', da: 'Den, det, de: så bliver den unik.', en: 'Den, det, de: then it becomes unique.' }));
          tipBox.appendChild(K.renderLine({ w: 'gun', da: 'En, et, nogle: så er den bare en af mange.', en: 'En, et, nogle: then it is just one of many.' }));
          body.appendChild(tipBox);
          K.audio.say('gun', 'Den, det, de: så bliver den unik.');
        }
        if (it.adj === 'groen' && p.story) {
          const lie = K.cap(K.np('indef', ['roed'], it.noun)) + '.';
          const gl = el('div', 'tipbox'); gl.appendChild(K.renderLine({ w: 'gun', da: lie, en: 'A red ' + K.N[it.noun].en + '.' })); body.appendChild(gl);
          K.audio.say('gun', lie);
        }
        const right = K.np(it.kind === 'unik' ? 'def' : 'indef', [it.adj], it.noun);
        const other = K.np(it.kind === 'unik' ? 'indef' : 'def', [it.adj], it.noun);
        const wrongs = [other].concat(K.wrongForms(it.kind === 'unik' ? 'def' : 'indef', it.adj, it.noun, 2));
        const r = await phraseChoice(body, right, wrongs, p.story && i === 0 ? 0 : Math.max(7, 12 - i * 0.4));
        const tb = body.querySelector('.tipbox'); if (tb) tb.remove();
        if (r.timeout) {
          K.sock(1, 'intet navn'); K.feedback(body, false, right, K.why(it.kind === 'unik' ? 'def' : 'indef', it.adj, it.noun));
        } else if (r.ok) {
          score += 2; K.feedback(body, true);
          c.classList.add(it.kind === 'unik' ? 'to-unika' : 'to-skip');
          if (it.kind === 'unik') st.bound.push({ noun: it.noun, adj: it.adj, text: r.said });
          tag(st, it.noun, it.adj, it.kind === 'unik' ? 'def' : 'indef', r.said);
          fingerprint(st, it.noun, it.adj, it.kind === 'unik' ? 'def' : 'indef', r.said);
        } else if (r.said === other) {
          // correct Danish, wrong choice
          score += 1;
          if (it.kind === 'generic') {
            st.bound.push({ noun: it.noun, adj: it.adj, text: r.said });
            c.classList.add('to-unika');
            if (it.chairs && !st.follower) {
              st.follower = 'stol';
              K.feedback(body, true);
              const f = el('div', 'fb follow'); f.appendChild(K.renderLine({ w: 'stol', da: 'Mig? Den grå stol? Tak!', en: 'Me? The grey chair? Thanks!' })); body.appendChild(f);
              K.audio.say('stol', 'Mig? Den grå stol? Tak!');
              await wait(500);
            } else {
              const f = el('div', 'fb half', `Rigtigt dansk. Men nu er den unik — og den bliver.`); body.appendChild(f);
            }
          } else {
            c.classList.add('to-skip');
            const f = el('div', 'fb half', `Rigtigt dansk. Men nu er den bare en af mange.`); body.appendChild(f);
          }
          tag(st, it.noun, it.adj, it.kind === 'unik' ? 'indef' : 'def', r.said);
        } else {
          K.sock(1, 'forkert endelse');
          K.feedback(body, false, right, K.why(it.kind === 'unik' ? 'def' : 'indef', it.adj, it.noun));
          tag(st, it.noun, it.adj, it.kind === 'unik' ? 'def' : 'indef', r.said);
          fingerprint(st, it.noun, it.adj, it.kind === 'unik' ? 'def' : 'indef', r.said);
        }
        await K.after(body, r.ok);
      }
      await K.resultStamp('containerne', score, items.length * 2);
      return score;
    },
  };

  // ============ 2. Sikke-salve ============
  // Donors brag about their own things; Holger completes the shout with the right adjective form, on the beat.
  const DONORS = [
    { who: 'donor1', img: 'donor1', items: [['flot', 'jakkesaet'], ['roed', 'slips'], ['smart', 'sko'], ['brun', 'kasket'], ['ny', 'skjorte'], ['hvid', 'sokker']] },
    { who: 'donor2', img: 'donor2', items: [['gul', 'kjole'], ['prikket', 'nederdel'], ['paen', 'toerklaede'], ['sort', 'stoevler'], ['groen', 'baelte'], ['stor', 'taske']] },
    { who: 'donor3', img: 'donor3', items: [['flot', 'skab'], ['billig', 'reol'], ['sort', 'bord'], ['ny', 'puder'], ['stribet', 'gardin'], ['dyr', 'sofa']] },
  ];
  K.G.sikke = {
    title: 'Sikke-salve', sub: 'Svar i takt',
    lines() { const L = []; DONORS.forEach((d) => d.items.forEach(([a, n]) => { L.push({ w: d.who, da: K.np('sikke', [a], n) + '!' }); if (a === 'groen') L.push({ w: 'gun', da: K.cap(K.np('indef', ['roed'], n)) + '.' }); })); return L; },
    phrases() { const P = []; DONORS.forEach((d) => d.items.forEach(([a, n]) => P.push(['indef', a, n]))); return P; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Sikke-salve', 'Gør råbet færdigt — i takt');
      let score = 0, max = 0, combo = 0;
      const donors = p.story ? DONORS : [K.pick(DONORS)];
      for (const d of donors) {
        body.innerHTML = '';
        const stage = el('div', 'stage'); const bg = el('img', 'donor'); bg.src = 'img/' + d.img + '.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
        const hudL = el('div', 'combo', ''); stage.appendChild(hudL);
        const items = p.story ? d.items : K.shuffle(d.items);
        for (const [adj, noun] of items) {
          max += 3;
          const n = K.N[noun];
          const right = K.adjForm(adj, noun, 'indef');
          const options = K.shuffle([...new Set(K.adjVariants(adj))].filter((f) => f !== right)).slice(0, 2).concat([right]);
          const area = el('div', 'sal');
          const aura = n.g === 'n' ? 'T' : n.g === 'p' ? 'E' : '·';
          // the aura (gender hint) only for the first donor; after that the player is on his own
          area.innerHTML = d === donors[0] && p.story !== false ? `<div class="aura a-${n.g}">${aura}${aura}${aura}</div>` : '';
          const c = await card(noun, [adj], 170); area.appendChild(c);
          const shout = el('div', 'shout', K.daHTML(`Sikke ${K.ART.indef[n.g]} `) + '<span class="gap">?</span> ' + K.daHTML(K.nounForm(noun) + '!'));
          area.appendChild(shout);
          if (adj === 'groen' && p.story) { const lie = K.cap(K.np('indef', ['roed'], noun)) + '.'; area.appendChild(K.renderLine({ w: 'gun', da: lie, en: 'A red ' + n.en + '.' })); K.audio.say('gun', lie); }
          const ring = el('div', 'ring'); area.appendChild(ring);
          stage.appendChild(area);
          const beat = K.fast ? 400 : 2200;
          const t0 = performance.now();
          ring.style.animationDuration = beat + 'ms';
          const pick = await new Promise((res) => {
            const box = el('div', 'opts row3');
            K.shuffle(options).forEach((o) => { const b = el('button', 'opt big', K.daHTML(o)); b.type = 'button'; b.onclick = () => { box.remove(); res(o); }; box.appendChild(b); });
            stage.appendChild(box);
            setTimeout(() => { if (box.isConnected) { box.remove(); res(null); } }, K.fast ? 60000 : beat * 2.4);
          });
          const dt = Math.abs(performance.now() - t0 - beat);
          const said = pick ? K.npWith('sikke', adj, noun, pick) : null;
          const full = K.np('sikke', [adj], noun);
          shout.innerHTML = K.daHTML(full + '!');
          if (pick === right) {
            const timing = dt < 260 ? 1 : dt < 600 ? 0.5 : 0;
            score += 2 + timing; combo++;
            hudL.textContent = combo > 1 ? combo + '× COMBO' : '';
            area.appendChild(el('div', 'judge', timing === 1 ? 'PERFEKT!' : timing ? 'GODT!' : 'SENT…'));
            K.audio.sfx('ok');
          } else {
            combo = 0; hudL.textContent = '';
            K.sock(1, pick ? 'forkert endelse' : 'for sent');
            const f = K.feedback(area, false, full + '!', K.why('indef', adj, noun)); f.classList.add('small');
          }
          tag(st, noun, adj, 'indef', said ? said.replace(/^Sikke /, '') : K.np('indef', [adj], noun));
          if (said) fingerprint(st, noun, adj, 'indef', said.replace(/^Sikke /, ''));
          K.audio.say(d.who, full + '!');
          await K.after(area, pick === right);
          area.remove();
        }
      }
      await K.resultStamp('sikke', Math.round(score), max);
      return score;
    },
  };

  // ============ 3. Lilla ============
  // Boss of the irregular adjectives. Her armour: lilla, orange, beige never change.
  const LILLA = [
    ['indef', 'lilla', 'toerklaede'], ['indef', 'blaa', 'slips'], ['def', 'gammel', 'kommode'], ['indef', 'orange', 'stoevler'],
    ['def', 'lille', 'seng'], ['def', 'blaa', 'bukser'], ['indef', 'gammel', 'bord'], ['def', 'beige', 'handsker'],
    ['indef', 'laekker', 'jakkesaet'], ['def', 'lille', 'stole'], ['indef', 'graa', 'taeppe'], ['def', 'laekker', 'puder'],
    ['def', 'orange', 'gardin'], ['indef', 'lille', 'taske'], ['def', 'graa', 'skab'], ['indef', 'lilla', 'sokker'],
  ];
  const TAUNTS = ['Lilla ændrer sig aldrig!', 'Kan du ikke lide min stil?!', 'Er du bange?!', 'Sikke en farve, hva\'?!', 'Hvad hedder den så?!'];
  K.G.lilla = {
    title: 'Kvinden i lilla', sub: 'Uregelmæssige adjektiver',
    lines() { const L = TAUNTS.map((t) => ({ w: 'lilla', da: t })); LILLA.forEach(([d, a, n]) => L.push({ w: 'lilla', da: K.cap(K.np(d, [a], n)) + '.' })); L.push({ w: 'lilla', da: 'Nej! Min rustning!' }); return L; },
    phrases() { return LILLA; },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Kvinden i lilla', 'Hendes rustning: lilla, orange, beige');
      const stage = el('div', 'stage boss'); const bg = el('img', 'donor'); bg.src = 'img/lilla.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
      const bars = el('div', 'bars', '<div class="hp boss"><span>LILLA</span><i></i></div><div class="hp me"><span>HOLGER</span><i></i></div>'); stage.appendChild(bars);
      let bossHp = 10, myHp = 4, score = 0, n = 0;
      const items = p.story ? LILLA : K.shuffle(LILLA);
      const draw = () => { bars.querySelector('.boss i').style.width = bossHp * 10 + '%'; bars.querySelector('.me i').style.width = myHp * 25 + '%'; };
      draw();
      for (const [det, adj, noun] of items) {
        if (bossHp <= 0 || myHp <= 0) break;
        n++;
        const area = el('div', 'sal');
        const taunt = K.pick(TAUNTS);
        area.appendChild(K.renderLine({ w: 'lilla', da: taunt }));
        K.audio.say('lilla', taunt);
        const c = await card(noun, [adj], 150); area.appendChild(c);
        const head = el('div', 'frame', K.daHTML(K.ART[det][K.N[noun].g] + ' … ' + K.nounForm(noun)) + ` <small>(${K.A[adj].en})</small>`); area.appendChild(head);
        stage.appendChild(area);
        const right = K.np(det, [adj], noun);
        const r = await phraseChoice(area, right, K.wrongForms(det, adj, noun, 2), Math.max(6, 10 - n * 0.25));
        if (r.ok) { bossHp -= (K.INVARIABLE.includes(adj) ? 2 : 1); score++; K.feedback(area, true); stage.classList.add('hitboss'); setTimeout(() => stage.classList.remove('hitboss'), 400); K.audio.sfx('hit'); }
        else { myHp--; K.sock(1, r.timeout ? 'for sent' : 'rustningen holdt'); K.feedback(area, false, right, K.why(det, adj, noun)); stage.classList.add('hitme'); setTimeout(() => stage.classList.remove('hitme'), 400); }
        if (r.said) fingerprint(st, noun, adj, det, r.said);
        tag(st, noun, adj, det, r.said || right);
        draw();
        K.audio.say('lilla', K.cap(right) + '.');
        await K.after(area, r.ok);
        area.remove();
      }
      if (bossHp <= 0) { stage.appendChild(K.renderLine({ w: 'lilla', da: 'Nej! Min rustning!', en: 'No! My armour!' })); K.audio.say('lilla', 'Nej! Min rustning!'); await wait(900); }
      await K.resultStamp('lilla', score, n, bossHp <= 0 ? 'Rustningen faldt.' : myHp <= 0 ? 'Hun gik med sit tøj.' : '');
      return bossHp <= 0;
    },
  };

  // ============ 4. Stirren ============
  // Ellen's opinions about her ex's things. React with the right short answer before the stare breaks.
  const OPIN = [
    { v: 'er', pol: -1, da: 'Jeg er ikke så vild med det stribede slips.', noun: 'slips', adj: 'stribet' },
    { v: 'kan', pol: 1, da: 'Jeg kan godt lide den sorte hue.', noun: 'hue', adj: 'sort' },
    { v: 'synes', pol: 1, da: 'Jeg synes, de brune sko er grimme.', noun: 'sko', adj: 'brun' },
    { v: 'kan', pol: -1, da: 'Jeg kan ikke lide den ternede skjorte.', noun: 'skjorte', adj: 'ternet' },
    { v: 'synes', pol: -1, da: 'Jeg synes ikke, den røde kasket er så flot.', noun: 'kasket', adj: 'roed' },
  ];
  // the right reactions for a statement
  function reactions(v, pol) {
    const V = { er: 'er', kan: 'kan', synes: 'synes' }[v], Vq = K.cap(V);
    return pol > 0
      ? { agree: `Det ${V} jeg også.`, surprise: `${Vq} du det?!` }
      : { agree: `Det ${V} jeg heller ikke.`, surprise: `${Vq} du ikke?!` };
  }
  function wrongReactions(v, pol) {
    const others = ['er', 'kan', 'synes'].filter((x) => x !== v);
    const w = [];
    const rp = reactions(v, -pol); w.push(rp.agree, rp.surprise); // wrong polarity
    const ro = reactions(K.pick(others), pol); w.push(ro.agree, ro.surprise); // wrong verb
    return w;
  }
  function ellenReply(noun) {
    const g = K.N[noun].g, subj = { c: 'den', n: 'det', p: 'de' }[g], obj = { c: 'den', n: 'det', p: 'dem' }[g];
    return { stay: `Så bliver ${subj} her.`, take: `Så tager jeg ${obj} med.` };
  }
  K.ellenReply = ellenReply;
  K.reactions = reactions; K.wrongReactions = wrongReactions; K.OPIN = OPIN;
  K.G.stirren = {
    title: 'Stirren', sub: 'Reager før blikket brister',
    lines() {
      const L = OPIN.map((o) => ({ w: 'ellen', da: o.da }));
      OPIN.forEach((o) => { const r = reactions(o.v, o.pol); [r.agree, r.surprise].concat(wrongReactions(o.v, o.pol)).forEach((t) => L.push({ w: 'holger', da: t })); });
      ['er', 'kan', 'synes'].forEach((v) => [1, -1].forEach((pol) => { const r = reactions(v, pol); L.push({ w: 'holger', da: r.agree }, { w: 'holger', da: r.surprise }); }));
      OPIN.forEach((o) => { const r = ellenReply(o.noun); L.push({ w: 'ellen', da: r.stay }, { w: 'ellen', da: r.take }); });
      return L;
    },
    async run(p) {
      const st = K.st;
      const { body } = K.gameFrame('Stirren', '11:50 · Reager med det samme');
      const stage = el('div', 'stage stare'); const bg = el('img', 'donor'); bg.src = 'img/ellen_sat.webp'; bg.alt = ''; stage.appendChild(bg); body.appendChild(stage);
      let score = 0;
      const list = p.story ? OPIN : K.shuffle(OPIN);
      st.stirren = [];
      for (const o of list) {
        const area = el('div', 'sal');
        area.appendChild(K.renderLine({ w: 'ellen', da: o.da }));
        stage.appendChild(area);
        K.audio.say('ellen', o.da);
        const r = reactions(o.v, o.pol);
        const wrong = K.shuffle(wrongReactions(o.v, o.pol)).slice(0, 2);
        const res = await new Promise((resolve) => {
          const box = el('div', 'opts');
          let done = false;
          const tm = timer(area, 6, () => { if (done) return; done = true; box.remove(); resolve(null); });
          K.shuffle([r.agree, r.surprise].concat(wrong)).forEach((t) => {
            const b = el('button', 'opt', K.daHTML(t)); b.type = 'button';
            b.onclick = () => { if (done) return; done = true; tm.stop(); box.remove(); resolve(t); };
            box.appendChild(b);
          });
          area.appendChild(box);
        });
        const kind = res === r.agree ? 'agree' : res === r.surprise ? 'surprise' : res ? 'wrong' : 'none';
        st.stirren.push({ i: OPIN.indexOf(o), said: res || '…', kind });
        if (res) K.audio.say('holger', res);
        if (kind === 'agree' || kind === 'surprise') {
          score++; K.feedback(area, true);
          const reply = kind === 'agree' ? ellenReply(o.noun).stay : ellenReply(o.noun).take;
          area.appendChild(K.renderLine({ w: 'ellen', da: reply, en: kind === 'agree' ? 'Then it stays here.' : 'Then I\'ll take it with me.' }));
          K.audio.say('ellen', reply);
        } else {
          K.sock(1, res ? 'forkert kort svar' : 'tavshed');
          K.feedback(area, false, r.agree + ' / ' + r.surprise, o.pol > 0 ? 'Her sentence has no ikke, so agree with også. Repeat her verb (' + o.v + ').' : 'Her sentence has ikke, so agree with heller ikke. Repeat her verb (' + o.v + ').');
        }
        await K.after(area, kind === 'agree' || kind === 'surprise');
        area.remove();
      }
      await K.resultStamp('stirren', score, list.length);
      return score;
    },
  };

  // ============ 5. Lukketid ============
  // One-thumb bullet heaven. Drag Holger; tags fire at the nearest thing. Tag the thing that matches the display.
  const SW_NOUNS = ['sofa', 'lampe', 'kommode', 'stol', 'slips', 'hue', 'sko', 'stoevler', 'taske', 'skab', 'bord', 'jakke', 'pude', 'kjole'];
  const SW_COLS = ['roed', 'brun', 'gul', 'blaa', 'hvid', 'sort'];
  K.G.lukketid = {
    title: 'Lukketid', sub: 'Træk med én finger',
    lines() { return [{ w: 'gun', da: 'Klokken er tolv. Porten lukker.' }, { w: 'holger', da: 'Min jakke!' }]; },
    phrases() { const P = []; SW_NOUNS.forEach((n) => SW_COLS.forEach((c) => P.push(['indef', c, n]))); return P; },
    async run(p) {
      const st = K.st;
      const { s, body } = K.gameFrame('Lukketid', '11:58 · Mærk det, der står på pistolen');
      body.classList.add('arena');
      const cv = el('canvas', 'arena-cv'); body.appendChild(cv);
      const disp = el('div', 'display'); body.appendChild(disp);
      const stats = el('div', 'astats'); body.appendChild(stats);
      const DPR = Math.min(1.5, devicePixelRatio || 1);
      const W = cv.width = body.clientWidth * DPR, H = cv.height = body.clientHeight * DPR;
      const g = cv.getContext('2d'); const u = DPR;
      // pre-render sprites
      const sprites = {};
      const spriteOf = async (n, c) => { const k = n + c; if (!sprites[k]) sprites[k] = await K.objCanvas(n, c, null, 96); return sprites[k]; };
      const pool = []; for (let i = 0; i < 10; i++) pool.push([K.pick(SW_NOUNS), K.pick(SW_COLS)]);
      for (const [n, c] of pool) await spriteOf(n, c);
      const holgerImg = await K.loadImg('img/o/holger.webp');
      const me = { x: W / 2, y: H * 0.62, r: 26 * u, inv: 0 };
      let things = [], shots = [], gems = [], xp = 0, lvl = 1, minutes = 5, tagged = 0, wrong = 0, t = 0, want = null, wantT = 0, jacketDone = !p.story, paused = false;
      const DUR = K.fast ? 6 : 90;
      const spawn = () => {
        const [n, c] = Math.random() < 0.45 && want ? [want.n, want.c] : K.pick(pool);
        const side = K.pick([0, 1, 2, 2, 2]), m = 40 * u;
        const x = side === 0 ? -m : side === 1 ? W + m : Math.random() * W, y = side === 2 ? -m : side === 3 ? H + m : Math.random() * H;
        const sp = (0.25 + Math.random() * 0.25 + t / 240) * u * (lvl >= 3 ? 0.8 : 1);
        things.push({ x, y, n, c, sp, r: 26 * u, angry: 0, frozen: 0, wob: Math.random() * 6 });
      };
      const pickWant = () => {
        const onScreen = things.filter((o) => !o.frozen);
        const src = onScreen.length && Math.random() < 0.7 ? K.pick(onScreen) : { n: K.pick(pool)[0], c: K.pick(pool)[1] };
        want = { n: src.n, c: src.c }; wantT = 0;
        disp.innerHTML = '<span class="lbl">MÆRK:</span> ' + K.daHTML(K.np('indef', [want.c], want.n));
        spriteOf(want.n, want.c);
      };
      pickWant();
      // input: drag anywhere moves Holger towards the finger
      let target = null;
      const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * u, y: (e.clientY - r.top) * u - 50 * u }; };
      cv.addEventListener('pointerdown', (e) => { target = pos(e); cv.setPointerCapture(e.pointerId); });
      cv.addEventListener('pointermove', (e) => { if (target) target = pos(e); });
      cv.addEventListener('pointerup', () => { target = null; });
      let last = performance.now(), fireT = 0, spawnT = 0, running = true;
      const end = new Promise((res) => {
        const loop = async (now) => {
          if (!running) return;
          const dt = Math.min(0.05, (now - last) / 1000); last = now;
          if (!paused) {
            t += dt; wantT += dt; fireT += dt; spawnT += dt; me.inv = Math.max(0, me.inv - dt);
            if (wantT > 6.5) pickWant();
            if (spawnT > Math.max(0.65, 1.5 - t / 90)) { spawnT = 0; spawn(); }
            if (target) { const dx = target.x - me.x, dy = target.y - me.y, d = Math.hypot(dx, dy); if (d > 2) { const v = Math.min(d, 380 * u * dt); me.x += dx / d * v; me.y += dy / d * v; } }
            me.x = Math.max(me.r, Math.min(W - me.r, me.x)); me.y = Math.max(me.r, Math.min(H - me.r, me.y));
            // auto fire at nearest live thing
            const rate = lvl >= 2 ? 0.28 : 0.42;
            if (fireT > rate) {
              fireT = 0;
              // the gun aims at the nearest thing that matches its display; anything in the way gets the tag instead
              const live = things.filter((o) => !o.frozen && want && o.n === want.n && o.c === want.c).sort((a, b) => Math.hypot(a.x - me.x, a.y - me.y) - Math.hypot(b.x - me.x, b.y - me.y));
              const tg = live[0];
              if (tg && Math.hypot(tg.x - me.x, tg.y - me.y) < 300 * u) {
                const a = Math.atan2(tg.y - me.y, tg.x - me.x);
                shots.push({ x: me.x, y: me.y, vx: Math.cos(a) * 520 * u, vy: Math.sin(a) * 520 * u, life: 1 });
                if (lvl >= 4) shots.push({ x: me.x, y: me.y, vx: Math.cos(a + 0.25) * 520 * u, vy: Math.sin(a + 0.25) * 520 * u, life: 1 });
                K.audio.sfx('tag');
              }
            }
            shots.forEach((s) => { s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; });
            things.forEach((o) => {
              if (o.frozen) { o.frozen += dt; return; }
              // things run for the gate (bottom centre); only angry ones (wrong tag) hunt Holger
              const dx = me.x - o.x, dy = me.y - o.y, d = Math.hypot(dx, dy) || 1, sp = o.sp * (o.angry ? 1.5 : 1) * 60;
              const gx = (o.angry ? me.x : W / 2) - o.x, gy = (o.angry ? me.y : H + 80 * u) - o.y, gd = Math.hypot(gx, gy) || 1;
              o.x += (gx / gd * sp + Math.sin(o.wob) * 18 * u) * dt; o.y += gy / gd * sp * dt; o.wob += dt * 3;
              if (d < o.r + me.r * 0.7 && !me.inv && !o.angry) { o.x -= dx / d * 6 * u; o.y -= dy / d * 6 * u; }
              if (d < o.r + me.r * 0.7 && !me.inv && o.angry) { minutes--; me.inv = 2; o.angry = 0; K.audio.sfx('bad'); s.classList.add('shake'); setTimeout(() => s.classList.remove('shake'), 300); o.x -= dx / d * 170 * u; o.y -= dy / d * 170 * u; }
            });
            shots.forEach((sh) => {
              if (sh.life <= 0) return;
              for (const o of things) {
                if (o.frozen || Math.hypot(o.x - sh.x, o.y - sh.y) > o.r) continue;
                sh.life = 0;
                if (want && o.n === want.n && o.c === want.c) { o.frozen = 0.01; tagged++; gems.push({ x: o.x, y: o.y }); K.audio.sfx('ok'); pickWant(); }
                else if (!o.angry) { o.angry = 1; wrong++; if (wrong % 3 === 0) K.sock(1, 'forkert mærke'); }
                break;
              }
            });
            gems = gems.filter((gm) => { const d = Math.hypot(gm.x - me.x, gm.y - me.y); const mag = (lvl >= 3 ? 220 : 120) * u; if (d < mag) { gm.x += (me.x - gm.x) * 0.2; gm.y += (me.y - gm.y) * 0.2; } if (d < me.r) { xp++; if (xp >= lvl * 3) { xp = 0; lvl++; K.toast('NIVEAU ' + lvl + '! ' + ['', '', 'Hurtigere mærker', 'Magnet og roligere ting', 'Dobbelte mærker'][Math.min(lvl, 4)], 'good'); } return false; } return true; });
            things = things.filter((o) => !(o.frozen > 0.6) && o.x > -200 * u && o.x < W + 200 * u && o.y > -200 * u && o.y < H + 200 * u);
            shots = shots.filter((s) => s.life > 0);
            // the jacket moment, halfway through
            if (!jacketDone && (t > Math.min(12, DUR * 0.5) || minutes <= 1)) {
              jacketDone = true; paused = true;
              const ov = el('div', 'freeze');
              ov.appendChild(el('div', 'onoma', 'RRRIIIIP!'));
              ov.appendChild(K.renderLine({ w: 'holger', da: 'Min jakke!', en: 'My jacket!' }));
              const jc = await K.objImg('jakke', 'gul', null, 150); ov.appendChild(jc);
              ov.appendChild(el('div', 'prompt', 'En sofa river jakken af ham. Mærk den — hurtigt!'));
              body.appendChild(ov);
              K.audio.say('holger', 'Min jakke!');
              const opts = [{ da: 'min gule jakke', k: 'min' }, { da: 'Holgers gule jakke', k: 'gen' }, { da: 'en gul jakke', k: 'generic' }, { da: 'mit gule jakke', k: 'sock' }];
              const box = el('div', 'opts');
              await new Promise((res) => { K.shuffle(opts).forEach((o) => { const b = el('button', 'opt', K.daHTML(o.da)); b.type = 'button'; b.onclick = () => { st.jacket = o.k; res(); }; box.appendChild(b); }); ov.appendChild(box); });
              if (st.jacket === 'sock') { K.sock(1, 'mit → min'); K.mistake({ said: 'mit gule jakke', right: 'min gule jakke', noun: 'jakke', adj: 'gul', det: 'min', day: 'holger' }); }
              ov.remove(); paused = false; last = performance.now();
            }
            if (t >= DUR || (minutes <= 0 && jacketDone)) { running = false; res(); return; }
          }
          // draw
          g.clearRect(0, 0, W, H);
          gems.forEach((gm) => { g.fillStyle = '#e8ff3a'; g.beginPath(); g.arc(gm.x, gm.y, 6 * u, 0, 7); g.fill(); });
          things.forEach((o) => {
            const sp = sprites[o.n + o.c]; const sz = o.r * 2.2; g.save(); g.translate(o.x, o.y); g.rotate(Math.sin(o.wob) * 0.15);
            if (o.frozen) { g.globalAlpha = 1 - o.frozen / 0.6; g.scale(1 + o.frozen, 1 + o.frozen); }
            if (o.angry) { g.shadowColor = '#ff2e88'; g.shadowBlur = 18 * u; }
            if (sp) g.drawImage(sp, -sz / 2, -sz / 2, sz, sz); g.restore();
          });
          shots.forEach((sh) => { g.fillStyle = '#fff'; g.strokeStyle = '#000'; g.lineWidth = 2 * u; g.save(); g.translate(sh.x, sh.y); g.rotate(Math.atan2(sh.vy, sh.vx)); g.fillRect(-8 * u, -4 * u, 16 * u, 8 * u); g.strokeRect(-8 * u, -4 * u, 16 * u, 8 * u); g.restore(); });
          g.save(); if (me.inv && Math.floor(me.inv * 10) % 2) g.globalAlpha = 0.4;
          if (holgerImg) g.drawImage(holgerImg, me.x - me.r * 1.6, me.y - me.r * 2.2, me.r * 3.2, me.r * 3.2); else { g.fillStyle = '#ffd60a'; g.beginPath(); g.arc(me.x, me.y, me.r, 0, 7); g.fill(); }
          g.restore();
          const left = Math.max(0, Math.ceil(DUR - t));
          stats.innerHTML = `<span>⏱ 11:${String(58 + Math.floor((DUR - left) / 45)).padStart(2, '0')}</span><span>MÆRKET ${tagged}</span><span>NIV ${lvl}</span><span>${'▮'.repeat(Math.max(0, minutes))}${'▯'.repeat(5 - Math.max(0, minutes))}</span>`;
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      });
      await end;
      if (!st.jacket) st.jacket = 'generic';
      window.__lukketid = { tagged, wrong };
      await K.resultStamp('lukketid', Math.min(tagged, 30) + (minutes > 0 ? 10 : 0), 40, minutes <= 0 ? 'Porten lukkede over dig.' : 'Klokken er tolv.');
      return tagged;
    },
  };
})(window.K = window.K || {});
