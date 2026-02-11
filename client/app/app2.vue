<script setup lang="ts">
import { createRpcClient } from '@vitejs/devtools-rpc/client'
import { createWsRpcPreset } from '@vitejs/devtools-rpc/presets/ws/client'
import type { ServerFunctions } from '../../src/node/rpc'

const client = createRpcClient<ServerFunctions>(
  {},
  {
    preset: createWsRpcPreset({
      url: 'ws://localhost:5556',
    }),
  },
)

function test() {
  client.$call('vite:oxlint:list-sessions')
}
</script>

<template>
  <div>
    hi

    <button @click="test">test</button>
  </div>
</template>
