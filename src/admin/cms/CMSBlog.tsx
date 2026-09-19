import React, { useEffect, useState } from 'react';
import { api, Settings } from '../../lib/api';
import { BookOpen, Plus, FileText } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField, Card } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';
import { ConfirmModal } from '../../components/ui/Modal';

interface DeleteConfigState {
    isOpen: boolean;
    index: number | null;
}

const CMSBlog = () => {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState<DeleteConfigState>({ isOpen: false, index: null });

    useEffect(() => {
        api.getSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await api.updateSettings(settings);
            showToast('Artikel blog berhasil diperbarui!');
        } catch (error) { 
            showToast('Gagal menyimpan artikel', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    const addItem = () => {
        const newItem = { 
            title: '', 
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), 
            img: '', 
            desc: '',
            content: ''
        };
        setSettings(prev => prev ? {...prev, articles: [...(prev.articles || []), newItem]} : null);
    };

    const removeItem = (index: number) => {
        setDeleteConfig({ isOpen: true, index });
    };

    const confirmDelete = () => {
        const { index } = deleteConfig;
        if (index === null) return;
        setSettings(prev => prev ? {...prev, articles: (prev.articles || []).filter((_: any, i: number) => i !== index)} : null);
        showToast('Artikel berhasil dihapus');
        setDeleteConfig({ isOpen: false, index: null });
    };

    const handleImageChange = async (index: number, file: File | undefined) => {
        if (!file) return;
        try {
            const url = await api.uploadImage(file);
            setSettings(prev => {
                if (!prev) return null;
                const newArr = [...(prev.articles || [])];
                newArr[index] = {...newArr[index], img: url};
                return {...prev, articles: newArr};
            });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
        }
    };

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Manajemen Blog" 
                desc="Tulis inspirasi, tips, dan edukasi untuk klien Anda." 
                onSave={handleSave} 
                isSaving={isSaving} 
                 
            />
            
            <div className="space-y-8">
                <div className="flex justify-between items-center px-2">
                    <SectionHeader icon={<BookOpen className="text-teal-500" />} title="Daftar Artikel" />
                    <button 
                        onClick={addItem} 
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        <Plus size={14} /> Tulis Artikel Baru
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {(settings.articles || []).map((a: any, i: number) => (
                        <Card key={i} onDelete={() => removeItem(i)}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <ImageField label="Gambar Sampul" img={a.img} onUpload={e => handleImageChange(i, e.target.files?.[0])} className="h-56" />
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input label="Judul Artikel" value={a.title} onChange={v => {
                                            setSettings(prev => {
                                                if (!prev) return null;
                                                const newArr = [...(prev.articles || [])];
                                                newArr[i] = {...newArr[i], title: v};
                                                return {...prev, articles: newArr};
                                            });
                                        }} />
                                        <Input label="Tanggal Publish" value={a.date} onChange={v => {
                                            setSettings(prev => {
                                                if (!prev) return null;
                                                const newArr = [...(prev.articles || [])];
                                                newArr[i] = {...newArr[i], date: v};
                                                return {...prev, articles: newArr};
                                            });
                                        }} />
                                    </div>
                                    <Textarea label="Ringkasan (Muncul di Depan)" value={a.desc} onChange={v => {
                                        setSettings(prev => {
                                            if (!prev) return null;
                                            const newArr = [...(prev.articles || [])];
                                            newArr[i] = {...newArr[i], desc: v};
                                            return {...prev, articles: newArr};
                                        });
                                    }} rows={2} />
                                    <Textarea label="Konten Lengkap Artikel" value={a.content} onChange={v => {
                                        setSettings(prev => {
                                            if (!prev) return null;
                                            const newArr = [...(prev.articles || [])];
                                            newArr[i] = {...newArr[i], content: v};
                                            return {...prev, articles: newArr};
                                        });
                                    }} rows={8} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <ConfirmModal 
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
                onConfirm={confirmDelete}
                title="Hapus Artikel"
                message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
            />
        </div>
    );
};

export default CMSBlog;
