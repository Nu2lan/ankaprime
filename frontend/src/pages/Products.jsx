import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../features/productsSlice'
import { ProductCard, ProductSkeleton } from '../components/ProductCard'
import api from '../api/axios'
import { HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi'
import { useLang, useLocalized } from '../i18n'

export default function Products() {
    const dispatch = useDispatch()
    const { items, pagination, loading } = useSelector(s => s.products)
    const [searchParams, setSearchParams] = useSearchParams()
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [showFilters, setShowFilters] = useState(false)
    const { t } = useLang()
    const loc = useLocalized()

    const currentCategory = searchParams.get('category') || ''
    const currentSort = searchParams.get('sort') || 'createdAt'
    const currentOrder = searchParams.get('order') || 'desc'
    const currentPage = Number(searchParams.get('page') || 1)

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => { })
    }, [])

    useEffect(() => {
        const params = {}
        if (search) params.search = search
        if (currentCategory) params.category = currentCategory
        if (currentSort) params.sort = currentSort
        if (currentOrder) params.order = currentOrder
        if (currentPage) params.page = currentPage
        dispatch(fetchProducts(params))
    }, [dispatch, search, currentCategory, currentSort, currentOrder, currentPage])

    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(key, value)
        else params.delete(key)
        if (key !== 'page') params.delete('page')
        setSearchParams(params)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        updateParam('search', search)
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-luxe-text mb-2">{t('ourCollection')}</h1>
                <p className="text-luxe-muted">
                    {pagination.total} {pagination.total === 1 ? t('piece') : t('pieces')} {t('ofLuxury')}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar filters */}
                <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="card-luxe space-y-6 sticky top-20">
                        <h3 className="font-semibold text-luxe-text flex items-center gap-2">
                            <HiOutlineAdjustments className="w-5 h-5 text-luxe-gold" /> {t('filters')}
                        </h3>

                        {/* Categories */}
                        <div>
                            <p className="text-xs text-luxe-muted uppercase tracking-wider mb-3">{t('category')}</p>
                            <div className="space-y-1">
                                <button
                                    onClick={() => updateParam('category', '')}
                                    className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!currentCategory ? 'bg-luxe-gold/10 text-luxe-gold' : 'text-luxe-muted hover:text-luxe-text'}`}
                                >{t('allCategories')}</button>
                                {categories.map(c => (
                                    <button
                                        key={c._id}
                                        onClick={() => updateParam('category', c.slug)}
                                        className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${currentCategory === c.slug ? 'bg-luxe-gold/10 text-luxe-gold' : 'text-luxe-muted hover:text-luxe-text'}`}
                                    >{loc(c.name)}</button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <p className="text-xs text-luxe-muted uppercase tracking-wider mb-3">{t('sortBy')}</p>
                            <select
                                value={`${currentSort}-${currentOrder}`}
                                onChange={e => {
                                    const [sort, order] = e.target.value.split('-')
                                    const params = new URLSearchParams(searchParams)
                                    params.set('sort', sort); params.set('order', order); params.delete('page')
                                    setSearchParams(params)
                                }}
                                className="input-luxe text-sm py-2"
                            >
                                <option value="createdAt-desc">{t('newestFirst')}</option>
                                <option value="createdAt-asc">{t('oldestFirst')}</option>
                                <option value="title-asc">{t('nameAZ')}</option>
                                <option value="title-desc">{t('nameZA')}</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1">
                    {/* Search & mobile filter toggle */}
                    <div className="flex gap-3 mb-6">
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-luxe-muted w-5 h-5" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchProducts')} className="input-luxe pl-12" />
                        </form>
                        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-outline py-3 px-4">
                            <HiOutlineAdjustments className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-luxe-muted text-lg">{t('noProducts')}</p>
                            <p className="text-luxe-muted/50 text-sm mt-1">{t('tryFilters')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {items.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => updateParam('page', page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === pagination.page
                                        ? 'bg-luxe-gold text-luxe-black'
                                        : 'bg-luxe-surface text-luxe-muted hover:text-luxe-gold border border-luxe-border'
                                        }`}
                                >{page}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
