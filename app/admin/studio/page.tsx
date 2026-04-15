'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import type { StudioInfo } from '@/types'

const emptyStudio: StudioInfo = {
  tagline: '',
  about: [],
  approach: [],
  expertise: [],
  clients: [],
  collaborators: [],
  email: '',
  instagram: '',
  linkedin: '',
}

export default function AdminStudioPage() {
  const [studio, setStudio] = useState<StudioInfo>(emptyStudio)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/studio').then((r) => r.json()).then(setStudio)
  }, [])

  const set = <K extends keyof StudioInfo>(key: K, value: StudioInfo[K]) =>
    setStudio((prev) => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/studio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studio),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass =
    'w-full border border-border rounded px-3 py-2 text-sm bg-bg text-fg focus:outline-none focus:border-fg transition-colors'
  const labelClass =
    'block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-1.5'

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Studio Info</h1>
        <button
          onClick={save}
          disabled={saving}
          className="font-mono text-xs tracking-[0.15em] uppercase bg-fg text-bg px-5 py-2.5 hover:bg-muted transition-colors disabled:opacity-50"
        >
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className={labelClass}>Tagline</label>
          <input className={inputClass} value={studio.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>About Paragraphs (one per line)</label>
          <textarea
            className={inputClass}
            rows={5}
            value={studio.about.join('\n\n')}
            onChange={(e) =>
              set('about', e.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean))
            }
          />
        </div>

        <div>
          <label className={labelClass}>Approach Principles (title|body, one per line)</label>
          <textarea
            className={inputClass}
            rows={6}
            value={studio.approach.map((a) => `${a.title}|${a.body}`).join('\n')}
            onChange={(e) =>
              set(
                'approach',
                e.target.value
                  .split('\n')
                  .filter(Boolean)
                  .map((line) => {
                    const [title, ...rest] = line.split('|')
                    return { title: title.trim(), body: rest.join('|').trim() }
                  })
              )
            }
          />
          <p className="text-xs text-muted mt-1">Format: <code>Title|Body text</code></p>
        </div>

        <div>
          <label className={labelClass}>Expertise Tags (one per line)</label>
          <textarea
            className={inputClass}
            rows={5}
            value={studio.expertise.join('\n')}
            onChange={(e) => set('expertise', e.target.value.split('\n').map((t) => t.trim()).filter(Boolean))}
          />
        </div>

        <div>
          <label className={labelClass}>Clients (one per line)</label>
          <textarea
            className={inputClass}
            rows={4}
            value={studio.clients.join('\n')}
            onChange={(e) => set('clients', e.target.value.split('\n').map((c) => c.trim()).filter(Boolean))}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input id="email" type="email" className={inputClass} value={studio.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="instagram">Instagram handle</label>
            <input id="instagram" className={inputClass} value={studio.instagram} onChange={(e) => set('instagram', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="linkedin">LinkedIn slug</label>
            <input id="linkedin" className={inputClass} value={studio.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
