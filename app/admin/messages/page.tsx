'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Search, Trash2, Eye, EyeOff, Clock, Inbox } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Message = {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [messages,         setMessages]         = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [isLoading,        setIsLoading]        = useState(true)
  const [deleteId,         setDeleteId]         = useState<string | null>(null)
  const [expandedId,       setExpandedId]       = useState<string | null>(null)
  const [searchQuery,      setSearchQuery]      = useState('')
  const [filter,           setFilter]           = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => { fetchMessages() }, [])
  useEffect(() => { filterMessages() }, [messages, searchQuery, filter])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setMessages(data || [])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const filterMessages = () => {
    let f = [...messages]
    if (searchQuery) f = f.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()) || m.message.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filter === 'unread') f = f.filter(m => !m.is_read)
    if (filter === 'read')   f = f.filter(m =>  m.is_read)
    setFilteredMessages(f)
  }

  const markRead = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from('contact_messages').update({ is_read: !current }).eq('id', id)
      if (error) throw error
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !current } : m))
    } catch (e) { console.error(e) }
  }

  const handleExpand = async (msg: Message) => {
    if (expandedId === msg.id) { setExpandedId(null); return }
    setExpandedId(msg.id)
    if (!msg.is_read) await markRead(msg.id, false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', deleteId)
      if (error) throw error
      setMessages(messages.filter(m => m.id !== deleteId))
      setDeleteId(null)
    } catch (e) { console.error(e) }
  }

  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (s < 60)     return 'Just now'
    if (s < 3600)   return `${Math.floor(s / 60)}m ago`
    if (s < 86400)  return `${Math.floor(s / 3600)}h ago`
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">{messages.length} total messages</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',  value: messages.length,                     color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10',   icon: Inbox },
          { label: 'Unread', value: messages.filter(m => !m.is_read).length, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', icon: Mail },
          { label: 'Read',   value: messages.filter(m =>  m.is_read).length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: Eye },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-none">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08]"
            />
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] p-0.5 gap-0.5">
            {(['all', 'unread', 'read'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 shadow-sm'
                    : 'text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="space-y-2">
        {filteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-[#0d1526] rounded-xl border border-gray-100 dark:border-white/[0.06] py-16 text-center">
            <Inbox className="w-8 h-8 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-gray-400 dark:text-slate-600">No messages found</p>
          </div>
        ) : (
          filteredMessages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white dark:bg-[#0d1526] rounded-xl border transition-colors ${
                !msg.is_read
                  ? 'border-orange-200 dark:border-orange-500/30'
                  : 'border-gray-100 dark:border-white/[0.06]'
              }`}
            >
              {/* Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] rounded-xl transition-colors"
                onClick={() => handleExpand(msg)}
              >
                {/* Unread dot */}
                <div className="w-2 h-2 rounded-full shrink-0">
                  {!msg.is_read ? (
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-slate-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-3 items-center">
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${!msg.is_read ? 'font-semibold text-gray-900 dark:text-slate-100' : 'font-medium text-gray-700 dark:text-slate-300'}`}>
                      {msg.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{msg.email}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-500 truncate">{msg.message}</p>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-600 shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(msg.created_at)}
                </div>
              </div>

              {/* Expanded */}
              {expandedId === msg.id && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-white/[0.06]">
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg border border-gray-100 dark:border-white/[0.04]">
                    <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-400 dark:text-slate-600">
                      {new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => markRead(msg.id, msg.is_read)}
                        className="h-8 px-3 text-xs border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 gap-1.5">
                        {msg.is_read ? <><EyeOff className="w-3.5 h-3.5" /> Mark unread</> : <><Eye className="w-3.5 h-3.5" /> Mark read</>}
                      </Button>
                      <a href={`mailto:${msg.email}`}>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-gray-200 dark:border-white/[0.08] gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> Reply
                        </Button>
                      </a>
                      <Button variant="outline" size="sm" onClick={() => setDeleteId(msg.id)}
                        className="h-8 px-3 text-xs border-gray-200 dark:border-white/[0.08] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#0e1525] border border-gray-100 dark:border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">Delete message?</AlertDialogTitle>
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