import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { api } from "../../lib/api";

// Impor semua section
import Hero from "./sections/Hero";
import { About, Services } from "./sections/AboutServices";
import { Products } from "./sections/ProductsTech";
import { HowItWorks, Portfolio } from "./sections/ProcessPortfolio";
import { Team, Testimonials, FAQ } from "./sections/MoreInfo";
import { Blog, Contact } from "./sections/BlogContact";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import PullToRefresh from "../../components/ui/PullToRefresh";

export default function Home() {
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  useScrollReveal();

  const loadSettings = () => {
    return api.getSettings().then((data) => {
      setSettings(data);
      if (data?.seo?.title) {
        document.title = data.seo.title;
      }
      if (data?.seo?.description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", data.seo.description);
        }
      }
      return data;
    });
  };

  const [isPullActive, setIsPullActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSettings();

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRefresh = async () => {
    await loadSettings();
  };

  if (!settings) return null; // Or a subtle loading screen

  return (
    <PullToRefresh onRefresh={handleRefresh} onPullChange={setIsPullActive}>
      <div className="min-h-screen font-sans bg-slate-50 text-slate-800 selection:bg-indigo-500/30 overflow-x-hidden">
        <Navbar cmsData={settings} forceSolid={isPullActive} />

        <main>
          <Hero cmsData={settings.hero} />
          <About cmsData={settings.about} />
          <Services cmsData={settings.services} contactData={settings.contact} />
          <Products cmsData={settings.products} />
          <HowItWorks cmsData={settings.howItWorks} />
          <Portfolio cmsData={settings.portfolio} contactData={settings.contact} />

          <Team cmsData={settings.team} />
          <Testimonials cmsData={settings.testimonials} />
          <FAQ cmsData={settings.faqs} />
          <Blog cmsData={settings.articles} contactData={settings.contact} />
          <Contact cmsData={settings.contact} />
        </main>

        <Footer cmsData={settings} />

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white shadow-2xl shadow-teal-600/20 hover:bg-teal-500 transition-all duration-300 ${showTopButton ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
          aria-label="Kembali ke atas"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </PullToRefresh>
  );
}
