import type {} from '@vitejs/devtools'
import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type {} from '../../node/rpc'
import { useRuntimeConfig } from '#app/nuxt'
import { getDevToolsRpcClient } from '@vitejs/devtools-kit/client'
import { reactive, shallowRef } from 'vue'

export const connectionState = reactive<{
  connected: boolean
  error: Error | null
}>({
  connected: false,
  error: null,
})

const rpc = shallowRef<DevToolsRpcClient>(undefined!)

export async function connect() {
  const runtimeConfig = useRuntimeConfig()
  try {
    const rpcClient = await getDevToolsRpcClient({
      baseURL: ['/.devtools/', runtimeConfig.app.baseURL],
      connectionMeta: runtimeConfig.app.connection,
      wsOptions: {
        onConnected: () => {
          connectionState.connected = true
        },
        onError: e => {
          connectionState.error = e
        },
        onDisconnected: () => {
          connectionState.connected = false
        },
      },
      rpcOptions: {},
    })

    rpc.value = rpcClient
    connectionState.connected = true
  } catch (e) {
    connectionState.error = e as Error
  }
}

export function useRpc() {
  return rpc
}
