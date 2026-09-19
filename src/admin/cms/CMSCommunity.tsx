import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { Users, Star, Plus } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField, Card } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';
import { ConfirmModal } from '../../components/ui/Modal';

interface DeleteConfigState {
    isOpen: boolean;
    section: string;
    index: number | null;
}

const CMSCommunity = () => {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState<DeleteConfigState>({ isOpen: false, section: '', index: null });

    useEffect(() => {
        api.getSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await api.updateSettings(settings);
            showToast('Perubahan tim & testimoni disimpan!');
        } catch (error) { 
            showToast('Gagal menyimpan perubahan', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    const addItem = (section: string, template: any) => {
        setSettings(prev => prev ? {...prev, [section]: [...(prev[section] || []), template]} : null);
    };

    const removeItem = (section: string, index: number) => {
        setDeleteConfig({ isOpen: true, section, index });
    };

    const confirmDelete = () => {
        const { section, index } = deleteConfig;
        if (index === null) return;
        setSettings(prev => prev ? {...prev, [section]: (prev[section] || []).filter((_: any, i: number) => i !== index)} : null);
        showToast('Item berhasil dihapus');
        setDeleteConfig({ isOpen: false, section: '', index: null });
    };

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Tim & Testimoni" 
                desc="Kelola anggota tim dan ulasan dari klien kami." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<Users className="text-indigo-500" />} title="Tim Profesional" />
                        <button 
                            onClick={() => addItem('team', {name: '', role: '', img: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Anggota
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(settings.team || []).map((t: any, i: number) => (
                            <Card key={i} onDelete={() => removeItem('team', i)}>
                                <div className="flex justify-center mb-4">
                                    <ImageField img={t.img} onUpload={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                            const url = await api.uploadImage(file);
                                            setSettings(prev => {
                                                if (!prev) return null;
                                                const newArr = [...(prev.team || [])];
                                                newArr[i] = {...newArr[i], img: url};
                                                return {...prev, team: newArr};
                                            });
                                        } catch (error) {
                                            console.error('Upload error:', error);
                                            alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
                                        }
                                    }} className="w-24 h-24 rounded-full" />
                                </div>
                                <Input label="Nama" value={t.name} onChange={v => {
                                    setSettings(prev => {
                                        if (!prev) return null;
                                        const newArr = [...(prev.team || [])];
                                        newArr[i] = {...newArr[i], name: v};
                                        return {...prev, team: newArr};
                                    });
                                }} />
                                <Input label="Jabatan" value={t.role} onChange={v => {
                                    setSettings(prev => {
                                        if (!prev) return null;
                                        const newArr = [...(prev.team || [])];
                                        newArr[i] = {...newArr[i], role: v};
                                        return {...prev, team: newArr};
                                    });
                                }} />
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<Star className="text-amber-500" />} title="Ulasan Klien" />
                        <button 
                            onClick={() => addItem('testimonials', {name: '', loc: '', text: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Ulasan
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(settings.testimonials || []).map((testi: any, i: number) => (
                            <Card key={i} onDelete={() => removeItem('testimonials', i)}>
                                <Textarea label="Isi Ulasan" value={testi.text} onChange={v => {
                                    setSettings(prev => {
                                        if (!prev) return null;
                                        const newArr = [...(prev.testimonials || [])];
                                        newArr[i] = {...newArr[i], text: v};
                                        return {...prev, testimonials: newArr};
                                    });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nama" value={testi.name} onChange={v => {
                                        setSettings(prev => {
                                            if (!prev) return null;
                                            const newArr = [...(prev.testimonials || [])];
                                            newArr[i] = {...newArr[i], name: v};
                                            return {...prev, testimonials: newArr};
                                        });
                                    }} />
                                    <Input label="Lokasi" value={testi.loc} onChange={v => {
                                        setSettings(prev => {
                                            if (!prev) return null;
                                            const newArr = [...(prev.testimonials || [])];
                                            newArr[i] = {...newArr[i], loc: v};
                                            return {...prev, testimonials: newArr};
                                        });
                                    }} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>

            <ConfirmModal 
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
                onConfirm={confirmDelete}
                title="Hapus Konten"
                message="Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan."
            />
        </div>
    );
};

export default CMSCommunity;
