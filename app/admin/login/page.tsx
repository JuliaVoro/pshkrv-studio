'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/projects')
      router.refresh()
    } else {
      setError('Invalid password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-dvh bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="font-mono text-sm tracking-[0.2em] uppercase font-semibold text-fg mb-1">
            PSHKRV
          </p>
          <p className="font-mono text-xs text-muted tracking-wider uppercase">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="password" className="block font-mono text-xs tracking-[0.15em] uppercase text-muted mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded px-4 py-3 bg-bg text-fg focus:outline-none focus:border-fg transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-mono text-xs tracking-[0.15em] uppercase bg-fg text-bg py-3 hover:bg-muted transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
