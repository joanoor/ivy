<template>
  <div bg-white p-5>
    <SearchContainer
      mode="vertical"
      class="line bline"
      pb-5
      mb-5
      @search="
        fetchTableList({
          queryParams: {
            data: searchForm,
          },
        })
      "
      @reset="
        handleResetForm(() =>
          fetchTableList(
            {
              queryParams: {
                data: searchForm,
              },
            },
            {
              deepmerge2: false,
            }
          )
        )
      "
    >
      <el-form
        :model="searchForm"
        ref="formRef"
        label-width="120px"
        flex
        flex-wrap
      >
        <el-form-item label="区域">
          <el-cascader
            class="w-full!"
            v-model="cascaderValue"
            :options="useGlobal.areas"
            :props="props"
            placeholder="请选择区域"
            @change="handleChange"
            ref="cascaderRef"
            popper-class="archive-cascader"
          />
          <!-- <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.supervisionOrgs"
            placeholder="请选择区域"
          >
            <el-option
              v-for="item in useGlobal.supervisionOrgs"
              :key="item.supervisionOrgNo"
              :label="item.supervisionOrgName"
              :value="item.supervisionOrgNo"
            ></el-option>
          </el-select> -->
        </el-form-item>

        <el-form-item label="计量设备编号">
          <el-input
            clearable
            v-model="searchForm.measureModuleNo"
            placeholder="请输入计量设备编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="计量设备名称">
          <el-input
            clearable
            v-model="searchForm.measureModuleName"
            placeholder="请输入计量设备名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="充电桩名称">
          <el-input
            clearable
            v-model="searchForm.equipmentName"
            placeholder="请输入充电桩名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="供应商名称">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.supplierName"
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in supplierList?.result"
              :key="item.id"
              :label="item.supplierName"
              :value="item.supplierNo"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </SearchContainer>
    <SelectionTable
      :loading="loading"
      :total="total"
      v-model:current="current"
      v-model:size="size"
      :table-data="tableData"
      :table-columns="tableColumns"
      ref="tableRef"
      :table-height="tableHeight"
      :has-selected-row="hasSelectedRow"
      :can-select-this-row="row => row.measureStatus === '0'"
      @selection="onSelectChange"
      @selection-all="onSelectAll"
      @batchexport="onExportTable('充电记录')"
    >
      <template #default="{ row }">
        <div flex items-center>
          <el-button
            link
            type="primary"
            size="default"
            :disabled="row.measureStatus !== '0'"
            @click="handleClickRow(row)"
          >
            设置
          </el-button>
        </div>
      </template>
      <template #button>
        <el-button
          type="info"
          size="default"
          @click="handleBatchCheck"
          :disabled="!hasSelectedRow"
        >
          批量设置
        </el-button>
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="onExportTable('复核任务管理')"
        >
          {{ hasSelectedRow ? '导出所选' : '导出全部' }}
        </el-button>
      </template>
    </SelectionTable>
    <el-dialog
      v-model="dialogVisiable"
      :title="dialogTitle"
      class="modify-param"
      width="520px"
      align-center
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="110px"
        :inline="false"
        size="default"
      >
        <el-form-item label="计量设备名称">
          <el-input
            v-if="isSingleReview"
            v-model="currentSelectedRecord.measureModuleName"
            disabled
          ></el-input>
          <el-select
            v-else
            class="w-full!"
            v-model="data.measureModuleNames"
            multiple
            disabled
            collapse-tags
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in allSelectedData"
              :key="item.id"
              :label="item.measureModuleName"
              :value="item.measureModuleName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计量设备编号">
          <el-input
            v-if="isSingleReview"
            v-model="currentSelectedRecord.measureModuleNo"
            disabled
          ></el-input>
          <el-select
            v-else
            class="w-full!"
            v-model="data.measureModuleNos"
            multiple
            disabled
            collapse-tags
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in allSelectedData"
              :key="item.id"
              :label="item.measureModuleNo"
              :value="item.measureModuleNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测频率 (秒)" prop="frequency">
          <el-input
            :disabled="disabled"
            clearable
            v-model="form.frequency"
            placeholder="请输入监测频率"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SearchContainer from '@/components/SearchContainer.vue'
import useForm from '@/hooks/web/useForm'
import { useGlobalStore } from '@/store'
import SelectionTable from '@/components/Table/SelectionTable.vue'
import useQueryTable, { GenStruct } from '@/hooks/web/useQueryTable'
import { getJDManagerList } from '@/api/jdmanager'
import useDialog from '@/hooks/web/useDialog'
import { Download } from '@element-plus/icons-vue'
import { getAllSupplier } from '@/api/dossier'
import { getCJInfo, modifyCj } from '@/api/running'
import { formatToDateTime } from '@/utils/dateUtil'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@vue/shared'
import { getAreaPath } from '@/utils/index'

const useGlobal = useGlobalStore()
const { cascaderValue, props, handleChange, cascaderRef } = useCascader(
  '340100',
  undefined,
  value => {
    if (isArray(value)) {
      searchForm.value.verificationOrgNo = value[value.length - 1]
      fetchTableList({
        queryParams: {
          data: {
            verificationOrgNo: value[value.length - 1] + '',
          },
        },
      })
    }
  }
)

const { data: supplierList } = useRequest(getAllSupplier)

const { form: searchForm, handleResetForm } = useForm([
  {
    name: 'verificationOrgNo',
    default: '340100',
  },
  'measureModuleNo',
  'measureModuleName',
  'equipmentName',
  'supplierName',
])

const {
  tableData,
  tableColumns,
  tableHeight,
  tableRef,
  loading,
  total,
  current,
  size,
  currentSelectedRecord,
  hasSelectedRow,
  allSelectedData,
  onCurrentSelectRecord,
  onSelectChange,
  onSelectAll,
  onExportTable,
  onGetAllSelectedRows,
  fetchTableList,
} = useQueryTable(getCJInfo, {
  queryParams: {
    data: {
      verificationOrgNo: '340100',
    },
  },
  customColumns: [
    {
      name: 'measureModuleName',
      minWidth: '320',
    },
    {
      name: 'measureModuleNo',
      minWidth: '200',
    },
    {
      name: 'frequency',
      fixed: 'right',
    },
    {
      name: 'verificationOrgNo',
      title: '区域',
      decode: row => {
        return getAreaPath(useGlobal.areaList, row['verificationOrgNo'])
      },
    },
  ],
  expectOmitedColumnNames: ['id', 'content'],
  expectOrderColumnNames: ['verificationOrgNo'],
})

const {
  form,
  rules,
  onSubmitForm,
  formRef,
  onInitialForm,
  onEchoForm,
  onResetForm,
} = useForm(
  ['measureModuleNo', 'commAddress', { name: 'frequency', required: true }],
  tableColumns,
  {
    expectOmitedColumnNames: ['commAddress'],
  }
)

const isSingleReview = ref(true)
const data = reactive({
  measureModuleNos: [] as string[],
  measureModuleNames: [] as string[],
})

const { dialogTitle, dialogVisiable, disabled } = useDialog(
  () => {
    onEchoForm(currentSelectedRecord.value)
  },
  () => {
    onInitialForm()
    onResetForm()
    fetchTableList()
  }
)

const handleClickRow = (row: GenStruct<typeof getJDManagerList>) => {
  dialogTitle.value = '设置检测频率'
  dialogVisiable.value = true
  isSingleReview.value = true
  onCurrentSelectRecord(row)
}

const handleBatchCheck = () => {
  onGetAllSelectedRows()
  dialogTitle.value = '设置检测频率'
  dialogVisiable.value = true
  isSingleReview.value = false

  data.measureModuleNames = allSelectedData.value.map(v => v.measureModuleName)
  data.measureModuleNos = allSelectedData.value.map(v => v.measureModuleNo)
}

const handleConfirm = () => {
  onSubmitForm(async valid => {
    console.log('+++++++++', valid, disabled.value, form.value)
    if (valid) {
      if (!disabled.value) {
        const objs = !isSingleReview.value
          ? allSelectedData.value.map(v => ({
              frequency: form.value.frequency,
              date: formatToDateTime(),
              measureModuleNo: v.measureModuleNo,
              commAddress: v.commAddress,
            }))
          : [
              {
                frequency: form.value.frequency,
                date: formatToDateTime(),
                measureModuleNo: form.value.measureModuleNo,
                commAddress: form.value.commAddress,
              },
            ]

        await modifyCj(objs, { showSuccessModal: true })
      }
    }
    dialogVisiable.value = false
  })
}
</script>

<style lang="scss">
.modify-param {
  .el-dialog__body {
    padding: 40px !important;
    .el-input__wrapper {
      width: 100% !important;
    }
  }
  .el-tag.el-tag--info {
    --el-tag-text-color: #1d2129 !important;
  }
}
</style>
