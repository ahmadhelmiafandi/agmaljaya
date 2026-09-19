import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';

const CMSTemplates = () => {
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
            showToast('Template dokumen berhasil disimpan!');
        } catch (error) { 
            showToast('Gagal menyimpan template', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Template Dokumen" 
                desc="Kelola informasi pembayaran dan syarat ketentuan RAB/Invoice." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<CreditCard className="text-blue-500" />} title="Informasi Pembayaran" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Nama Bank" value={settings.payment?.bankName || ''} onChange={v => setSettings(prev => prev ? {...prev, payment: {...prev.payment, bankName: v}} : null)} />
                        <Input label="Nomor Rekening" value={settings.payment?.bankAccount || ''} onChange={v => setSettings(prev => prev ? {...prev, payment: {...prev.payment, bankAccount: v}} : null)} />
                        <Input label="Atas Nama (A/N)" value={settings.payment?.bankHolder || ''} onChange={v => setSettings(prev => prev ? {...prev, payment: {...prev.payment, bankHolder: v}} : null)} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<ShieldCheck className="text-emerald-500" />} title="Syarat & Ketentuan" />
                    <div className="space-y-6">
                        <Textarea 
                            label="Syarat & Ketentuan RAB" 
                            value={settings.templates?.rabTerms || ''} 
                            onChange={v => setSettings(prev => prev ? {...prev, templates: {...prev.templates, rabTerms: v}} : null)} 
                            rows={6}
                        />
                        <Textarea 
                            label="Syarat & Ketentuan Invoice" 
                            value={settings.templates?.invoiceTerms || ''} 
                            onChange={v => setSettings(prev => prev ? {...prev, templates: {...prev.templates, invoiceTerms: v}} : null)} 
                            rows={4}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSTemplates;
