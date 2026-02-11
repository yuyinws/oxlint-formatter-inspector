import type {} from '@vitejs/devtools'
import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { ServerFunctions } from '../../../src/node/rpc'
import { useRuntimeConfig } from '#app/nuxt'
import { getDevToolsRpcClient } from '@vitejs/devtools-kit/client'
import { reactive, shallowRef } from 'vue'
import { createRpcClient } from '@vitejs/devtools-rpc/client'
import { createWsRpcPreset } from '@vitejs/devtools-rpc/presets/ws/client'

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
    let rawRpcClient: any = undefined

    const connection = await $fetch<{ backend?: string; port: number }>(
      '/.devtools.vdt-connection.json',
    )

    if (connection?.backend === 'h3') {
      rawRpcClient = createRpcClient<ServerFunctions>(
        {},
        {
          preset: createWsRpcPreset({
            url: `ws://localhost:${connection.port}`,
          }),
        },
      )

      rawRpcClient.call = rawRpcClient.$call
    } else {
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

      rawRpcClient = rpcClient
    }

    rpc.value = rawRpcClient
    connectionState.connected = true
  } catch (e) {
    connectionState.error = e as Error
  }
}

export function useRpc() {
  return rpc
}
