import { useEffect, useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useLang } from '../i18n'

const LANGS = ['az', 'en', 'ru']
const LANG_LABELS = { az: 'AZ', en: 'EN', ru: 'RU' }

export default function Categories() {
    const { t, lang } = useLang()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ name_az: '', name_en: '', name_ru: '', desc_az: '', desc_en: '', desc_ru: '' })

    const load = () => {
        api.get('/admin/categories').then(r => { setCategories(r.data.categories); setLoading(false) }).catch(() => setLoading(false))
    }
    useEffect(load, [])

    const resetForm = () => setForm({ name_az: '', name_en: '', name_ru: '', desc_az: '', desc_en: '', desc_ru: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                name: { az: form.name_az, en: form.name_en, ru: form.name_ru },
                description: { az: form.desc_az, en: form.desc_en, ru: form.desc_ru }
            }
            if (editId) await api.put(`/admin/categories/${editId}`, payload)
            else await api.post('/admin/categories', payload)
            toast.success(editId ? t('updated') : t('created'))
            resetForm(); setEditId(null); setShowForm(false); load()
        } catch (err) { toast.error(err.response?.data?.message || t('failed')) }
    }

    const handleEdit = (cat) => {
        const name = typeof cat.name === 'object' ? cat.name : { az: '', en: cat.name || '', ru: '' }
        const desc = typeof cat.description === 'object' ? cat.description : { az: '', en: cat.description || '', ru: '' }
        setForm({
            name_az: name.az || '', name_en: name.en || '', name_ru: name.ru || '',
            desc_az: desc.az || '', desc_en: desc.en || '', desc_ru: desc.ru || ''
        })
        setEditId(cat._id); setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm(t('delete') + '?')) return
        try { await api.delete(`/admin/categories/${id}`); toast.success(t('deleted')); load() }
        catch { toast.error(t('failed')) }
    }

    const getCatName = (c) => {
        if (typeof c.name === 'object') return c.name[lang] || c.name.en || ''
        return c.name || ''
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-luxe-text">{t('categories')}</h1>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm() }} className="btn-gold flex items-center gap-1.5"><HiOutlinePlus className="w-4 h-4" /> {t('addCategory')}</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card-admin space-y-4">
                    <div>
                        <label className="block text-xs text-luxe-muted font-semibold mb-2">{t('name')} *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {LANGS.map(l => (
                                <div key={l}>
                                    <label className="block text-[10px] text-luxe-muted/70 mb-0.5">{LANG_LABELS[l]}</label>
                                    <input value={form[`name_${l}`]} onChange={e => setForm({ ...form, [`name_${l}`]: e.target.value })} className="input-admin" required={l === 'en'} placeholder={`${t('name')} (${LANG_LABELS[l]})`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-luxe-muted font-semibold mb-2">{t('descriptionLabel')}</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {LANGS.map(l => (
                                <div key={l}>
                                    <label className="block text-[10px] text-luxe-muted/70 mb-0.5">{LANG_LABELS[l]}</label>
                                    <input value={form[`desc_${l}`]} onChange={e => setForm({ ...form, [`desc_${l}`]: e.target.value })} className="input-admin" placeholder={`${t('descriptionLabel')} (${LANG_LABELS[l]})`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="btn-gold flex-1">{editId ? t('update') : t('create')}</button>
                        <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="btn-outline flex-1">{t('cancel')}</button>
                    </div>
                </form>
            )}

            <div className="card-admin p-0 overflow-hidden">
                <table className="table-admin">
                    <thead><tr><th>{t('name')}</th><th>{t('slug')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={4} className="text-center py-8 text-luxe-muted">{t('loading')}</td></tr> :
                            categories.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-luxe-muted">{t('noCategories')}</td></tr> :
                                categories.map(c => (
                                    <tr key={c._id}>
                                        <td className="font-medium text-luxe-text">{getCatName(c)}</td>
                                        <td className="text-luxe-muted font-mono text-xs">{c.slug}</td>
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
