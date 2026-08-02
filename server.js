/* ============================================================
   server.js — เซิร์ฟเวอร์สำหรับรันในเครื่อง (local development)
   ------------------------------------------------------------
   ไฟล์นี้ใช้ตอนพัฒนาในเครื่องเท่านั้น
   ตอน deploy ขึ้น Vercel จะไม่ได้ใช้ไฟล์นี้ —
   Vercel จะเสิร์ฟไฟล์หน้าเว็บให้เอง และรัน api/prices.js เป็น
   serverless function ให้อัตโนมัติ

   ไฟล์นี้จำลองพฤติกรรมเดียวกันกับ Vercel เพื่อให้ทดสอบในเครื่องได้
   ก่อนขึ้นจริง โดยเรียกใช้ api/prices.js ตัวเดียวกันเลย

   วิธีรัน:  node server.js   แล้วเปิด http://localhost:3000
   ไม่ต้อง npm install — ใช้เฉพาะของที่มากับ Node.js (ต้อง v18+)
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// เรียกใช้ serverless function ตัวเดียวกับที่ Vercel จะรัน
const pricesHandler = require('./api/prices.js');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
};

/**
 * เติมเมธอดแบบ Vercel (res.status().json()) ให้ res ของ Node ธรรมดา
 * จะได้ใช้ไฟล์ api/prices.js ร่วมกันได้โดยไม่ต้องเขียนสองเวอร์ชัน
 */
function vercelify(res) {
  res.status = function (code) { res.statusCode = code; return res; };
  res.json = function (obj) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/index.html';

  const filePath = path.join(__dirname, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));

  /* ---- ด่านความปลอดภัย ----
     1. ห้ามหลุดออกนอกโฟลเดอร์โปรเจกต์ (กัน ../../ ไปเอาไฟล์ระบบ)
     2. ห้ามเสิร์ฟไฟล์ที่ขึ้นต้นด้วยจุด (.env .git .vercel ฯลฯ)
     3. ห้ามเสิร์ฟซอร์สของเซิร์ฟเวอร์และโฟลเดอร์ api/                */
  if (!filePath.startsWith(__dirname)) { res.writeHead(403); return res.end('Forbidden'); }

  const base = path.basename(filePath);
  const blocked =
    base.charAt(0) === '.' ||
    base === 'server.js' ||
    p.indexOf('/api/') === 0;

  if (blocked) {
    console.warn('[security] ปฏิเสธคำขอ: ' + p);
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  fs.readFile(filePath, function (err, content) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('ไม่พบไฟล์: ' + p);
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  });
}

http.createServer(function (req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/prices' && req.method === 'GET') {
    return pricesHandler(req, vercelify(res));
  }
  if (url.pathname === '/api/health') {
    return vercelify(res).status(200).json({ ok: true, mode: 'local-dev' });
  }
  serveStatic(req, res, url);

}).listen(PORT, function () {
  console.log('');
  console.log('  FairFair Farm  (โหมดพัฒนาในเครื่อง)');
  console.log('  ---------------------------------------------');
  console.log('  เว็บ:  http://localhost:' + PORT);
  console.log('  ราคา:  ดึงจากตลาดไทผ่าน api/prices.js');
  console.log('  ---------------------------------------------');
  console.log('');
});
