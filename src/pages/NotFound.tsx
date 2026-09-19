import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
            
            <div className="max-w-xl w-full text-center relative z-10">
                {/* 404 Visual — logo floats above the numbers */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center animate-float mb-4 overflow-hidden p-2">
                        <img src="/brand/logo-icon.jpg" alt="AGMAL JAYA INTERIOR" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-[150px] font-black text-slate-200 leading-none select-none">404</h1>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
                    <p className="text-slate-500 leading-relaxed max-w-md mx-auto">
                        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Mari kembali ke jalur yang benar.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95 w-full sm:w-auto"
                    >
                        <Home size={18} /> Kembali ke Beranda
                    </Link>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600 rounded-2xl font-bold transition-all active:scale-95 w-full sm:w-auto"
                    >
                        <ArrowLeft size={18} /> Kembali Sebelumnya
                    </button>
                </div>

                {/* Footer Link */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-400">
                        Butuh bantuan? <a href="https://wa.me/6285113723808" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold hover:underline">Hubungi Workshop Kami</a>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
