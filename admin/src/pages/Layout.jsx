import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { useState } from 'react'
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineFolder, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineTag, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineGlobe } from 'react-icons/hi'
import { useLang } from '../i18n'

const langFlags = { en: '🇬🇧', az: '🇦🇿', ru: '🇷🇺' }
const langNames = { en: 'English', az: 'Azərbaycan', ru: 'Русский' }

const linkDefs = [
    { to: '/', icon: HiOutlineViewGrid, key: 'dashboard', end: true },
    { to: '/products', icon: HiOutlineCube, key: 'products' },
    { to: '/categories', icon: HiOutlineFolder, key: 'categories' },
    { to: '/orders', icon: HiOutlineShoppingCart, key: 'orders' },
    { to: '/users', icon: HiOutlineUsers, key: 'users' },
    { to: '/coupons', icon: HiOutlineTag, key: 'coupons' },
]

export default function Layout() {
    const { user, setUser } = useAuth()
    const { lang, setLang, t } = useLang()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [langOpen, setLangOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        setUser(null)
        navigate('/login')
    }

    const sidebarWidth = collapsed ? 'w-[68px]' : 'w-60'
    const mainMargin = collapsed ? 'lg:ml-[68px]' : 'lg:ml-60'

    return (
        <div className="min-h-screen flex">
            {/* Desktop sidebar */}
            <aside className={`hidden lg:flex ${sidebarWidth} flex-col bg-luxe-surface border-r border-luxe-border fixed inset-y-0 left-0 z-30 transition-all duration-300`}>
                {/* Header */}
                <div className="h-14 px-4 flex items-center justify-between border-b border-luxe-border">
                    {!collapsed && (
                        <div className="overflow-hidden flex flex-col">
                            <img src="/logo.png" alt="AnkaPrime Logo" className="h-6 object-contain self-start" />
                            <p className="text-[10px] text-luxe-muted tracking-[0.15em] uppercase mt-0.5">{t('adminPanel')}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-luxe-muted hover:text-luxe-gold transition-colors p-1 rounded-lg hover:bg-luxe-card"
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <HiOutlineChevronRight className="w-5 h-5" /> : <HiOutlineChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-2 space-y-1 overflow-hidden">
                    {linkDefs.map(l => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            title={collapsed ? t(l.key) : undefined}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all overflow-hidden whitespace-nowrap ${isActive ? 'bg-luxe-gold/10 text-luxe-gold' : 'text-luxe-muted hover:text-luxe-text hover:bg-luxe-card'}`}
                        >
                            <l.icon className="w-5 h-5 flex-shrink-0" />
                            <span className={`truncate transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{t(l.key)}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-2 border-t border-luxe-border">
                    {!collapsed && <div className="px-3 py-2 mb-1"><div className="text-sm text-luxe-text font-medium truncate">{user?.fullName}</div><div className="text-xs text-luxe-muted truncate">{user?.email}</div></div>}
                    <button
                        onClick={handleLogout}
                        title={collapsed ? t('signOut') : undefined}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-luxe-muted hover:text-luxe-error hover:bg-luxe-error/5 transition-all overflow-hidden whitespace-nowrap"
                    >
                        <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
                        <span className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{t('signOut')}</span>
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 inset-y-0 w-60 bg-luxe-surface border-r border-luxe-border flex flex-col">
                        <div className="h-14 px-5 flex items-center justify-between border-b border-luxe-border">
                            <div className="flex flex-col">
                                <img src="/logo.png" alt="AnkaPrime Logo" className="h-6 object-contain self-start" />
                                <p className="text-[10px] text-luxe-muted tracking-[0.15em] uppercase mt-0.5">{t('adminPanel')}</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-luxe-muted hover:text-luxe-gold">
                                <HiOutlineX className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 p-3 space-y-1">
                            {linkDefs.map(l => (
                                <NavLink
                                    key={l.to}
                                    to={l.to}
                                    end={l.end}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-luxe-gold/10 text-luxe-gold' : 'text-luxe-muted hover:text-luxe-text hover:bg-luxe-card'}`}
                                >
                                    <l.icon className="w-5 h-5" />
                                    {t(l.key)}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="p-3 border-t border-luxe-border">
                            <div className="px-3 py-2 mb-2"><div className="text-sm text-luxe-text font-medium truncate">{user?.fullName}</div><div className="text-xs text-luxe-muted truncate">{user?.email}</div></div>
                            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-luxe-muted hover:text-luxe-error hover:bg-luxe-error/5 transition-all">
                                <HiOutlineLogout className="w-5 h-5" /> {t('signOut')}
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className={`flex-1 ${mainMargin} transition-all duration-300`}>
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-luxe-black/90 backdrop-blur border-b border-luxe-border">
                    <div className="flex items-center justify-between px-6 h-14">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-luxe-muted hover:text-luxe-gold">
                            <HiOutlineMenu className="w-6 h-6" />
                        </button>
                        <div />
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
                            <p className="text-sm text-luxe-muted">{t('welcome')}, <span className="text-luxe-gold">{user?.fullName?.split(' ')[0]}</span></p>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
