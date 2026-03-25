import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { HiOutlineMenu, HiOutlineX, HiOutlineGlobe } from 'react-icons/hi'
import { useLang } from '../i18n'

const langNames = { en: 'English', az: 'Azərbaycan', ru: 'Русский' }

export default function Navbar() {
    const location = useLocation()
    const { lang, setLang, t } = useLang()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-luxe-black/90 backdrop-blur-md border-b border-luxe-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Anka Prime" className="h-10" />
                        <span className="text-xl font-display font-bold tracking-wider"><span className="text-luxe-gold">ANKA</span> <span className="text-luxe-text">PRIME</span></span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {[{ to: '/', label: t('home') }, { to: '/products', label: t('shop') }, { to: '/contact', label: t('contactUs') }].map(link => {
                            const active = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
                            return (
                                <Link key={link.to} to={link.to}
                                    className={`text-sm tracking-wide transition-colors py-1 border-b-2 ${active ? 'text-luxe-gold border-luxe-gold' : 'text-luxe-text hover:text-luxe-gold border-transparent'
                                        }`}
                                >{link.label}</Link>
                            )
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Language switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-luxe-muted hover:text-luxe-gold transition-all"
                            >
                                <HiOutlineGlobe className="w-5 h-5" />
                                <span className="text-sm font-medium uppercase">{lang}</span>
                            </button>
                            {langOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                                    <div className="absolute right-0 top-full mt-1 bg-luxe-surface border border-luxe-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
                                        {Object.entries(langNames).map(([code, name]) => (
                                            <button
                                                key={code}
                                                onClick={() => { setLang(code); setLangOpen(false) }}
                                                className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-all ${lang === code ? 'bg-luxe-gold/10 text-luxe-gold' : 'text-luxe-muted hover:text-luxe-text hover:bg-luxe-card'}`}
                                            >
                                                <span className="text-xs font-bold uppercase w-5">{code}</span> {name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-luxe-text">
                            {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-luxe-border py-4 space-y-2 animate-fade-up">
                        <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-luxe-text hover:text-luxe-gold">{t('home')}</Link>
                        <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-luxe-text hover:text-luxe-gold">{t('shop')}</Link>
                        <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-2 text-luxe-text hover:text-luxe-gold">{t('contactUs')}</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
