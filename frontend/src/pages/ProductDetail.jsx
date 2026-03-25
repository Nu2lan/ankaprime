import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { HiOutlineTruck, HiOutlineShieldCheck } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useLang, useLocalized } from '../i18n'

const WHATSAPP_NUMBER = '994XXXXXXXXX'

export default function ProductDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const { t } = useLang()
    const loc = useLocalized()

    useEffect(() => {
        setLoading(true)
        api.get(`/products/${slug}`)
            .then(r => { setProduct(r.data.product); setLoading(false) })
            .catch(() => { setLoading(false); navigate('/products') })
    }, [slug, navigate])

    const handleWhatsApp = () => {
        const productUrl = window.location.href
        const message = `${t('whatsappMessage')}\n\n${productUrl}`
        const encoded = encodeURIComponent(message)
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square skeleton rounded-xl" />
                    <div className="space-y-4">
                        <div className="h-4 w-24 skeleton" />
                        <div className="h-10 w-3/4 skeleton" />
                        <div className="h-32 skeleton" />
                    </div>
                </div>
            </div>
        )
    }

    if (!product) return null

    const images = product.images?.length ? product.images : ['https://via.placeholder.com/800x600?text=No+Image']
    const title = loc(product.title)
    const description = loc(product.description)
    const categoryName = loc(product.categoryId?.name)

    return (
        <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden bg-luxe-card border border-luxe-border">
                        <img src={images[selectedImage]} alt={title} className="w-full h-full object-cover" />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-3">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-luxe-gold' : 'border-luxe-border hover:border-luxe-gold/50'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-6">
                    {categoryName && (
                        <span className="badge-gold">{categoryName}</span>
                    )}

                    <h1 className="text-3xl md:text-4xl font-display font-bold text-luxe-text">{title}</h1>

                    <p className="text-luxe-muted leading-relaxed">{description}</p>

                    {/* Attributes */}
                    {product.attributes && (
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(product.attributes).filter(([, v]) => v).map(([key, val]) => (
                                <div key={key} className="bg-luxe-surface border border-luxe-border rounded-lg px-4 py-3">
                                    <p className="text-xs text-luxe-muted uppercase tracking-wider">{key}</p>
                                    <p className="text-sm text-luxe-text font-medium mt-0.5">{val}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* WhatsApp Contact Button */}
                    <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                    >
                        <FaWhatsapp className="w-6 h-6" />
                        {t('contactForBuying')}
                    </button>

                    {/* Trust */}
                    <div className="border-t border-luxe-border pt-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-luxe-muted">
                            <HiOutlineTruck className="w-5 h-5 text-luxe-gold" /> {t('freeShippingOver')}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-luxe-muted">
                            <HiOutlineShieldCheck className="w-5 h-5 text-luxe-gold" /> {t('warrantyIncluded')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
