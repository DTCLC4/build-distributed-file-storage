import { promises as fs } from 'fs'

/**
 ** readJSON function: Read JSON file from `path`.
 *
 * @template T - Expected data type after parsing (eg: User[], Config, ...)
 * @param path - Path to JSON file to read.
 * @returns {Promise<T | null>} - Returns parsed data (type T) if successful, or null if file does not exist or JSON is invalid.
 */
export async function readJSON<T>(path: string): Promise<T | null> {
  try {
    // Read the entire JSON file content (in UTF-8 string form)
    const data = await fs.readFile(path, 'utf-8')

    // Parse JSON string into object and cast to T
    return JSON.parse(data) as T
  } catch (error) {
    // If there is an error (file does not exist, JSON syntax is incorrect, etc.) then return null
    return null
  }
}

/**
 ** writeJSON function: Write the `data` data to a JSON file at `path`.
 *
 * @template T - Data type of the object to write (automatically inferred)
 * @param path - Path where the JSON file needs to be saved.
 * @param data - Data to write to the file.
 * @returns {Promise<void>} - Completed when the file is successfully written.
 */
export async function writeJSON<T>(path: string, data: T): Promise<void> {
  // Create temporary path (usually same directory, add .tmp)
  const tempPath = `${path}.tmp`

  //Save temporary file
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8')

  await fs.rename(tempPath, path)
}
