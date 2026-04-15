'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import type { Service } from '@/types'

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/services').then((r) => r.json()).then(setServices)
  }, [])

  const update = (id: string, field: keyof Service, value: unknown) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(services),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass =
    'w-full border border-border rounded px-3 py-2 text-sm bg-bg text-fg focus:outline-none focus:border-fg transition-colors'

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Services</h1>
        <button
          onClick={save}
          disabled={saving}
          className="font-mono text-xs tracking-[0.15em] uppercase bg-fg text-bg px-5 py-2.5 hover:bg-muted transition-colors disabled:opacity-50"
        >
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {services.map((service) => (
          <div key={service.id} className="border border-border rounded p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-1.5">Title</label>
                <input
                  className={inputClass}
                  value={service.title}
                  onChange={(e) => update(service.id, 'title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-1.5">Order</label>
                <input
                  type="number"
                  className={inputClass}
                  value={service.order}
                  onChange={(e) => update(service.id, 'order', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-1.5">Description</label>
              <textarea
                className={inputClass}
                rows={2}
                value={service.description}
                onChange={(e) => update(service.id, 'description', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-1.5">
                Deliverables (one per line)
              </label>
              <textarea
                className={inputClass}
                rows={4}
                value={service.deliverables.join('\n')}
                onChange={(e) =>
                  update(service.id, 'deliverables', e.target.value.split('\n').filter(Boolean))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
