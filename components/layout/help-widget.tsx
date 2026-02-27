'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Mail, Phone, MessageCircle, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/languageContext'

// ── Inline SVG chatbot icon ───────────────────────────────────────────────────
function RobotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Speech bubble body */}
      <rect x="4" y="5" width="40" height="30" rx="10" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" />
      {/* Bubble tail */}
      <path d="M12 35 L8 44 L22 35" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Left eye */}
      <rect x="12" y="15" width="9" height="9" rx="3.5" fill="currentColor" />
      <rect x="14" y="16.5" width="3" height="3" rx="1.2" fill="white" fillOpacity="0.65" />
      {/* Right eye */}
      <rect x="27" y="15" width="9" height="9" rx="3.5" fill="currentColor" />
      <rect x="29" y="16.5" width="3" height="3" rx="1.2" fill="white" fillOpacity="0.65" />
      {/* Smile dots */}
      <circle cx="17" cy="30" r="1.8" fill="currentColor" fillOpacity="0.65" />
      <circle cx="24" cy="31.8" r="1.8" fill="currentColor" fillOpacity="0.65" />
      <circle cx="31" cy="30" r="1.8" fill="currentColor" fillOpacity="0.65" />
    </svg>
  )
}

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  label: string
  emoji: string
  items: FaqItem[]
}

export function HelpWidget() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const categories: FaqCategory[] = [
    {
      label: t.helpWidget.catAutomation,
      emoji: '🤖',
      items: [
        { q: t.helpWidget.q1, a: t.helpWidget.a1 },
        { q: t.helpWidget.q2, a: t.helpWidget.a2 },
        { q: t.helpWidget.q3, a: t.helpWidget.a3 },
      ],
    },
    {
      label: t.helpWidget.catTraining,
      emoji: '🎓',
      items: [
        { q: t.helpWidget.q4, a: t.helpWidget.a4 },
        { q: t.helpWidget.q5, a: t.helpWidget.a5 },
        { q: t.helpWidget.q6, a: t.helpWidget.a6 },
      ],
    },
    {
      label: t.helpWidget.catSupport,
      emoji: '🛠️',
      items: [
        { q: t.helpWidget.q7, a: t.helpWidget.a7 },
        { q: t.helpWidget.q8, a: t.helpWidget.a8 },
        { q: t.helpWidget.q9, a: t.helpWidget.a9 },
      ],
    },
    {
      label: t.helpWidget.catPricing,
      emoji: '🤝',
      items: [
        { q: t.helpWidget.q10, a: t.helpWidget.a10 },
        { q: t.helpWidget.q11, a: t.helpWidget.a11 },
      ],
    },
  ]

  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, catLabel: cat.label, catEmoji: cat.emoji }))
  )

  const searchResults = query.trim()
    ? allItems.filter(
        (f) =>
          f.q.toLowerCase().includes(query.toLowerCase()) ||
          f.a.toLowerCase().includes(query.toLowerCase())
      )
    : null

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
    else {
      setQuery('')
      setActiveKey(null)
    }
  }, [open])

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-3 w-[min(25rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Header */}
            <div
              className="relative overflow-hidden px-4 py-4"
              style={{ background: 'linear-gradient(135deg, #0f2b6b 0%, #1a56db 60%, #0ea5e9 100%)' }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
                <svg className="h-full w-full">
                  <defs>
                    <pattern id="hwgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hwgrid)" />
                </svg>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30">
                    <RobotIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.helpWidget.title}</p>
                    <p className="text-xs text-blue-200">{t.helpWidget.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-200" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveKey(null) }}
                  placeholder={t.helpWidget.searchPlaceholder}
                  className="w-full rounded-lg bg-white/15 py-2 pl-8 pr-3 text-xs text-white placeholder-blue-200 outline-none ring-1 ring-white/20 transition focus:ring-white/50"
                />
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[380px] overflow-y-auto overscroll-contain">
              {!query && (
                <div className="border-b border-gray-100 px-4 py-2.5 text-xs text-gray-500 dark:border-slate-800 dark:text-slate-400">
                  {t.helpWidget.greeting}
                </div>
              )}

              {searchResults && (
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {searchResults.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs text-gray-400 dark:text-slate-500">
                      {t.helpWidget.noResults}{' '}
                      <Link href="#contact" onClick={() => setOpen(false)} className="text-blue-600 underline dark:text-blue-400">
                        {t.helpWidget.contactUs}
                      </Link>
                    </p>
                  ) : (
                    searchResults.map((f) => {
                      const key = `s-${f.q}`
                      return (
                        <Accordion
                          key={key}
                          question={f.q}
                          answer={f.a}
                          badge={`${f.catEmoji} ${f.catLabel}`}
                          isOpen={activeKey === key}
                          onToggle={() => setActiveKey(activeKey === key ? null : key)}
                        />
                      )
                    })
                  )}
                </div>
              )}

              {!searchResults && (
                <div>
                  {categories.map((cat) => (
                    <div key={cat.label}>
                      <p className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-500">
                        <span>{cat.emoji}</span> {cat.label}
                      </p>
                      <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {cat.items.map((faq) => {
                          const key = `${cat.label}-${faq.q}`
                          return (
                            <Accordion
                              key={key}
                              question={faq.q}
                              answer={faq.a}
                              isOpen={activeKey === key}
                              onToggle={() => setActiveKey(activeKey === key ? null : key)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                {t.helpWidget.moreHelp}
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:info@erovoutika.ph"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <Mail className="h-3.5 w-3.5" /> {t.helpWidget.emailUs}
                </a>
                <a
                  href="tel:+639061497307"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <Phone className="h-3.5 w-3.5" /> {t.helpWidget.callUs}
                </a>
                <Link
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a56db] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> {t.helpWidget.contactForm}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? 'Close help widget' : 'Open help widget'}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex items-center gap-2.5 rounded-2xl border border-blue-800/30 px-3 py-2.5 shadow-lg transition-shadow hover:shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0f2b6b 0%, #1a56db 60%, #0ea5e9 100%)' }}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
          {open ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <RobotIcon className="h-7 w-7 text-white" />
          )}
        </span>

        <span className="text-left leading-tight text-white">
          <span className="block text-sm font-bold">{t.helpWidget.triggerTitle}</span>
          <span className="block text-[11px] text-blue-200">{t.helpWidget.triggerSub}</span>
        </span>
      </motion.button>
    </div>
  )
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function Accordion({
  question,
  answer,
  badge,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  badge?: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={`transition-colors ${isOpen ? 'bg-blue-50/60 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex-1 space-y-0.5">
          {badge && (
            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {badge}
            </span>
          )}
          <p className="text-xs font-semibold text-gray-800 dark:text-slate-100">{question}</p>
        </div>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="border-t border-blue-100 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:border-blue-900/40 dark:text-slate-400">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}