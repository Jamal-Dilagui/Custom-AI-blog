'use client'

import { useEffect, useState, useRef } from 'react'
import { api } from '@/lib/api'
import type { Post, Category, Media } from '@/lib/types'
import { useApp } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Markdown } from '@/components/site/markdown'
import { ArrowLeft, Save, Eye, Upload, Link2, ImageIcon, Loader2, Sparkles, Send } from 'lucide-react'
import { toast } from 'sonner'
import { slugify, excerptFromContent, estimateReadTime } from '@/lib/helpers'

interface EditorState {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverAlt: string
  categoryId: string
  tags: string
  status: string
  featured: boolean
  trending: boolean
  showAds: boolean
  metaTitle: string
  metaDescription: string
  publishedAt: string
}

export function PostEditor({ postId }: { postId: string | null }) {
  const { setAdminView, openPost } = useApp()
  const [categories, setCategories] = useState<Category[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!!postId)
  const [showMedia, setShowMedia] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<EditorState>({
    title: '', slug: '', excerpt: '', content: '', coverImage: '', coverAlt: '',
    categoryId: '', tags: '', status: 'DRAFT', featured: false, trending: false,
    showAds: true, metaTitle: '', metaDescription: '', publishedAt: '',
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const slugTouched = useRef(false)

  useEffect(() => {
    api.categories.list().then(({ categories }) => {
      setCategories(categories)
      if (!postId && categories[0]) setForm((f) => ({ ...f, categoryId: categories[0].id }))
    })
    api.media.list().then(({ media }) => setMedia(media))
  }, [postId])

  useEffect(() => {
    if (!postId) { setLoading(false); return }
    setLoading(true)
    api.posts.get(postId).then(({ post }) => {
      setForm({
        title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content,
        coverImage: post.coverImage || '', coverAlt: post.coverAlt || '', categoryId: post.categoryId,
        tags: post.tags || '', status: post.status, featured: post.featured, trending: post.trending,
        showAds: post.showAds, metaTitle: post.metaTitle || '', metaDescription: post.metaDescription || '',
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
      })
    }).finally(() => setLoading(false))
  }, [postId])

  const update = (patch: Partial<EditorState>) => setForm((f) => ({ ...f, ...patch }))

  const onTitleChange = (title: string) => {
    update({ title })
    if (!slugTouched.current) update({ title, slug: slugify(title) })
    else update({ title })
  }

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const { url } = await api.media.upload(file)
      setMedia((m) => [{ id: url, url, type: 'image', createdAt: new Date().toISOString() }, ...m])
      update({ coverImage: url })
      toast.success('Image uploaded.')
    } catch { toast.error('Upload failed.') } finally { setUploading(false) }
  }

  const save = async (publish = false) => {
    if (!form.title.trim()) { toast.error('Title is required.'); return }
    if (!form.categoryId) { toast.error('Please choose a category.'); return }
    if (!form.content.trim()) { toast.error('Content cannot be empty.'); return }
    setSaving(true)
    const data: any = {
      title: form.title, slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || excerptFromContent(form.content),
      content: form.content, coverImage: form.coverImage || null, coverAlt: form.coverAlt,
      categoryId: form.categoryId, tags: form.tags, status: publish ? 'PUBLISHED' : form.status,
      featured: form.featured, trending: form.trending, showAds: form.showAds,
      metaTitle: form.metaTitle || null, metaDescription: form.metaDescription || null,
      publishedAt: form.publishedAt || null,
    }
    try {
      let saved: Post
      if (postId) {
        const { post } = await api.posts.update(postId, data)
        saved = post
      } else {
        const { post } = await api.posts.create(data)
        saved = post
      }
      toast.success(publish ? 'Published!' : 'Saved.')
      setAdminView('posts')
      if (publish) openPost(saved.slug)
    } catch (e: any) {
      toast.error(e.message || 'Save failed.')
    } finally { setSaving(false) }
  }

  if (loading) {
    return <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" size="sm" onClick={() => setAdminView('posts')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to articles
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>
            <Save className="h-4 w-4 mr-1.5" /> {saving ? 'Saving…' : 'Save draft'}
          </Button>
          <Button onClick={() => save(true)} disabled={saving}>
            <Send className="h-4 w-4 mr-1.5" /> {form.status === 'PUBLISHED' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main */}
        <div className="lg:col-span-8 space-y-5">
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="An honest, specific headline"
              className="text-2xl font-display font-semibold h-14 border-0 px-0 focus-visible:ring-0 bg-transparent"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => { slugTouched.current = true; update({ slug: slugify(e.target.value) }) }}
              placeholder="/the-article-slug"
              className="font-mono text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => update({ excerpt: e.target.value })}
              placeholder="A one or two sentence summary shown in cards and previews. Leave blank to auto-generate."
              rows={2}
            />
          </div>

          {/* Cover image */}
          <div>
            <Label className="text-xs text-muted-foreground">Cover image</Label>
            <div className="mt-1 flex flex-col sm:flex-row gap-3">
              <div className="relative h-32 w-full sm:w-48 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {form.coverImage ? (
                  <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground/40"><ImageIcon className="h-6 w-6" /></div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
                    Upload
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowMedia(!showMedia)}>
                    <ImageIcon className="h-4 w-4 mr-1.5" /> Library
                  </Button>
                  {form.coverImage && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => update({ coverImage: '' })}>Remove</Button>
                  )}
                </div>
                <Input
                  value={form.coverImage}
                  onChange={(e) => update({ coverImage: e.target.value })}
                  placeholder="or paste image URL"
                  className="text-sm font-mono"
                />
                <Input
                  value={form.coverAlt}
                  onChange={(e) => update({ coverAlt: e.target.value })}
                  placeholder="alt text (for accessibility & SEO)"
                  className="text-sm"
                />
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} />
              </div>
            </div>
            {showMedia && (
              <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2 rounded-lg border border-border p-2 max-h-48 overflow-y-auto scroll-lumen bg-muted/30">
                {media.length === 0 ? (
                  <p className="col-span-full text-center text-xs text-muted-foreground py-4">No images yet. Upload one above.</p>
                ) : media.map((m) => (
                  <button key={m.id} onClick={() => { update({ coverImage: m.url }); setShowMedia(false) }} className="aspect-square overflow-hidden rounded-md border border-border hover:ring-2 ring-primary">
                    <img src={m.url} alt={m.alt || ''} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Content (Markdown)</Label>
              <span className="text-xs text-muted-foreground">{estimateReadTime(form.content)} min read · {form.content.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write"><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Write</TabsTrigger>
                <TabsTrigger value="preview"><Eye className="h-3.5 w-3.5 mr-1.5" /> Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  value={form.content}
                  onChange={(e) => update({ content: e.target.value })}
                  placeholder={'## Write your story in Markdown\n\nUse **bold**, *italic*, > quotes, - lists, and ### subheadings.\n\nSeparate paragraphs with blank lines.'}
                  className="font-mono text-sm min-h-[420px] resize-y"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-[420px] rounded-lg border border-border bg-card p-6">
                  {form.content ? <Markdown content={form.content} /> : <p className="text-muted-foreground text-sm">Nothing to preview yet.</p>}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs text-muted-foreground">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => update({ tags: e.target.value })} placeholder="slow living, morning ritual, books" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Publish */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-medium mb-4">Publish</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={form.status} onValueChange={(v) => update({ status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Publish date</Label>
                <Input type="datetime-local" value={form.publishedAt} onChange={(e) => update({ publishedAt: e.target.value })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Featured</Label>
                <Switch checked={form.featured} onCheckedChange={(v) => update({ featured: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Trending</Label>
                <Switch checked={form.trending} onCheckedChange={(v) => update({ trending: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show ads</Label>
                <Switch checked={form.showAds} onCheckedChange={(v) => update({ showAds: v })} />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-medium mb-4">Category</h3>
            <Select value={form.categoryId} onValueChange={(v) => update({ categoryId: v })}>
              <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-medium mb-4">SEO</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Meta title</Label>
                <Input value={form.metaTitle} onChange={(e) => update({ metaTitle: e.target.value })} placeholder={form.title || 'Page title'} className="text-sm" />
                <p className="text-[10px] text-muted-foreground mt-1">{form.metaTitle.length}/60 characters</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Meta description</Label>
                <Textarea value={form.metaDescription} onChange={(e) => update({ metaDescription: e.target.value })} placeholder={form.excerpt || 'Page description for search engines'} rows={3} className="text-sm" />
                <p className="text-[10px] text-muted-foreground mt-1">{form.metaDescription.length}/160 characters</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
