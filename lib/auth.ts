import { SignJWT, jwtVerify } from 'jose'

import type { SessionPayload } from '@/types'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
)

export async function verifyPassword(plain: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  return plain === password
}

export async function createToken(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
