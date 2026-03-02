'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Globe, Building2, GraduationCap, AlertCircle } from 'lucide-react'
import Image from 'next/image'

type Partner = {
  id?: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  type: 'industry' | 'academe'
}

type PartnerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  partner: Partner | null
  onSuccess: () => void
}

export function PartnerDialog({ open, onOpenChange, partner, onSuccess }: PartnerDialogProps) {
  const [isLoading,      setIsLoading]      = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile,      setImageFile]      = useState<File | null>(null)
  const [imagePreview,   setImagePreview]   = useState<string>('')
  const [errorMessage,   setErrorMessage]   = useState<string | null>(null)
  const [formData, setFormData] = useState<Partner>({
    name: '', description: null, website_url: null, image_url: null, type: 'industry',
  })

  useEffect(() => {
    if (partner) {
      setFormData({
        name:        partner.name,
        description: partner.description,
        website_url: partner.website_url,
        image_url:   partner.image_url,
        type:        partner.type || 'industry',
      })
      setImagePreview(partner.image_url || '')
    } else {
      setFormData({ name: '', description: null, website_url: null, image_url: null, type: 'industry' })
      setImagePreview('')
    }
    setImageFile(null)
    setErrorMessage(null)
  }, [partner, open])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrorMessage('Image must be less than 5MB'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    setErrorMessage(null)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('news-images').upload(fileName, file)
    if (error) throw error
    return supabase.storage.from('news-images').getPublicUrl(fileName).data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!formData.name.trim()) { setErrorMessage('Partner name is required'); return }

    setIsLoading(true)
    try {
      let imageUrl = formData.image_url
      if (imageFile) { setUploadingImage(true); imageUrl = await uploadImage(imageFile); setUploadingImage(false) }

      const dataToSave = {
        name:        formData.name.trim(),
        description: formData.description || null,
        website_url: formData.website_url || null,
        image_url:   imageUrl || null,
        type:        formData.type,
      }

      if (partner?.id) {
        const { error } = await supabase.from('partners').update({ ...dataToSave, updated_at: new Date().toISOString() }).eq('id', partner.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('partners').insert([dataToSave])
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save partner')
    } finally {
      setIsLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrorMessage(null)
  }

  const removeImage = () => {
    setImageFile(null); setImagePreview('')
    setFormData({ ...formData, image_url: null })
  }

  const isIndustry = formData.type === 'industry'
  const accent     = isIndustry ? '#3b82f6' : '#a855f7'
  const IconComp   = isIndustry ? Building2 : GraduationCap
  const moduleLabel = isIndustry ? 'Industry' : 'Academe'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden rounded-none bg-white dark:bg-[#0a1020] border border-gray-200 dark:border-white/[0.08]">

        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 border-b border-gray-200 dark:border-white/[0.07]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-sm"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
              <IconComp className="w-4 h-4" style={{ color: accent }} />
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-500">
                Partners_Module // {moduleLabel} // {partner ? 'Edit_Record' : 'New_Record'}
              </p>
              <DialogTitle className="text-base font-bold tracking-tight text-gray-900 dark:text-slate-100 leading-none mt-0.5">
                {partner ? 'Edit Partner' : 'Add Partner'}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-xs text-gray-500 dark:text-slate-500 ml-11">
            {partner ? 'Update the partner record details below.' : 'Fill in the details to register a new partner.'}
          </DialogDescription>
        </DialogHeader>

        {/* ── Error Banner ── */}
        {errorMessage && (
          <div className="mx-7 mt-5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400 font-mono">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-7 py-6 space-y-5 max-h-[calc(100vh-240px)] overflow-y-auto">

            {/* ── Logo + Name / Type ── */}
            <div className="grid grid-cols-2 gap-5">

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-500 dark:text-slate-400">
                  Partner_Logo <span className="text-gray-300 dark:text-slate-600 normal-case tracking-normal font-sans">(optional)</span>
                </Label>
                {imagePreview ? (
                  <div className="relative w-full h-40 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] overflow-hidden group">
                    <Image src={imagePreview} alt="Preview" fill className="object-contain p-3" />
                    <button type="button" onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed cursor-pointer transition-colors
                    border-gray-200 dark:border-white/[0.08]
                    bg-gray-50 dark:bg-white/[0.02]
                    hover:bg-orange-50 dark:hover:bg-orange-500/[0.04]
                    hover:border-orange-300 dark:hover:border-orange-500/40">
                    <Upload className="w-5 h-5 text-gray-400 dark:text-slate-500 mb-2" />
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600 text-center">
                      Click_to_Upload<br />
                      <span className="normal-case tracking-normal font-sans text-[11px]">PNG, JPG · max 5MB</span>
                    </p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={isLoading} />
                  </label>
                )}
              </div>

              {/* Name + Type */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-500 dark:text-slate-400">
                    Partner_Name *
                  </Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange}
                    required placeholder="e.g., Acme Corporation" disabled={isLoading}
                    className="h-10 text-sm rounded-none border-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 focus:ring-orange-400/40 focus:border-orange-400 dark:focus:border-orange-500/60 font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-500 dark:text-slate-400">
                    Partner_Type *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v: 'industry' | 'academe') => setFormData({ ...formData, type: v })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-10 text-sm rounded-none border-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 font-mono">
                      <SelectValue placeholder="Select_Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none dark:bg-slate-900 dark:border-white/10">
                      <SelectItem value="industry">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          Industry_Partner
                        </div>
                      </SelectItem>
                      <SelectItem value="academe">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                          Academe_Partner
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ── Website URL ── */}
            <div className="space-y-2">
              <Label htmlFor="website_url" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-500 dark:text-slate-400">
                Web_Link
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-3.5 h-3.5" />
                <Input id="website_url" name="website_url" type="url"
                  value={formData.website_url || ''} onChange={handleChange}
                  placeholder="https://example.com" disabled={isLoading}
                  className="pl-9 h-10 text-sm rounded-none border-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 focus:ring-orange-400/40 focus:border-orange-400 dark:focus:border-orange-500/60 font-mono" />
              </div>
            </div>

            {/* ── Description ── */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-500 dark:text-slate-400">
                Description
              </Label>
              <Textarea id="description" name="description"
                value={formData.description || ''} onChange={handleChange}
                placeholder="Brief description of the partner..." rows={3} disabled={isLoading}
                className="text-sm resize-none rounded-none border-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 focus:ring-orange-400/40 focus:border-orange-400 dark:focus:border-orange-500/60" />
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="flex justify-between items-center px-7 py-5 border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.02]">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}
              className="rounded-none font-mono text-[10px] uppercase tracking-widest border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 h-9 px-5">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || uploadingImage}
              className="rounded-none font-mono text-[10px] uppercase tracking-widest h-9 px-6 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400 text-white border border-orange-500/50 shadow-none transition-all hover:-translate-y-0.5">
              {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : partner ? 'Update Record' : 'Register_Partner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}