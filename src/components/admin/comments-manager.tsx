'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Comment } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, Trash2, Mail, MessageSquare, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { relativeTime } from '@/lib/helpers'
import { useApp } from '@/store/app-store'

type C = Comment & { post: { id: string; title: string; slug: string } }

export function CommentsManager() {
  const { openPost } = useApp()
  const [comments, setComments] = useState<C[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const load = async () => {
    const { comments } = await api.comments.list(filter)
    setComments(comments)
    setLoading(false)
  }
  useEffect(() => {
    let active = true
    api.comments.list(filter).then(({ comments }) => {
      if (active) { setComments(comments); setLoading(false) }
    })
    return () => { active = false }
  }, [filter])

  const setStatus = async (id: string, status: string) => {
    try {
      await api.comments.update(id, { status })
      setComments((c) => c.map((x) => x.id === id ? { ...x, status } : x).filter((x) => filter === 'ALL' || x.status === filter))
      toast.success(status === 'APPROVED' ? 'Comment approved.' : 'Comment marked as spam.')
    } catch { toast.error('Update failed.') }
  }

  const remove = async (id: string) => {
    try {
      await api.comments.remove(id)
      setComments((c) => c.filter((x) => x.id !== id))
      toast.success('Comment deleted.')
    } catch { toast.error('Could not delete.') }
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{comments.length} comments</p>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="SPAM">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
      ) : comments.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-medium">No comments here</p>
          <p className="text-sm text-muted-foreground">Reader comments will appear in this list.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
                  {c.author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm">{c.author}</span>
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                    <span className="text-xs text-muted-foreground">· {relativeTime(c.createdAt)}</span>
                    <Badge variant={c.status === 'APPROVED' ? 'default' : c.status === 'SPAM' ? 'destructive' : 'secondary'} className={c.status === 'APPROVED' ? 'bg-emerald-600 text-white' : ''}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.content}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">On:</span>
                    <button onClick={() => openPost(c.post.slug)} className="text-xs font-medium text-primary hover:underline truncate">{c.post.title}</button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {c.status !== 'APPROVED' && (
                      <Button size="sm" variant="outline" onClick={() => setStatus(c.id, 'APPROVED')}>
                        <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
                      </Button>
                    )}
                    {c.status !== 'SPAM' && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(c.id, 'SPAM')}>Mark spam</Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(c.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
