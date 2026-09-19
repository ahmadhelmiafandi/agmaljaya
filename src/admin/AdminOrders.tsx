import React, { useEffect, useState } from 'react';
import { Eye, X, Image as ImageIcon, ShoppingBag, Clock, CheckCircle2, AlertCircle, Phone, MapPin, Package, Wrench, User, FileText, ShoppingCart, Mail, Copy, MessageSquare, RefreshCw, Plus, ChevronRight, Edit2, Trash2, Printer } from 'lucide-react';

function terbilang(angka: number): string {
    const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    if (angka < 12) return huruf[angka];
    if (angka < 20) return terbilang(angka - 10) + " Belas";
    if (angka < 100) return terbilang(Math.floor(angka / 10)) + " Puluh " + (angka % 10 !== 0 ? terbilang(angka % 10) : "");
    if (angka < 200) return "Seratus " + terbilang(angka - 100);
    if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " Ratus " + (angka % 100 !== 0 ? terbilang(angka % 100) : "");
    if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
    if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " Ribu " + (angka % 1000 !== 0 ? terbilang(angka % 1000) : "");
    if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + " Juta " + (angka % 1000000 !== 0 ? terbilang(angka % 1000000) : "");
    if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + " Miliar " + (angka % 1000000000 !== 0 ? terbilang(angka % 1000000000) : "");
    return "";
}
import { useDebounce } from '../hooks/useDebounce';
import { Pagination } from '../components/ui/Pagination';
import { api, supabase } from '../lib/api';
import { MATERIAL_COLORS, WALL_POS } from '../lib/constants';
import { CMSHeader } from './cms/CMSComponents';
import { useToast } from '../components/ui/Toast';

interface Order {
    id: string;
    status: string;
    createdAt: string;
    totalPrice?: number;
    estimatedPrice?: number;
    customer?: Record<string, any>;
    config?: Record<string, any>;
    product?: Record<string, any>;
    [key: string]: any;
}

export default function AdminOrders() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [settings, setSettings] = useState<Record<string, any> | null>(null);
    const [activeTab, setActiveTab] = useState('summary');
    
    // Pagination & Filtering state
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        showToast(`${label} berhasil disalin!`);
    };

    const handleSendEmail = (order: Order) => {
        const subject = encodeURIComponent(`Dokumen Pesanan AGMAL JAYA INTERIOR - #${String(order.id).split('-')[0].toUpperCase()}`);
        const body = encodeURIComponent(`Halo ${order.customer?.name},\n\nTerima kasih telah melakukan pemesanan di AGMAL JAYA INTERIOR.\nBerikut adalah rincian pesanan Anda:\n\nProduk: ${order.config?.productSelection?.name}\nTotal: Rp ${order.totalPrice?.toLocaleString('id-ID')}\n\nSilakan cek lampiran atau buka link berikut untuk detailnya.\n\nSalam,\nAGMAL JAYA INTERIOR`);
        window.location.href = `mailto:${order.customer?.email}?subject=${subject}&body=${body}`;
    };

    const getChatTemplate = (order: Order) => {
        return `Halo Kak ${order.customer?.name}, Kami dari *AGMAL JAYA INTERIOR* ingin mengonfirmasi pesanan furnitur Kakak (#${String(order.id).split('-')[0].toUpperCase()}).

Berikut Ringkasan Pesanan:
- Produk: ${order.config?.productSelection?.name}
- Model: ${order.config?.productSelection?.shape}
- Estimasi Total: *Rp ${order.totalPrice?.toLocaleString('id-ID')}*
- Metode Bayar: ${order.customer?.paymentMethod || 'Transfer BCA'}

Apakah Kakak ada waktu luang untuk kami jadwalkan *Survey Lokasi* dalam waktu dekat? Terima kasih. 🙏`;
    };

    const fetchOrders = (showLoader = false) => {
        if (showLoader) setLoading(true);
        api.getOrders().then((data) => {
            if (!Array.isArray(data)) {
                setOrders([]);
                setLoading(false);
                return;
            }
            const realOrders = data.filter((o: any) => o && o.status !== 'Draft' && o.customer?.name);
            setOrders(realOrders as Order[]);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching orders:', err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchOrders();
        api.getSettings().then(setSettings);

        // Setup realtime subscription
        const channel = supabase
            .channel('orders-changes')
            .on(
                'postgres_changes',
                { event: '*', table: 'orders', schema: 'public' },
                () => {
                    fetchOrders(false); // Silent refresh
                }
            )
            .subscribe();

        // Fallback polling every 15 seconds in case Supabase Realtime is not enabled
        const interval = setInterval(() => {
            fetchOrders(false);
        }, 15000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await api.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

            // If selecting from modal, update local state
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
            }

            showToast(`Status pesanan diperbarui menjadi ${newStatus}`);
            // Trigger AdminLayout to update badge instantly
            window.dispatchEvent(new Event('order_status_updated'));
            return true;
        } catch (err) {
            console.error('Update status error:', err);
            return false;
        }
    };

    const handleQuickAction = async (order: Order, nextStatus: string) => {
        const success = await handleStatusChange(order.id, nextStatus);
        if (success) {
            sendStatusNotification(order, nextStatus);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pesanan ini secara permanen?")) {
            try {
                await api.deleteOrder(orderId);
                setOrders(orders.filter(o => o.id !== orderId));
                showToast("Pesanan berhasil dihapus!");
            } catch (err) {
                console.error("Gagal menghapus:", err);
                showToast("Terjadi kesalahan saat menghapus pesanan.");
            }
        }
    };

    const getNotificationMessage = (order: Order, status: string) => {
        const id = String(order.id).split('-')[0].toUpperCase();
        switch (status) {
            case 'SUDAH DP':
                return `Halo Kak ${order.customer?.name}, DP untuk pesanan #${id} telah kami terima. Terima kasih! Pesanan Anda kini masuk ke antrean produksi. 🙏`;
            case 'DIPROSES':
                return `Halo Kak ${order.customer?.name}, pesanan #${id} sedang dalam tahap PROSES PRODUKSI di workshop kami. Kami akan kabari jika sudah siap kirim. 🔨`;
            case 'LUNAS':
                return `Halo Kak ${order.customer?.name}, pembayaran LUNAS untuk pesanan #${id} telah kami terima. Terima kasih banyak! Pesanan segera kami jadwalkan untuk pengiriman/pemasangan. ✅`;
            case 'SELESAI':
                return `Halo Kak ${order.customer?.name}, pesanan #${id} telah SELESAI dipasang dengan baik. Terima kasih telah memilih AGMAL JAYA INTERIOR. Semoga puas dengan hasilnya! ⭐⭐⭐⭐⭐`;
            default:
                return '';
        }
    };

    const sendStatusNotification = (order: Order, status: string) => {
        const msg = getNotificationMessage(order, status);
        if (!msg) return;

        // WhatsApp
        const waMsg = encodeURIComponent(msg);
        window.open(`https://wa.me/${String(order.customer?.phone || '').replace(/[^0-9]/g, '')}?text=${waMsg}`, '_blank');

        // Email
        if (order.customer?.email) {
            setTimeout(() => {
                const subject = encodeURIComponent(`Update Pesanan AGMAL JAYA INTERIOR - ${status} #${String(order.id).split('-')[0].toUpperCase()}`);
                const body = encodeURIComponent(msg.replace(/\*/g, ''));
                window.location.href = `mailto:${order.customer?.email}?subject=${subject}&body=${body}`;
            }, 1000);
        }
    };

    const getStatusStyle = (status?: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'SUDAH DP': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DIPROSES': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'LUNAS': return 'bg-teal-50 text-teal-600 border-teal-100';
            case 'SELESAI': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, filterStatus]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
        );
    }

    // Filter logic
    const filteredOrders = orders.filter(order => {
        const matchesSearch = (order.customer?.name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                              String(order.id).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || order.status?.toUpperCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Pesanan</h1>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <span>Admin</span>
                        <ChevronRight size={10} />
                        <span className="text-slate-900">Pesanan</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchOrders(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => showToast("Fitur pesanan manual dinonaktifkan. Gunakan 3D Configurator untuk pesanan baru.")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95"
                    >
                        <Plus size={14} />
                        Tambah Baru
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input 
                    type="text" 
                    placeholder="Cari nama atau ID pesanan..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-white cursor-pointer"
                >
                    <option value="ALL">Semua Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUDAH DP">Sudah DP</option>
                    <option value="DIPROSES">Diproses</option>
                    <option value="LUNAS">Lunas</option>
                    <option value="SELESAI">Selesai</option>
                </select>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Estimasi</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-300">
                                            <ShoppingBag size={48} strokeWidth={1.5} />
                                            <p className="text-sm font-bold uppercase tracking-widest">Tidak ada pesanan ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-white shadow-sm">
                                                {order.customer?.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-none mb-1">{order.customer?.name || 'Anonim'}</p>
                                                <p className="text-xs text-slate-400 font-medium">{order.customer?.phone || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{order.config?.productSelection?.name || order.product?.name || '-'}</span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{order.config?.productSelection?.shape || 'Custom'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-slate-900">
                                        Rp {(order.totalPrice || order.estimatedPrice || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                {order.status || 'PENDING'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-md transition-all active:scale-95 shadow-sm"
                                                title="Lihat"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-all active:scale-95 shadow-sm"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="p-2 bg-rose-500 text-white hover:bg-rose-600 rounded-md transition-all active:scale-95 shadow-sm"
                                                title="Hapus"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Modern Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 print:static print:p-0">
                    <div className="absolute inset-0 bg-white no-print" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white w-full h-full max-w-none rounded-none overflow-hidden shadow-none relative z-10 flex flex-col animate-modal-in border-none print:max-h-none print:overflow-visible print:rounded-none print:border-none print:shadow-none">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-50 bg-white sticky top-0 z-20 no-print shrink-0">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Pesanan #{String(selectedOrder.id || '').split('-')[0]}</h3>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">

                                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                        {['PENDING', 'SUDAH DP', 'DIPROSES', 'LUNAS', 'SELESAI'].map(st => (
                                            <button
                                                key={st}
                                                onClick={() => handleStatusChange(selectedOrder.id, st)}
                                                className={`px-3 py-1.5 rounded-lg text-[8px] font-black transition-all ${selectedOrder.status === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {st}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="w-px h-8 bg-slate-100 mx-1"></div>
                                    <button
                                        onClick={() => {
                                            setActiveTab('rab');
                                            setTimeout(() => { window.print(); setTimeout(() => setActiveTab('summary'), 100); }, 100);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
                                        title="Cetak RAB"
                                    >
                                        <FileText size={14} /> Cetak RAB
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab('invoice');
                                            setTimeout(() => { window.print(); setTimeout(() => setActiveTab('summary'), 100); }, 100);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-teal-600 hover:bg-teal-50 rounded-xl transition-all border border-teal-200"
                                        title="Cetak Invoice"
                                    >
                                        <ShoppingCart size={14} /> Cetak Invoice
                                    </button>

                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all bg-slate-50"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>



                        <div className={`flex-1 custom-scrollbar min-h-0 print:overflow-visible print:p-0 print:bg-white ${activeTab === 'summary' ? 'bg-white flex flex-col overflow-hidden' : 'bg-slate-50/30 p-10 overflow-y-auto'}`}>
                            <div id="printable-area" className={activeTab === 'summary' ? 'w-full flex-1 flex flex-col min-h-0' : ''}>
                                {activeTab === 'summary' && (
                                    <div className="animate-fade-in mx-auto flex flex-col flex-1 p-0 no-print w-full h-full">


                                        {/* 3D Design Preview */}
                                        <div className="w-full flex-1 bg-white p-8 md:p-12 flex flex-col items-center justify-center">
                                            <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center justify-center gap-2 shrink-0">
                                                <Package size={18} className="text-slate-300" /> Visualisasi Desain 3D
                                            </h4>

                                            {selectedOrder.config?.designSnapshot ? (
                                                <div className="relative group overflow-hidden w-full max-w-4xl flex-1 flex items-center justify-center">
                                                    <img src={selectedOrder.config.designSnapshot} alt="3D Design" className="absolute inset-0 w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                </div>
                                            ) : (
                                                <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center text-slate-300">
                                                    <Package size={64} className="mb-6 opacity-20" />
                                                    <p className="text-lg font-bold text-slate-400">Belum ada tangkapan layar 3D.</p>
                                                    <p className="text-xs uppercase tracking-widest mt-2 opacity-60">Pesanan ini mungkin dibuat manual.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'rab' && (
                                    <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[3rem] shadow-xl border border-slate-100 animate-fade-in print:shadow-none print:border-none relative overflow-hidden">
                                        {/* Subtle Watermark */}
                                        <div className="absolute -right-20 top-20 rotate-45 opacity-[0.03] select-none pointer-events-none">
                                            <h1 className="text-[12rem] font-black tracking-tighter">AGMAL JAYA</h1>
                                        </div>

                                        {/* Document Header */}
                                        <div className="flex justify-between items-start mb-20 pb-12 border-b-2 border-slate-100 relative z-10 print:mb-4 print:pb-4">
                                            <div>
                                                <div className="w-20 h-20 mb-6 print:w-12 print:h-12 print:mb-2">
                                                    <img src="/brand/logo-icon.jpg" alt="AGMAL JAYA INTERIOR Logo" className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-slate-200" />
                                                </div>
                                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-1 print:text-2xl">Rencana Anggaran Biaya</h2>
                                                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Penawaran Harga Resmi (Quotation)</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest mb-4 print:mb-2">
                                                    ID: RAB-{String(selectedOrder.id || '').split('-')[0].toUpperCase()}
                                                </div>
                                                <p className="text-xs font-bold text-slate-500 italic">Diterbitkan: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Berlaku s/d: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                                            </div>
                                        </div>

                                        {/* Client & Project Info */}
                                        <div className="grid grid-cols-2 gap-20 mb-20 relative z-10 print:gap-8 print:mb-6">
                                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 print:bg-transparent print:border-y-4 print:border-x-0 print:border-slate-900 print:rounded-none print:px-0 print:py-4">
                                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 print:mb-2">
                                                    <User size={12} className="print:hidden" /> Data Pelanggan
                                                </h5>
                                                <p className="text-2xl font-black text-slate-900 mb-1 print:text-lg">{selectedOrder.customer?.name}</p>
                                                <p className="text-sm font-bold text-slate-600 mb-3 print:mb-1">{selectedOrder.customer?.phone}</p>
                                                <div className="w-10 h-1 bg-slate-200 mb-3 rounded-full print:hidden"></div>
                                                <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"{selectedOrder.customer?.address}"</p>
                                            </div>
                                            <div className="text-right flex flex-col justify-center">
                                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 print:mb-2">Ringkasan Proyek</h5>
                                                <p className="text-2xl font-black text-slate-900 mb-1 print:text-lg">{selectedOrder.config?.productSelection?.name}</p>
                                                <p className="text-sm font-bold text-teal-600 mb-2">Konfigurasi: {selectedOrder.config?.productSelection?.shape}</p>
                                                <div className="flex items-center justify-end gap-3 mt-4 print:mt-1">
                                                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase print:py-1">Dimensi: {selectedOrder.config?.room?.length}x{selectedOrder.config?.room?.width}cm</div>
                                                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase print:py-1">Tinggi: {selectedOrder.config?.room?.height}cm</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Itemized Table */}
                                        <div className="mb-20 relative z-10 print:mb-4">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b-4 border-slate-900">
                                                        <th className="py-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-900 print:py-2">Deskripsi Item</th>
                                                        <th className="py-6 text-center text-[11px] font-black uppercase tracking-widest text-slate-900 print:py-2">Kuantitas</th>
                                                        <th className="py-6 text-right text-[11px] font-black uppercase tracking-widest text-slate-900 print:py-2">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {selectedOrder.config?.bom?.items ? (
                                                        selectedOrder.config.bom.items.map((item: any, idx: number) => (
                                                            <tr key={idx}>
                                                                <td className="py-6 print:py-2">
                                                                    <p className="text-sm font-black text-slate-900 mb-1">{item.name}</p>
                                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.type || 'FURNITUR'}</p>
                                                                </td>
                                                                <td className="py-6 text-center text-slate-900 font-bold text-sm print:py-2">{item.quantity} Unit</td>
                                                                <td className="py-6 text-right print:py-2">
                                                                    <p className="text-lg font-black text-slate-900 print:text-sm">
                                                                        {item.price ? `Rp ${(item.price * (item.quantity || 1)).toLocaleString('id-ID')}` : <span className="text-teal-600 text-[11px] uppercase tracking-widest">Include Paket</span>}
                                                                    </p>
                                                                    {item.price > 0 && <p className="text-[10px] font-bold text-slate-400 mt-1">@ Rp {item.price.toLocaleString('id-ID')}</p>}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        // Fallback for manual/legacy orders
                                                        <>
                                                            <tr>
                                                                <td className="py-10 print:py-2">
                                                                    <p className="text-lg font-black text-slate-900 mb-1">Pabrikasi Furnitur Utama</p>
                                                                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">Material: {MATERIAL_COLORS[selectedOrder.config?.design?.materialId]?.name || 'Premium HPL'}</p>
                                                                    <ul className="text-xs text-slate-500 space-y-1.5 font-medium">
                                                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> Plywood/Blockboard High Grade 18mm</li>
                                                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> Finishing HPL (High Pressure Laminate)</li>
                                                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> Engsel Slow-Motion & Rel Double Track</li>
                                                                    </ul>
                                                                </td>
                                                                <td className="py-10 text-center font-bold text-slate-900 text-sm print:py-2">
                                                                    1 Paket
                                                                </td>
                                                                <td className="py-10 text-right print:py-2">
                                                                    <p className="text-xl font-black text-slate-900 print:text-sm">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</p>
                                                                    <p className="text-[10px] font-bold text-slate-400 mt-1">Nett / Include Installation</p>
                                                                </td>
                                                            </tr>
                                                            {(selectedOrder.config?.design?.accessories || []).length > 0 && (
                                                                <tr>
                                                                    <td className="py-10 print:py-2">
                                                                        <p className="font-black text-slate-900 mb-2">Hardware & Aksesoris</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {(selectedOrder.config?.design?.accessories || []).map((acc: string, i: number) => (
                                                                                <span key={i} className="text-[9px] font-black bg-slate-50 text-slate-500 px-3 py-1 rounded-md uppercase tracking-widest border border-slate-100">
                                                                                    {acc}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-10 text-center text-xs font-bold text-slate-400 italic print:py-2">Custom Selection</td>
                                                                    <td className="py-10 text-right text-[10px] font-black text-teal-600 uppercase tracking-widest print:py-2">Sudah Termasuk</td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    )}
                                                    <tr>
                                                        <td className="py-8 print:py-2">
                                                            <p className="font-black text-slate-900 mb-1">Transportasi & Pemasangan</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">Pengiriman armada workshop dan instalasi profesional di lokasi.</p>
                                                        </td>
                                                        <td className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest print:py-2">Jabodetabek</td>
                                                        <td className="py-8 text-right print:py-2">
                                                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest line-through opacity-30 mr-2">Rp 750.000</span>
                                                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Gratis</span>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-t-[6px] border-slate-900 print:break-inside-avoid">
                                                        <td colSpan={2} className="py-10 text-right print:py-4">
                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Total Investasi Proyek</p>
                                                        </td>
                                                        <td className="py-10 text-right print:py-4">
                                                            <p className="text-4xl font-black text-slate-900 tracking-tighter print:text-2xl">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Terms & Authorization */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-16 border-t border-slate-100 relative z-10 print:grid-cols-2 print:gap-8 print:pt-4">
                                            <div className="space-y-6 print:space-y-2">
                                                <h6 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" /> Syarat & Ketentuan:
                                                </h6>
                                                <ul className="text-[10px] text-slate-500 space-y-3 font-medium leading-relaxed">
                                                    {(settings?.templates?.rabTerms || "Penawaran ini bersifat final berdasarkan data dimensi yang diberikan secara online.\nPembayaran Down Payment (DP) 50% wajib dilakukan sebagai tanda approval produksi.\nWaktu produksi estimasi 10-14 hari kerja sejak DP diterima.\nGaransi material dan hardware selama 1 tahun untuk penggunaan normal.").split('\n').map((term: string, i: number) => (
                                                        <li key={i} className="flex gap-3">
                                                            <span>{String(i + 1).padStart(2, '0')}.</span>
                                                            <span>{term}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col items-center justify-center text-center pt-8 print:pt-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-16 print:mb-8">Hormat Kami,</p>
                                                <div className="relative mb-2 flex items-center justify-center">
                                                    {/* Simulated Stamp */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 w-28 h-28 border-[3px] border-indigo-600/30 print:border-indigo-800 rounded-full flex items-center justify-center opacity-80 print:opacity-100 mix-blend-multiply print:mix-blend-normal pointer-events-none print:w-20 print:h-20">
                                                        <div className="w-[100px] h-[100px] border border-indigo-600/30 print:border-indigo-800 rounded-full flex flex-col items-center justify-center text-indigo-600/50 print:text-indigo-800">
                                                            <span className="text-[7px] font-black uppercase tracking-widest mt-1">Verified</span>
                                                            <div className="w-12 h-px bg-indigo-600/30 print:bg-indigo-800 my-1"></div>
                                                            <span className="text-[6px] font-bold uppercase tracking-widest">AGMAL JAYA</span>
                                                            <span className="text-[6px] font-bold uppercase tracking-widest">Interior</span>
                                                        </div>
                                                    </div>

                                                    {/* Simulated Signature */}
                                                    <div style={{ fontFamily: '"Brush Script MT", "Snell Roundhand", cursive' }} className="text-4xl text-slate-700 -rotate-6 relative z-10 scale-125">Agmal Jaya</div>
                                                </div>
                                                <div className="w-48 h-[2px] bg-slate-900 mt-2 mb-1"></div>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{settings?.site?.name || 'AGMAL JAYA INTERIOR'}</p>
                                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Manajemen AGMAL JAYA INTERIOR</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'invoice' && (
                                    <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border-t-[16px] border-slate-900 animate-fade-in print:shadow-none print:border-none relative">
                                        {/* Invoice Status Tag */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none z-0">
                                            <div className="px-12 py-4 border-8 border-amber-500/10 rounded-[3rem]">
                                                <span className="text-6xl md:text-8xl font-black text-amber-600 opacity-10 uppercase tracking-tighter">AWAITING DP</span>
                                            </div>
                                        </div>

                                        {/* Invoice Header */}
                                        <div className="flex justify-between items-start mb-20 relative z-10 print:mb-6">
                                            <div className="space-y-6 print:space-y-2">
                                                <div className="w-16 h-16 print:w-12 print:h-12">
                                                    <img src="/brand/logo-icon.jpg" alt="AGMAL JAYA INTERIOR Logo" className="w-full h-full object-cover rounded-2xl shadow-xl shadow-slate-200" />
                                                </div>
                                                <div>
                                                    <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-2 print:text-4xl print:mb-0">Invoice</h1>
                                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">Tagihan Resmi Penjualan</p>
                                                </div>
                                            </div>
                                            <div className="text-right pb-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diterbitkan Oleh</p>
                                                <p className="text-sm font-black text-slate-900">{settings?.site?.name || 'AGMAL JAYA INTERIOR'}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{settings?.site?.address || 'Workshop Jepara, Jawa Tengah'}</p>

                                            </div>
                                        </div>

                                        {/* Invoice Details Grid */}
                                        <div className="grid grid-cols-3 gap-12 mb-20 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative z-10 print:bg-transparent print:border-y-4 print:border-x-0 print:border-slate-900 print:rounded-none print:px-0 print:py-4 print:mb-6 print:gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 print:mb-1"><User size={12} className="print:hidden" /> Billed To:</p>
                                                <p className="text-lg font-black text-slate-900 print:text-sm">{selectedOrder.customer?.name}</p>
                                                <p className="text-xs font-bold text-slate-500 mt-1">{selectedOrder.customer?.phone}</p>
                                                <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed italic truncate">{selectedOrder.customer?.address}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Invoice Details:</p>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">#INV/{new Date().getFullYear()}/{String(selectedOrder.id || '').split('-')[0].toUpperCase()}</p>
                                                <p className="text-xs font-bold text-slate-500 italic">Issued: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Status:</p>
                                                <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-200 shadow-sm">PENDING</span>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        <div className="mb-12 relative z-10">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b-4 border-slate-900">
                                                        <th className="py-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-900">Deskripsi Item & Layanan</th>
                                                        <th className="py-6 text-center text-[11px] font-black uppercase tracking-widest text-slate-900">Kuantitas</th>
                                                        <th className="py-6 text-right text-[11px] font-black uppercase tracking-widest text-slate-900">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {selectedOrder.config?.bom?.items ? (
                                                        selectedOrder.config.bom.items.map((item: any, idx: number) => (
                                                            <tr key={idx}>
                                                                <td className="py-6">
                                                                    <p className="text-sm font-black text-slate-900 mb-1">{item.name}</p>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.type || 'FURNITUR'}</p>
                                                                </td>
                                                                <td className="py-6 text-center text-sm font-black text-slate-900">{item.quantity || 1} Unit</td>
                                                                <td className="py-6 text-right">
                                                                    <p className="text-lg font-black text-slate-900">
                                                                        {item.price ? `Rp ${(item.price * (item.quantity || 1)).toLocaleString('id-ID')}` : <span className="text-teal-600 text-[11px] uppercase tracking-widest">Satu Paket</span>}
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td className="py-8">
                                                                <p className="text-lg font-black text-slate-900 mb-1">Pemesanan Furnitur Custom</p>
                                                                <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Model: {selectedOrder.config?.productSelection?.name}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Material: {MATERIAL_COLORS[selectedOrder.config?.design?.materialId]?.name || 'Premium Plywood'}</p>
                                                            </td>
                                                            <td className="py-8 text-center text-sm font-black text-slate-900">01 Ls</td>
                                                            <td className="py-8 text-right text-xl font-black text-slate-900">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Terbilang Section */}
                                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] mb-12 flex gap-4 items-center print:bg-transparent print:border-y-4 print:border-x-0 print:border-slate-900 print:rounded-none print:px-0 print:py-4 print:mb-6">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0 print:hidden">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Terbilang (Amount in Words)</p>
                                                <p className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
                                                    "{terbilang(selectedOrder.totalPrice || 0)} Rupiah"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Totals & QR Section */}
                                        <div className="flex flex-col md:flex-row gap-16 items-start justify-between border-t-2 border-slate-50 pt-16 relative z-10 print:pt-4 print:gap-8">
                                            <div className="flex gap-8 items-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 print:bg-transparent print:border-none print:p-0 print:rounded-none">
                                                {/* Simulated QR Code */}
                                                <div className="w-24 h-24 bg-white p-2 border border-slate-200 rounded-xl grid grid-cols-4 grid-rows-4 gap-1 opacity-60 print:border-slate-900 print:opacity-100 print:w-16 print:h-16">
                                                    {[...Array(16)].map((_, i) => (
                                                        <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`} />
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 print:mb-2"><ShoppingCart size={12} className="print:hidden" /> Panduan Pembayaran:</p>
                                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 print:bg-transparent print:border-slate-900 print:rounded-xl print:p-4 print:space-y-2">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-black shrink-0">{settings?.payment?.bankName || 'BCA'}</div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-900 tracking-widest whitespace-nowrap">{settings?.payment?.bankAccount || '890 1234 567'}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">A/N {settings?.payment?.bankHolder || 'AGMAL JAYA INTERIOR'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50">
                                                            <div className="w-10 h-6 bg-rose-600 rounded flex items-center justify-center text-[10px] text-white font-black uppercase shrink-0">QRIS</div>
                                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-snug">Scan QR di Toko / Chat Admin</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-96 space-y-5">
                                                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Subtotal Pekerjaan</span>
                                                    <span className="text-slate-600 whitespace-nowrap">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Pajak (PPN 0%)</span>
                                                    <span className="text-slate-600 whitespace-nowrap">Rp 0</span>
                                                </div>
                                                <div className="w-full h-px bg-slate-100 my-2"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Total Billing</span>
                                                    <span className="text-4xl font-black text-slate-900 tracking-tighter whitespace-nowrap print:text-2xl">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white flex justify-between items-center shadow-xl shadow-slate-200 print:bg-transparent print:border-[4px] print:border-slate-900 print:text-slate-900 print:shadow-none print:rounded-2xl print:mt-4 print:p-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-slate-400 print:text-slate-900 uppercase tracking-widest">Down Payment (50%)</p>
                                                        <p className="text-sm font-black tracking-widest whitespace-nowrap">Minimum Deposit</p>
                                                    </div>
                                                    <p className="text-xl font-black whitespace-nowrap">Rp {((selectedOrder.totalPrice || 0) * 0.5).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Signatures & Stamp */}
                                        <div className="mt-16 flex justify-end relative z-10 print:mt-6">
                                            <div className="text-center relative">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-16 print:mb-8">Hormat Kami,</p>

                                                {/* Simulated Stamp */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 w-28 h-28 border-[3px] border-teal-600/30 print:border-teal-800 rounded-full flex items-center justify-center opacity-80 print:opacity-100 mix-blend-multiply print:mix-blend-normal pointer-events-none print:w-20 print:h-20">
                                                    <div className="w-[100px] h-[100px] border border-teal-600/30 print:border-teal-800 rounded-full flex flex-col items-center justify-center text-teal-600/50 print:text-teal-800">
                                                        <span className="text-[7px] font-black uppercase tracking-widest mt-1">Verified</span>
                                                        <div className="w-12 h-px bg-teal-600/30 print:bg-teal-800 my-1"></div>
                                                        <span className="text-[6px] font-bold uppercase tracking-widest">AGMAL JAYA</span>
                                                        <span className="text-[6px] font-bold uppercase tracking-widest">Interior</span>
                                                    </div>
                                                </div>

                                                {/* Simulated Signature */}
                                                <div style={{ fontFamily: '"Brush Script MT", "Snell Roundhand", cursive' }} className="text-4xl text-slate-700 -rotate-6 relative z-10 scale-125">Agmal Jaya</div>

                                                <div className="w-48 h-[2px] bg-slate-900 mt-2 mb-1"></div>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{settings?.site?.name || 'AGMAL JAYA INTERIOR'}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Direktur Utama</p>
                                            </div>
                                        </div>

                                        {/* Invoice Footer */}
                                        <div className="mt-24 pt-12 border-t border-slate-50 flex flex-col items-center print:mt-8 print:pt-4">
                                            <div className="px-6 py-2 bg-slate-50 text-slate-400 text-[9px] font-black rounded-full uppercase tracking-[0.4em] mb-4 print:mb-2">Official Electronic Invoice</div>
                                            <div className="text-center space-y-2 mb-4">
                                                {(settings?.templates?.invoiceTerms || "Barang yang sudah dibeli tidak dapat ditukar.\nGaransi produk selama 12 bulan pengerjaan.\nBukti pembayaran ini sah sebagai nota resmi.").split('\n').map((term: string, i: number) => (
                                                    <p key={i} className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">{term}</p>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-300 font-medium italic text-center max-w-md">Terima kasih telah mempercayakan interior Anda kepada AGMAL JAYA INTERIOR.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-4 sticky bottom-0 z-20 no-print">

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl transition-all hover:bg-slate-50 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Tutup Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
