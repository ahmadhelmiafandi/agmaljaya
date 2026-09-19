import React, { useState, useEffect } from 'react';
import { 
    ArrowRight, 
    Laptop, 
    Maximize, 
    CircleDollarSign, 
    CheckCircle2, 
    Check, 
    Layers, 
    FileDown, 
    CalendarRange 
} from 'lucide-react';

interface SectionProps {
    cmsData?: any;
}

export function Products({ cmsData }: SectionProps) {
    const defaultProducts = [
        {
            title: 'Kitchen Set Minimalis',
            img: '/images/kitchen-set.jpg',
            features: 'L-Shape / U-Shape, Anti-Rayap (PVC/Blockboard), Engsel Soft-close',
        },
        {
            title: 'Lemari Pakaian Wardrobe',
            img: '/images/wardrobe.jpg',
            features: 'Full Plafon 3 Meter, Cermin Terintegrasi, LED Strip Sensor',
        },
        {
            title: 'Meja Kerja & Belajar',
            img: '/images/study-desk.jpg',
            features: 'Ruang Penyimpanan, Cable Management, Desain Ergonomis',
        },
        {
            title: 'Kabinet Rak TV',
            img: '/images/tv-cabinet.jpg',
            features: 'Floating Design, Hidden Storage, Back panel HPL',
        },
    ];

    const rawProducts = Array.isArray(cmsData) && cmsData.length > 0 ? cmsData : defaultProducts;
    const products = rawProducts.map((p: any, i: number) => ({
        ...p,
        img: (!p.img || p.img.includes('unsplash.com')) ? defaultProducts[i % defaultProducts.length].img : p.img
    }));


    return (
        <section id="produk" className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-14 lg:mb-16 gap-4 md:gap-6 reveal">
                    <div className="max-w-xl">
                        <div className="text-xs md:text-sm font-bold text-teal-600 uppercase tracking-widest mb-3 md:mb-4">Katalog Produk</div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">Furniture yang dirancang <br />untuk ruangan nyata Anda.</h2>
                    </div>
                    <p className="text-slate-500 max-w-sm md:text-right font-light text-sm md:text-base leading-relaxed">
                        Pilih jenis produk yang ingin dibuat, masukkan ukuran Anda, dan kami akan menyesuaikan proporsinya.
                    </p>
                </div>

                {/* Mobile Slider / Desktop Grid */}
                <div className="flex md:grid md:grid-cols-2 gap-6 lg:gap-10 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                    {products.map((p: any, i: number) => (
                        <div 
                            key={i} 
                            className={`group overflow-hidden rounded-2xl md:rounded-3xl relative h-[420px] md:h-[450px] lg:h-[550px] shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 reveal reveal-delay-${(i+1)*100}`}
                        >
                            <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                            <div className="absolute inset-0 p-5 md:p-6 lg:p-8 flex flex-col justify-end transform md:group-hover:-translate-y-2 transition-transform duration-500">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-0 leading-tight">{p.title}</h3>
                                
                                {/* Features: Auto-show on mobile, hover-show on desktop */}
                                <div className="max-h-48 opacity-100 md:max-h-0 md:opacity-0 overflow-hidden md:group-hover:max-h-48 md:group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                    <ul className="space-y-1.5 md:space-y-2 pt-3 md:pt-4 pb-2">
                                        {(typeof p.features === 'string' ? p.features.split(',') : p.features || []).map((feat: any, idx: number) => (
                                            <li key={idx} className="flex items-center text-slate-300 font-medium text-xs md:text-[13px] gap-2">
                                                <CheckCircle2 size={14} className="text-teal-400 shrink-0" /> {feat.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <a href="#kontak" className="flex items-center gap-2 cursor-pointer text-indigo-300 hover:text-indigo-200 uppercase text-[11px] md:text-[12px] font-bold tracking-wider mt-2">
                                    Konsultasi Sekarang &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Scroll Indicator */}
                <div className="flex md:hidden justify-center gap-2 mt-2">
                    {products.map((_: any, i: number) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    ))}
                </div>
            </div>
        </section>
    );
}
