import { promises as fs } from 'fs'

/**
 ** ReadJSON function: Read JSON file from `path`.
 */
export async function readJSON<T>(path: string): Promise<T | null> {
  try {
    const data = await fs.readFile(path, 'utf-8')

    // Parse JSON string into object and cast to T
    return JSON.parse(data) as T
  } catch (error) {
    return null
  }
}

/**
 ** WriteJSON function: Write the `data` data to a JSON file at `path`.
 */
export async function writeJSON<T>(path: string, data: T): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
}
