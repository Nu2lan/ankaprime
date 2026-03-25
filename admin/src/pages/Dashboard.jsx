import { useEffect, useState } from 'react'
import api from '../api'
import { HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineExclamation } from 'react-icons/hi'
import { useLang } from '../i18n'

export default function Dashboard() {
    const { t } = useLang()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(r => setStats(r.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-luxe-surface animate-pulse rounded-xl" />)}</div></div>

    const kpis = [
        { label: t('totalOrders'), value: stats?.totalOrders || 0, icon: HiOutlineShoppingCart, color: 'text-luxe-info' },
        { label: t('revenue'), value: `${(stats?.totalRevenue || 0).toLocaleString()} AZN`, icon: HiOutlineCurrencyDollar, color: 'text-luxe-gold' },
        { label: t('totalUsers'), value: stats?.totalUsers || 0, icon: HiOutlineUsers, color: 'text-luxe-success' },
        { label: t('lowStock'), value: stats?.lowStockProducts || 0, icon: HiOutlineExclamation, color: 'text-luxe-warning' },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-display font-bold text-luxe-text">{t('dashboard')}</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                    <div key={i} className="card-admin flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-luxe-card ${k.color}`}>
                            <k.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-luxe-muted">{k.label}</p>
                            <p className="text-xl font-semibold text-luxe-text">{k.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Monthly Sales Chart */}
            {stats?.monthlySales?.length > 0 && (
                <div className="card-admin">
                    <h3 className="font-display text-lg text-luxe-text mb-4">{t('monthlySales')}</h3>
                    <div className="flex items-end gap-2 h-40">
                        {stats.monthlySales.map((m, i) => {
                            const maxRev = Math.max(...stats.monthlySales.map(s => s.revenue))
                            const h = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-luxe-gold font-medium">${(m.revenue / 1000).toFixed(1)}k</span>
                                    <div className="w-full bg-luxe-gold/20 rounded-t" style={{ height: `${Math.max(h, 5)}%` }}>
                                        <div className="w-full h-full bg-gradient-to-t from-luxe-gold to-luxe-gold-hover rounded-t opacity-80" />
                                    </div>
                                    <span className="text-[9px] text-luxe-muted">{m._id?.slice(5) || ''}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className="card-admin">
                <h3 className="font-display text-lg text-luxe-text mb-4">{t('recentOrders')}</h3>
                <div className="overflow-x-auto">
                    <table className="table-admin">
                        <thead>
                            <tr>
                                <th>{t('orderId')}</th><th>{t('customer')}</th><th>{t('total')}</th><th>{t('status')}</th><th>{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stats?.monthlySales?.length === 0) && (
                                <tr><td colSpan={5} className="text-center text-luxe-muted py-8">{t('noOrdersYet')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
