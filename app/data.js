// Dompet Keluarga — data seed + state.
// Semua angka contoh realistis dan konsisten di seluruh halaman:
// pemasukan Rp8.500.000, pengeluaran Rp6.120.000, tabungan Rp1.200.000 per bulan.
// Total transaksi pengeluaran (25 transaksi, Nov 2026) = Rp6.120.000 persis.

const CATEGORIES = [
  { id: 'belanja',    name: 'Belanja Harian',     color: '#4f46e5', budget: 1600000 },
  { id: 'makan',      name: 'Makan & Minum',      color: '#f59e0b', budget: 1000000 },
  { id: 'transport',  name: 'Transportasi',       color: '#0ea5e9', budget: 800000 },
  { id: 'tagihan',    name: 'Tagihan & Utilitas', color: '#ef4444', budget: 1200000 },
  { id: 'pendidikan', name: 'Pendidikan',         color: '#10b981', budget: 900000 },
  { id: 'kesehatan',  name: 'Kesehatan',          color: '#ec4899', budget: 400000 },
  { id: 'hiburan',     name: 'Hiburan',            color: '#8b5cf6', budget: 500000 },
];

const SEED_TRANSACTIONS = [
  // Pemasukan — total Rp8.500.000
  { id: 't01', date: '2026-11-01', desc: 'Gaji bulanan',            cat: 'gaji',      type: 'income', amount: 7000000 },
  { id: 't02', date: '2026-11-15', desc: 'Usaha sampingan',         cat: 'usaha',     type: 'income', amount: 1000000 },
  { id: 't03', date: '2026-11-22', desc: 'Bonus dan pemasukan lain', cat: 'lainnya',   type: 'income', amount: 500000 },
  // Belanja Harian — total Rp1.500.000
  { id: 't04', date: '2026-11-02', desc: 'Pasar tradisional mingguan', cat: 'belanja', type: 'expense', amount: 285000 },
  { id: 't05', date: '2026-11-09', desc: 'Belanja pasar dan sembako',  cat: 'belanja', type: 'expense', amount: 310000 },
  { id: 't06', date: '2026-11-12', desc: 'Supermarket: beras dan minyak', cat: 'belanja', type: 'expense', amount: 425000 },
  { id: 't07', date: '2026-11-19', desc: 'Pasar mingguan',             cat: 'belanja', type: 'expense', amount: 240000 },
  { id: 't08', date: '2026-11-24', desc: 'Supermarket bulanan',       cat: 'belanja', type: 'expense', amount: 240000 },
  // Makan & Minum — total Rp1.080.000
  { id: 't09', date: '2026-11-03', desc: 'Makan siang keluarga',      cat: 'makan', type: 'expense', amount: 145000 },
  { id: 't10', date: '2026-11-07', desc: 'Warung makan malam',        cat: 'makan', type: 'expense', amount: 180000 },
  { id: 't11', date: '2026-11-14', desc: 'Makan di luar akhir pekan',  cat: 'makan', type: 'expense', amount: 220000 },
  { id: 't12', date: '2026-11-18', desc: 'Kopi dan camilan',          cat: 'makan', type: 'expense', amount: 175000 },
  { id: 't13', date: '2026-11-23', desc: 'Traktir keluarga besar',    cat: 'makan', type: 'expense', amount: 360000 },
  // Transportasi — total Rp770.000
  { id: 't14', date: '2026-11-01', desc: 'Bensin motor',              cat: 'transport', type: 'expense', amount: 150000 },
  { id: 't15', date: '2026-11-10', desc: 'Bensin mobil',              cat: 'transport', type: 'expense', amount: 280000 },
  { id: 't16', date: '2026-11-15', desc: 'Ojek online',               cat: 'transport', type: 'expense', amount: 140000 },
  { id: 't17', date: '2026-11-21', desc: 'Bensin dan parkir',         cat: 'transport', type: 'expense', amount: 200000 },
  // Tagihan & Utilitas — total Rp1.150.000
  { id: 't18', date: '2026-11-05', desc: 'Listrik PLN',               cat: 'tagihan', type: 'expense', amount: 420000 },
  { id: 't19', date: '2026-11-05', desc: 'Air PDAM',                  cat: 'tagihan', type: 'expense', amount: 185000 },
  { id: 't20', date: '2026-11-06', desc: 'Internet rumah',            cat: 'tagihan', type: 'expense', amount: 350000 },
  { id: 't21', date: '2026-11-10', desc: 'Pulsa dan paket data',      cat: 'tagihan', type: 'expense', amount: 195000 },
  // Pendidikan — total Rp850.000
  { id: 't22', date: '2026-11-04', desc: 'SPP anak',                  cat: 'pendidikan', type: 'expense', amount: 500000 },
  { id: 't23', date: '2026-11-11', desc: 'Buku dan alat tulis',       cat: 'pendidikan', type: 'expense', amount: 200000 },
  { id: 't24', date: '2026-11-17', desc: 'Les tambahan',              cat: 'pendidikan', type: 'expense', amount: 150000 },
  // Kesehatan — total Rp320.000
  { id: 't25', date: '2026-11-13', desc: 'Obat dan vitamin',          cat: 'kesehatan', type: 'expense', amount: 140000 },
  { id: 't26', date: '2026-11-20', desc: 'Periksa dokter gigi',       cat: 'kesehatan', type: 'expense', amount: 180000 },
  // Hiburan — total Rp450.000
  { id: 't27', date: '2026-11-08', desc: 'Langganan streaming',       cat: 'hiburan', type: 'expense', amount: 120000 },
  { id: 't28', date: '2026-11-16', desc: 'Nonton bioskop keluarga',   cat: 'hiburan', type: 'expense', amount: 330000 },
];

const SEED_GOALS = [
  { id: 'g1', name: 'Dana Darurat',     target: 25000000, saved: 14750000, note: 'Cadangan 3 bulan pengeluaran' },
  { id: 'g2', name: 'Liburan Keluarga', target: 8000000,  saved: 3200000,  note: 'Liburan akhir tahun' },
  { id: 'g3', name: 'Pendidikan Anak',  target: 12000000, saved: 5400000,  note: 'Biaya masuk sekolah tahun depan' },
  { id: 'g4', name: 'DP Rumah',         target: 60000000, saved: 9800000,  note: 'Target 3 tahun ke depan' },
];

const SEED_BILLS = [
  { name: 'SPP anak',        due: '2026-12-04', amount: 500000 },
  { name: 'Listrik PLN',     due: '2026-12-05', amount: 420000 },
  { name: 'Air PDAM',        due: '2026-12-05', amount: 185000 },
  { name: 'Internet rumah',  due: '2026-12-06', amount: 350000 },
];

// Tren 6 bulan terakhir (Jun–Nov 2026). Pemasukan tetap Rp8.500.000.
const SEED_TREND = [
  { month: 'Jun 2026', income: 8500000, expense: 5940000 },
  { month: 'Jul 2026', income: 8500000, expense: 6050000 },
  { month: 'Agu 2026', income: 8500000, expense: 5870000 },
  { month: 'Sep 2026', income: 8500000, expense: 6210000 },
  { month: 'Okt 2026', income: 8500000, expense: 6030000 },
  { month: 'Nov 2026', income: 8500000, expense: 6120000 },
];

const SEED_PROFILE = {
  familyName: 'Keluarga Ramadhan',
  members: ['Ayah', 'Ibu', 'Anak 1', 'Anak 2'],
  activeMonth: '2026-11',
  monthlySaving: 1200000,
};

const STORAGE_KEY = 'dompet-keluarga-v1';

function seedState() {
  return {
    profile: JSON.parse(JSON.stringify(SEED_PROFILE)),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    transactions: JSON.parse(JSON.stringify(SEED_TRANSACTIONS)),
    goals: JSON.parse(JSON.stringify(SEED_GOALS)),
    bills: JSON.parse(JSON.stringify(SEED_BILLS)),
    trend: JSON.parse(JSON.stringify(SEED_TREND)),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && parsed.profile) return parsed;
    }
  } catch (e) { /* data rusak: kembali ke seed */ }
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* penyimpanan penuh */ }
}

function resetState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

// ---- helpers ----
function fmt(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}

function catName(id) {
  if (id === 'gaji') return 'Gaji';
  if (id === 'usaha') return 'Usaha Sampingan';
  if (id === 'lainnya') return 'Lainnya';
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : id;
}

function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#64748b';
}

function monthTx(state, month) {
  return state.transactions.filter((t) => t.date.slice(0, 7) === month);
}

function totalsFor(state, month) {
  const tx = monthTx(state, month);
  let income = 0, expense = 0;
  const byCat = {};
  for (const t of tx) {
    if (t.type === 'income') income += t.amount;
    else {
      expense += t.amount;
      byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
    }
  }
  return { income, expense, balance: income - expense, byCat };
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return d + ' ' + names[m - 1] + ' ' + y;
}
