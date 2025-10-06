import net, { Socket } from 'net'
import { Discovery } from './discovery'
import { Identity, Message, PeerInfo } from '../types'
import { logger } from '../utils/logger'
import { saveChunk } from '../storage/fileManager'
import { saveMetadata } from '../storage/metadata'

export class P2PNode {
  // List of known peers: nodeId → PeerInfo
  private peers: Map<string, PeerInfo> = new Map()

  // Manage discovery (self-promote and find other peers)
  private discovery: Discovery

  // Current node identity (contains nodeId, public key,...)
  private identity: Identity
  // TCP server (used to listen for incoming connections)
  private server: net.Server | null = null

  // TCP port this node runs on
  private port!: number

  constructor(
    identity: Identity,

    // Local file/metadata save path
    private storagePath: string
  ) {
    this.identity = identity
    this.discovery = new Discovery(identity)
  }

  /**
   ** start function: Start P2P node
   */
  public start(port: number) {
    this.port = port

    // Create a TCP server to listen for incoming connections
    this.startTCPServer(port)

    // Start listening
    this.server?.listen(port, () => {
      logger.info(`[P2P] Listening on port ${port}`)
    })

    // Advertise the node to the LAN (for other peers to detect)
    this.discovery.advertise(port)

    // Listen for newly discovered peers
    this.discovery.discover((peer: PeerInfo) => {
      this.handlePeerDiscovered(peer)
    })
  }

  /**
   ** sendPing function: Send PING message to peer (to announce existence)
   */
  public sendPing(peer: PeerInfo) {
    const message: Message = {
      type: 'PING',
      from: this.identity.nodeId,
      port: this.port
    }
    this.sendMessage(peer, message)
  }

  /**
   ** broadcast function: Send broadcast message to all known peers
   */
  public broadcast(message: Message) {
    for (const [nodeId, peer] of this.peers) {
      this.sendMessage(peer, message)
      logger.info(`[P2P] Broadcasting message to ${nodeId}`, message)
    }
  }

  /**
   ** startTCPServer function: Create a TCP server to listen for incoming connections
   */
  private startTCPServer(port: number) {
    this.server = net.createServer((socket: Socket) => {
      let dataBuffer = '' // Temporary storage for received TCP data

      // When receiving data chunk
      socket.on('data', (chunk) => {
        dataBuffer += chunk.toString()
      })

      // When peer closes connection → parse JSON message
      socket.on('end', () => {
        try {
          const msg: Message = JSON.parse(dataBuffer)
          this.handleMessage(msg, socket)
        } catch (error) {
          logger.error('[P2P] Failed to parse message', error)
        }
      })

      // Log errors if socket has problems
      socket.on('error', (err) => {
        logger.error('[P2P] Socket error:', err)
      })
    })
  }

  /**
   ** handleMessage function: Process messages received from peers
   */
  private handleMessage(msg: Message, socket: Socket) {
    switch (msg.type) {
      case 'PING': {
        logger.info(`[P2P] Got PING from ${msg.from}`)

        const peer: PeerInfo = {
          nodeId: msg.from,
          host: socket.remoteAddress || '127.0.0.1',
          port: msg.port || 0
        }

        // If peer does not exist → add to list
        if (!this.peers.has(peer.nodeId)) {
          this.peers.set(peer.nodeId, peer)
          logger.info(`[P2P] Added new peer from PING: ${peer.nodeId}`)

          // Send PONG again for 2-way confirmation
          this.sendMessage(peer, {
            type: 'PONG',
            from: this.identity.nodeId,
            port: this.port
          })
        } else {
          logger.debug(`[P2P] Already connected to ${peer.nodeId}, ignoring duplicate PING`)
        }
        break
      }

      case 'PONG': {
        logger.info(`[P2P] Got PONG from ${msg.from}`)
        const peer: PeerInfo = {
          nodeId: msg.from,
          host: socket.remoteAddress || '127.0.0.1',
          port: msg.port || 0
        }

        if (!this.peers.has(peer.nodeId)) {
          this.peers.set(peer.nodeId, peer)
          logger.info(`[P2P] Added new peer from PONG: ${peer.nodeId}`)
        }
        break
      }

      // When receiving a request to save the chunk file
      case 'STORE': {
        logger.info(`[P2P] Got STORE request from ${msg.from} for file ${msg.fileName}`)

        try {
          // Save chunk file and metadata to disk
          saveChunk(this.storagePath, msg.fileId, msg.chunk)
          saveMetadata(this.storagePath, msg.fileId, msg.fileName)
          logger.info(`[P2P] ✅ Stored file ${msg.fileName} (${msg.fileId}) locally`)
        } catch (err) {
          logger.error(`[P2P] ❌ Failed to store file ${msg.fileName}`, err)
        }
        break
      }

      default:
        logger.warn(`[P2P] Unknown message type`, msg)
    }
  }

  private handlePeerDiscovered(peer: PeerInfo) {
    if (!this.peers.has(peer.nodeId)) {
      this.peers.set(peer.nodeId, peer)
      logger.info(`[P2P] New peer discovered: ${peer.nodeId} @ ${peer.host}:${peer.port}`)

      // Send PING to initial handshake
      this.sendPing(peer)
    }
  }

  /**
   ** sendMessage function: Send TCP message to a specific peer
   */
  private sendMessage(peer: PeerInfo, message: Message) {
    const client = net.createConnection(peer.port, peer.host, () => {
      client.write(JSON.stringify(message), () => {
        client.end()
      })
    })

    client.on('error', (err) => {
      logger.error(`[P2P] Failed to send message to ${peer.nodeId}`, err)
    })
  }
}
