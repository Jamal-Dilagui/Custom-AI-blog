'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, X, FolderTree } from 'lucide-react'
import { toast } from 'sonner'
import { CategoryIcon } from '@/lib/category-icons'
import { slugify } from '@/lib/helpers'

const ICON_OPTIONS = ['Heart', 'Home', 'Plane', 'UtensilsCrossed', 'BookOpen', 'Sparkles', 'Camera', 'Music', 'Palette', 'Dumbbell', 'Leaf', 'Globe', 'Coffee', 'Feather', 'Mountain', 'Sun']
const COLOR_OPTIONS = ['#b45309', '#9a3412', '#a16207', '#854d0e', '#713f12', '#831843', '#7c5c3e', '#6b7280']

export function CategoriesManager() {
  const [categories, setCategories] = useState<(Category & { _count?: { posts: number } })[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    const { categories } = await api.categories.list()
    setCategories(categories)
    setLoading(false)
  }
  useEffect(() => {
    let active = true
    api.categories.list().then(({ categories }) => {
      if (active) { setCategories(categories); setLoading(false) }
    })
    return () => { active = false }
  }, [])

  const remove = async (id: string) => {
    try {
      await api.categories.remove(id)
      setCategories((c) => c.filter((x) => x.id !== id))
      toast.success('Category deleted.')
    } catch (e: any) { toast.error(e.message) }
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        <Button onClick={() => { setCreating(true); setEditing(null) }}><Plus className="h-4 w-4 mr-1.5" /> New category</Button>
      </div>

      {(creating || editing) && (
        <CategoryForm
          category={editing}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={() => { setCreating(false); setEditing(null); load() }}
        />
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            return (
              <Card key={c.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${c.color}1a`, color: c.color || '#b45309' }}>
                      <CategoryIcon name={c.icon} className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(c); setCreating(false) }}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">/{c.slug}</span>
                    <span>•</span>
                    <span>{c._count?.posts || 0} posts</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {categories.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <FolderTree className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">No categories yet</p>
              <p className="text-sm text-muted-foreground">Create your first category to organise articles.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategoryForm({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [description, setDescription] = useState(category?.description || '')
  const [color, setColor] = useState(category?.color || COLOR_OPTIONS[0])
  const [icon, setIcon] = useState(category?.icon || 'Feather')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const data = { name, slug: slug || slugify(name), description, color, icon }
      if (category) await api.categories.update(category.id, data)
      else await api.categories.create(data)
      toast.success(category ? 'Category updated.' : 'Category created.')
      onSaved()
    } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
  }

  return (
    <Card className="border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{category ? 'Edit category' : 'New category'}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input value={name} onChange={(e) => { setName(e.target.value); if (!category) setSlug(slugify(e.target.value)) }} placeholder="Wellness" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="wellness" className="font-mono text-sm" />
          </div>
        </div>
        <div className="mt-3">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea value={description || ''} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="What this category is about" />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((i) => { return <SelectItem key={i} value={i}><span className="inline-flex items-center gap-2"><CategoryIcon name={i} className="h-4 w-4" /> {i}</span></SelectItem> })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {COLOR_OPTIONS.map((c) => (
                <button key={c} onClick={() => setColor(c)} className="h-7 w-7 rounded-full border-2 transition-transform" style={{ backgroundColor: c, borderColor: color === c ? 'white' : 'transparent', boxShadow: color === c ? `0 0 0 2px ${c}` : 'none' }} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save category'}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
