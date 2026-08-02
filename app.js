/* ============================================================
   app.js — FairFair Farm
   ------------------------------------------------------------
   หน้าที่: ให้เกษตรกรเช็ก "ราคามาตรฐาน" ของผัก-ผลไม้
            แล้วเอาไปต่อรองกับพ่อค้าคนกลาง

   อ่านตามลำดับ 6 ส่วน:
     1. ตัวแปรหลัก + โหลดข้อมูล
     2. หาราคามาตรฐานของสินค้า
     3. แปลงหน่วย
     4. ค้นหาสินค้า
     5. วาดหน้าจอ
     6. ปุ่มต่าง ๆ + เริ่มระบบ
   ============================================================ */


/* ============================================================
   ส่วนที่ 1 : ตัวแปรหลัก + โหลดข้อมูล
   ============================================================ */

// รายชื่อสินค้า — มาจาก catalog.js ซึ่งดึงมาจาก MOC Open Data ของจริง
const CATALOG = FALLBACK_CATALOG;

// ราคาจริงจากตลาดไท (โหลดตอนเปิดเว็บ) — ถ้าโหลดไม่ได้จะใช้ mock แทน
let REFERENCE = [];
let referenceMeta = null;

// สินค้าที่ผู้ใช้กำลังดู
let current = null;

// หมวดที่เลือกอยู่ในรายการสินค้า
let activeCategory = 'ทั้งหมด';

// ผู้ใช้กดดูราคาย้อนหลังอยู่หรือไม่
let historyOpen = false;

/** โหลดราคาจริงจากตลาดไทผ่านเซิร์ฟเวอร์เรา (ตลาดไทไม่เปิด CORS) */
async function loadPrices() {
  try {
    const res = await fetch('/api/prices');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const body = await res.json();
    REFERENCE = body.data || [];
    referenceMeta = { source: body.source, fetchedAt: body.fetchedAt };
  } catch (err) {
    console.warn('[prices] โหลดราคาจริงไม่ได้ ใช้ข้อมูลจำลองแทน:', err.message);
    REFERENCE = [];
  }
}


/* ============================================================
   ส่วนที่ 2 : หาราคามาตรฐานของสินค้า
   ------------------------------------------------------------
   ลำดับ:  1) ราคาจริงจากตลาดไท (ถ้ามี)
           2) ข้อมูลจำลองใน mockprices.js
   ทั้งสองแบบจะติดป้ายบอกที่มาเสมอ ผู้ใช้ดูออกว่าอันไหนจริงอันไหนจำลอง
   ============================================================ */

/**
 * ตัดคำที่ไม่เกี่ยวกับชนิดพืชออก เพื่อเทียบชื่อสองแหล่งให้ตรงกัน
 * เช่น "ทุเรียนหมอนทอง – เบอร์ใหญ่" -> "ทุเรียนหมอนทอง"
 *
 * หมายเหตุ: ห้ามตัดคำว่า "ต้น" "ไทย" "สด" เพราะเป็นส่วนหนึ่งของชื่อจริง
 * (เคยตัดแล้วทำให้ "กล้วยหอมทอง" ไปจับคู่กับ "ต้นหอม")
 */
function normalizeName(s) {
  return String(s || '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[–—\-/]/g, ' ')
    .replace(/(เบอร์|ขนาด|เกรด|ชั้น)\s*[\wก-๙]*/g, ' ')
    .replace(/(ใหญ่|กลาง|เล็ก|คละ|แต่งผล)/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, '')
    .trim();
}

/** เทียบชื่อแบบ "ขึ้นต้นตรงกัน" — แม่นกว่าการหาสตริงย่อยมาก */
function findByName(list, target) {
  let best = null, bestLen = 0;
  list.forEach(function (r) {
    const n = normalizeName(r.name);
    if (n.length < 4) return;
    if (n.indexOf(target) !== 0 && target.indexOf(n) !== 0) return;
    const len = Math.min(n.length, target.length);
    if (len > bestLen) { best = r; bestLen = len; }
  });
  return best;
}

/**
 * หาราคามาตรฐานของสินค้าหนึ่งชิ้น
 * คืนค่า: { name, unit, priceMin, priceMax, asOf, history, source, isMock }
 */
function priceFor(productName) {
  const target = normalizeName(productName);
  if (target.length < 4) return null;

  // 1) ราคาจริงจากตลาดไทก่อน
  const real = findByName(REFERENCE, target);
  if (real) {
    return {
      name: real.name,
      unit: real.unit,
      priceMin: real.priceMin,
      priceMax: real.priceMax,
      percentUpDown: real.percentUpDown,
      asOf: real.updatedAt || (referenceMeta && referenceMeta.fetchedAt) || null,
      history: real.history || [],
      source: 'ตลาดไท (ตลาดกลางค้าส่ง)',
      isMock: false,
    };
  }

  // 2) ไม่มีราคาจริง -> ใช้ข้อมูลจำลอง
  if (typeof MOCK_PRICES === 'undefined') return null;
  const mock = findByName(MOCK_PRICES, target);
  if (!mock) return null;

  return {
    name: mock.name,
    unit: mock.unit,
    priceMin: mock.priceMin,
    priceMax: mock.priceMax,
    percentUpDown: mock.percentUpDown,
    asOf: MOCK_META.generatedAt,
    history: mock.history || [],
    source: 'ข้อมูลจำลอง',
    isMock: true,
  };
}


/* ============================================================
   ส่วนที่ 3 : แปลงหน่วย
   ------------------------------------------------------------
   หน่วยพื้นบ้านไม่มีมาตรฐานกลาง น้ำหนักจริงต่างกันตามภาค
   ตัวเลขนี้เป็นค่ากลางโดยประมาณ
   ============================================================ */

const UNITS = {
  'กก.':    { kg: 1,   label: 'กิโลกรัม' },
  'ขีด':    { kg: 0.1, label: 'ขีด (100 กรัม)' },
  'เข่ง':   { kg: 25,  label: 'เข่ง (~25 กก.)' },
  'ตะกร้า': { kg: 15,  label: 'ตะกร้า (~15 กก.)' },
  'หาบ':    { kg: 60,  label: 'หาบ (~60 กก.)' },
  'ลัง':    { kg: 20,  label: 'ลัง (~20 กก.)' },
  'กระสอบ': { kg: 50,  label: 'กระสอบ (~50 กก.)' },
};

function toKilograms(amount, unitName) {
  const u = UNITS[unitName];
  return u ? amount * u.kg : amount;
}


/* ============================================================
   ส่วนที่ 4 : ค้นหาสินค้า
   ============================================================ */

function searchLocal(text) {
  const q = text.replace(/\s+/g, '').toLowerCase();
  if (!q) return [];

  const out = [];
  CATALOG.forEach(function (item) {
    const nameKey = item.name.replace(/\s+/g, '').toLowerCase();
    if (nameKey.indexOf(q) === -1 && q.indexOf(nameKey) === -1) return;

    item.grades.forEach(function (g) {
      // ถ้าผู้ใช้พิมพ์เลขเกรดมาด้วย ให้ดันอันนั้นขึ้นบน
      const gd = g.grade.match(/\d+/);
      const qd = q.match(/\d+/);
      let score = (gd && qd && gd[0] === qd[0]) ? 10 : 1;
      if (g.sellType === 'ขายส่ง') score += 2;      // เกษตรกรขายส่งเป็นหลัก
      out.push({ item: item, grade: g, score: score });
    });
  });

  out.sort(function (a, b) { return b.score - a.score; });
  return out;
}


/* ============================================================
   ส่วนที่ 5 : วาดหน้าจอ
   ============================================================ */

const el = {};
function cacheElements() {
  ['cropSearch', 'suggestions', 'gradeSelect', 'amount', 'unitSelect', 'searchNote',
   'answerCard', 'resultIcon', 'resultTitle', 'resultCode',
   'priceHero', 'priceValue', 'priceAsOf', 'priceSource', 'totalBox',
   'btnHistory', 'btnHistoryText', 'historyBox',
   'btnCheck', 'prodGrid', 'catTabs', 'prodCount', 'sourceList',
   'btnTextSize', 'btnContrast',
  ].forEach(function (id) { el[id] = document.getElementById(id); });
}

function paintIcons() {
  document.querySelectorAll('[data-icon]').forEach(function (n) {
    const name = n.getAttribute('data-icon');
    if (ICONS[name]) n.innerHTML = ICONS[name];
  });
}

function fmt(n) { return Number(n).toLocaleString('th-TH', { maximumFractionDigits: 2 }); }

/** แปลงวันที่เป็นภาษาไทยแบบเต็ม เช่น "29 กรกฎาคม 2569" */
function thaiDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + (d.getFullYear() + 543);
}

/** แปลง "07/2026" -> "กรกฎาคม 2569" */
function thaiMonth(mmYYYY) {
  const p = String(mmYYYY).split('/');
  if (p.length !== 2) return mmYYYY;
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  return months[Number(p[0]) - 1] + ' ' + (Number(p[1]) + 543);
}

function setNote(msg, type) {
  el.searchNote.textContent = msg || '';
  el.searchNote.className = 'note' + (type ? ' note-' + type : '');
}

function fillUnitOptions(select) {
  select.innerHTML = '';
  Object.keys(UNITS).forEach(function (u) {
    const o = document.createElement('option');
    o.value = u;
    o.textContent = UNITS[u].label;
    select.appendChild(o);
  });
}

function sellTypeTag(t) {
  const cls = t === 'ขายส่ง' ? 'st-wholesale' : 'st-retail';
  return '<span class="selltype ' + cls + '">' + t + '</span>';
}

/* ---------- รายการค้นหา ---------- */
function renderSuggestions(list) {
  el.suggestions.innerHTML = '';
  if (list.length === 0) { el.suggestions.classList.add('hidden'); return; }

  list.slice(0, 10).forEach(function (r) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suggestion';
    btn.innerHTML =
      '<span class="icon-box sg-icon">' + iconForName(r.item.name) + '</span>' +
      '<span class="sg-text"><strong>' + r.item.name + '</strong>' +
      '<small>' + r.grade.grade + '</small></span>' +
      sellTypeTag(r.grade.sellType);
    btn.addEventListener('click', function () {
      select(r.item, r.grade.id);
      el.suggestions.classList.add('hidden');
    });
    el.suggestions.appendChild(btn);
  });
  el.suggestions.classList.remove('hidden');
}

/* ---------- เลือกสินค้า ---------- */
function select(item, gradeId) {
  const grade = item.grades.find(function (g) { return g.id === gradeId; }) || item.grades[0];
  current = {
    id: grade.id, name: item.name, grade: grade.grade,
    sellType: grade.sellType || 'ขายส่ง', item: item,
  };

  el.cropSearch.value = item.name;
  historyOpen = false;      // เลือกสินค้าใหม่ ให้ปิดราคาย้อนหลังก่อน

  // ตัวเลือกเกรด — เรียงขายส่งขึ้นก่อน
  el.gradeSelect.innerHTML = '';
  item.grades.slice().sort(function (a, b) {
    if (a.sellType === b.sellType) return a.grade.localeCompare(b.grade, 'th');
    return a.sellType === 'ขายส่ง' ? -1 : 1;
  }).forEach(function (g) {
    const o = document.createElement('option');
    o.value = g.id;
    o.textContent = g.grade + ' — ' + g.sellType;
    if (g.id === grade.id) o.selected = true;
    el.gradeSelect.appendChild(o);
  });

  renderAnswer();
  el.answerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- การ์ดคำตอบ ---------- */
function renderAnswer() {
  if (!current) return;

  el.answerCard.classList.remove('hidden');
  el.resultIcon.innerHTML = iconForName(current.name);
  el.resultTitle.innerHTML = current.name + ' — ' + current.grade + ' ' + sellTypeTag(current.sellType);
  el.resultCode.innerHTML = '<span class="icon-box">' + ICONS.source + '</span>' +
    'รหัสสินค้ากระทรวงพาณิชย์: ' + current.id;

  const p = priceFor(current.name);

  // ---- ไม่มีข้อมูลราคาเลย ----
  if (!p) {
    el.priceHero.classList.add('is-empty');
    el.priceValue.textContent = 'ยังไม่มีข้อมูลราคา';
    el.priceAsOf.textContent = '';
    el.priceSource.innerHTML = 'สินค้าชนิดนี้ยังไม่มีราคามาตรฐานในระบบ';
    el.totalBox.classList.add('hidden');
    el.btnHistory.classList.add('hidden');
    el.historyBox.classList.add('hidden');
    return;
  }

  // ---- มีราคา ----
  el.priceHero.classList.remove('is-empty');
  el.priceHero.classList.toggle('is-mock', p.isMock);

  el.priceValue.textContent = fmt(p.priceMin) + ' – ' + fmt(p.priceMax) + ' บาท/' + p.unit;

  // บอกวันที่ของข้อมูลให้ชัด — ผู้ใช้ต้องรู้ว่าราคานี้ของวันไหน
  const when = p.isMock ? null : thaiDate(p.asOf);
  el.priceAsOf.innerHTML = '<span class="icon-box">' + ICONS.clock + '</span>' +
    (when ? 'ราคาล่าสุด ณ วันที่ <strong>' + when + '</strong>'
          : 'ข้อมูลชุดวันที่ <strong>' + (p.asOf || '-') + '</strong>');

  // ป้ายที่มา + ลูกศรขึ้นลง
  let trend = '';
  if (typeof p.percentUpDown === 'number' && p.percentUpDown !== 0) {
    const up = p.percentUpDown > 0;
    trend = ' <span class="trend ' + (up ? 'trend-up' : 'trend-down') + '">' +
            (up ? '▲ ขึ้น ' : '▼ ลง ') + Math.abs(p.percentUpDown) + '%</span>';
  }
  el.priceSource.innerHTML = p.isMock
    ? '<span class="selltype st-mock">ข้อมูลจำลอง</span> ตัวเลขนี้กำหนดขึ้นเอง ยังไม่ใช่ราคาจริง'
    : '<span class="selltype st-real">ข้อมูลจริง</span> ที่มา: ' + p.source + trend;

  renderTotal(p);
  renderHistoryButton(p);
}

/** กล่องคำนวณราคารวมตามจำนวนที่ผู้ใช้กรอก */
function renderTotal(p) {
  const amount = parseFloat(el.amount.value);
  if (!(amount > 0)) { el.totalBox.classList.add('hidden'); return; }

  const unitName = el.unitSelect.value;

  // ราคาอ้างอิงเป็นต่อกิโลกรัมเท่านั้นที่คำนวณรวมได้
  // ถ้าเป็นต่อ "ถุง/หวี/กระสอบ" คูณกับกิโลกรัมไม่ได้ ต้องบอกผู้ใช้ตรง ๆ
  if (p.unit !== 'กิโลกรัม' && p.unit !== 'กก.') {
    el.totalBox.innerHTML =
      '<div class="total-note">ราคานี้เป็นราคาต่อ <strong>1 ' + p.unit + '</strong> ' +
      'จึงเทียบกับ "' + unitName + '" ที่คุณเลือกโดยตรงไม่ได้<br>' +
      'ถ้าคุณมี <strong>' + amount + ' ' + p.unit + '</strong> จะได้ประมาณ ' +
      '<span class="highlight">' + fmt(p.priceMin * amount) + ' – ' + fmt(p.priceMax * amount) + ' บาท</span></div>';
    el.totalBox.classList.remove('hidden');
    return;
  }

  const kg = toKilograms(amount, unitName);
  el.totalBox.innerHTML =
    '<div class="total-line"><strong>' + amount + ' ' + unitName + '</strong>' +
    (unitName !== 'กก.' ? ' = <strong>' + fmt(kg) + ' กิโลกรัม</strong>' : '') + '</div>' +
    '<div class="total-big">ควรขายได้ <span class="highlight">' +
    fmt(p.priceMin * kg) + ' – ' + fmt(p.priceMax * kg) + ' บาท</span></div>';
  el.totalBox.classList.remove('hidden');
}

/** ปุ่มดูราคาย้อนหลัง — ผู้ใช้กดเองถ้าสนใจ ไม่บังคับให้ดู */
function renderHistoryButton(p) {
  if (!p.history || p.history.length === 0) {
    el.btnHistory.classList.add('hidden');
    el.historyBox.classList.add('hidden');
    return;
  }

  el.btnHistory.classList.remove('hidden');
  el.btnHistoryText.textContent = historyOpen
    ? 'ซ่อนราคาย้อนหลัง'
    : 'ดูราคาย้อนหลัง ' + p.history.length + ' เดือน';

  if (!historyOpen) { el.historyBox.classList.add('hidden'); return; }

  // แสดงเป็นแถวข้อความ อ่านง่าย — ไม่ใช้กราฟ
  const rows = p.history.slice().reverse().map(function (h, i) {
    const isLatest = i === 0;
    return '<li class="' + (isLatest ? 'hist-latest' : '') + '">' +
      '<span class="hist-month">' + thaiMonth(h.date) + (isLatest ? ' <b>(ล่าสุด)</b>' : '') + '</span>' +
      '<span class="hist-price">' + fmt(Math.round(h.low)) + ' – ' + fmt(Math.round(h.high)) +
      ' บาท/' + p.unit + '</span></li>';
  }).join('');

  el.historyBox.innerHTML =
    '<div class="hist-title">ราคาย้อนหลังรายเดือน' +
      (p.isMock ? ' <span class="selltype st-mock">ข้อมูลจำลอง</span>' : '') + '</div>' +
    '<ul class="hist-list">' + rows + '</ul>';
  el.historyBox.classList.remove('hidden');
}

/* ---------- รายการสินค้าทั้งหมด ---------- */
function renderProducts() {
  const cats = ['ทั้งหมด'].concat(
    Array.from(new Set(CATALOG.map(function (c) { return c.category; })))
  );

  el.catTabs.innerHTML = '';
  cats.forEach(function (cat) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cat-tab';
    b.textContent = cat;
    b.setAttribute('aria-pressed', cat === activeCategory ? 'true' : 'false');
    b.addEventListener('click', function () { activeCategory = cat; renderProducts(); });
    el.catTabs.appendChild(b);
  });

  const shown = CATALOG.filter(function (c) {
    return activeCategory === 'ทั้งหมด' || c.category === activeCategory;
  });
  el.prodCount.textContent = CATALOG.length + ' ชนิด';

  el.prodGrid.innerHTML = '';
  shown.forEach(function (item) {
    const p = priceFor(item.name);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'prod-item';
    b.innerHTML =
      '<span class="icon-box">' + iconForName(item.name) + '</span>' +
      '<span>' + item.name +
      '<small>' + (p ? fmt(p.priceMin) + '–' + fmt(p.priceMax) + ' บ./' + p.unit : 'ยังไม่มีราคา') +
      (p && p.isMock ? ' · จำลอง' : '') + '</small></span>';
    b.addEventListener('click', function () {
      select(item, item.grades[0].id);
    });
    el.prodGrid.appendChild(b);
  });
}

/* ---------- ที่มาของข้อมูล ---------- */
const SOURCES = [
  {
    name: 'รายชื่อสินค้า — กระทรวงพาณิชย์ (MOC Open Data)',
    tag: 'ข้อมูลจริง', cls: 'st-real',
    url: 'https://data.moc.go.th/OpenData/GISProducts',
    note: 'รายชื่อผัก-ผลไม้และรหัสสินค้าทั้งหมดในเว็บนี้ดึงมาจาก API ของกระทรวงพาณิชย์ ' +
          'ไม่ต้องใช้ API key รหัสทุกตัวตรวจสอบย้อนกลับได้',
  },
  {
    name: 'ราคา — ตลาดไท (ตลาดกลางค้าส่ง)',
    tag: 'ข้อมูลจริง', cls: 'st-real',
    url: 'https://talaadthai.com/products',
    note: 'ราคาขายส่งรายวันพร้อมราคาย้อนหลัง 13 เดือน ครอบคลุมสินค้าที่กำลังซื้อขายคึกคัก',
  },
  {
    name: 'ราคา — ข้อมูลจำลอง',
    tag: 'จำลอง', cls: 'st-mock',
    url: '#',
    note: 'สินค้าที่ตลาดไทไม่มีราคา ระบบเติมด้วยข้อมูลจำลองที่กำหนดขึ้นเอง ' +
          'เพื่อให้ทดลองใช้งานได้ครบทุกชนิด ทุกจุดที่เป็นข้อมูลจำลองจะมีป้ายกำกับเสมอ',
  },
  {
    name: 'ราคา — กระทรวงพาณิชย์ (gis-product-price)',
    tag: 'ใช้ไม่ได้', cls: 'st-dead',
    url: 'https://data.moc.go.th/OpenData/GISProductPrice',
    note: 'ทดสอบเมื่อ 2 สิงหาคม 2569: API ตอบ 404 ทุกกรณี รวมถึงตัวอย่างในเอกสารของกระทรวงเอง ' +
          'เอกสารยังอยู่แต่บริการถูกถอดแล้ว จึงใช้แหล่งอื่นแทน',
  },
];

function renderSources() {
  el.sourceList.innerHTML = '';
  SOURCES.forEach(function (s) {
    const li = document.createElement('li');
    const link = s.url === '#' ? '<b>' + s.name + '</b>'
      : '<a href="' + s.url + '" target="_blank" rel="noopener noreferrer">' + s.name + '</a>';
    li.innerHTML = link + ' <span class="selltype ' + s.cls + '">' + s.tag + '</span>' +
                   '<p class="source-note">' + s.note + '</p>';
    el.sourceList.appendChild(li);
  });
}


/* ============================================================
   ส่วนที่ 6 : ปุ่มต่าง ๆ + เริ่มระบบ
   ============================================================ */

function handleCheck() {
  const text = el.cropSearch.value.trim();
  if (!text) { setNote('กรุณาพิมพ์ชื่อผักหรือผลไม้ก่อน', 'warn'); return; }

  const found = searchLocal(text);
  if (found.length > 0) {
    setNote('พบ ' + found.length + ' รายการ', 'ok');
    renderSuggestions(found);
    select(found[0].item, found[0].grade.id);
  } else {
    setNote('ไม่พบชื่อนี้ ลองพิมพ์สั้นลง เช่น "ผักบุ้ง" หรือกดเลือกจากรายการด้านล่าง', 'warn');
    renderSuggestions([]);
  }
}

/* ---------- ปุ่มช่วยการมองเห็น ---------- */
function setupA11y() {
  const html = document.documentElement;

  const savedScale = localStorage.getItem('ff-scale');
  const savedContrast = localStorage.getItem('ff-contrast');
  if (savedScale) html.setAttribute('data-scale', savedScale);
  if (savedContrast === 'high') {
    html.setAttribute('data-contrast', 'high');
    el.btnContrast.setAttribute('aria-pressed', 'true');
  }

  el.btnTextSize.addEventListener('click', function () {
    const next = (Number(html.getAttribute('data-scale')) % 3) + 1;
    html.setAttribute('data-scale', String(next));
    localStorage.setItem('ff-scale', String(next));
  });

  el.btnContrast.addEventListener('click', function () {
    const on = html.getAttribute('data-contrast') === 'high';
    html.setAttribute('data-contrast', on ? 'normal' : 'high');
    el.btnContrast.setAttribute('aria-pressed', on ? 'false' : 'true');
    localStorage.setItem('ff-contrast', on ? 'normal' : 'high');
  });
}

/* ---------- ฟีเจอร์ของเว็บแอป (PWA) ---------- */
function setupPWA() {
  const bar = document.getElementById('offlineBar');
  const btn = document.getElementById('btnInstall');

  // แจ้งเตือนเมื่อเน็ตหลุด — เกษตรกรอยู่ในสวน สัญญาณมักไม่ดี
  function syncOnline() {
    if (!bar) return;
    bar.classList.toggle('hidden', navigator.onLine);
    document.body.classList.toggle('is-offline', !navigator.onLine);
  }
  window.addEventListener('online', syncOnline);
  window.addEventListener('offline', syncOnline);
  syncOnline();

  /* ---- ปุ่มติดตั้งแอป (อยู่ล่างสุดของหน้า) ----
     เบราว์เซอร์แต่ละค่ายไม่เหมือนกัน:
       Android/Chrome/Edge -> ยิง event 'beforeinstallprompt' มาให้ กดปุ่มติดตั้งได้เลย
       iPhone/iPad Safari  -> ไม่มี event นี้ ต้องบอกวิธีกดเอง (Share -> Add to Home Screen)
       เปิดจากแอปที่ติดตั้งแล้ว -> ไม่ต้องแสดงอะไร                                */
  const hint = document.getElementById('installHint');
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
                (ua.indexOf('Mac') !== -1 && 'ontouchend' in document);   // iPad รุ่นใหม่แสดงตัวเป็น Mac
  const installed = window.matchMedia('(display-mode: standalone)').matches ||
                    navigator.standalone === true;

  let deferred = null;

  function showHint(html) { if (hint) hint.innerHTML = html; }

  if (installed) {
    showHint('<div class="hint-ok">ติดตั้งเรียบร้อยแล้ว — คุณกำลังใช้งานผ่านแอปอยู่</div>');
  } else if (isIOS) {
    showHint(
      '<div class="hint-steps"><strong>วิธีติดตั้งบน iPhone / iPad</strong>' +
      '<ol><li>กดปุ่ม <b>แชร์</b> (รูปสี่เหลี่ยมมีลูกศรขึ้น) ที่แถบล่างของ Safari</li>' +
      '<li>เลื่อนหา <b>เพิ่มไปยังหน้าจอโฮม</b> (Add to Home Screen)</li>' +
      '<li>กด <b>เพิ่ม</b> มุมขวาบน</li></ol></div>');
  } else {
    showHint('<div class="hint-wait">เปิดเว็บนี้บนมือถือเพื่อติดตั้งเป็นแอป ' +
             'หรือรอสักครู่ให้เบราว์เซอร์พร้อม แล้วปุ่มติดตั้งจะขึ้นมา</div>');
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    if (btn) btn.classList.remove('hidden');
    showHint('<div class="hint-ok">เครื่องนี้ติดตั้งได้ — กดปุ่มด้านบนได้เลย</div>');
  });

  if (btn) {
    btn.addEventListener('click', async function () {
      if (!deferred) return;
      deferred.prompt();
      const choice = await deferred.userChoice;
      deferred = null;
      btn.classList.add('hidden');
      showHint(choice && choice.outcome === 'accepted'
        ? '<div class="hint-ok">กำลังติดตั้ง — ดูไอคอนที่หน้าจอโฮมได้เลย</div>'
        : '<div class="hint-wait">ยกเลิกการติดตั้งแล้ว เปิดหน้านี้ใหม่ถ้าเปลี่ยนใจ</div>');
    });
  }

  window.addEventListener('appinstalled', function () {
    if (btn) btn.classList.add('hidden');
    showHint('<div class="hint-ok">ติดตั้งเรียบร้อยแล้ว</div>');
  });
}

async function init() {
  cacheElements();
  paintIcons();
  setupA11y();
  setupPWA();
  fillUnitOptions(el.unitSelect);
  renderSources();

  // แสดงรายการสินค้าทันที (ไม่ต้องรอเน็ต) แล้วค่อยเติมราคาจริงเมื่อโหลดเสร็จ
  renderProducts();

  await loadPrices();
  renderProducts();
  if (current) renderAnswer();

  // ผูกปุ่ม
  el.cropSearch.addEventListener('input', function () {
    const t = el.cropSearch.value.trim();
    if (!t) { el.suggestions.classList.add('hidden'); setNote(''); return; }
    renderSuggestions(searchLocal(t));
  });
  el.cropSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); handleCheck(); }
  });
  el.btnCheck.addEventListener('click', handleCheck);

  el.gradeSelect.addEventListener('change', function () {
    if (current) select(current.item, el.gradeSelect.value);
  });
  el.amount.addEventListener('input', function () { if (current) renderAnswer(); });
  el.unitSelect.addEventListener('change', function () { if (current) renderAnswer(); });

  el.btnHistory.addEventListener('click', function () {
    historyOpen = !historyOpen;
    const p = priceFor(current.name);
    if (p) renderHistoryButton(p);
    if (historyOpen) el.historyBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

document.addEventListener('DOMContentLoaded', init);
