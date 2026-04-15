'use client'

import { useState, useRef } from 'react'
import ImageUploader from './ImageUploader'
import type { ProjectBlock, ProjectImage, ColorSwatch, ProjectBlockType } from '@/types'

const BLOCK_TYPES: { value: ProjectBlockType; label: string }[] = [
  { value: 'color-full',  label: 'Color Fill'     },
  { value: 'text',        label: 'Text Block'      },
  { value: 'image-full',  label: 'Image — Full'   },
  { value: 'image-2col',  label: 'Image — 2 Col'  },
  { value: 'image-3col',  label: 'Image — 3 Col'  },
  { value: 'palette',     label: 'Colour Palette'  },
  { value: 'quote',       label: 'Quote'           },
  { value: 'video',       label: 'Video'           },
]

const BLOCK_DEFAULTS: Record<ProjectBlockType, Partial<ProjectBlock>> = {
  'color-full':  { bgColor: '#09090B', textColor: '#F4F4F5', label: '' },
  'text':        { heading: '', body: '' },
  'image-full':  { image: { src: '', alt: '', caption: '', placeholder: '#E4E4E7' } },
  'image-2col':  { images: [{ src: '', alt: '', placeholder: '#E4E4E7' }, { src: '', alt: '', placeholder: '#E4E4E7' }] },
  'image-3col':  { images: [{ src: '', alt: '', placeholder: '#E4E4E7' }, { src: '', alt: '', placeholder: '#E4E4E7' }, { src: '', alt: '', placeholder: '#E4E4E7' }] },
  'palette':     { colors: [{ hex: '#09090B', name: '' }] },
  'quote':       { quote: '', attribution: '' },
  'video':       { videoSrc: '', videoCaption: '', videoAutoplay: false },
}

// ─── Sub-editors ────────────────────────────────────────────────────────────

const inp = 'w-full border border-border rounded px-3 py-2 text-sm bg-bg text-fg focus:outline-none focus:border-fg transition-colors'
const lbl = 'block text-2xs font-mono tracking-[0.15em] uppercase text-muted mb-1'

function ImageEditor({
  value,
  onChange,
  label = 'Image',
}: {
  value: ProjectImage
  onChange: (v: ProjectImage) => void
  label?: string
}) {
  return (
    <div className="space-y-3 p-3 border border-border rounded bg-bg/50">
      <p className="font-mono text-2xs tracking-[0.15em] uppercase text-muted">{label}</p>
      <ImageUploader
        value={value.src}
        onChange={(path) => onChange({ ...value, src: path })}
        label="Photo"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Alt text</label>
          <input className={inp} value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} placeholder="Describe the image" />
        </div>
        <div>
          <label className={lbl}>Caption (optional)</label>
          <input className={inp} value={value.caption ?? ''} onChange={(e) => onChange({ ...value, caption: e.target.value })} placeholder="Caption text" />
        </div>
      </div>
      <div>
        <label className={lbl}>Placeholder colour (shown without photo)</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value.placeholder ?? '#E4E4E7'}
            onChange={(e) => onChange({ ...value, placeholder: e.target.value })}
            className="w-10 h-8 rounded border border-border cursor-pointer"
          />
          <input
            className={`${inp} flex-1`}
            value={value.placeholder ?? '#E4E4E7'}
            onChange={(e) => onChange({ ...value, placeholder: e.target.value })}
            placeholder="#E4E4E7"
          />
        </div>
      </div>
    </div>
  )
}

function ColorFullEditor({ block, onChange }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Background colour</label>
          <div className="flex items-center gap-2">
            <input type="color" value={block.bgColor ?? '#09090B'} onChange={(e) => onChange({ ...block, bgColor: e.target.value })} className="w-10 h-8 rounded border border-border cursor-pointer" />
            <input className={`${inp} flex-1`} value={block.bgColor ?? ''} onChange={(e) => onChange({ ...block, bgColor: e.target.value })} placeholder="#09090B" />
          </div>
        </div>
        <div>
          <label className={lbl}>Text colour</label>
          <div className="flex items-center gap-2">
            <input type="color" value={block.textColor ?? '#F4F4F5'} onChange={(e) => onChange({ ...block, textColor: e.target.value })} className="w-10 h-8 rounded border border-border cursor-pointer" />
            <input className={`${inp} flex-1`} value={block.textColor ?? ''} onChange={(e) => onChange({ ...block, textColor: e.target.value })} placeholder="#F4F4F5" />
          </div>
        </div>
      </div>
      <div>
        <label className={lbl}>Label text (large display)</label>
        <input className={inp} value={block.label ?? ''} onChange={(e) => onChange({ ...block, label: e.target.value })} placeholder="e.g. BUDE" />
      </div>
      {/* Preview */}
      <div className="rounded overflow-hidden" style={{ backgroundColor: block.bgColor ?? '#09090B', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-display font-bold" style={{ color: block.textColor ?? '#F4F4F5', fontSize: 'clamp(1.5rem, 6vw, 3rem)' }}>
          {block.label || 'PREVIEW'}
        </span>
      </div>
    </div>
  )
}

function TextEditor({ block, onChange }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Heading</label>
        <input className={inp} value={block.heading ?? ''} onChange={(e) => onChange({ ...block, heading: e.target.value })} placeholder="Section heading" />
      </div>
      <div>
        <label className={lbl}>Body (separate paragraphs with blank line)</label>
        <textarea className={inp} rows={6} value={block.body ?? ''} onChange={(e) => onChange({ ...block, body: e.target.value })} placeholder="Paragraph text..." />
      </div>
    </div>
  )
}

function ImageFullEditor({ block, onChange }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void }) {
  const img = block.image ?? { src: '', alt: '', placeholder: '#E4E4E7' }
  return (
    <ImageEditor
      value={img}
      onChange={(v) => onChange({ ...block, image: v })}
      label="Full-width image"
    />
  )
}

function ImageNColEditor({ block, onChange, count }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void; count: number }) {
  const images = block.images ?? Array.from({ length: count }, () => ({ src: '', alt: '', placeholder: '#E4E4E7' }))
  const ensured = Array.from({ length: count }, (_, i) => images[i] ?? { src: '', alt: '', placeholder: '#E4E4E7' })

  const setImage = (i: number, v: ProjectImage) => {
    const next = [...ensured]
    next[i] = v
    onChange({ ...block, images: next })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ensured.map((img, i) => (
        <ImageEditor key={i} value={img} onChange={(v) => setImage(i, v)} label={`Image ${i + 1}`} />
      ))}
    </div>
  )
}

function PaletteEditor({ block, onChange }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void }) {
  const colors = block.colors ?? []

  const update = (i: number, patch: Partial<ColorSwatch>) => {
    const next = colors.map((c, idx) => idx === i ? { ...c, ...patch } : c)
    onChange({ ...block, colors: next })
  }
  const add = () => onChange({ ...block, colors: [...colors, { hex: '#E4E4E7', name: '' }] })
  const remove = (i: number) => onChange({ ...block, colors: colors.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      {colors.map((color, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            type="color"
            value={color.hex}
            onChange={(e) => update(i, { hex: e.target.value })}
            className="w-10 h-9 rounded border border-border cursor-pointer shrink-0"
          />
          <input
            className={`${inp} w-28`}
            value={color.hex}
            onChange={(e) => update(i, { hex: e.target.value })}
            placeholder="#000000"
          />
          <input
            className={`${inp} flex-1`}
            value={color.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="Colour name"
          />
          <label className="flex items-center gap-1.5 text-xs text-muted whitespace-nowrap">
            <input
              type="checkbox"
              checked={!!color.dark}
              onChange={(e) => update(i, { dark: e.target.checked })}
              className="accent-fg"
            />
            Dark bg
          </label>
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-muted hover:text-red-500 transition-colors font-mono text-sm shrink-0"
            aria-label="Remove colour"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="font-mono text-xs tracking-[0.15em] uppercase text-muted border border-dashed border-border px-4 py-2 hover:border-muted hover:text-fg transition-colors w-full"
      >
        + Add Colour
      </button>
    </div>
  )
}

function QuoteEditor({ block, onChange }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Quote</label>
        <textarea className={inp} rows={3} value={block.quote ?? ''} onChange={(e) => onChange({ ...block, quote: e.target.value })} placeholder="Quote text (without quotation marks)" />
      </div>
      <div>
        <label className={lbl}>Attribution</label>
        <input className={inp} value={block.attribution ?? ''} onChange={(e) => onChange({ ...block, attribution: e.target.value })} placeholder="Name, Role" />
      </div>
    </div>
  )
}

function VideoEditor({ block, onChange }: { block: ProjectBlock; onChange: (b: ProjectBlock) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleVideoFile = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { path } = await res.json()
      onChange({ ...block, videoSrc: path })
    } else {
      const { error: msg } = await res.json().catch(() => ({ error: 'Upload failed' }))
      setUploadError(msg)
    }
    setUploading(false)
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div>
        <label className={lbl}>Video file</label>
        <div
          className="border border-dashed border-border rounded p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) handleVideoFile(file)
          }}
        >
          {block.videoSrc && !block.videoSrc.includes('youtube') && !block.videoSrc.includes('vimeo') ? (
            <div className="w-full">
              <video src={block.videoSrc} className="w-full aspect-video rounded object-contain bg-fg/10" controls />
            </div>
          ) : (
            <p className="text-muted text-sm text-center">
              {uploading ? 'Uploading…' : 'Click or drag to upload .mp4 / .webm (max 300 MB)'}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleVideoFile(file)
            }}
          />
        </div>
        {block.videoSrc && <p className="text-2xs text-muted mt-1 truncate">{block.videoSrc}</p>}
        {uploadError && <p className="text-2xs text-red-500 mt-1">{uploadError}</p>}
      </div>

      {/* Manual URL (YouTube / Vimeo) */}
      <div>
        <label className={lbl}>Or paste YouTube / Vimeo URL</label>
        <input
          className={inp}
          value={block.videoSrc?.includes('youtube') || block.videoSrc?.includes('vimeo') ? block.videoSrc : ''}
          onChange={(e) => onChange({ ...block, videoSrc: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </div>

      <div>
        <label className={lbl}>Caption (optional)</label>
        <input
          className={inp}
          value={block.videoCaption ?? ''}
          onChange={(e) => onChange({ ...block, videoCaption: e.target.value })}
          placeholder="Brand reel — 2024"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!block.videoAutoplay}
          onChange={(e) => onChange({ ...block, videoAutoplay: e.target.checked })}
          className="accent-fg"
        />
        <span className="font-mono text-xs text-fg">
          Autoplay / ambient mode — loops silently, no controls
          <span className="text-muted ml-1">(use for brand reels)</span>
        </span>
      </label>
    </div>
  )
}

// ─── Block item (collapsible) ────────────────────────────────────────────────

function BlockItem({
  block,
  index,
  total,
  onChange,
  onMove,
  onDelete,
}: {
  block: ProjectBlock
  index: number
  total: number
  onChange: (b: ProjectBlock) => void
  onMove: (dir: -1 | 1) => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)

  const summary = (() => {
    switch (block.type) {
      case 'color-full': return block.label || block.bgColor || '—'
      case 'text':       return block.heading || '(no heading)'
      case 'image-full': return block.image?.alt || block.image?.caption || '(no image)'
      case 'image-2col': return `${block.images?.length ?? 0} images`
      case 'image-3col': return `${block.images?.length ?? 0} images`
      case 'palette':    return `${block.colors?.length ?? 0} colours`
      case 'quote':      return block.quote ? `"${block.quote.slice(0, 40)}…"` : '(empty)'
      case 'video':      return block.videoSrc || '(no source)'
      default:           return '—'
    }
  })()

  const typeLabel = BLOCK_TYPES.find((t) => t.value === block.type)?.label ?? block.type

  return (
    <div className="border border-border rounded overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-bg">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="font-mono text-2xs tracking-[0.15em] uppercase text-fg bg-border px-2 py-0.5 rounded shrink-0">
            {typeLabel}
          </span>
          <span className="text-xs text-muted truncate">{summary}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0}
            className="p-1.5 text-muted hover:text-fg disabled:opacity-25 transition-colors" title="Move up">
            ↑
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1}
            className="p-1.5 text-muted hover:text-fg disabled:opacity-25 transition-colors" title="Move down">
            ↓
          </button>
          <button type="button" onClick={() => setOpen((o) => !o)}
            className="p-1.5 text-muted hover:text-fg transition-colors text-sm" title="Edit">
            {open ? '▲' : '▼'}
          </button>
          <button type="button" onClick={onDelete}
            className="p-1.5 text-muted hover:text-red-500 transition-colors ml-1" title="Delete block">
            ×
          </button>
        </div>
      </div>

      {/* Editor body */}
      {open && (
        <div className="p-4 border-t border-border bg-bg/30 space-y-4">
          {block.type === 'color-full'  && <ColorFullEditor   block={block} onChange={onChange} />}
          {block.type === 'text'        && <TextEditor         block={block} onChange={onChange} />}
          {block.type === 'image-full'  && <ImageFullEditor    block={block} onChange={onChange} />}
          {block.type === 'image-2col'  && <ImageNColEditor    block={block} onChange={onChange} count={2} />}
          {block.type === 'image-3col'  && <ImageNColEditor    block={block} onChange={onChange} count={3} />}
          {block.type === 'palette'     && <PaletteEditor      block={block} onChange={onChange} />}
          {block.type === 'quote'       && <QuoteEditor        block={block} onChange={onChange} />}
          {block.type === 'video'       && <VideoEditor        block={block} onChange={onChange} />}
        </div>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function BlocksEditor({
  blocks,
  onChange,
}: {
  blocks: ProjectBlock[]
  onChange: (blocks: ProjectBlock[]) => void
}) {
  const [addType, setAddType] = useState<ProjectBlockType>('text')

  const update = (i: number, b: ProjectBlock) => {
    const next = [...blocks]
    next[i] = b
    onChange(next)
  }

  const move = (i: number, dir: -1 | 1) => {
    const next = [...blocks]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const remove = (i: number) => onChange(blocks.filter((_, idx) => idx !== i))

  const add = () => {
    const defaults = BLOCK_DEFAULTS[addType]
    onChange([...blocks, { type: addType, ...defaults }])
  }

  return (
    <div className="space-y-3">
      {/* Block list */}
      {blocks.length === 0 && (
        <p className="text-muted text-sm py-6 text-center border border-dashed border-border rounded">
          No content blocks yet. Add one below.
        </p>
      )}
      {blocks.map((block, i) => (
        <BlockItem
          key={i}
          block={block}
          index={i}
          total={blocks.length}
          onChange={(b) => update(i, b)}
          onMove={(dir) => move(i, dir)}
          onDelete={() => remove(i)}
        />
      ))}

      {/* Add block row */}
      <div className="flex items-center gap-3 pt-2">
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value as ProjectBlockType)}
          className="border border-border rounded px-3 py-2 text-sm bg-bg text-fg focus:outline-none focus:border-fg flex-1"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          className="font-mono text-xs tracking-[0.15em] uppercase border border-fg text-fg px-5 py-2 hover:bg-fg hover:text-bg transition-colors whitespace-nowrap"
        >
          + Add Block
        </button>
      </div>
    </div>
  )
}
