<template>
  <div bg-white pl-5 pr-5 pb-5>
    <SearchContainer
      mode="vertical"
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
        handleResetForm(() => {
          cascaderValue = '340100'
          fetchTableList({
            queryParams: {
              data: searchForm,
            },
          })
        })
      "
    >
      <el-form
        :model="searchForm"
        ref="formRef"
        label-width="120px"
        flex
        flex-wrap
      >
        <el-form-item label="区域" w-full>
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
        </el-form-item>
        <el-form-item label="充电站名称">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.stationName"
            placeholder="请选择充电站"
          >
            <el-option
              v-for="item in stationList?.result"
              :key="item.id"
              :label="item.stationName"
              :value="item.stationNo"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="充电桩编号">
          <el-input
            clearable
            v-model="searchForm.equipmentNo"
            placeholder="请输入编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="充电桩名称">
          <el-input
            class="w-full!"
            clearable
            v-model="searchForm.equipmentName"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="运营商名称">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.operatorNo"
            placeholder="请选择运营商"
          >
            <el-option
              v-for="item in operatorList?.result"
              :key="item.id"
              :label="item.operatorName"
              :value="item.operatorNo"
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
          @click="handleAddEquipment"
        >
          新增
        </el-button>
        <el-button
          type="info"
          size="default"
          mr-2
          @click="downloadTemplate('/充电桩导入编码.xlsx')"
        >
          模板下载
        </el-button>
        <el-upload
          class="upload mr-2"
          :auto-upload="false"
          action=""
          :on-change="(e: UploadFile) => uploadExcel(e,undefined,undefined,diyUploadExcel)"
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
      @edit-record="handleEditEquipment"
      @selection="onSelectChange"
      @selection-all="onSelectAll"
      @batchexport="onExportTable('充电桩管理')"
    ></SelectionExpandTable>
  </div>

  <el-dialog
    v-model="dialogVisiable"
    :title="dialogTitle"
    width="60%"
    align-center
    class="meterage1"
  >
    <el-form
      :model="form2"
      :rules="rules2"
      ref="formRef2"
      label-width="120px"
      class="datePicker"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="equipmentName" label="充电桩名称">
            <el-input
              v-model="form2.equipmentName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="equipStatus" label="充电桩状态">
            <el-radio-group v-model="form2.equipStatus">
              <el-radio
                v-for="item in useGlobal.dicts['EQUIPMENT_STATUS']"
                :label="item.value"
                :key="item.codeId"
                size="large"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="equipmentNo" label="充电桩编号">
            <el-input
              v-model="form2.equipmentNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="equipmentType" label="充电桩类型">
            <el-select
              v-model="form2.equipmentType"
              placeholder="请选择"
              clearable
              filterable
              class="w-full"
            >
              <el-option
                v-for="item in useGlobal.dicts['EQUIPMENT_TYPE']"
                :key="item.codeId"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="stationNo" label="所属充电站">
            <el-select
              v-model="form2.stationNo"
              placeholder="请选择"
              clearable
              filterable
              class="w-full!"
              @change="handleChangeStation"
            >
              <el-option
                v-for="item in stationList?.result"
                :key="item.stationNo"
                :label="item.stationName"
                :value="item.stationNo"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="level" label="等级">
            <el-select
              v-model="form2.level"
              placeholder="请选择"
              clearable
              filterable
              class="w-full"
            >
              <el-option
                v-for="item in useGlobal.dicts['PREC_LEVEL']"
                :key="item.codeId"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="supplierNo" label="供应商">
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
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ratedPower" label="额定功率">
            <el-input
              v-model="form2.ratedPower"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="connectorCount" label="充电接口数量">
            <el-radio-group
              v-model="form2.connectorCount"
              class="ml-4"
              @change="handleConnectorCountChange"
            >
              <el-radio :label="1" size="large">1</el-radio>
              <el-radio :label="2" size="large">2</el-radio>
              <el-radio :label="3" size="large">3</el-radio>
              <el-radio :label="4" size="large">4</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="producedDate" label="生产日期">
            <el-date-picker
              v-model="form2.producedDate"
              type="date"
              placeholder="请输入"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="onlinetime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-form
              style="max-height: 70vh"
              :model="dynamicValidateForm"
              overflow-hidden
              overflow-y-auto
              class="w-full! scrollbar"
              label-position="top"
              label-width="auto"
              ref="formRef3"
            >
              <div
                class="equip"
                w-full
                flex-col
                items-center
                justify-center
                mb-4
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="index"
              >
                <el-row w-full align="middle" :gutter="10">
                  <el-col :span="8">
                    <el-form-item
                      :prop="'domains.' + index + '.connectorName'"
                      :rules="{
                        required: true,
                        message: '充电接口名称不能为空',
                        trigger: 'change',
                      }"
                    >
                      <el-input
                        placeholder="请输入充电接口名称"
                        v-model="domain.connectorName"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item
                      :prop="'domains.' + index + '.connectorNo'"
                      :rules="{
                        required: true,
                        message: '充电接口编号不能为空',
                        trigger: 'change',
                      }"
                    >
                      <el-input
                        v-model="domain.connectorNo"
                        placeholder="请输入充电接口编号"
                      >
                        <template #append>
                          <el-button
                            type="primary"
                            style="color: #0fc6c2"
                            @click="handleAutoGenerate(index)"
                          >
                            自动生成
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="productModel" label="规格型号">
            <el-input
              v-model="form2.productModel"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item prop="createdTime" label="建设时间">
            <el-date-picker
              class="onlinetime"
              v-model="form2.createdTime"
              type="date"
              placeholder="请输入"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="onlineTime" label="入网时间">
            <el-date-picker
              class="onlinetime"
              v-model="form2.onlineTime"
              type="date"
              placeholder="请输入"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
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
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import SelectionExpandTable from './components/SelectionExpandTable.vue'

import {
  EquipmentBatchDelete,
  getAllOperator,
  getAllStation,
  getDossierList,
  getAllSupplier,
  batchAddConnectorManager,
  batchAddEquipment,
  batchAddConnnector,
} from '@/api/dossier'
import useDialog from '@/hooks/web/useDialog'
import useQueryTable from '@/hooks/web/useQueryTable'

import { ResultEquipmentStruct } from '@/api/dossier/model'
import { EquipmentDeleteRow } from '@/api/dossier/index'
import { submitForm } from '@/utils/formAndRules/form'
import { getAreaPath, downloadTemplate } from '@/utils/index'

import { addEquipmentmanage, EquipmentEditRow } from '@/api/dossier'
import { ElMessage, FormInstance, UploadFile } from 'element-plus'
import { API } from '@/api/dossier'
import { useGlobalStore } from '@/store'

import PopoverColumn from './components/PopoverColumn.vue'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@vue/shared'
import { formatToDateTime } from '@/utils/dateUtil'
import { cloneDeep } from 'lodash-es'
import { formChecker } from '@ivy/form'
import useDownload from '@/hooks/web/useDownload'
import { utils, WorkBook } from 'xlsx'

const useGlobal = useGlobalStore()
const { uploadExcel } = useDownload()

const diyUploadExcel = async (workbook: WorkBook) => {
  const wsname1 = workbook.SheetNames[0]

  const result1 = transformData(
    utils
      .sheet_to_json(workbook.Sheets[wsname1], {
        defval: '',
      })
      .slice(1) as Recordable[]
  )
  const wsname2 = workbook.SheetNames[1]

  const result2 = transformData(
    utils
      .sheet_to_json(workbook.Sheets[wsname2], {
        defval: '',
      })
      .slice(1) as Recordable[]
  )

  await batchAddEquipment(result1)
  await batchAddConnnector(result2)
  fetchTableList()
}

const transformData = (data: Recordable[]) => {
  const convertDatas = [
    {
      name: '供应商(编号)',
      value: '供应商编号',
    },
    {
      name: '运营商(编号)',
      value: '运营商编号',
    },
    {
      name: '所属充电站(编号)',
      value: '充电站编号',
    },
    {
      name: '建设时间',
      value: '建设日期',
    },
    {
      name: '等级(编号)',
      value: '充电桩准确度等级',
    },
    {
      name: '充电接口名称',
      value: '区域',
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
        if (tmpColumn.name === 'supervisionOrgNo') {
          result['areaNo'] = v[key2]
        }
        result[tmpColumn['name']] = v[key2]
      } else {
        if (key2 === '充电接口名称') {
          result['connectorName'] = v[key2]
        } else if (key2 === '充电接口编号') {
          result['connectorNo'] = v[key2]
        } else if (key2 === '充电桩(编号)') {
          result['equipmentNo'] = v[key2]
        } else {
          result[key2] = v[key2]
        }
      }
    })

    return result
  })
}

const { data: stationList } = useRequest(getAllStation)
const { data: supplierList } = useRequest(getAllSupplier)
const { data: operatorList } = useRequest(getAllOperator)

const { cascaderValue, props, handleChange, cascaderRef } = useCascader(
  '340100',
  undefined,
  value => {
    if (isArray(value)) {
      searchForm.value.supervisionOrgNo = value[value.length - 1]
      fetchTableList({
        queryParams: {
          data: {
            supervisionOrgNo: value[value.length - 1],
          },
        },
      })
    }
  }
)

const {
  form: searchForm,
  formRef,
  handleResetForm,
} = useForm([
  {
    name: 'supervisionOrgNo',
    default: '340100',
  },
  'equipmentNo',
  'equipmentName',
  'operatorNo',
  'stationNo',
  'stationName',
])

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
  requestUrl: API.EQUIPMENT_MANAGER,
  queryParams: {
    data: {
      supervisionOrgNo: '340100',
    },
  },
  customColumns: [
    {
      name: 'id',
      minWidth: 120,
    },
    {
      name: 'createdTime',
      minWidth: 200,
    },
    {
      name: 'address',
      minWidth: 200,
    },
    {
      name: 'areaName',
      title: '区域',
    },
    {
      name: 'supervisionOrgNo',
      title: '区域',
      decode: row => {
        return getAreaPath(useGlobal.areaList, row['supervisionOrgNo'])
      },
    },
    {
      name: 'equipmentNo',
      minWidth: 170,
    },
    {
      name: 'equipmentName',
      minWidth: 260,
    },
    {
      name: 'operatorName',
      minWidth: 180,
    },
    {
      name: 'stationName',
      minWidth: 230,
    },
    {
      name: 'stationNo',
      minWidth: 210,
    },
    {
      name: 'producedDate',
      minWidth: 190,
    },
    {
      name: 'constructionDate',
      minWidth: 200,
    },
    {
      name: 'onlineTime',
      minWidth: 190,
    },
    {
      name: 'buildDate',
      minWidth: 200,
    },
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

const { dialogVisiable, dialogTitle } = useDialog(undefined, () => {
  onInitialForm()
  onResetForm()
  dynamicValidateForm.domains = [
    {
      connectorName: '1#充电枪',
      connectorNo: '',
    },
  ]
  formRef3.value?.clearValidate()
})

const {
  form: form2,
  formRef: formRef2,
  rules: rules2,
  onEchoForm,
  onResetForm,
  onInitialForm,
} = useForm(
  [
    'id',
    'operatorNo',
    'buildDate',
    {
      name: 'equipmentName',
      required: true,
      title: '充电桩名称',
    },
    {
      name: 'ratedPower',
      title: '额定功率',
    },
    {
      name: 'equipmentNo',
      required: true,
      title: '充电桩编号',
    },
    {
      name: 'producedDate',
      title: '生产日期',
      component: 'time',
    },
    {
      name: 'productModel',
      title: '规格型号',
    },
    {
      name: 'stationNo',
      required: true,
      title: '所属充电站',
      component: 'select',
      trigger: 'change',
    },
    {
      name: 'connectorCount',
      title: '充电端口数',
      component: 'radio',
      default: 1,
      required: true,
      message: '请选择充电端口数',
    },
    {
      name: 'supplierNo',
      title: '充电桩供应商',
      required: true,
      component: 'select',
      trigger: 'change',
    },
    {
      name: 'createdTime',
      title: '建设时间',
      component: 'time',
    },
    {
      name: 'equipmentType',
      title: '类型',
      component: 'select',
    },
    {
      name: 'onlineTime',
      title: '入网时间',
      component: 'time',
    },
    {
      name: 'equipStatus',
      default: '1',
    },
    'level',
    {
      name: 'phoneNo',
      required: true,
      title: '电话号码',
      rule: [
        {
          required: true,
          validator: formChecker.phoneChecker(),
          trigger: 'blur',
        },
      ],
    },
  ],

  // tableColumns,
  columns,
  {
    customDictionary: {
      CONNECTORTYPE: useGlobal.dicts['connector_type'],
    },
  }
)

watch(form2, () => {
  console.log('生成的form2===>', form2)
})

const handleChangeStation = (val: string) => {
  form2.value.operatorNo = stationList.value?.result.filter(
    v => v.stationNo === val
  )[0].operatorNo
}

const handleSubmit = submitForm((valid?: boolean) => {
  if (valid) {
    formRef3.value?.validate(async valid2 => {
      if (valid2) {
        const objs = dynamicValidateForm.domains.map(domain => ({
          ...domain,
          equipmentNo: form2.value.equipmentNo,
        }))
        if (dialogTitle.value.includes('新增')) {
          form2.value.buildDate = formatToDateTime()
          await addEquipmentmanage(form2.value)
          await batchAddConnectorManager(objs)
          dialogVisiable.value = false
          fetchTableList()
        } else if (dialogTitle.value.includes('修改')) {
          await EquipmentEditRow(form2.value)
          await batchAddConnectorManager(objs, { showSuccessModal: true })
          dialogVisiable.value = false
          fetchTableList()
        } else {
          console.log('取消')
        }
      }
    })
  }
})

const handleDeleteRecord = async (row: ResultEquipmentStruct) => {
  await EquipmentDeleteRow(row.id)
  ElMessage.success({
    message: '删除成功',
  })
  fetchTableList()
}

let cachedDomains: DomainItem[] = []

const handleAddEquipment = () => {
  dialogTitle.value = '新增充电桩'
  dialogVisiable.value = true
}

const handleEditEquipment = (row: ResultEquipmentStruct) => {
  dialogTitle.value = '修改充电桩'
  dialogVisiable.value = true
  onEchoForm(row)
  dynamicValidateForm.domains = row.aconnectorVOS.map((v, index) => ({
    connectorName: v.connectorName,
    connectorNo: v.connectorNo,
    id: v.id,
  }))
  cachedDomains = cloneDeep(dynamicValidateForm.domains)
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
    await EquipmentBatchDelete(ids.value)
    fetchTableList()
  } else {
    ElMessage.error('没有选择删除项')
  }
}

const handleSetShow = () => {}

const handleConnectorCountChange = e => {
  const nowLength = cachedDomains.length
  if (e > nowLength) {
    // 说明接口增加了
    let objs: DomainItem[] = []
    for (let i = 1; i <= e - nowLength; i++) {
      objs.push({
        connectorName: `${nowLength + i}#充电枪`,
        connectorNo: '',
      })
    }

    dynamicValidateForm.domains = [...cachedDomains, ...objs]
  } else if (e < nowLength) {
    // 说明接口减少了
    dynamicValidateForm.domains = cachedDomains.slice(0, e)
  } else {
    dynamicValidateForm.domains = cachedDomains
  }
}

interface DomainItem {
  connectorName: string
  connectorNo: string
  id?: string | number
}
const formRef3 = ref<FormInstance>() as Ref<FormInstance>
const dynamicValidateForm = reactive<{
  domains: DomainItem[]
}>({
  domains: [
    {
      connectorName: '1#充电枪',
      connectorNo: '',
    },
  ],
})

const handleAutoGenerate = (e: number) => {
  if (!form2.value.equipmentNo) {
    formRef2.value.validateField(['equipmentNo'])
    return
  }
  dynamicValidateForm.domains[e].connectorNo = `${form2.value.equipmentNo}_${
    e + 1
  }`
}
</script>
<style lang="scss">
.el-popover {
  width: 210px !important;
}

.meterage1 {
  .el-input__wrapper {
    width: 100% !important;
  }
}

.onlinetime {
  .el-date-editor.el-input__wrapper,
  .el-input__wrapper {
    width: 100% !important;
  }
}
</style>
