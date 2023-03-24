<template>
  <el-input
    class="search-input"
    placeholder="关键词搜索（选填）"
    v-model="value"
    @keyup.enter.native="onSearch"
    @clear="onSearch"
    clearable
    :size="size"
  >
    <template #append>
      <el-button
        :icon="Search"
        class="search-button"
        :size="size"
        @click="onSearch"
        type="primary"
      ></el-button>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['search'])

withDefaults(
  defineProps<{
    size: 'default' | 'small' | 'large'
  }>(),
  {
    size: 'default',
  }
)

const value = ref('')
const onSearch = () => {
  emit('search', value.value)
}
</script>
