import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { Briefcase, Image as ImageIcon, Plus } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, ImageField, Card } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';
import { ConfirmModal } from '../../components/ui/Modal';

interface DeleteConfigState {
    isOpen: boolean;
    section: string;
    index: number | null;
}

const CMSCatalog = () => {
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
            showToast('Semua perubahan berhasil disimpan!');
        } catch (error) { 
            showToast('Gagal menyimpan perubahan', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    const addItem = (section: string, template: any) => {
        setSettings(prev => prev ? {...prev, [section]: [...(prev[section] || []), template]} : null);
        showToast('Item baru ditambahkan');
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

    const handleImageChange = async (section: string, index: number, file: File | undefined) => {
        if (!file) return;
        try {
            const url = await api.uploadImage(file);
            setSettings(prev => {
                if (!prev) return null;
                const newArr = [...(prev[section] || [])];
                newArr[index] = {...newArr[index], img: url};
                return {...prev, [section]: newArr};
            });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
        }
    };

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Produk & Portofolio" 
                desc="Kelola katalog produk utama dan galeri hasil kerja." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<Briefcase className="text-indigo-500" />} title="Katalog Produk" />
                        <button 
                            onClick={() => addItem('products', {title: '', features: '', img: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Produk
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(settings.products || []).map((p: any, i: number) => (
                            <Card key={i} onDelete={() => removeItem('products', i)}>
                                <ImageField img={p.img} onUpload={e => handleImageChange('products', i, e.target.files?.[0])} className="h-40" />
                                <Input label="Nama Produk" value={p.title} onChange={v => {
                                    setSettings(prev => {
                                        if (!prev) return null;
                                        const newArr = [...(prev.products || [])];
                                        newArr[i] = {...newArr[i], title: v};
                                        return {...prev, products: newArr};
                                    });
                                }} />
                                <Input label="Fitur (Koma)" value={p.features} onChange={v => {
                                    setSettings(prev => {
                                        if (!prev) return null;
                                        const newArr = [...(prev.products || [])];
                                        newArr[i] = {...newArr[i], features: v};
                                        return {...prev, products: newArr};
                                    });
                                }} />
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<ImageIcon className="text-rose-500" />} title="Galeri Portofolio" />
                        <button 
                            onClick={() => addItem('portfolio', {title: '', img: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Proyek
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(settings.portfolio || []).map((p: any, i: number) => (
                            <Card key={i} onDelete={() => removeItem('portfolio', i)}>
                                <ImageField img={p.img} onUpload={e => handleImageChange('portfolio', i, e.target.files?.[0])} className="h-32" />
                                <Input label="Judul Proyek" value={p.title} onChange={v => {
                                    setSettings(prev => {
                                        if (!prev) return null;
                                        const newArr = [...(prev.portfolio || [])];
                                        newArr[i] = {...newArr[i], title: v};
                                        return {...prev, portfolio: newArr};
                                    });
                                }} />
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

export default CMSCatalog;
