'use client'

import { Barlow_Condensed } from 'next/font/google'
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Cpu, Bot, Lightbulb, Shield, Link, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/languageContext'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Services() {
  const { t } = useLanguage()

  const services = [
    {
      title: t.services.training,
      description: t.services.trainingDesc,
      icon: GraduationCap,
    },
    {
      title: t.services.automation,
      description: t.services.automationDesc,
      icon: Cpu,
    },
    {
      title: t.services.robotics,
      description: t.services.roboticsDesc,
      icon: Bot,
    },
    {
      title: t.services.research,
      description: t.services.researchDesc,
      icon: Lightbulb,
    },
    {
      title: t.services.cybersecurity,
      description: t.services.cybersecurityDesc,
      icon: Shield,
    },
    {
      title: t.services.blockchain,
      description: t.services.blockchainDesc,
      icon: Link,
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            <Wrench className="w-4 h-4" />
            {t.services.badge}
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-slate-100 ${barlowCondensed.className}`}>
            {t.services.title}
          </h2>
          <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div key={index} variants={item}>
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-orange-400 bg-white dark:bg-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  <CardHeader className="pb-4 items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 group-hover:bg-orange-600 p-3 mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-100 group-hover:text-orange-600 mb-2 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-sm text-gray-600 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300 leading-relaxed transition-colors duration-300">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}