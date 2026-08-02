/* ============================================================
   catalog.js — รายชื่อสินค้าเกษตร (สำรองไว้ใช้ตอนออฟไลน์)
   ------------------------------------------------------------
   ไฟล์นี้ "สร้างอัตโนมัติ" จาก MOC Open Data API
     GET https://dataapi.moc.go.th/gis-products?sell_type=wholesale
   ดึงเมื่อ: 2026-08-02
   กรองเฉพาะหมวด "ผักสด" และ "ผลไม้" และเฉพาะราคาขายส่ง (รหัสขึ้นต้น W)

   ตอนเปิดเว็บ ระบบจะพยายามดึงรายชื่อสด ๆ จาก MOC ก่อนเสมอ
   ถ้าดึงไม่ได้ (เน็ตล่ม / API ล่ม) จึงค่อยใช้รายชื่อในไฟล์นี้แทน

   product_id ทุกตัวเป็นรหัสจริงของกระทรวงพาณิชย์ ตรวจสอบย้อนกลับได้
   ============================================================ */

const CATALOG_META = {
  source: 'MOC Open Data — https://dataapi.moc.go.th/gis-products',
  fetchedAt: "2026-08-02",
  itemCount: 86,
  gradeCount: 161,
};

const FALLBACK_CATALOG = [
  {
    name: "กล้วยไข่",
    category: "ผลไม้",
    grades: [
    { id: "P14008", grade: "ใหญ่", sellType: "ขายปลีก" },
    { id: "P14009", grade: "กลาง", sellType: "ขายปลีก" },
    { id: "W14010", grade: "ใหญ่", sellType: "ขายส่ง" },
    { id: "W14011", grade: "กลาง", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "กล้วยน้ำว้า",
    category: "ผลไม้",
    grades: [
    { id: "P14007", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14009", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "กล้วยหอมทอง",
    category: "ผลไม้",
    grades: [
    { id: "P14006", grade: "ใหญ่", sellType: "ขายปลีก" },
    { id: "P14034", grade: "ใหญ่ (14 ผล)", sellType: "ขายปลีก" },
    { id: "W14008", grade: "ใหญ่", sellType: "ขายส่ง" },
    { id: "W14034", grade: "ใหญ่ (14 ผล)", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "เงาะโรงเรียน",
    category: "ผลไม้",
    grades: [
    { id: "P14016", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14019", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "แตงโม พันธุ์กินรี",
    category: "ผลไม้",
    grades: [
    { id: "P14005", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14007", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ทุเรียนชะนี",
    category: "ผลไม้",
    grades: [
    { id: "P14019", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14020", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ทุเรียนหมอนทอง",
    category: "ผลไม้",
    grades: [
    { id: "P14020", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14021", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "น้อยหน่า",
    category: "ผลไม้",
    grades: [
    { id: "P14029", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14031", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ฝรั่งกิมจู",
    category: "ผลไม้",
    grades: [
    { id: "P14010", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14012", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ฝรั่งกิมจู คัด",
    category: "ผลไม้",
    grades: [
    { id: "P14011", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14013", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะม่วงเขียวเสวย",
    category: "ผลไม้",
    grades: [
    { id: "P14014", grade: "เบอร์ 0", sellType: "ขายปลีก" },
    { id: "P14015", grade: "เบอร์ 1", sellType: "ขายปลีก" },
    { id: "W14026", grade: "เบอร์ 0", sellType: "ขายส่ง" },
    { id: "W14027", grade: "เบอร์ 1", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะม่วงน้ำดอกไม้",
    category: "ผลไม้",
    grades: [
    { id: "P14012", grade: "เบอร์ 0", sellType: "ขายปลีก" },
    { id: "P14013", grade: "เบอร์ 1", sellType: "ขายปลีก" },
    { id: "W14024", grade: "เบอร์ 0", sellType: "ขายส่ง" },
    { id: "W14025", grade: "เบอร์ 1", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะละกอแขกดำ",
    category: "ผลไม้",
    grades: [
    { id: "P14004", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14006", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะละกอฮอลแลนด์",
    category: "ผลไม้",
    grades: [
    { id: "P14033", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14033", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มังคุด (ผิวกระ)",
    category: "ผลไม้",
    grades: [
    { id: "P14018", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14023", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มังคุด (ผิวมัน)",
    category: "ผลไม้",
    grades: [
    { id: "P14017", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14022", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ลองกอง",
    category: "ผลไม้",
    grades: [
    { id: "P14021", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14030", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ลำไย อีดอ",
    category: "ผลไม้",
    grades: [
    { id: "P14030", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14032", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ลิ้นจี่ พันธุ์จักรพรรดิ์",
    category: "ผลไม้",
    grades: [
    { id: "P14023", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14029", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ลิ้นจี่ พันธุ์ฮงฮวย",
    category: "ผลไม้",
    grades: [
    { id: "P14022", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14028", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ส้มเขียวหวาน สายน้ำผึ้ง",
    category: "ผลไม้",
    grades: [
    { id: "P14001", grade: "เบอร์ 4", sellType: "ขายปลีก" },
    { id: "P14002", grade: "เบอร์ 5", sellType: "ขายปลีก" },
    { id: "P14003", grade: "เบอร์ 6", sellType: "ขายปลีก" },
    { id: "W14001", grade: "เบอร์ 4", sellType: "ขายส่ง" },
    { id: "W14002", grade: "เบอร์ 5", sellType: "ขายส่ง" },
    { id: "W14003", grade: "เบอร์ 6", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ส้มโอ ขาวทองดี",
    category: "ผลไม้",
    grades: [
    { id: "P14024", grade: "ใหญ่", sellType: "ขายปลีก" },
    { id: "P14025", grade: "เล็ก", sellType: "ขายปลีก" },
    { id: "W14004", grade: "ใหญ่", sellType: "ขายส่ง" },
    { id: "W14005", grade: "เล็ก", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ส้มโอ ขาวน้ำผึ้ง",
    category: "ผลไม้",
    grades: [
    { id: "P14035", grade: "ใหญ่", sellType: "ขายปลีก" },
    { id: "P14036", grade: "เล็ก", sellType: "ขายปลีก" },
    { id: "W14035", grade: "ใหญ่", sellType: "ขายส่ง" },
    { id: "W14036", grade: "เล็ก", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "สับปะรด ศรีราชา",
    category: "ผลไม้",
    grades: [
    { id: "P14026", grade: "เบอร์ 1", sellType: "ขายปลีก" },
    { id: "P14027", grade: "เบอร์ 2", sellType: "ขายปลีก" },
    { id: "P14028", grade: "เบอร์ 3", sellType: "ขายปลีก" },
    { id: "W14014", grade: "เบอร์ 1", sellType: "ขายส่ง" },
    { id: "W14015", grade: "เบอร์ 2", sellType: "ขายส่ง" },
    { id: "W14016", grade: "เบอร์ 3", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "องุ่นพันธุ์ไวท์มะละกา",
    category: "ผลไม้",
    grades: [
    { id: "P14032", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14018", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "องุ่นพันธุ์ไวท์มะละกา คัด",
    category: "ผลไม้",
    grades: [
    { id: "P14031", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W14017", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "กระชายขาว",
    category: "ผักสด",
    grades: [
    { id: "P13059", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13029", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "กะหล่ำดอก",
    category: "ผักสด",
    grades: [
    { id: "P13013", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13007", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "กะหล่ำดอก คัด",
    category: "ผักสด",
    grades: [
    { id: "P13014", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "กะหล่ำปลี",
    category: "ผักสด",
    grades: [
    { id: "P13011", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13006", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "กะหล่ำปลี คัด",
    category: "ผักสด",
    grades: [
    { id: "P13012", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ข้าวโพดฝักอ่อน",
    category: "ผักสด",
    grades: [
    { id: "P13032", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13017", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ขิงแก่",
    category: "ผักสด",
    grades: [
    { id: "P13046", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13028", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ขิง อ่อน",
    category: "ผักสด",
    grades: [
    { id: "P13045", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ขิงอ่อน",
    category: "ผักสด",
    grades: [
    { id: "W13027", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ขึ้นฉ่าย",
    category: "ผักสด",
    grades: [
    { id: "P13039", grade: "คละ (บาท/ขีด)", sellType: "ขายปลีก" },
    { id: "P13088", grade: "คละ (บาท/กก.)", sellType: "ขายปลีก" },
    { id: "W13022", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ขึ้นฉ่าย คัด (บาท/กก.)",
    category: "ผักสด",
    grades: [
    { id: "P13089", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ขึ้นฉ่าย คัด (บาท/ขีด)",
    category: "ผักสด",
    grades: [
    { id: "P13040", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ต้นหอม",
    category: "ผักสด",
    grades: [
    { id: "P13035", grade: "คละ (บาท/ขีด)", sellType: "ขายปลีก" },
    { id: "P13084", grade: "คละ (บาท/กก.)", sellType: "ขายปลีก" },
    { id: "W13019", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ต้นหอม คัด (บาท/กก.)",
    category: "ผักสด",
    grades: [
    { id: "P13085", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ต้นหอม คัด (บาท/ขีด)",
    category: "ผักสด",
    grades: [
    { id: "P13036", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "แตงกวา",
    category: "ผักสด",
    grades: [
    { id: "P13024", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13013", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "แตงกวา คัด",
    category: "ผักสด",
    grades: [
    { id: "P13025", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ถั่วฝักยาว",
    category: "ผักสด",
    grades: [
    { id: "P13022", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13012", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ถั่วฝักยาว คัด",
    category: "ผักสด",
    grades: [
    { id: "P13023", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักกวางตุ้ง",
    category: "ผักสด",
    grades: [
    { id: "P13005", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13003", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักกวางตุ้ง คัด",
    category: "ผักสด",
    grades: [
    { id: "P13006", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักกะเฉด",
    category: "ผักสด",
    grades: [
    { id: "P13041", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักกะเฉด 1 กำ",
    category: "ผักสด",
    grades: [
    { id: "W13023", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักกาดขาว (ลุ้ย)",
    category: "ผักสด",
    grades: [
    { id: "P13009", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13005", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักกาดขาว (ลุ้ย) คัด",
    category: "ผักสด",
    grades: [
    { id: "P13010", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักกาดหอม",
    category: "ผักสด",
    grades: [
    { id: "P13007", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13004", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักกาดหอม คัด",
    category: "ผักสด",
    grades: [
    { id: "P13008", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักคะน้า",
    category: "ผักสด",
    grades: [
    { id: "P13001", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13001", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักคะน้า คัด",
    category: "ผักสด",
    grades: [
    { id: "P13002", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักชี",
    category: "ผักสด",
    grades: [
    { id: "P13033", grade: "คละ (บาท/ขีด)", sellType: "ขายปลีก" },
    { id: "P13082", grade: "คละ (บาท/กก.)", sellType: "ขายปลีก" },
    { id: "W13018", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักชี คัด (บาท/กก.)",
    category: "ผักสด",
    grades: [
    { id: "P13083", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักชี คัด (บาท/ขีด)",
    category: "ผักสด",
    grades: [
    { id: "P13034", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักบุ้งจีน",
    category: "ผักสด",
    grades: [
    { id: "P13003", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13002", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ผักบุ้งจีน คัด",
    category: "ผักสด",
    grades: [
    { id: "P13004", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักบุ้งไทย",
    category: "ผักสด",
    grades: [
    { id: "P13042", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักบุ้งไทย (10 กำ)",
    category: "ผักสด",
    grades: [
    { id: "P13090", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ผักบุ้งไทย 10 กำ",
    category: "ผักสด",
    grades: [
    { id: "W13024", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "พริกขี้หนูจินดา (แดง)",
    category: "ผักสด",
    grades: [
    { id: "W13021", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "พริกขี้หนูจินดา (แดง) (บาท/กก.)",
    category: "ผักสด",
    grades: [
    { id: "P13087", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "พริกขี้หนูจินดา (แดง) (บาท/ขีด)",
    category: "ผักสด",
    grades: [
    { id: "P13038", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "พริกขี้หนูสวน (เม็ดกลาง)",
    category: "ผักสด",
    grades: [
    { id: "P13091", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13030", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "พริกสดชี้ฟ้า (แดง)",
    category: "ผักสด",
    grades: [
    { id: "W13020", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "พริกสดชี้ฟ้า (แดง) (บาท/กก.)",
    category: "ผักสด",
    grades: [
    { id: "P13086", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "พริกสดชี้ฟ้า (บาท/ขีด)",
    category: "ผักสด",
    grades: [
    { id: "P13037", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "ฟักเขียว",
    category: "ผักสด",
    grades: [
    { id: "P13026", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13014", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "ฟักเขียว คัด",
    category: "ผักสด",
    grades: [
    { id: "P13027", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "มะเขือเจ้าพระยา",
    category: "ผักสด",
    grades: [
    { id: "P13021", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13011", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะเขือเทศผลใหญ่",
    category: "ผักสด",
    grades: [
    { id: "P13019", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13010", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะเขือเทศผลใหญ่ คัด",
    category: "ผักสด",
    grades: [
    { id: "P13020", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "มะเขือเทศสีดา",
    category: "ผักสด",
    grades: [
    { id: "P13017", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13009", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะเขือเทศสีดา คัด",
    category: "ผักสด",
    grades: [
    { id: "P13018", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "มะนาว",
    category: "ผักสด",
    grades: [
    { id: "P13043", grade: "เบอร์ 1-2", sellType: "ขายปลีก" },
    { id: "P13044", grade: "เบอร์ 3-4", sellType: "ขายปลีก" },
    { id: "W13025", grade: "เบอร์ 1-2", sellType: "ขายส่ง" },
    { id: "W13026", grade: "เบอร์ 3-4", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะระจีน",
    category: "ผักสด",
    grades: [
    { id: "P13015", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13008", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "มะระจีน คัด",
    category: "ผักสด",
    grades: [
    { id: "P13016", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "มะละกอ (พันธุ์แขกดำดำเนิน)",
    category: "ผักสด",
    grades: [
    { id: "P13092", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "มะละกอ พันธุ์แขกดำดำเนิน",
    category: "ผักสด",
    grades: [
    { id: "W13031", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "หน่อไม้ฝรั่ง",
    category: "ผักสด",
    grades: [
    { id: "P13030", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13016", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "หน่อไม้ฝรั่ง คัด",
    category: "ผักสด",
    grades: [
    { id: "P13031", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
  {
    name: "หัวผักกาด",
    category: "ผักสด",
    grades: [
    { id: "P13028", grade: "คละ", sellType: "ขายปลีก" },
    { id: "W13015", grade: "คละ", sellType: "ขายส่ง" },
    ],
  },
  {
    name: "หัวผักกาด คัด",
    category: "ผักสด",
    grades: [
    { id: "P13029", grade: "คละ", sellType: "ขายปลีก" },
    ],
  },
];
