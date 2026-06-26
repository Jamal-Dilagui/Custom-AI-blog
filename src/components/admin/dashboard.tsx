'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useApp } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Heart, MessageSquare, Users, FolderTree, Inbox, PenSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { formatShortDate, relativeTime } from '@/lib/helpers'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

type Stats = Awaited<ReturnType<typeof api.stats.get>>

export function Dashboard() {
  const { setAdminView, editPost, openPost } = useApp()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.stats.get().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />)}</div>
  }

  const { totals, topPosts, categoriesWithCounts, recentPosts } = stats

  const cards = [
    { label: 'Total articles', value: totals.posts, sub: `${totals.published} published · ${totals.drafts} drafts`, icon: FileText, color: 'text-amber-700' },
    { label: 'Total views', value: totals.views.toLocaleString(), sub: 'across all articles', icon: Eye, color: 'text-orange-700' },
    { label: 'Total likes', value: totals.likes.toLocaleString(), sub: 'reader engagement', icon: Heart, color: 'text-rose-700' },
    { label: 'Comments', value: totals.comments, sub: `${totals.pendingComments} pending review`, icon: MessageSquare, color: 'text-emerald-700' },
  ]

  const chartData = categoriesWithCounts.map((c) => ({ name: c.name, count: c.count }))
  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Welcome back 👋</h2>
          <p className="text-sm text-muted-foreground">Here is what is happening across your journal today.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => editPost(null)}><PenSquare className="h-4 w-4 mr-1.5" /> Write article</Button>
          <Button variant="outline" onClick={() => setAdminView('comments')}>
            <Inbox className="h-4 w-4 mr-1.5" /> {totals.pendingComments} pending
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{c.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + quick stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FolderTree className="h-4 w-4 text-primary" /> Articles per category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#b45309">
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={['#b45309', '#9a3412', '#a16207', '#854d0e', '#713f12', '#831843'][i % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-xs text-muted-foreground">Subscribers</p>
                <p className="font-display text-2xl font-semibold">{totals.subscribers}</p>
              </div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="font-display text-2xl font-semibold">{totals.categories}</p>
              </div>
              <FolderTree className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-xs text-muted-foreground">Pending comments</p>
                <p className="font-display text-2xl font-semibold">{totals.pendingComments}</p>
              </div>
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top posts + recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Most read</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setAdminView('posts')}>All <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPosts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => openPost(p.slug)}
                className="group flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-accent/50"
              >
                <span className="font-display text-lg font-semibold text-muted-foreground/40 w-6">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.category.name}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentPosts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/50">
                <div className={`h-2 w-2 rounded-full ${p.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <button onClick={() => editPost(p.id)} className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium truncate hover:text-primary">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.category.name} · {relativeTime(p.createdAt)}</p>
                </button>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
