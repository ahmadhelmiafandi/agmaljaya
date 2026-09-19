import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ShoppingCart, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
}

interface RecentOrder {
    id: string;
    createdAt?: string;
    created_at?: string;
    totalPrice?: number;
    estimatedPrice?: number;
    config?: {
        placedItems?: any[];
    };
    [key: string]: any;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orders] = await Promise.all([
                    api.getOrders()
                ]);

                const realOrders = orders.filter((o: any) => o && o.status !== 'Draft' && o.customer?.name);

                const pendingCount = realOrders.filter((o: any) => 
                    !o.status || o.status === 'PENDING'
                ).length;

                setStats({
                    totalOrders: realOrders.length,
                    pendingOrders: pendingCount,
                    totalRevenue: realOrders.reduce((sum: number, order: any) => 
                        sum + (order.totalPrice || order.estimatedPrice || 0), 0
                    )
                });

                setRecentOrders(realOrders.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Fallback polling every 15 seconds in case Supabase Realtime is not enabled
        const interval = setInterval(() => {
            fetchData();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                <p className="text-sm text-slate-500 mt-1">Ringkasan statistik website</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="p-2.5 md:p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                        <ShoppingCart size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-slate-500 truncate">Total Pesanan</p>
                        <p className="text-lg md:text-2xl font-bold text-slate-800">{stats.totalOrders}</p>
                        {stats.pendingOrders > 0 && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                <Clock size={12} /> {stats.pendingOrders} pending
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                    <div className="p-2.5 md:p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <TrendingUp size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-slate-500 truncate">Estimasi Revenue</p>
                        <p className="text-base md:text-2xl font-bold text-slate-800 truncate">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-sm p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-white col-span-2 lg:col-span-4">
                    <div className="p-2.5 md:p-3 bg-white/20 rounded-lg shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-teal-50">Status Sistem</p>
                        <p className="text-xl font-bold">Semua sistem berjalan normal</p>
                        <p className="text-xs text-teal-100 mt-1">CMS aktif • Database online</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            {recentOrders.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">Pesanan Terbaru</h3>
                        <p className="text-sm text-slate-500 mt-1">{recentOrders.length} pesanan terakhir</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-slate-600">
                                                {String(order.id).length > 8 ? String(order.id).slice(0, 8) + '...' : order.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {order.config?.placedItems?.length || 0} item
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">
                                            Rp {(order.totalPrice || order.estimatedPrice || 0).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
