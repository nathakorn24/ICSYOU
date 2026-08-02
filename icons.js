/* ============================================================
   icons.js — ชุดไอคอน SVG ของ FairHarvest
   ------------------------------------------------------------
   ทำไมวาดเอง ไม่ใช้ Flaticon?
     1. Flaticon ต้องล็อกอิน + ดาวน์โหลดไฟล์ + ใส่เครดิตตามไลเซนส์
     2. ถ้าลิงก์ตรงไปเว็บนอก เน็ตล่มตอนเดโม = ไอคอนหายหมด
     3. SVG ที่ฝังในไฟล์นี้ทำงานออฟไลน์ 100% และย่อ-ขยายไม่แตก

   อยากเปลี่ยนเป็นไอคอน Flaticon ทีหลัง?
     - ดาวน์โหลดไฟล์ .svg มาไว้ในโฟลเดอร์ assets/icons/
     - แล้วแก้ค่าใน ICONS ให้เป็น:  '<img src="assets/icons/mango.svg" alt="">'
     - แก้ที่เดียว ทั้งเว็บเปลี่ยนตาม
     - อย่าลืมใส่เครดิตท้ายเว็บตามที่ไลเซนส์กำหนด

   สไตล์: ใช้การไล่สี (gradient) + ไฮไลต์แสง เพื่อให้ดูมีมิติ
          ไม่แบนเหมือนอิโมจิ
   ============================================================ */

/* ตัวช่วยห่อ SVG ให้ทุกไอคอนมีขนาดและ viewBox เดียวกัน */
function svg(inner, defs) {
  return '<svg viewBox="0 0 64 64" class="icn" aria-hidden="true" focusable="false">' +
         (defs ? '<defs>' + defs + '</defs>' : '') + inner + '</svg>';
}

/* ตัวช่วยสร้างการไล่สีแบบรัศมี (ให้ผลไม้ดูกลม มีแสงตกกระทบ) */
function radial(id, light, mid, dark) {
  return '<radialGradient id="' + id + '" cx="35%" cy="28%" r="78%">' +
         '<stop offset="0%" stop-color="' + light + '"/>' +
         '<stop offset="55%" stop-color="' + mid + '"/>' +
         '<stop offset="100%" stop-color="' + dark + '"/></radialGradient>';
}

/* ตัวช่วยสร้างการไล่สีแบบเส้นตรง (ใช้กับใบไม้ ก้าน) */
function linear(id, from, to) {
  return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
         '<stop offset="0%" stop-color="' + from + '"/>' +
         '<stop offset="100%" stop-color="' + to + '"/></linearGradient>';
}

/* เงาใต้วัตถุ ทำให้ดูวางอยู่บนพื้น ไม่ลอย */
const SHADOW = '<ellipse cx="32" cy="57" rx="17" ry="3.4" fill="#1f3d2b" opacity=".16"/>';


const ICONS = {

  /* ---------- ผลไม้ / ผัก ---------- */

  'mango-nds': svg(
    SHADOW +
    '<path d="M40 12c9 3 14 13 12 24-2 11-11 18-20 18S17 46 17 35c0-11 6-19 14-22 3-1 6-1.5 9-1z" fill="url(#gMango)"/>' +
    '<path d="M28 15c-6 4-9 12-8 21 1 8 5 14 11 17-8-1-14-9-14-19 0-9 4-16 11-19z" fill="#fff" opacity=".2"/>' +
    '<path d="M36 13c-1-3 1-6 5-7 1 4-1 7-5 7z" fill="url(#gLeafM)"/>' +
    '<path d="M34 14c1-2 3-3 5-3" stroke="#4a3b2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="26" cy="26" rx="4.5" ry="6" fill="#fff" opacity=".32" transform="rotate(-22 26 26)"/>',
    radial('gMango', '#ffe07a', '#f5b731', '#d4741f') + linear('gLeafM', '#7e9166', '#405c38')
  ),

  'durian-monthong': svg(
    SHADOW +
    '<path d="M32 8l3 5 5-3 1 6 6-1-2 6 6 2-4 5 4 5-6 2 2 6-6-1-1 6-5-3-3 5-3-5-5 3-1-6-6 1 2-6-6-2 4-5-4-5 6-2-2-6 6 1 1-6 5 3z" fill="url(#gDur)"/>' +
    '<circle cx="32" cy="32" r="15" fill="url(#gDur2)"/>' +
    '<path d="M32 20l2 5-5-1zM24 27l2 5-5-1zM40 27l2 5-5-1zM28 38l2 5-5-1zM38 38l2 5-5-1z" fill="#5c6b3a" opacity=".55"/>' +
    '<ellipse cx="26" cy="26" rx="4" ry="5" fill="#fff" opacity=".22" transform="rotate(-20 26 26)"/>',
    radial('gDur', '#a8b872', '#7d8f4e', '#4e5a2c') + radial('gDur2', '#b9c882', '#8a9a5b', '#5f6d34')
  ),

  'papaya-holland': svg(
    SHADOW +
    '<path d="M32 10c8 2 14 12 14 24 0 11-6 18-14 18s-14-7-14-18c0-12 6-22 14-24z" fill="url(#gPap)"/>' +
    '<path d="M26 16c-4 6-6 13-6 20 0 8 3 14 8 16-7-1-12-8-12-18 0-8 4-15 10-18z" fill="#fff" opacity=".22"/>' +
    '<path d="M32 11c-1-3 0-5 2-6 1 3 0 5-2 6z" fill="url(#gLeafP)"/>' +
    '<ellipse cx="27" cy="26" rx="3.6" ry="7" fill="#fff" opacity=".3" transform="rotate(-12 27 26)"/>',
    radial('gPap', '#ffd98a', '#f0a53c', '#c4671f') + linear('gLeafP', '#7e9166', '#3f5a36')
  ),

  'banana-hom': svg(
    SHADOW +
    '<path d="M14 22c2 16 12 27 26 28 4 0 6-2 5-5-1-3-5-3-9-4-9-3-15-11-17-20-1-3-3-4-4-3s-1 2-1 4z" fill="url(#gBan1)"/>' +
    '<path d="M19 18c2 16 12 27 26 28 4 0 6-2 5-5-1-3-5-3-9-4-9-3-15-11-17-20-1-3-3-4-4-3s-1 2-1 4z" fill="url(#gBan2)"/>' +
    '<path d="M24 14c2 16 12 27 26 28 4 0 6-2 5-5-1-3-5-3-9-4-9-3-15-11-17-20-1-3-3-4-4-3s-1 2-1 4z" fill="url(#gBan3)"/>' +
    '<path d="M27 17c2 13 10 22 21 25" stroke="#fff" stroke-width="1.8" opacity=".35" fill="none" stroke-linecap="round"/>' +
    '<path d="M24 14c-1-3-3-5-6-5 1 3 3 5 6 5z" fill="#5a4a3a"/>',
    linear('gBan1', '#e8c250', '#b08a1e') + linear('gBan2', '#f3d566', '#c79b28') +
    linear('gBan3', '#ffe488', '#d9a92f')
  ),

  'longan-eedor': svg(
    SHADOW +
    '<path d="M32 12c-6 0-11 2-15 5M32 12c6 0 11 2 15 5" stroke="#6b5544" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M32 8v8" stroke="#6b5544" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="20" cy="27" r="9" fill="url(#gLon)"/>' +
    '<circle cx="44" cy="27" r="9" fill="url(#gLon)"/>' +
    '<circle cx="32" cy="41" r="10" fill="url(#gLon)"/>' +
    '<ellipse cx="17" cy="23" rx="2.6" ry="3.4" fill="#fff" opacity=".3"/>' +
    '<ellipse cx="41" cy="23" rx="2.6" ry="3.4" fill="#fff" opacity=".3"/>' +
    '<ellipse cx="28" cy="36" rx="3" ry="4" fill="#fff" opacity=".32"/>',
    radial('gLon', '#d9b98a', '#a8794a', '#6f4a28')
  ),

  watermelon: svg(
    SHADOW +
    '<path d="M8 44a24 24 0 0 1 48 0z" fill="url(#gWmRind)"/>' +
    '<path d="M12 44a20 20 0 0 1 40 0z" fill="#f4f0e2"/>' +
    '<path d="M15 44a17 17 0 0 1 34 0z" fill="url(#gWmFlesh)"/>' +
    '<ellipse cx="26" cy="36" rx="1.7" ry="2.4" fill="#3a2a1e"/>' +
    '<ellipse cx="36" cy="34" rx="1.7" ry="2.4" fill="#3a2a1e"/>' +
    '<ellipse cx="32" cy="41" rx="1.7" ry="2.4" fill="#3a2a1e"/>' +
    '<ellipse cx="21" cy="41" rx="1.7" ry="2.4" fill="#3a2a1e"/>' +
    '<ellipse cx="42" cy="40" rx="1.7" ry="2.4" fill="#3a2a1e"/>' +
    '<path d="M20 30c4-3 9-4 14-3" stroke="#fff" stroke-width="2" opacity=".3" fill="none" stroke-linecap="round"/>',
    linear('gWmRind', '#5f7a3a', '#2f4a20') + radial('gWmFlesh', '#f97a72', '#e0453f', '#b32a26')
  ),

  'morning-glory': svg(
    SHADOW +
    '<path d="M22 54c-2-14 0-26 6-36" stroke="url(#gStem)" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
    '<path d="M32 54c0-15 2-27 6-37" stroke="url(#gStem)" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
    '<path d="M42 54c2-13 3-24 2-34" stroke="url(#gStem)" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
    '<path d="M28 18c-5-3-9-2-11 2 4 3 9 2 11-2z" fill="url(#gMgLeaf)"/>' +
    '<path d="M38 17c5-3 10-2 12 2-4 3-9 2-12-2z" fill="url(#gMgLeaf)"/>' +
    '<path d="M44 20c4-2 8-1 9 2-3 2-7 1-9-2z" fill="url(#gMgLeaf)" opacity=".8"/>' +
    '<path d="M18 46h28" stroke="#b5673a" stroke-width="3" stroke-linecap="round"/>',
    linear('gStem', '#8fa86a', '#46603a') + linear('gMgLeaf', '#7e9166', '#3d5a33')
  ),

  kale: svg(
    SHADOW +
    '<path d="M32 54V22" stroke="url(#gKStem)" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M32 30c-8-8-16-8-20-2 5 8 14 9 20 2z" fill="url(#gKLeaf1)"/>' +
    '<path d="M32 30c8-8 16-8 20-2-5 8-14 9-20 2z" fill="url(#gKLeaf1)"/>' +
    '<path d="M32 42c-7-6-14-6-17-1 4 7 12 7 17 1z" fill="url(#gKLeaf2)"/>' +
    '<path d="M32 42c7-6 14-6 17-1-4 7-12 7-17 1z" fill="url(#gKLeaf2)"/>' +
    '<path d="M32 22c-3-6-1-11 3-13 2 6 0 11-3 13z" fill="url(#gKLeaf1)"/>' +
    '<path d="M20 28c5 2 9 4 12 6M44 28c-5 2-9 4-12 6" stroke="#2f4a20" stroke-width="1.2" opacity=".45" fill="none"/>',
    linear('gKLeaf1', '#8fa86a', '#3d5a33') + linear('gKLeaf2', '#7a9459', '#32502b') +
    linear('gKStem', '#d8e0c0', '#9aab7a')
  ),

  chili: svg(
    SHADOW +
    '<path d="M40 14c6 6 8 16 4 25-4 8-12 13-19 12-4-1-5-4-3-7 3-4 9-5 13-11 3-5 3-12 1-17-1-3 2-4 4-2z" fill="url(#gChili)"/>' +
    '<path d="M38 20c2 6 1 13-3 19-3 5-8 8-12 9 6-1 12-5 16-12 3-6 3-12-1-16z" fill="#fff" opacity=".22"/>' +
    '<path d="M36 14c-2-3-1-6 2-7 3-1 6 1 6 4-2 0-4 1-5 3z" fill="url(#gChiliLeaf)"/>' +
    '<path d="M40 10c1-3 3-4 5-3" stroke="#46603a" stroke-width="2" fill="none" stroke-linecap="round"/>',
    radial('gChili', '#ef6a5a', '#cf2f28', '#8e1a18') + linear('gChiliLeaf', '#8fa86a', '#3d5a33')
  ),

  'tomato-sida': svg(
    SHADOW +
    '<circle cx="32" cy="35" r="17" fill="url(#gTom)"/>' +
    '<path d="M22 24c-3 4-4 9-3 14 1 6 5 10 10 12-8-1-14-8-14-16 0-4 3-8 7-10z" fill="#fff" opacity=".2"/>' +
    '<path d="M32 18c-5-4-10-4-13-1 3 4 8 5 13 1zM32 18c5-4 10-4 13-1-3 4-8 5-13 1zM32 18c-2-5-1-8 1-9 2 3 2 7-1 9z" fill="url(#gTomLeaf)"/>' +
    '<circle cx="32" cy="19" r="2.6" fill="#46603a"/>' +
    '<ellipse cx="25" cy="28" rx="4" ry="5.5" fill="#fff" opacity=".3" transform="rotate(-20 25 28)"/>',
    radial('gTom', '#f4685c', '#d0342c', '#8f1c18') + linear('gTomLeaf', '#8fa86a', '#3d5a33')
  ),

  shallot: svg(
    SHADOW +
    '<path d="M32 20c8 3 13 11 13 19 0 8-6 13-13 13s-13-5-13-13c0-8 5-16 13-19z" fill="url(#gSha)"/>' +
    '<path d="M32 20c-5 3-8 11-8 19 0 6 3 11 7 13-7-1-12-6-12-13 0-8 5-16 13-19z" fill="#fff" opacity=".2"/>' +
    '<path d="M32 20V8M32 20l6-11M32 20l-6-11" stroke="url(#gShaTop)" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
    '<path d="M28 24c1 10 1 20 1 27M36 24c-1 10-1 20-1 27" stroke="#5a2a2a" stroke-width="1.1" opacity=".35" fill="none"/>',
    radial('gSha', '#e0a08c', '#b45c48', '#7a3226') + linear('gShaTop', '#c9b98a', '#8a7a4a')
  ),

  sweetcorn: svg(
    SHADOW +
    '<path d="M32 10c8 0 13 9 13 21s-5 21-13 21-13-9-13-21S24 10 32 10z" fill="url(#gCorn)"/>' +
    '<path d="M25 18c3 3 3 25 0 30M32 15c2 4 2 30 0 34M39 18c-3 3-3 25 0 30" stroke="#a9821c" stroke-width="1.2" opacity=".5" fill="none"/>' +
    '<path d="M23 22h18M23 30h18M23 38h18M25 46h14" stroke="#a9821c" stroke-width="1.2" opacity=".5"/>' +
    '<path d="M19 26c-6-2-10 2-10 9 0 8 5 14 10 16-3-8-3-18 0-25z" fill="url(#gHusk)"/>' +
    '<path d="M45 26c6-2 10 2 10 9 0 8-5 14-10 16 3-8 3-18 0-25z" fill="url(#gHusk)"/>',
    radial('gCorn', '#ffe37e', '#e8bc35', '#b98d18') + linear('gHusk', '#8fa86a', '#3d5a33')
  ),


  /* ---------- ไอคอนหน้าจอ (UI) ---------- */

  brand: svg(
    '<path d="M32 56V22" stroke="url(#gWStem)" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M32 26c-7-2-11-7-11-13 6 1 10 6 11 13zM32 26c7-2 11-7 11-13-6 1-10 6-11 13z" fill="url(#gWheat)"/>' +
    '<path d="M32 38c-7-2-11-7-11-13 6 1 10 6 11 13zM32 38c7-2 11-7 11-13-6 1-10 6-11 13z" fill="url(#gWheat)"/>' +
    '<path d="M32 50c-7-2-11-7-11-13 6 1 10 6 11 13zM32 50c7-2 11-7 11-13-6 1-10 6-11 13z" fill="url(#gWheat)"/>' +
    '<path d="M32 22c0-6 3-10 8-12 1 6-3 11-8 12z" fill="url(#gWheat)"/>',
    linear('gWheat', '#f3d566', '#c08e1e') + linear('gWStem', '#8fa86a', '#46603a')
  ),

  search: svg(
    '<circle cx="27" cy="27" r="15" fill="none" stroke="currentColor" stroke-width="4.5"/>' +
    '<path d="M38 38l14 14" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M19 22a11 11 0 0 1 8-6" stroke="#fff" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>'
  ),

  scale: svg(
    '<path d="M32 10v40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M14 18h36" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="32" cy="10" r="4" fill="currentColor"/>' +
    '<path d="M22 50h20" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M6 34a8 8 0 0 0 16 0l-8-16z" fill="currentColor" opacity=".85"/>' +
    '<path d="M42 34a8 8 0 0 0 16 0l-8-16z" fill="currentColor" opacity=".85"/>'
  ),

  shield: svg(
    '<path d="M32 6l20 8v16c0 14-9 24-20 28-11-4-20-14-20-28V14z" fill="currentColor" opacity=".18"/>' +
    '<path d="M32 6l20 8v16c0 14-9 24-20 28-11-4-20-14-20-28V14z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M23 31l7 7 13-14" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
  ),

  chart: svg(
    '<path d="M10 50V12M10 50h44" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M16 40l11-12 9 7 16-19" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="52" cy="16" r="4" fill="currentColor"/>'
  ),

  ai: svg(
    '<rect x="18" y="18" width="28" height="28" rx="7" fill="currentColor" opacity=".18"/>' +
    '<rect x="18" y="18" width="28" height="28" rx="7" fill="none" stroke="currentColor" stroke-width="3.5"/>' +
    '<circle cx="27" cy="30" r="3" fill="currentColor"/><circle cx="37" cy="30" r="3" fill="currentColor"/>' +
    '<path d="M26 38h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M32 18v-7M18 27h-7M46 27h7M18 37h-7M46 37h7M24 46v7M40 46v7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
  ),

  handshake: svg(
    '<path d="M6 26l10-6 12 4 8-2 12 6v14l-10 5-10-7-8 3-8-4z" fill="currentColor" opacity=".18"/>' +
    '<path d="M16 20l12 4 8-2 12 6" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6 26v14l10 5M58 26v14l-10 5" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M28 30l6 6 6-4 8 6" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
  ),

  alert: svg(
    '<path d="M32 8l26 46H6z" fill="currentColor" opacity=".18"/>' +
    '<path d="M32 8l26 46H6z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M32 24v14" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>' +
    '<circle cx="32" cy="46" r="2.8" fill="currentColor"/>'
  ),

  source: svg(
    '<path d="M12 10h30l10 10v34H12z" fill="currentColor" opacity=".18"/>' +
    '<path d="M12 10h30l10 10v34H12z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M42 10v10h10" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M20 30h24M20 38h24M20 46h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
  ),

  clock: svg(
    '<circle cx="32" cy="32" r="24" fill="currentColor" opacity=".18"/>' +
    '<circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" stroke-width="3.5"/>' +
    '<path d="M32 17v16l11 7" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
  ),

  check: svg(
    '<circle cx="32" cy="32" r="24" fill="currentColor" opacity=".18"/>' +
    '<circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" stroke-width="3.5"/>' +
    '<path d="M21 33l8 8 15-17" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
  ),
};

/**
 * ดึงไอคอนตามรหัส ถ้าไม่มีให้ใช้ไอคอนแบรนด์แทน
 */
function iconFor(id) {
  return ICONS[id] || ICONS.brand;
}


/* ============================================================
   จับคู่ "ชื่อสินค้าภาษาไทย" -> ไอคอน
   ------------------------------------------------------------
   ชื่อจาก MOC เป็นภาษาไทยล้วน เช่น "มะม่วงน้ำดอกไม้", "ผักบุ้งจีน"
   เราจึงต้องจับคู่ด้วยคำสำคัญ (keyword) แทนรหัส

   วิธีอ่านตาราง: ถ้าชื่อสินค้า "มีคำนี้อยู่" -> ใช้ไอคอนนั้น
   เรียงจากเฉพาะเจาะจงไปหากว้าง (ตัวแรกที่ตรงชนะ)
   ============================================================ */

const NAME_TO_ICON = [
  ['มะม่วง',      'mango-nds'],
  ['ทุเรียน',     'durian-monthong'],
  ['มะละกอ',      'papaya-holland'],
  ['กล้วย',       'banana-hom'],
  ['ลำไย',        'longan-eedor'],
  ['ลิ้นจี่',      'longan-eedor'],
  ['เงาะ',        'longan-eedor'],
  ['ลองกอง',      'longan-eedor'],
  ['มังคุด',      'longan-eedor'],
  ['แตงโม',       'watermelon'],
  ['แตงกวา',      'watermelon'],
  ['ผักบุ้ง',      'morning-glory'],
  ['ต้นหอม',      'morning-glory'],
  ['ผักชี',       'morning-glory'],
  ['ขึ้นฉ่าย',     'morning-glory'],
  ['หน่อไม้',     'morning-glory'],
  ['ถั่วฝักยาว',   'morning-glory'],
  ['คะน้า',       'kale'],
  ['กะหล่ำ',      'kale'],
  ['ผักกาด',      'kale'],
  ['ผักกวางตุ้ง',  'kale'],
  ['ผักสลัด',     'kale'],
  ['กวางตุ้ง',    'kale'],
  ['พริก',        'chili'],
  ['มะเขือเทศ',   'tomato-sida'],
  ['มะเขือ',      'tomato-sida'],
  ['หอม',         'shallot'],
  ['กระเทียม',    'shallot'],
  ['ขิง',         'shallot'],
  ['ข่า',         'shallot'],
  ['ข้าวโพด',     'sweetcorn'],
  ['ส้ม',         'tomato-sida'],
  ['สับปะรด',     'sweetcorn'],
  ['ฝรั่ง',       'watermelon'],
  ['องุ่น',       'longan-eedor'],
  ['แก้วมังกร',   'papaya-holland'],
  ['มะนาว',       'watermelon'],
  ['มะพร้าว',     'durian-monthong'],
  ['ชมพู่',       'tomato-sida'],
  ['ละมุด',       'longan-eedor'],
  ['น้อยหน่า',    'durian-monthong'],
  ['ขนุน',        'durian-monthong'],
  ['ฟักทอง',      'papaya-holland'],
  ['ฟัก',         'watermelon'],
  ['บวบ',         'morning-glory'],
  ['ผัก',         'kale'],       // คำกว้าง ต้องอยู่ท้าย ๆ
];

/**
 * แปลงชื่อสินค้าภาษาไทย -> HTML ของไอคอน
 *
 * ลำดับการหา:
 *   1) ไฟล์ที่ผู้ใช้เอามาวางเองใน assets/icons/  (เช่นไฟล์จาก Flaticon)
 *   2) ไอคอน SVG ที่วาดไว้ในไฟล์นี้
 *   3) ไอคอนแบรนด์ (กรณีไม่ตรงอะไรเลย)
 *
 * @param {string} name - ชื่อสินค้า เช่น "มะม่วงน้ำดอกไม้"
 */
function iconForName(name) {
  const custom = customIconFor(name);
  if (custom) return custom;

  const n = String(name || '');
  for (let i = 0; i < NAME_TO_ICON.length; i++) {
    if (n.indexOf(NAME_TO_ICON[i][0]) !== -1) return ICONS[NAME_TO_ICON[i][1]];
  }
  return ICONS.brand;
}


/* ============================================================
   ใช้ไอคอนของคุณเองจาก Flaticon (ไม่บังคับ)
   ------------------------------------------------------------
   วิธีทำ:
     1. ไปโหลด SVG/PNG จาก flaticon.com ด้วยบัญชีของคุณเอง
        (ผมโหลดให้ไม่ได้ เพราะเข้าเว็บที่ต้องล็อกอินไม่ได้)
     2. สร้างโฟลเดอร์  assets/icons/
     3. ตั้งชื่อไฟล์ตามคำไทยด้านล่าง เช่น
          assets/icons/มะม่วง.svg
          assets/icons/ทุเรียน.svg
          assets/icons/ผักบุ้ง.svg
     4. เพิ่มชื่อไฟล์ลงใน CUSTOM_ICONS ด้านล่าง
     5. อย่าลืมใส่เครดิต Flaticon ท้ายเว็บตามที่ไลเซนส์กำหนด

   ถ้าไม่มีไฟล์ ระบบใช้ SVG ที่วาดไว้แทนอัตโนมัติ เว็บไม่พัง
   ============================================================ */

const ICON_DIR = 'assets/icons/';

// ใส่คำไทยที่คุณมีไฟล์ไอคอนแล้ว เช่น ['มะม่วง', 'ทุเรียน', 'ผักบุ้ง']
const CUSTOM_ICONS = [];

// นามสกุลไฟล์ที่ใช้ (เปลี่ยนเป็น 'png' ได้ถ้าโหลด PNG มา)
const CUSTOM_ICON_EXT = 'svg';

function customIconFor(name) {
  if (CUSTOM_ICONS.length === 0) return null;
  const n = String(name || '');
  for (let i = 0; i < CUSTOM_ICONS.length; i++) {
    const key = CUSTOM_ICONS[i];
    if (n.indexOf(key) !== -1) {
      return '<img src="' + ICON_DIR + encodeURIComponent(key) + '.' + CUSTOM_ICON_EXT +
             '" alt="" loading="lazy">';
    }
  }
  return null;
}
