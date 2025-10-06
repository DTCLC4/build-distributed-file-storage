import * as fs from 'fs'
import path from 'path'

/**
 ** fileExists function: Check if the file or directory exists at the specified path.
 *
 * @param path - Path to the file or directory to check.
 * @returns {Promise<boolean>} - Returns true if exists, false if not.
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    // fs.access() checks access to file
    // If the file exists and is accessible, this function does not throw an error
    fs.existsSync(path)
    return true
  } catch {
    // If the file does not exist or has no access rights, fs.access() will throw an error
    return false
  }
}

/**
 ** sleep function: Pause execution for a specified amount of time (in milliseconds).
 *
 * @param ms - Number of milliseconds to “sleep”.
 * @returns {Promise<void>} - Promise to be resolved after the timeout.
 */
export function sleep(ms: number): Promise<void> {
  // Returns a Promise that resolves after `ms` milliseconds
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function restoreImage(storagePath: string, fileId: string, fileName: string) {
  const filePath = path.join(storagePath, fileId)
  const base64 = fs.readFileSync(filePath, 'utf8')
  const data = Buffer.from(base64, 'base64')

  const outputPath = path.join(storagePath, `restored-${fileName}`)
  fs.writeFileSync(outputPath, data)
  console.log(`✅ Restored image saved to ${outputPath}`)
}
