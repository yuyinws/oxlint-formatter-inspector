<script setup lang="ts">
import { useRpc } from '#imports'

const rpc = useRpc()

const sessions = await rpc.value!['vite:oxlint:list-sessions']()
</script>

<template>
  <div class="items-center justify-center relative flex flex-col gap-4 p-4 max-w-2xl mx-auto">
    <VisualLogoBanner />
    <p class="opacity-50">
      Select a lint session to get started:
    </p>

    <NuxtLink v-for="session in sessions" :key="session.timestamp" class="w-full" :to="`/session/${session.timestamp}`">
      <UCard class="w-full p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
        <div class="flex items-center gap-1 font-mono opacity-50">
          <u-icon name="ph:hash-duotone" class="w-4 h-4" />
          <span class="text-sm">{{ session.timestamp }}</span>
        </div>
      </UCard>
    </NuxtLink>
  </div>
</template>
