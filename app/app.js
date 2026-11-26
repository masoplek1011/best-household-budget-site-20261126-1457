// Dompet Keluarga — router hash + rendering semua halaman + interaksi.
// Semua kontrol berfungsi: tambah/ubah/hapus transaksi, ubah anggaran,
// tambah dana tabungan, ekspor CSV, ubah profil, reset data.

let state = loadState();

const ROUTES = [
  { hash: '#/',          name: 'Beranda',    render: renderHome },
  { hash: '#/anggaran',  name: 'Anggaran',   render: renderBudget },
  { hash: '#/transaksi', name: 'Transaksi',  render: renderTransactions },
  { hash: '#/tabungan',  name: 'Tabungan',   render: renderGoals },
  { hash: '#/laporan',   name: 'Laporan',    render: renderReport },
  { hash: '#/pengaturan', name: 'Pengaturan', render: renderSettings },
];

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return MONTH_NAMES[m - 1] + ' ' + y;
}

function navHtml(active) {
  return '<header class="topbar"><div class="wrap topbar-in">' +
    '<a class="brand" href="#/">Dompet<span> Keluarga</span></a>' +
    '<nav class="nav">' + ROUTES.map((r) =>
      '<a href="' + r.hash + '"' + (r.hash === active ? ' class="active" aria-current="page"' : '') + '>' + r.name + '</a>'
    ).join('') + '</nav></div></header>';
}

function footerHtml() {
  return '<footer class="footer"><div class="wrap"><p>Dompet Keluarga — situs anggaran rumah tangga. Semua data tersimpan di perangkat Anda (localStorage), tanpa akun, tanpa iklan, tanpa pelacakan.</p></div></footer>';
}

function render() {
  const hash = location.hash || '#/';
  const route = ROUTES.find((r) => r.hash === hash) || ROUTES[0];
  const view = document.getElementById('view');
  view.innerHTML = route.render();
  document.title = 'Dompet Keluarga — ' + route.name;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

// ---------- Beranda ----------
function renderHome() {
  const m = state.profile.activeMonth;
  const t = totalsFor(state, m);
  const saving = state.profile.monthlySaving;
  const recent = monthTx(state, m).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const segs = CATEGORIES.map((c) => ({ label: c.name, value: t.byCat[c.id] || 0, color: c.color })).filter((s) => s.value > 0);
  const budgetRows = CATEGORIES.map((c) => {
    const actual = t.byCat[c.id] || 0;
    const b = state.budgets[c.id];
    const pct = b > 0 ? (actual / b) * 100 : 0;
    const over = actual > b;
    return '<div class="budget-row"><div class="budget-head"><span><span class="dot" style="background:' + c.color + '"></span>' + c.name +
      '</span><span>' + fmt(actual) + ' / ' + fmt(b) + '</span></div>' + progressBar(pct, over ? '#ef4444' : c.color) +
      '<div class="budget-note">' + (over ? 'Lewat anggaran ' + fmt(actual - b) : 'Sisa ' + fmt(b - actual)) + '</div></div>';
  }).join('');

  return navHtml('#/') + '<main class="wrap">' +
    '<section class="hero"><h1>Anggaran ' + monthLabel(m) + '</h1><p class="lead">Halo, ' + esc(state.profile.familyName) +
    ' — ini ringkasan keuangan keluarga bulan ini. Pemasukan ' + fmt(t.income) + ', pengeluaran ' + fmt(t.expense) +
    ', sisa ' + fmt(t.balance) + '.</p></section>' +
    '<section class="kpis">' +
    '<div class="kpi"><div class="kpi-label">Pemasukan</div><div class="kpi-value income">' + fmt(t.income) + '</div><div class="kpi-sub">Gaji + usaha sampingan</div></div>' +
    '<div class="kpi"><div class="kpi-label">Pengeluaran</div><div class="kpi-value expense">' + fmt(t.expense) + '</div><div class="kpi-sub">' + Math.round((t.expense / t.income) * 100) + '% dari pemasukan</div></div>' +
    '<div class="kpi"><div class="kpi-label">Sisa / Saldo</div><div class="kpi-value">' + fmt(t.balance) + '</div><div class="kpi-sub">Setelah semua pengeluaran</div></div>' +
    '<div class="kpi"><div class="kpi-label">Tabungan bulan ini</div><div class="kpi-value saving">' + fmt(saving) + '</div><div class="kpi-sub">' + Math.round((saving / t.income) * 100) + '% dari pemasukan</div></div>' +
    '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Pengeluaran per kategori</h2>' + donutChart(segs, 220) +
    '<ul class="legend">' + segs.map((s) => '<li><span class="dot" style="background:' + s.color + '"></span>' + s.label +
      '<strong>' + fmt(s.value) + '</strong><span class="pct">' + Math.round((s.value / t.expense) * 100) + '%</span></li>').join('') + '</ul></div>' +
    '<div class="card"><h2>Anggaran bulan ini</h2>' + budgetRows +
    '<p class="card-link"><a href="#/anggaran">Atur anggaran &rarr;</a></p></div>' +
    '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Transaksi terbaru</h2><ul class="tx-list">' +
    recent.map((tx) => '<li><div><strong>' + esc(tx.desc) + '</strong><span class="muted">' + fmtDate(tx.date) + ' &middot; ' + catName(tx.cat) + '</span></div>' +
      '<span class="' + (tx.type === 'income' ? 'income' : 'expense') + '">' + (tx.type === 'income' ? '+' : '&minus;') + fmt(tx.amount) + '</span></li>').join('') +
    '</ul><p class="card-link"><a href="#/transaksi">Lihat semua transaksi &rarr;</a></p></div>' +
    '<div class="card"><h2>Tagihan jatuh tempo</h2><ul class="tx-list">' +
    state.bills.map((b) => '<li><div><strong>' + esc(b.name) + '</strong><span class="muted">Jatuh tempo ' + fmtDate(b.due) + '</span></div><span>' + fmt(b.amount) + '</span></li>').join('') +
    '</ul><p class="muted small">Total tagihan Desember: ' + fmt(state.bills.reduce((s, b) => s + b.amount, 0)) + '</p></div>' +
    '</section></main>' + footerHtml();
}

// ---------- Anggaran ----------
function renderBudget() {
  const m = state.profile.activeMonth;
  const t = totalsFor(state, m);
  const totalBudget = CATEGORIES.reduce((s, c) => s + state.budgets[c.id], 0);
  const rows = CATEGORIES.map((c) => {
    const actual = t.byCat[c.id] || 0;
    const b = state.budgets[c.id];
    const pct = b > 0 ? (actual / b) * 100 : 0;
    const over = actual > b;
    return '<tr><td><span class="dot" style="background:' + c.color + '"></span> ' + c.name + '</td>' +
      '<td>' + fmt(actual) + '</td>' +
      '<td><label class="sr" for="b-' + c.id + '">Anggaran ' + c.name + '</label>' +
      '<input id="b-' + c.id + '" type="number" min="0" step="10000" value="' + b + '" data-cat="' + c.id + '" class="budget-input" />' +
      '<button class="btn small" data-save-budget="' + c.id + '">Simpan</button></td>' +
      '<td>' + progressBar(pct, over ? '#ef4444' : c.color) + '<span class="muted small">' + pct.toFixed(0) + '%</span></td>' +
      '<td class="' + (over ? 'expense' : 'income') + '">' + (over ? 'Lewat ' + fmt(actual - b) : 'Sisa ' + fmt(b - actual)) + '</td></tr>';
  }).join('');

  return navHtml('#/anggaran') + '<main class="wrap">' +
    '<section class="hero"><h1>Anggaran Bulanan</h1><p class="lead">Batas belanja tiap kategori untuk ' + monthLabel(m) +
    '. Total anggaran ' + fmt(totalBudget) + ' dari pemasukan ' + fmt(t.income) + ' — pengeluaran sejauh ini ' + fmt(t.expense) +
    ' (' + Math.round((t.expense / totalBudget) * 100) + '% dari anggaran).</p></section>' +
    '<div class="card"><div class="table-wrap"><table class="tbl"><thead><tr><th>Kategori</th><th>Terpakai</th><th>Anggaran</th><th>Progress</th><th>Status</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>' +
    '<p class="muted small">Ubah angka anggaran lalu tekan Simpan — perubahan langsung tersimpan di perangkat Anda dan tercermin di Beranda.</p></div>' +
    '</main>' + footerHtml();
}

// ---------- Transaksi ----------
let txFilter = { month: '2026-11', cat: 'all', q: '' };

function renderTransactions() {
  const cats = CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.name + '</option>').join('');
  const months = [...new Set(state.transactions.map((t) => t.date.slice(0, 7)))].sort().reverse();
  const monthOpts = months.map((mo) => '<option value="' + mo + '"' + (mo === txFilter.month ? ' selected' : '') + '>' + monthLabel(mo) + '</option>').join('');
  let list = state.transactions.filter((t) => t.date.slice(0, 7) === txFilter.month);
  if (txFilter.cat !== 'all') list = list.filter((t) => t.cat === txFilter.cat);
  if (txFilter.q) list = list.filter((t) => t.desc.toLowerCase().includes(txFilter.q.toLowerCase()));
  list = list.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const inc = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return navHtml('#/transaksi') + '<main class="wrap">' +
    '<section class="hero"><h1>Transaksi</h1><p class="lead">Semua pemasukan dan pengeluaran keluarga. Menampilkan ' + list.length +
    ' transaksi — pemasukan ' + fmt(inc) + ', pengeluaran ' + fmt(exp) + '.</p></section>' +
    '<div class="card"><div class="filters">' +
    '<label>Bulan <select id="f-month">' + monthOpts + '</select></label>' +
    '<label>Kategori <select id="f-cat"><option value="all">Semua kategori</option>' + cats +
    '<option value="gaji">Gaji</option><option value="usaha">Usaha Sampingan</option><option value="lainnya">Lainnya</option></select></label>' +
    '<label>Cari <input id="f-q" type="search" placeholder="cth: pasar, listrik…" value="' + esc(txFilter.q) + '" /></label>' +
    '<button class="btn primary" id="btn-add-tx">+ Tambah Transaksi</button>' +
    '</div>' +
    '<div class="table-wrap"><table class="tbl"><thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th>Tipe</th><th>Jumlah</th><th>Aksi</th></tr></thead><tbody>' +
    (list.length ? list.map((t) => '<tr><td>' + fmtDate(t.date) + '</td><td>' + esc(t.desc) + '</td><td>' + catName(t.cat) + '</td>' +
      '<td class="' + (t.type === 'income' ? 'income' : 'expense') + '">' + (t.type === 'income' ? 'Pemasukan' : 'Pengeluaran') + '</td>' +
      '<td>' + (t.type === 'income' ? '+' : '&minus;') + fmt(t.amount) + '</td>' +
      '<td><button class="btn small" data-edit-tx="' + t.id + '">Ubah</button> <button class="btn small danger" data-del-tx="' + t.id + '">Hapus</button></td></tr>').join('') :
      '<tr><td colspan="6" class="muted">Tidak ada transaksi yang cocok dengan filter.</td></tr>') +
    '</tbody></table></div></div></main>' + footerHtml() + modalHtml();
}

function modalHtml() {
  const cats = CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.name + '</option>').join('');
  return '<div class="modal" id="tx-modal" hidden><div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
    '<h2 id="modal-title">Tambah Transaksi</h2>' +
    '<form id="tx-form">' +
    '<input type="hidden" id="tx-id" />' +
    '<label>Tanggal <input id="tx-date" type="date" value="2026-11-26" required /></label>' +
    '<label>Deskripsi <input id="tx-desc" type="text" maxlength="80" placeholder="cth: Belanja pasar" required /></label>' +
    '<label>Kategori <select id="tx-cat">' + cats + '<option value="gaji">Gaji</option><option value="usaha">Usaha Sampingan</option><option value="lainnya">Lainnya</option></select></label>' +
    '<label>Tipe <select id="tx-type"><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label>' +
    '<label>Jumlah (Rp) <input id="tx-amount" type="number" min="1000" step="1000" placeholder="100000" required /></label>' +
    '<div class="modal-actions"><button type="button" class="btn" id="tx-cancel">Batal</button><button type="submit" class="btn primary">Simpan</button></div>' +
    '</form></div></div>';
}

// ---------- Tabungan ----------
function renderGoals() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const cards = state.goals.map((g) => {
    const pct = (g.saved / g.target) * 100;
    return '<div class="card goal"><h2>' + esc(g.name) + '</h2><p class="muted">' + esc(g.note) + '</p>' +
      '<div class="goal-nums"><strong>' + fmt(g.saved) + '</strong><span> dari ' + fmt(g.target) + '</span></div>' +
      progressBar(pct, '#f59e0b') + '<div class="goal-meta"><span>' + pct.toFixed(1) + '% tercapai</span><span>Sisa ' + fmt(g.target - g.saved) + '</span></div>' +
      '<form class="add-funds" data-goal="' + g.id + '"><label class="sr" for="fund-' + g.id + '">Tambah dana ' + esc(g.name) + '</label>' +
      '<input id="fund-' + g.id + '" type="number" min="10000" step="10000" placeholder="Tambah dana (Rp)" required />' +
      '<button class="btn primary small" type="submit">+ Tambah Dana</button></form></div>';
  }).join('');

  return navHtml('#/tabungan') + '<main class="wrap">' +
    '<section class="hero"><h1>Target Tabungan</h1><p class="lead">Total tabungan keluarga ' + fmt(totalSaved) + ' dari target ' +
    fmt(totalTarget) + ' (' + Math.round((totalSaved / totalTarget) * 100) + '%). Tabungan bulan ini ' + fmt(state.profile.monthlySaving) +
    ' disisihkan dari pemasukan ' + fmt(totalsFor(state, state.profile.activeMonth).income) + '.</p></section>' +
    '<div class="grid-2">' + cards + '</div></main>' + footerHtml();
}

// ---------- Laporan ----------
function renderReport() {
  const m = state.profile.activeMonth;
  const t = totalsFor(state, m);
  const rows = state.trend.map((r) => ({ label: r.month.split(' ')[0], income: r.income, expense: r.expense }));
  const surplusRows = state.trend.map((r) =>
    '<tr><td>' + r.month + '</td><td>' + fmt(r.income) + '</td><td>' + fmt(r.expense) + '</td><td class="income">' + fmt(r.income - r.expense) + '</td></tr>').join('');
  const catRows = CATEGORIES.map((c) => {
    const v = t.byCat[c.id] || 0;
    return '<tr><td><span class="dot" style="background:' + c.color + '"></span> ' + c.name + '</td><td>' + fmt(v) + '</td><td>' + Math.round((v / t.expense) * 100) + '%</td></tr>';
  }).join('');

  return navHtml('#/laporan') + '<main class="wrap">' +
    '<section class="hero"><h1>Laporan Keuangan</h1><p class="lead">Tren 6 bulan terakhir. Rata-rata pengeluaran ' +
    fmt(Math.round(state.trend.reduce((s, r) => s + r.expense, 0) / state.trend.length)) +
    ' per bulan; surplus rata-rata ' + fmt(Math.round(state.trend.reduce((s, r) => s + (r.income - r.expense), 0) / state.trend.length)) + '.</p></section>' +
    '<div class="card"><h2>Tren pemasukan vs pengeluaran</h2>' + barChart(rows) +
    '<p class="legend-inline"><span class="dot" style="background:#4f46e5"></span> Pemasukan &nbsp; <span class="dot" style="background:#f59e0b"></span> Pengeluaran</p></div>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Surplus bulanan</h2><div class="table-wrap"><table class="tbl"><thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Surplus</th></tr></thead><tbody>' +
    surplusRows + '</tbody></table></div>' +
    '<p><button class="btn primary" id="btn-csv">Unduh CSV transaksi ' + monthLabel(m) + '</button></p></div>' +
    '<div class="card"><h2>Rincian kategori — ' + monthLabel(m) + '</h2><div class="table-wrap"><table class="tbl"><thead><tr><th>Kategori</th><th>Jumlah</th><th>Porsi</th></tr></thead><tbody>' +
    catRows + '</tbody></table></div>' +
    '<p class="muted small">Total pengeluaran ' + fmt(t.expense) + ' &middot; sisa ' + fmt(t.balance) + ' &middot; tabungan ' + fmt(state.profile.monthlySaving) + '.</p></div>' +
    '</section></main>' + footerHtml();
}

// ---------- Pengaturan ----------
function renderSettings() {
  return navHtml('#/pengaturan') + '<main class="wrap">' +
    '<section class="hero"><h1>Pengaturan</h1><p class="lead">Profil keluarga dan data aplikasi.</p></section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Profil keluarga</h2><form id="profile-form">' +
    '<label>Nama keluarga <input id="pf-name" type="text" maxlength="60" value="' + esc(state.profile.familyName) + '" required /></label>' +
    '<label>Anggota keluarga (pisahkan dengan koma) <input id="pf-members" type="text" value="' + esc(state.profile.members.join(', ')) + '" /></label>' +
    '<label>Tabungan bulanan (Rp) <input id="pf-saving" type="number" min="0" step="10000" value="' + state.profile.monthlySaving + '" required /></label>' +
    '<label>Bulan aktif <input id="pf-month" type="month" value="' + state.profile.activeMonth + '" required /></label>' +
    '<button class="btn primary" type="submit">Simpan Profil</button></form></div>' +
    '<div class="card"><h2>Data &amp; privasi</h2>' +
    '<p>Semua data anggaran, transaksi, dan target tabungan tersimpan <strong>hanya di perangkat Anda</strong> (localStorage browser). Situs ini tidak mengirim data ke server mana pun, tidak memakai cookie, dan tidak memuat apa pun dari internet.</p>' +
    '<p class="muted">Jumlah transaksi tersimpan: ' + state.transactions.length + ' &middot; target tabungan: ' + state.goals.length + '</p>' +
    '<p><button class="btn danger" id="btn-reset">Reset ke data contoh</button></p>' +
    '<h2>Tentang</h2><p class="muted">Dompet Keluarga v1.0 — situs anggaran rumah tangga statis. Dibuat untuk keluarga yang ingin tahu ke mana perginya setiap rupiah, tanpa aplikasi berat dan tanpa akun.</p></div>' +
    '</section></main>' + footerHtml();
}

// ---------- Event handling (delegasi di #view) ----------
document.addEventListener('click', (e) => {
  const saveBtn = e.target.closest('[data-save-budget]');
  if (saveBtn) {
    const cat = saveBtn.getAttribute('data-save-budget');
    const input = document.getElementById('b-' + cat);
    const val = Number(input.value);
    if (Number.isFinite(val) && val >= 0) {
      state.budgets[cat] = val;
      saveState(state);
      render();
    }
    return;
  }
  const editBtn = e.target.closest('[data-edit-tx]');
  if (editBtn) {
    const tx = state.transactions.find((x) => x.id === editBtn.getAttribute('data-edit-tx'));
    if (tx) openTxModal(tx);
    return;
  }
  const delBtn = e.target.closest('[data-del-tx]');
  if (delBtn) {
    const id = delBtn.getAttribute('data-del-tx');
    const tx = state.transactions.find((x) => x.id === id);
    if (tx && confirm('Hapus transaksi "' + tx.desc + '" (' + fmt(tx.amount) + ')?')) {
      state.transactions = state.transactions.filter((x) => x.id !== id);
      saveState(state);
      render();
    }
    return;
  }
  if (e.target.id === 'btn-add-tx') { openTxModal(null); return; }
  if (e.target.id === 'tx-cancel') { closeTxModal(); return; }
  if (e.target.id === 'btn-csv') { downloadCsv(); return; }
  if (e.target.id === 'btn-reset') {
    if (confirm('Reset semua data ke data contoh awal? Perubahan Anda akan hilang.')) {
      state = resetState();
      txFilter = { month: '2026-11', cat: 'all', q: '' };
      render();
    }
    return;
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'f-month') { txFilter.month = e.target.value; render(); }
  if (e.target.id === 'f-cat') { txFilter.cat = e.target.value; render(); }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'f-q') {
    txFilter.q = e.target.value;
    // re-render tabel saja tanpa kehilangan fokus: debounce ringan
    clearTimeout(window.__qTimer);
    window.__qTimer = setTimeout(render, 350);
  }
});

document.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.id === 'tx-form') {
    const id = document.getElementById('tx-id').value;
    const tx = {
      id: id || ('t' + Date.now()),
      date: document.getElementById('tx-date').value,
      desc: document.getElementById('tx-desc').value.trim(),
      cat: document.getElementById('tx-cat').value,
      type: document.getElementById('tx-type').value,
      amount: Math.round(Number(document.getElementById('tx-amount').value)),
    };
    if (!tx.desc || !tx.date || !(tx.amount > 0)) return;
    if (id) {
      const i = state.transactions.findIndex((x) => x.id === id);
      if (i >= 0) state.transactions[i] = tx;
    } else {
      state.transactions.push(tx);
    }
    saveState(state);
    closeTxModal();
    render();
    return;
  }
  if (e.target.id === 'profile-form') {
    state.profile.familyName = document.getElementById('pf-name').value.trim() || 'Keluarga';
    state.profile.members = document.getElementById('pf-members').value.split(',').map((s) => s.trim()).filter(Boolean);
    state.profile.monthlySaving = Math.round(Number(document.getElementById('pf-saving').value)) || 0;
    state.profile.activeMonth = document.getElementById('pf-month').value || state.profile.activeMonth;
    txFilter.month = state.profile.activeMonth;
    saveState(state);
    render();
    return;
  }
  const goalForm = e.target.closest('[data-goal]');
  if (goalForm) {
    const gid = goalForm.getAttribute('data-goal');
    const input = goalForm.querySelector('input');
    const amt = Math.round(Number(input.value));
    const g = state.goals.find((x) => x.id === gid);
    if (g && amt > 0) {
      g.saved += amt;
      saveState(state);
      render();
    }
  }
});

function openTxModal(tx) {
  const modal = document.getElementById('tx-modal');
  if (!modal) return;
  document.getElementById('modal-title').textContent = tx ? 'Ubah Transaksi' : 'Tambah Transaksi';
  document.getElementById('tx-id').value = tx ? tx.id : '';
  document.getElementById('tx-date').value = tx ? tx.date : state.profile.activeMonth + '-26';
  document.getElementById('tx-desc').value = tx ? tx.desc : '';
  document.getElementById('tx-cat').value = tx ? tx.cat : 'belanja';
  document.getElementById('tx-type').value = tx ? tx.type : 'expense';
  document.getElementById('tx-amount').value = tx ? tx.amount : '';
  modal.hidden = false;
}

function closeTxModal() {
  const modal = document.getElementById('tx-modal');
  if (modal) modal.hidden = true;
}

function downloadCsv() {
  const m = state.profile.activeMonth;
  const rows = [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah (Rp)']];
  monthTx(state, m).slice().sort((a, b) => a.date.localeCompare(b.date)).forEach((t) => {
    rows.push([t.date, '"' + t.desc.replace(/"/g, '""') + '"', catName(t.cat), t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', String(t.amount)]);
  });
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dompet-keluarga-' + m + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

render();
