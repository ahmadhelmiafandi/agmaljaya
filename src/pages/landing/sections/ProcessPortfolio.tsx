import React, { useState, useEffect } from 'react';
import { 
    MousePointerClick, CalendarCheck, Wrench, PartyPopper, X, 
    Maximize2, Instagram, ArrowRight, CircleDollarSign, Info,
    ChevronDown, ChevronUp 
} from 'lucide-react';

interface SectionProps {
    cmsData?: any;
}

interface PortfolioItem {
    span: string;
    img: string;
    title: string;
    desc: string;
    category: string;
    price?: string;
}

export function HowItWorks({ cmsData }: SectionProps) {
    const defaultSteps = [
        {
            icon: <MousePointerClick className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Konsultasi Online',
            desc: 'Hubungi kami via WhatsApp untuk konsultasi desain, masukkan ukuran ruangan, dan dapatkan estimasi harga.',
            color: 'bg-indigo-600',
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Survey Lokasi',
            desc: 'Tim ukur profesional Agmal Jaya Interior akan datang mensurvey ruang Anda untuk sinkronisasi layout.',
            color: 'bg-teal-500',
        },
        {
            icon: <Wrench className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Produksi Workshop',
            desc: 'Pengerjaan 1-3 minggu di fasilitas mandiri (workshop kami) dengan material custom.',
            color: 'bg-amber-500',
        },
        {
            icon: <PartyPopper className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Instalasi',
            desc: 'Pemasangan rapi dan cepat minimal debu. Ruangan baru Anda siap digunakan.',
            color: 'bg-rose-500',
        },
    ];

    const stepsData = cmsData?.steps || (Array.isArray(cmsData) ? cmsData : null);
    const finalSteps = stepsData && stepsData.length > 0 ? stepsData.map((s: any, i: number) => ({
        ...s,
        icon: defaultSteps[i % defaultSteps.length].icon,
        color: defaultSteps[i % defaultSteps.length].color
    })) : defaultSteps;

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 lg:mb-20 space-y-4 reveal">
                    <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{cmsData?.badge || "Alur Kerja Mudah"}</div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">{cmsData?.heading || "Cara Kerja Pemesanan"}</h2>
                </div>

                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden lg:block rounded-full"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-8">
                        {finalSteps.map((step: any, idx: number) => (
                            <div key={idx} className={`relative group p-4 md:p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 reveal reveal-delay-${(idx+1)*100}`}>
                                <div className="mx-auto w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg relative z-10 mb-6 md:mb-8 border border-white" style={{ backgroundColor: 'var(--tw-colors-slate-50)' }}>
                                    <div className={`absolute inset-1 rounded-xl ${step.color} flex items-center justify-center shadow-inner group-hover:shadow-[0_0_20px_var(--color-current)]`}>
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-900 border-2 border-white text-white font-bold text-xs md:text-sm flex items-center justify-center shadow-md">
                                        {idx + 1}
                                    </div>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">{step.title}</h3>
                                <p className="text-sm md:text-base text-slate-500 font-light leading-relaxed px-2 md:px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Portfolio({ cmsData, contactData }: SectionProps & { contactData?: any }) {
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedItem]);
    const defaultWorks = [
        { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-01.jpg', title: 'Kitchen Set Minimalis L-Shape', desc: 'Kitchen set L-Shape serba putih dengan panel WPC fluted vertical, rak display terbuka berpencahayaan LED, dan meja kerja built-in. Material HPL premium anti-gores dengan finishing doff elegan.', category: 'Kitchen Set', price: 'Rp 18.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-02.jpg', title: 'Backdrop TV & Living Room Mewah', desc: 'Backdrop TV full ceiling dengan kombinasi panel geometris HPL dan cermin perunggu. Dilengkapi kabinet TV floating kayu walnut, LED strip tersembunyi, dan rak display samping.', category: 'Living Room', price: 'Rp 25.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-03.jpg', title: 'Set Kamar Tidur Pink Elegant', desc: 'Interior kamar tidur dengan headboard upholstery pink dusty, lemari wardrobe full ceiling dengan cermin bronze, meja nakas floating, dan LED cove lighting di plafon.', category: 'Bedroom', price: 'Rp 22.000.000' },
        { span: 'col-span-2 row-span-1', img: '/images/portfolio/portfolio-04.jpg', title: 'Kitchen Set dengan Mini Bar', desc: 'Kitchen set straight dengan kabinet atas bermotif wood grain dan fluted panel, backsplash marble, island mini bar dengan top marmer putih. Dilengkapi cooker hood dan rak piring terintegrasi.', category: 'Kitchen Set', price: 'Rp 15.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-05.jpg', title: 'Lemari Pakaian Klasik Putih', desc: 'Lemari pakaian 5 pintu gaya klasik dengan finishing cat duco putih, aksen gold list, dan lemari pajangan kaca samping. Nakas klasik dengan handle gold menambah kesan mewah.', category: 'Bedroom', price: 'Rp 16.000.000' },
        { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-06.jpg', title: 'Kitchen Set Premium Full Ceiling', desc: 'Kitchen set I-Shape premium dengan kabinet bawah panel shaker putih, kabinet atas kaca frame gold dengan backlit marble, rak display kayu, dan ceiling fluted panel. Material multiplek Grade A.', category: 'Kitchen Set', price: 'Rp 28.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-07.jpg', title: 'Kitchen Set Kabinet Kaca Gold', desc: 'Kitchen set mewah dengan upper cabinet kaca frame gold bermotif marmer backlit, lower cabinet shaker putih, dan middle cabinet kaca hitam. Finishing detail premium.', category: 'Kitchen Set', price: 'Rp 30.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-08.jpg', title: 'Kitchen Set Mint Green L-Shape', desc: 'Kitchen set L-Shape dengan HPL hijau mint segar, fluted panel ceiling, rak piring built-in, LED under-cabinet, dan backsplash marble. Sudah termasuk cooker hood dan pemasangan.', category: 'Kitchen Set', price: 'Rp 17.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-09.jpg', title: 'Partisi Ruangan & Lemari Display Gold', desc: 'Partisi ruangan mewah dengan cutting laser motif geometris gold, lemari display terbuka berpencahayaan LED, dan kabinet penyimpanan bawah. Plafon drop ceiling melengkungkan desain.', category: 'Partisi & Display', price: 'Rp 20.000.000' },
        { span: 'col-span-2 row-span-1', img: '/images/portfolio/portfolio-10.jpg', title: 'Kitchen Set Island Modern Abu-Abu', desc: 'Desain 3D render kitchen set U-Shape warna abu-abu gelap dengan island marble putih, fluted panel kabinet atas dengan kaca reeded, slot microwave dan dispenser terintegrasi.', category: 'Kitchen Set', price: 'Rp 35.000.000' },
        { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-11.jpg', title: 'Kitchen Set U-Shape Coklat Tua', desc: 'Kitchen set U-Shape dengan backsplash panel fluted kayu coklat gelap, LED strip ambient, skylight alami, dan kabinet bawah HPL abu-abu. Desain luas cocok untuk dapur besar.', category: 'Kitchen Set', price: 'Rp 24.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-12.jpg', title: 'Kitchen Set Straight Dark Mocha', desc: 'Kitchen set straight dengan warna dark mocha elegan, backsplash marble hitam, LED strip bawah kabinet, rak terbuka samping, dan finishing HPL premium anti-gores.', category: 'Kitchen Set', price: 'Rp 14.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-13.jpg', title: 'Kitchen Set Klasik Biru Navy', desc: 'Kitchen set gaya klasik dengan finishing cat duco biru navy, aksen gold, kabinet atas krem dengan rak display LED, island marmer putih, dan slot kulkas terintegrasi.', category: 'Kitchen Set', price: 'Rp 32.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-14.jpg', title: 'Kitchen Set & Meja Kerja Putih', desc: 'Kombinasi kitchen set L-Shape minimalis putih dengan meja kerja built-in dan panel WPC fluted vertical berpencahayaan LED. Desain multifungsi untuk hunian compact.', category: 'Kitchen Set', price: 'Rp 18.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-15.jpg', title: 'Meja Meeting Kantor Custom', desc: 'Meja meeting custom dengan top HPL motif kayu oak dan glass insert biru muda, built-in cable management, serta kaki besi powder coating putih. Wall panel akustik biru navy.', category: 'Furniture Kantor', price: 'Rp 8.000.000' },
        { span: 'col-span-2 row-span-1', img: '/images/portfolio/portfolio-16.jpg', title: 'Interior Kantor & Pantry', desc: 'Desain interior kantor lengkap meliputi pantry dengan kabinet kayu dan HPL biru navy, area workstation, serta storage terbuka. Cocok untuk kantor startup dan korporat.', category: 'Furniture Kantor', price: 'Rp 45.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-17.jpg', title: 'Ruang Kerja Kantor Modern', desc: 'Meja kerja custom minimalis dengan pedestal samping, wall panel kombinasi kayu dan concrete, rak display industrial, serta partisi perforated metal hitam.', category: 'Furniture Kantor', price: 'Rp 12.000.000' },
        { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-18.jpg', title: 'Ruang Direktur & Lounge', desc: 'Interior ruang direktur dengan meja kerja L-Shape, sofa lounge biru navy, coffee table custom, storage kabinet, dan wall panel kombinasi HPL kayu dan fluted navy.', category: 'Furniture Kantor', price: 'Rp 35.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-19.jpg', title: 'Meja Resepsionis Custom', desc: 'Meja resepsionis kantor PT. Inti Power Abadi dengan desain melengkung, kombinasi HPL kayu dan putih, backdrop batu alam berpencahayaan LED, serta area lounge tamu.', category: 'Furniture Kantor', price: 'Rp 15.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-20.jpg', title: 'Lobby & Front Office', desc: 'Area lobby kantor dengan meja resepsionis curved custom, sofa abu-abu dengan stool accent, panel dinding fluted navy, cermin dekoratif, dan pencahayaan track light.', category: 'Furniture Kantor', price: 'Rp 18.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-21.jpg', title: 'Resepsionis & Waiting Area', desc: 'Sudut pandang luas area resepsionis dengan meja front desk HPL kayu-putih, backdrop logo batu alam backlit, wall panel, dan area waiting room dengan sofa nyaman.', category: 'Furniture Kantor', price: 'Rp 18.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-22.jpg', title: 'Wardrobe Walk-in & Meja Rias', desc: 'Walk-in wardrobe open concept dengan rak bertingkat, laci penyimpanan, gantungan pakaian, LED strip per rak, dan meja rias built-in samping. Material multiplek finishing HPL kayu.', category: 'Bedroom', price: 'Rp 16.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-23.jpg', title: 'Kamar Tidur Anak Japandi', desc: 'Kamar tidur anak bergaya Japandi dengan bed frame storage rotan anyam, headboard arch motif, meja belajar built-in dengan LED, rak dinding, dan lemari pakaian.', category: 'Bedroom', price: 'Rp 19.000.000' },
        { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-24.jpg', title: 'Lemari & Meja Rias Modern', desc: 'Lemari pakaian full ceiling dengan handle hitam minimalis, meja rias built-in dengan cermin dan rak display LED backlit, serta panel WPC fluted putih sebagai backdrop.', category: 'Bedroom', price: 'Rp 14.000.000' },
    ];

    const worksData = cmsData?.works || (Array.isArray(cmsData) ? cmsData : null);
    const works = (worksData && worksData.length >= 20 ? worksData : defaultWorks).map((w: any, i: number) => ({
        ...w,
        img: (!w.img || w.img.includes('unsplash.com')) ? defaultWorks[i % defaultWorks.length].img : w.img,
        span: defaultWorks[i] ? defaultWorks[i].span : 'col-span-1 row-span-1',
        desc: w.desc || (defaultWorks[i] ? defaultWorks[i].desc : 'Project interior berkualitas tinggi dari AGMAL JAYA INTERIOR.'),
        category: w.category || (defaultWorks[i] ? defaultWorks[i].category : 'Custom Furniture'),
        price: w.price || (defaultWorks[i] ? defaultWorks[i].price : null)
    }));

    const [visibleCount, setVisibleCount] = useState(6);
    const visibleWorks = works.slice(0, visibleCount);

    return (
        <section id="portfolio" className="py-12 md:py-20 lg:py-24 bg-[#fdfaf6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8 reveal">
                    <div className="space-y-3 md:space-y-4">
                        <div className="text-xs md:text-sm font-bold text-teal-600 uppercase tracking-[0.3em]">{cmsData?.badge || "Signature Collection"}</div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">{cmsData?.heading || "Mahakarya Kami"}</h2>
                        <p className="text-slate-500 text-base md:text-lg font-light max-w-md italic">"{cmsData?.tagline || "Setiap sudut ruangan memiliki cerita, dan kami di sini untuk menulisnya bersama Anda."}"</p>
                    </div>
                    <a 
                        href={contactData?.instagram || "https://www.instagram.com/agmal_jaya?stkn=em1kZnZleWx4anV2"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white text-slate-800 rounded-full text-sm md:text-base font-bold hover:shadow-lg hover:-translate-y-1 transition-all group border border-slate-200/60"
                    >
                        <span>Eksplorasi di Instagram</span>
                        <Instagram size={18} className="group-hover:scale-110 transition-transform text-rose-500" />
                    </a>
                </div>

                {/* Symmetrical Clean Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {visibleWorks.map((w: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedItem(w)}
                            className="group relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-[320px] sm:h-[350px] md:h-[380px] bg-slate-900 border border-slate-100"
                        >
                            <img 
                                src={w.img} 
                                alt={w.title} 
                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700" 
                            />
                            
                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                                    {w.category}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Maximize2 size={15} />
                                </div>
                            </div>

                            {/* Bottom Content Overlay */}
                            <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-6 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent">
                                <div className="space-y-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-snug line-clamp-2">
                                        {w.title}
                                    </h3>
                                    {w.price && (
                                        <div className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-wide">
                                            {w.price}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {works.length > 6 && (
                    <div className="mt-12 md:mt-16 text-center space-y-3">
                        {visibleCount < works.length ? (
                            <button
                                onClick={() => setVisibleCount((prev: number) => Math.min(prev + 6, works.length))}
                                className="inline-flex items-center gap-2.5 px-8 py-3.5 md:px-10 md:py-4 bg-slate-900 hover:bg-teal-700 text-white rounded-full font-bold text-xs sm:text-sm md:text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 group"
                            >
                                <span>Lihat Lebih Banyak Proyek</span>
                                <span className="px-2.5 py-0.5 text-xs bg-white/20 rounded-full font-bold">
                                    +{works.length - visibleCount}
                                </span>
                                <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setVisibleCount(6);
                                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow transition-all active:scale-95"
                            >
                                <span>Tampilkan Lebih Sedikit</span>
                                <ChevronUp size={16} />
                            </button>
                        )}
                        <p className="text-xs md:text-sm text-slate-400 font-light">
                            Menampilkan {Math.min(visibleCount, works.length)} dari {works.length} karya kami
                        </p>
                    </div>
                )}

                {/* Price Highlight Note */}
                <div className="mt-8 md:mt-10 flex justify-center px-4">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl md:rounded-full bg-amber-50/70 border border-amber-200/80 shadow-xs text-xs sm:text-sm text-slate-700 max-w-2xl text-center sm:text-left">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 hidden sm:inline-block"></span>
                        <p className="leading-relaxed">
                            <span className="font-bold text-slate-900">*Estimasi harga awal.</span> Biaya final disepakati transparan melalui rincian <span className="font-bold text-slate-900 bg-amber-200/60 px-1.5 py-0.5 rounded">RAB resmi</span> setelah survey lokasi &amp; pemilihan material.
                        </p>
                    </div>
                </div>
            </div>

            {/* Refined Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 lg:p-12">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500" onClick={() => setSelectedItem(null)}></div>
                    
                    <div className="bg-white w-full max-w-5xl rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col lg:flex-row h-auto max-h-[90vh] animate-modal-in border border-white/10">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white lg:text-slate-900 lg:bg-slate-100 lg:hover:bg-slate-200 transition-all z-30 shadow-lg"
                        >
                            <X size={20} className="md:w-6 md:h-6" />
                        </button>
                        
                        {/* Left: Image */}
                        <div className="w-full lg:w-3/5 h-48 md:h-64 lg:h-auto overflow-hidden relative">
                            <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                <span className="bg-teal-600 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg">
                                    {selectedItem.category}
                                </span>
                            </div>
                        </div>
                        
                        {/* Right: Content */}
                        <div className="w-full lg:w-2/5 p-6 md:p-8 lg:p-12 flex flex-col justify-between overflow-y-auto bg-white">
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 md:mb-4 leading-tight tracking-tight">
                                        {selectedItem.title}
                                    </h3>
                                    <div className="h-1 w-10 md:w-12 bg-teal-600 mb-4 md:mb-6 rounded-full"></div>
                                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                        {selectedItem.desc}
                                    </p>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    {/* Estimated Price */}
                                    {selectedItem.price && (
                                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-amber-50 border border-amber-100">
                                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                                <CircleDollarSign size={18} className="md:w-5 md:h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estimasi Harga</p>
                                                <p className="text-sm md:text-base font-extrabold text-amber-700">{selectedItem.price}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                                            <CalendarCheck size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                            <p className="text-xs md:text-sm font-bold text-slate-800">Selesai & Terpasang</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                            <Wrench size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Material</p>
                                            <p className="text-xs md:text-sm font-bold text-slate-800">Premium HPL Finishing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 md:pt-6 space-y-3">
                                <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] sm:text-xs text-slate-700 leading-relaxed text-center">
                                    <span className="font-bold text-slate-900">*Estimasi harga awal.</span> Biaya final disepakati transparan melalui rincian <span className="font-bold text-slate-900 bg-amber-200/60 px-1.5 py-0.5 rounded">RAB resmi</span> setelah survey lokasi &amp; pemilihan material.
                                </div>

                                <a 
                                    href={`https://wa.me/${contactData?.phone?.replace(/[^0-9]/g, "") || "6285113723808"}?text=Halo AGMAL JAYA INTERIOR, saya menyukai proyek: ${selectedItem.title}. Boleh tanya estimasi harganya?`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-4 py-2.5 md:py-3 bg-teal-600 text-white rounded-xl text-sm md:text-base font-bold flex justify-center items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 active:scale-95"
                                >
                                    Konsultasi Desain Ini
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
