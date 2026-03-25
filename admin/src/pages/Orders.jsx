import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { HiOutlineSearch } from 'react-icons/hi'
import { useLang } from '../i18n'

const statusColors = {
    pending: 'bg-yellow-400/10 text-yellow-400',
    paid: 'bg-blue-400/10 text-blue-400',
    processing: 'bg-purple-400/10 text-purple-400',
    shipped: 'bg-cyan-400/10 text-cyan-400',
    delivered: 'bg-luxe-success/10 text-luxe-success',
    canceled: 'bg-luxe-error/10 text-luxe-error',
}

export default function Orders() {
    const { t } = useLang()
    const [orders, setOrders] = useState([])
    const [pagination, setPagination] = useState({ page: 1, pages: 1 })
    const [statusFilter, setStatusFilter] = useState('')
    const [search, setSearch] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [loading, setLoading] = useState(true)

    const load = (page = 1) => {
        setLoading(true)
        const params = { page, limit: 20 }
        if (statusFilter) params.status = statusFilter
        api.get('/admin/orders', { params })
            .then(r => { setOrders(r.data.orders); setPagination(r.data.pagination) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [statusFilter])

    const filtered = orders.filter(o => {
        if (search) {
            const q = search.toLowerCase()
            const match = o._id.toLowerCase().includes(q) ||
                (o.userId?.fullName || '').toLowerCase().includes(q)
            if (!match) return false
        }
        if (dateFilter && dateFilter.length === 10) {
            const d = new Date(o.createdAt)
            const orderDate = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear()
            if (orderDate !== dateFilter) return false
        }
        return true
    })

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-display font-bold text-luxe-text">{t('orders')}</h1>

            <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs text-luxe-muted mb-1">{t('search')}</label>
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={t('orderIdOrCustomer')}
                            className="input-admin pl-9"
                        />
                    </div>
                </div>
                <div className="w-44">
                    <label className="block text-xs text-luxe-muted mb-1">{t('status')}</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-admin">
                        <option value="">{t('allStatuses')}</option>
                        {['pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div className="w-44">
                    <label className="block text-xs text-luxe-muted mb-1">{t('date')}</label>
                    <input
                        value={dateFilter}
                        onChange={e => {
                            let v = e.target.value.replace(/[^\d]/g, '')
                            if (v.length > 8) v = v.slice(0, 8)
                            if (v.length >= 5) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4)
                            else if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
                            setDateFilter(v)
                        }}
                        placeholder="DD/MM/YYYY"
                        className="input-admin"
                        maxLength={10}
                    />
                </div>
            </div>

            <div className="card-admin p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-admin">
                        <thead><tr><th>{t('orderId')}</th><th>{t('customer')}</th><th>{t('items')}</th><th>{t('total')}</th><th>{t('status')}</th><th>{t('date')}</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan={6} className="text-center py-10 text-luxe-muted">{t('loading')}</td></tr> :
                                filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-luxe-muted">{t('noOrdersFound')}</td></tr> :
                                    filtered.map(o => (
                                        <tr key={o._id}>
                                            <td><Link to={`/orders/${o._id}`} className="text-luxe-gold hover:text-luxe-gold-hover font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</Link></td>
                                            <td className="text-luxe-text">{o.userId?.fullName || 'N/A'}</td>
                                            <td className="text-luxe-muted">{o.items?.length || 0}</td>
                                            <td className="text-luxe-gold font-medium">{o.total?.toLocaleString()} AZN</td>
                                            <td><span className={`badge-status capitalize ${statusColors[o.status] || ''}`}>{o.status}</span></td>
                                            <td className="text-luxe-muted text-xs">{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => load(p)} className={`w-9 h-9 rounded-lg text-sm ${p === pagination.page ? 'bg-luxe-gold text-luxe-black' : 'bg-luxe-card text-luxe-muted border border-luxe-border'}`}>{p}</button>
                    ))}
                </div>
            )}
        </div>
    )
}
