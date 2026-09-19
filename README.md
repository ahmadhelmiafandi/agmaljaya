# 🏛️ AGMAL JAYA INTERIOR — Web Platform & CMS

[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

Platform web resmi **AGMAL JAYA INTERIOR** — Spesialis perancangan desain dan produksi furnitur interior kustom modern berstandar tinggi langsung dari sentra perkayuan terkemuka **Jepara, Jawa Tengah**, melayani pengiriman dan instalasi ke **seluruh wilayah Indonesia**.

Website ini menggabungkan **Landing Page Premium Berkonversi Tinggi**, **Integrasi Konsultasi WhatsApp Cepat**, **Sistem Manajemen Konten (CMS) Mandiri**, serta **Manajemen Pesanan & Generator Invoice PDF Resmi**.

---

## ✨ Fitur Utama

### 🌟 1. Landing Page Premium & Responsif
* **Desain Luxury Berestetika Tinggi:** Dilengkapi tema kontras ganda (*Dark Hero Banner* dan *High-Contrast Solid White Navigation*) dengan aksen warna *rich antique gold* dan *deep slate*.
* **Katalog Produk Utama:** Showcase interaktif untuk:
  * **Kitchen Set Minimalis** (L-shape, U-shape, anti-rayap, engsel soft-close).
  * **Lemari Pakaian Wardrobe** (Full plafon, partisi kaca, LED strip vertikal).
  * **Kabinet & Backdrop TV** (Floating console dengan panel kisi-kisi kayu/fluted wall).
  * **Meja Kerja & Belajar** (Desain ergonomis terintegrasi rak buku).
* **Otentisitas Workshop Jepara:** Menampilkan dokumentasi pengrajin kayu profesional Jepara dengan jaminan pengerjaan presisi milimeter dan packing kayu standar ekspedisi nasional.
* **Galeri Portfolio & Ulasan Klien Nasional:** Ulasan nyata dan hasil pengerjaan untuk klien di Jakarta, Surabaya, Bandung, Medan, Bali, Semarang, Balikpapan, dan Makassar.
* **Artikel Blog Edukatif & FAQ Interaktif:** Panduan material interior (HPL, Multiplek vs Blockboard) serta tanya-jawab seputar pemesanan luar kota.

### 📲 2. Direct WhatsApp Integration
* Seluruh tombol pemesanan dan konsultasi terhubung langsung ke tim desain via WhatsApp:
  * **Nomor Resmi:** `+62 851 1372 3808` (`6285113723808`).
  * Format pesan otomatis sesuai konteks produk yang dikonsultasikan.

### 👑 3. Admin Panel & CMS (Content Management System)
* **Akses Mudah:** Tersedia di route `/admin/login`.
* **Identitas & SEO:** Kelola nama usaha, tagline, logo (mode gelap & terang), dan metadata SEO.
* **Manajemen Konten:** Update teks Hero Banner, deskripsi Tentang Kami, item produk, galeri portfolio, ulasan klien, dan artikel blog tanpa perlu mengedit kode sumber.
* **Metode Upload Foto Interaktif (CRUD):** 
  * Mendukung *drag-and-drop* atau klik untuk memilih file langsung dari komputer/HP (PNG, JPG, WEBP).
  * Terintegrasi otomatis dengan **Supabase Storage** (bucket `content`) dengan *fallback* aman ke Base64.
* **Manajemen Pesanan & Generator Invoice PDF:**
  * Kelola daftar pesanan kustom.
  * Unduh dokumen penawaran harga / invoice resmi format PDF (`AGMAL-JAYA-Interior-Quotation-*.pdf`) berstandar profesional lengkap dengan kop surat dan rincian biaya.

### 📍 4. Lokasi Workshop Akurat
* **Alamat Resmi:** `GRGQ+X38 Bumiharjo, Kec. Keling, Jepara Regency, Central Java 59454`.
* Terintegrasi langsung dengan sematan peta Google Maps interaktif.

---

## 🛠️ Tech Stack

* **Core & Framework:** [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite 7](https://vitejs.dev/)
* **Styling & Icons:** [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
* **PDF Engine:** [jsPDF](https://github.com/parallax/jsPDF), [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL Database & Storage Bucket)
* **Deployment Ready:** Siap di-deploy ke [Vercel](https://vercel.com/) / Netlify dengan konfigurasi `vercel.json` SPA routing.

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Clone Repositori
```bash
git clone https://github.com/ahmadhelmiafandi/agmaljaya.git
cd agmaljaya
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Buat file `.env` di folder *root* proyek (salin dari `.env.example`):
```env
VITE_SUPABASE_URL=https://hxpjyglsjwbxkeexulul.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Setup Database Supabase
1. Buka dashboard Supabase Anda: [https://supabase.com](https://supabase.com)
2. Masuk ke menu **SQL Editor** (ikon `>_` di navigasi kiri).
3. Jalankan seluruh perintah SQL yang ada pada file [`supabase_schema.sql`](./supabase_schema.sql).
4. Tabel `website_data`, `orders`, serta storage bucket `content` akan terbuat secara otomatis.

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 6. Build untuk Produksi
```bash
npm run build
```
Hasil kompilasi siap saji akan berada di folder `dist/`.

---

## 📂 Struktur Folder Proyek

```text
e:\Agmal Jaya\
├── public/
│   ├── brand/               # Aset identitas logo resmi (dark & light mode)
│   ├── images/              # Foto interior lokal (kitchen set, wardrobe, TV, dll)
│   ├── robots.txt           # Konfigurasi perayap SEO mesin pencari
│   └── sitemap.xml          # Peta situs resmi AGMAL JAYA INTERIOR
├── src/
│   ├── admin/               # Panel Admin & CMS
│   │   ├── cms/             # Halaman CMS (Identitas, Katalog, Beranda, Blog, Kontak)
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminOrders.tsx  # Manajemen Pesanan & Pembuatan PDF
│   │   └── AdminSettings.tsx
│   ├── components/
│   │   ├── layout/          # Navbar & Footer selaras
│   │   └── ui/              # Modal, Toast, Pagination, TypingText
│   ├── data/                # Data fallback awal (defaultWebsiteData.ts)
│   ├── hooks/               # Custom hooks (useScrollReveal, useDebounce)
│   ├── lib/                 # Utilitas (Supabase, API, pdfGenerator, whatsapp)
│   ├── pages/
│   │   └── landing/         # Halaman Landing publik & section-section utama
│   ├── types/               # Tipe data TypeScript
│   ├── App.tsx              # Routing utama
│   └── main.tsx             # Entry point React
├── supabase_schema.sql      # Skema database & storage Supabase
├── vercel.json              # Konfigurasi SPA routing Vercel
└── README.md
```

---

## 📞 Kontak Resmi

* **Brand:** AGMAL JAYA INTERIOR
* **WhatsApp:** [+62 851 1372 3808](https://wa.me/6285113723808)
* **Email:** [hello@agmaljaya-interior.com](mailto:hello@agmaljaya-interior.com)
* **Lokasi Workshop:** GRGQ+X38 Bumiharjo, Kec. Keling, Jepara Regency, Central Java 59454
