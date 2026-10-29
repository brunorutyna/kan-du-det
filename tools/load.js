// Load the game's browser scripts into a Node sandbox (no DOM).
const fs = require('fs'), vm = require('vm'), path = require('path');
module.exports = function load() {
  const noop = () => {};
  const elStub = () => ({ classList: { add: noop, remove: noop, toggle: noop }, appendChild: noop, style: {}, set innerHTML(v) {}, querySelector: () => null });
  const ctx = {
    console, setTimeout, clearTimeout, setInterval: () => 0, clearInterval: noop, Promise, Math, JSON, Date,
    performance: { now: () => Date.now() }, location: { search: '' },
    localStorage: { getItem: () => null, setItem: noop },
    document: { addEventListener: noop, querySelector: () => null, createElement: elStub, body: { classList: { add: noop, remove: noop, toggle: noop }, appendChild: noop } },
    Audio: function () {}, Image: function () {}, requestAnimationFrame: noop, devicePixelRatio: 1,
  };
  ctx.window = ctx; ctx.window.addEventListener = noop; ctx.K = { VERSION: '0' };
  vm.createContext(ctx);
  const root = path.join(__dirname, '..');
  for (const f of ['data.js', 'audio.js', 'engine.js', 'games1.js', 'games2.js', 'story.js']) vm.runInContext(fs.readFileSync(path.join(root, 'js', f), 'utf8'), ctx, { filename: f });
  return ctx.K;
};
