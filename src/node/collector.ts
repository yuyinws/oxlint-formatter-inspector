import type { DevToolsClientContext, DevToolsClientRpcHost } from '@vitejs/devtools-kit/client'
import { RpcFunctionsCollectorBase } from '@vitejs/devtools-rpc'
import { rpcFunctions } from './rpc/index'

const context: DevToolsClientContext = {
  rpc: undefined!,
}

export const clientRpc: DevToolsClientRpcHost = new RpcFunctionsCollectorBase(context)

for (const fn of rpcFunctions) {
  clientRpc.register(fn as unknown as any)
  // Ensure that the function matches the expected type for registration
  // or perform type assertion if you are sure about the compatibility
  // collector.register(fn as Parameters<typeof collector.register>[0])
}
