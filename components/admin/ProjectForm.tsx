'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'
import BlocksEditor from './BlocksEditor'
import type { Project, ProjectBlock } from '@/types'

const CATEGORIES = ['Brand Identity', 'Art Direction', 'Digital', 'Print'] as const

interface ProjectFormProps {
  initial?: Partial<Project>
  isEdit?: boolean
}

export default function ProjectForm({ initial, isEdit }: ProjectFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category: 'Brand Identity',
    year: new Date().getFullYear(),
    client: '',
    tagline: '',
    description: '',
    role: '',
    duration: '',
    tags: [],
    coverImage: '',
    previewImage: '',
    coverColor: '#E4E4E7',
    images: [],
    featured: false,
    order: 99,
    blocks: [],
    ...initial,
  })

  const set = (key: keyof Project, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const url = isEdit ? `/api/projects/${initial!.id}` : '/api/projects'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/projects')
      router.refresh()
    } else {
      setError('Failed to save project')
    }
    setSaving(false)
  }

  const ic = 'w-full border border-border rounded px-3 py-2 text-sm bg-bg text-fg focus:outline-none focus:border-fg transition-colors'
  const lc = 'block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Basic Info ─────────────────────────── */}
      <section className="space-y-6">
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-muted border-b border-border pb-3">
          Basic Info
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={lc} htmlFor="title">Title *</label>
            <input
              id="title"
              className={ic}
              value={form.title}
              onChange={(e) => {
                set('title', e.target.value)
                if (!isEdit) set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
              }}
              required
            />
          </div>
          <div>
            <label className={lc} htmlFor="slug">Slug *</label>
            <input id="slug" className={ic} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className={lc} htmlFor="tagline">Tagline (shown on card hover)</label>
          <input id="tagline" className={ic} value={form.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Short one-liner for the work grid" />
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className={lc} htmlFor="category">Category *</label>
            <select id="category" className={ic} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={lc} htmlFor="year">Year *</label>
            <input id="year" type="number" className={ic} value={form.year} onChange={(e) => set('year', parseInt(e.target.value))} min={2000} max={2099} required />
          </div>
          <div>
            <label className={lc} htmlFor="order">Order</label>
            <input id="order" type="number" className={ic} value={form.order} onChange={(e) => set('order', parseInt(e.target.value))} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={lc} htmlFor="client">Client</label>
            <input id="client" className={ic} value={form.client} onChange={(e) => set('client', e.target.value)} />
          </div>
          <div>
            <label className={lc} htmlFor="role">Role / Disciplines</label>
            <input id="role" className={ic} value={form.role ?? ''} onChange={(e) => set('role', e.target.value)} placeholder="Brand Identity, Typography, Art Direction" />
          </div>
        </div>

        <div>
          <label className={lc} htmlFor="duration">Duration</label>
          <input id="duration" className={ic} value={form.duration ?? ''} onChange={(e) => set('duration', e.target.value)} placeholder="3 months — 2024" />
        </div>

        <div>
          <label className={lc} htmlFor="description">Overview / Description</label>
          <textarea id="description" className={ic} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div>
          <label className={lc} htmlFor="tags">Tags (comma separated)</label>
          <input
            id="tags"
            className={ic}
            value={form.tags?.join(', ')}
            onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
            placeholder="Brand Identity, Typography, Visual System"
          />
        </div>
      </section>

      {/* ── Cover ─────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-muted border-b border-border pb-3">
          Cover
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 items-start">
          <ImageUploader
            value={form.coverImage ?? ''}
            onChange={(path) => set('coverImage', path)}
            label="Cover Photo — project page hero"
          />
          <ImageUploader
            value={form.previewImage ?? ''}
            onChange={(path) => set('previewImage', path)}
            label="Preview Photo/Video — home page card (falls back to cover)"
            acceptVideo
          />
          <div className="space-y-3">
            <div>
              <label className={lc}>Cover Colour (used as background / placeholder)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.coverColor ?? '#E4E4E7'}
                  onChange={(e) => set('coverColor', e.target.value)}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <input
                  className={`${ic} flex-1`}
                  value={form.coverColor ?? ''}
                  onChange={(e) => set('coverColor', e.target.value)}
                  placeholder="#E4E4E7"
                />
              </div>
            </div>
            {/* Preview swatch */}
            <div
              className="w-full h-20 rounded border border-border"
              style={{ backgroundColor: form.coverColor ?? '#E4E4E7' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-fg" />
          <label htmlFor="featured" className="text-sm text-muted">Show in featured work grid</label>
        </div>
      </section>

      {/* ── Content Blocks ────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-muted border-b border-border pb-3">
          Content Blocks
        </h2>
        <p className="text-xs text-muted">Build the project page by stacking blocks. Use ↑↓ to reorder.</p>
        <BlocksEditor
          blocks={form.blocks ?? []}
          onChange={(blocks: ProjectBlock[]) => set('blocks', blocks)}
        />
      </section>

      {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}

      {/* ── Actions ───────────────────────────── */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          type="submit"
          disabled={saving}
          className="font-mono text-xs tracking-[0.15em] uppercase bg-fg text-bg px-6 py-3 hover:bg-muted transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="font-mono text-xs tracking-[0.15em] uppercase text-muted hover:text-fg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
