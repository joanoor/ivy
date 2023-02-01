<template>
  <div class="flex flex-col card p-4" :style="{ height: height + 'px' }">
    <div class="card-title">
      <ButtonList>
        <template #left>
          <slot name="title-left"></slot>
        </template>
        <template #right>
          <slot name="title-right"></slot>
        </template>
      </ButtonList>
    </div>
    <slot name="desc"></slot>
    <slot name="button">

    </slot>
  </div>
</template>

<script setup lang="ts">
import ButtonList from './ButtonList.vue'
withDefaults(defineProps<{
  title?: string
  width?: number
  height: number
}>(), {
  title: '市场部',
})
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #e5e6eb;
  border-radius: 4px;

  &-title {
    color: #1D2129;
    font-weight: 700;
  }

  &-bottom {}
}
</style>

