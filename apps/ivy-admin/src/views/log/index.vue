<template>
  <div bg-white pl-10 pr-10 pb-10>
    <div flex justify-between items-center class="bline">
      <div flex items-center>
        <div leading-30 h-20 font-600 text-size-6 mr-2>日志管理</div>
        <div color="#86909C" leading-18 h-5.5>列表</div>
      </div>
      <div flex items-center mt-8>
        <el-button type="primary">
          导出当前范围日志
          <el-icon class="el-icon--right"><Upload /></el-icon>
        </el-button>
      </div>
    </div>

    <el-form label-width="80px" flex flex-wrap mt-8 justify-between>
      <el-form-item label="所属应用">
        <el-select v-model="value1" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="操作人">
        <el-input v-model="input" placeholder="请输入姓名" clearable />
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="value2" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="营业时间" class="demo-date-picker">
        <div class="block">
          <el-date-picker
            v-model="value3"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-value="[new Date(2010, 9, 1), new Date(2010, 10, 1)]"
          />
        </div>
      </el-form-item>
    </el-form>

    <SelectionExpandTable
      :loading="loading"
      :total="total"
      v-model:current="current"
      v-model:size="size"
      :table-columns="tableColumns"
      :table-data="tableData"
      ref="tableRef"
      :table-height="tableHeight"
      :has-selected-row="hasSelectedRow"
      row-key="equipmentNo"
      @delete-record="handleDeleteRecord"
      @selection="onSelectChange"
      @selection-all="onSelectAll"
      @batchexport="onExportTable('充电桩管理')"
    ></SelectionExpandTable>
  </div>
</template>

<script setup lang="ts">
import { API, EquipmentDeleteRow, getDossierList } from '@/api/dossier'
import { ResultEquipmentStruct } from '@/api/dossier/model'
import useQueryTable from '@/hooks/web/useQueryTable'
import { useGlobalStore } from '@/store'
import { getAreaPath } from '@/utils'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SelectionExpandTable from './components/SelectionExpandTable.vue'

const useGlobal = useGlobalStore()

const value1 = ref('')
const value2 = ref('')
const input = ref('')
const options = [
  { value: 'Option1', label: 'Option1' },
  { value: 'Option2', label: 'Option2' },
]
const value3 = ref('')

const {
  tableData,
  tableColumns,
  // columns,
  loading,
  size,
  current,
  total,
  tableHeight,
  fetchTableList,
  tableRef,
  hasSelectedRow,
  onSelectChange,
  onSelectAll,
  onExportTable,
  // allSelectedData,
  // onGetAllSelectedRows,
} = useQueryTable(getDossierList, {
  requestUrl: API.EQUIPMENT_MANAGER,
  queryParams: { data: { supervisionOrgNo: '340100' } },
  customColumns: [
    { name: 'id', minWidth: 120 },
    { name: 'createdTime', minWidth: 200 },
    { name: 'address', minWidth: 200 },
    { name: 'areaName', title: '区域' },
    {
      name: 'supervisionOrgNo',
      title: '区域',
      decode: row => {
        return getAreaPath(useGlobal.areaList, row['supervisionOrgNo'])
      },
    },
    { name: 'equipmentNo', minWidth: 170 },
    { name: 'equipmentName', minWidth: 260 },
    {
      name: 'operatorName',
      minWidth: 180,
    },
    { name: 'stationName', minWidth: 230 },
    { name: 'stationNo', minWidth: 210 },
    { name: 'producedDate', minWidth: 190 },
    { name: 'constructionDate', minWidth: 200 },
    { name: 'onlineTime', minWidth: 190 },
    { name: 'buildDate', minWidth: 200 },
  ],
  expectOrderColumnNames: [
    'id',
    'areaName',
    'equipmentNo',
    'equipmentName',
    'operatorName',
    'supplierName',
    'stationName',
    'connectorCount',
  ],
  expectOmitedColumnNames: ['id'],
})

const handleDeleteRecord = async (row: ResultEquipmentStruct) => {
  await EquipmentDeleteRow(row.id)
  ElMessage.success({
    message: '删除成功',
  })
  fetchTableList()
}
</script>

<style scoped lang="scss">
.bline {
  border-bottom: solid 1px #e5e6eb;
  padding-bottom: 10px;
}

.demo-date-picker.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
</style>
