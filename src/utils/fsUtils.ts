import { promises as fs } from 'fs'

export async function readJSON<T>(path: string): Promise<T | null> {
  try {
    const data = await fs.readFile(path, 'utf-8')
    return JSON.parse(data) as T
  } catch (error) {
    return null
  }
}

export async function writeJSON<T>(path: string, data: T): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
}
