'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Newspaper, Award, Users, Mail, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

type Stats = {
  totalNews: number
  totalAwards: number
  totalPartners: number
  totalMessages: number
  newsThisMonth: number
  awardsThisMonth: number
  unreadMessages: number
}
type RecentNews  = { id: string; title: string; category: string; created_at: string }
type RecentAward = { id: string; title: string; year: string;     created_at: string }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0, totalAwards: 0, totalPartners: 0, totalMessages: 0,
    newsThisMonth: 0, awardsThisMonth: 0, unreadMessages: 0,
  })
  const [recentNews,   setRecentNews]   = useState<RecentNews[]>([])
  const [recentAwards, setRecentAwards] = useState<RecentAward[]>([])
  const [isLoading,    setIsLoading]    = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      const [
        { data: newsData },
        { data: awardsData },
        { data: partnersData },
        { data: messagesData },
        { data: recentNewsData },
        { data: recentAwardsData },
      ] = await Promise.all([
        supabase.from('news_updates').select('*'),
        supabase.from('awards').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('contact_messages').select('*'),
        supabase.from('news_updates').select('id, title, category, created_at').order('created_at', { ascending: false }).limit(4),
        supabase.from('awards').select('id, title, year, created_at').order('created_at', { ascending: false }).limit(4),
      ])

      const now = new Date()
      const thisMonth = (d: string) => {
        const date = new Date(d)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }

      setStats({
        totalNews:       newsData?.length     ?? 0,
        totalAwards:     awardsData?.length   ?? 0,
        totalPartners:   partnersData?.length ?? 0,
        totalMessages:   messagesData?.length ?? 0,
        newsThisMonth:   newsData?.filter(i => thisMonth(i.created_at)).length   ?? 0,
        awardsThisMonth: awardsData?.filter(i => thisMonth(i.created_at)).length ?? 0,
        unreadMessages:  messagesData?.filter(i => !i.is_read).length            ?? 0,
      })
      setRecentNews(recentNewsData   ?? [])
      setRecentAwards(recentAwardsData ?? [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (s < 60)     return 'Just now'
    if (s < 3600)   return `${Math.floor(s / 60)}m ago`
    if (s < 86400)  return `${Math.floor(s / 3600)}h ago`
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'News Articles',
      value: stats.totalNews,
      sub: stats.newsThisMonth > 0 ? `+${stats.newsThisMonth} this month` : 'No new this month',
      icon: Newspaper,
      href: '/admin/news',
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Awards',
      value: stats.totalAwards,
      sub: stats.awardsThisMonth > 0 ? `+${stats.awardsThisMonth} this month` : 'No new this month',
      icon: Award,
      href: '/admin/awards',
      color: 'text-violet-500 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
    },
    {
      label: 'Partners',
      value: stats.totalPartners,
      sub: 'Total partners',
      icon: Users,
      href: '/admin/partners',
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Messages',
      value: stats.totalMessages,
      sub: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'All read',
      icon: Mail,
      href: '/admin/messages',
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Overview</h1>
        <p className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href}>
              <div className="group p-5 bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/[0.10] hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  {card.badge !== undefined && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 tabular-nums">{card.value}</p>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{card.label}</p>
                <p className="text-xs text-gray-400 dark:text-slate-600 mt-0.5">{card.sub}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent News */}
        <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-medium text-gray-800 dark:text-slate-200">Recent News</h2>
            </div>
            <Link href="/admin/news" className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
            {recentNews.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-600 text-center py-10">No articles yet</p>
            ) : (
              recentNews.map((item) => (
                <div key={item.id} className="flex items-start justify-between px-5 py-3.5 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-600 shrink-0 pt-0.5">
                    <Clock className="w-3 h-3" />
                    {timeAgo(item.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Awards */}
        <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-medium text-gray-800 dark:text-slate-200">Recent Awards</h2>
            </div>
            <Link href="/admin/awards" className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
            {recentAwards.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-600 text-center py-10">No awards yet</p>
            ) : (
              recentAwards.map((item) => (
                <div key={item.id} className="flex items-start justify-between px-5 py-3.5 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-600 shrink-0 pt-0.5">
                    <Clock className="w-3 h-3" />
                    {timeAgo(item.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}