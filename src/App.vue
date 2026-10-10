<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // بعد از رندر صفحه، در idle زمانی WASM را پیش‌بارگذاری کن
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500))
  idle(() => {
    import('src/components/VuePdfEmbed.vue')
  })
})

</script>
