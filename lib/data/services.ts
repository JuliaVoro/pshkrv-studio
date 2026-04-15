import { readFileSync, writeFileSync, renameSync } from 'fs'
import { join } from 'path'
import type { Service } from '@/types'

const DATA_PATH = join(process.cwd(), 'data', 'services.json')

export function getServices(): Service[] {
  const raw = readFileSync(DATA_PATH, 'utf-8')
  return (JSON.parse(raw) as Service[]).sort((a, b) => a.order - b.order)
}

export function updateServices(services: Service[]): void {
  atomicWrite(DATA_PATH, JSON.stringify(services, null, 2))
}

function atomicWrite(filePath: string, content: string) {
  const tmp = filePath + '.tmp'
  writeFileSync(tmp, content, 'utf-8')
  renameSync(tmp, filePath)
}
