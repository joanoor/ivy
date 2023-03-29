<template>
  <p :title="message" truncate>{{ message }}</p>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string
  }>(),
  {
    message: '',
  }
)
</script>

<style lang="scss" scoped></style>
