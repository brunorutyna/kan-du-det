// Loads the game's scripts (in index.html order) into Node, without a browser, for lint.
const fs = require('fs'), path = require('path'), vm = require('vm');
module.exports = function load() {
  const ROOT = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="([^"?]+)/g)].map((m) => m[1]);
  const ctx = { console, setTimeout, clearTimeout, setInterval, clearInterval, performance, Promise };
  ctx.window = ctx; ctx.K = {};
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
  ctx.K.__files = files;
  return ctx.K;
};
