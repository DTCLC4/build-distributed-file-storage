import { Identity, Message, PeerInfo } from '../types'
import { logger } from '../utils/logger'
import { Discovery } from './discovery'

export class P2PNode {
  private peers: Map<string, PeerInfo> = new Map()
  private discovery: Discovery
  private identity: Identity

  constructor(identity: Identity) {
    this.identity = identity
    this.discovery = new Discovery(identity)
  }

  public start(port: number) {
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
      // TODO: send via TCP/WebSocket/gRPC
      logger.info(`[P2P] Sending message to ${nodeId}`, message)
    }
  }

  private handlePeerDiscovered(peer: PeerInfo) {
    if (!this.peers.has(peer.nodeId)) {
      this.peers.set(peer.nodeId, peer)
      this.sendPing(peer)
      logger.info(`[P2P] New peer discovered: ${peer.nodeId} @ ${peer.host}:${peer.port}`)
    }
  }

  private sendMessage(peer: PeerInfo, message: Message) {
    // TODO: Implement actual transport (TCP/WebSocket/gRPC)
    if (message.type !== 'PING') {
      logger.info(`[P2P] Sending message to ${peer.nodeId}`, message)
    }
  }
}
