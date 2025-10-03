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
  | { type: 'STORE'; fileId: string; chunk: string; from: string; fileName: string }
  | { type: 'GET'; fileId: string; from: string }
  | { type: 'PING' | 'PONG'; from: string }
  | { type: 'CHUNK'; fileId: string; chunk: string; from: string; fileName?: string }

export type PeerInfo = {
  nodeId: string
  host: string
  port: number
}
