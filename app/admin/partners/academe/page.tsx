'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, GraduationCap, Search, Globe } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'
import { PartnerDialog } from '../partner-dialog'

// ── TYPES ─────────────────────────────────────────────────────────────────
type Partner = {
  id?: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  type: 'industry' | 'academe'
  category?: string | null
  created_at?: string
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

export default function AcademePartnersPage() {
  const [partners,         setPartners]         = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [isLoading,        setIsLoading]        = useState(true)
  const [deleteId,         setDeleteId]         = useState<string | null>(null)
  const [searchQuery,      setSearchQuery]      = useState('')
  const [dialogOpen,       setDialogOpen]       = useState(false)
  const [editingPartner,   setEditingPartner]   = useState<Partner | null>(null)

  useEffect(() => { fetchPartners() }, [])
  useEffect(() => { filterPartners() }, [partners, searchQuery])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('type', 'academe')
        .order('created_at', { ascending: false })
      if (error) throw error
      setPartners(data || [])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const filterPartners = () => {
    if (!searchQuery) return setFilteredPartners(partners)
    const q = searchQuery.toLowerCase()
    setFilteredPartners(partners.filter(p =>
      p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    ))
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('partners').delete().eq('id', deleteId)
      if (error) throw error
      setPartners(partners.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch {
      alert('Failed to delete partner')
    }
  }

  const openAdd  = () => { setEditingPartner(null); setDialogOpen(true) }
  const openEdit = (p: Partner) => { setEditingPartner(p); setDialogOpen(true) }
  const closeDialog = () => { setDialogOpen(false); setEditingPartner(null) }

  const withLogo    = partners.filter(p => p.image_url).length
  const withWebsite = partners.filter(p => p.website_url).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-500 animate-pulse">Accessing Registry...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academe Partners</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage academic institution records and assets.</p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-400 shadow-none rounded-none border border-orange-500/50 font-mono text-[11px] uppercase tracking-widest px-6 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add_Institution
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStatCard title="Total_Institutions" value={partners.length} icon={GraduationCap} accent="#a855f7" />
        <DashboardStatCard title="With_Logo"          value={withLogo}       icon={GraduationCap} accent="#22c55e" />
        <DashboardStatCard title="With_Website"       value={withWebsite}    icon={Globe}         accent="#3b82f6" />
      </div>

      {/* ── Search ── */}
      <div className="relative p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm backdrop-blur-sm">
        <CardCorners color="rgba(150,150,150,0.1)" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
          <Input
            placeholder="Query registry by institution name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-200 dark:border-white/10 dark:bg-slate-950/50 rounded-none focus:ring-orange-500 font-mono text-xs"
          />
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="flex items-center gap-4">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-slate-500 shrink-0">Institution_Registry</p>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
      </div>

      {/* ── Table ── */}
      {filteredPartners.length === 0 ? (
        <div className="bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 py-20 text-center">
          <p className="font-mono text-[10px] text-gray-400 dark:text-slate-600 uppercase tracking-widest">Null_Set: No academe partners found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] overflow-hidden relative">
          <CardCorners color="rgba(150,150,150,0.05)" />
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b dark:border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Institution_Record</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Classification</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Web_Link</TableHead>
                <TableHead className="text-right font-mono text-[10px] uppercase tracking-wider h-10">Operation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map(p => (
                <TableRow key={p.id} className="group border-b dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-gray-100 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center overflow-hidden relative shrink-0">
                        {p.image_url
                          ? <Image src={p.image_url} alt={p.name} fill className="object-contain p-1" />
                          : <GraduationCap className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                        }
                      </div>
                      <span className="font-bold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.category ? (
                      <span className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                        {p.category}
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] text-gray-300 dark:text-slate-700 uppercase tracking-wider">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors font-mono">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">{p.website_url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : (
                      <span className="font-mono text-[9px] text-gray-300 dark:text-slate-700 uppercase tracking-wider">No_Link</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm"
                        onClick={() => openEdit(p)}
                        className="h-7 w-7 p-0 rounded-none dark:border-white/10 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm"
                        onClick={() => setDeleteId(p.id!)}
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

      {/* ── Partner Dialog ── */}
      <PartnerDialog
        open={dialogOpen}
        onOpenChange={(open) => { if (!open) closeDialog() }}
        partner={editingPartner}
        onSuccess={() => { fetchPartners(); closeDialog() }}
      />

      {/* ── Delete Dialog ── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-2 border-red-500/20 dark:bg-slate-900 dark:border-red-900/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase text-sm tracking-widest">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-xs italic dark:text-slate-400">
              Warning: This action will purge the institution record from the central database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none font-mono text-[10px] uppercase">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800 rounded-none font-mono text-[10px] uppercase">
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}