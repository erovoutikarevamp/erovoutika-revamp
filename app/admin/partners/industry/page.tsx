'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Building2, GraduationCap, ArrowRight, Users, Globe, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type Partner = {
  id: string
  name: string
  image_url: string | null
  type: 'industry' | 'academe'
  website_url: string | null
  category: string | null
}

export default function PartnersOverviewPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchPartners() }, [])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, image_url, type, website_url, category')
        .order('created_at', { ascending: false })
      if (error) throw error
      setPartners(data || [])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const industry = partners.filter(p => p.type === 'industry')
  const academe  = partners.filter(p => p.type === 'academe')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Partners</h1>
        <p className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">{partners.length} total partners across both categories</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Partners',    value: partners.length,  icon: Users,         color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
          { label: 'Industry Partners', value: industry.length,  icon: Building2,     color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Academic Partners', value: academe.length,   icon: GraduationCap, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-200 dark:border-slate-800 p-4 flex items-center gap-3">
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

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Industry */}
        <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          {/* Card header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Industry</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">{industry.length} partners</p>
              </div>
            </div>
            <Link href="/admin/partners/industry">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-gray-200 dark:border-slate-700 gap-1.5 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Manage <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {/* Partner logos grid */}
          <div className="p-5">
            {industry.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Building2 className="w-8 h-8 text-gray-200 dark:text-slate-700" />
                <p className="text-sm text-gray-400 dark:text-slate-600">No industry partners yet</p>
                <Link href="/admin/partners/industry">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1.5 border-gray-200 dark:border-slate-700">
                    <Plus className="w-3.5 h-3.5" /> Add first partner
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {industry.slice(0, 8).map(p => (
                    <div
                      key={p.id}
                      className="aspect-square rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden relative group"
                      title={p.name}
                    >
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <Building2 className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                          <span className="text-[9px] text-gray-400 dark:text-slate-600 text-center leading-tight line-clamp-2">{p.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {industry.length > 8 && (
                    <Link href="/admin/partners/industry" className="aspect-square rounded-lg border border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                      <span className="text-xs font-medium text-gray-400 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400">+{industry.length - 8}</span>
                    </Link>
                  )}
                </div>

                {/* Partner name list (last 3) */}
                <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-slate-800 pt-4">
                  {industry.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden relative shrink-0">
                          {p.image_url
                            ? <Image src={p.image_url} alt={p.name} fill className="object-contain p-0.5" />
                            : <Building2 className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                          }
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate max-w-[160px]">{p.name}</span>
                      </div>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-slate-700 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                  {industry.length > 3 && (
                    <Link href="/admin/partners/industry" className="block text-xs text-gray-400 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors pt-1">
                      View all {industry.length} industry partners →
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Academe */}
        <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          {/* Card header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Academe</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">{academe.length} institutions</p>
              </div>
            </div>
            <Link href="/admin/partners/academe">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-gray-200 dark:border-slate-700 gap-1.5 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                Manage <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {/* Partner logos grid */}
          <div className="p-5">
            {academe.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <GraduationCap className="w-8 h-8 text-gray-200 dark:text-slate-700" />
                <p className="text-sm text-gray-400 dark:text-slate-600">No academe partners yet</p>
                <Link href="/admin/partners/academe">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1.5 border-gray-200 dark:border-slate-700">
                    <Plus className="w-3.5 h-3.5" /> Add first institution
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {academe.slice(0, 8).map(p => (
                    <div
                      key={p.id}
                      className="aspect-square rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden relative group"
                      title={p.name}
                    >
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <GraduationCap className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                          <span className="text-[9px] text-gray-400 dark:text-slate-600 text-center leading-tight line-clamp-2">{p.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {academe.length > 8 && (
                    <Link href="/admin/partners/academe" className="aspect-square rounded-lg border border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center hover:border-violet-300 dark:hover:border-violet-700 transition-colors group">
                      <span className="text-xs font-medium text-gray-400 dark:text-slate-600 group-hover:text-violet-500 dark:group-hover:text-violet-400">+{academe.length - 8}</span>
                    </Link>
                  )}
                </div>

                {/* Institution name list (last 3) */}
                <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-slate-800 pt-4">
                  {academe.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden relative shrink-0">
                          {p.image_url
                            ? <Image src={p.image_url} alt={p.name} fill className="object-contain p-0.5" />
                            : <GraduationCap className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                          }
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate max-w-[160px]">{p.name}</span>
                      </div>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-slate-700 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                  {academe.length > 3 && (
                    <Link href="/admin/partners/academe" className="block text-xs text-gray-400 dark:text-slate-600 hover:text-violet-500 dark:hover:text-violet-400 transition-colors pt-1">
                      View all {academe.length} academe partners →
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}