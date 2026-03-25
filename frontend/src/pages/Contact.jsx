import { useState } from 'react'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useLang } from '../i18n'

export default function Contact() {
    const { t } = useLang()
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sending, setSending] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSending(true)
        setTimeout(() => {
            setSending(false)
            toast.success(t('messageSent'))
            setForm({ name: '', email: '', subject: '', message: '' })
        }, 1500)
    }

    const info = [
        { icon: HiOutlineMail, label: t('emailUs'), value: 'info@luxefurniture.az', href: 'mailto:info@luxefurniture.az' },
        { icon: HiOutlinePhone, label: t('callUs'), value: '+994 12 345 67 89', href: 'tel:+994123456789' },
        { icon: HiOutlineLocationMarker, label: t('visitUs'), value: t('storeAddress'), href: 'https://maps.google.com/?q=28+May+Street,+Baku,+Azerbaijan' },
        { icon: HiOutlineClock, label: t('workingHours'), value: t('workingHoursValue') },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-luxe-text">{t('contactUs')}</h1>
                <p className="text-luxe-muted mt-3 max-w-xl mx-auto">{t('contactDesc')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-display font-semibold text-luxe-text">{t('getInTouch')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {info.map((item, i) => {
                            const Wrapper = item.href ? 'a' : 'div'
                            const wrapperProps = item.href ? { href: item.href, target: item.href.startsWith('http') ? '_blank' : undefined, rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined } : {}
                            return (
                                <Wrapper key={i} {...wrapperProps} className="card-luxe flex items-start gap-4 cursor-pointer hover:border-luxe-gold/50 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-luxe-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-luxe-text">{item.label}</p>
                                        <p className="text-sm text-luxe-gold mt-0.5">{item.value}</p>
                                    </div>
                                </Wrapper>
                            )
                        })}
                    </div>

                    {/* Map placeholder */}
                    <div className="rounded-xl overflow-hidden border border-luxe-border h-64">
                        <iframe
                            title="LUXE Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4!2d49.87!3d40.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI0JzM2LjAiTiA0OcKwNTInMTIuMCJF!5e0!3m2!1sen!2saz!4v1"
                            className="w-full h-full border-0"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Contact Form */}
                <div className="card-luxe">
                    <h2 className="text-2xl font-display font-semibold text-luxe-text mb-6">{t('sendMessage')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-luxe-muted mb-1.5">{t('fullName')}</label>
                                <input
                                    type="text" required value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-luxe w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-luxe-muted mb-1.5">{t('email')}</label>
                                <input
                                    type="email" required value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input-luxe w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-luxe-muted mb-1.5">{t('subject')}</label>
                            <input
                                type="text" required value={form.subject}
                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                className="input-luxe w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-luxe-muted mb-1.5">{t('message')}</label>
                            <textarea
                                rows={5} required value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                className="input-luxe w-full resize-none"
                            />
                        </div>
                        <button type="submit" disabled={sending} className="btn-gold w-full">
                            {sending ? t('sending') : t('sendMessage')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
