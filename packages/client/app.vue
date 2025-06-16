<script setup lang="ts">
const { data } = await useFetch('/api/payload.json', {

})
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
