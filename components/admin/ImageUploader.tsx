'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
  value: string
  onChange: (path: string) => void
  label?: string
  acceptVideo?: boolean
}

export default function ImageUploader({ value, onChange, label = 'Cover Image', acceptVideo = false }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isVideo = value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.includes('video/'))

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      body: file,
    })
    if (res.ok) {
      const { path } = await res.json()
      onChange(path)
    } else {
      const { error: msg } = await res.json().catch(() => ({ error: 'Upload failed' }))
      setError(msg)
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-xs font-mono tracking-[0.15em] uppercase text-muted mb-2">
        {label}
      </label>
      <div
        className="relative border border-dashed border-border rounded p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-muted transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        {value && !value.includes('placeholder') ? (
          <div className="relative w-full aspect-video">
            {isVideo ? (
              <video src={value} className="w-full h-full object-cover rounded" muted autoPlay loop playsInline />
            ) : (
              <Image src={value} alt="Preview" fill className="object-cover rounded" />
            )}
          </div>
        ) : (
          <p className="text-muted text-sm text-center">
            {uploading ? 'Uploading…' : acceptVideo ? 'Click or drag to upload image or video' : 'Click or drag to upload image'}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={acceptVideo ? 'image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif'}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>
      {value && (
        <p className="text-xs text-muted mt-1 truncate">{value}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1" role="alert">{error}</p>
      )}
    </div>
  )
}
