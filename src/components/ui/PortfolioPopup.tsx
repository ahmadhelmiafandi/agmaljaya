import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ArrowRight, CheckCircle2, CircleDollarSign } from 'lucide-react';
import { defaultData } from '../../data/defaultWebsiteData';

interface PortfolioPopupProps {
    portfolioItems?: any[];
    contactData?: Record<string, any>;
}

export default function PortfolioPopup({ portfolioItems, contactData }: PortfolioPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    useEffect(() => {
        const items = (portfolioItems && portfolioItems.length > 0) 
            ? portfolioItems 
            : defaultData.settings.portfolio;

        if (!items || items.length === 0) return;

        // Randomly select one item, avoiding the one displayed in previous session/refresh if possible
        const lastIdxStr = sessionStorage.getItem('agmal_last_popup_idx');
        let chosenIdx = Math.floor(Math.random() * items.length);

        if (items.length > 1 && lastIdxStr !== null && Number(lastIdxStr) === chosenIdx) {
            chosenIdx = (chosenIdx + 1) % items.length;
        }

        sessionStorage.setItem('agmal_last_popup_idx', String(chosenIdx));
        setSelectedItem(items[chosenIdx]);

        // Show popup after 2.5 seconds delay for a smooth entry
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, [portfolioItems]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen || !selectedItem) return null;

    const cleanPhone = contactData?.phone?.replace(/[^0-9]/g, '') || '6285113723808';
    const waText = encodeURIComponent(
        `Halo AGMAL JAYA INTERIOR, saya melihat portofolio "${selectedItem.title}". Boleh konsultasi estimasi harga dan desainnya?`
    );
    const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

    const handleViewAllPortfolio = () => {
        setIsOpen(false);
        const el = document.getElementById('portfolio');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 animate-fade-in">
            {/* Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal Dialog Card */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-lg bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 transform transition-all animate-modal-in max-h-[92vh] flex flex-col">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md active:scale-95"
                    aria-label="Tutup Pop Up"
                >
                    <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                {/* Project Image */}
                <div className="relative w-full h-44 sm:h-56 md:h-60 overflow-hidden bg-slate-900 group shrink-0">
                    <img
                        src={selectedItem.img}
                        alt={selectedItem.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />

                    {/* Top Category Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="bg-teal-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                            {selectedItem.category || "Proyek Portofolio"}
                        </span>
                    </div>

                    {/* Bottom Status Tag */}
                    <div className="absolute bottom-2.5 left-3 sm:bottom-3 sm:left-4 flex items-center gap-1.5 text-white/90 text-[10px] sm:text-[11px] font-medium drop-shadow-sm">
                        <CheckCircle2 size={13} className="text-teal-400" />
                        <span>Selesai & Terpasang Rapi</span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-6 md:p-7 space-y-3 sm:space-y-4 overflow-y-auto">
                    <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                            {selectedItem.title}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2 font-normal">
                            {selectedItem.desc}
                        </p>
                    </div>

                    {/* Price Block */}
                    {selectedItem.price && (
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                    <CircleDollarSign size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </div>
                                <div>
                                    <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-600">Estimasi Biaya</div>
                                    <div className="text-sm sm:text-base md:text-lg font-black text-amber-800 leading-none mt-0.5">
                                        {selectedItem.price}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shrink-0">
                                Material Custom
                            </span>
                        </div>
                    )}

                    {/* Price Footnote */}
                    <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[10px] sm:text-[11px] text-slate-700 leading-relaxed text-center">
                        <span className="font-bold text-slate-900">*Estimasi harga awal.</span> Biaya final disepakati transparan melalui rincian <span className="font-bold text-slate-900 bg-amber-200/60 px-1 py-0.5 rounded">RAB resmi</span> setelah survey lokasi &amp; pemilihan material.
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1 flex flex-col sm:flex-row gap-2">
                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all duration-200 active:scale-95"
                        >
                            <MessageCircle size={16} />
                            <span>Konsultasi Desain Ini</span>
                        </a>

                        <button
                            onClick={handleViewAllPortfolio}
                            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95"
                        >
                            <span>Lihat Semua Proyek</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
