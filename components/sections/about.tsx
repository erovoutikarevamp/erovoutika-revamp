'use client'

import { Button } from '@/components/ui/button'
import { Target, Eye, Compass } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/languageContext'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '800'], display: 'swap' })

export function About() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">

          {/* Left — intro text + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
              <Target className="w-4 h-4" />
              {t.about.badge}
            </div>

            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-slate-100 leading-tight ${playfair.className}`}>
              {t.about.title}
            </h2>

            <div className="space-y-4 text-base text-gray-600 dark:text-slate-400 leading-relaxed">
              <p>{t.about.intro}</p>
            </div>

            <Button
              size="default"
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-8 py-2 text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Link href="#contact">{t.about.getInTouch}</Link>
            </Button>
          </motion.div>

          {/* Right — Vision & Mission cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-gray-50 dark:bg-slate-800 rounded-xl p-7 border border-gray-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 group-hover:bg-orange-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-all duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors duration-300">Vision</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                    To become a global competitive company in Robotics, Automation, and ICT — proficiently addressing the need for safety, security, and automation.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group bg-gray-50 dark:bg-slate-800 rounded-xl p-7 border border-gray-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 group-hover:bg-orange-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-all duration-300">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors duration-300">Mission</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                    To provide our customers with quality-assured products and services with minimal delivery time. Through technical expertise and innovation, we are committed to exceeding our customers' expectations. It is our mission to continuously provide our employees with a safe, healthy, and happy workplace.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}