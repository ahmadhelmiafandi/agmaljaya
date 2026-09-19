import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface NavbarProps {
    cmsData?: Record<string, any>;
}

export default function Navbar({ cmsData }: NavbarProps) {
    const contactData = cmsData?.contact;
    const headerSettings = cmsData?.header;
    const siteSettings = cmsData?.site;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Layanan', href: '#layanan' },
        { name: 'Produk', href: '#produk' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Tentang Kami', href: '#tentang' },
        { name: 'Kontak', href: '#kontak' },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (location.pathname !== '/') return;
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: offsetTop - 80,
                behavior: 'smooth'
            });
            setMobileMenuOpen(false);
        }
    };

    const isHeaderSolid = isScrolled || mobileMenuOpen;
    const navTextColor = isHeaderSolid ? 'text-slate-800 hover:text-[#7a531e] font-medium' : 'text-slate-200 hover:text-white font-medium';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderSolid ? 'bg-white shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-12 h-12 md:w-16 lg:w-[68px] md:h-16 lg:h-[68px] flex items-center justify-center overflow-hidden">
                        <img 
                            src={isHeaderSolid ? (siteSettings?.adminLogo || "/brand/logo-icon-dark.png") : (siteSettings?.logo || "/brand/logo-icon-light.png")} 
                            alt={siteSettings?.name || "AGMAL JAYA INTERIOR"} 
                            className="w-full h-full object-contain drop-shadow-sm transition-opacity duration-300" 
                        />
                    </div>
                    <div className="flex flex-col items-start ml-0.5 mt-0.5">
                        <span className={`font-playfair text-lg md:text-xl lg:text-[24px] font-bold leading-none tracking-tight transition-colors duration-300 uppercase ${isHeaderSolid ? 'text-[#7a531e]' : 'text-white'}`}>
                            AGMAL JAYA
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                             <span className={`font-cinzel text-[8.5px] md:text-[9.5px] lg:text-[10px] tracking-[0.38em] font-extrabold pl-0.5 transition-colors duration-300 uppercase ${isHeaderSolid ? 'text-slate-900' : 'text-amber-200/95'}`}>
                                INTERIOR
                             </span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`relative text-sm font-medium transition-colors group ${navTextColor}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full ${isHeaderSolid ? 'bg-[#b08d57]' : 'bg-white'}`}></span>
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center">
                    <a
                        href={headerSettings?.buttonLink || `https://wa.me/${contactData?.phone?.replace(/[^0-9]/g, '') || '6285113723808'}?text=Halo AGMAL JAYA INTERIOR, saya ingin konsultasi.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all shadow-lg 
                            active:scale-95 active:shadow-inner
                            ${isHeaderSolid 
                                ? 'bg-[#b08d57] text-white hover:bg-[#8e7246] shadow-[#b08d57]/30' 
                                : 'bg-white text-slate-900 hover:bg-[#f8f5f0] hover:text-[#8e7246] shadow-white/20'
                            }
                        `}
                    >
                        {headerSettings?.buttonLabel || 'Hubungi Kami'} <ArrowRight size={16} />
                    </a>
                </div>

                {/* Mobile menu toggle with smooth animation */}
                <button
                    className={`md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 active:scale-90 ${
                        isHeaderSolid 
                            ? 'hover:bg-slate-100 text-slate-900' 
                            : 'hover:bg-white/15 text-white'
                    } ${mobileMenuOpen ? (isHeaderSolid ? 'bg-slate-100' : 'bg-white/15') : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between items-center pointer-events-none">
                        {/* Top Line */}
                        <span
                            className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out origin-center ${
                                isHeaderSolid ? 'bg-slate-900' : 'bg-white'
                            } ${
                                mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : 'rotate-0 translate-y-0'
                            }`}
                        />
                        {/* Middle Line */}
                        <span
                            className={`w-6 h-0.5 rounded-full transition-all duration-200 ease-in-out ${
                                isHeaderSolid ? 'bg-slate-900' : 'bg-white'
                            } ${
                                mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                            }`}
                        />
                        {/* Bottom Line */}
                        <span
                            className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out origin-center ${
                                isHeaderSolid ? 'bg-slate-900' : 'bg-white'
                            } ${
                                mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : 'rotate-0 translate-y-0'
                            }`}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Nav - Clean Modern Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl shadow-2xl border-t border-slate-100 flex flex-col p-5 sm:p-6 space-y-2 animate-menu-slide-down origin-top">
                    <div className="flex flex-col space-y-1">
                        {navLinks.map((link, idx) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                style={{ animationDelay: `${(idx + 1) * 55}ms` }}
                                className="animate-menu-item text-slate-800 font-semibold text-base sm:text-lg py-3 px-3 rounded-xl border-b border-slate-100/70 hover:text-[#b08d57] hover:bg-slate-50/80 active:bg-slate-100/90 active:scale-[0.99] transition-all flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#b08d57]/30 group-hover:bg-[#b08d57] group-hover:scale-125 transition-all duration-300"></span>
                                    {link.name}
                                </span>
                                <ArrowRight size={17} className="text-slate-300 group-hover:text-[#b08d57] group-hover:translate-x-1.5 transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                    <div className="pt-2 space-y-2.5">
                        <a
                            href={headerSettings?.buttonLink || `https://wa.me/${contactData?.phone?.replace(/[^0-9]/g, '') || '6285113723808'}?text=Halo AGMAL JAYA INTERIOR, saya ingin konsultasi.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ animationDelay: `${(navLinks.length + 1) * 55}ms` }}
                            className="animate-menu-cta flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#b08d57] to-[#9a7642] text-white rounded-xl font-bold shadow-lg shadow-[#b08d57]/25 hover:shadow-xl hover:shadow-[#b08d57]/35 active:scale-[0.98] transition-all"
                        >
                            {headerSettings?.buttonLabel || 'Hubungi Kami Sekarang'} <ArrowRight size={18} />
                        </a>
                        {contactData?.phone && (
                            <a 
                                href={`https://wa.me/${contactData.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ animationDelay: `${(navLinks.length + 2) * 55}ms` }}
                                className="animate-menu-cta flex items-center justify-center gap-2 w-full py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
                            >
                                Hubungi WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
