import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { extname } from 'path'
import { randomUUID } from 'crypto'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES]

const IMAGE_MAX = 10  * 1024 * 1024  // 10 MB
const VIDEO_MAX = 300 * 1024 * 1024  // 300 MB

// GET /api/upload — config diagnostic (admin-only, safe to call from browser)
export async function GET() {
  const token =
    process.env.BLOB_READ_WRITE_TOKEN ??
    process.env.pshkrv_READ_WRITE_TOKEN

  return NextResponse.json({
    blobTokenConfigured: Boolean(token),
    tokenSource: process.env.BLOB_READ_WRITE_TOKEN
      ? 'BLOB_READ_WRITE_TOKEN'
      : process.env.pshkrv_READ_WRITE_TOKEN
      ? 'pshkrv_READ_WRITE_TOKEN (legacy)'
      : 'MISSING — add BLOB_READ_WRITE_TOKEN in Vercel → Project Settings → Environment Variables',
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, png, webp, avif, mp4, webm.' },
        { status: 400 }
      )
    }

    const isVideo = VIDEO_TYPES.includes(file.type)
    const maxSize = isVideo ? VIDEO_MAX : IMAGE_MAX
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${isVideo ? '300' : '10'} MB)` },
        { status: 400 }
      )
    }

    const ext = extname(file.name) || (isVideo ? '.mp4' : '.jpg')
    const filename = `${randomUUID()}${ext}`

    // @vercel/blob reads BLOB_READ_WRITE_TOKEN automatically.
    // We pass it explicitly so we can fall back to the legacy variable name.
    const token =
      process.env.BLOB_READ_WRITE_TOKEN ??
      process.env.pshkrv_READ_WRITE_TOKEN

    if (!token) {
      console.error('[upload] BLOB_READ_WRITE_TOKEN not set')
      return NextResponse.json(
        { error: 'Blob token missing. Add BLOB_READ_WRITE_TOKEN in Vercel → Project Settings → Environment Variables.' },
        { status: 500 }
      )
    }

    const blob = await put(filename, file, { access: 'public', token })
    return NextResponse.json({ path: blob.url })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[upload] Blob error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
