import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { Layout, MessageSquare, MapPin, Copyright } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';

const CMSHeaderFooter = () => {
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
            showToast('Header & Footer berhasil disimpan!');
        } catch (error) { 
            showToast('Gagal menyimpan perubahan', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Header & Footer" 
                desc="Kelola tampilan navigasi atas dan informasi bagian bawah website." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<Layout className="text-indigo-500" />} title="Navigasi (Header)" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Label Tombol Utama" value={settings.header?.buttonLabel || 'Pesan Sekarang'} onChange={v => setSettings(prev => prev ? {...prev, header: {...prev.header, buttonLabel: v}} : null)} />
                        <Input label="Link Tombol Utama" value={settings.header?.buttonLink || '/configurator'} onChange={v => setSettings(prev => prev ? {...prev, header: {...prev.header, buttonLink: v}} : null)} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<MessageSquare className="text-teal-500" />} title="Footer Brand" />
                    <div className="space-y-6">
                        <Textarea 
                            label="Deskripsi Singkat Footer" 
                            value={settings.footer?.description || ''} 
                            onChange={v => setSettings(prev => prev ? {...prev, footer: {...prev.footer, description: v}} : null)} 
                            rows={3}
                            placeholder="Penjelasan singkat tentang brand Anda di footer..."
                        />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<MapPin className="text-rose-500" />} title="Informasi Lokasi" />
                    <div className="grid gap-6">
                        <Textarea 
                            label="Alamat Workshop / Kantor" 
                            value={settings.footer?.address || ''} 
                            onChange={v => setSettings(prev => prev ? {...prev, footer: {...prev.footer, address: v}} : null)} 
                            rows={2}
                        />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Copyright className="text-slate-500" />} title="Hak Cipta" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Teks Copyright" value={settings.footer?.copyright || ''} onChange={v => setSettings(prev => prev ? {...prev, footer: {...prev.footer, copyright: v}} : null)} placeholder="© 2026 AGMAL JAYA INTERIOR. All rights reserved." />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSHeaderFooter;
