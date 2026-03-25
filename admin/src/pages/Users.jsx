import { useEffect, useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../App'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useLang } from '../i18n'

export default function Users() {
    const { user: me } = useAuth()
    const { t } = useLang()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('admin')
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ fullName: '', email: '', password: '' })

    const load = () => {
        setLoading(true)
        api.get('/admin/users').then(r => setUsers(r.data.users)).catch(() => { }).finally(() => setLoading(false))
    }
    useEffect(load, [])

    const admins = users.filter(u => u.role === 'admin')
    const customers = users.filter(u => u.role === 'user')

    const resetForm = () => { setForm({ fullName: '', email: '', password: '' }); setEditId(null); setShowForm(false) }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editId) {
                const payload = { fullName: form.fullName, email: form.email }
                if (form.password) payload.password = form.password
                await api.put(`/admin/users/${editId}`, payload)
                toast.success(t('updated'))
            } else {
                await api.post('/admin/users', { ...form, role: 'admin' })
                toast.success(t('created'))
            }
            resetForm(); load()
        } catch (err) { toast.error(err.response?.data?.message || t('failed')) }
    }

    const handleEdit = (u) => {
        setForm({ fullName: u.fullName, email: u.email, password: '' })
        setEditId(u._id); setShowForm(true)
    }

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        if (!confirm(`Change role to ${newRole}?`)) return
        try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole })
            toast.success(t('updated')); load()
        } catch (err) { toast.error(err.response?.data?.message || t('failed')) }
    }

    const handleDelete = async (id) => {
        if (!confirm(t('delete') + '?')) return
        try {
            await api.delete(`/admin/users/${id}`)
            toast.success(t('deleted')); load()
        } catch (err) { toast.error(err.response?.data?.message || t('failed')) }
    }

    const list = tab === 'admin' ? admins : customers

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-luxe-text">{t('users')}</h1>
                {tab === 'admin' && (
                    <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-gold flex items-center gap-1.5">
                        <HiOutlinePlus className="w-4 h-4" /> {t('addAdmin')}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-luxe-card border border-luxe-border rounded-lg p-1 w-fit">
                {[
                    { key: 'admin', label: t('adminPanelTab'), count: admins.length },
                    { key: 'customer', label: t('customers'), count: customers.length }
                ].map(tb => (
                    <button
                        key={tb.key}
                        onClick={() => { setTab(tb.key); resetForm() }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === tb.key
                            ? 'bg-luxe-gold text-luxe-black'
                            : 'text-luxe-muted hover:text-luxe-text'
                            }`}
                    >
                        {tb.label} <span className={`ml-1.5 text-xs ${tab === tb.key ? 'text-luxe-black/60' : 'text-luxe-muted/60'}`}>({tb.count})</span>
                    </button>
                ))}
            </div>

            {/* Add/Edit Admin Form */}
            {showForm && tab === 'admin' && (
                <form onSubmit={handleSubmit} className="card-admin flex items-end gap-3">
                    <div className="flex-1"><label className="block text-xs text-luxe-muted mb-1">{t('fullName')} *</label><input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="input-admin" required /></div>
                    <div className="flex-1"><label className="block text-xs text-luxe-muted mb-1">{t('email')} *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-admin" required /></div>
                    <div className="flex-1"><label className="block text-xs text-luxe-muted mb-1">{editId ? t('newPassword') : t('password') + ' *'}</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-admin" {...(!editId && { required: true })} minLength={6} placeholder={editId ? t('leaveBlankToKeep') : ''} /></div>
                    <button type="submit" className="btn-gold whitespace-nowrap">{editId ? t('update') : t('create')}</button>
                    <button type="button" onClick={resetForm} className="btn-outline whitespace-nowrap">{t('cancel')}</button>
                </form>
            )}

            {/* Users Table */}
            <div className="card-admin p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-admin">
                        <thead>
                            <tr>
                                <th>{t('name')}</th><th>{t('email')}</th>
                                {tab === 'customer' && <th>{t('phone')}</th>}
                                <th>{t('role')}</th><th>{t('joined')}</th>
                                {tab === 'admin' && <th>{t('actions')}</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan={tab === 'admin' ? 5 : 5} className="text-center py-10 text-luxe-muted">{t('loading')}</td></tr> :
                                list.length === 0 ? <tr><td colSpan={tab === 'admin' ? 5 : 5} className="text-center py-10 text-luxe-muted">{tab === 'admin' ? t('noAdminUsers') : t('noCustomerUsers')}</td></tr> :
                                    list.map(u => (
                                        <tr key={u._id}>
                                            <td className="font-medium text-luxe-text">{u.fullName}</td>
                                            <td className="text-luxe-muted">{u.email}</td>
                                            {tab === 'customer' && <td className="text-luxe-muted">{u.phone || '-'}</td>}
                                            <td><span className={`badge-status ${u.role === 'admin' ? 'bg-luxe-gold/10 text-luxe-gold' : 'bg-luxe-info/10 text-luxe-info'}`}>{u.role}</span></td>
                                            <td className="text-luxe-muted text-xs">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                                            {tab === 'admin' && (
                                                <td>
                                                    {u._id === me?._id ? (
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleEdit(u)} className="p-1.5 text-luxe-muted hover:text-luxe-gold transition-all" title={t('edit')}><HiOutlinePencil className="w-4 h-4" /></button>
                                                            <span className="text-xs px-3 py-1.5 rounded-lg border border-luxe-border text-luxe-muted/40 cursor-not-allowed">{t('you')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleEdit(u)} className="p-1.5 text-luxe-muted hover:text-luxe-gold transition-all" title={t('edit')}><HiOutlinePencil className="w-4 h-4" /></button>
                                                            <button onClick={() => toggleRole(u._id, u.role)} className="text-xs px-3 py-1.5 rounded-lg border border-luxe-border text-luxe-muted hover:text-luxe-warning hover:border-luxe-warning/30 transition-all">
                                                                {t('removeAdmin')}
                                                            </button>
                                                            <button onClick={() => handleDelete(u._id)} className="p-1.5 text-luxe-muted hover:text-luxe-error transition-all" title={t('delete')}><HiOutlineTrash className="w-4 h-4" /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
