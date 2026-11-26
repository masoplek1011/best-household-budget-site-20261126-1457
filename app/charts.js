// Dompet Keluarga — helper grafik SVG (ditulis tangan, tanpa library).
// Donat pengeluaran per kategori + grafik batang tren bulanan.

function donutChart(segments, size) {
  // segments: [{label, value, color}] — nilai > 0 saja.
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 80, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  let offset = 0;
  let circles = '';
  for (const seg of segments) {
    if (seg.value <= 0) continue;
    const frac = seg.value / total;
    const len = frac * circ;
    circles += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + seg.color +
      '" stroke-width="34" stroke-dasharray="' + len.toFixed(2) + ' ' + (circ - len).toFixed(2) +
      '" stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')" />\n';
    offset += len;
  }
  const pct = total > 0 ? Math.round(100) : 0;
  return '<div class="donut-wrap"><svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '" role="img" aria-label="Grafik donat pengeluaran per kategori">' +
    '<circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" stroke-width="34" />' +
    circles +
    '<text x="100" y="96" text-anchor="middle" class="donut-total">' + fmt(total) + '</text>' +
    '<text x="100" y="118" text-anchor="middle" class="donut-label">Total belanja</text>' +
    '</svg></div>';
}

function barChart(rows, opts) {
  // rows: [{label, income, expense}] — batang ganda pemasukan vs pengeluaran.
  opts = opts || {};
  const W = opts.width || 640, H = opts.height || 280;
  const padL = 8, padB = 28, padT = 12;
  const maxV = Math.max.apply(null, rows.map((r) => Math.max(r.income, r.expense))) * 1.08;
  const slot = (W - padL * 2) / rows.length;
  const bw = Math.min(26, slot * 0.32);
  let out = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Grafik batang tren pemasukan dan pengeluaran 6 bulan">';
  // garis grid
  for (let g = 0; g <= 4; g++) {
    const y = padT + ((H - padB - padT) * g) / 4;
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padL) + '" y2="' + y.toFixed(1) + '" stroke="#e2e8f0" stroke-width="1" />';
  }
  rows.forEach((r, i) => {
    const x0 = padL + i * slot + slot / 2;
    const hI = ((H - padB - padT) * r.income) / maxV;
    const hE = ((H - padB - padT) * r.expense) / maxV;
    const yI = H - padB - hI, yE = H - padB - hE;
    out += '<rect x="' + (x0 - bw - 3).toFixed(1) + '" y="' + yI.toFixed(1) + '" width="' + bw + '" height="' + hI.toFixed(1) + '" rx="3" fill="#4f46e5"><title>' + r.label + ' pemasukan ' + fmt(r.income) + '</title></rect>';
    out += '<rect x="' + (x0 + 3).toFixed(1) + '" y="' + yE.toFixed(1) + '" width="' + bw + '" height="' + hE.toFixed(1) + '" rx="3" fill="#f59e0b"><title>' + r.label + ' pengeluaran ' + fmt(r.expense) + '</title></rect>';
    out += '<text x="' + x0.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" class="bar-label">' + r.label + '</text>';
  });
  out += '</svg>';
  return out;
}

function progressBar(pct, color) {
  const p = Math.max(0, Math.min(100, pct));
  return '<div class="bar"><div class="bar-fill" style="width:' + p.toFixed(1) + '%;background:' + color + '"></div></div>';
}
