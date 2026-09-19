import React, { useState } from 'react';
import { LogIn, Lock, User, AlertCircle } from 'lucide-react';

import { supabase, isSupabaseConfigured } from '../lib/api';

interface AdminLoginProps {
    onLogin: (value: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Rate limiting state
    const [isBanned, setIsBanned] = useState(false);
    const [banTimeRemaining, setBanTimeRemaining] = useState(0);

    // Initialize rate limiting from localStorage
    React.useEffect(() => {
        const checkBanStatus = () => {
            const banUntil = localStorage.getItem('loginBanUntil');
            if (banUntil) {
                const remaining = parseInt(banUntil) - Date.now();
                if (remaining > 0) {
                    setIsBanned(true);
                    setBanTimeRemaining(Math.ceil(remaining / 60000));
                    return true;
                } else {
                    localStorage.removeItem('loginBanUntil');
                    localStorage.removeItem('loginAttempts');
                    setIsBanned(false);
                }
            }
            return false;
        };

        checkBanStatus();
        const interval = setInterval(checkBanStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleFailedAttempt = () => {
        const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
        if (attempts >= 5) {
            const banTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
            localStorage.setItem('loginBanUntil', banTime.toString());
            localStorage.setItem('loginAttempts', '5');
            setIsBanned(true);
            setBanTimeRemaining(10);
            setError('Terlalu banyak percobaan gagal. Anda diblokir selama 10 menit.');
        } else {
            localStorage.setItem('loginAttempts', attempts.toString());
            setError(`Login gagal. Sisa percobaan: ${5 - attempts}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (isBanned) {
            setError(`Anda masih diblokir. Coba lagi dalam ${banTimeRemaining} menit.`);
            return;
        }

        if (!email || !email.includes('@') || !email.includes('.')) {
            handleFailedAttempt();
            return;
        }

        if (!password) {
            handleFailedAttempt();
            return;
        }

        setIsLoading(true);

        try {
            // Master Admin / Direct Login
            if (email === 'admin@agmaljaya.com' && password === 'admin123') {
                localStorage.setItem('dev_admin_logged_in', 'true');
                localStorage.removeItem('loginAttempts');
                localStorage.removeItem('loginBanUntil');
                onLogin(true);
                return;
            }

            if (isSupabaseConfigured) {
                const { error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (!authError) {
                    localStorage.removeItem('loginAttempts');
                    localStorage.removeItem('loginBanUntil');
                    onLogin(true);
                    return;
                }
            }

            setError('Kredensial login salah. Gunakan: admin@agmaljaya.com / admin123');
            handleFailedAttempt();
        } catch (err: any) {
            handleFailedAttempt();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
                        <p className="text-slate-400 text-sm font-light">Masukkan kredensial Anda untuk mengakses dashboard.</p>
                    </div>

                    {!isSupabaseConfigured && (
                        <div className="mb-6 bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 text-slate-300 text-xs leading-relaxed">
                            <p className="font-bold text-teal-400 mb-1 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                                Mode Pengembang (Supabase belum terhubung)
                            </p>
                            <p className="text-slate-400">Gunakan akun sementara untuk akses admin:</p>
                            <div className="mt-2 bg-slate-950/60 p-2.5 rounded-xl font-mono text-[11px] text-teal-300 space-y-0.5">
                                <p>Email: <span className="text-white">admin@agmaljaya.com</span></p>
                                <p>Password: <span className="text-white">admin123</span></p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 text-sm animate-shake">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-medium"
                                    placeholder="email@contoh.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isBanned}
                            className={`w-full ${isBanned ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-teal-500 hover:bg-teal-600 text-slate-900'} font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${(isLoading || isBanned) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            ) : isBanned ? (
                                <>
                                    Terblokir ({banTimeRemaining}m)
                                </>
                            ) : (
                                <>
                                    Log In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-8 text-slate-500 text-xs">
                    &copy; {new Date().getFullYear()} AGMAL JAYA INTERIOR. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
