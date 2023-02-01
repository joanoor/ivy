<template>
  <el-table
    :data="tableData"
    :border="border"
    v-loading="loading"
    header-row-class-name="custom-table-header"
    class="mb-3"
  >
    <template #empty>
      <el-empty class="w-full" description="暂无数据" />
    </template>
    <el-table-column
      v-if="handleTableIndex && tableData.length > 0"
      label="序号"
      width="80"
      align="center"
    >
      <template #default="scope">
        {{ handleTableIndex(scope.$index) }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="col in tableColumns"
      :key="col.name"
      :prop="col.name"
      :label="col.title"
      :width="col.width"
      :fixed="col.fixed"
      show-overflow-tooltip
    >
      <template #default="scope">
        {{ onDecodeDict(scope.row, col.name, col.dictName) }}
      </template>
    </el-table-column>
  </el-table>
  <Pagination
    v-if="showPagination"
    :total="total"
    v-model:current="current"
    v-model:size="size"
  ></Pagination>
</template>

<script setup lang="ts">
import { ResultColumnsData } from '@/api/model'
import Pagination from '@/components/Pagination/Pagination.vue'
import useDecodeDict from '@/hooks/web/useDecodeDict'
import { useGlobalStore } from '@/store'

const useGlobal = useGlobalStore()

const { onDecodeDict } = useDecodeDict({
  ACVALID: [
    {
      name: '开启',
      value: '1',
    },
    {
      name: '关闭',
      value: '0',
    },
  ],
  ORGNO: useGlobal.orgList.map(v => ({
    name: v.orgName,
    value: v.orgNo,
  })),
})

const emit = defineEmits(['editRecord', 'deleteRecord'])

withDefaults(
  defineProps<{
    loading: boolean
    tableColumns: ResultColumnsData[]
    tableData: Recordable[]
    border?: boolean
    total?: number
    current?: number
    size?: number
    showPagination?: boolean
    handleTableIndex?: (num: number) => number
  }>(),
  {
    border: false,
    tableColumns: () => [] as ResultColumnsData[],
    tableData: () => [] as Recordable[],
    showPagination: true,
  }
)

const handleEditRecord = (row: Recordable) => {
  emit('editRecord', row)
}

const handleDeleteRecord = (row: Recordable) => {
  emit('deleteRecord', row)
}
</script>

<style lang="scss" scoped>
.circle {
  width: 6px;
  height: 6px;
  border-radius: 100%;
}

.enabled {
  background-color: #00b42a;
}

.disabled {
  background-color: #165dff;
}

.scrapped {
  background-color: #ff7d00;
}
</style>
