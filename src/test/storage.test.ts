import fs from 'fs'
import path from 'path'
import { saveChunk } from '../storage/fileManager'
const testDir = path.join(__dirname, 'tmp-storage')

beforeAll(() => {
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir)
})

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true })
})

describe('File Storage', () => {
  it('should save and load a chunk correctly', () => {
    const fileId = '123'
    const chunk = Buffer.from('test data').toString('base64')

    saveChunk(testDir, fileId, chunk)
  })
})
