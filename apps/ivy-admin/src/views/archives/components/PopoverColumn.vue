<template>
  <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    全部显示
  </el-checkbox>
  <el-checkbox-group
    v-model="checkList"
    flex-col
    @change="handleCheckedColumnsChange"
  >
    <el-checkbox v-for="item in columnNames" :key="item" :label="item" />
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { ResultColumnsData } from '@/types'

const checkAll = ref(true)
const isIndeterminate = ref(false)
const columnNames = ref<string[]>()

const emit = defineEmits(['update:tableColumns'])

const props = withDefaults(
  defineProps<{
    tableColumns: ResultColumnsData[]
    columns: ResultColumnsData[]
  }>(),
  {
    tableColumns: () => [],
    columns: () => [],
  }
)

const checkList = computed({
  get: () => props.tableColumns.map(v => v.title) as string[],
  set: value => {
    emit(
      'update:tableColumns',
      props.columns.filter(v => value.includes(v.title as string))
    )
  },
})

const stopWatch = watch(
  () => props.tableColumns,
  newValue => {
    if (newValue.length > 0) {
      columnNames.value = newValue.map(v => v.title) as string[]
      stopWatch()
    }
  }
)

const handleCheckAllChange = (val: boolean) => {
  // @ts-ignore
  checkList.value = val ? columnNames.value : []
  isIndeterminate.value = false
}

const handleCheckedColumnsChange = (value: string[]) => {
  checkAll.value = value.length === columnNames.value?.length
  isIndeterminate.value =
    // @ts-ignore
    value.length > 0 && value.length < columnNames.value?.length
}
</script>

<style lang="scss"></style>
