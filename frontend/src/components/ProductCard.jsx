import { Link } from 'react-router-dom'
import { useLang, useLocalized } from '../i18n'

export function ProductCard({ product }) {
    const { t } = useLang()
    const loc = useLocalized()
    const img = product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
    const category = loc(product.categoryId?.name) || ''
    const title = loc(product.title)

    return (
        <Link to={`/product/${product.slug}`} className="group block h-full">
            <div className="card-luxe p-0 overflow-hidden hover:shadow-luxe transition-all duration-500 group-hover:border-luxe-gold/40 flex flex-col h-full">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-luxe-card">
                    <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                    />
                    {product.isFeatured && (
                        <span className="absolute top-3 right-3 bg-luxe-gold text-luxe-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {t('featured')}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                    <p className={`text-xs uppercase tracking-wider mb-1 ${category ? 'text-luxe-muted' : 'text-transparent select-none'}`}>{category || '—'}</p>
                    <h3 className="font-display text-lg text-luxe-text group-hover:text-luxe-gold transition-colors line-clamp-1">{title}</h3>
                </div>
            </div>
        </Link>
    )
}

export function ProductSkeleton() {
    return (
        <div className="card-luxe p-0 overflow-hidden">
            <div className="aspect-[4/3] skeleton" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-16 skeleton" />
                <div className="h-5 w-3/4 skeleton" />
            </div>
        </div>
    )
}
