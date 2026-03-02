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

// ── TYPES ─────────────────────────────────────────────────────────────────
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

// ── VISUAL COMPONENTS ────────────────────────────────────────────────────────

function MiniSparkline({ color }: { color: string }) {
  const bars = [0.3, 0.6, 0.45, 0.8, 0.55, 0.9, 0.65, 1, 0.75, 0.5, 0.85, 0.7]
  return (
    <div className="flex items-end gap-[2px] h-6" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className="inline-block w-[2px] rounded-sm"
          style={{ height: `${h * 24}px`, background: color, opacity: 0.25 + h * 0.35 }} />
      ))}
    </div>
  )
}

function CardCorners({ color }: { color: string }) {
  const base: React.CSSProperties = {
    position: 'absolute', width: 10, height: 10,
    pointerEvents: 'none', zIndex: 2,
    borderColor: color, borderStyle: 'solid',
  }
  return (
    <>
      <span style={{ ...base, top: 0,    left:  0, borderWidth: '1.5px 0 0 1.5px' }} />
      <span style={{ ...base, top: 0,    right: 0, borderWidth: '1.5px 1.5px 0 0' }} />
      <span style={{ ...base, bottom: 0, left:  0, borderWidth: '0 0 1.5px 1.5px' }} />
      <span style={{ ...base, bottom: 0, right: 0, borderWidth: '0 1.5px 1.5px 0' }} />
    </>
  )
}

function DashboardStatCard({ title, value, icon: Icon, accent }: {
  title: string; value: number; icon: React.ElementType; accent: string
}) {
  return (
    <div className="relative group p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm transition-all hover:-translate-y-0.5">
      <CardCorners color={`${accent}30`} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-sm"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <MiniSparkline color={accent} />
      </div>
      <div className="mb-3">
        <span className="text-4xl font-bold tabular-nums leading-none">{value}</span>
      </div>
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-slate-500">{title}</span>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function AwardsManagement() {
  const [awards,           setAwards]           = useState<Award[]>([])
  const [filteredAwards,   setFilteredAwards]   = useState<Award[]>([])
  const [isLoading,        setIsLoading]        = useState(true)
  const [deleteId,         setDeleteId]         = useState<string | null>(null)
  const [dialogOpen,       setDialogOpen]       = useState(false)
  const [editingAward,     setEditingAward]     = useState<Award | null>(null)
  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear,     setSelectedYear]     = useState('all')
  const [categories,       setCategories]       = useState<string[]>([])
  const [years,            setYears]            = useState<string[]>([])

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
    if (searchQuery)                f = f.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.recipient.toLowerCase().includes(searchQuery.toLowerCase()))
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
  const thisYearCount = awards.filter(i => i.year === new Date().getFullYear().toString()).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-500 animate-pulse">Accessing Archives...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
   
          <h1 className="text-2xl font-bold tracking-tight">Awards</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage recognition records and award entries.</p>
        </div>
        <Button
          onClick={() => { setEditingAward(null); setDialogOpen(true) }}
          className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-400 shadow-none rounded-none border border-orange-500/50 font-mono text-[11px] uppercase tracking-widest px-6 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Award
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStatCard title="Total_Volume"  value={awards.length}    icon={AwardIcon} accent="#a855f7" />
        <DashboardStatCard title="Current_Year"  value={thisYearCount}    icon={Calendar}  accent="#22c55e" />
        <DashboardStatCard title="Categories"    value={categories.length} icon={Filter}   accent="#f97316" />
      </div>

      {/* ── Search & Filters ── */}
      <div className="relative p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm backdrop-blur-sm">
        <CardCorners color="rgba(150,150,150,0.1)" />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
            <Input
              placeholder="Query database for titles or recipients..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-200 dark:border-white/10 dark:bg-slate-950/50 rounded-none focus:ring-orange-500 font-mono text-xs"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 h-10 rounded-none dark:border-white/10 dark:bg-slate-950/50 font-mono text-xs">
              <div className="flex items-center">
                <Filter className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <SelectValue placeholder="Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
              <SelectItem value="all">All_Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full md:w-36 h-10 rounded-none dark:border-white/10 dark:bg-slate-950/50 font-mono text-xs">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <SelectValue placeholder="Year" />
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
              <SelectItem value="all">All_Years</SelectItem>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}
              className="h-10 rounded-none font-mono text-[10px] uppercase tracking-widest border-gray-200 dark:border-white/10 text-gray-500 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-colors">
              Clear
            </Button>
          )}
        </div>
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-gray-400 dark:text-slate-600 mt-3">
          Showing {filteredAwards.length} of {awards.length} records
        </p>
      </div>

      {/* ── Separator ── */}
      <div className="flex items-center gap-4">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-slate-500 shrink-0">Award_Registry</p>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
      </div>

      {/* ── Table ── */}
      {filteredAwards.length === 0 ? (
        <div className="bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 py-20 text-center">
          <p className="font-mono text-[10px] text-gray-400 dark:text-slate-600 uppercase tracking-widest">
            {hasFilters ? 'Null_Set: No records match active filters' : 'Null_Set: No award records found'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] overflow-hidden relative">
          <CardCorners color="rgba(150,150,150,0.05)" />
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b dark:border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Record_Title</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Recipient</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Classification</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Year</TableHead>
                <TableHead className="text-right font-mono text-[10px] uppercase tracking-wider h-10">Operation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAwards.map(item => (
                <TableRow key={item.id} className="group border-b dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell>
                    <span className="font-bold group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 dark:text-slate-400 italic">{item.recipient}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                      <Calendar className="w-3 h-3 text-gray-400 dark:text-slate-600" />
                      {item.year}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm"
                        onClick={() => { setEditingAward(item); setDialogOpen(true) }}
                        className="h-7 w-7 p-0 rounded-none dark:border-white/10 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm"
                        onClick={() => setDeleteId(item.id)}
                        className="h-7 w-7 p-0 rounded-none dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Award Dialog ── */}
      <AwardDialog
        open={dialogOpen}
        onOpenChange={open => { if (!open) { setDialogOpen(false); setEditingAward(null) } }}
        award={editingAward}
        onSuccess={fetchAwards}
      />

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-2 border-red-500/20 dark:bg-slate-900 dark:border-red-900/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase text-sm tracking-widest">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-xs italic dark:text-slate-400">
              Warning: This action will erase the award record from the central database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none font-mono text-[10px] uppercase">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800 rounded-none font-mono text-[10px] uppercase">
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}