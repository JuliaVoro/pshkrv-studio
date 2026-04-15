import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'])

// GET /api/upload — config diagnostic
export async function GET() {
  const configured = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ?? process.env.pshkrv_READ_WRITE_TOKEN
  )
  return NextResponse.json({
    blobTokenConfigured: configured,
    tokenSource: process.env.BLOB_READ_WRITE_TOKEN
      ? 'BLOB_READ_WRITE_TOKEN'
      : process.env.pshkrv_READ_WRITE_TOKEN
      ? 'pshkrv_READ_WRITE_TOKEN (legacy)'
      : 'MISSING — add BLOB_READ_WRITE_TOKEN in Vercel → Project Settings → Environment Variables',
  })
}

// POST /api/upload?filename=photo.jpg
// Body: raw file bytes (Content-Type set by browser automatically)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    if (!filename) {
      return NextResponse.json({ error: 'Missing ?filename= query param' }, { status: 400 })
    }

    const contentType = request.headers.get('content-type') ?? ''
    // Strip any params (e.g. "image/jpeg; charset=utf-8" → "image/jpeg")
    const mimeType = contentType.split(';')[0].trim()

    if (!IMAGE_TYPES.has(mimeType) && !VIDEO_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, png, webp, avif, mp4, webm.' },
        { status: 400 }
      )
    }

    if (!request.body) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
    }

    // Stream directly to Vercel Blob — avoids loading entire file into memory
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: mimeType || undefined,
    })

    return NextResponse.json({ path: blob.url })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[upload] Blob error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
