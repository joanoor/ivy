<template>
  <div
    p-5
    :style="{
      background: bgcolor,
      borderRadius: rounded,
      width,
      height: height,
    }"
  >
    <div v-if="title.length > 0" class="box-title">
      {{ title }}
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    bgcolor?: string
    width?: string
    height?: string
    rounded?: string
  }>(),
  {
    title: '',
    bgcolor: '#fff',
    width: '100%',
    height: '174px',
    rounded: '4px',
  }
)
</script>

<style lang="scss">
.box-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  line-height: 24px;
}
</style>
