import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to an error reporting service
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 text-center space-y-6">
                        <div className="mx-auto w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 animate-pulse">
                            <AlertTriangle size={40} />
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Oops! Terjadi Kesalahan</h1>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Mohon maaf, sistem mengalami kendala teknis saat memuat configurator. Jangan khawatir, desain Anda mungkin masih bisa diselamatkan.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                            >
                                <RefreshCcw size={18} /> Coba Muat Ulang
                            </button>
                            
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all active:scale-95"
                            >
                                <Home size={18} /> Kembali ke Beranda
                            </a>
                        </div>

                        <p className="text-[10px] text-slate-300 uppercase font-medium tracking-widest pt-4">
                            ID Error: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
