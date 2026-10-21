import React, { useState } from 'react';
import { Star, ChevronDown, Quote, ChevronUp } from 'lucide-react';

interface SectionProps {
    cmsData?: any[];
}

export function Team({ cmsData }: { cmsData?: any }) {
    const members = Array.isArray(cmsData) ? cmsData : (cmsData?.items || []);

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="text-center mb-16 space-y-4 reveal">
                <div className="text-xs md:text-sm font-bold text-teal-600 uppercase tracking-widest">{!Array.isArray(cmsData) && cmsData?.badge ? cmsData.badge : "Tim AGMAL JAYA INTERIOR"}</div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900">{!Array.isArray(cmsData) && cmsData?.heading ? cmsData.heading : "Tim Profesional Kami"}</h2>
            </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
                    {members.map((m: any, i: number) => (
                        <div 
                            key={i} 
                            className={`group w-full max-w-[280px] sm:max-w-[300px] bg-slate-50/50 hover:bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 hover:border-teal-200/80 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center reveal reveal-delay-${(i+1)*100}`}
                        >
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-5 shadow-md border-4 border-white bg-white flex items-center justify-center p-3.5 relative group-hover:scale-105 transition-transform duration-500">
                                <img 
                                    src={(!m.img || m.img.includes('unsplash.com')) ? '/brand/logo-icon-dark.png' : m.img} 
                                    alt={m.name} 
                                    className="w-full h-full object-contain transition-all duration-500" 
                                />
                                <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                                {m.name}
                            </h3>
                            <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold text-xs border border-teal-100 mt-1">
                                {m.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Testimonials({ cmsData }: { cmsData?: any }) {
    const reviews = Array.isArray(cmsData) ? cmsData : (cmsData?.items || []);
    const [showAll, setShowAll] = useState(false);
    const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

    return (
        <section id="testimonials" className="py-12 md:py-20 lg:py-24 bg-slate-900 relative">
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-slate-900 to-transparent"></div>
            <div className="max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="reveal">
                        <div className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-4">{!Array.isArray(cmsData) && cmsData?.badge ? cmsData.badge : "Ulasan Klien"}</div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">{!Array.isArray(cmsData) && cmsData?.heading ? cmsData.heading : "Apa Kata Mereka"}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-8">
                    {visibleReviews.map((r: any, i: number) => (
                        <div key={i} className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 relative shadow-xl transform md:hover:-translate-y-2 transition-transform duration-300 w-full reveal">
                            <Quote className="absolute top-6 right-6 text-slate-700 opacity-50" size={40} />
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} className="fill-amber-400 text-amber-400" />)}
                            </div>
                            <p className="text-base md:text-lg text-slate-300 italic mb-8 leading-relaxed font-light z-10 relative">"{r.text}"</p>
                            <div className="border-t border-slate-700 pt-6">
                                <h4 className="font-bold text-white mb-1">{r.name}</h4>
                                <p className="text-sm text-slate-400">{r.loc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {reviews.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => {
                                if (showAll) {
                                    // Beri jeda sedikit agar efek scroll halus sebelum DOM berubah mengecil
                                    setTimeout(() => {
                                        document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }, 10);
                                }
                                setShowAll(!showAll);
                            }}
                            className="px-8 py-3 bg-transparent text-slate-300 hover:text-white font-bold transition-all uppercase tracking-widest text-xs hover:underline underline-offset-8"
                        >
                            {showAll ? (
                                <span className="flex items-center gap-2">Tampilkan Lebih Sedikit <ChevronUp size={16} /></span>
                            ) : (
                                <span className="flex items-center gap-2">Lihat Semua Testimoni <ChevronDown size={16} /></span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export function FAQ({ cmsData }: { cmsData?: any }) {
    const faqs = Array.isArray(cmsData) ? cmsData : (cmsData?.items || []);

    const [open, setOpen] = useState(0);

    return (
        <section id="faq" className="py-12 md:py-20 lg:py-24 bg-slate-50">
            <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900">{!Array.isArray(cmsData) && cmsData?.heading ? cmsData.heading : "Pertanyaan Umum"}</h2>
                    <p className="text-slate-500 font-light text-lg">{!Array.isArray(cmsData) && cmsData?.subheading ? cmsData.subheading : "Jawaban untuk hal yang sering ditanyakan sebelum memulai kolaborasi desain."}</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq: any, i: number) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <button
                                onClick={() => setOpen(open === i ? -1 : i)}
                                className="w-full text-left p-4 md:p-6 font-bold text-slate-900 flex justify-between items-center bg-white"
                            >
                                {faq.q}
                                <ChevronDown className={`transform transition-transform ${open === i ? 'rotate-180 text-teal-500' : 'text-slate-400'}`} />
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out ${open === i ? 'max-h-40 opacity-100 p-4 md:p-6 pt-0 border-t border-slate-100' : 'max-h-0 opacity-0 px-4 md:px-6 py-0'}`}
                            >
                                <p className="text-slate-500 leading-relaxed font-light">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
