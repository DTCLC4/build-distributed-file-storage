import { createConfig } from './config'

async function main() {
  const config = await createConfig()
  console.log('🚀 Node starting with ID:', config.nodeId)
}

main()
