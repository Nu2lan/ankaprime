import { useEffect, useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useLang } from '../i18n'

export default function Coupons() {
    const { t } = useLang()
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', expiryDate: '', isActive: true })

    const load = () => {
        api.get('/admin/coupons').then(r => { setCoupons(r.data.coupons); setLoading(false) }).catch(() => setLoading(false))
    }
    useEffect(load, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...form, value: Number(form.value), minOrder: form.minOrder ? Number(form.minOrder) : 0 }
            if (editId) await api.put(`/admin/coupons/${editId}`, payload)
            else await api.post('/admin/coupons', payload)
            toast.success(editId ? t('updated') : t('created'))
            setForm({ code: '', type: 'percent', value: '', minOrder: '', expiryDate: '', isActive: true }); setEditId(null); setShowForm(false); load()
        } catch (err) { toast.error(err.response?.data?.message || t('failed')) }
    }

    const handleEdit = (c) => {
        setForm({ code: c.code, type: c.type, value: c.value, minOrder: c.minOrder || '', expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : '', isActive: c.isActive })
        setEditId(c._id); setShowForm(true)
    }
    const handleDelete = async (id) => { if (!confirm(t('delete') + '?')) return; try { await api.delete(`/admin/coupons/${id}`); toast.success(t('deleted')); load() } catch { toast.error(t('failed')) } }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-luxe-text">{t('coupons')}</h1>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ code: '', type: 'percent', value: '', minOrder: '', expiryDate: '', isActive: true }) }} className="btn-gold flex items-center gap-1.5"><HiOutlinePlus className="w-4 h-4" /> {t('addCoupon')}</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card-admin flex items-end gap-3">
                    <div className="flex-1"><label className="block text-xs text-luxe-muted mb-1">{t('code')} *</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-admin" required /></div>
                    <div className="w-36"><label className="block text-xs text-luxe-muted mb-1">{t('type')}</label>
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-admin">
                            <option value="percent">{t('percent')}</option><option value="fixed">{t('fixed')}</option>
                        </select></div>
                    <div className="w-28"><label className="block text-xs text-luxe-muted mb-1">{t('value')} *</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="input-admin" required /></div>
                    <div className="w-28"><label className="block text-xs text-luxe-muted mb-1">{t('minOrder')}</label><input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} className="input-admin" /></div>
                    <div className="w-40"><label className="block text-xs text-luxe-muted mb-1">{t('expires')}</label><input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="input-admin" /></div>
                    <button type="submit" className="btn-gold whitespace-nowrap">{editId ? t('update') : t('create')}</button>
                    <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="btn-outline whitespace-nowrap">{t('cancel')}</button>
                </form>
            )}

            <div className="card-admin p-0 overflow-hidden">
                <table className="table-admin">
                    <thead><tr><th>{t('code')}</th><th>{t('type')}</th><th>{t('value')}</th><th>{t('minOrder')}</th><th>{t('expires')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={7} className="text-center py-8 text-luxe-muted">{t('loading')}</td></tr> :
                            coupons.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-luxe-muted">{t('noCoupons')}</td></tr> :
                                coupons.map(c => (
                                    <tr key={c._id}>
                                        <td className="font-mono text-luxe-gold font-medium">{c.code}</td>
                                        <td className="text-luxe-muted capitalize">{c.type}</td>
                                        <td className="text-luxe-text">{c.type === 'percent' ? `${c.value}%` : `$${c.value}`}</td>
                                        <td className="text-luxe-muted">{c.minOrder ? `$${c.minOrder}` : '-'}</td>
                                        <td className="text-luxe-muted text-xs">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-GB') : t('never')}</td>
                                        <td><span className={`badge-status ${c.isActive ? 'bg-luxe-success/10 text-luxe-success' : 'bg-luxe-error/10 text-luxe-error'}`}>{c.isActive ? t('active') : t('inactive')}</span></td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(c)} className="p-1.5 text-luxe-muted hover:text-luxe-gold transition-all"><HiOutlinePencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(c._id)} className="p-1.5 text-luxe-muted hover:text-luxe-error transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
