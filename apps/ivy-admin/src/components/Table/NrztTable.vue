<template>
  <el-table
    :data="tableData"
    border
    v-loading="loading"
    :height="tableHeight"
    header-row-class-name="iemp-table-header"
    mb-5
    @selection-change="handleSelectionChange"
    ref="tableRef2"
  >
    <template v-if="tableData.length === 0">
      <el-empty w-full h-full description="暂无数据" />
    </template>
    <template v-else>
      <el-table-column
        v-for="col in tableColumns"
        :key="col.name"
        :prop="col.name"
        :label="col.title"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ onDecodeDict(scope.row, col.name, col.dictName) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        fixed="right"
        v-if="showOperator"
      >
        <template #default="scope">
          <slot :row="scope.row" :serial="scope.$index">
            <div flex items-center>
              <el-button
                link
                type="primary"
                size="default"
                @click="handleEditRecord(scope.row)"
              >
                修改
              </el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#FF7D00"
                title="确认删除此记录？"
                width="300"
                @confirm="handleDeleteRecord(scope.row)"
              >
                <template #reference>
                  <el-button link type="primary" size="default">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
  <ButtonList>
    <template #left>
      <slot name="button">
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="$emit('batchexport')"
        >
          {{ hasSelectedRow ? '导出所选' : '导出全部' }}
        </el-button>
      </slot>
    </template>
    <template #right>
      <Pagination
        v-if="showPagination"
        v-model:current="currentPage"
        v-model:size="pageSize"
        :total="total"
      ></Pagination>
    </template>
  </ButtonList>
</template>

<script setup lang="ts">
import { ResultColumnsData } from '@/types'
import { InfoFilled, Download } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'
import useDecodeDict from '@/hooks/web/useDecodeDict'
import ButtonList from '@/components/ButtonList.vue'

const tableRef2 = ref<HTMLElement>()

const emit = defineEmits([
  'update:current',
  'update:size',
  'editRecord',
  'deleteRecord',
  'selection',
  'batchexport',
])

const props = withDefaults(
  defineProps<{
    loading: boolean
    tableColumns?: ResultColumnsData[]
    tableData?: Recordable[]
    total?: number
    current?: number
    size?: number
    tableHeight?: number | string
    showPagination?: boolean
    showOperator?: boolean
    updateColumns?: AnyFunction
    hasSelectedRow?: boolean
  }>(),
  {
    tableColumns: () => [] as ResultColumnsData[],
    tableData: () => [] as Recordable[],
    showPagination: true,
    showOperator: true,
    tableHeight: 500,
    hasSelectedRow: true,
  }
)

const handleSelectionChange = (val: any[]) => {
  emit('selection', val)
}

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
})

const currentPage = computed({
  get: () => props.current,
  set: value => {
    emit('update:current', value)
  },
})

const pageSize = computed({
  get: () => props.size,
  set: value => {
    emit('update:size', value)
  },
})

const handleEditRecord = (row: Recordable) => {
  emit('editRecord', row)
}

const handleDeleteRecord = (row: Recordable) => {
  emit('deleteRecord', row)
}
defineExpose({
  tableRef2,
})
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
