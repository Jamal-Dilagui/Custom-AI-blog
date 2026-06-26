'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'
import { useApp } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, Mail, ArrowLeft, Shield, Loader2 } from 'lucide-react'

export function AdminLogin({ onSuccess }: { onSuccess: (user: User) => void }) {
  const { closeAdmin } = useApp()
  const [email, setEmail] = useState('admin@christinebritton.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user } = await api.auth.login(email, password)
      toast.success('Welcome back.')
      onSuccess(user)
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-sm p-4">
      <button
        onClick={closeAdmin}
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-background/70 hover:text-background"
      >
        <ArrowLeft className="h-4 w-4" /> Back to site
      </button>
      <div className="w-full max-w-md rounded-3xl bg-background p-8 md:p-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your publication</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="admin@example.com" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
          </Button>
        </form>
        <div className="mt-6 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Demo credentials</p>
          <p>Email: admin@christinebritton.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
