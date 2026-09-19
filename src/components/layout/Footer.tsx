import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
    cmsData?: Record<string, any>;
}

export default function Footer({ cmsData }: FooterProps) {
    const contactData = cmsData?.contact;
    const footerSettings = cmsData?.cmsData || cmsData?.footer; // Handle both direct pass and nested
    const settings = cmsData; // Easier access
    const phone = contactData?.phone || '+62 851 1372 3808';
    const email = contactData?.email || 'hello@agmaljaya-interior.com';
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">

                {/* Brand */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center gap-3 group inline-flex mb-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
                            <img 
                                src="/brand/logo-icon-light.png" 
                                alt="AGMAL JAYA INTERIOR" 
                                className="w-full h-full object-contain drop-shadow-md" 
                            />
                        </div>
                        <div className="flex flex-col items-start ml-0.5 mt-0.5">
                            <span className="font-playfair text-xl md:text-2xl font-bold leading-none tracking-tight text-white uppercase">
                                AGMAL JAYA
                            </span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                 <span className="font-cinzel text-[9px] md:text-[10px] tracking-[0.38em] font-extrabold pl-0.5 text-[#c99a4e] uppercase">
                                    INTERIOR
                                 </span>
                            </div>
                        </div>
                    </Link>
                    <p className="text-xs md:text-sm leading-relaxed text-slate-400">
                        {settings?.footer?.description || 'AGMAL JAYA INTERIOR: Spesialis desain dan produksi interior premium. Kami memadukan estetika mewah dengan keahlian presisi untuk mewujudkan ruang impian Anda secara nyata.'}
                    </p>
                    <div className="flex gap-3 md:gap-4">
                        {contactData?.instagram && (
                            <a href={contactData.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-md">
                                <Instagram size={16} className="md:w-[18px] md:h-[18px]" />
                            </a>
                        )}
                        {contactData?.facebook && (
                            <a href={contactData.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-md">
                                <Facebook size={16} className="md:w-[18px] md:h-[18px]" />
                            </a>
                        )}
                        {contactData?.tiktok && (
                            <a href={contactData.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all shadow-md group">
                                <svg 
                                    className="w-4 h-4 md:w-[18px] md:h-[18px] fill-current text-slate-300 group-hover:text-white transition-colors" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-.8 4.54-2.19 6.27-1.55 1.94-3.8 3.09-6.22 3.33-2.42.23-4.88-.34-6.84-1.74-2.02-1.42-3.32-3.69-3.63-6.13-.3-2.46.3-5.01 1.69-7.06 1.4-2.06 3.63-3.4 6.08-3.72 1.13-.15 2.28-.15 3.41-.01v3.98c-.76-.11-1.55-.13-2.31-.02-1.22.18-2.37.83-3.13 1.83-.75.98-1.07 2.24-.92 3.48.15 1.25.79 2.39 1.77 3.16.97.77 2.22 1.09 3.45.92 1.23-.17 2.36-.8 3.12-1.8.76-.99 1.08-2.25.92-3.49-.03-3.46-.01-6.91-.01-10.37z" transform="scale(0.85) translate(2, 2)" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* TODO: Move service links to CMS structure in future */}
                <div>
                    <h4 className="text-white font-semibold mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                        Layanan
                    </h4>
                    <ul className="space-y-2 md:space-y-3">
                        <li><a href="#layanan" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Desain Interior Custom</a></li>
                        <li><a href="#layanan" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Produksi Kitchen Set</a></li>
                        <li><a href="#layanan" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Furniture Custom</a></li>
                        <li><a href="#layanan" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Renovasi Ruangan</a></li>
                    </ul>
                </div>

                {/* TODO: Move company links to CMS structure in future */}
                <div>
                    <h4 className="text-white font-semibold mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                        Perusahaan
                    </h4>
                    <ul className="space-y-2 md:space-y-3">
                        <li><a href="#tentang" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Tentang Kami</a></li>
                        <li><a href="#portfolio" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Portfolio</a></li>
                        <li><a href="#faq" className="text-xs md:text-sm hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> FAQ</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div id="kontak">
                    <h4 className="text-white font-semibold mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                        Kontak Kami
                    </h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li className="flex gap-2 md:gap-3 text-xs md:text-sm items-start">
                            <MapPin size={16} className="md:w-[18px] md:h-[18px] text-indigo-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{settings?.footer?.address || 'GRGQ+X38 Bumiharjo, Kec. Keling, Jepara Regency, Central Java'}</span>
                        </li>
                        <li className="flex gap-2 md:gap-3 text-xs md:text-sm items-center">
                            <Phone size={16} className="md:w-[18px] md:h-[18px] text-indigo-400 shrink-0" />
                            <span>{phone}</span>
                        </li>
                        <li className="flex gap-2 md:gap-3 text-xs md:text-sm items-center">
                            <Mail size={16} className="md:w-[18px] md:h-[18px] text-indigo-400 shrink-0" />
                            <span>{email}</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 border-t border-slate-800 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                <p className="text-[10px] md:text-xs text-slate-500 text-center md:text-left">
                    &copy; {new Date().getFullYear()} {settings?.footer?.copyright || settings?.site?.name || 'AGMAL JAYA INTERIOR'}. All rights reserved.
                </p>
                <div className="flex gap-4 md:gap-6 text-[10px] md:text-xs text-slate-500">
                    <a href={settings?.footer?.privacyUrl || "#"} className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href={settings?.footer?.termsUrl || "#"} className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
