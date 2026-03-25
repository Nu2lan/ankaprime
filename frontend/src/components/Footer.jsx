import { Link } from 'react-router-dom'
import { useLang } from '../i18n'

export default function Footer() {
    const { t } = useLang()

    return (
        <footer className="bg-luxe-surface border-t border-luxe-border mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <span className="text-2xl font-display font-bold text-luxe-gold tracking-wider">LUXE</span>
                        <p className="text-luxe-muted text-sm mt-3 leading-relaxed">{t('footerDesc')}</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-luxe-text tracking-wider uppercase mb-4">{t('footerShop')}</h4>
                        <div className="space-y-2">
                            <Link to="/products" className="block text-sm text-luxe-muted hover:text-luxe-gold transition-colors">{t('allProducts')}</Link>
                            <Link to="/products?category=living-room" className="block text-sm text-luxe-muted hover:text-luxe-gold transition-colors">{t('livingRoom')}</Link>
                            <Link to="/products?category=bedroom" className="block text-sm text-luxe-muted hover:text-luxe-gold transition-colors">{t('bedroom')}</Link>
                            <Link to="/products?category=dining" className="block text-sm text-luxe-muted hover:text-luxe-gold transition-colors">{t('dining')}</Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-luxe-text tracking-wider uppercase mb-4">{t('support')}</h4>
                        <div className="space-y-2">
                            <Link to="/contact" className="block text-sm text-luxe-muted hover:text-luxe-gold transition-colors">{t('contactUs')}</Link>
                            <p className="text-sm text-luxe-muted">{t('shippingReturns')}</p>
                            <p className="text-sm text-luxe-muted">{t('faq')}</p>
                            <p className="text-sm text-luxe-muted">{t('careGuide')}</p>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-semibold text-luxe-text tracking-wider uppercase mb-4">{t('stayUpdated')}</h4>
                        <p className="text-sm text-luxe-muted mb-3">{t('newsletterDesc')}</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="your@email.com" className="input-luxe text-sm py-2 flex-1" />
                            <button className="btn-gold text-sm py-2 px-4">{t('join')}</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-luxe-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-luxe-muted">{t('copyright').replace('{year}', new Date().getFullYear())}</p>
                    <div className="flex gap-6">
                        <span className="text-xs text-luxe-muted hover:text-luxe-gold cursor-pointer transition-colors">{t('privacy')}</span>
                        <span className="text-xs text-luxe-muted hover:text-luxe-gold cursor-pointer transition-colors">{t('terms')}</span>
                        <span className="text-xs text-luxe-muted hover:text-luxe-gold cursor-pointer transition-colors">{t('cookies')}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
