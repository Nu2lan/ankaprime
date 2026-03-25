import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatured } from '../features/productsSlice'
import { ProductCard, ProductSkeleton } from '../components/ProductCard'
import api from '../api/axios'
import { HiArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi'
import { useLang, useLocalized } from '../i18n'

export default function Home() {
    const dispatch = useDispatch()
    const { featured } = useSelector(s => s.products)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const { t } = useLang()
    const loc = useLocalized()

    useEffect(() => {
        dispatch(fetchFeatured())
        api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => { })
        setTimeout(() => setLoading(false), 500)
    }, [dispatch])

    return (
        <div>
            {/* Hero */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-luxe-black via-luxe-black/75 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920')] bg-cover bg-center opacity-50" />
                <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-xl animate-fade-up">
                        <span className="badge-gold mb-6 inline-block">{t('newCollection')}</span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-luxe-text leading-tight mb-6">
                            {t('heroTitle1')} <span className="text-luxe-gold">{t('heroTitle2')}</span> {t('heroTitle3')}
                        </h1>
                        <p className="text-lg text-luxe-muted mb-8 leading-relaxed">{t('heroDesc')}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="btn-gold flex items-center gap-2 text-lg px-8 py-4">
                                {t('exploreCollection')} <HiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust badges */}
            <section className="border-y border-luxe-border bg-luxe-surface/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: HiOutlineTruck, label: t('freeShipping'), desc: t('ordersOver500') },
                            { icon: HiOutlineShieldCheck, label: t('warranty'), desc: t('qualityGuaranteed') },
                            { icon: HiOutlineRefresh, label: t('returns'), desc: t('hassleFree') },
                            { icon: HiOutlineSparkles, label: t('premiumQuality'), desc: t('handcrafted') },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <item.icon className="w-8 h-8 text-luxe-gold flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-luxe-text">{item.label}</p>
                                    <p className="text-xs text-luxe-muted">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="page-container">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-luxe-text mb-3">{t('shopByCategory')}</h2>
                        <p className="text-luxe-muted">{t('exploreCurated')}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map(cat => (
                            <Link
                                key={cat._id}
                                to={`/products?category=${cat.slug}`}
                                className="card-luxe text-center py-8 group hover:gold-glow"
                            >
                                <h3 className="font-display text-lg text-luxe-text group-hover:text-luxe-gold transition-colors">{loc(cat.name)}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="page-container">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-luxe-text mb-2">{t('featuredPieces')}</h2>
                        <p className="text-luxe-muted">{t('handpicked')}</p>
                    </div>
                    <Link to="/products" className="btn-ghost flex items-center gap-1 text-sm">
                        {t('viewAll')} <HiArrowRight />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                        : featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)
                    }
                </div>
            </section>

            {/* CTA */}
            <section className="page-container">
                <div className="card-luxe gold-glow text-center py-16 px-8">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-luxe-text mb-4">{t('designDreamSpace')}</h2>
                    <p className="text-luxe-muted max-w-lg mx-auto mb-8">{t('ctaDesc')}</p>
                    <Link to="/products" className="btn-gold text-lg px-10 py-4 inline-block">{t('startShopping')}</Link>
                </div>
            </section>
        </div>
    )
}
