'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Building2, Search, Globe, ArrowLeft } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PartnerDialog } from '../partner-dialog'
import Link from 'next/link'
import Image from 'next/image'

type Partner = {
  id: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  category: string | null
  type: 'industry' | 'academe'
  created_at: string
}

export default function IndustryPartnersPage() {
  const [partners,         setPartners]         = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [isLoading,        setIsLoading]        = useState(true)
  const [deleteId,         setDeleteId]         = useState<string | null>(null)
  const [dialogOpen,       setDialogOpen]       = useState(false)
  const [editingPartner,   setEditingPartner]   = useState<Partner | null>(null)
  const [searchQuery,      setSearchQuery]      = useState('')

  useEffect(() => { fetchPartners() }, [])
  useEffect(() => { filterPartners() }, [partners, searchQuery])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase.from('partners').select('*').eq('type', 'industry').order('created_at', { ascending: false })
      if (error) throw error
      setPartners(data || [])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const filterPartners = () => {
    if (!searchQuery) { setFilteredPartners(partners); return }
    setFilteredPartners(partners.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('partners').delete().eq('id', deleteId)
      if (error) throw error
      setPartners(partners.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch (e) { console.error(e) }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Breadcrumb */}
      <Link href="/admin/partners" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Partners
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Industry Partners</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">{partners.length} partners</p>
        </div>
        <Button
          onClick={() => { setEditingPartner(null); setDialogOpen(true) }}
          className="bg-blue-500 hover:bg-blue-600 text-white h-9 px-4 text-sm gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Partners',    value: partners.length,                                                     icon: Building2, color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'With Website',      value: partners.filter(p => p.website_url).length,                          icon: Globe,     color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'With Logo',         value: partners.filter(p => p.image_url).length,                            icon: Building2, color: 'text-orange-500',  bg: 'bg-orange-50 dark:bg-orange-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-slate-100 tabular-nums leading-none">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]"
            />
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')} className="h-9 text-sm border-gray-200 dark:border-white/[0.08] text-gray-500">
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-600 mt-3">
          {filteredPartners.length} of {partners.length} shown
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {filteredPartners.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-8 h-8 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-gray-400 dark:text-slate-600">
              {searchQuery ? 'No partners match your search' : 'No industry partners yet'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10 w-14">Logo</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Name</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10">Website</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10 hidden md:table-cell">Description</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-slate-500 h-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map(item => (
                <TableRow key={item.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell>
                    <div className="relative w-9 h-9 rounded-lg border border-gray-100 dark:border-white/[0.06] overflow-hidden bg-white flex items-center justify-center">
                      {item.image_url
                        ? <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" />
                        : <Building2 className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{item.name}</p>
                    {item.category && <p className="text-xs text-gray-400 dark:text-slate-600 mt-0.5">{item.category}</p>}
                  </TableCell>
                  <TableCell>
                    {item.website_url && (
                      <a href={item.website_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Globe className="w-3 h-3" /> Visit site
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs hidden md:table-cell">
                    <p className="text-xs text-gray-500 dark:text-slate-500 line-clamp-2 leading-relaxed">{item.description || '—'}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingPartner(item); setDialogOpen(true) }}
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

      <PartnerDialog
        open={dialogOpen}
        onOpenChange={open => { if (!open) { setDialogOpen(false); setEditingPartner(null) } }}
        partner={editingPartner}
        onSuccess={fetchPartners}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#0e1525] border border-gray-100 dark:border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">Remove partner?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-slate-400 text-sm">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 dark:border-white/[0.08]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}