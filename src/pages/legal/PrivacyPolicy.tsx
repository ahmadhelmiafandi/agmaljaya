import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Database, 
  Share2, 
  UserCheck, 
  Cookie, 
  Bot, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Printer, 
  Copy, 
  Check, 
  ChevronRight,
  ChevronUp,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { api } from '../../lib/api';

export default function PrivacyPolicy() {
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [activeSection, setActiveSection] = useState('pengantar');
  const [copied, setCopied] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Kebijakan Privasi | AGMAL JAYA INTERIOR";

    api.getSettings().then(data => {
      setSettings(data);
    });

    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);

      // Spy on sections
      const sections = document.querySelectorAll('section[id]');
      let current = 'pengantar';
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 140) {
          current = sec.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'pengantar', title: '1. Pengantar & Komitmen' },
    { id: 'data-dikumpulkan', title: '2. Data yang Dikumpulkan' },
    { id: 'cara-pengumpulan', title: '3. Cara Kami Mengumpulkan Data' },
    { id: 'penggunaan-data', title: '4. Tujuan Penggunaan Informasi' },
    { id: 'keamanan-data', title: '5. Keamanan & Enkripsi Data' },
    { id: 'pihak-ketiga', title: '6. Pembagian ke Pihak Ketiga' },
    { id: 'ai-assistant', title: '7. AI Agmal Assistant & Chat' },
    { id: 'hak-pengguna', title: '8. Hak Privasi Anda' },
    { id: 'cookies', title: '9. Cookie & Teknologi Pelacakan' },
    { id: 'kontak-privasi', title: '10. Hubungi Tim Privasi' },
  ];

  const phone = settings?.contact?.phone || '+62 851-1372-3808';
  const email = settings?.contact?.email || 'halo@agmaljaya.com';
  const address = settings?.footer?.address || 'GRGQ+X38 Bumiharjo, Kec. Keling, Kabupaten Jepara, Jawa Tengah';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500/30">
      <Navbar cmsData={settings || undefined} />

      {/* Header / Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-400">Legal</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-teal-400 font-medium">Kebijakan Privasi</span>
          </nav>

          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Dokumen Resmi Perlindungan Data
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Kebijakan Privasi
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl font-light">
              Kami menghargai kepercayaan Anda saat mempercayakan desain dan pembuatan interior hunian Anda kepada <strong className="text-white font-semibold">AGMAL JAYA INTERIOR</strong>. Dokumen ini menjelaskan secara transparan bagaimana data Anda kami kumpulkan, lindungi, dan gunakan.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Terakhir Diperbarui: <strong>22 Oktober 2026</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                Versi: <strong>1.4 (SPK & Digital Protection)</strong>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                {copied ? <Check size={15} className="text-teal-400" /> : <Copy size={15} />}
                {copied ? 'Tautan Tersalin!' : 'Salin Tautan'}
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                <Printer size={15} /> Cetak Dokumen
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600/90 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                <ArrowLeft size={15} /> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Sticky Table of Contents & Quick Support */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 space-y-6">
              
              {/* Table of Contents Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-600 mb-4 pb-3 border-b border-slate-100">
                  <FileText size={16} /> Daftar Bagian
                </div>
                <nav className="space-y-1">
                  {sections.map(s => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left text-xs sm:text-sm px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                        activeSection === s.id
                          ? 'bg-teal-50 text-teal-700 font-bold border-l-4 border-teal-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Legal & Trust Badge */}
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-teal-800/40 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                  <Lock size={20} />
                </div>
                <h3 className="font-bold text-base text-white">Privasi Anda Terjamin</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Data denah, foto ruangan, anggaran, serta identitas proyek Anda tidak akan pernah dijual atau disebarluaskan kepada pihak ketiga manapun tanpa persetujuan tertulis Anda.
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] text-teal-300 font-medium flex items-center gap-2">
                  <Check size={14} /> Standar Enkripsi SSL 256-Bit
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <HelpCircle size={16} className="text-teal-600" /> Ada Pertanyaan Privasi?
                </div>
                <p className="text-xs text-slate-500">
                  Hubungi petugas privasi kami untuk permohonan penghapusan atau revisi data proyek Anda:
                </p>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Halo Tim Legal AGMAL JAYA INTERIOR, saya ingin bertanya mengenai privasi data.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <Phone size={14} /> Hubungi via WhatsApp
                </a>
              </div>

            </div>
          </aside>

          {/* Right Column: Detailed Legal Terms */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-12 leading-relaxed text-slate-700">
            
            {/* Section 1 */}
            <section id="pengantar" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 1
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                1. Pengantar & Komitmen Privasi
              </h2>
              <p>
                Selamat datang di situs resmi <strong>AGMAL JAYA INTERIOR</strong> (dikelola oleh CV / Workshop Agmal Jaya Interior, berpusat di Jepara, Jawa Tengah). Kebijakan Privasi ini mengatur bagaimana kami mengumpulkan, menyimpan, memproses, dan melindungi informasi pribadi yang Anda berikan saat mengakses situs web kami (<code>agmaljaya.com</code>), menggunakan asisten virtual pintar <strong>Agmal Assistant</strong>, mengisi formulir konsultasi, maupun saat menandatangani Surat Perjanjian Kerja (SPK) produksi interior custom.
              </p>
              <p>
                Dengan mengakses situs web ini atau menyetujui penawaran kami, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan dalam Kebijakan Privasi ini. Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak melanjutkan penggunaan layanan kami.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3.5 items-start text-xs sm:text-sm text-slate-600">
                <AlertCircle size={20} className="text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-1">Catatan Integritas Brand:</strong>
                  Kami menjamin bahwa seluruh data teknis hunian, denah arsitektur, foto ruangan pribadi, dan rincian transaksi bersifat <em>Strictly Confidential</em> (Sangat Rahasia) dan semata-mata digunakan untuk kesuksesan pengerjaan proyek interior Anda.
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2 */}
            <section id="data-dikumpulkan" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 2
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                2. Data yang Kami Kumpulkan
              </h2>
              <p>
                Untuk merancang, memproduksi, dan menginstalasi furniture custom dengan tingkat presisi milimeter, kami mengumpulkan kategori data berikut:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                    <UserCheck size={18} className="text-teal-600" /> Data Identitas & Kontak
                  </div>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Nama lengkap klien atau penanggung jawab proyek</li>
                    <li>Nomor WhatsApp / telepon seluler aktif</li>
                    <li>Alamat email untuk pengiriman penawaran resmi (RAB & Invoice)</li>
                    <li>Identitas diri (KTP/NPWP) jika dibutuhkan untuk kontrak SPK formal</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                    <MapPin size={18} className="text-teal-600" /> Data Proyek & Lokasi
                  </div>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Alamat lengkap lokasi survei, pengiriman, dan instalasi</li>
                    <li>Denah arsitektur (CAD/PDF/sketsa tangan) dan ukuran ruangan</li>
                    <li>Foto & video kondisi eksisting ruangan sebelum renovasi</li>
                    <li>Akses fasilitas gedung (izin loading dock apartemen, lift, daya listrik)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                    <Database size={18} className="text-teal-600" /> Preferensi & Spesifikasi Desain
                  </div>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Gaya interior yang diminati (Japandi, Modern Luxury, Minimalis, Industrial)</li>
                    <li>Pilihan bahan baku (Multiplek Meranti, Blockboard, HPL, Duco, Marmer, Kaca)</li>
                    <li>Estimasi alokasi anggaran (budgeting) untuk penyesuaian material</li>
                    <li>Catatan khusus kebutuhan ergonomi keluarga / pengguna</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                    <Bot size={18} className="text-teal-600" /> Riwayat Interaksi Digital
                  </div>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Percakapan konsultasi dengan AI Agmal Assistant</li>
                    <li>Riwayat klik portfolio dan produk yang Anda tinjau di website</li>
                    <li>Data teknis perangkat (IP address, jenis browser, resolusi layar)</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 3 */}
            <section id="cara-pengumpulan" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 3
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                3. Cara Kami Mengumpulkan Data
              </h2>
              <p>
                Informasi dikumpulkan melalui mekanisme yang sah dan beretika:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li><strong className="text-slate-800">Secara Langsung dari Anda:</strong> Saat Anda mengisi form kontak, mengirim pesan WhatsApp ke nomor resmi, berdiskusi dalam sesi survei lokasi, atau menyepakati SPK.</li>
                <li><strong className="text-slate-800">Interaksi dengan Agmal Assistant:</strong> Saat Anda berkonsultasi mengenai estimasi harga kitchen set, rekomendasi bahan, atau penjadwalan survei.</li>
                <li><strong className="text-slate-800">Pengukuran & Dokumentasi Fisik Lapangan:</strong> Dilakukan oleh surveyor / arsitek interior kami secara langsung di lokasi hunian Anda dengan izin Anda.</li>
                <li><strong className="text-slate-800">Teknologi Otomatis:</strong> Cookie dan log server standar untuk memantau performa situs dan mencegah aktivitas penipuan.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 4 */}
            <section id="penggunaan-data" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 4
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                4. Tujuan Penggunaan Informasi
              </h2>
              <p>
                Kami menggunakan data yang terkumpul hanya untuk keperluan operasional dan pelayanan terbaik, yaitu:
              </p>
              <ol className="list-decimal list-inside space-y-2.5 text-slate-600 pl-2">
                <li><strong>Pembuatan Desain 3D & RAB:</strong> Membuat visualisasi 3D rendering photorealistic serta perhitungan Rencana Anggaran Biaya yang akurat dan transparan.</li>
                <li><strong>Produksi Workshop Jepara:</strong> Menerjemahkan kebutuhan Anda menjadi <em>cutting list</em> presisi mesin CNC dan instruksi kerja bagi pengrajin ahli kami di sentra workshop Jepara.</li>
                <li><strong>Pengiriman & Logistik Ekspedisi:</strong> Mengoordinasikan armada pengiriman khusus furniture dari workshop ke alamat Anda di seluruh Indonesia.</li>
                <li><strong>Instalasi On-Site:</strong> Memfasilitasi tim tukang spesialis instalasi kami untuk melakukan perakitan rapi dan serah terima kunci (BAST).</li>
                <li><strong>Layanan Garansi & Purnajual:</strong> Memverifikasi keabsahan kartu garansi konstruksi 12 bulan dan kartu layanan purnajual jika Anda membutuhkan perbaikan atau penyesuaian engsel/rel.</li>
                <li><strong>Kepatuhan Hukum & Pajak:</strong> Pembuatan kwitansi, faktur, dan arsip kontrak SPK yang berkekuatan hukum.</li>
              </ol>
            </section>

            <hr className="border-slate-100" />

            {/* Section 5 */}
            <section id="keamanan-data" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 5
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                5. Keamanan & Enkripsi Data
              </h2>
              <p>
                Kami menerapkan standar pengamanan teknis dan manajerial berlapis untuk melindungi data Anda dari akses tanpa izin, kehilangan, atau pencurian:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <strong className="text-slate-900 block text-sm">Enkripsi Data Transit (SSL/TLS):</strong>
                    <span className="text-xs text-slate-600">Seluruh lalu lintas informasi antara browser Anda dan server kami dienkripsi menggunakan protokol HTTPS dengan sertifikat SSL 256-bit standar industri perbankan.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <strong className="text-slate-900 block text-sm">Akses Berbasis Peran (Role-Based Access):</strong>
                    <span className="text-xs text-slate-600">Hanya staf arsitek, drafter, dan kepala produksi yang berwenang yang dapat mengakses detail dimensi ruangan dan kontak Anda untuk keperluan proyek terkait.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <strong className="text-slate-900 block text-sm">Penyimpanan Terisolasi:</strong>
                    <span className="text-xs text-slate-600">Dokumen kontrak SPK dan bukti transfer disimpan dalam media cloud terenkripsi dengan proteksi otentikasi dua faktor (2FA).</span>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 6 */}
            <section id="pihak-ketiga" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 6
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                6. Pembagian Data ke Pihak Ketiga
              </h2>
              <p>
                <strong>AGMAL JAYA INTERIOR tidak pernah dan tidak akan pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak broker data atau pengiklan eksternal.</strong>
              </p>
              <p>
                Data hanya dibagikan kepada mitra pihak ketiga yang berpartisipasi langsung dalam penyelesaian pesanan Anda dengan perjanjian kerahasiaan:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li><strong className="text-slate-800">Ekspedisi Logistik Truk Jepara:</strong> Nama penerima, alamat pengiriman, dan nomor telepon supir/koordinator lapangan agar armada truk dapat mengantarkan pesanan furniture custom Anda tepat waktu dan selamat.</li>
                <li><strong className="text-slate-800">Tim Asuransi Kargo (Jika Dipilih):</strong> Untuk melindungi nilai furniture bernilai tinggi selama perjalanan lintas pulau di Indonesia.</li>
                <li><strong className="text-slate-800">Kewajiban Hukum:</strong> Jika diwajibkan oleh proses hukum yang sah oleh otoritas penegak hukum Republik Indonesia berdasarkan undang-undang yang berlaku.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 7 */}
            <section id="ai-assistant" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 7
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                7. Asisten Virtual "Agmal Assistant" & Chat
              </h2>
              <p>
                Situs web kami menyediakan fitur <strong>Agmal Assistant</strong> — konsultan virtual cerdas berbasis AI untuk menjawab pertanyaan seputar interior, estimasi harga meter lari, dan spesifikasi bahan.
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li>Riwayat obrolan Anda dienkripsi dan disimpan secara lokal di browser Anda (LocalStorage) demi kenyamanan Anda saat membuka kembali halaman.</li>
                <li>Anda dapat menghapus riwayat obrolan kapan saja melalui tombol <em>"Reset Percakapan"</em> yang tersedia di dalam jendela obrolan Agmal Assistant.</li>
                <li>Kami tidak mengumpulkan percakapan pribadi yang bersifat rahasia untuk melatih model AI publik tanpa izin Anda.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 8 */}
            <section id="hak-pengguna" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 8
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                8. Hak Privasi Anda sebagai Klien
              </h2>
              <p>
                Berdasarkan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) di Republik Indonesia, Anda memiliki hak penuh untuk:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1">Hak Akses & Portabilitas</div>
                  <p className="text-xs text-slate-600">Meminta salinan data pribadi, berkas desain 3D, dan SPK yang kami simpan atas nama Anda.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1">Hak Koreksi & Pembaruan</div>
                  <p className="text-xs text-slate-600">Memperbarui nomor kontak, alamat instalasi, atau perincian identitas Anda yang mengalami perubahan.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1">Hak Penghapusan (Right to be Forgotten)</div>
                  <p className="text-xs text-slate-600">Meminta penghapusan data Anda dari sistem marketing kami setelah proyek Anda selesai dan masa garansi berakhir.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1">Hak Penolakan Dokumentasi Foto</div>
                  <p className="text-xs text-slate-600">Menolak publikasi hasil foto/video interior hunian Anda di portofolio website/media sosial jika Anda menginginkan privasi hunian 100% tertutup.</p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 9 */}
            <section id="cookies" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 9
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                9. Cookie & Teknologi Pelacakan
              </h2>
              <p>
                Kami menggunakan cookie esensial dan analitik anonim untuk memastikan fitur-fitur website berfungsi normal (seperti menyimpan preferensi filter katalog dan status login admin). Anda dapat menonaktifkan cookie melalui pengaturan browser Anda, meskipun beberapa fitur interaktif mungkin berjalan kurang optimal.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 10 */}
            <section id="kontak-privasi" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md">
                Pasal 10
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                10. Hubungi Tim Privasi Kami
              </h2>
              <p>
                Jika Anda memiliki pertanyaan, keberatan, atau ingin mengajukan permohonan pembaruan data terkait Kebijakan Privasi ini, silakan hubungi manajemen kami melalui saluran resmi berikut:
              </p>

              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="font-bold text-lg text-amber-300">
                  AGMAL JAYA INTERIOR — Divisi Hukum & Privasi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Sentra Workshop & Kantor:</strong>
                      {address}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">WhatsApp Resmi:</strong>
                      <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:underline">
                        {phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Email Resmi:</strong>
                      <a href={`mailto:${email}`} className="text-teal-300 hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Jam Layanan:</strong>
                      Senin – Sabtu: 08:00 – 17:00 WIB
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-slate-400">
                  Dokumen Kebijakan Privasi ini dapat diperbarui sewaktu-waktu sesuai dengan evolusi layanan dan regulasi perundang-undangan di Republik Indonesia.
                </p>
              </div>
            </section>

          </main>

        </div>
      </div>

      <Footer cmsData={settings || undefined} />

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full bg-teal-600 text-white shadow-2xl shadow-teal-600/30 hover:bg-teal-500 transition-all duration-300 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Kembali ke atas"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
}
