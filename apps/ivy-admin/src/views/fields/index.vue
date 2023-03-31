<template>
  <div bg-white pl-10 pr-10 pb-10>
    <div flex justify-between items-center class="bline">
      <div flex items-center>
        <div leading-30 h-20 font-600 text-size-6 mr-2>字段管理</div>
        <div color="#86909C" leading-18 h-5.5>对系统中固定的数据进行维护</div>
      </div>
      <div flex items-center mt-8>
        <el-button type="default">字段模板下载</el-button>
        <el-button type="default">导入字段</el-button>
      </div>
    </div>

    <div flex>
      <div flex-col p-5 pl-2 class="regions-left">
        <div pb-5 mb-5 class="regions-left-upper bline">
          <ButtonList mb-2 mt-1>
            <template #left items-center mt-8>
              <el-input
                v-model="input1"
                placeholder="搜索"
                class="input-with-select"
              >
                <template #prepend>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <el-button type="default" :icon="Plus" ml-5>新建</el-button>
            </template>
          </ButtonList>
        </div>

        <div
          overflow-hidden
          overflow-y-scroll
          class="regions-left-down scrollbar"
          v-loading="mainFieldLoading"
        >
          <div
            flex
            items-center
            justify-between
            cursor-pointer
            v-for="dict in mainFieldTableData"
            :key="dict.codeSortId"
            :style="
              currentSelectedRecord?.codeSortId === dict.codeSortId
                ? 'color:#0FC6C2'
                : 'color:#4E5969'
            "
            @click="onCurrentSelectRecord(dict)"
          >
            <div flex items-center>
              <el-icon :size="20" class="mr-2">
                <i-iemp-field></i-iemp-field>
              </el-icon>
              <div leading-8>
                {{ dict.name }}
              </div>
            </div>
            <el-popover
              v-if="currentSelectedRecord.name === dict.name"
              placement="bottom"
              :width="100"
              trigger="click"
              :show-arrow="false"
            >
              <template #reference>
                <el-icon :size="24" cursor-pointer right-4 @click.prevent="">
                  <SvgIcon name="more"></SvgIcon>
                </el-icon>
              </template>
              <div flex-col items-center justify-center>
                <div
                  w-full
                  text-center
                  cursor-pointer
                  hover:text-primary
                  p-2
                  border-b-solid
                  border-b-1
                  border-primary
                >
                  编辑
                </div>
                <div
                  w-full
                  text-center
                  cursor-pointer
                  hover:text-primary
                  p-2
                  @click=""
                >
                  删除
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>

      <div flex-1 p-5 flex flex-col class="regions-right">
        <ButtonList mb-5>
          <template #left>
            <div style="font-size: 16px; color: #1d2129; font-weight: 600">
              {{ currentSelectedRecord?.name }}
            </div>
            <div ml-5>
              <el-icon :size="20" pt-1.5>
                <i-iemp-field></i-iemp-field>
              </el-icon>
            </div>
            <div ml-0.5 mt-1>
              {{ currentSelectedRecord?.dispSn }}
            </div>
          </template>
          <template #right>
            <el-button type="primary" :icon="Plus" size="default" @click="">
              新增子字段
            </el-button>
          </template>
        </ButtonList>

        <NrztTable
          ref="tableRef"
          :loading="subFieldLoading"
          v-model:current="current2"
          v-model:size="size2"
          :total="total2"
          :table-data="subFieldTableData"
          :table-columns="subFieldTableColumns"
          :table-height="subTableHeight"
        >
          <template #button>
            <!-- 占位 -->
            <div></div>
          </template>
        </NrztTable>
      </div>
    </div>

    <!-- <div flex justify-between>
      <div flex justify-between items-center class="bline line">
        <div flex items-center mt-8>
          <el-input
            v-model="input1"
            placeholder="搜索"
            class="input-with-select"
          >
            <template #prepend>
              <el-button :icon="Search" />
            </template>
          </el-input>
          <el-button type="default" :icon="Plus">新建</el-button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import ButtonList from '@/components/ButtonList.vue'
import { Search, Plus } from '@element-plus/icons-vue'
import useQueryList from '@/hooks/web/useQueryList'
import { getMainCodePage, getSubCodePage } from '@/api/system'
import NrztTable from '@/components/Table/NrztTable.vue'
import useQueryTable from '@/hooks/web/useQueryTable'

// 主字段列表接口
const {
  loading: mainFieldLoading,
  tableData: mainFieldTableData,
  columns: mainFieldColumns,
  fetchTableList: fetchMainFieldList,
  currentSelectedRecord,
  onCurrentSelectRecord,
} = useQueryList(getMainCodePage)

// 子字段列表接口
const {
  loading: subFieldLoading,
  tableData: subFieldTableData,
  columns: subFieldColumns,
  tableColumns: subFieldTableColumns,
  fetchTableList: fetchSubFieldList,
  tableRef,
  current: current2,
  tableHeight: subTableHeight,
  size: size2,
  total: total2,
} = useQueryTable(getSubCodePage, {
  queryParams: {
    page: {
      size: 20,
      current: 1,
    },
  },
  lazy: true,
  customColumns: [
    {
      name: 'name',
      width: '',
    },
    {
      name: 'value',
      width: '',
    },
  ],
  expectOmitedColumnNames: ['codeSortId', 'codeId'],
  expectOrderColumnNames: ['name', 'value'],
})

watch(currentSelectedRecord, newValue => {
  fetchSubFieldList({
    queryParams: {
      data: { codeSortId: newValue.codeSortId },
    },
  })
})

const input1 = ref('')
</script>

<style scoped lang="scss">
.bline {
  border-bottom: solid 1px #e5e6eb;
  padding-bottom: 10px;
}

.regions-left {
  border-right: solid 1px #e5e6eb;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
