'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      className={`font-mono text-xs transition-colors ${
        confirming
          ? 'text-red-500 hover:text-red-700'
          : 'text-muted hover:text-red-500'
      }`}
      title={confirming ? `Confirm delete "${title}"` : `Delete "${title}"`}
    >
      {confirming ? 'Confirm?' : 'Delete'}
    </button>
  )
}
