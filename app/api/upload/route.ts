import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES]

const IMAGE_MAX = 10  * 1024 * 1024  // 10 MB
const VIDEO_MAX = 300 * 1024 * 1024  // 300 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: jpg, png, webp, avif, mp4, webm.' }, { status: 400 })
  }

  const isVideo = VIDEO_TYPES.includes(file.type)
  const maxSize = isVideo ? VIDEO_MAX : IMAGE_MAX
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large (max ${isVideo ? '300' : '10'}MB)` }, { status: 400 })
  }

  const ext = extname(file.name) || '.jpg'
  const filename = `${randomUUID()}${ext}`
  const uploadsDir = join(process.cwd(), 'public', 'uploads')

  mkdirSync(uploadsDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(join(uploadsDir, filename), buffer)

  return NextResponse.json({ path: `/uploads/${filename}` })
}
