<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const rpc = useRpc()

const session = await rpc.value!['vite:oxlint:get-session']({ sessionId: id })
</script>

<template>
  <div class="h-screen w-screen max-w-screen max-h-screen">
    <div class="p-4">
      <UButton variant="outline" icon="ph:arrow-bend-up-left-duotone" to="/">
        Re-select session
      </UButton>
    </div>

    <div>
      {{ session }}
    </div>
  </div>
</template>
