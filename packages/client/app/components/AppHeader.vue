<script setup lang="ts">

</script>

<template>
  <header class="flex items-center justify-between">
    <a target="_blank" href="https://oxc.rs/docs/guide/usage/linter.html"
      class="font-bold text-xl lg:text-2xl flex items-center">
      <div class="flex items-center">
        <img src="https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/anchor.svg"
          class="w-6 h-6 lg:w-10 lg:h-10 flex-shrink-0" alt="oxc logo">
        <span class="text-[#FF915C]">
          Oxlint&nbsp;
        </span>
      </div>
      <div class="text-[#91EDE9]">Formatter Inspector</div>
    </a>

    <div>
      <UButton icon="ph:github-logo" color="neutral" variant="ghost"
        href="https://github.com/yuyinws/oxlint-formatter-inspector" target="_blank" />
      <ColorModeButton />
    </div>

  </header>
</template>
