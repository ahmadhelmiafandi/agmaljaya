import React, { useState, useEffect } from 'react';
import { MousePointerClick, CalendarCheck, Wrench, PartyPopper, X, Maximize2, Instagram, ArrowRight } from 'lucide-react';

interface SectionProps {
    cmsData?: any;
}

interface PortfolioItem {
    span: string;
    img: string;
    title: string;
    desc: string;
    category: string;
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
        { span: 'col-span-1 row-span-2', img: '/images/kitchen-set.jpg', title: 'Modern Minimalist Kitchen', desc: 'Dapur minimalis dengan material HPL premium dan pencahayaan cerdas yang menciptakan suasana hangat namun tetap fungsional.', category: 'Kitchen Set' },
        { span: 'col-span-1 row-span-1', img: '/images/living-room.jpg', title: 'Cozy Living Area', desc: 'Ruang tamu yang hangat dengan sentuhan kayu solid dan desain ergonomis untuk kenyamanan keluarga.', category: 'Living Room' },
        { span: 'col-span-1 row-span-1', img: '/images/wardrobe.jpg', title: 'Master Bedroom Wardrobe', desc: 'Lemari pakaian custom yang memaksimalkan setiap jengkal ruang penyimpanan kamar tidur utama.', category: 'Bedroom' },
        { span: 'col-span-2 row-span-1', img: '/images/tv-cabinet.jpg', title: 'Open Space TV Setup', desc: 'Instalasi TV gantung dengan backdrop HPL bermotif serat kayu alami dan laci penyimpanan tersembunyi.', category: 'Entertainment' },
    ];

    const worksData = cmsData?.works || (Array.isArray(cmsData) ? cmsData : null);
    const works = (worksData && worksData.length > 0 ? worksData : defaultWorks).map((w: any, i: number) => ({
        ...w,
        img: (!w.img || w.img.includes('unsplash.com')) ? defaultWorks[i % defaultWorks.length].img : w.img,
        span: defaultWorks[i] ? defaultWorks[i].span : 'col-span-1 row-span-1',
        desc: w.desc || (defaultWorks[i] ? defaultWorks[i].desc : 'Project interior berkualitas tinggi dari AGMAL JAYA INTERIOR.'),
        category: w.category || (defaultWorks[i] ? defaultWorks[i].category : 'Custom Furniture')
    }));

    return (
        <section id="portfolio" className="py-12 md:py-20 lg:py-24 bg-[#fdfaf6]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-14 lg:mb-16 gap-6 md:gap-8 reveal">
                    <div className="space-y-3 md:space-y-4">
                        <div className="text-xs md:text-sm font-bold text-teal-600 uppercase tracking-[0.3em]">{cmsData?.badge || "Signature Collection"}</div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">{cmsData?.heading || "Mahakarya Kami"}</h2>
                        <p className="text-slate-500 text-base md:text-lg font-light max-w-md italic">"{cmsData?.tagline || "Setiap sudut ruangan memiliki cerita, dan kami di sini untuk menulisnya bersama Anda."}"</p>
                    </div>
                    <a 
                        href={contactData?.instagram || "https://instagram.com/agmaljaya_interior"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white text-slate-800 rounded-full text-sm md:text-base font-bold hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                        <span>Eksplorasi di Instagram</span>
                        <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                    </a>
                </div>

                {/* Magazine Grid */}
                <div className="flex md:grid md:grid-cols-3 md:auto-rows-[280px] gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-12 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                    {works.map((w: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedItem(w)}
                            className={`
                                relative rounded-[2rem] overflow-hidden group shadow-lg transition-all duration-700 
                                shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-center cursor-pointer magazine-card
                                ${w.span} ${w.span.includes('col-span-2') ? 'md:col-span-2' : ''} 
                                h-[420px] md:h-auto reveal reveal-delay-${(i+1)*100}
                                border border-white/40
                            `}
                        >
                            <img src={w.img} alt={w.title} className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000" />
                            
                            <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-6 lg:p-8 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent">
                                <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-[9px] md:text-[10px] font-bold text-teal-300 uppercase tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 md:px-3 rounded-full border border-white/20 inline-block">{w.category}</span>
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-white leading-tight">
                                        {w.title}
                                    </h3>
                                    <div className="h-0.5 w-8 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>

                            {/* Hover/Mobile Overlay Icon */}
                            <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-slate-900 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-100 md:scale-50 md:group-hover:scale-100 shadow-lg">
                                <Maximize2 size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Slider Dots Indicator */}
                <div className="flex md:hidden justify-center gap-2.5 mt-4">
                    {works.map((_: any, i: number) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-slate-300"></div>
                    ))}
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

                            <div className="pt-6 md:pt-10">
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
