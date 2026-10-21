import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  Scale, 
  CreditCard, 
  Hammer, 
  Truck, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  FileText, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  ChevronUp, 
  ArrowLeft, 
  Printer, 
  Copy, 
  Check, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { api } from '../../lib/api';

export default function TermsOfService() {
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [activeSection, setActiveSection] = useState('umum');
  const [copied, setCopied] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Syarat & Ketentuan Layanan | AGMAL JAYA INTERIOR";

    api.getSettings().then(data => {
      setSettings(data);
    });

    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);

      const sections = document.querySelectorAll('section[id]');
      let current = 'umum';
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
    { id: 'umum', title: '1. Ketentuan Umum & Definisi' },
    { id: 'ruang-lingkup', title: '2. Ruang Lingkup Layanan' },
    { id: 'alur-pemesanan', title: '3. Alur Pemesanan & Survei' },
    { id: 'skema-pembayaran', title: '4. Skema Termin Pembayaran' },
    { id: 'spesifikasi-material', title: '5. Standar Material & Presisi' },
    { id: 'lead-time', title: '6. Waktu Produksi & Pengiriman' },
    { id: 'revisi-pekerjaan', title: '7. Revisi & Pekerjaan Tambahan' },
    { id: 'instalasi-serah-terima', title: '8. Instalasi & Serah Terima (BAST)' },
    { id: 'garansi-purnajual', title: '9. Kebijakan Garansi 12 Bulan' },
    { id: 'pembatalan-refund', title: '10. Pembatalan & Pengembalian Dana' },
    { id: 'hak-cipta', title: '11. Hak Cipta & Portofolio' },
    { id: 'hukum-sengketa', title: '12. Hukum & Penyelesaian Sengketa' },
  ];

  const phone = settings?.contact?.phone || '+62 851-1372-3808';
  const email = settings?.contact?.email || 'halo@agmaljaya.com';
  const address = settings?.footer?.address || 'GRGQ+X38 Bumiharjo, Kec. Keling, Kabupaten Jepara, Jawa Tengah';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-500/30">
      <Navbar cmsData={settings || undefined} />

      {/* Header / Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-400">Legal</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-amber-400 font-medium">Syarat & Ketentuan Layanan</span>
          </nav>

          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Scale size={14} /> Perjanjian Standar Pelaksanaan Proyek
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Syarat & Ketentuan Layanan
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl font-light">
              Pedoman resmi pelaksanaan desain, produksi furniture custom di sentra workshop Jepara, pengiriman kargo, serta instalasi interior bersama <strong className="text-white font-semibold">AGMAL JAYA INTERIOR</strong> untuk menjamin kepastian kualitas dan perlindungan kedua belah pihak.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Terakhir Diperbarui: <strong>22 Oktober 2026</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                Standar SPK: <strong>Terintegrasi BAST & Kartu Garansi 12 Bulan</strong>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                {copied ? <Check size={15} className="text-amber-400" /> : <Copy size={15} />}
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#b08d57] hover:bg-[#9a7642] text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-[#b08d57]/20"
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
          
          {/* Left Column: Sticky Table of Contents & Support */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 space-y-6">
              
              {/* Table of Contents */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 mb-4 pb-3 border-b border-slate-100">
                  <FileText size={16} /> Daftar Pasal
                </div>
                <nav className="space-y-1">
                  {sections.map(s => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left text-xs sm:text-sm px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                        activeSection === s.id
                          ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-[#b08d57] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* SPK Guarantee Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg border border-amber-500/20 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <FileCheck2 size={20} />
                </div>
                <h3 className="font-bold text-base text-white">SPK Resmi Bermeterai</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Setiap transaksi produksi di AGMAL JAYA INTERIOR dilindungi oleh Surat Perjanjian Kerja (SPK) sah lengkap dengan rincian material, 3D render, dan tanggal serah terima.
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} /> Berita Acara Serah Terima (BAST)
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <HelpCircle size={16} className="text-amber-600" /> Konsultasi SPK & Kontrak
                </div>
                <p className="text-xs text-slate-500">
                  Ingin mengajukan kontrak proyek komersial, kantor, atau rumah tinggal mewah?
                </p>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Halo Tim Manajemen AGMAL JAYA INTERIOR, saya ingin konsultasi draft SPK kontrak interior.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#b08d57] hover:bg-[#9a7642] text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <Phone size={14} /> Chat Manajemen Proyek
                </a>
              </div>

            </div>
          </aside>

          {/* Right Column: Detailed Articles */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-12 leading-relaxed text-slate-700">
            
            {/* Section 1 */}
            <section id="umum" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 1
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                1. Ketentuan Umum & Definisi
              </h2>
              <p>
                Syarat dan Ketentuan Layanan ini (“Perjanjian”) merupakan kesepakatan mengikat antara <strong>AGMAL JAYA INTERIOR</strong> (disebut sebagai “Kami” atau “Kontraktor Interior”) dan perorangan atau badan hukum yang menggunakan jasa kami (disebut sebagai “Klien” atau “Anda”).
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                  <strong className="text-slate-900">SPK (Surat Perjanjian Kerja):</strong> Dokumen kontrak tertulis resmi yang memuat spesifikasi teknis, daftar furniture, gambar kerja 3D, jadwal produksi, skema termin pembayaran, dan ditandatangani oleh kedua belah pihak.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                  <strong className="text-slate-900">RAB (Rencana Anggaran Biaya):</strong> Perhitungan terinci mengenai volume pengerjaan, meter lari (m¹), meter persegi (m²), serta jenis finishing dan hardware yang disepakati.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                  <strong className="text-slate-900">BAST (Berita Acara Serah Terima):</strong> Lembar verifikasi fisik yang ditandatangani bersama setelah instalasi furniture selesai dan dinyatakan layak fungsi di lokasi Klien.
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2 */}
            <section id="ruang-lingkup" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 2
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                2. Ruang Lingkup Layanan
              </h2>
              <p>
                AGMAL JAYA INTERIOR menyediakan layanan desain dan produksi interior terpadu end-to-end, meliputi:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 size={16} className="text-[#b08d57] shrink-0 mt-0.5" />
                  <span><strong>Kitchen Set Custom:</strong> Kabinet atas, bawah, island table, backsplash, table top marmer/solid surface, sink & cooker hood installation.</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 size={16} className="text-[#b08d57] shrink-0 mt-0.5" />
                  <span><strong>Wardrobe & Walk-in Closet:</strong> Lemari pakaian sliding/swing, kaca tempered, pencahayaan LED sensor otomatis, rak aksesoris.</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 size={16} className="text-[#b08d57] shrink-0 mt-0.5" />
                  <span><strong>Living Room & Backwall TV:</strong> Kisi-kisi kayu/fluted wall panel, backdrop TV gantung, credenza, partisi ruangan estetik.</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 size={16} className="text-[#b08d57] shrink-0 mt-0.5" />
                  <span><strong>Komersial & Kantor:</strong> Meja resepsionis, meeting room table, backdrop lobby, fitting out interior cafe & boutique.</span>
                </li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 3 */}
            <section id="alur-pemesanan" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 3
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                3. Alur Pemesanan & Survei Lokasi
              </h2>
              <p>
                Untuk memastikan hasil akhir presisi milimeter tanpa cela, tahapan proyek berjalan melalui urutan berikut:
              </p>
              
              <div className="relative border-l-2 border-amber-300 ml-4 pl-6 space-y-6 pt-2">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#b08d57] border-4 border-white"></div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Tahap 1: Konsultasi Awal & Estimasi Biaya Kasar</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Klien mengirimkan denah/foto ruangan serta referensi model. Kami menyusun estimasi kisaran harga (budget plan awal) secara gratis.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#b08d57] border-4 border-white"></div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Tahap 2: Survei Pengukuran On-Site</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Arsitek/surveyor kami datang ke lokasi hunian Anda untuk mengukur siku dinding, ketinggian plafon, posisi stop kontak, jalur air, dan akses tangga/lift.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#b08d57] border-4 border-white"></div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Tahap 3: Pembuatan Desain 3D Rendering & Revisi</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Tim drafter merancang visualisasi 3D detail. Klien berhak mendapatkan revisi minor gratis untuk pemilihan warna HPL, letak laci, dan pencahayaan.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#b08d57] border-4 border-white"></div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Tahap 4: Penandatanganan SPK & Mulai Produksi Workshop</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Setelah desain 3D & RAB final disetujui, Klien menandatangani SPK dan menyetorkan pembayaran Termin I (DP). Bahan baku langsung diproses di Jepara.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 4 */}
            <section id="skema-pembayaran" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 4
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                4. Skema Termin Pembayaran
              </h2>
              <p>
                Kecuali disepakati lain dalam pasal khusus pada SPK, sistem pembayaran pengerjaan proyek mengikuti standar 3 termin berikut:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Termin I (DP)</div>
                  <div className="text-3xl font-black text-amber-900">50%</div>
                  <div className="text-xs font-bold text-slate-800">Mulai Produksi Workshop</div>
                  <p className="text-xs text-slate-600">
                    Dibayarkan saat penandatanganan SPK untuk pengadaan kayu multiplek, HPL terpilih, aksesoris, dan pengerjaan konstruksi di Jepara.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Termin II (Progres)</div>
                  <div className="text-3xl font-black text-slate-900">30%</div>
                  <div className="text-xs font-bold text-slate-800">Selesai Produksi & Siap Kirim</div>
                  <p className="text-xs text-slate-600">
                    Dibayarkan setelah Klien menerima dokumentasi foto/video assembly furniture selesai di workshop Jepara sebelum dimuat ke armada ekspedisi.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Termin III (Pelunasan)</div>
                  <div className="text-3xl font-black text-slate-900">20%</div>
                  <div className="text-xs font-bold text-slate-800">Serah Terima BAST Lapangan</div>
                  <p className="text-xs text-slate-600">
                    Dibayarkan setelah furniture terpasang rapi di hunian Anda, diperiksa bersama, dan Berita Acara Serah Terima (BAST) ditandatangani.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                <CreditCard size={18} className="text-slate-800 shrink-0" />
                <span>Seluruh pembayaran resmi HANYA ditransfer ke rekening bank resmi atas nama perusahaan/owner yang tercantum sah di lembar invoice resmi AGMAL JAYA INTERIOR.</span>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 5 */}
            <section id="spesifikasi-material" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 5
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                5. Standar Material & Presisi Produksi Jepara
              </h2>
              <p>
                AGMAL JAYA INTERIOR berkomitmen menggunakan bahan baku grade tertinggi dan menolak penggunaan serbuk kayu olahan rapuh (seperti MDF murah atau particle board mudah hancur kena air):
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2 text-xs sm:text-sm">
                <li><strong className="text-slate-800">Core Material:</strong> Multiplek / Plywood Meranti Kualitas Premium (Tebal 18mm & 15mm) yang padat, tahan lembab, dan tahan beban berat.</li>
                <li><strong className="text-slate-800">Laminasi Finishing:</strong> HPL (High Pressure Laminate) merk terverifikasi (Taco, Carta, Aica, atau Arborite) dengan lem khusus tahan panas dan edging PVC tebal mesin otomatis.</li>
                <li><strong className="text-slate-800">Hardware & Aksesoris:</strong> Menggunakan engsel sendok hidrolik soft-close (anti-banting) dan rel laci double-track tandem yang telah lulus uji ketahanan puluhan ribu kali buka-tutup.</li>
                <li><strong className="text-slate-800">Toleransi Presisi:</strong> Mengingat kondisi dinding bangunan sipil tidak selalu 100% tegak lurus, kami menerapkan toleransi fitting on-site 2-5mm menggunakan filler cover rapi sewarna HPL.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 6 */}
            <section id="lead-time" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 6
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                6. Waktu Produksi (Lead Time) & Pengiriman
              </h2>
              <p>
                Waktu pengerjaan dihitung sejak Pembayaran Termin I (DP) diterima dan desain kerja 3D disetujui secara tertulis:
              </p>
              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Durasi Produksi Normal:</strong>
                  14 hingga 30 hari kerja untuk volume residensial standar (kitchen set, wardrobe, backdrop TV). Untuk proyek komersial skala besar, durasi akan disesuaikan di dalam klausul SPK.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Armada Logistik Pengiriman:</strong>
                  Pengiriman dilakukan dari sentra workshop Jepara menggunakan armada truk khusus furniture tertutup dengan proteksi foam wrap lapis ganda dan kardus siku pelindung sudut.
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 7 */}
            <section id="revisi-pekerjaan" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 7
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                7. Revisi Desain & Pekerjaan Tambah Kurang
              </h2>
              <p>
                Sebelum SPK ditandatangani, Klien berhak atas maksimal <strong>3 (tiga) kali revisi minor</strong> visual 3D (seperti pergantian kode warna HPL, tata letak sekat rak, atau model handle).
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <strong className="text-amber-950 block">Pekerjaan Tambah Kurang Setelah SPK (Addendum):</strong>
                <p>
                  Jika Klien meminta penambahan volume meter lari, perubahan total bentuk yang sudah dalam proses potong kayu di workshop, atau upgrade aksesoris mewah, biaya dan tambahan waktu pengerjaan akan dihitung terpisah melalui <strong>Lembar Addendum SPK</strong> yang disetujui kedua pihak.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 8 */}
            <section id="instalasi-serah-terima" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 8
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                8. Pelaksanaan Instalasi & Serah Terima (BAST)
              </h2>
              <p>
                Saat tahap perakitan di lokasi hunian:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2 text-xs sm:text-sm">
                <li><strong>Kesiapan Lokasi & Utilitas:</strong> Klien bertanggung jawab memastikan ketersediaan akses listrik, air kerja, dan izin kerja / loading dock (khusus apartemen atau perumahan cluster tertentu).</li>
                <li><strong>Pemeriksaan Fisik Bersama:</strong> Setelah tim installer menyelesaikan pemasangan, kedua pihak melakukan checklist bersama (kelancaran rel laci, engsel pintu, kerapian lis sealant, dan fungsi lampu LED).</li>
                <li><strong>Penandatanganan BAST:</strong> Penandatanganan Berita Acara Serah Terima menandakan bahwa furniture telah diterima dalam kondisi prima sesuai desain yang disepakati.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Section 9 */}
            <section id="garansi-purnajual" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 9
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                9. Kebijakan Garansi Konstruksi 12 Bulan
              </h2>
              <p>
                Kami memberikan <strong>Garansi Resmi 12 Bulan (1 Tahun)</strong> terhitung sejak tanggal penandatanganan BAST untuk memberikan rasa tenang maksimal:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                  <div className="font-bold text-teal-900 text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-teal-600" /> Hal yang Dijamin (Covered):
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Kerusakan konstruksi kabinet akibat cacat produksi workshop</li>
                    <li>Laminasi HPL yang terkelupas bukan karena paparan air rembesan luar</li>
                    <li>Kerusakan mekanis engsel slow-motion & rel laci dalam pemakaian normal</li>
                    <li>Penyetelan ulang posisi pintu kabinet yang bergeser</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-600" /> Pengecualian Garansi (Void):
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Kerusakan akibat kebocoran pipa air tanam gedung atau banjir hunian</li>
                    <li>Beban muatan berlebih di luar kapasitas wajar kabinet</li>
                    <li>Serangan hama rayap yang bersumber dari struktur lantai/dinding lama</li>
                    <li>Bencana alam, kebakaran, atau kelalaian pemakaian pihak ketiga</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 10 */}
            <section id="pembatalan-refund" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 10
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                10. Pembatalan Pesanan & Pengembalian Dana (Refund)
              </h2>
              <p>
                Karena seluruh produk kami diproduksi secara <em>100% Made-to-Order Custom</em> berdasarkan ukuran spesifik ruangan hunian Anda:
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Pembatalan Sebelum Produksi:</strong> Jika Klien membatalkan pesanan sebelum material dipotong, DP dapat dikembalikan setelah dikurangi biaya operasional survei lapangan dan biaya hak cipta gambar kerja 3D (sebesar 15% dari total nilai SPK).
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Pembatalan Setelah Bahan Dipotong:</strong> Apabila bahan baku multiplek telah dipotong sesuai ukuran ruangan Anda di workshop, DP yang telah disetorkan tidak dapat dikembalikan (non-refundable) karena material tidak dapat digunakan kembali untuk proyek lain.
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 11 */}
            <section id="hak-cipta" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 11
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                11. Hak Cipta & Dokumentasi Portofolio
              </h2>
              <p>
                Seluruh gambar 3D render, sketsa teknis, dan rancangan arsitektur yang dibuat oleh AGMAL JAYA INTERIOR adalah hak kekayaan intelektual kami dan dilindungi oleh undang-undang hak cipta.
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Kami berhak mendokumentasikan foto dan video hasil akhir pengerjaan interior untuk keperluan portofolio resmi di website dan media sosial kami, dengan tetap menjunjung tinggi privasi Klien (tidak mempublikasikan identitas pribadi, plat nomor, atau barang berharga pribadi Klien).
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Section 12 */}
            <section id="hukum-sengketa" className="scroll-mt-28 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                Pasal 12
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                12. Hukum yang Berlaku & Penyelesaian Sengketa
              </h2>
              <p>
                Perjanjian ini diatur dan ditafsirkan berdasarkan hukum Negara Republik Indonesia.
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Apabila di kemudian hari timbul perselisihan atau perbedaan penafsiran dalam pelaksanaan proyek, kedua belah pihak sepakat untuk menyelesaikannya secara <strong>musyawarah untuk mufakat</strong> dengan asas kekeluargaan dan profesionalisme tinggi. Jika musyawarah tidak mencapai mufakat, sengketa akan diselesaikan melalui domisili hukum di Pengadilan Negeri Jepara, Jawa Tengah.
              </p>

              {/* Company Info Box */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 mt-6">
                <div className="font-bold text-lg text-amber-300">
                  AGMAL JAYA INTERIOR — Legal & Project Management
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Sentra Workshop & Legal:</strong>
                      {address}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">WhatsApp Resmi Manajemen:</strong>
                      <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline">
                        {phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Korespondensi Surat & SPK:</strong>
                      <a href={`mailto:${email}`} className="text-amber-300 hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Jangkauan Proyek:</strong>
                      Seluruh Wilayah Indonesia (Jabodetabek, Jawa, Bali, Sumatera, Kalimantan, Sulawesi)
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>

        </div>
      </div>

      <Footer cmsData={settings || undefined} />

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#b08d57] text-white shadow-2xl shadow-[#b08d57]/30 hover:bg-[#9a7642] transition-all duration-300 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Kembali ke atas"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
}
