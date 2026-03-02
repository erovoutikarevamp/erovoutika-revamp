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

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

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
          <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage industry and academic partner registries.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStatCard title="Total_Partners"    value={partners.length} icon={Users}         accent="#f97316" />
        <DashboardStatCard title="Industry_Partners" value={industry.length} icon={Building2}     accent="#3b82f6" />
        <DashboardStatCard title="Academic_Partners" value={academe.length}  icon={GraduationCap} accent="#a855f7" />
      </div>

      {/* ── Category cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Industry */}
        <div className="relative bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          <CardCorners color="#3b82f620" />

          {/* Card header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-sm"
                style={{ background: '#3b82f615', border: '1px solid #3b82f630' }}>
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 tracking-tight">Industry</h2>
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-gray-400 dark:text-slate-500">{industry.length} partners</p>
              </div>
            </div>
            <Link href="/admin/partners/industry">
              <Button size="sm" className="h-8 px-4 rounded-none border border-blue-500/50 bg-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-mono text-[10px] uppercase tracking-widest shadow-none transition-all hover:-translate-y-0.5">
                Manage <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Partner logos grid */}
          <div className="p-5">
            {industry.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-gray-200 dark:border-white/10">
                <Building2 className="w-8 h-8 text-gray-200 dark:text-slate-700" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600">Null_Set: No industry partners</p>
                <Link href="/admin/partners/industry">
                  <Button size="sm" className="h-8 px-4 rounded-none border border-gray-200 dark:border-white/10 bg-transparent text-gray-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 font-mono text-[10px] uppercase tracking-widest shadow-none gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Initialize_Entry
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {industry.slice(0, 8).map(p => (
                    <div
                      key={p.id}
                      className="aspect-square border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center overflow-hidden relative group"
                      title={p.name}
                    >
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <Building2 className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                          <span className="text-[9px] text-gray-400 dark:text-slate-600 text-center leading-tight line-clamp-2 font-mono">{p.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {industry.length > 8 && (
                    <Link href="/admin/partners/industry" className="aspect-square border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                      <span className="font-mono text-xs font-medium text-gray-400 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400">+{industry.length - 8}</span>
                    </Link>
                  )}
                </div>

                {/* Partner name list */}
                <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-white/[0.06] pt-4">
                  {industry.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden relative shrink-0">
                          {p.image_url
                            ? <Image src={p.image_url} alt={p.name} fill className="object-contain p-0.5" />
                            : <Building2 className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                          }
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate max-w-[160px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</span>
                      </div>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-slate-700 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                  {industry.length > 3 && (
                    <Link href="/admin/partners/industry" className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors pt-1">
                      View all {industry.length} records →
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Academe */}
        <div className="relative bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          <CardCorners color="#a855f720" />

          {/* Card header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-sm"
                style={{ background: '#a855f715', border: '1px solid #a855f730' }}>
                <GraduationCap className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 tracking-tight">Academe</h2>
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-gray-400 dark:text-slate-500">{academe.length} institutions</p>
              </div>
            </div>
            <Link href="/admin/partners/academe">
              <Button size="sm" className="h-8 px-4 rounded-none border border-violet-500/50 bg-transparent text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 font-mono text-[10px] uppercase tracking-widest shadow-none transition-all hover:-translate-y-0.5">
                Manage <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Partner logos grid */}
          <div className="p-5">
            {academe.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-gray-200 dark:border-white/10">
                <GraduationCap className="w-8 h-8 text-gray-200 dark:text-slate-700" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600">Null_Set: No academe partners</p>
                <Link href="/admin/partners/academe">
                  <Button size="sm" className="h-8 px-4 rounded-none border border-gray-200 dark:border-white/10 bg-transparent text-gray-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 font-mono text-[10px] uppercase tracking-widest shadow-none gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Initialize_Entry
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {academe.slice(0, 8).map(p => (
                    <div
                      key={p.id}
                      className="aspect-square border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center overflow-hidden relative group"
                      title={p.name}
                    >
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <GraduationCap className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                          <span className="text-[9px] text-gray-400 dark:text-slate-600 text-center leading-tight line-clamp-2 font-mono">{p.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {academe.length > 8 && (
                    <Link href="/admin/partners/academe" className="aspect-square border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center hover:border-violet-300 dark:hover:border-violet-700 transition-colors group">
                      <span className="font-mono text-xs font-medium text-gray-400 dark:text-slate-600 group-hover:text-violet-500 dark:group-hover:text-violet-400">+{academe.length - 8}</span>
                    </Link>
                  )}
                </div>

                {/* Institution name list */}
                <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-white/[0.06] pt-4">
                  {academe.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden relative shrink-0">
                          {p.image_url
                            ? <Image src={p.image_url} alt={p.name} fill className="object-contain p-0.5" />
                            : <GraduationCap className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                          }
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate max-w-[160px] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{p.name}</span>
                      </div>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-slate-700 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                  {academe.length > 3 && (
                    <Link href="/admin/partners/academe" className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600 hover:text-violet-500 dark:hover:text-violet-400 transition-colors pt-1">
                      View all {academe.length} records →
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