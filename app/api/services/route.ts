import { NextRequest, NextResponse } from 'next/server'
import { getServices, updateServices } from '@/lib/data/services'

export async function GET() {
  return NextResponse.json(getServices())
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  updateServices(body)
  return NextResponse.json({ ok: true })
}
