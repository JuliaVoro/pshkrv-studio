import { put, list } from '@vercel/blob'
import { readFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import type { Project } from '@/types'

const BLOB_KEY = 'data/projects.json'
const LOCAL_PATH = join(process.cwd(), 'data', 'projects.json')

// ── Read ──────────────────────────────────────────────────────────────────────

async function readProjects(): Promise<Project[]> {
  // In production, try Vercel Blob first
  if (process.env.NODE_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: BLOB_KEY })
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: 'no-store' })
        if (res.ok) return await res.json()
      }
    } catch {
      // fall through to local file
    }
  }
  // Fall back to bundled JSON (build-time data)
  const raw = readFileSync(LOCAL_PATH, 'utf-8')
  return JSON.parse(raw) as Project[]
}

// ── Write ─────────────────────────────────────────────────────────────────────

async function writeProjects(projects: Project[]): Promise<void> {
  const content = JSON.stringify(projects, null, 2)
  await put(BLOB_KEY, content, {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return readProjects()
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await readProjects()
  return projects.find((p) => p.id === id)
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await readProjects()
  return projects.find((p) => p.slug === slug)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await readProjects()
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order)
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  const projects = await readProjects()
  const project: Project = { ...data, id: randomUUID() }
  projects.push(project)
  await writeProjects(projects)
  return project
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const projects = await readProjects()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return null
  projects[idx] = { ...projects[idx], ...data }
  await writeProjects(projects)
  return projects[idx]
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await readProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  await writeProjects(filtered)
  return true
}
