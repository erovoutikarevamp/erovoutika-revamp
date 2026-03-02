'use client'

import { Libre_Baskerville, Barlow_Condensed } from 'next/font/google'
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['700'], display: 'swap' })
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

import { Tag, X, ArrowUpRight, ChevronLeft, ChevronRight, Calendar, Newspaper } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n/languageContext'
import Image from 'next/image'

type NewsItem = {
  id: string
  title: string
  excerpt: string
  content: string | null
  category: string
  date: string
  image_url: string | null
  url: string | null
}

const VP = { once: false, margin: '-80px' } as const

const modalOverlay = {
  hidden: { opacity: 0 },
  show:   { opacity: 1 },
  exit:   { opacity: 0 },
}
const modalContent = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  show:   { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 28 } },
  exit:   { opacity: 0, scale: 0.97, y: 16, transition: { duration: 0.18 } },
}

// ─── Detect Tiptap HTML vs plain text ─────────────────────────────────────────
function isHtml(str: string) {
  return /<[a-z][\s\S]*>/i.test(str)
}

// ─── NewsModal ────────────────────────────────────────────────────────────────
function NewsModal({ news, allNews, onClose, onNavigate }: {
  news: NewsItem; allNews: NewsItem[]
  onClose: () => void; onNavigate: (item: NewsItem) => void
}) {
  const currentIndex = allNews.findIndex((n) => n.id === news.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allNews.length - 1
  const handlePrev = () => hasPrev && onNavigate(allNews[currentIndex - 1])
  const handleNext = () => hasNext && onNavigate(allNews[currentIndex + 1])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const hasContent    = !!news.content?.trim()
  const contentIsHtml = hasContent && isHtml(news.content!)
  const paragraphs    = hasContent && !contentIsHtml
    ? news.content!.split('\n').filter(Boolean)
    : []

  return (
    <motion.div
      variants={modalOverlay} initial="hidden" animate="show" exit="exit"
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="flex items-start justify-center min-h-full py-8 px-4">
        <motion.div
          variants={modalContent} initial="hidden" animate="show" exit="exit"
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Close ── */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* ── Hero image — full width, always shown on every screen size ── */}
          <div className="relative w-full h-52 sm:h-64 shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600">
            {news.image_url ? (
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                priority
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Newspaper className="w-14 h-14 text-gray-400 dark:text-slate-500 opacity-50" />
              </div>
            )}

            {/* Scrim so overlaid text is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Category + date pinned to bottom-left of image */}
            <div className="absolute bottom-4 left-5 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-[11px] uppercase tracking-widest shadow">
                <Tag className="w-3 h-3" />{news.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/75">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* ── Article body ── */}
          <div className="px-6 sm:px-8 pt-6 pb-4">

            <h2 className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 leading-tight mb-3 ${libreBaskerville.className}`}>
              {news.title}
            </h2>
            <div className="w-10 h-0.5 bg-orange-500 mb-4" />

            {/* Excerpt — italic lead */}
            <p className="text-gray-500 dark:text-slate-400 text-sm italic leading-relaxed pb-4 mb-4 border-b border-gray-100 dark:border-slate-700">
              {news.excerpt}
            </p>

            {/* Content — Tiptap HTML or plain paragraphs */}
            {hasContent && (
              contentIsHtml ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none mb-6
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-slate-100
                    prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 dark:prose-strong:text-slate-200
                    prose-blockquote:border-l-orange-500 prose-blockquote:text-gray-500
                    prose-code:text-orange-600 dark:prose-code:text-orange-400
                    prose-li:text-gray-700 dark:prose-li:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: news.content! }}
                />
              ) : (
                <div className="space-y-3 mb-6">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-gray-700 dark:text-slate-300 text-[15px] leading-[1.85]">{para}</p>
                  ))}
                </div>
              )
            )}

            {/* Source link */}
            {news.url && (
              <div className="mb-6">
                <a
                  href={news.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors group"
                >
                  View Original Source
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            )}
          </div>

          {/* ── Prev / Next ── */}
          {allNews.length > 1 && (
            <div className="border-t border-gray-100 dark:border-slate-700 px-6 sm:px-8 py-4 flex items-center justify-between bg-gray-50 dark:bg-slate-800/60">
              <button
                onClick={handlePrev} disabled={!hasPrev}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-gray-400 dark:text-slate-500 tabular-nums">
                {currentIndex + 1} / {allNews.length}
              </span>
              <button
                onClick={handleNext} disabled={!hasNext}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function News() {
  const { t, language } = useLanguage()
  const [news, setNews]               = useState<NewsItem[]>([])
  const [isLoading, setIsLoading]     = useState(true)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => { fetchNews() }, [language])

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/news/translate?lang=${language}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal  = useCallback((item: NewsItem) => setSelectedNews(item), [])
  const closeModal = useCallback(() => setSelectedNews(null), [])

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-[#050A14]">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-3 h-64">
          <div className="relative w-10 h-10">
            <motion.div
              animate={{ scale: [1, 1.65, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-orange-400"
            />
            <div className="absolute inset-[7px] rounded-full bg-orange-500 animate-pulse" />
          </div>
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-400 dark:text-slate-500">Loading</p>
        </div>
      </section>
    )
  }

  const sorted      = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const [featured, ...rest] = sorted
  const sideItems   = rest.slice(0, 3)
  const hiddenCount = Math.max(0, rest.length - 3)

  return (
    <>
      <section className="py-20 bg-white dark:bg-[#050A14]">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* ══════════════════════════════════════════════
              SECTION HEADING
          ══════════════════════════════════════════════ */}
          <div className="mb-12 space-y-3">

            {/* Badge */}
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
              viewport={VP}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium"
            >
              <Newspaper className="w-4 h-4" />
              {t.news.title}
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div className="space-y-1.5">

                {/* Eyebrow */}
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 dark:text-slate-600"
                >
                  Erovoutika
                </motion.p>

                {/* Main title */}
                <div className="overflow-hidden">
                  <motion.h2
                    initial={{ y: 36, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={VP}
                    transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${barlowCondensed.className}`}
                  >
                    Latest News &amp; Updates
                  </motion.h2>
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VP}
                  transition={{ duration: 0.4, delay: 0.16 }}
                  className="text-sm text-gray-500 dark:text-slate-500 max-w-md leading-relaxed"
                >
                  Stay up to date — competitions, certifications, and company milestones.
                </motion.p>
              </div>

              {hiddenCount > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VP}
                  transition={{ delay: 0.38 }}
                  onClick={() => featured && openModal(featured)}
                  className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
                >
                  View all ({news.length})
                </motion.button>
              )}
            </div>
          </div>

          {/* No articles */}
          {news.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 dark:text-slate-500 text-sm">{t.news.noNews}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1px_1fr] gap-0">

              {/* ── LEFT — Featured ── */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:pr-10"
                >
                  <div onClick={() => openModal(featured)} className="group cursor-pointer">

                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={VP}
                      transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="relative w-full overflow-hidden rounded-lg mb-4"
                      style={{ aspectRatio: '16/9' }}
                    >
                      {featured.image_url ? (
                        <Image
                          src={featured.image_url} alt={featured.title} fill priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                          <Tag className="w-12 h-12 text-gray-300 dark:text-slate-500" />
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VP}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="flex items-center gap-2 mb-2"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{featured.category}</span>
                      <span className="text-gray-300 dark:text-slate-600">·</span>
                      <span className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </motion.div>

                    <div className="overflow-hidden mb-2">
                      <motion.h2
                        initial={{ y: 24, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={VP}
                        transition={{ duration: 0.56, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${libreBaskerville.className}`}
                      >
                        {featured.title}
                      </motion.h2>
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={VP}
                      transition={{ delay: 0.34, duration: 0.4 }}
                      className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-3"
                    >
                      {featured.excerpt}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VP}
                      transition={{ delay: 0.4, duration: 0.35 }}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 group-hover:text-orange-600 transition-colors"
                    >
                      Read story
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Vertical divider */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={VP}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block w-px bg-gray-200 dark:bg-slate-700/60 origin-top"
              />

              {/* ── RIGHT — Side items ── */}
              <motion.div
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                }}
                initial="hidden"
                whileInView="show"
                viewport={VP}
                className="lg:pl-10 flex flex-col mt-8 lg:mt-0"
              >
                {sideItems.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-slate-500 py-4">No more stories</p>
                ) : (
                  sideItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show:   { opacity: 1, x: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
                      }}
                      onClick={() => openModal(item)}
                      className={`group flex gap-4 cursor-pointer py-5 ${i < sideItems.length - 1 ? 'border-b border-gray-100 dark:border-slate-700/50' : ''}`}
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.85 },
                          show:   { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
                        }}
                        className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-700"
                      >
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.title} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-gray-300 dark:text-slate-500" />
                          </div>
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{item.category}</span>
                          <span className="text-gray-300 dark:text-slate-600 text-xs">·</span>
                          <span className="text-[10px] text-gray-400 dark:text-slate-500">
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${libreBaskerville.className}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="shrink-0 self-start pt-1">
                        <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </motion.div>
                  ))
                )}

                {hiddenCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VP}
                    transition={{ delay: 0.5 }}
                    onClick={() => sideItems[0] && openModal(sideItems[0])}
                    className="mt-4 self-start text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-orange-500 transition-colors"
                  >
                    + {hiddenCount} more — open reader →
                  </motion.button>
                )}
              </motion.div>

            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedNews && (
          <NewsModal
            news={selectedNews}
            allNews={sorted}
            onClose={closeModal}
            onNavigate={setSelectedNews}
          />
        )}
      </AnimatePresence>
    </>
  )
}