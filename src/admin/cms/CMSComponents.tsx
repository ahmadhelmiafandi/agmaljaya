import React from 'react';
import { Save, Trash2, Plus, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface CMSHeaderProps {
    title: string;
    desc?: string;
    onSave: () => void;
    isSaving: boolean;
    message?: string;
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({ title, desc, onSave, isSaving, message }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{title}</h1>
            <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <span>CMS Admin</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900">{title}</span>
            </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            {message && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 mr-2">
                    {message}
                </div>
            )}
            <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-100 disabled:opacity-50 w-full md:w-auto justify-center active:scale-95"
            >
                <Save size={14} /> {isSaving ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}
            </button>
        </div>
    </div>
);

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
    </div>
);

interface InputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2 w-full group">
        {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 transition-all font-medium text-sm placeholder:text-slate-300 shadow-sm"
        />
    </div>
);

interface TextareaProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    placeholder?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, value, onChange, rows = 3, placeholder }) => (
    <div className="space-y-2 w-full group">
        {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
        <textarea
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 transition-all font-medium text-sm placeholder:text-slate-300 resize-none shadow-sm"
        />
    </div>
);

interface ImageFieldProps {
    label?: string;
    img?: string;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({ label, img, onUpload, className = "w-full h-56" }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const fakeEvent = {
                target: { files: e.dataTransfer.files }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onUpload(fakeEvent);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
            <div 
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`${className} cursor-pointer bg-slate-50 rounded-xl border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-50/30 scale-[0.99]' : 'border-slate-300 hover:border-slate-400'} overflow-hidden relative group transition-all shadow-sm flex items-center justify-center`}
            >
                <input 
                    ref={inputRef}
                    type="file" 
                    accept="image/png, image/jpeg, image/webp, image/svg+xml" 
                    onChange={onUpload} 
                    className="hidden" 
                />

                {img ? (
                    <>
                        <img src={img} alt="Uploaded" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 text-white">
                            <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2">
                                <ImageIcon size={14} /> Ganti / Upload Foto Baru
                            </span>
                            <span className="text-[10px] text-slate-200">Klik atau drag foto ke sini</span>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200 text-slate-500 group-hover:scale-110 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">
                            <ImageIcon size={22} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-700 block group-hover:text-indigo-600 transition-colors">Pilih File Foto</span>
                            <span className="text-[10px] text-slate-400">PNG, JPG, WEBP (maks. 10MB)</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface CardProps {
    children: React.ReactNode;
    onDelete?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, onDelete }) => (
    <div className="p-6 border border-slate-100 rounded-lg bg-white space-y-6 relative group/card hover:border-slate-300 transition-all hover:shadow-xl shadow-sm">
        {onDelete && (
            <button 
                onClick={onDelete}
                className="absolute top-4 right-4 w-8 h-8 bg-rose-500 text-white rounded-md flex items-center justify-center shadow-lg opacity-0 group-hover/card:opacity-100 hover:bg-rose-600 transition-all z-20 active:scale-90"
            >
                <Trash2 size={14} />
            </button>
        )}
        {children}
    </div>
);
