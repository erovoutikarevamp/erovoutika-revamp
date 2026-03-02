'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Newspaper, Search, Filter, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image_url: string | null
  is_published: boolean
  scheduled_date: string | null
  created_at: string
}

export default function NewsManagement() {
  const router = useRouter()
  const [news,             setNews]             = useState<NewsItem[]>([])
  const [filteredNews,     setFilteredNews]     = useState<NewsItem[]>([])
  const [isLoading,        setIsLoading]        = useState(true)
  const [deleteId,         setDeleteId]         = useState<string | null>(null)
  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories,       setCategories]       = useState<string[]>([])
  const [tab,              setTab]              = useState<'published' | 'scheduled'>('published')

  useEffect(() => { fetchNews() }, [])
  useEffect(() => { filterNews() }, [news, searchQuery, selectedCategory, tab])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.from('news_updates').select('*').order('created_at', { ascending: false })
      if (error) throw error
      const d = data || []
      setNews(d)
      setCategories([...new Set(d.map(i => i.category).filter(Boolean))] as string[])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const filterNews = () => {
    let f = [...news]
    f = tab === 'published' ? f.filter(i => i.is_published) : f.filter(i => !i.is_published && i.scheduled_date)
    if (searchQuery)              f = f.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    if (selectedCategory !== 'all') f = f.filter(i => i.category === selectedCategory)
    setFilteredNews(f)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('news_updates').delete().eq('id', deleteId)
      if (error) throw error
      setNews(news.filter(i => i.id !== deleteId))
      setDeleteId(null)
    } catch (e) { console.error(e) }
  }

  const publishedCount  = news.filter(n =>  n.is_published).length
  const scheduledCount  = news.filter(n => !n.is_published && n.scheduled_date).length
  const thisMonthCount  = news.filter(n => {
    const d = new Date(n.created_at), now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">News & Updates</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">Manage editorial content</p>
        </div>
        <Link href="/admin/news/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white h-9 px-4 text-sm gap-1.5">
            <Plus className="w-4 h-4" /> New Article
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: news.length,    icon: Newspaper,    color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Published', value: publishedCount,  icon: CheckCircle,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Scheduled', value: scheduledCount,  icon: Clock,        color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
          { label: 'This month',value: thisMonthCount,  icon: TrendingUp,   color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] p-5">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 tabular-nums">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-44 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs + table */}
      <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">

        {/* Tab bar */}
        <div className="flex border-b border-gray-100 dark:border-white/[0.06] px-4 pt-3">
          {(['published', 'scheduled'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              {t === 'published' ? `Published (${publishedCount})` : `Scheduled (${scheduledCount})`}
            </button>
          ))}
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-8 h-8 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-gray-400 dark:text-slate-600">
              {searchQuery || selectedCategory !== 'all' ? 'No articles match your filters' : `No ${tab} articles`}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Article</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Category</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">
                  {tab === 'published' ? 'Date' : 'Scheduled for'}
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map(item => (
                <TableRow key={item.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="max-w-sm">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-600 mt-0.5 truncate">{item.excerpt}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-slate-500">
                    {tab === 'published'
                      ? format(new Date(item.date), 'MMM d, yyyy')
                      : format(new Date(item.scheduled_date!), 'MMM d, yyyy · HH:mm')
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/news/edit/${item.id}`)}
                        className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-gray-700 dark:hover:text-slate-300">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}
                        className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#0e1525] border border-gray-100 dark:border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">Delete article?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-slate-400 text-sm">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 dark:border-white/[0.08]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}