import * as fs from 'fs/promises'

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
    await fs.access(path)
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
