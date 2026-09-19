import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Settings, 
    LogOut, 
    ChevronDown, 
    Menu, 
    X, 
    Globe, 
    User,
    Image as ImageIcon,
    FileText,
    Users
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import { supabase, api, isSupabaseConfigured } from '../lib/api';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(true); // Default open for easier navigation
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState<Record<string, any> | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!isSupabaseConfigured) {
                const devAuth = localStorage.getItem('dev_admin_logged_in') === 'true';
                setIsAuthenticated(devAuth);
                setIsLoading(false);
                return;
            }
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
        };
        
        checkAuth();

        // Listen for auth changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchPendingCount = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('data');
            
            if (!error && data) {
                const count = data.filter(item => {
                    const o = item.data;
                    if (!o || o.status === 'Draft' || !o.customer?.name) return false;
                    const status = o.status?.toUpperCase() || 'PENDING';
                    return status !== 'SELESAI';
                }).length;
                setPendingCount(count);
            }
        } catch (err) {
            console.error('Error fetching count:', err);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        
        api.getSettings().then(setSettings);
        fetchPendingCount();

        const channel = supabase
            .channel('sidebar-orders')
            .on(
                'postgres_changes', 
                { event: '*', table: 'orders', schema: 'public' }, 
                () => fetchPendingCount()
            )
            .subscribe();

        window.addEventListener('order_status_updated', fetchPendingCount);

        // Fallback polling every 15 seconds in case Supabase Realtime is not enabled
        const interval = setInterval(() => {
            fetchPendingCount();
        }, 15000);

        return () => {
            supabase.removeChannel(channel);
            window.removeEventListener('order_status_updated', fetchPendingCount);
            clearInterval(interval);
        };
    }, [isAuthenticated]);

    const handleLogout = async () => {
        setIsLoading(true);
        localStorage.removeItem('dev_admin_logged_in');
        if (isSupabaseConfigured) {
            await supabase.auth.signOut();
        }
        setIsAuthenticated(false);
        navigate('/admin');
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={setIsAuthenticated} />;
    }

    const navItemClass = ({ isActive }: { isActive: boolean }) => `
        group flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-[13px] font-bold transition-all duration-200
        ${isActive 
            ? 'bg-slate-800 text-white shadow-lg' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
    `;

    const subNavItemClass = ({ isActive }: { isActive: boolean }) => `
        group flex items-center space-x-3 px-4 py-2 mx-3 rounded-lg text-[11px] font-bold transition-all duration-200
        ${isActive 
            ? 'text-slate-900 bg-slate-100' 
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}
    `;

    return (
        <div className="h-screen bg-[#f8fafc] flex font-sans text-slate-900 overflow-hidden print:h-auto print:overflow-visible print:block">
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0 overflow-x-hidden print:hidden
                ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="h-32 flex items-center justify-between px-8 border-b border-slate-100 mb-4 bg-white relative">
                        <div className="flex items-center gap-4">
                            <div className="w-[72px] h-[72px] flex items-center justify-center overflow-hidden">
                                {settings?.site?.adminLogo ? (
                                    <img src={settings.site.adminLogo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <img src="/brand/logo-icon-dark.png" alt="Logo Default" className="w-full h-full object-contain" />
                                )}
                            </div>
                            <div className="flex flex-col items-start mt-1">
                                <span className="font-playfair text-[28px] font-bold leading-[0.85] text-[#b08d57] uppercase">
                                    {settings?.site?.name?.split(' ')[0] || 'AGMAL JAYA'}
                                </span>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="font-cinzel text-[10px] tracking-[0.34em] font-bold pl-0.5 text-[#4a423e] uppercase">
                                        {settings?.site?.name?.split(' ').slice(1).join(' ') || 'INTERIOR'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar pb-10">
                        <div className="space-y-1">
                            <p className="px-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">NAVIGASI UTAMA</p>
                            <NavLink to="/admin" end className={navItemClass}>
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/admin/orders" className={navItemClass}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart size={18} />
                                        <span>Pesanan</span>
                                    </div>
                                    {pendingCount > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                                            {pendingCount}
                                        </span>
                                    )}
                                </div>
                            </NavLink>
                        </div>

                        <div className="space-y-1">
                            <p className="px-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">KONTEN WEB</p>
                            
                            <button 
                                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                                className="w-full flex items-center justify-between px-4 py-2.5 mx-3 rounded-lg text-[13px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <Globe size={18} />
                                    <span>Pengaturan Web</span>
                                </div>
                                <ChevronDown size={14} className={`transform transition-transform ${showSettingsDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {showSettingsDropdown && (
                                <div className="mt-1 space-y-1 pl-4 animate-fade-in">
                                    <NavLink to="/admin/settings" end className={subNavItemClass}>
                                        <span>• Halaman Utama</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/identity" className={subNavItemClass}>
                                        <span>• Identitas & SEO</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/layout" className={subNavItemClass}>
                                        <span>• Header & Footer</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/catalog" className={subNavItemClass}>
                                        <span>• Portofolio</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/community" className={subNavItemClass}>
                                        <span>• Tim & Testimoni</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/contact" className={subNavItemClass}>
                                        <span>• Kontak & Sosmed</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/templates" className={subNavItemClass}>
                                        <span>• Template Dokumen</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/blog" className={subNavItemClass}>
                                        <span>• Artikel Blog</span>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/20">
                        <div className="flex items-center gap-4 px-2 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest truncate">Administrator</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate">Super Admin</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500 bg-white border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm shadow-rose-100 active:scale-95"
                        >
                            <LogOut size={16} />
                            Keluar Sistem
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden print:h-auto print:overflow-visible print:block">
                {/* Header */}
                <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 md:px-8 lg:px-12 justify-between sticky top-0 z-40 shrink-0 print:hidden">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Pages</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900">Dashboard</span>
                        </div>
                        <h2 className="lg:hidden text-base md:text-lg font-black tracking-tight uppercase truncate">DASHBOARD</h2>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <NavLink 
                            to="/" 
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 px-2 md:px-4 py-2 rounded-lg transition-all"
                        >
                            <Globe size={18} />
                            <span className="hidden sm:inline">Pratinjau Web</span>
                        </NavLink>
                        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                        <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <span className="text-[10px] font-black text-slate-600 uppercase">Server Online</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12 scroll-smooth print:overflow-visible print:p-0 print:h-auto print:block">
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
