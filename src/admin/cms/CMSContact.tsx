import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { Phone, Share2 } from 'lucide-react';
import { CMSHeader, SectionHeader, Input } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';

const CMSContact = () => {
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
            showToast('Kontak & Sosmed berhasil diperbarui!');
        } catch (error) { 
            showToast('Gagal menyimpan kontak', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Kontak & Sosial Media" 
                desc="Kelola nomor WhatsApp, Email, dan link sosial media." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<Phone className="text-rose-500" />} title="Kontak Utama" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="WhatsApp" value={settings.contact?.phone || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, phone: v}} : null)} />
                        <Input label="Email Official" value={settings.contact?.email || ''} onChange={v => setSettings(prev => prev ? {...prev, contact: {...prev.contact, email: v}} : null)} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Share2 className="text-indigo-500" />} title="Sosial Media" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
