import fs from 'fs'
import path from 'path'
import { saveMetadata } from '../storage/metadata'

const testDir = path.join(__dirname, 'tmp-meta')

beforeAll(() => {
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir)
})

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true })
})

describe('Metadata', () => {
  it('should save and load metadata correctly', () => {
    const fileId = 'abc'
    const fileName = 'example.txt'
    saveMetadata(testDir, fileId, fileName)
  })
})
