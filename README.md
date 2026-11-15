# Surat Suara – E-Voting (Next.js)

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.

## Jalankan
```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy ke Vercel
1. Push folder ini ke GitHub/GitLab.
2. Vercel → Add New Project → import repo → Deploy (framework terdeteksi otomatis, tanpa env var).
   Atau: `npx vercel --prod`.

## Responsif
- Landscape (lebar ≥ 900px, rasio ≥ 5:4): kanvas 1920×1200 sesuai DESIGN.md, diskalakan agar selalu muat tanpa scroll.
- Portrait / ponsel: layout cair; kartu membungkus otomatis, tombol "Pilih Kandidat" menempel di bawah.

## Kustomisasi
- Kandidat & subjudul: `lib/data.ts`. Foto: taruh `1.jpg`–`5.jpg` di `public/kandidat/`.
- Style: Tailwind CSS v4. Warna & animasi di `@theme` pada `app/globals.css`; varian `fx:` = mode kanvas landscape 1920x1200.
- QR: halaman scan menerima pemindai hardware (ketik kode + Enter) dan ketuk kotak untuk demo.
  Untuk kamera, ganti `scanned` di `components/Ballot.tsx` dengan hasil pustaka scanner.
