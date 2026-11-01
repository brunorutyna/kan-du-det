// node tools/trace.js [right|wrong]: plays the game and prints each screen with the run state.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), MODE = process.argv[2] || 'right', PART2 = process.argv[3] === 'part2', PART3 = process.argv[3] === 'part3', PART4 = process.argv[3] === 'part4';
const srv = http.createServer((req, rsp) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html')); fs.readFile(p, (e, d) => { if (e) { rsp.writeHead(404); rsp.end(); return; } rsp.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.css') ? 'text/css' : 'text/html' }); rsp.end(d); }); }).listen(0, async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 393, height: 851 } });
  pg.on('pageerror', (e) => console.log('ERR', e.message));
  await pg.goto(`http://localhost:${srv.address().port}/?debug&fast${PART2 ? '&part2' : ''}${PART3 ? '&part3' : ''}${PART4 ? '&part4' : ''}`);
  await pg.evaluate((p2) => { localStorage.clear(); if (p2) localStorage.setItem('dk.toerlagt', JSON.stringify({ v: 1, stats: { runs: 1, done: 1, reached: 6, ranks: {}, endings: {}, missed: {}, lastEnding: 'Blomstret' }, run: null })); if (p2 === 3) localStorage.setItem('dk.toerlagt', JSON.stringify({ v: 1, stats: { runs: 2, done: 2, reached: 14, part2done: 1, ranks: {}, endings: {}, missed: { '+e': 3, 'Du spiste fire kager.': 2 }, lastEnding: 'Blomstret' }, run: null })); if (p2 === 4) localStorage.setItem('dk.toerlagt', JSON.stringify({ v: 1, stats: { runs: 3, done: 3, reached: 19, part2done: 1, part3done: 1, ranks: {}, endings: {}, missed: {}, lastEnding: 'Blomstret' }, run: null })); }, PART4 ? 4 : PART3 ? 3 : PART2); await pg.reload();
  let last = '';
  for (let i = 0; i < 4000; i++) {
    await pg.waitForTimeout(40);
    const r = await pg.evaluate((m) => { if (m === 'yes' && K.cur && K.cur.id === 'choice') { const y = [...document.querySelectorAll('.opt')].find((x) => /^Ja/.test(x.textContent)); if (y && !K.cur.locked) { y.click(); return { res: {}, sig: 'choice-yes' }; } } const res = K.botTick(m === 'yes' ? 'right' : m); const st = K.st || {}; return { res, sig: `${K.cur && K.cur.id} step=${st.step} flags=${JSON.stringify(st.flags || {})}` }; }, MODE);
    if (r.sig !== last) { console.log(r.sig); last = r.sig; }
    if (r.res.done || r.res.err) { console.log(JSON.stringify(r.res).slice(0, 400)); break; }
  }
  const end = await pg.evaluate(() => document.querySelector('#screen').innerText.slice(0, 300));
  console.log(end.replace(/\s+/g, ' '));
  await b.close(); srv.close();
});
