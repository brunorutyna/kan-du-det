// Kan du det?! — title screen, menus, endings, settings.
(function (K) {
  'use strict';
  const el = K.el, $ = K.$;

  async function title() {
    K.st = null; K.hud();
    const s = K.screen('title');
    const art = el('div', 'title-art'); const im = el('img'); im.src = 'img/title.webp'; im.alt = ''; art.appendChild(im); s.appendChild(art);
    s.appendChild(el('div', 'logo', '<span class="m">GOGOGO</span><h1>Kan du det?!</h1><div class="tag">Et bizart ordforråd · kapitel 3</div>'));
    const menu = el('div', 'menu'); s.appendChild(menu);
    const run = K.save.run;
    const btn = (label, fn, cls) => { const b = el('button', 'mbtn ' + (cls || ''), label); b.type = 'button'; b.onclick = () => { K.audio.ac(); K.audio.playMusic('title'); fn(); }; menu.appendChild(b); return b; };
    if (run && run.step > 0 && !run.ending) btn('Fortsæt', () => start(run), 'main');
    btn(run && run.step > 0 && !run.ending ? 'Begynd forfra' : 'Begynd', () => start(null), run && !run.ending ? '' : 'main');
    btn('Mini-spil', games);
    btn('Slutninger', endings);
    btn('Indstillinger', settings);
    const st = K.save.stats;
    s.appendChild(el('div', 'foot', `Gennemspillet ${st.done}× · Slutninger ${Object.keys(st.endings).length}/4` + (st.best != null ? ` · Færrest sokker: ${st.best}` : '')));
    const tap = el('button', 'sound-hint', '♪ Tryk for lyd'); tap.type = 'button'; tap.onclick = () => { K.audio.ac(); K.audio.playMusic('title'); tap.remove(); }; s.appendChild(tap);
  }
  K.title = title;

  async function start(run) {
    if (!run) { K.save.stats.runs++; run = K.newRun(); K.save.run = run; K.persist(); }
    K.st = run; K.hud();
    await K.runStory();
    if (K.st && K.st.ending) await showEnding(K.st);
  }

  async function showEnding(st) {
    await K.panel(K.endingPanels(st));
    const S = K.save.stats;
    S.done++; S.endings[st.ending] = (S.endings[st.ending] || 0) + 1;
    if (S.best == null || st.socks < S.best) S.best = st.socks;
    K.save.run = null; K.persist();
    const s = K.screen('card end');
    const e = K.ENDINGS[st.ending];
    s.appendChild(el('div', 'big', 'SLUT'));
    s.appendChild(el('div', 'sub', e.title));
    const ranks = Object.entries(st.ranks).map(([k, r]) => `<span class="rk-s rk-${r}">${K.G[k] ? K.G[k].title : k}: ${r}</span>`).join('');
    s.appendChild(el('div', 'ranks', ranks));
    s.appendChild(el('div', 'sub', `Sokker: ${st.socks} · Rettede mærker: ${st.fixed} · Slutninger fundet: ${Object.keys(S.endings).length}/4`));
    const b = el('button', 'next', 'Til titlen ▸'); b.type = 'button'; b.onclick = title; s.appendChild(b);
    K.st = null; K.hud();
  }
  K.showEnding = showEnding;

  function games() {
    const s = K.screen('list');
    s.appendChild(el('h2', '', 'Mini-spil'));
    s.appendChild(el('p', 'hint', 'Spil et mini-spil igen for en bedre rang. Mini-spil låses op, når du har mødt dem i historien.'));
    const ids = ['containerne', 'sikke', 'lilla', 'stirren', 'lukketid', 'rettelser', 'auktion', 'mine'];
    ids.forEach((id) => {
      const g = K.G[id]; const open = K.save.stats.unlocked[id];
      const b = el('button', 'row' + (open ? '' : ' locked'), `<b>${open ? g.title : '???'}</b><span>${open ? g.sub : 'Låst'}</span><i>${K.save.stats.ranks[id] || ''}</i>`); b.type = 'button';
      if (open) b.onclick = async () => {
        K.st = K.newRun(); K.st.who = ['rettelser', 'auktion', 'mine'].includes(id) ? 'ellen' : 'holger'; K.st.solo = true; K.hud();
        if (id === 'rettelser') { K.st.tags = []; }
        K.audio.playMusic(id === 'lukketid' ? 'lukketid' : id === 'auktion' ? 'auktion' : 'duel');
        try { await g.run({ story: false }); } catch (e) { console.error(e); }
        K.st = null; K.persist(); games();
      };
      s.appendChild(b);
    });
    back(s);
  }
  function endings() {
    const s = K.screen('list');
    s.appendChild(el('h2', '', 'Slutninger'));
    Object.entries(K.ENDINGS).forEach(([k, e]) => {
      const n = K.save.stats.endings[k] || 0;
      s.appendChild(el('div', 'row' + (n ? '' : ' locked'), n ? `<b>${e.title}</b><span>Fundet ${n}×</span>` : '<b>???</b><span>Ikke fundet endnu</span>'));
    });
    const missed = Object.entries(K.save.stats.missed).sort((a, b) => b[1] - a[1]).slice(0, 12);
    if (missed.length) { s.appendChild(el('h3', '', 'Ord, der driller')); s.appendChild(el('div', 'missed', missed.map(([p]) => `<span>${K.daHTML(p)}</span>`).join(''))); }
    back(s);
  }
  function settings() {
    const s = K.screen('list');
    s.appendChild(el('h2', '', 'Indstillinger'));
    [['music', 'Musik'], ['voice', 'Dansk stemme'], ['sfx', 'Lydeffekter'], ['anim', 'Animationer']].forEach(([k, label]) => {
      const b = el('button', 'row toggle', `<b>${label}</b><i>${K.settings[k] ? 'TIL' : 'FRA'}</i>`); b.type = 'button';
      b.onclick = () => { K.settings[k] = !K.settings[k]; K.persist(); K.audio.applyVolumes(); if (k === 'music' && !K.settings.music) K.audio.stopMusic(); document.body.classList.toggle('noanim', !K.settings.anim); settings(); };
      s.appendChild(b);
    });
    const test = el('button', 'row', '<b>Test stemmen</b><span>▶</span>'); test.type = 'button'; test.onclick = () => K.audio.say('gun', 'Lørdag. Klokken otte.'); s.appendChild(test);
    const reset = el('button', 'row danger', '<b>Slet gemt spil</b><span>Statistik bevares</span>'); reset.type = 'button'; reset.onclick = () => { K.save.run = null; K.persist(); title(); }; s.appendChild(reset);
    back(s);
  }
  function back(s) { const b = el('button', 'next', '◂ Tilbage'); b.type = 'button'; b.onclick = title; s.appendChild(b); }

  // version sticker: a newer deploy shows "Ny version"
  async function checkVersion() {
    try {
      const v = (await (await fetch('version.txt?' + Date.now(), { cache: 'no-store' })).text()).trim();
      if (/^\d{14}$/.test(v) && /^\d{14}$/.test(K.VERSION) && v > K.VERSION) { const n = el('button', 'newver', 'Ny version ↻'); n.type = 'button'; n.onclick = () => location.reload(); document.body.appendChild(n); }
    } catch (e) {}
  }

  window.addEventListener('load', () => {
    document.body.classList.toggle('noanim', !K.settings.anim);
    const crate = $('#crate'); if (crate) crate.onclick = () => K.toast('Sokker i kassen. Færre er bedre.', '');
    title();
    setInterval(checkVersion, 120000); setTimeout(checkVersion, 5000);
    if (/[?&]debug/.test(location.search)) window.K = K;
  });
})(window.K = window.K || {});
