<template>
  <el-table
    :data="tableData"
    border
    v-loading="loading"
    :height="tableHeight"
    header-row-class-name="iemp-table-header"
    mb-5
    @select-all="handleSelectionAll"
    @selection-change="handleSelectionChange"
    @expand-change="handleExpandChange"
    ref="tableRef2"
    :row-key="rowKey"
  >
    <template v-if="tableData.length === 0">
      <el-empty w-full h-full description="暂无数据" />
    </template>
    <template v-else>
      <el-table-column type="selection" width="50" />
      <el-table-column type="expand" width="50">
        <template #default="props">
          <div class="inner-expand">
            <!-- <div font-600 text-size-4 color-black leading-6 mb-2>设备详情</div> -->
            <el-table
              header-row-class-name="iemp-table-header"
              :data="props.row.measureLeafVOList"
              border
            >
              <el-table-column
                text
                label="充电接口名称"
                show-overflow-tooltip
                prop="connectorName"
              />
              <el-table-column
                label="充电接口编号"
                prop="connectorNo"
                width="260"
                show-overflow-tooltip
              />
              <el-table-column
                show-overflow-tooltip
                label="充电桩编号"
                prop="equipmentNo"
              />
              <el-table-column
                show-overflow-tooltip
                label="计量模块编号"
                prop="measureModuleNo"
              />
              <el-table-column
                label="计量模块名称"
                show-overflow-tooltip
                prop="measureModuleName"
                width="280"
              />
              <el-table-column
                label="通讯地址"
                show-overflow-tooltip
                prop="commAddress"
              />
              <el-table-column
                label="绑定时间"
                show-overflow-tooltip
                prop="bindTime"
              />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    size="default"
                    @click="handleBindEquip(scope.row)"
                  >
                    {{ scope.row.connectorNo ? '重新绑定' : '绑定' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <slot :row="scope.row" :serial="scope.$index">
            <div flex items-center>
              <el-button
                link
                type="primary"
                size="default"
                @click="handleToggle(scope.row)"
              >
                {{ hasExpanded(scope.row) ? '收起' : '展开' }}
              </el-button>
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
import { Download } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'
import useDecodeDict from '@/hooks/web/useDecodeDict'
import ButtonList from '@/components/ButtonList.vue'

const tableRef2 = ref<HTMLElement>()
const myExpandedRows = ref<any[]>([])
const expandRowKeys = ref<string[]>([])

const emit = defineEmits([
  'update:current',
  'update:size',
  'editRecord',
  'deleteRecord',
  'selection',
  'selectionAll',
  'batchexport',
  'bind',
])

const props = withDefaults(
  defineProps<{
    loading: boolean
    tableColumns?: ResultColumnsData[]
    tableData?: Recordable[]
    total?: number
    current?: number
    size?: number
    tableHeight?: number
    showPagination?: boolean
    updateColumns?: AnyFunction
    hasSelectedRow?: boolean
    rowKey?: string
    expandKeys?: string[]
  }>(),
  {
    tableColumns: () => [] as ResultColumnsData[],
    tableData: () => [] as Recordable[],
    showPagination: true,
    tableHeight: 500,
    hasSelectedRow: true,
    expandKeys: () => [],
  }
)

const handleSelectionChange = <T>(val: T) => {
  emit('selection', val)
}

const handleSelectionAll = <T>(val: T) => {
  emit('selectionAll', val)
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

const hasExpanded = (row: Recordable) =>
  myExpandedRows.value.some(v => v.equipmentNo === row.equipmentNo)

const handleEditRecord = (row: Recordable) => {
  emit('editRecord', row)
}

const handleDeleteRecord = (row: Recordable) => {
  emit('deleteRecord', row)
}

const handleBindEquip = (row: Recordable) => {
  emit('bind', row)
}

const handleExpandChange = (_row, expandedRows) => {
  // row.expand2 = !row.expand2
  if (tableRef2.value) {
    // @ts-ignore
    myExpandedRows.value = expandedRows
  }
}

const handleToggle = row => {
  if (tableRef2.value) {
    // const expandedFlag=
    // @ts-ignore
    tableRef2.value.toggleRowExpansion(row, !hasExpanded(row))
    // if()
    // expandRowKeys.value = [row.equipmentNo]
  }
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
.inner-expand {
  // width: 80%;
  padding: 20px;
}
.scrapped {
  background-color: #ff7d00;
}
</style>
