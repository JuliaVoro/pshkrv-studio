import { readFileSync, writeFileSync, renameSync } from 'fs'
import { join } from 'path'
import type { StudioInfo } from '@/types'

const DATA_PATH = join(process.cwd(), 'data', 'studio.json')

export function getStudioInfo(): StudioInfo {
  const raw = readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw) as StudioInfo
}

export function updateStudioInfo(data: StudioInfo): void {
  atomicWrite(DATA_PATH, JSON.stringify(data, null, 2))
}

function atomicWrite(filePath: string, content: string) {
  const tmp = filePath + '.tmp'
  writeFileSync(tmp, content, 'utf-8')
  renameSync(tmp, filePath)
}
