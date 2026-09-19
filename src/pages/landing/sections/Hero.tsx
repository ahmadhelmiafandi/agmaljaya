import React from "react";

import { ArrowRight, MoveRight, ChevronDown } from "lucide-react";
import TypingText from "../../../components/ui/TypingText";

interface HeroProps {
  cmsData?: Record<string, any>;
}

export default function Hero({ cmsData }: HeroProps) {
  if (!cmsData) return null;

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-32 lg:pt-40 md:pb-16 lg:pb-20 justify-center bg-slate-900 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 text-white flex justify-center items-center overflow-hidden">
        <img
          src={(!cmsData?.bgImage || cmsData?.bgImage.includes('unsplash.com')) ? "/images/living-room.jpg" : cmsData.bgImage}
          alt="Modern Interior Design"
          className="min-w-full min-h-full object-cover opacity-30 object-center scale-105 animate-[slow-scale_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-left space-y-8 flex-1 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-black text-teal-300 uppercase tracking-[0.3em] drop-shadow-sm">
              {cmsData?.badge || 'Interior Design & Custom Furniture'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.05] whitespace-pre-line">
            {cmsData.title.split("\n").map((line: string, i: number) => (
              <React.Fragment key={i}>
                {i === 0 ? (
                  line
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
                    {line}
                  </span>
                )}
                {i < cmsData.title.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed font-light max-w-xl">
            <TypingText text={cmsData.subtitle} speed={30} delay={500} />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a
              href={`https://wa.me/${cmsData?.phone?.replace(/[^0-9]/g, '') || '6285113723808'}?text=Halo AGMAL JAYA INTERIOR, saya ingin konsultasi desain interior.`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-teal-600 text-white rounded-full font-bold transition-all shadow-[0_10px_40px_rgba(176,141,87,0.3)] hover:shadow-[0_15px_50px_rgba(176,141,87,0.4)] transform hover:-translate-y-1 active:scale-95 text-base group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_2s_ease-out]"></span>
              <span className="relative z-10 flex items-center gap-2">
                {cmsData?.ctaLabel || 'Konsultasi Sekarang'}
                <MoveRight
                  size={20}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              </span>
            </a>
            <a
              href="#portfolio"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-bold transition-all hover:-translate-y-1 active:scale-95 text-base"
            >
              {cmsData?.ctaSecondary || 'Lihat Portfolio'}
            </a>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg hidden md:block perspective-1000 relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
          <div className="relative transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 transition-transform duration-700">
            <img
              src={(!cmsData?.previewImage || cmsData?.previewImage.includes('unsplash.com')) ? "/images/kitchen-set.jpg" : cmsData.previewImage}
              className="rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-white/10"
              alt="Preview AGMAL JAYA INTERIOR"
            />


          </div>
        </div>
      </div>

    </section>
  );
}
