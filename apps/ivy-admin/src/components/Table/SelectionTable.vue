<template>
  <el-table
    :data="tableData"
    border
    v-loading="loading"
    :height="tableHeight"
    header-row-class-name="iemp-table-header"
    mb-5
    @select-all="val => $emit('selectionAll', val)"
    @selection-change="val => $emit('selection', val)"
    ref="tableRef2"
  >
    <template v-if="tableData.length === 0">
      <el-empty w-full h-full description="暂无数据" />
    </template>
    <template v-else>
      <el-table-column
        type="selection"
        width="50"
        :selectable="canSelectThisRow"
      />
      <template v-for="col in tableColumns" :key="col.name">
        <el-table-column
          v-if="!col.hidden"
          :prop="col.name"
          :label="col.title"
          :width="col.width"
          :min-width="col.minWidth"
          :fixed="col.fixed"
          show-overflow-tooltip
        >
          <template #default="scope">
            <template
              v-if="['operatorStatus', 'supplierStatus'].includes(col.name)"
            >
              <div flex items-center>
                <div
                  class="dotClass"
                  :class="scope.row[col.name] === '0' ? 'enabled' : 'disabled'"
                ></div>
                <span class="statusClass">
                  {{ onDecodeDict(scope.row, col.name, col.dictName) }}
                </span>
              </div>
            </template>
            <template v-else-if="['equipStatus'].includes(col.name)">
              <div flex items-center>
                <div
                  class="dotClass"
                  :class="
                    scope.row[col.name] === '1'
                      ? 'enabled'
                      : scope.row[col.name] === '2'
                      ? 'maintain'
                      : scope.row[col.name] === '3'
                      ? 'disabled'
                      : 'shutoutn'
                  "
                ></div>
                <span class="statusClass">
                  {{ onDecodeDict(scope.row, col.name, col.dictName) }}
                </span>
              </div>
            </template>

            <template v-else-if="['measureStatus'].includes(col.name)">
              <div flex items-center>
                <div
                  class="dotClass"
                  :class="
                    scope.row[col.name] === '0'
                      ? 'enabled'
                      : scope.row[col.name] === '1'
                      ? 'disabled'
                      : 'shutoutn'
                  "
                ></div>
                <span class="statusClass">
                  {{ onDecodeDict(scope.row, col.name, col.dictName) }}
                </span>
              </div>
            </template>

            <template v-else-if="['stationStatus'].includes(col.name)">
              <div flex items-center>
                <div
                  class="dotClass"
                  :class="
                    scope.row[col.name] === '50'
                      ? 'enabled'
                      : scope.row[col.name] === '6'
                      ? 'maintain'
                      : scope.row[col.name] === '5'
                      ? 'disabled'
                      : scope.row[col.name] === '1'
                      ? 'shutoutn'
                      : 'unknown'
                  "
                ></div>
                <span class="statusClass">
                  {{ onDecodeDict(scope.row, col.name, col.dictName) }}
                </span>
              </div>
            </template>

            <template v-else-if="col.name === 'checkResult'">
              <el-tag
                class="ml-2 checkResult"
                :type="
                  scope.row[col.name] === '0'
                    ? 'success'
                    : scope.row[col.name] === '1'
                    ? 'danger'
                    : scope.row[col.name] === '2'
                    ? 'danger'
                    : 'warning'
                "
              >
                {{
                  onDecodeDict(scope.row, col.name, col.dictName) || '未复核'
                }}
              </el-tag>
            </template>
            <template v-else-if="col.name === 'chargeErrorResult'">
              <el-tag
                class="ml-2 chargeErrorResult"
                :type="
                  scope.row[col.name] === '0'
                    ? 'success'
                    : scope.row[col.name] === '1'
                    ? 'danger'
                    : scope.row[col.name] === '2'
                    ? 'danger'
                    : 'warning'
                "
              >
                {{
                  onDecodeDict(scope.row, col.name, col.dictName) || '未复核'
                }}
              </el-tag>
            </template>
            <!-- <template v-else-if="['areaNo'].includes(col.name)">
              <el-cascader class="w-full! " v-model="scope.row[col.name]" :options="useGlobal.areas" disabled
                :props="props2" clearable popper-class="archive-cascader" />
            </template> -->
            <template v-else-if="col.name === 'invalidResultType'">
              <span>
                {{
                  scope.row['invalidResultType'] === 0
                    ? '无结束记录'
                    : scope.row['invalidResultType'] === 1
                    ? '充电时间过短'
                    : scope.row['invalidResultType'] === 2
                    ? '充电量过少'
                    : '--'
                }}
              </span>
            </template>
            <template v-else>
              {{
                col.decode
                  ? col.decode(scope.row)
                  : onDecodeDict(scope.row, col.name, col.dictName)
              }}
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="showOperator"
        label="操作"
        width="180"
        fixed="right"
      >
        <template #default="scope">
          <slot :row="scope.row" :serial="scope.$index">
            <div flex items-center>
              <el-button
                link
                type="primary"
                size="default"
                @click="$emit('editRecord', scope.row)"
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
                @confirm="$emit('deleteRecord', scope.row)"
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
  'selectionAll',
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
    tableHeight?: number
    showPagination?: boolean
    showOperator?: boolean
    updateColumns?: AnyFunction
    hasSelectedRow?: boolean
    canSelectThisRow?: (row, index) => boolean
  }>(),
  {
    tableColumns: () => [],
    tableData: () => [],
    showPagination: true,
    tableHeight: 500,
    hasSelectedRow: true,
    showOperator: true,
    canSelectThisRow: () => true,
  }
)

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

.dotClass {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.statusClass {
  padding-left: 15px;
}

.enabled {
  background-color: #00b42a;
}

.disabled {
  background-color: red;
}

.maintain {
  background-color: #ff7d00;
}

.shutoutn {
  background-color: #ff7d00;
}

.unknown {
  background-color: #ff7d00;
}

.scrapped {
  background-color: #ff7d00;
}
</style>

<style lang="scss">
.checkResult,
.chargeErrorResult {
  .el-tag__content {
    font-size: 13px !important;
  }
  .el-tag--info {
    span.el-tag__content {
      color: #1d2129;
    }
  }
}
</style>
