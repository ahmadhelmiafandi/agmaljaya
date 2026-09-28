import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
    phone?: string;
    message?: string;
}

export default function FloatingWhatsApp({ phone = '6285113723808', message }: FloatingWhatsAppProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDismissed, setTooltipDismissed] = useState(false);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const defaultMessage = message || 'Halo AGMAL JAYA INTERIOR, saya tertarik dengan layanan interior Anda. Bisa konsultasi?';
    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

    useEffect(() => {
        // Show button after 2 seconds
        const showTimer = setTimeout(() => setIsVisible(true), 2000);
        
        // Show tooltip after 5 seconds
        const tooltipTimer = setTimeout(() => {
            if (!tooltipDismissed) setShowTooltip(true);
        }, 5000);

        // Auto-hide tooltip after 8 more seconds
        const hideTooltipTimer = setTimeout(() => {
            setShowTooltip(false);
        }, 13000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(tooltipTimer);
            clearTimeout(hideTooltipTimer);
        };
    }, [tooltipDismissed]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
            {/* Tooltip */}
            {showTooltip && !tooltipDismissed && (
                <div className="animate-fade-in-up relative">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 pr-7 sm:p-4 sm:pr-8 max-w-[185px] sm:max-w-[220px] relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTooltipDismissed(true);
                                setShowTooltip(false);
                            }}
                            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <X size={12} />
                        </button>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight sm:leading-relaxed">
                            Ada pertanyaan? 💬
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 sm:mt-1 leading-snug sm:leading-relaxed">
                            Chat langsung dengan tim kami via WhatsApp
                        </p>
                        {/* Arrow pointing directly to WhatsApp button */}
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
                    </div>
                </div>
            )}

            {/* WhatsApp Button */}
            <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                    // Track click event if GA4 is available
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'whatsapp_click', {
                            event_category: 'engagement',
                            event_label: 'floating_button',
                        });
                    }
                }}
                className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 active:scale-95 shrink-0"
                aria-label="Chat via WhatsApp"
            >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-10"></span>

                {/* Icon */}
                <svg
                    className="w-7 h-7 md:w-8 md:h-8 relative z-10 drop-shadow-sm"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>

                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md border-2 border-white z-20">
                    1
                </span>
            </a>
        </div>
    );
}
