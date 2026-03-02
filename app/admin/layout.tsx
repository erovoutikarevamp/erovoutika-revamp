'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Newspaper,
  Award,
  Users,
  Mail,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  Building2,
  GraduationCap,
  X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const navigation = [
  { name: 'Dashboard',        href: '/admin',          icon: LayoutDashboard },
  { name: 'News & Updates',   href: '/admin/news',     icon: Newspaper },
  { name: 'Awards',           href: '/admin/awards',   icon: Award },
  {
    name: 'Partners',
    href: '/admin/partners',
    icon: Users,
    subItems: [
      { name: 'All Partners', href: '/admin/partners',          icon: Users },
      { name: 'Industry',     href: '/admin/partners/industry', icon: Building2 },
      { name: 'Academe',      href: '/admin/partners/academe',  icon: GraduationCap },
    ],
  },
  { name: 'Messages',         href: '/admin/messages', icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [isLoading,        setIsLoading]        = useState(true)
  const [isSidebarOpen,    setIsSidebarOpen]    = useState(false)
  const [userEmail,        setUserEmail]        = useState<string | null>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [expandedItems,    setExpandedItems]    = useState<string[]>(['Partners'])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      setUserEmail(session.user.email || null)
      setIsLoading(false)
    }
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/'
    })
    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    setShowLogoutDialog(false)
    try { await supabase.auth.signOut() } catch (e) { console.error(e) }
    window.location.href = '/'
  }

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#080d18]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
          <p className="text-xs text-gray-400 dark:text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64
        flex flex-col
        bg-gray-50 dark:bg-[#0c1120]
        border-r border-gray-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Logo area */}
        <div className="h-[72px] px-5 flex items-center justify-between shrink-0 border-b border-gray-200 dark:border-slate-800">
          <Image
            src="/erovoutika-logo.png"
            alt="Erovoutika"
            width={160} height={48}
            className="h-10 w-auto dark:brightness-0 dark:invert dark:opacity-95"
          />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">

          {/* Section label */}
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
            Menu
          </p>

          {navigation.map((item) => {
            const Icon           = item.icon
            const isActive       = pathname === item.href
            const hasSubItems    = !!item.subItems
            const isExpanded     = expandedItems.includes(item.name)
            const isParentActive = hasSubItems && pathname.startsWith(item.href)

            const base     = 'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150'
            const active   = 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm shadow-gray-200/80 dark:shadow-none border border-gray-200 dark:border-slate-700'
            const inactive = 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`${base} ${isParentActive ? active : inactive} justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-gray-400 dark:text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="ml-3 mt-0.5 pl-4 border-l-2 border-gray-200 dark:border-slate-700 space-y-0.5 py-1">
                        {item.subItems!.map((sub) => {
                          const SubIcon     = sub.icon
                          const isSubActive = pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`
                                flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all
                                ${isSubActive
                                  ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm shadow-gray-200/80 dark:shadow-none border border-gray-200 dark:border-slate-700'
                                  : 'text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-800/60'
                                }
                              `}
                            >
                              <SubIcon className="w-3.5 h-3.5 shrink-0" />
                              <span>{sub.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`${base} ${isActive ? active : inactive}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="shrink-0 p-3 border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-gray-500 dark:text-slate-500
              hover:text-red-600 dark:hover:text-red-400
              hover:bg-red-50 dark:hover:bg-red-500/10
              transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="lg:pl-64 min-h-screen bg-gray-50 dark:bg-[#080d18] transition-colors">

        {/* Header */}
        <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between px-6
          bg-white dark:bg-[#080d18]
          border-b border-gray-200 dark:border-slate-800">

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page label from pathname */}
          <p className="hidden lg:block text-sm font-medium text-gray-500 dark:text-slate-400 capitalize">
            {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ')}
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />

            <div className="w-px h-5 bg-gray-100 dark:bg-white/[0.07] mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-2.5 py-1.5 rounded-md
                hover:bg-gray-50 dark:hover:bg-white/[0.04]
                transition-colors focus:outline-none">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {userEmail?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm text-gray-700 dark:text-slate-300 max-w-[140px] truncate">
                  {userEmail}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-[#0e1525] border border-gray-100 dark:border-white/[0.08]">
                <DropdownMenuLabel>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Signed in as</p>
                  <p className="text-xs text-gray-700 dark:text-slate-300 truncate font-medium">{userEmail}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/[0.06]" />
                <DropdownMenuItem
                  className="text-red-500 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer text-sm"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-5 lg:p-7">
          {children}
        </main>
      </div>

      {/* Logout dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white dark:bg-[#0e1525] border border-gray-100 dark:border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">Sign out</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-slate-400 text-sm">
              You'll need to sign in again to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white border-0">
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}