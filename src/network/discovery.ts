import Bonjour from 'bonjour-service'
import { Identity } from '../types'
import { logger } from '../utils/logger'

export class Discovery {
  // Bonjour instance to manage service advertising & discovery
  private bonjour = new Bonjour()

  // Browser to search for other nodes with the same service type
  private browser: any

  // Current node identification information (nodeId, encryptionKey)
  private identity: Identity

  constructor(identity: Identity) {
    this.identity = identity
  }

  /**
   ** advertise function: Advertise current node on LAN using mDNS.
   *
   * @param port - The port the current node is listening on P2P.
   */
  public advertise(port: number) {
    this.bonjour.publish({
      name: this.identity.nodeId,
      type: 'dfs',
      port,
      txt: { nodeId: this.identity.nodeId }
    })
    logger.info(`🌐 Advertising node ${this.identity.nodeId} on port ${port}`)
  }

  /**
   ** discover function: Discover other nodes in the same LAN via the "dfs" service.
   *
   * @param onPeerUp - Callback called when new node is found
   */
  public discover(onPeerUp: (peer: { nodeId: string; host: string; port: number }) => void) {
    // Search for service type 'dfs' (Distributed File Storage)
    this.browser = this.bonjour.find({ type: 'dfs' })

    // When new service is discovered (another node comes up)
    this.browser.on('up', (service: any) => {
      const nodeId = service.txt?.nodeId
      // Remove the current node itself (avoid self-detection)
      if (nodeId && nodeId !== this.identity.nodeId) {
        const host = service.referer.address
        const port = service.port
        onPeerUp({ nodeId, host: host, port })
      }
    })
  }

  /**
   ** cleanup function: Stop all broadcasts and probing before the node shuts down.
   */
  public async cleanup() {
    try {
      // Stop advertising (unpublish all services)
      await new Promise<void>((resolve) => {
        this.bonjour.unpublishAll(() => {
          logger.info(`🌐 Unpublished all services`)
          resolve()
        })
      })
      // Stop the search process (if running)
      if (this.browser) {
        this.browser.stop()
        logger.info(`🌐 Browser stopped`)
      }

      // Close Bonjour instance to release socket
      this.bonjour.destroy()
      logger.info(`🌐 Bonjour instance destroyed`)
    } catch (error) {
      logger.error(`⚠️ Cleanup failed:`, error)
    }
  }
}
