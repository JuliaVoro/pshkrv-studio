'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import type { StudioInfo } from '@/types'

type Style = 'classic' | 'animated'

// ─── Reusable option card ───────────────────────────────────────────────────

interface Option {
  id: Style
  label: string
  description: string
  features: string[]
  preview: React.ReactNode
}

function OptionCard({
  opt,
  isActive,
  disabled,
  onSelect,
}: {
  opt: Option
  isActive: boolean
  disabled: boolean
  onSelect: (id: Style) => void
}) {
  return (
    <button
      onClick={() => onSelect(opt.id)}
      disabled={disabled}
      className={`text-left rounded border p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isActive
          ? 'border-fg bg-fg/[0.03] ring-1 ring-fg'
          : 'border-border hover:border-fg/40 hover:bg-border/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="mb-4">{opt.preview}</div>

      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm text-fg">{opt.label}</span>
        {isActive && (
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-fg text-bg px-2 py-0.5 rounded-sm">
            Active
          </span>
        )}
      </div>

      <p className="text-xs text-muted mb-3">{opt.description}</p>

      <ul className="space-y-1">
        {opt.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-muted">
            <span className="text-accent mt-px shrink-0">—</span>
            {f}
          </li>
        ))}
      </ul>
    </button>
  )
}

// ─── Header options ─────────────────────────────────────────────────────────

const HEADER_OPTIONS: Option[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Clean, minimal navbar with scroll-aware background.',
    features: ['Backdrop blur on scroll', 'Mobile hamburger menu', 'Smooth color transitions'],
    preview: (
      <div className="w-full h-14 bg-bg border border-border flex items-center px-4 justify-between rounded">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold text-fg">
          PSHKRV
        </span>
        <div className="flex gap-4">
          {['Work', 'Studio', 'Contact'].map((l) => (
            <span key={l} className="font-mono text-[9px] tracking-[0.15em] uppercase text-muted">
              {l}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'animated',
    label: 'Animated',
    description: 'Immersive header with micro-interactions and entrance effects.',
    features: [
      'Gold scroll-progress bar',
      'Logo character scramble on hover',
      'Text-flip nav links on hover',
      'Dark inversion when scrolled',
      'Full-screen mobile overlay with numbered links',
      'Staggered entrance on page load',
    ],
    preview: (
      <div className="w-full rounded overflow-hidden">
        <div className="h-[2px] bg-accent w-2/5" />
        <div className="h-12 bg-bg border border-border flex items-center px-4 justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold text-fg">
            PSHKRV
          </span>
          <div className="flex gap-4">
            {['Work', 'Studio', 'Contact'].map((l) => (
              <span key={l} className="font-mono text-[9px] tracking-[0.15em] uppercase text-fg">
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="h-9 bg-fg flex items-center px-4 justify-between mt-px">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold text-bg">
            PSHKRV
          </span>
          <div className="flex gap-4">
            {['Work', 'Studio', 'Contact'].map((l) => (
              <span key={l} className="font-mono text-[9px] tracking-[0.15em] uppercase text-bg/60">
                {l}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[9px] font-mono text-muted text-right pr-1 pt-0.5">↑ scrolled state</p>
      </div>
    ),
  },
]

// ─── Hero options ────────────────────────────────────────────────────────────

const HERO_OPTIONS: Option[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Light background with editorial grid lines and smooth reveal.',
    features: [
      'Off-white background',
      'Vertical grid lines overlay',
      'Line-by-line text reveal',
      'Location tag + CTA button',
    ],
    preview: (
      <div className="w-full h-24 bg-bg border border-border rounded overflow-hidden relative flex flex-col justify-end p-3">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #E4E4E7 1px, transparent 1px)',
            backgroundSize: '25% 100%',
          }}
        />
        <div className="relative">
          <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted mb-1">
            Milan — IT · Est. 2019
          </p>
          <p className="font-display font-bold text-fg leading-none" style={{ fontSize: '1.35rem' }}>
            ART DIRECTION
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'animated',
    label: 'Animated',
    description: 'Dark cinematic hero with cursor-reactive glow and character-by-character entrance.',
    features: [
      'Near-black bg with noise grain texture',
      'Per-character staggered entrance',
      'Mouse-parallax depth on title',
      'Cursor-tracking warm gold glow',
      'Scroll parallax + fade-out',
      'Animated gold line sweep on load',
      'Vertical studio ticker (desktop)',
      'CTA with slide-fill hover effect',
    ],
    preview: (
      <div className="w-full h-24 bg-fg rounded overflow-hidden relative flex flex-col justify-end p-3">
        {/* Noise grain approximation */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4=')]" />
        {/* Gold glow hint */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-16 rounded-full bg-accent opacity-[0.07] blur-xl pointer-events-none" />
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-accent" />
        <div className="relative">
          <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-dark-muted mb-1">
            Milan — IT · Est. 2019
          </p>
          <p
            className="font-display font-bold text-dark-fg leading-none"
            style={{ fontSize: '1.35rem' }}
          >
            ART DIRECTION
          </p>
        </div>
      </div>
    ),
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [headerStyle, setHeaderStyle] = useState<Style>('classic')
  const [heroStyle, setHeroStyle] = useState<Style>('classic')
  const [saving, setSaving] = useState(false)
  const [savedField, setSavedField] = useState<'header' | 'hero' | null>(null)

  useEffect(() => {
    fetch('/api/studio')
      .then((r) => r.json())
      .then((data: StudioInfo) => {
        if (data.headerStyle) setHeaderStyle(data.headerStyle)
        if (data.heroStyle) setHeroStyle(data.heroStyle)
      })
      .catch(() => {})
  }, [])

  const save = async (field: 'header' | 'hero', value: Style) => {
    setSaving(true)
    setSavedField(null)
    try {
      const res = await fetch('/api/studio')
      const data: StudioInfo = await res.json()
      const patch = field === 'header' ? { headerStyle: value } : { heroStyle: value }
      await fetch('/api/studio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...patch }),
      })
      if (field === 'header') setHeaderStyle(value)
      else setHeroStyle(value)
      setSavedField(field)
      setTimeout(() => setSavedField(null), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-fg">Settings</h1>
        <p className="text-sm text-muted mt-1">Configure site-wide appearance options.</p>
      </div>

      {/* ── Header Style ──────────────────────────────── */}
      <section className="mb-12">
        <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-muted mb-4">
          Header Style
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HEADER_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              opt={opt}
              isActive={headerStyle === opt.id}
              disabled={saving}
              onSelect={(id) => save('header', id)}
            />
          ))}
        </div>
        {savedField === 'header' && (
          <p className="mt-3 text-xs text-accent font-mono tracking-wider">✓ Header style saved</p>
        )}
      </section>

      <div className="border-t border-border mb-12" />

      {/* ── Hero Style ────────────────────────────────── */}
      <section>
        <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-muted mb-4">
          Hero Style
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HERO_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              opt={opt}
              isActive={heroStyle === opt.id}
              disabled={saving}
              onSelect={(id) => save('hero', id)}
            />
          ))}
        </div>
        {savedField === 'hero' && (
          <p className="mt-3 text-xs text-accent font-mono tracking-wider">✓ Hero style saved</p>
        )}
      </section>
    </AdminLayout>
  )
}
