<template>
  <div bg-white pl-5 pr-5 pb-5>
    <el-tabs v-model="activeTabName" mb-5>
      <el-tab-pane
        v-for="item in tabList"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>
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
                data: {
                  ...searchForm,
                },
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
        <el-form-item label="充电单号">
          <el-input
            v-model="searchForm.chargeId"
            placeholder="请输入单号"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="充电桩编号">
          <el-input
            clearable
            v-model="searchForm.equipmentNo"
            placeholder="请输入充电桩编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="充电桩名称">
          <el-input
            clearable
            v-model="searchForm.equipmentName"
            placeholder="请输入充电桩名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="计量结果" v-if="activeTabName === '0'">
          <el-select
            class="w-full!"
            placeholder="请选择计量结果"
            v-model="searchForm.chargeErrorResult"
            clearable
          >
            <el-option
              v-for="item in useGlobal.dicts['ERROR_RESULT']"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="充电时间">
          <DatePicker
            v-model:start="searchForm.startTime"
            v-model:end="searchForm.endTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            format="YYYY-MM-DD HH:mm:ss"
          ></DatePicker>
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
      @selection="onSelectChange"
      @selection-all="onSelectAll"
      @batchexport="
        onExportTable(
          `${
            activeTabName === '0'
              ? '有效'
              : activeTabName === '1'
              ? '无效'
              : '全部'
          }充电记录`
        )
      "
    >
      <template #default="{ row }">
        <div flex items-center>
          <el-button
            link
            type="primary"
            size="default"
            @click="handleClickRow(row, 'detail')"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            size="default"
            @click="handleClickRow(row, 'locate')"
          >
            定位
          </el-button>
          <el-button
            link
            type="primary"
            size="default"
            v-if="activeTabName === '0'"
            :disabled="
              row.chargeErrorResult !== '0' && row.chargeErrorResult !== '1'
            "
            @click="handleClickRow(row, 'deviation')"
          >
            误差
          </el-button>
        </div>
      </template>
    </SelectionTable>
    <el-dialog
      :title="dialogTitle"
      ref="dialogRef"
      v-model="dialogVisiable"
      align-center
      :width="clickType === 'deviation' ? '50vw' : '72vw'"
      class="map-dialog2"
      :append-to-body="true"
      @opened="handleOpenedDialog"
    >
      <div v-if="clickType === 'detail'" style="height: 75vh" flex-col>
        <div class="h-6/11">
          <NrztChart
            mb-5
            :loading="detailLoading"
            chart-type="multi"
            :chart-data="detailTableData"
            :chart-option="multiOption"
          ></NrztChart>
        </div>
        <div flex-1 overflow-hidden overflow-auto scrollbar>
          <NrztTable
            :loading="detailLoading2"
            :total="detailTotal2"
            v-model:current="detailCurrent2"
            v-model:size="detailSize2"
            :table-data="detailTableData2"
            :table-columns="detailTableColumns2"
            :show-operator="false"
            :show-pagination="true"
            :table-height="dialogTableHeight"
            ref="detailTableRef2"
          >
            <template #button><div></div></template>
          </NrztTable>
        </div>
      </div>
      <div v-else-if="clickType === 'locate'" style="height: 75vh">
        <aliMap
          :markers="[singleMarker]"
          ref="aliMapRef"
          @loaded="handleMapLoaded"
          @markerclick="handleMarkerClick"
        >
          <div
            class="info-detail"
            bg-white
            absolute
            top-4
            left-4
            p-6
            v-if="isMapInfoShow"
          >
            <el-icon
              class="close"
              top-4
              right-4
              cursor-pointer
              :size="16"
              @click="handleCloseInfo"
            >
              <i-ep-close></i-ep-close>
            </el-icon>
            <div text-sm mb-1 :title="singleMarker.stationName">
              {{ singleMarker.stationName }}
            </div>
            <div
              class="tlighter"
              text-size-3
              cursor-pointer
              flex
              items-center
              mb-4
              leading-5
              @click="
                aliMapRef?.moveMapTo([
                  singleMarker.stationLongitude,
                  singleMarker.stationLatitude,
                ])
              "
            >
              <el-icon :size="16" mr-2>
                <i-ep-location></i-ep-location>
              </el-icon>
              <TextEllipsis :message="singleMarker.stationAddress" />
            </div>
            <div
              text-size-3
              flex
              items-center
              mb-2.5
              leading-5
              class="tlighter"
            >
              <el-icon :size="16" color="#0FC6C2" mr-2>
                <SvgIcon name="chargerate"></SvgIcon>
              </el-icon>
              <div mr-2>本站充电记录合格率</div>
              <span color="#0FC6C2">
                {{ singleMarker.chargeResultPassRate ?? '--' }}%
              </span>
            </div>
            <div
              text-size-3
              flex
              items-center
              mb-4.5
              leading-5
              class="tlighter"
            >
              <el-icon :size="16" color="#0FC6C2" mr-2>
                <SvgIcon name="checkrate"></SvgIcon>
              </el-icon>
              <div mr-2>本站复核任务完成率</div>
              <span color="#0FC6C2">
                {{ singleMarker.checkNumberRate ?? '--' }}%
              </span>
            </div>
            <div text-size-3 mb-2 leading-5 class="tlighter">
              <span mr-2>充电站状态</span>
              <span color="#0FC6C2">
                {{
                  onDecodeDict(singleMarker, 'equipStatus', 'STATION_STATUS')
                }}
              </span>
            </div>
            <div text-size-3 mb-2 leading-5 class="tlighter">
              <span mr-2>充电站类型</span>
              <span>
                {{
                  onDecodeDict(singleMarker, 'equipmentType', 'STATION_TYPE')
                }}
              </span>
            </div>
            <div text-size-3 mb-2 leading-5 class="tlighter">
              <span mr-2>区域</span>
              <span>
                {{
                  getAreaPath(
                    useGlobal.areaList,
                    singleMarker.stationAreaNo as string
                  )
                }}
              </span>
            </div>
            <div text-size-3 mb-2 leading-5 class="tlighter">
              <span mr-2>运营商</span>
              <span>{{ singleMarker.operatorName ?? '--' }}</span>
            </div>
            <div text-size-3 leading-5 class="tlighter">
              <span mr-2>充电站编号</span>
              <span>{{ singleMarker.stationNo ?? '--' }}</span>
            </div>
          </div>
        </aliMap>
      </div>
      <div v-else style="height: 420px">
        <div text-size-4 flex items-center font-600 mb-5>
          <span>电能值结算误差</span>
          <span>{{ singleMarker.elecErrorResult }}</span>
        </div>
        <el-table mb-12 :data="[singleMarker]">
          <el-table-column
            prop="temperature"
            label="温度 (℃)"
            width="120"
            header-align="center"
            align="center"
          />
          <el-table-column label="充电时间" header-align="center">
            <el-table-column
              prop="measureStartTime"
              label="开始时间"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="measureEndTime"
              label="结束时间"
              header-align="center"
              align="center"
            />
          </el-table-column>
          <el-table-column
            prop="platformElec"
            label="结算电能量"
            width="120"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="measureElec"
            label="标准电能量"
            width="120"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="elecError"
            label="误差 (%)"
            width="120"
            header-align="center"
            align="center"
          />
        </el-table>
        <div text-size-4 flex items-center font-600 mb-5>
          <span>时钟误差</span>
          <span>{{ singleMarker.timeErrorResult }}</span>
        </div>
        <el-table :data="[singleMarker]" border>
          <el-table-column
            prop="platformEndTime"
            label="平台提供的充电结束时间"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="measureEndTime"
            label="模块采集的充电结束时间"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="timeError"
            label="时钟误差（s）"
            width="200"
            header-align="center"
            align="center"
          />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import useTab from '@/hooks/web/useTab'
import SearchContainer from '@/components/SearchContainer.vue'
import useForm from '@/hooks/web/useForm'
import SelectionTable from '@/components/Table/SelectionTable.vue'
import NrztChart from '@/components/Chart/NrztChart.vue'
import useQueryTable, { GenStruct } from '@/hooks/web/useQueryTable'
import {
  getJDManagerList,
  getJdDetailList,
  getLocationDetail,
  getErrorDetail,
  API,
  getLocationDetail2,
} from '@/api/jdmanager'

import aliMap from '@/components/Map/aliMap.vue'
import useDialog from '@/hooks/web/useDialog'
import NrztTable from '@/components/Table/NrztTable.vue'
import { ElDialog } from 'element-plus'
import DatePicker from '@/components/DatePicker/DatePicker.vue'
import { useGlobalStore } from '@/store'
import { getAreaPath } from '@/utils/index'
import useDecodeDict from '@/hooks/web/useDecodeDict'

const { onDecodeDict } = useDecodeDict()
const useGlobal = useGlobalStore()

const aliMapRef = ref<InstanceType<typeof aliMap>>()
const isMapInfoShow = ref(false)

const { activeTabName, tabList } = useTab(
  [
    {
      name: '0',
      label: '有效充电记录',
    },
    {
      name: '1',
      label: '无效充电记录',
    },
  ],
  () => {
    fetchTableList({
      requestUrl:
        activeTabName.value === '0'
          ? API.CHARGING_RECORD
          : API.CHARGING_RECORD2,
    })
  }
)

const { form: searchForm, handleResetForm } = useForm([
  'chargeId',
  'chargeErrorResult',
  'equipmentNo',
  'equipmentName',
  'startTime',
  'endTime',
])

const {
  tableData,
  tableColumns,
  loading,
  total,
  current,
  size,
  tableHeight,
  tableRef,
  onSelectChange,
  onSelectAll,
  hasSelectedRow,
  onExportTable,
  fetchTableList,
} = useQueryTable(getJDManagerList, {
  queryParams: {
    data: {},
  },
  customColumns: [
    {
      name: 'chargeId',
      width: '320',
      title: '充电单号',
    },
    {
      name: 'equipmentNo',
      minWidth: '200',
    },
    {
      name: 'measureElec',
      minWidth: '200',
      title: '充电电量(kWh)',
    },
    {
      name: 'chargeErrorResult',
      title: '计量结果',
      fixed: 'right',
      minWidth: '140',
    },
    {
      name: 'invalidResultType',
      title: '无效原因',
      minWidth: 150,
      fixed: 'right',
    },
    {
      name: 'chargeResult',
      title: '无效充电结果值',
      minWidth: 220,
      fixed: 'right',
    },
    {
      name: 'chargedDuration',
      minWidth: '120',
      title: '充电时长(s)',
    },
  ],
  expectOmitedColumnNames: ['supervisionOrgNo', 'supervisionOrgName'],
  expectOrderColumnNames: [
    'areaName',
    'chargeId',
    'equipmentName',
    'equipmentNo',
    'equipmentLevel',
    'elecErrorResult',
    'timeErrorResult',
    'stationAddress',
  ],
})

const {
  tableData: detailTableData,
  loading: detailLoading,
  fetchTableList: fetchJdDetailList,
} = useQueryTable(getJdDetailList, {
  lazy: true,
})

const {
  tableColumns: detailTableColumns2,
  tableData: detailTableData2,
  loading: detailLoading2,
  total: detailTotal2,
  current: detailCurrent2,
  size: detailSize2,
  tableRef: detailTableRef2,
  fetchTableList: fetchJdDetailList2,
} = useQueryTable(getJdDetailList, {
  lazy: true,
  expectOmitedColumnNames: ['chargeId'],
  customColumns: [
    {
      name: 'id',
      minWidth: 80,
    },
    {
      name: 'dataTime',
      minWidth: '200',
    },
    {
      name: 'measureModuleNo',
      minWidth: '120',
    },
    {
      name: 'chargedDuration',
      minWidth: '120',
      title: '已充电时长(s)',
    },
    {
      name: 'realVoltage',
      title: '电压(V)',
    },
    {
      name: 'realCurrent',
      title: '电流(A)',
    },
    {
      name: 'realPower',
      title: '功率(W)',
    },
    {
      name: 'realTotalEnergy',
      title: '累计电能量(kWh)',
    },
    {
      name: 'realTemperature',
      title: '温度(°C)',
    },
  ],
})

const multiOption: echarts.EChartsOption = {
  xAxis: { type: 'category' },
  yAxis: [
    {
      position: 'left',
      type: 'value',
      name: '电压(V)/电流(A)',
    },
    {
      position: 'right',
      type: 'value',
      name: '功率(W)',
    },
  ],
  grid: {
    bottom: '10%',
  },
  tooltip: {
    show: true,
    formatter: params => {
      if (params.seriesName === '电压') {
        return '电压：' + params.data.realVoltage + ' V'
      } else if (params.seriesName === '电流') {
        return '电流：' + params.data.realCurrent + ' A'
      } else {
        return '功率：' + params.data.realPower + ' W'
      }
    },
  },
  legend: {
    show: true,
  },
  dataZoom: {
    start: 0,
    end: 100,
    show: true,
    height: 20,
  },
  series: [
    {
      type: 'line',
      name: '电压',
      smooth: true,
      dimensions: ['dataTime', 'realVoltage'], // 电压
      yAxisIndex: 0,
    },
    {
      type: 'line',
      name: '电流',
      smooth: true,
      dimensions: ['dataTime', 'realCurrent'], // 电流
      yAxisIndex: 0,
    },
    {
      type: 'line',
      name: '功率',
      smooth: true,
      dimensions: ['dataTime', 'realPower'], // 功率
      yAxisIndex: 1,
    },
    // {
    //   type: 'line',
    //   name: '频率',
    //   smooth: true,
    //   dimensions: ['dataTime', 'frequency'], // 频率
    //   yAxisIndex: 0,
    // },
    // {
    //   type: 'bar',
    //   name: '累计电能量',
    //   dimensions: ['dataTime', 'realTotalEnergy'], // 累计电能量
    //   yAxisIndex: 2,
    // },
  ],
}

const singleMarker = ref<any>({})
type ClickType = 'detail' | 'locate' | 'deviation'
const clickType = ref<ClickType>('detail')

const handleClickRow = async (
  row: GenStruct<typeof getJDManagerList>,
  type: ClickType
) => {
  const obj = {
    detail: '充电详情',
    locate: '定位信息',
    deviation: '误差详情',
  }

  dialogTitle.value = row.equipmentName + `-${obj[type]}`
  dialogVisiable.value = true
  clickType.value = type

  if (type === 'detail') {
    // 上方的chart
    fetchJdDetailList({
      queryParams: {
        data: {
          chargeId: row.chargeId,
        },
        page: {
          current: 1,
          size: 500,
        },
      },
    })
    // 下方的table
    fetchJdDetailList2({
      queryParams: {
        data: {
          chargeId: row.chargeId,
        },
      },
    })
  } else if (type === 'locate') {
    if (activeTabName.value === '0') {
      runLocation({
        chargeId: row.chargeId,
      }).then(res => {
        console.log('22222222')
        singleMarker.value.stationLatitude = res.result.latitude
        singleMarker.value.stationLongitude = res.result.longitude
        singleMarker.value.stationName = res.result.stationName
        singleMarker.value.stationAddress = res.result.address
        singleMarker.value.chargeResultPassRate =
          res.result.chargeResultPassRate
        singleMarker.value.checkNumberRate = res.result.checkNumberRate
        singleMarker.value.totalEquipmentNumber =
          res.result.totalEquipmentNumber
        singleMarker.value.stationStatus = res.result.stationStatus
        singleMarker.value.stationType = res.result.stationType
        singleMarker.value.stationAreaNo = res.result.supervisionOrgNo
        singleMarker.value.operatorName = res.result.operatorName
        singleMarker.value.stationNo = res.result.stationNo
        nextTick(() => {
          aliMapRef.value?.clearThingsOnMap()
          aliMapRef.value?.closeInfoWindow()
          aliMapRef.value?.addMarkers()
          aliMapRef.value?.clickMarker(singleMarker.value)
        })
      })
    } else {
      runLocation2({
        chargeId: row.chargeId,
      }).then(res => {
        singleMarker.value.stationLatitude = res.result.latitude
        singleMarker.value.stationLongitude = res.result.longitude
        singleMarker.value.stationName = res.result.stationName
        singleMarker.value.stationAddress = res.result.address
        singleMarker.value.chargeResultPassRate =
          res.result.chargeResultPassRate
        singleMarker.value.checkNumberRate = res.result.checkNumberRate
        singleMarker.value.totalEquipmentNumber =
          res.result.totalEquipmentNumber
        singleMarker.value.stationStatus = res.result.stationStatus
        singleMarker.value.stationType = res.result.stationType
        singleMarker.value.stationAreaNo = res.result.supervisionOrgNo
        singleMarker.value.operatorName = res.result.operatorName
        singleMarker.value.stationNo = res.result.stationNo
      })
    }
  } else {
    runError({
      chargeId: row.chargeId,
    }).then(res => {
      singleMarker.value.temperature = res.result.temperature
      singleMarker.value.measureStartTime = res.result.measureStartTime
      singleMarker.value.measureEndTime = res.result.measureEndTime
      singleMarker.value.platformElec = res.result.platformElec
      singleMarker.value.measureElec = res.result.measureElec
      singleMarker.value.elecError = res.result.elecError
      singleMarker.value.measureElec = res.result.measureElec

      singleMarker.value.platformEndTime = res.result.platformEndTime
      singleMarker.value.measureEndTime = res.result.measureEndTime
      singleMarker.value.timeError = res.result.timeError
    })
  }
}

const { runAsync: runLocation } = useRequest(getLocationDetail, {
  defaultParams: [
    {
      chargeId: '',
    },
  ],
  manual: true,
})

const { runAsync: runLocation2 } = useRequest(getLocationDetail2, {
  defaultParams: [
    {
      chargeId: '',
    },
  ],
  manual: true,
})

const { runAsync: runError } = useRequest(getErrorDetail, {
  defaultParams: [
    {
      chargeId: '',
    },
  ],
  manual: true,
})

const handleMapLoaded = () => {
  aliMapRef.value?.addMarkers()
  aliMapRef.value?.clickMarker(singleMarker.value)
}

const handleMarkerClick = () => {
  if (!isMapInfoShow.value) isMapInfoShow.value = true
  aliMapRef.value?.openInfoWindow(singleMarker.value)
  aliMapRef.value?.setMapFitView()
  aliMapRef.value?.setMapZoom(15)
}

const handleCloseInfo = () => {
  isMapInfoShow.value = false
  aliMapRef.value?.closeInfoWindow()
}

const { dialogTitle, dialogVisiable } = useDialog(handleMarkerClick)

const dialogRef = ref<InstanceType<typeof ElDialog>>()
const dialogTableHeight = ref(250)

const handleOpenedDialog = () => {
  nextTick(() => {
    const height = dialogRef.value?.dialogContentRef.$el.offsetHeight
    dialogTableHeight.value = (height / 11) * 5 - 20 - 32 - 20 - 22
  })
}
</script>

<style lang="scss" scoped>
.info-detail {
  width: 300px;
  // height: 314px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  .close {
    position: absolute !important;
  }
}
</style>

<style lang="scss">
.map-dialog2 {
  .el-dialog__body {
    padding: var(--el-dialog-padding-primary);
  }
}
</style>
