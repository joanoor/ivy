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
        </el-form-item>

        <el-form-item label="充电站编号">
          <el-input
            clearable
            v-model="searchForm.stationNo"
            placeholder="请输入编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="充电站名称">
          <el-input
            class="w-full!"
            clearable
            v-model="searchForm.stationName"
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

        <el-form-item label="地址">
          <el-input
            clearable
            v-model="searchForm.address"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
      </el-form>
    </SearchContainer>
    <ButtonList mb-5>
      <template #left>
        <el-button
          type="primary"
          size="default"
          :icon="Plus"
          @click="handleAddStation"
        >
          新增
        </el-button>
        <el-button
          type="info"
          size="default"
          mr-2
          @click="downloadTemplate('/充电站导入模板.xlsx')"
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
            <el-button type="info" size="default">显示设置</el-button>
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
      @edit-record="handleEditStation"
      :has-selected-row="hasSelectedRow"
      @selection-all="onSelectAll"
    >
      <template #button>
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="onExportTable('充电站管理')"
        >
          {{ hasSelectedRow ? '导出所选' : '导出全部' }}
        </el-button>
      </template>
    </SelectionTable>
  </div>

  <el-dialog
    v-model="dialogVisiable"
    :title="dialogTitle"
    width="60%"
    align-center
    class="stationstyle"
    :append-to-body="true"
  >
    <el-form
      @validate="handleValidate"
      :model="form2"
      :rules="rules2"
      ref="formRef2"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="stationName" label="充电站名称">
            <el-input
              v-model="form2.stationName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="supportVehicle" label="匹配车型">
            <el-input
              v-model="form2.supportVehicle"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="stationNo" label="充电站编号" relative>
            <el-input v-model="form2.stationNo" placeholder="请选择"></el-input>
            <span
              text-size-3
              absolute
              color="#86909C"
              top-6
              v-if="showSpanMessage"
            >
              输入自定义编号，保存后自动添加关联后缀
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="chargeFeeRateNo" label="充电电费费率">
            <el-input
              v-model="form2.chargeFeeRateNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="stationType" label="充电站类型">
            <el-select
              v-model="form2.stationType"
              placeholder="请选择"
              clearable
              filterable
              class="w-full"
            >
              <el-option
                v-for="item in useGlobal.dicts['STATION_TYPE']"
                :key="item.codeId"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="serviceFeeRateNo" label="服务费率">
            <el-input
              v-model="form2.serviceFeeRateNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="operatorNo" label="运营商">
            <el-select
              v-model="form2.operatorNo"
              placeholder="请选择运营商"
              clearable
              filterable
              class="w-full!"
            >
              <el-option
                v-for="item in operatorList?.result"
                :key="item.operatorNo"
                :label="item.operatorName"
                :value="item.operatorNo"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="parkFeeRateNo" label="停车费率">
            <el-input
              v-model="form2.parkFeeRateNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="address" label="地址">
            <el-input v-model="form2.address" clearable>
              <template #append>
                <span color="#0FC6C2" cursor-pointer @click="handleMapShow">
                  地址设置
                </span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="supportReservation" label="是否支持预约">
            <el-radio-group v-model="form2.supportReservation" class="ml-4">
              <el-radio label="0" size="large">是</el-radio>
              <el-radio label="1" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="phoneNo" label="电话号码">
            <el-input v-model="form2.phoneNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="buildDate" label="营业时间">
            <el-time-picker
              v-model="myTradeTime"
              value-format="HH:mm:ss"
              is-range
              arrow-control
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item prop="stationStatus" label="充电站状态">
            <el-radio-group v-model="form2.stationStatus">
              <el-radio
                v-for="item in useGlobal.dicts['STATION_STATUS']"
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
    </el-form>

    <template #footer>
      <el-button @click="dialogVisiable = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef2)">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisiable2"
    :title="dialogTitle2"
    width="75vw"
    class="map-dialog"
    align-center
    :append-to-body="true"
  >
    <aliMap ref="aliMapRef" mode="custom" @loaded="handleMapLoaded">
      <div class="tip" absolute top-4 z10>
        拖动坐标点以便更方便地设置您的地址
      </div>

      <el-input
        class="absolute! keywords"
        type="text"
        v-model="keywords"
        id="tipinput"
        placeholder="请输入搜索地址"
      ></el-input>
      <div class="point-info" bg-white absolute p-5 right-4 bottom-4>
        <div style="color: #1d2129" font-600 leading-5.5 mb-1>当前坐标信息</div>
        <div
          class="tlighter"
          text-size-3
          cursor-pointer
          flex
          items-center
          mb-5
          leading-5
          @click="
            aliMapRef?.moveMapTo([
              aliMapRef.currentMarker.stationLongitude,
              aliMapRef.currentMarker.stationLatitude,
            ])
          "
        >
          <el-icon :size="16" mr-2>
            <i-ep-location></i-ep-location>
          </el-icon>
          <TextEllipsis :message="aliMapRef?.currentMarker.stationAddress" />
        </div>
        <div text-size-3 mb-2 leading-5 class="tlighter">
          <span mr-2>经度</span>
          <span>
            {{ aliMapRef?.currentMarker.stationLongitude }}
          </span>
        </div>
        <div text-size-3 leading-5 class="tlighter">
          <span mr-2>维度</span>
          <span>
            {{ aliMapRef?.currentMarker.stationLatitude }}
          </span>
        </div>
      </div>
    </aliMap>
    <template #footer>
      <el-button @click="dialogVisiable2 = false">取消</el-button>
      <el-button type="primary" @click="confirmMap">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import SearchContainer from '@/components/SearchContainer.vue'
import ButtonList from '@/components/ButtonList.vue'
import { Plus, Download, InfoFilled } from '@element-plus/icons-vue'

import {
  StationBatchDelete,
  getDossierList,
  batchAddStation,
} from '@/api/dossier'
import SelectionTable from '@/components/Table/SelectionTable.vue'

import useDialog from '@/hooks/web/useDialog'
import useQueryTable from '@/hooks/web/useQueryTable'

import { ResultStationStruct } from '@/api/dossier/model'
import { StationDeleteRow } from '@/api/dossier/index'
import { submitForm } from '@/utils/formAndRules/form'
import { getAreaPath, downloadTemplate } from '@/utils/index'

import { addStationmanage, StationEditRow } from '@/api/dossier'
import { ElMessage, FormItemProp, UploadFile } from 'element-plus'
import { API } from '@/api/dossier'
import { useGlobalStore } from '@/store'
import PopoverColumn from './components/PopoverColumn.vue'
import { getAllOperator } from '@/api/dossier'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@ivy/core'
import aliMap from '@/components/Map/aliMap.vue'
import { formatToDateTime } from '@/utils/dateUtil'
import TextEllipsis from '@/components/TextEllipsis.vue'
import { formChecker } from '@ivy/form'
import useDownload from '@/hooks/web/useDownload'

const useGlobal = useGlobalStore()
const { uploadExcel } = useDownload()

const transformData = (data: Recordable[]) => {
  const convertDatas = [
    {
      name: '运营商(编号)',
      value: '运营商编号',
    },
    {
      name: '匹配车型',
      value: '支持的车辆类型',
    },
    {
      name: '充电电费费率',
      value: '充电费率描述',
    },
    {
      name: '服务费率',
      value: '服务费率描述',
    },
    {
      name: '区域(编号)',
      value: '区域',
    },
    {
      name: '建档日期',
      value: '建档日期（档案同步日期）',
    },
  ]
  console.log('adfadsfadfa', columns.value)
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
        result[key2] = v[key2]
      }
    })

    return result
  })
}

const callback = async (data: Recordable[]) => {
  await batchAddStation(data)
  fetchTableList()
}
const { data: operatorList } = useRequest(getAllOperator)

const aliMapRef = ref<InstanceType<typeof aliMap>>()

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
  'stationNo',
  'stationName',
  'operatorNo',
  'address',
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
  requestUrl: API.STATION_MANAGER,
  queryParams: {
    data: {
      supervisionOrgNo: '340100',
    },
  },
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
      name: 'supervisionOrgNo',
      title: '区域',
      decode: row => {
        return getAreaPath(useGlobal.areaList, row['supervisionOrgNo'])
      },
    },
    {
      name: 'stationNo',
      minWidth: 180,
    },
    {
      name: 'stationName',
      minWidth: 280,
    },
    {
      name: 'chargeFeeRateNo',
      minWidth: 350,
    },
    {
      name: 'serviceFeeRateNo',
      minWidth: 350,
    },
    {
      name: 'operatorName',
      minWidth: 190,
    },
    {
      name: 'buildDate',
      minWidth: 200,
    },
  ],

  expectOrderColumnNames: [
    'id',
    'supervisionOrgNo',
    'stationNo',
    'stationName',
    'address',
    'operatorName',
  ],

  expectOmitedColumnNames: ['id', 'areaNo'],
})

// 下面采用hacker的方法对高德地图的amap-sug-result进行额外处理，之所以要这样处理是因为https://github.com/xieziyu/ngx-amap/issues/62
const { dialogVisiable, dialogTitle } = useDialog(undefined, () => {
  onInitialForm()
  onResetForm()
  showSpanMessage.value = true
})

// () => {
//   const items = document.getElementsByClassName('amap-sug-result')
//   Array.from(items).forEach(item => {
//     item.setAttribute('display', 'block')
//   })
// },
// undefined,
// () => {
//   const items = document.getElementsByClassName('amap-sug-result')
//   Array.from(items).forEach(item => {
//     item.setAttribute('display', 'none')
//   })
// }

const myTradeTime = ref('')
const map = shallowRef<AMap.Map | null>(null)

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
    'areaNo',
    'tradeTime',
    {
      name: 'stationName',
      required: true,
    },
    'buildDate',
    {
      name: 'stationNo',
      required: true,
    },
    'supportVehicle',
    {
      name: 'stationType',
      required: true,
    },
    'chargeFeeRateNo',
    {
      name: 'operatorNo',
      required: true,
      component: 'select',
    },
    'serviceFeeRateNo',
    'supervisionOrgNo',
    {
      name: 'address',
      required: true,
    },
    'parkFeeRateNo',
    {
      name: 'supportReservation',
      component: 'radio',
      default: '0',
    },
    'longitude',
    'latitude',
    {
      name: 'stationStatus',
      component: 'select',
      default: '50',
    },
    {
      name: 'phoneNo',
      required: true,
      title: '电话号码',
      rule: [
        {
          required: true,
          validator: formChecker.phoneChecker(),
        },
      ],
    },
  ],
  columns,
  // tableColumns,
  {
    expectOmitedColumnNames: ['id', 'areaNo'],
    customDictionary: {
      CONNECTORTYPE: useGlobal.dicts['connector_type'],
    },
  }
)

const handleSubmit = submitForm(async (valid?: boolean) => {
  if (valid) {
    form2.value.supervisionOrgNo = form2.value.areaNo
    form2.value.tradeTime = isArray(myTradeTime.value)
      ? myTradeTime.value.join('-')
      : myTradeTime.value
    console.log('myTradeTimemyTradeTime', myTradeTime.value, form2.value)
    if (dialogTitle.value.includes('新增')) {
      form2.value.buildDate = formatToDateTime()
      await addStationmanage(form2.value)
      dialogVisiable.value = false
      fetchTableList()
    } else if (dialogTitle.value.includes('修改')) {
      StationEditRow(form2.value).then(() => {
        ElMessage.success('修改成功')
        dialogVisiable.value = false
        fetchTableList()
      })
    } else {
      console.log('取消')
    }
  }
})

const handleDeleteRecord = async (row: ResultStationStruct) => {
  await StationDeleteRow(row.id)
  ElMessage.success({
    message: '删除成功',
  })
  fetchTableList()
}

const handleAddStation = () => {
  dialogTitle.value = '新增充电站'
  dialogVisiable.value = true
}

const handleEditStation = (row: ResultStationStruct) => {
  dialogTitle.value = '修改充电站'
  dialogVisiable.value = true
  onEchoForm(row)
  console.log('===========', form2.value)
  if (row.tradeTime) {
    // @ts-ignore
    myTradeTime.value = row.tradeTime.split('-')
  }
  nextTick(() => {
    if (map.value) {
      markDraggleMarker()
    }
  })
}

const ids = ref<number[]>([])
const handleSelection = (val: any[]) => {
  ids.value = val.map(v => v.id)
  onSelectChange(val)
}

const handleBatchDelete = async () => {
  onGetAllSelectedRows()
  if (allSelectedData.value.length > 0) {
    await StationBatchDelete(ids.value)
    fetchTableList()
  } else {
    ElMessage.error('没有选择删除项')
  }
}

const keywords = ref('')

const handleMapShow = () => {
  dialogVisiable2.value = true
  dialogTitle2.value = '地址设置'
}

const { dialogVisiable: dialogVisiable2, dialogTitle: dialogTitle2 } =
  useDialog(undefined, () => {
    keywords.value = ''
  })

const handleMapLoaded = m => {
  map.value = m
  aliMapRef.value?.addAutoComplete()
  markDraggleMarker()
}

const markDraggleMarker = () => {
  aliMapRef.value?.clearThingsOnMap()
  nextTick(() => {
    if (form2.value.address) {
      aliMapRef.value?.addDraggleMarker([
        form2.value.longitude,
        form2.value.latitude,
      ])
      aliMapRef.value?.moveMapTo([form2.value.longitude, form2.value.latitude])
    } else {
      aliMapRef.value?.addDraggleMarker()
    }
  })
}

const confirmMap = () => {
  form2.value.latitude = aliMapRef.value?.currentMarker.stationLatitude
  form2.value.longitude = aliMapRef.value?.currentMarker.stationLongitude
  form2.value.address = aliMapRef.value?.currentMarker.stationAddress
  form2.value.areaNo = aliMapRef.value?.currentMarker.stationAreaNo
  dialogVisiable2.value = false
}
const showSpanMessage = ref(true)

const handleValidate = (prop: FormItemProp, isValid: boolean) => {
  if (prop === 'stationNo' && !isValid) {
    showSpanMessage.value = false
  } else if (prop === 'stationNo' && isValid) {
    showSpanMessage.value = true
  }
}
</script>
<style lang="scss" scoped>
.point-info {
  width: 300px;
  // height: 182px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
}

.keywords {
  top: 16px;
  left: 16px;
  z-index: 12;
  width: 400px;
  color: #1d2129;
}

.tip {
  background-color: white;
  padding: 10px 20px;
  border-radius: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}
</style>

<style lang="scss">
.stationstyle {
  .el-input__wrapper {
    width: 100% !important;
  }
}
.map-dialog {
  .el-dialog__body {
    height: 70vh;
    padding: var(--el-dialog-padding-primary);
  }
}
</style>
