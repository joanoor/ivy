<template>
  <div bg-white pl-5 pr-5 pb-5>
    <SearchContainer
      mode="horizontal"
      class="line bline"
      pt-5
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
        <!-- <el-form-item label="区域">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.supervisionOrgs"
            placeholder="请选择"
          >
            <el-option
              v-for="item in useGlobal.supervisionOrgs"
              :key="item.supervisionOrgNo"
              :label="item.supervisionOrgName"
              :value="item.supervisionOrgNo"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="计量设备编号">
          <el-input
            clearable
            v-model="searchForm.measureModuleNo"
            placeholder="请输入编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="计量设备名称">
          <el-input
            clearable
            v-model="searchForm.measureModuleName"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="计量设备类型">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.measureModuleType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in useGlobal.dicts['MEASURE_MODULE_TYPE']"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </SearchContainer>
    <ButtonList mb-5>
      <template #left>
        <el-button
          type="primary"
          size="default"
          :icon="Plus"
          @click="handleAddMeterage"
        >
          新增
        </el-button>
        <el-button
          type="info"
          size="default"
          mr-2
          @click="downloadTemplate('/计量设备导入模板.xlsx')"
        >
          模板下载
        </el-button>
        <el-upload
          class="upload mr-2"
          :auto-upload="false"
          action=""
          :on-change="(e: UploadFile) => uploadExcel(e,transformData,callback)"
          :show-file-list="false"
        >
          <el-button type="info">批量导入</el-button>
        </el-upload>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#FF7D00"
          title="确认删除这些选中的记录？"
          :width="400"
          @confirm="handleBatchDelete"
        >
          <template #reference>
            <el-button
              type="info"
              size="default"
              :disabled="tableData.length === 0"
            >
              批量删除
            </el-button>
          </template>
        </el-popconfirm>

        <el-popover placement="right" trigger="click">
          <template #reference>
            <el-button type="info" size="default" @click="handleSetShow">
              显示设置
            </el-button>
          </template>
          <PopoverColumn
            v-model:table-columns="tableColumns"
            :columns="columns"
          ></PopoverColumn>
        </el-popover>
      </template>
    </ButtonList>
    <SelectionTable
      @selection="handleSelection"
      :loading="loading"
      :table-columns="tableColumns"
      :table-data="tableData"
      :total="total"
      v-model:current="current"
      v-model:size="size"
      ref="tableRef"
      :table-height="tableHeight"
      @delete-record="handleDeleteRecord"
      @edit-record="handleEditMeterage"
      :has-selected-row="hasSelectedRow"
      @selection-all="onSelectAll"
    >
      <template #button>
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="onExportTable('计量设备管理')"
        >
          {{ hasSelectedRow ? '导出所选' : '导出全部' }}
        </el-button>
      </template>
    </SelectionTable>
  </div>

  <el-dialog
    v-model="dialogVisiable"
    :title="dialogTitle"
    width="30%"
    align-center
    class="meterage"
  >
    <el-form :model="form2" :rules="rules2" ref="formRef2" label-width="140px">
      <el-form-item
        v-for="col in formColumns"
        :key="col.name"
        :prop="col.name"
        :label="col.title"
        pr-10
      >
        <template v-if="col.component === 'input'">
          <el-input
            v-model="form2[col.name]"
            :placeholder="col.message"
            :disabled="
              col.name === 'measureModuleNo' && dialogTitle.includes('修改')
            "
          ></el-input>
        </template>
        <template v-else-if="col.component === 'inputselect'"></template>
        <template v-else-if="col.component === 'select'">
          <template v-if="col.name === 'supplierNo'">
            <!-- <el-form-item prop="supplierNo" label="计量设备供应商"> -->
            <el-select
              v-model="form2.supplierNo"
              placeholder="请选择"
              clearable
              filterable
              class="w-full!"
            >
              <el-option
                v-for="item in supplierList?.result"
                :key="item.supplierNo"
                :label="item.supplierName"
                :value="item.supplierNo"
              ></el-option>
            </el-select>
            <!-- </el-form-item> -->
          </template>

          <template v-else-if="col.name === 'verificationOrgNo'">
            <!-- <el-form-item prop="supplierNo" label="计量设备供应商"> -->
            <el-select
              v-model="form2.verificationOrgNo"
              placeholder="请选择"
              clearable
              filterable
              class="w-full!"
            >
              <el-option
                v-for="item in useGlobal.verificationOrgs.filter(
                  v => v.parentOrgNo
                )"
                :key="item.verificationOrgNo"
                :label="item.verificationOrgName"
                :value="item.verificationOrgNo"
              ></el-option>
            </el-select>
            <!-- </el-form-item> -->
          </template>

          <template v-else-if="col.name === 'measureModuleType'">
            <!-- <el-form-item prop="supplierNo" label="计量设备供应商"> -->
            <el-select
              v-model="form2.measureModuleType"
              placeholder="请选择"
              clearable
              filterable
              class="w-full!"
            >
              <el-option
                v-for="item in useGlobal.dicts['MEASURE_MODULE_TYPE']"
                :key="item.codeId"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- </el-form-item> -->
          </template>

          <template v-else>
            <el-select
              v-model="form2[col.name]"
              :placeholder="col.message"
              clearable
              filterable
              class="w-full!"
            >
              <el-option
                v-for="item in col.selectOption"
                :key="item.codeId"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </template>
        <template v-else-if="col.component === 'time'">
          <!-- <el-date-picker
          class="w-full!"
            v-model="rules2.date1"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
          /> -->
          <el-date-picker
            class="w-full!"
            v-model="form2[col.name]"
            type="datetime"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
          />
        </template>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisiable = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef2)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import SearchContainer from '@/components/SearchContainer.vue'
import ButtonList from '@/components/ButtonList.vue'
import { Plus, Download, InfoFilled } from '@element-plus/icons-vue'

import { getDossierList } from '@/api/dossier'
import SelectionTable from '@/components/Table/SelectionTable.vue'

import useDialog from '@/hooks/web/useDialog'
import useQueryTable from '@/hooks/web/useQueryTable'

import { ResultMeterageStruct } from '@/api/dossier/model'
import { MeterageDeleteRow } from '@/api/dossier/index'
import { submitForm } from '@/utils/formAndRules/form'
import { getAreaPath, downloadTemplate } from '@/utils/index'

import {
  MeterageBatchDelete,
  addMeteragemanage,
  MeterageEditRow,
} from '@/api/dossier'
import { ElMessage, UploadFile } from 'element-plus'
import { API, getAllSupplier, batchAddMeasureModule } from '@/api/dossier'
import { useGlobalStore } from '@/store'
import PopoverColumn from './components/PopoverColumn.vue'
import { isArray } from '@ivy/core'
import { formatToDateTime } from '@/utils/dateUtil'
import useDownload from '@/hooks/web/useDownload'

const useGlobal = useGlobalStore()
const { uploadExcel } = useDownload()

const transformData = (data: Recordable[]) => {
  const convertDatas = [
    {
      name: '供应商(编号)',
      value: '供应商编号',
    },
    {
      name: '设备类型(编号)',
      value: '计量设备类型',
    },
    {
      name: '检定单位(编号)',
      value: '检定单位',
    },
    {
      name: '建档日期',
      value: '建档日期（档案同步日期）',
    },
  ]
  return data.map(v => {
    let result: Recordable = {}
    Object.keys(v).forEach(key2 => {
      const tmpArr = convertDatas.filter(cd => cd.name === key2)
      let tmpKey = ''
      if (tmpArr.length === 1) {
        tmpKey = tmpArr[0].value
      } else {
        tmpKey = key2
      }
      const key = tmpKey.replace('（编号）', '').replace('(编号)', '')
      const tmpColumn = columns.value.find(column => column.title === key)

      if (tmpColumn) {
        result[tmpColumn['name']] = v[key2]
      } else {
        result[key2] = v[key2]
      }
    })
    return result
  })
}

const callback = async (data: Recordable[]) => {
  await batchAddMeasureModule(data)
  fetchTableList()
}
const { data: supplierList } = useRequest(getAllSupplier)

const {
  form: searchForm,
  formRef,
  handleResetForm,
} = useForm(['measureModuleType', 'measureModuleNo', 'measureModuleName'])

const {
  tableData,
  tableColumns,
  columns,
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
  allSelectedData,
  onGetAllSelectedRows,
} = useQueryTable(getDossierList, {
  requestUrl: API.METERRAGE_MANAGER,
  queryParams: { data: {} },
  customColumns: [
    {
      name: 'createdTime',
      minWidth: 200,
    },
    {
      name: 'address',
      minWidth: 200,
    },
    {
      name: 'verificationOrgNo',
      title: '检定单位',
      decode: row => {
        return getAreaPath(useGlobal.areaList, row['verificationOrgNo'])
      },
    },
    {
      name: 'measureModuleNo',
      title: '计量设备编号',
    },
    {
      name: 'measureModuleName',
      title: '计量设备名称',
      minWidth: 240,
    },
    {
      name: 'measureModuleType',
      title: '计量设备类型',
    },
    {
      name: 'measureStatus',
      title: '计量设备状态',
    },
    {
      name: 'commAddress',
      minWidth: 220,
      title: '计量设备通讯地址',
    },
    {
      name: 'buildDate',
      minWidth: 200,
    },
  ],
  expectOrderColumnNames: [
    'id',
    'measureModuleNo',
    'measureModuleName',
    'measureModuleType',
  ],
  expectOmitedColumnNames: ['id', 'measureStatus'],
})

const { dialogVisiable, dialogTitle } = useDialog(undefined, () => {
  onInitialForm()
  onResetForm()
})

const {
  form: form2,
  formRef: formRef2,
  rules: rules2,
  formColumns,
  onEchoForm,
  onResetForm,
  onInitialForm,
} = useForm(
  [
    'id',
    'buildDate',
    {
      name: 'measureModuleName',
      required: true,
      title: '计量设备名称',
    },
    {
      name: 'measureModuleNo',
      required: true,
      title: '计量设备编号',
    },
    {
      name: 'supplierNo',
      required: true,
      title: '供应商',
      component: 'select',
    },
    {
      name: 'measureModuleType',
      required: true,
      title: '设备类型',
      component: 'select',
    },
    {
      name: 'verificationOrgNo',
      required: true,
      title: '检定单位',
      component: 'select',
      rule: [
        {
          // type: 'array',
          required: true,
          message: '请选择',
          trigger: 'change',
        },
      ],
    },
    {
      name: 'commAddress',
      title: '计量设备通讯地址',
    },
    {
      name: 'measureStatus',
      default: '2',
    },
  ],

  columns,
  {
    expectOmitedColumnNames: ['measureStatus', 'id', 'buildDate'],
    customDictionary: {
      CONNECTORTYPE: useGlobal.dicts['connector_type'],
    },
  }
)
// onMounted(()=>{
//   document.getElementsByClassName('el-range__close-icon')[0].className += ' el-icon-date'; //在原来的后面加这个
// })

const handleSubmit = submitForm(async (valid?: boolean) => {
  if (valid) {
    if (isArray(form2.value.verificationOrgNo)) {
      form2.value.verificationOrgNo =
        form2.value.verificationOrgNo[form2.value.verificationOrgNo.length - 1]
    }

    if (dialogTitle.value.includes('新增')) {
      form2.value.buildDate = formatToDateTime()
      await addMeteragemanage(form2.value)
      dialogVisiable.value = false
      fetchTableList()
    } else if (dialogTitle.value.includes('修改')) {
      MeterageEditRow(form2.value).then(() => {
        ElMessage.success('修改成功')
        dialogVisiable.value = false
        fetchTableList()
      })
    } else {
      console.log('取消')
    }
  }
})

const handleDeleteRecord = async (row: ResultMeterageStruct) => {
  await MeterageDeleteRow(row.id)
  ElMessage.success({
    message: '删除成功',
  })
  fetchTableList()
}

const handleAddMeterage = () => {
  dialogTitle.value = '新增计量设备'
  dialogVisiable.value = true
}

const handleEditMeterage = (row: ResultMeterageStruct) => {
  dialogTitle.value = '修改计量设备'
  dialogVisiable.value = true
  onEchoForm(row)
}

// const resetSearch = () => {
//   form.value = cloneDeep(originalForm.value)
//   fetchTableList()
// }

const ids = ref<number[]>([])
const handleSelection = (val: any[]) => {
  ids.value = val.map(v => v.id)
  onSelectChange(val)
}

const handleBatchDelete = async () => {
  onGetAllSelectedRows()
  if (allSelectedData.value.length > 0) {
    await MeterageBatchDelete(ids.value)
    fetchTableList()
  } else {
    ElMessage.error('没有选择删除项')
  }
}

const handleSetShow = () => {}
</script>
<style lang="scss">
.meterage {
  .el-input__wrapper {
    width: 100% !important;
  }
  .el-popover {
    width: 210px !important;
  }
}
</style>
