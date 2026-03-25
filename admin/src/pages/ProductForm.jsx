import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'
import { HiOutlinePhotograph, HiOutlineX, HiOutlinePlus } from 'react-icons/hi'
import { useLang } from '../i18n'

const API_BASE = 'http://localhost:5000'
const LANGS = ['az', 'en', 'ru']
const LANG_LABELS = { az: 'AZ', en: 'EN', ru: 'RU' }

export default function ProductForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t, lang } = useLang()
    const fileRef = useRef()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState([])
    const [form, setForm] = useState({
        title_az: '', title_en: '', title_ru: '',
        desc_az: '', desc_en: '', desc_ru: '',
        categoryId: '', stock: '',
        material: '', color: '', size: '', brand: '', isFeatured: false, isActive: true
    })

    useEffect(() => {
        api.get('/admin/categories').then(r => setCategories(r.data.categories)).catch(() => { })
        if (id) {
            api.get(`/admin/products`).then(r => {
                const p = r.data.products.find(x => x._id === id)
                if (p) {
                    const title = typeof p.title === 'object' ? p.title : { az: '', en: p.title || '', ru: '' }
                    const desc = typeof p.description === 'object' ? p.description : { az: '', en: p.description || '', ru: '' }
                    setForm({
                        title_az: title.az || '', title_en: title.en || '', title_ru: title.ru || '',
                        desc_az: desc.az || '', desc_en: desc.en || '', desc_ru: desc.ru || '',
                        categoryId: p.categoryId?._id || '', stock: p.stock,
                        material: p.attributes?.material || '', color: p.attributes?.color || '',
                        size: p.attributes?.size || '', brand: p.attributes?.brand || '',
                        isFeatured: p.isFeatured, isActive: p.isActive
                    })
                    setImages(p.images || [])
                }
            })
        }
    }, [id])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return
        const remaining = 15 - images.length
        if (files.length > remaining) { toast.error(`You can add ${remaining} more image(s) (max 15)`); return }
        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach(f => formData.append('images', f))
            const { data } = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            setImages(prev => [...prev, ...data.urls])
            toast.success(`${data.urls.length} image(s) uploaded`)
        } catch (err) { toast.error(err.response?.data?.message || 'Upload failed') }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
    }

    const removeImage = (index) => { setImages(prev => prev.filter((_, i) => i !== index)) }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (images.length < 1) { toast.error(t('min1Image')); return }
        setLoading(true)
        try {
            const payload = {
                title: { az: form.title_az, en: form.title_en, ru: form.title_ru },
                description: { az: form.desc_az, en: form.desc_en, ru: form.desc_ru },
                categoryId: form.categoryId,
                stock: Number(form.stock) || 0,
                images,
                attributes: { material: form.material, color: form.color, size: form.size, brand: form.brand },
                isFeatured: form.isFeatured,
                isActive: form.isActive
            }
            if (id) await api.put(`/admin/products/${id}`, payload)
            else await api.post('/admin/products', payload)
            toast.success(id ? t('updated') : t('created'))
            navigate('/products')
        } catch (err) { toast.error(err.response?.data?.message || t('failed')) }
        finally { setLoading(false) }
    }

    const getImageSrc = (url) => {
        if (url.startsWith('http')) return url
        return `${API_BASE}${url}`
    }

    const getCatName = (c) => {
        if (typeof c.name === 'object') return c.name[lang] || c.name.en || ''
        return c.name || ''
    }

    return (
        <div>
            <h1 className="text-2xl font-display font-bold text-luxe-text mb-6">{id ? t('editProduct') : t('createProduct')}</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div className="card-admin space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs text-luxe-muted font-semibold">{t('title')} *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {LANGS.map(l => (
                                <div key={l}>
                                    <label className="block text-[10px] text-luxe-muted/70 mb-0.5">{LANG_LABELS[l]}</label>
                                    <input name={`title_${l}`} value={form[`title_${l}`]} onChange={handleChange} className="input-admin w-full" required={l === 'en'} placeholder={`${t('title')} (${LANG_LABELS[l]})`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Price, Stock, Category */}
                <div className="card-admin space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-xs text-luxe-muted mb-1">{t('stock')}</label><input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-admin w-full" /></div>
                    </div>
                    <div><label className="block text-xs text-luxe-muted mb-1">{t('category')} *</label>
                        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-admin w-full" required>
                            <option value="">{t('selectCategory')}</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{getCatName(c)}</option>)}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="card-admin space-y-2">
                    <label className="block text-xs text-luxe-muted font-semibold">{t('description')}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {LANGS.map(l => (
                            <div key={l}>
                                <label className="block text-[10px] text-luxe-muted/70 mb-0.5">{LANG_LABELS[l]}</label>
                                <textarea name={`desc_${l}`} value={form[`desc_${l}`]} onChange={handleChange} className="input-admin w-full" rows={3} placeholder={`${t('description')} (${LANG_LABELS[l]})`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className="card-admin space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-luxe-text">{t('images')} <span className="text-luxe-muted font-normal">({images.length}/15, min 1)</span></h3>
                        {images.length < 15 && (
                            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline flex items-center gap-1.5 !px-3 !py-1.5 text-xs">
                                {uploading ? t('uploading') : <><HiOutlinePlus className="w-3.5 h-3.5" /> {t('addImages')}</>}
                            </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleUpload} className="hidden" />
                    </div>
                    {images.length === 0 ? (
                        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                            className="w-full border-2 border-dashed border-luxe-border rounded-xl py-10 flex flex-col items-center gap-2 text-luxe-muted hover:border-luxe-gold/40 hover:text-luxe-gold transition-all">
                            <HiOutlinePhotograph className="w-10 h-10" />
                            <span className="text-sm">{uploading ? t('uploading') : t('clickToUpload')}</span>
                            <span className="text-xs text-luxe-muted/60">{t('imageFormats')}</span>
                        </button>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                            {images.map((url, i) => (
                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-luxe-card border border-luxe-border">
                                    <img src={getImageSrc(url)} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-luxe-black/80 rounded-full flex items-center justify-center text-luxe-muted hover:text-luxe-error opacity-0 group-hover:opacity-100 transition-all"><HiOutlineX className="w-3.5 h-3.5" /></button>
                                    {i === 0 && <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-luxe-gold text-luxe-black px-1.5 py-0.5 rounded font-semibold">MAIN</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Attributes */}
                <div className="card-admin space-y-4">
                    <h3 className="text-sm font-semibold text-luxe-text">{t('attributes')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div><label className="block text-xs text-luxe-muted mb-1">{t('material')}</label><input name="material" value={form.material} onChange={handleChange} className="input-admin w-full" /></div>
                        <div><label className="block text-xs text-luxe-muted mb-1">{t('color')}</label><input name="color" value={form.color} onChange={handleChange} className="input-admin w-full" /></div>
                        <div><label className="block text-xs text-luxe-muted mb-1">{t('size')}</label><input name="size" value={form.size} onChange={handleChange} className="input-admin w-full" /></div>
                        <div><label className="block text-xs text-luxe-muted mb-1">{t('brand')}</label><input name="brand" value={form.brand} onChange={handleChange} className="input-admin w-full" /></div>
                    </div>
                </div>

                {/* Toggles */}
                <div className="card-admin flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-luxe-muted cursor-pointer"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-[#d6b068]" /> {t('featured')}</label>
                    <label className="flex items-center gap-2 text-sm text-luxe-muted cursor-pointer"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-[#d6b068]" /> {t('active')}</label>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="btn-gold flex-1">{loading ? t('saving') : (id ? t('updateProduct') : t('createProduct'))}</button>
                    <button type="button" onClick={() => navigate('/products')} className="btn-outline flex-1">{t('cancel')}</button>
                </div>
            </form>
        </div>
    )
}
