import Bonjour from 'bonjour-service'
import { Identity } from '../types'
import { logger } from '../utils/logger'

export class Discovery {
  private bonjour = new Bonjour()
  private browser: any
  private identity: Identity

  constructor(identity: Identity) {
    this.identity = identity
  }

  // Advertise this node
  public advertise(port: number) {
    this.bonjour.publish({
      name: this.identity.nodeId,
      type: 'dfs',
      port,
      txt: { nodeId: this.identity.nodeId }
    })
    logger.info(`[DISCOVERY] Advertising node ${this.identity.nodeId} on port ${port}`)
  }

  // Discover peers
  public discover(onPeerUp: (peer: { nodeId: string, host: string, port: number }) => void) {
    this.browser = this.bonjour.find({ type: 'dfs' })

    this.browser.on('up', (service: any) => {
      const nodeId = service.txt?.nodeId
      if (nodeId && nodeId !== this.identity.nodeId) {
        onPeerUp({ nodeId, host: service.referer.address, port: service.port })
      }
    })
  }
}
