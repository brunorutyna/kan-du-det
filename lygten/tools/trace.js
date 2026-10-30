const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = process.argv[2], MODE = process.argv[3] || 'right';
const srv = http.createServer((req, rsp) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html')); fs.readFile(p, (e, d) => { if (e) { rsp.writeHead(404); rsp.end(); return; } rsp.writeHead(200, {'Content-Type': p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html'}); rsp.end(d); }); }).listen(0, async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 393, height: 851 } });
  pg.on('pageerror', e => console.log('ERR', e.message));
  await pg.goto(`http://localhost:${srv.address().port}/?debug&fast`);
  await pg.evaluate(() => localStorage.clear()); await pg.reload();
  let last = '';
  for (let i = 0; i < 3000; i++) {
    await pg.waitForTimeout(40);
    const r = await pg.evaluate((m) => { const res = K.botTick(m); const st = K.st || {}; return { res, sig: `${K.cur && K.cur.id} step=${st.step} str=${st.stretch} row=${st.row} w=${st.water} day=${st.day} pack=${(st.pack||[]).join(',')} sold=${(st.sold||[]).join(',')} city=${st.city}` }; }, MODE);
    if (r.sig !== last) { console.log(r.sig, JSON.stringify(r.res).slice(0, 80)); last = r.sig; }
    if (r.res.done || r.res.err) { console.log(JSON.stringify(r.res).slice(0,500)); break; }
  }
  await b.close(); srv.close();
});
