/* ============================================================
   api/prices.js — Serverless Function สำหรับ Vercel
   ------------------------------------------------------------
   ดึงราคาผัก-ผลไม้จากตลาดไท แล้วส่งให้หน้าเว็บ

   ทำไมต้องมีไฟล์นี้ ทำไมเบราว์เซอร์เรียกตลาดไทตรง ๆ ไม่ได้?
     เพราะ talaadthai.com ไม่ได้เปิด CORS ให้เว็บอื่นเรียก
     เบราว์เซอร์จะบล็อกทันที ต้องให้เซิร์ฟเวอร์เป็นคนเรียกแทน

   ดึงข้อมูลมาอย่างไร?
     หน้าเว็บตลาดไทสร้างด้วย Next.js ซึ่งฝังข้อมูลทั้งหมดไว้ใน
     <script id="__NEXT_DATA__"> เป็น JSON — เราอ่านตรงจากตรงนั้น
     ไม่ต้องแกะ HTML ไม่ต้องใช้ headless browser

   หมายเหตุ: เดิมสเปกให้ใช้ API ราคาของกระทรวงพาณิชย์
             (dataapi.moc.go.th/gis-product-price) แต่ทดสอบเมื่อ
             2 ส.ค. 2569 พบว่าตอบ 404 ทุกกรณี รวมถึงตัวอย่างใน
             เอกสารของกระทรวงเอง จึงเปลี่ยนมาใช้ตลาดไทแทน
   ============================================================ */

const TALAADTHAI_URL = 'https://talaadthai.com/products';

// เก็บผลไว้ในหน่วยความจำ 1 ชั่วโมง
// (บน Vercel ตัวแปรนี้จะอยู่ตราบที่ instance ยังอุ่นอยู่ ช่วยลดการยิงซ้ำ)
let cache = null;
const TTL = 60 * 60 * 1000;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (cache && Date.now() - cache.at < TTL) {
    return res.status(200).json({ source: 'cache', fetchedAt: cache.fetchedAt, data: cache.data });
  }

  try {
    const r = await fetch(TALAADTHAI_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FairFairFarm/1.0)' },
      signal: AbortSignal.timeout(25000),
    });
    if (!r.ok) throw new Error('ตลาดไทตอบ HTTP ' + r.status);

    const html = await r.text();
    const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!m) throw new Error('ไม่พบข้อมูลในหน้าเว็บ (โครงสร้างเว็บอาจเปลี่ยน)');

    const nd = JSON.parse(m[1]);
    const items = (nd.props && nd.props.pageProps &&
                   nd.props.pageProps.productsPriceTrending &&
                   nd.props.pageProps.productsPriceTrending.data) || [];
    if (items.length === 0) throw new Error('ไม่มีรายการราคาในหน้าเว็บ');

    // เอาเฉพาะฟิลด์ที่ใช้จริง เพื่อลดขนาดที่ส่งไปเบราว์เซอร์
    const data = items.map(function (p) {
      const snap = p.pricingData &&
                   p.pricingData.latestPriceDiffProductSnapShot &&
                   p.pricingData.latestPriceDiffProductSnapShot.data;
      return {
        name: (p.title && p.title.th) || '',
        unit: p.unit || '',
        priceMin: p.priceMinThb,
        priceMax: p.priceMaxThb,
        percentUpDown: p.percentUpDown,
        updatedAt: snap && snap.updatedAt ? snap.updatedAt : null,
        history: Array.isArray(p.graphSum) ? p.graphSum : [],   // ย้อนหลังรายเดือน
      };
    }).filter(function (p) { return p.name && p.priceMin != null; });

    const fetchedAt = new Date().toISOString();
    cache = { at: Date.now(), fetchedAt: fetchedAt, data: data };
    return res.status(200).json({ source: 'talaadthai', fetchedAt: fetchedAt, data: data });

  } catch (err) {
    console.error('[prices] ' + err.message);
    // ถ้าเคยดึงได้ ใช้ของเก่าไปก่อน ดีกว่าไม่มีอะไรเลย
    if (cache) {
      return res.status(200).json({ source: 'stale-cache', fetchedAt: cache.fetchedAt, data: cache.data });
    }
    // ไม่มีแม้แต่ของเก่า -> ให้หน้าเว็บใช้ข้อมูลจำลองแทน (เว็บไม่พัง)
    return res.status(200).json({ source: 'unavailable', fetchedAt: null, data: [], error: err.message });
  }
};
