<template>
  <div class="flex items-center w-full" :style="{height}">
    <slot>

    </slot>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  height?: string
}>(), {
  height: '100%'
})
</script>

<style lang="scss" scoped>

</style>