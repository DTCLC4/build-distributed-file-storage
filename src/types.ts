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
  | { type: 'STORE'; fileId: string; chunk: string; from: string; fileName: string }
  | { type: 'PING' | 'PONG'; from: string, port?: number }


export type PeerInfo = {
  nodeId: string
  host: string
  port: number
}
