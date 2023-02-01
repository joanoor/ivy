<template>
  <el-input class="search-input" placeholder="关键词搜索（选填）" v-model="value" @keyup.enter.native="onSearch"
    @clear="onSearch" clearable :size="size">
    <template #append>
      <el-button :icon="Search" class="search-button" :size="size" @click="onSearch" type="primary"></el-button>
    </template>
  </el-input>
</template>

<script setup lang="ts">import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'
defineProps({
  size: {
    type: String,
    default: 'default',
  },
})

const emit = defineEmits(['search'])

const value = ref('')
const onSearch = () => {
  emit('search', value.value)
}
</script>

<style lang="scss" scoped>
.search-button {
  :deep(i.el-icon) {
    color: #1D2129
  }
}
</style>