/* ============================================================
   sw.js — Service Worker ของ FairFair Farm
   ------------------------------------------------------------
   ทำให้เว็บกลายเป็นแอปที่ "ติดตั้งลงมือถือได้" และ "เปิดได้แม้ไม่มีเน็ต"

   ทำไมสำคัญกับโปรเจกต์นี้?
     กลุ่มผู้ใช้คือเกษตรกร ซึ่งอยู่ในไร่ในสวนที่สัญญาณมักไม่ดี
     ถ้าเว็บเปิดไม่ได้ตอนไม่มีเน็ต ก็ใช้ต่อรองราคาหน้างานไม่ได้เลย

   กลยุทธ์การเก็บแคช 2 แบบ:
     1. ไฟล์หน้าเว็บ (HTML/CSS/JS/ไอคอน) -> cache-first
        เอาจากแคชก่อนเสมอ เปิดเร็วมากและทำงานออฟไลน์ได้
     2. ราคา (/api/prices) -> network-first
        พยายามเอาของใหม่ก่อน ถ้าเน็ตไม่มีค่อยใช้ของเก่าในแคช
        (ราคาเก่าดีกว่าไม่มีราคาเลย)
   ============================================================ */

const VERSION = 'fairfair-v1';
const SHELL = VERSION + '-shell';
const DATA = VERSION + '-data';

// ไฟล์ที่ต้องมีเพื่อให้เว็บเปิดได้แม้ออฟไลน์
const SHELL_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icons.js',
  '/catalog.js',
  '/mockprices.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

/* ---------- ติดตั้ง: ดาวน์โหลดไฟล์หน้าเว็บเก็บไว้ ---------- */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL)
      .then(function (c) {
        // ใช้ reload เพื่อไม่ให้ไปหยิบของเก่าจากแคชเบราว์เซอร์
        return c.addAll(SHELL_FILES.map(function (u) {
          return new Request(u, { cache: 'reload' });
        }));
      })
      .then(function () { return self.skipWaiting(); })
      .catch(function (err) { console.warn('[sw] ติดตั้งไม่ครบ:', err); })
  );
});

/* ---------- เปิดใช้งาน: ลบแคชเวอร์ชันเก่าทิ้ง ---------- */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k !== SHELL && k !== DATA) return caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* ---------- ดักทุกคำขอ ---------- */
self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // ปล่อยคำขอไปเว็บอื่นตามปกติ

  // ---- ราคา: เอาของใหม่ก่อน ไม่ได้ค่อยใช้ของเก่า ----
  if (url.pathname === '/api/prices') {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          const copy = res.clone();
          caches.open(DATA).then(function (c) { c.put(req, copy); });
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            if (hit) return hit;
            // ไม่มีทั้งเน็ตและแคช -> ตอบว่างไป หน้าเว็บจะใช้ข้อมูลจำลองแทนเอง
            return new Response(JSON.stringify({ source: 'offline', data: [] }),
              { headers: { 'Content-Type': 'application/json' } });
          });
        })
    );
    return;
  }

  // ---- ไฟล์หน้าเว็บ: เอาจากแคชก่อน ----
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req)
        .then(function (res) {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(SHELL).then(function (c) { c.put(req, copy); });
          }
          return res;
        })
        .catch(function () {
          // เปิดหน้าเว็บตอนออฟไลน์แล้วไม่มีในแคช -> ส่งหน้าแรกไปแทน
          if (req.mode === 'navigate') return caches.match('/index.html');
          return new Response('ออฟไลน์', { status: 503 });
        });
    })
  );
});
