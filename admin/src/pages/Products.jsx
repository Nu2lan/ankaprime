import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi'
import { useLang } from '../i18n'

export default function Products() {
    const { t, lang } = useLang()
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({ page: 1, pages: 1 })
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const load = (page = 1) => {
        setLoading(true)
        api.get('/admin/products', { params: { page, search, limit: 15 } })
            .then(r => { setProducts(r.data.products); setPagination(r.data.pagination) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [search])

    const handleDelete = async (id) => {
        if (!confirm(t('deleteProduct'))) return
        try {
            await api.delete(`/admin/products/${id}`)
            toast.success(t('deleted'))
            load(pagination.page)
        } catch { toast.error(t('failed')) }
    }

    const getTitle = (p) => {
        if (typeof p.title === 'object') return p.title[lang] || p.title.en || ''
        return p.title || ''
    }

    const getCatName = (p) => {
        const name = p.categoryId?.name
        if (typeof name === 'object') return name[lang] || name.en || ''
        return name || '-'
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-luxe-text">{t('products')}</h1>
                <Link to="/products/new" className="btn-gold flex items-center gap-1.5"><HiOutlinePlus className="w-4 h-4" /> {t('addProduct')}</Link>
            </div>

            <div className="relative max-w-sm">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-muted w-4 h-4" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchProducts')} className="input-admin pl-10" />
            </div>

            <div className="card-admin p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-admin">
                        <thead><tr><th>{t('image')}</th><th>{t('title')}</th><th>{t('category')}</th><th>{t('price')}</th><th>{t('stock')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-10 text-luxe-muted">{t('loading')}</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-luxe-muted">{t('noProductsFound')}</td></tr>
                            ) : products.map(p => (
                                <tr key={p._id}>
                                    <td><img src={p.images?.[0] || ''} alt="" className="w-10 h-10 rounded object-cover bg-luxe-card" /></td>
                                    <td className="font-medium text-luxe-text max-w-[200px] truncate">{getTitle(p)}</td>
                                    <td className="text-luxe-muted">{getCatName(p)}</td>
                                    <td className="text-luxe-gold font-medium">{p.price.toLocaleString()} AZN</td>
                                    <td><span className={p.stock <= 5 ? 'text-luxe-warning font-medium' : 'text-luxe-muted'}>{p.stock}</span></td>
                                    <td><span className={`badge-status ${p.isActive ? 'bg-luxe-success/10 text-luxe-success' : 'bg-luxe-error/10 text-luxe-error'}`}>{p.isActive ? t('active') : t('inactive')}</span></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Link to={`/products/edit/${p._id}`} className="p-1.5 rounded-lg text-luxe-muted hover:text-luxe-gold hover:bg-luxe-card transition-all"><HiOutlinePencil className="w-4 h-4" /></Link>
                                            <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-luxe-muted hover:text-luxe-error hover:bg-luxe-error/5 transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => load(p)} className={`w-9 h-9 rounded-lg text-sm ${p === pagination.page ? 'bg-luxe-gold text-luxe-black' : 'bg-luxe-card text-luxe-muted hover:text-luxe-gold border border-luxe-border'}`}>{p}</button>
                    ))}
                </div>
            )}
        </div>
    )
}
