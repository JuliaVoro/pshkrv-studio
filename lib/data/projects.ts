import { readFileSync, writeFileSync, renameSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import type { Project } from '@/types'

const DATA_PATH = join(process.cwd(), 'data', 'projects.json')

export function getProjects(): Project[] {
  const raw = readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw) as Project[]
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return getProjects()
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
}

export function createProject(data: Omit<Project, 'id'>): Project {
  const projects = getProjects()
  const project: Project = { ...data, id: randomUUID() }
  projects.push(project)
  atomicWrite(DATA_PATH, JSON.stringify(projects, null, 2))
  return project
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const projects = getProjects()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return null
  projects[idx] = { ...projects[idx], ...data }
  atomicWrite(DATA_PATH, JSON.stringify(projects, null, 2))
  return projects[idx]
}

export function deleteProject(id: string): boolean {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  atomicWrite(DATA_PATH, JSON.stringify(filtered, null, 2))
  return true
}

function atomicWrite(filePath: string, content: string) {
  const tmp = filePath + '.tmp'
  writeFileSync(tmp, content, 'utf-8')
  renameSync(tmp, filePath)
}
