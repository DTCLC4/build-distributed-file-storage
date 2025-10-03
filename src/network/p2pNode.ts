import { readChunk, saveChunk } from '../storage/fileManager'
import { getFileName, saveMetadata } from '../storage/metadata'
import { Identity, Message, PeerInfo } from '../types'
import { logger } from '../utils/logger'
import { Discovery } from './discovery'
import net, { Socket } from 'net'

export class P2PNode {
  private peers: Map<string, PeerInfo> = new Map()
  private discovery: Discovery
  private identity: Identity
  private server: net.Server | null = null
  private storagePath: string

  constructor(identity: Identity, storagePath: string) {
    this.identity = identity
    this.discovery = new Discovery(identity)
    this.storagePath = storagePath
  }

  public start(port: number) {
    this.startTCPServer(port)
    this.server?.listen(port, () => {
      logger.info(`[P2P] Listening on port ${port}`)
    })
    // Advertise and discover
    this.discovery.advertise(port)
    this.discovery.discover((peer: PeerInfo) => {
      this.handlePeerDiscovered(peer)
    })
  }

  public sendPing(peer: PeerInfo) {
    const message: Message = { type: 'PING', from: this.identity.nodeId }
    this.sendMessage(peer, message)
  }

  // Broadcast a message to all peers
  public broadcast(message: any) {
    for (const [nodeId, peer] of this.peers) {
      this.sendMessage(peer, message)
      logger.info(`[P2P] Sending message to ${nodeId}`, message)
    }
  }

  private startTCPServer(port: number) {
    this.server = net.createServer((socket: Socket) => {
      let dataBuffer = ''
      socket.on('data', (chunk) => {
        dataBuffer += chunk.toString()
      })

      socket.on('end', () => {
        try {
          const msg: Message = JSON.parse(dataBuffer)
          this.handleMessage(msg, socket)
        } catch (error) {
          logger.error('[P2P] Failed to parse message', error)
        }
      })
    })
  }

  private handleMessage(msg: Message, socket: Socket) {
    switch (msg.type) {
      case 'PING':
        logger.info(`[P2P] Got PING from ${msg.from}`)
        break

      case 'PONG':
        logger.info(`[P2P] Got PONG from ${msg.from}`)
        break

      case 'STORE':
        logger.info(`[P2P] Got STORE for ${msg.fileId || msg.fileName} from ${msg.from}`)
        saveChunk(this.storagePath, msg.fileId, msg.chunk)
        if (msg.fileName) {
          saveMetadata(this.storagePath, msg.fileId, msg.fileName)
        }
        break

      case 'GET':
        logger.info(`[P2P] Got GET for ${msg.fileId} from ${msg.from}`)
        const chunk = readChunk(this.storagePath, msg.fileId)
        if (chunk) {
          const fileName = getFileName(this.storagePath, msg.fileId) || msg.fileId
          this.sendMessage(
            { host: socket.remoteAddress!, port: socket.remotePort!, nodeId: msg.from },
            {
              type: 'STORE',
              fileId: msg.fileId,
              fileName,
              chunk,
              from: this.identity.nodeId
            }
          )
        }

        break

      case 'CHUNK':
        logger.info(`[P2P] Got CHUNK for ${msg.fileId} from ${msg.from}`)
        saveChunk(this.storagePath, msg.fileId, msg.chunk)
        if (msg.fileName) {
          saveMetadata(this.storagePath, msg.fileId, msg.fileName)
        }
        break

      default:
        logger.warn(`[P2P] Unknown message type`, msg)
    }
  }

  private handlePeerDiscovered(peer: PeerInfo) {
  if (!this.peers.has(peer.nodeId)) {
    this.peers.set(peer.nodeId, peer)
    logger.info(`[P2P] New peer discovered: ${peer.nodeId} @ ${peer.host}:${peer.port}`)

    this.sendMessage(peer, { type: 'PING', from: this.identity.nodeId })
  }
}


  private sendMessage(peer: PeerInfo, message: Message) {
    const client = net.createConnection(peer.port, peer.host, () => {
      client.write(JSON.stringify(message))
      client.end()
    })
    client.on('error', (err) => {
      logger.error(`[P2P] Failed to send message to ${peer.nodeId}`, err)
    })
  }
}
