import React, { useEffect, useState } from 'react';
import { useToast } from '../../components/ui/Toast';
import { api, Settings } from '../../lib/api';
import { Globe, Search, Image as ImageIcon } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField } from './CMSComponents';

const CMSIdentity = () => {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        api.getSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await api.updateSettings(settings);
            showToast('Identitas situs berhasil diperbarui!');
        } catch (error) { 
            showToast('Gagal menyimpan identitas', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Identitas & SEO" 
                desc="Kelola nama situs, tagline, dan optimasi mesin pencari." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<ImageIcon className="text-rose-500" />} title="Logo Website" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <ImageField 
                            label="Logo Website Utama" 
                            img={settings.site?.logo} 
                            onUpload={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                    const url = await api.uploadImage(file);
                                    setSettings(prev => prev ? {...prev, site: {...prev.site, logo: url}} : null);
                                } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Gagal upload logo.');
                                }
                            }} 
                        />
                        <ImageField 
                            label="Logo Admin Dashboard" 
                            img={settings.site?.adminLogo} 
                            onUpload={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                    const url = await api.uploadImage(file);
                                    setSettings(prev => prev ? {...prev, site: {...prev.site, adminLogo: url}} : null);
                                } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Gagal upload logo.');
                                }
                            }} 
                        />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Globe className="text-blue-500" />} title="Identitas Situs" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nama Bisnis / Brand" value={settings.site?.name || ''} onChange={v => setSettings(prev => prev ? {...prev, site: {...prev.site, name: v}} : null)} />
                        <Input label="Tagline" value={settings.site?.tagline || ''} onChange={v => setSettings(prev => prev ? {...prev, site: {...prev.site, tagline: v}} : null)} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Search className="text-slate-500" />} title="SEO (Optimasi Google)" />
                    <div className="grid gap-6">
                        <Input label="Meta Title" value={settings.seo?.title || ''} onChange={v => setSettings(prev => prev ? {...prev, seo: {...prev.seo, title: v}} : null)} placeholder="Judul yang muncul di Google..." />
                        <Textarea label="Meta Description" value={settings.seo?.description || ''} onChange={v => setSettings(prev => prev ? {...prev, seo: {...prev.seo, description: v}} : null)} placeholder="Penjelasan singkat toko Anda untuk hasil pencarian Google..." />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSIdentity;
