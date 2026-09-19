import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { LayoutTemplate, Info } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';

const CMSHome = () => {
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
            showToast('Halaman Utama berhasil diperbarui!');
        } catch (error) { 
            showToast('Gagal menyimpan perubahan', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Halaman Utama" 
                desc="Kelola konten Hero Section dan Tentang Kami." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<LayoutTemplate className="text-indigo-500" />} title="Hero Section" />
                    <div className="grid gap-6">
                        <Input label="Judul Utama" value={settings.hero?.title || ''} onChange={v => setSettings(prev => prev ? {...prev, hero: {...prev.hero, title: v}} : null)} />
                        <Textarea label="Sub-judul" value={settings.hero?.subtitle || ''} onChange={v => setSettings(prev => prev ? {...prev, hero: {...prev.hero, subtitle: v}} : null)} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Info className="text-teal-500" />} title="Tentang Kami" />
                    <div className="space-y-6">
                        <Textarea label="Deskripsi" value={settings.about?.description || ''} onChange={v => setSettings(prev => prev ? {...prev, about: {...prev.about, description: v}} : null)} rows={4} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Badge Angka" value={settings.about?.badgeValue || ''} onChange={v => setSettings(prev => prev ? {...prev, about: {...prev.about, badgeValue: v}} : null)} />
                            <Input label="Badge Judul" value={settings.about?.badgeTitle || ''} onChange={v => setSettings(prev => prev ? {...prev, about: {...prev.about, badgeTitle: v}} : null)} />
                            <Input label="Badge Sub" value={settings.about?.badgeSub || ''} onChange={v => setSettings(prev => prev ? {...prev, about: {...prev.about, badgeSub: v}} : null)} />
                        </div>
                        <ImageField label="Foto Utama" img={settings.about?.img} onUpload={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                                const url = await api.uploadImage(file);
                                setSettings(prev => prev ? {...prev, about: {...prev.about, img: url}} : null);
                            } catch (error) {
                                showToast('Gagal upload gambar', 'error');
                            }
                        }} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSHome;
