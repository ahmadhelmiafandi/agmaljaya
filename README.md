# 🛋️ Afandi Interior - 3D Real-time Configurator

Aplikasi web interaktif revolusioner untuk desain interior dan pemesanan furnitur kustom. Aplikasi ini menggabungkan *Landing Page* profesional, **3D Configurator Real-time**, dan **Admin Dashboard & CMS** yang komprehensif dalam satu platform terpadu.

Memungkinkan pelanggan untuk memvisualisasikan ruangan mereka, menyusun furnitur (seperti Kitchen Set, Wardrobe, Rak TV), mengatur dimensi, menerapkan material HPL, dan langsung mendapatkan estimasi Harga (BOM) secara instan.

---

## ✨ Fitur Utama

### 🎨 1. 3D Interior Configurator
*   **Real-time Rendering:** Dibangun menggunakan `React Three Fiber` untuk performa 3D di browser yang ringan.
*   **Smart Placement & Collision:** Sistem *drag-and-drop* presisi dengan deteksi tabrakan dinding (*wall collision*) untuk furnitur lantai maupun furnitur dinding (Wall Cabinet).
*   **Modular Resizing:** Pengguna dapat mengubah ukuran lebar (X), tinggi (Y), dan kedalaman (Z) furnitur dengan batasan min/max yang aman.
*   **Material Customization:** Terapkan berbagai macam tekstur (kayu, batu, warna solid) pada bagian spesifik furnitur (seperti bodi dan pintu). Mendukung *procedural generated textures* maupun unggahan tekstur kustom.
*   **Auto BOM (Bill of Materials):** Kalkulasi harga berjalan secara otomatis dan *real-time* berdasarkan satuan unit (per pcs) atau panjang (per meter lari).
*   **Checkout & Order:** Pengguna dapat menyimpan desain mereka, mengambil tangkapan layar (*screenshot*) otomatis, dan mengirim pesanan langsung ke sistem admin.

### 👑 2. Admin Panel & 3D Catalog Management
*   **Dashboard Statistik:** Pantau jumlah pesanan masuk, total pendapatan, dan jumlah produk 3D yang aktif.
*   **Manajemen Pesanan:** Tinjau desain pesanan pelanggan secara detail sebelum diproduksi.
*   **Katalog 3D CRUD:** Antarmuka khusus (`/admin/products`) untuk mengelola *Database Furnitur 3D*.
    *   Mengatur Nama, Kategori, Harga Dasar, dan Satuan Harga.
    *   Mengatur batas skala tarikan dimensi (Lebar Default, Tinggi, Min/Max Width).
    *   *Upload* file model 3D (`.glb`) langsung ke sistem penyimpanan Supabase.
    *   *Upload* gambar *thumbnail* produk.

### 📝 3. Web Content Management System (CMS)
*   Panel admin mandiri (`/admin/settings/*`) untuk mengedit teks dan gambar di halaman *Landing Page* publik tanpa perlu menyentuh kode program.
*   Mencakup pengaturan untuk Hero Banner, Identitas Usaha, Artikel Blog, FAQ, Portofolio, dan Info Kontak.

---

## 🛠️ Tech Stack

**Frontend:**
*   [React](https://reactjs.org/) (menggunakan Vite)
*   [TypeScript](https://www.typescriptlang.org/) untuk pengetikan statis yang aman.
*   [Tailwind CSS](https://tailwindcss.com/) untuk styling UI.
*   [Zustand](https://github.com/pmndrs/zustand) untuk Global State Management.
*   [Lucide React](https://lucide.dev/) untuk ikonografi.

**3D Engine:**
*   [Three.js](https://threejs.org/)
*   [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) & [@react-three/drei](https://github.com/pmndrs/drei)

**Backend & Database:**
*   [Supabase](https://supabase.com/) (PostgreSQL, Supabase Storage untuk menampung aset file `.glb` dan `.png/.jpg`).

---

## 🚀 Cara Instalasi & Menjalankan Proyek

1. **Clone Repositori**
   ```bash
   git clone https://github.com/ahmadhelmiafandi/interia-hpl.git
   cd interia-hpl
   ```

2. **Instal Dependensi**
   Pastikan Anda telah menginstal Node.js, lalu jalankan:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Buat file `.env` di folder *root* proyek dan isi dengan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=kunci-anon-anda
   ```

4. **Persiapan Database (Supabase)**
   Pastikan Anda telah membuat tabel-tabel berikut di Supabase Anda:
   *   `items_3d` (Katalog produk 3D)
   *   `materials` (Katalog material HPL)
   *   `orders` (Penyimpanan pesanan)
   *   `website_data` (Data CMS JSON)
   
   Dan pastikan membuat Storage Buckets berikut (dengan pengaturan *Public*):
   *   `models-3d`
   *   `textures-hpl`
   *   `user-photos`

5. **Jalankan Aplikasi Mode Development**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

---

## 📂 Struktur Folder Utama

```text
src/
├── admin/                 # Seluruh halaman Admin Panel (Dashboard, Produk 3D, Pesanan)
│   └── cms/               # Halaman spesifik Content Management System web statis
├── components/            # Komponen React yang dapat digunakan ulang (Reusable)
│   ├── three/             # Komponen khusus render 3D (SceneCanvas, FurnitureItem, dll)
│   └── ui/                # Komponen UI dasar (Tombol, Input, Modal, dll)
├── hooks/                 # Custom React hooks (termasuk useSceneState.ts - otak 3D Engine)
├── lib/                   # Integrasi layanan pihak ke-3
│   ├── api.ts             # API untuk CMS & Orders
│   ├── api3d.ts           # API khusus untuk komunikasi database 3D (items_3d)
│   └── supabase.ts        # Inisialisasi klien Supabase
├── pages/
│   ├── configurator3d/    # Antarmuka Utama 3D Configurator & Sidebar UI
│   └── landing/           # Halaman Depan Website (Publik)
├── types/                 # Definisi tipe TypeScript
└── ...
```

---
*Dikembangkan untuk memberikan pengalaman interaktif interior modern.*
