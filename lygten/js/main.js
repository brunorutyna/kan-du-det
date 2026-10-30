// Boot + the playtest hook. Keep this file small.
(function (K) {
  'use strict';
  // The playtest calls K.botTick(mode) over and over: it taps what the current screen's bot says,
  // or else the next/only obvious button. mode: 'right' | 'wrong'.
  K.botTick = function (mode) {
    if (window.__errors.length) return { err: window.__errors.slice() };
    if (K.ended) return { done: true };
    const before = K.cur && K.cur.id;
    const vis = (b) => b && !b.disabled && !b.hidden && b.offsetParent !== null;
    let b = null;
    try { b = K.cur && K.cur.bot && K.cur.bot(mode); } catch (e) { return { err: [String(e.stack || e)] }; }
    if (!vis(b)) b = [...document.querySelectorAll('.modal [data-tap], #screen [data-next], #screen [data-tap]')].find((x) => vis(x) && !x.classList.contains('menu-btn') && !x.classList.contains('mini') && !x.classList.contains('english'));
    if (!b) return { idle: true, screen: K.cur && K.cur.id };
    b.click();
    return { clicked: (b.textContent || '').trim().slice(0, 30), screen: before };
  };
  function boot() {
    K.loadSave();
    K.show('title');
    K.checkVersion();
    setInterval(K.checkVersion, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) K.checkVersion(); });
    document.addEventListener('pointerdown', () => K.MUSIC.unlock(), { once: true });
  }
  if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('DOMContentLoaded', boot);
})(window.K = window.K || {});
