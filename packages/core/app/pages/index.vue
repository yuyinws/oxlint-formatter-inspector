<script setup lang="ts">
import { useRpc } from '#imports'

const rpc = useRpc()

const { data: sessionMetaList, refresh: reloadSessions } = useAsyncData('sessionMetaList', async () => {
  return await rpc.value!['vite:oxlint:list-sessions']()
})

const hidePassed = useLocalStorage('hidePassed', false)

const filteredSessionMetaList = computed(() => {
  return sessionMetaList.value?.filter(meta => !hidePassed.value || meta.summary.files_with_issues > 0)
})
</script>

<template>
  <div class="items-center justify-center relative flex flex-col gap-4 p-4 max-w-2xl mx-auto">
    <VisualLogoBanner />
    <div class="flex justify-between w-full">
      <div class="flex items-center gap-2">
        <UButton size="sm" class="cursor-pointer" icon="lucide:refresh-cw" color="neutral" variant="outline" @click="reloadSessions()" />

        <p class="opacity-50">
          Select a lint session to get started:
        </p>
      </div>

      <UCheckbox v-model="hidePassed" label="Hide Passed" />
    </div>

    <template v-if="filteredSessionMetaList">
      <SessionCard v-for="meta in filteredSessionMetaList" :key="meta.timestamp" :meta="meta" />
    </template>
  </div>
</template>
