<template>
  <div class="flex justify-between items-center search-container pb-5 mb-5">
    <div class="search-form flex-1" :class="mode === 'vertical' ? 'vertical' : 'horizontal'">
      <slot></slot>
    </div>
    <div :class="mode === 'vertical' ? 'flex-col vertical' : 'horizontal'"
      class="flex justify-between items-center search-button pl-5 ml-5" :style="{ height: height + 'px' }">
      <el-button type="primary" :icon="Search" @click="$emit('search')">查询</el-button>
      <el-button type="info" :icon="RefreshRight" @click="$emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, RefreshRight } from '@element-plus/icons-vue'

defineEmits(['search', 'reset'])

defineProps({
  mode: {
    type: String,
    default: 'vertical'
  },
  height: {
    type: Number,
    required: true
  }
})

</script>

<style scoped lang="scss">
.search-container {
  // padding-
  border-bottom: solid 1px #E5E6EB;
}

.search-button {
  border-left: solid #E5E6EB 2px;
}
</style>