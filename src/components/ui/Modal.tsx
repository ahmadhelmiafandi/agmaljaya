import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya, Hapus', cancelText = 'Batal' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-modal-in border border-white/20 p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{message}</p>
                    
                    <div className="flex flex-col w-full gap-3">
                        <button 
                            onClick={onConfirm}
                            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-rose-200"
                        >
                            {confirmText}
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
