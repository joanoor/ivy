<template>
  <el-dialog
    align-center
    v-model="visible"
    :title="title"
    :width="width"
    @closed="inputAppName = ''"
  >
    <p leading-6 mb-5>
      此操作无法撤消。这将永久删除
      <strong font-600>{{ app.appName }}</strong>
      应用及相关联的配置。
    </p>
    <p mb-5>
      请输入
      <strong font-600>{{ app.appName }}</strong>
      进行确认
    </p>
    <el-input v-model="inputAppName" clearable></el-input>
    <template #footer>
      <el-button
        class="w-full!"
        :disabled="inputAppName !== app.appName"
        type="primary"
        @click="$emit('delete', app)"
      >
        我明白后果，请删除这个应用
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AppFormStruct } from '../shared'
const emit = defineEmits(['update:visible', 'delete'])

const props = withDefaults(
  defineProps<{
    visible: boolean
    title: string
    app: AppFormStruct
    width?: string
  }>(),
  {
    width: '35%',
  }
)
const visible = computed({
  get: () => props.visible,
  set: value => {
    emit('update:visible', value)
  },
})

const inputAppName = ref('')
</script>

<style scoped></style>
