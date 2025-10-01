export type NodeConfig = {
  nodeId: string
  encryptionKey: string
  port: number
  storagePath: string
  bootstrapPeers: string[]
}

export type Identity = {
  nodeId: string
  encryptionKey: string
}

export type Message =
  | { type: 'JOIN'; nodeId: string; address?: string }
  | { type: 'STORE'; fileId: string; chunk: Buffer }
  | { type: 'GET'; fileId: string }
  | { type: 'PING'; from: string }

export type PeerInfo = {
  nodeId: string
  host: string
  port: number
}
