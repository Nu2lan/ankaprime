import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'
import { useLang } from '../i18n'

const allStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled']
const statusColors = {
    pending: 'bg-yellow-400/10 text-yellow-400',
    paid: 'bg-blue-400/10 text-blue-400',
    processing: 'bg-purple-400/10 text-purple-400',
    shipped: 'bg-cyan-400/10 text-cyan-400',
    delivered: 'bg-luxe-success/10 text-luxe-success',
    canceled: 'bg-luxe-error/10 text-luxe-error',
}

export default function OrderDetail() {
    const { id } = useParams()
    const { t } = useLang()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/admin/orders/${id}`).then(r => setOrder(r.data.order)).catch(() => { }).finally(() => setLoading(false))
    }, [id])

    const updateStatus = async (status) => {
        try {
            const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
            setOrder(data.order)
            toast.success(t('updated'))
        } catch { toast.error(t('failed')) }
    }

    if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-luxe-surface animate-pulse rounded-xl" />)}</div>
    if (!order) return <p className="text-luxe-muted">{t('orderNotFound')}</p>

    return (
        <div className="space-y-5 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-luxe-text">{t('orderId')} #{order._id.slice(-8).toUpperCase()}</h1>
                    <p className="text-xs text-luxe-muted mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`badge-status text-sm capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
            </div>

            {/* Status update */}
            <div className="card-admin">
                <p className="text-xs text-luxe-muted mb-2">{t('updateStatus')}</p>
                <div className="flex gap-2 flex-wrap">
                    {allStatuses.map(s => (
                        <button key={s} onClick={() => updateStatus(s)} disabled={order.status === s}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${order.status === s ? 'border-luxe-gold text-luxe-gold bg-luxe-gold/10' : 'border-luxe-border text-luxe-muted hover:text-luxe-text disabled:opacity-30'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer */}
            <div className="card-admin">
                <h3 className="text-sm font-semibold text-luxe-text mb-3">{t('customer')}</h3>
                <p className="text-sm text-luxe-text">{order.userId?.fullName}</p>
                <p className="text-xs text-luxe-muted">{order.userId?.email}</p>
            </div>

            {/* Items */}
            <div className="card-admin">
                <h3 className="text-sm font-semibold text-luxe-text mb-3">{t('items')} ({order.items.length})</h3>
                <div className="space-y-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <img src={item.imageSnapshot || ''} alt="" className="w-12 h-12 rounded object-cover bg-luxe-card" />
                            <div className="flex-1">
                                <p className="text-sm text-luxe-text">{item.titleSnapshot}</p>
                                <p className="text-xs text-luxe-muted">×{item.qty} @ {item.priceSnapshot} AZN</p>
                            </div>
                            <p className="text-sm text-luxe-gold font-medium">{(item.priceSnapshot * item.qty).toLocaleString()} AZN</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping & Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="card-admin">
                    <h3 className="text-sm font-semibold text-luxe-text mb-3">{t('shippingAddress')}</h3>
                    <div className="text-sm text-luxe-muted space-y-0.5">
                        <p>{order.shippingAddress?.fullName}</p>
                        <p>{order.shippingAddress?.street}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                        <p>{order.shippingAddress?.phone}</p>
                    </div>
                </div>
                <div className="card-admin">
                    <h3 className="text-sm font-semibold text-luxe-text mb-3">{t('paymentSummary')}</h3>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between text-luxe-muted"><span>{t('subtotal')}</span><span>{order.subtotal?.toLocaleString()} AZN</span></div>
                        {order.discount > 0 && <div className="flex justify-between text-luxe-success"><span>{t('discount')}</span><span>-{order.discount.toLocaleString()} AZN</span></div>}
                        <div className="flex justify-between text-luxe-muted"><span>{t('delivery')}</span><span>{order.deliveryFee?.toLocaleString()} AZN</span></div>
                        <hr className="border-luxe-border" />
                        <div className="flex justify-between font-semibold text-luxe-gold"><span>{t('total')}</span><span>{order.total?.toLocaleString()} AZN</span></div>
                    </div>
                    {order.payment?.transactionId && <p className="text-xs text-luxe-muted mt-3">TXN: {order.payment.transactionId}</p>}
                </div>
            </div>
        </div>
    )
}
