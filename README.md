# Dompet Keluarga — Situs Anggaran Rumah Tangga

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/masoplek1011/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/masoplek1011/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

**Dompet Keluarga** adalah situs anggaran rumah tangga statis berbahasa Indonesia: lacak pemasukan, pengeluaran, anggaran bulanan, dan target tabungan — semuanya offline, tanpa akun, tanpa iklan, tanpa pelacakan. Data tersimpan hanya di perangkat Anda (localStorage).

## Yang bisa dilakukan

- **Beranda** — ringkasan bulan ini: pemasukan Rp8.500.000, pengeluaran Rp6.120.000, sisa Rp2.380.000, tabungan Rp1.200.000; donat pengeluaran per kategori, progress anggaran, transaksi terbaru, dan tagihan jatuh tempo.
- **Anggaran** — batas belanja per kategori (Belanja Harian, Makan & Minum, Transportasi, Tagihan & Utilitas, Pendidikan, Kesehatan, Hiburan) dengan status lewat/sisa anggaran; angka anggaran bisa diubah dan langsung tersimpan.
- **Transaksi** — tabel lengkap 28 transaksi contoh November 2026; tambah, ubah, dan hapus transaksi lewat form; filter berdasarkan bulan, kategori, dan pencarian.
- **Tabungan** — empat target (Dana Darurat Rp25.000.000, Liburan Keluarga, Pendidikan Anak, DP Rumah) dengan progress dan tombol tambah dana.
- **Laporan** — tren pemasukan vs pengeluaran 6 bulan, surplus bulanan, rincian kategori, dan tombol unduh CSV yang benar-benar mengunduh file.
- **Pengaturan** — profil keluarga, bulan aktif, tabungan bulanan, dan reset ke data contoh.

## Cara menjalankan

Situs ini statis — tidak ada build step dan tidak ada dependensi:

```sh
node serve.ts
# lalu buka http://localhost:8080
```

Atau layani folder `app/` dengan server statis apa pun, lalu buka `app/index.html`.

## Struktur

- `app/index.html` — kerangka halaman
- `app/style.css` — tampilan (indigo + amber, font sistem)
- `app/data.js` — data contoh + state (localStorage)
- `app/app.js` — router hash + semua halaman dan interaksi
- `app/charts.js` — grafik SVG donat dan batang (ditulis tangan)
- `main.ts` — entry program: menyalin `app/` dan `screenshots/` ke output dan menulis `dossier.json`
- `vendor/makefun-frontend.ts` — library make.fun (dari kit, tidak diubah)

## Lisensi

MIT — lihat `LICENSE`.
