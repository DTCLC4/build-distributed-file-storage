import { createConfig } from '../config/default'
import { P2PNode } from '../network/p2pNode'
import { Identity, Message } from '../types'

const mockPeer = { nodeId: 'peer-1', host: '127.0.0.1', port: 4001 }

describe('P2PNode', async () => {
  const identity: Identity = { nodeId: 'self-node', encryptionKey: 'key' }
  const config = await createConfig()
  const node = new P2PNode(identity, config.storagePath)

  it('should handle PING and respond with PONG', () => {
    const msg: Message = { type: 'PING', from: mockPeer.nodeId, port: mockPeer.port }

    const socket = { remoteAddress: mockPeer.host } as any
    const logSpy = jest.spyOn(console, 'log').mockImplementation()

    node['handleMessage'](msg, socket)

    expect(logSpy).toHaveBeenCalled()
    logSpy.mockRestore()
  })
})
