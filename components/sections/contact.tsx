'use client'

import { Barlow_Condensed, Syne } from 'next/font/google'
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })
const syne = Syne({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

import { Mail, MapPin, Phone, Send, Loader2, CheckCircle, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/languageContext'

export function Contact() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
          is_read: false,
        }])

      if (error) throw error

      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err: any) {
      setError(t.contact.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">

      {/* Subtle background glow — mirrors academe partners */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full blur-3xl opacity-[0.05] dark:opacity-[0.09]"
          style={{ background: 'radial-gradient(ellipse, #2563eb 0%, transparent 70%)' }}
        />
      </div>

      <div className="container mx-auto px-6 relative">

        {/* ── Heading block — matches academe partners style ── */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
            <MessageSquare className="w-4 h-4" />
            {t.contact.badge ?? 'Contact Us'}
          </div>

          {/* Title */}
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white ${barlowCondensed.className}`}>
            {t.contact.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* ── Contact Form ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">

            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 dark:text-green-300 font-medium text-sm">{t.contact.success}</p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">{t.contact.successDesc}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">{t.contact.name}</Label>
                <Input
                  id="name"
                  placeholder={t.contact.namePlaceholder}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-11 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">{t.contact.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.contact.emailPlaceholder}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-11 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">{t.contact.message}</Label>
                <Textarea
                  id="message"
                  placeholder={t.contact.messagePlaceholder}
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg h-10 font-semibold text-sm shadow-md hover:shadow-lg transition-all ${syne.className}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.contact.sending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t.contact.send}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* ── Contact Info & Map ── */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-7 border border-gray-200 dark:border-slate-700 space-y-5">

              {/* Info heading */}
              <h3 className={`text-base font-bold text-gray-900 dark:text-slate-100 ${syne.className}`}>
                {t.contact.contactInfo}
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-0.5">{t.contact.address}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{t.contact.addressText}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-0.5">{t.contact.email}</h4>
                  <a href="mailto:info@erovoutika.ph" className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
                    info@erovoutika.ph
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-0.5">{t.contact.phone}</h4>
                  <a href="tel:+639061497307" className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
                    +63 906 149 7307
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.3087374157746!2d121.04721931484065!3d14.565006989825535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0cfb5%3A0x2b6e7c4e8c9a5e8!2sEpifanio%20de%20los%20Santos%20Ave%2C%20Makati%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}