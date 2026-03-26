import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../api'
import toast from 'react-hot-toast'
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineGlobe } from 'react-icons/hi'
import { useLang } from '../i18n'

export default function AdminLogin() {
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const { lang, setLang, t } = useLang()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const langNames = { en: 'English', az: 'Azərbaycan', ru: 'Русский' }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', { ...form, clientType: 'admin' })
            if (data.user.role !== 'admin') { toast.error(t('adminAccessRequired')); setLoading(false); return }
            localStorage.setItem('adminToken', data.accessToken)
            setUser(data.user)
            toast.success(t('welcome') + '!')
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data?.message || t('failed'))
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-luxe-black px-4 relative">
            {/* Language switcher */}
            <div className="absolute top-6 right-6">
                <div className="relative">
                    <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-luxe-muted hover:text-luxe-gold transition-all">
                        <HiOutlineGlobe className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase">{lang}</span>
                    </button>
                    {langOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                            <div className="absolute right-0 top-full mt-1 bg-luxe-surface border border-luxe-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
                                {Object.entries(langNames).map(([code, name]) => (
                                    <button key={code} onClick={() => { setLang(code); setLangOpen(false) }}
                                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-all ${lang === code ? 'bg-luxe-gold/10 text-luxe-gold' : 'text-luxe-muted hover:text-luxe-text hover:bg-luxe-card'}`}
                                    >
                                        <span className="text-xs font-bold uppercase w-5">{code}</span> {name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full max-w-sm">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <img src="/logo.png" alt="AnkaPrime Logo" className="h-10 object-contain" />
                        <h1 className="text-3xl font-display font-bold text-luxe-gold tracking-wider">ANKA PRIME</h1>
                    </div>
                    <p className="text-luxe-muted text-sm mt-1">{t('adminPanel')}</p>
                </div>
                <form onSubmit={handleSubmit} className="card-admin space-y-4">
                    <div>
                        <label className="block text-xs text-luxe-muted mb-1">{t('email')}</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-admin" placeholder="admin@luxe.com" required />
                    </div>
                    <div>
                        <label className="block text-xs text-luxe-muted mb-1">{t('password')}</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-admin pr-11" placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-luxe-muted hover:text-luxe-gold transition-colors">
                                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? t('signingIn') : t('signIn')}</button>
                </form>
            </div>
        </div>
    )
}
