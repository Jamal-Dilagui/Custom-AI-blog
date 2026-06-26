'use client'

import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import type { Media } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Trash2, Copy, Loader2, ImageIcon, Check } from 'lucide-react'
import { toast } from 'sonner'
import { relativeTime } from '@/lib/helpers'

export function MediaManager() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const { media } = await api.media.list()
    setMedia(media)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const upload = async (files: FileList) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await api.media.upload(file)
      }
      toast.success(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''}.`)
      load()
    } catch { toast.error('Upload failed.') } finally { setUploading(false) }
  }

  const remove = async (id: string, url: string) => {
    try {
      await api.media.remove(id)
      setMedia((m) => m.filter((x) => x.id !== id))
      toast.success('Image removed.')
    } catch { toast.error('Could not remove.') }
  }

  const copy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{media.length} images in library</p>
        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
          Upload images
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = '' }} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5') }}
        onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary', 'bg-primary/5') }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); if (e.dataTransfer.files) upload(e.dataTransfer.files) }}
        className="rounded-xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground"
      >
        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
        Drag and drop images here, or click “Upload images”
      </div>

      {loading ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />)}</div>
      ) : media.length === 0 ? (
        <div className="py-16 text-center">
          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-medium">No images yet</p>
          <p className="text-sm text-muted-foreground">Upload your first image to use in articles.</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {media.map((m) => (
            <div key={m.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <img src={m.url} alt={m.alt || ''} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => copy(m.url)}>
                  {copied === m.url ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 text-destructive" onClick={() => remove(m.id, m.url)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white/90 font-mono truncate">{m.url}</p>
                <p className="text-[10px] text-white/50">{relativeTime(m.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
