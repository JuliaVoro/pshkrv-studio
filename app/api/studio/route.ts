import { NextRequest, NextResponse } from 'next/server'
import { getStudioInfo, updateStudioInfo } from '@/lib/data/studio'

export async function GET() {
  return NextResponse.json(getStudioInfo())
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  updateStudioInfo(body)
  return NextResponse.json({ ok: true })
}
