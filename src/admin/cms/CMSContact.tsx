import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { Phone, Share2, MapPin, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';
import { CMSHeader, SectionHeader, Input } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';
import { processGoogleMapsInput } from '../../utils/mapHelper';

const CMSContact = () => {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [mapInputUrl, setMapInputUrl] = useState('');
    const [isProcessingMap, setIsProcessingMap] = useState(false);
    const [mapParsedSuccess, setMapParsedSuccess] = useState(false);

    useEffect(() => {
        api.getSettings().then((data) => {
            setSettings(data);
            if (data?.contact?.mapDirectUrl) {
                setMapInputUrl(data.contact.mapDirectUrl);
            } else if (data?.contact?.mapUrl) {
                setMapInputUrl(data.contact.mapUrl);
            }
        });
    }, []);

    const handleProcessMapUrl = async (urlToProcess?: string) => {
        const target = urlToProcess || mapInputUrl;
        if (!target.trim()) {
            showToast('Silakan masukkan URL Google Maps terlebih dahulu', 'error');
            return;
        }

        setIsProcessingMap(true);
        try {
            const result = await processGoogleMapsInput(target);
            setSettings(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    contact: {
                        ...prev.contact,
                        mapUrl: result.embedUrl,
                        mapDirectUrl: result.directUrl || target.trim(),
                    }
                };
            });
            setMapParsedSuccess(true);
            showToast('URL Google Maps berhasil dikonversi dan siap disimpan!', 'success');
            setTimeout(() => setMapParsedSuccess(false), 4000);
        } catch (err: any) {
            showToast(err.message || 'Gagal memproses URL Google Maps', 'error');
        } finally {
            setIsProcessingMap(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            // If user typed a new map URL but didn't click parse button, parse it now
            let updatedSettings = { ...settings };
            if (mapInputUrl.trim() && mapInputUrl !== settings.contact?.mapDirectUrl && mapInputUrl !== settings.contact?.mapUrl) {
                try {
                    const result = await processGoogleMapsInput(mapInputUrl);
                    updatedSettings.contact = {
                        ...updatedSettings.contact,
                        mapUrl: result.embedUrl,
                        mapDirectUrl: result.directUrl || mapInputUrl.trim(),
                    };
                } catch (_) {}
            }

            await api.updateSettings(updatedSettings);
            showToast('Kontak & Lokasi Map berhasil diperbarui dan disimpan!');
        } catch (error) { 
            showToast('Gagal menyimpan kontak', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    const currentEmbedUrl = settings.contact?.mapUrl || 'https://maps.google.com/maps?q=-6.4725558,110.8376500&t=&z=16&ie=UTF8&iwloc=&output=embed';
    const currentDirectUrl = settings.contact?.mapDirectUrl || mapInputUrl || 'https://maps.app.goo.gl/yUqCa27DvDex4TTS8?g_st=iw';

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Kontak & Lokasi Maps" 
                desc="Kelola nomor WhatsApp, Email, sosial media, dan lokasi Google Maps workshop." 
                onSave={handleSave} 
                isSaving={isSaving} 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                {/* Section Lokasi & Google Maps */}
                <section>
                    <SectionHeader icon={<MapPin className="text-emerald-500" />} title="Lokasi Workshop & Google Maps" />
                    <p className="text-xs text-slate-500 mb-6 -mt-4 leading-relaxed">
                        Anda dapat memasukkan link Google Maps apa saja: link share (<code className="bg-slate-100 px-1 py-0.5 rounded text-[#b08d57]">https://maps.app.goo.gl/...</code>), link browser, link embed iframe, atau koordinat lintang/bujur (<code className="bg-slate-100 px-1 py-0.5 rounded text-[#b08d57]">-6.4725558, 110.8376500</code>). Sistem akan otomatis mengonversi ke tampilan peta interaktif dan tombol navigasi langsung.
                    </p>

                    <div className="space-y-6">
                        {/* URL Input with Quick Convert Button */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                URL / Link Google Maps
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={mapInputUrl}
                                    onChange={(e) => setMapInputUrl(e.target.value)}
                                    placeholder="Contoh: https://maps.app.goo.gl/yUqCa27DvDex4TTS8?g_st=iw"
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#b08d57]/30 focus:border-[#b08d57] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleProcessMapUrl()}
                                    disabled={isProcessingMap || !mapInputUrl.trim()}
                                    className="px-6 py-3 bg-[#b08d57] hover:bg-[#8e7246] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 shadow-md shadow-[#b08d57]/20"
                                >
                                    {isProcessingMap ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" />
                                            <span>Memproses...</span>
                                        </>
                                    ) : mapParsedSuccess ? (
                                        <>
                                            <CheckCircle size={14} />
                                            <span>Terverifikasi!</span>
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw size={14} />
                                            <span>Terapkan Map</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input 
                                label="Nama Workshop" 
                                value={settings.contact?.workshopName || 'AGMAL JAYA INTERIOR Workshop'} 
                                onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, workshopName: v}} : null)} 
                                placeholder="Contoh: AGMAL JAYA INTERIOR Workshop"
                            />
                            <Input 
                                label="Alamat / Lokasi Singkat" 
                                value={settings.contact?.workshopLocation || settings.contact?.address || ''} 
                                onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, workshopLocation: v, address: v}} : null)} 
                                placeholder="Contoh: Bagor, Bumiharjo, Jepara, Jawa Tengah"
                            />
                            <Input 
                                label="Jam Operasional" 
                                value={settings.contact?.workshopHours || 'Buka hingga 17:00 WIB'} 
                                onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, workshopHours: v}} : null)} 
                                placeholder="Contoh: Buka hingga 17:00 WIB"
                            />
                        </div>

                        {/* Live Map Preview Box */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between ml-1">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Preview Tampilan Peta Interaktif
                                </span>
                                {currentDirectUrl && (
                                    <a 
                                        href={currentDirectUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-[#b08d57] hover:text-[#8e7246] font-bold inline-flex items-center gap-1 underline"
                                    >
                                        <span>Buka di Google Maps Asli</span>
                                        <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                            <div className="w-full h-64 md:h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                                <iframe
                                    src={currentEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Workshop Map Preview"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* Section Kontak Utama */}
                <section>
                    <SectionHeader icon={<Phone className="text-rose-500" />} title="Kontak Utama" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="WhatsApp" value={settings.contact?.phone || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, phone: v}} : null)} />
                        <Input label="Email Official" value={settings.contact?.email || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, email: v}} : null)} />
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* Section Sosial Media */}
                <section>
                    <SectionHeader icon={<Share2 className="text-indigo-500" />} title="Sosial Media" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Instagram (URL)" value={settings.contact?.instagram || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, instagram: v}} : null)} />
                        <Input label="Facebook (URL)" value={settings.contact?.facebook || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, facebook: v}} : null)} />
                        <Input label="TikTok (URL)" value={settings.contact?.tiktok || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, tiktok: v}} : null)} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSContact;
