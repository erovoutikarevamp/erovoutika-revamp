'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Award as AwardIcon, Calendar, Search, Filter } from 'lucide-react'
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
import { AwardDialog } from './award-dialog'

type Award = {
  id: string
  title: string
  recipient: string
  description: string
  year: string
  category: string
  image_url: string | null
  created_at: string
}

export default function AwardsManagement() {
  const [awards,          setAwards]          = useState<Award[]>([])
  const [filteredAwards,  setFilteredAwards]  = useState<Award[]>([])
  const [isLoading,       setIsLoading]       = useState(true)
  const [deleteId,        setDeleteId]        = useState<string | null>(null)
  const [dialogOpen,      setDialogOpen]      = useState(false)
  const [editingAward,    setEditingAward]    = useState<Award | null>(null)
  const [searchQuery,     setSearchQuery]     = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear,    setSelectedYear]    = useState('all')
  const [categories,      setCategories]      = useState<string[]>([])
  const [years,           setYears]           = useState<string[]>([])

  useEffect(() => { fetchAwards() }, [])
  useEffect(() => { filterAwards() }, [awards, searchQuery, selectedCategory, selectedYear])

  const fetchAwards = async () => {
    try {
      const { data, error } = await supabase.from('awards').select('*').order('year', { ascending: false })
      if (error) throw error
      const d = data || []
      setAwards(d)
      setCategories([...new Set(d.map(i => i.category))])
      setYears([...new Set(d.map(i => i.year))].sort((a, b) => b.localeCompare(a)))
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const filterAwards = () => {
    let f = [...awards]
    if (searchQuery)              f = f.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.recipient.toLowerCase().includes(searchQuery.toLowerCase()))
    if (selectedCategory !== 'all') f = f.filter(i => i.category === selectedCategory)
    if (selectedYear     !== 'all') f = f.filter(i => i.year     === selectedYear)
    setFilteredAwards(f)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('awards').delete().eq('id', deleteId)
      if (error) throw error
      setAwards(awards.filter(i => i.id !== deleteId))
      setDeleteId(null)
    } catch (e) { console.error(e) }
  }

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory('all'); setSelectedYear('all') }
  const hasFilters   = searchQuery || selectedCategory !== 'all' || selectedYear !== 'all'

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Awards</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">{awards.length} total entries</p>
        </div>
        <Button
          onClick={() => { setEditingAward(null); setDialogOpen(true) }}
          className="bg-orange-500 hover:bg-orange-600 text-white h-9 px-4 text-sm gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Award
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',      value: awards.length,      icon: AwardIcon, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
          { label: 'This year',  value: awards.filter(i => i.year === new Date().getFullYear().toString()).length, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Categories', value: categories.length,  icon: Filter,    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
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
              placeholder="Search awards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-44 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full md:w-32 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters} className="h-9 text-sm border-gray-200 dark:border-white/[0.08] text-gray-500 hover:text-red-500">
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-600 mt-3">
          Showing {filteredAwards.length} of {awards.length}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {filteredAwards.length === 0 ? (
          <div className="text-center py-16">
            <AwardIcon className="w-8 h-8 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-gray-400 dark:text-slate-600">
              {hasFilters ? 'No awards match your filters' : 'No awards yet'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Title</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Recipient</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Category</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Year</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAwards.map(item => (
                <TableRow key={item.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="text-sm font-medium text-gray-800 dark:text-slate-200">{item.title}</TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-slate-400">{item.recipient}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-slate-400">{item.year}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingAward(item); setDialogOpen(true) }}
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

      <AwardDialog
        open={dialogOpen}
        onOpenChange={open => { if (!open) { setDialogOpen(false); setEditingAward(null) } }}
        award={editingAward}
        onSuccess={fetchAwards}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#0e1525] border border-gray-100 dark:border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">Delete award?</AlertDialogTitle>
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