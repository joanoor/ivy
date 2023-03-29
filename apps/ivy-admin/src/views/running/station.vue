<template>
  <div bg-white p-5>
    <div class="info" mb-4>
      <el-row :gutter="50" h-full p-6>
        <el-col :span="13" h-full>
          <div flex justify-between mb-6>
            <el-cascader
              class="mb-4.5 mycascader"
              v-model="cascaderValue"
              :options="useGlobal.areaLevel2"
              :props="props"
              @change="handleChange"
              ref="cascaderRef"
              popper-class="archive-cascader"
            />
            <!-- <RadioGroup
              :data="['近24小时', '近30天', '近1年', '全部']"
              v-model:active-name="activeTab"
            ></RadioGroup> -->
          </div>
          <div flex mb-6>
            <div flex-1>
              <div class="tlight" leading-6 text-size-4>充电站总数</div>
              <div leading-8 font-600 text-size-6 class="count total-station">
                <!-- <DigitalFlop :digit="46"></DigitalFlop> -->
                <span>{{ idleData?.result.totalStationNumber }}</span>
              </div>
              <div flex items-center leading-5>
                <template
                  v-if="
                    idleData?.result.compareLastYearStationNumber.includes('-')
                  "
                >
                  <el-icon color="#F53F3F" :size="12" mr-1>
                    <i-ep-caret-bottom></i-ep-caret-bottom>
                  </el-icon>
                </template>
                <template v-else>
                  <el-icon color="#00B42A" :size="12" mr-1>
                    <i-ep-caret-top></i-ep-caret-top>
                  </el-icon>
                </template>
                <span mr-1>
                  {{ idleData?.result.compareLastYearStationNumber }}
                </span>
                <span class="tlighter" text-size-3>较上年</span>
              </div>
            </div>
            <div flex-1>
              <div class="tlight" leading-6 text-size-4>充电桩总数</div>
              <div leading-8 font-600 text-size-6 class="count total-pile">
                <!-- <DigitalFlop :digit="83201"></DigitalFlop> -->
                <span>{{ idleData?.result.totalEquipmentNumber }}</span>
              </div>
              <div flex items-center leading-5>
                <template
                  v-if="
                    idleData?.result.compareLastMonthEquipmentNumber.includes(
                      '-'
                    )
                  "
                >
                  <el-icon color="#F53F3F" :size="12" mr-1>
                    <i-ep-caret-bottom></i-ep-caret-bottom>
                  </el-icon>
                </template>
                <template v-else>
                  <el-icon color="#00B42A" :size="12" mr-1>
                    <i-ep-caret-top></i-ep-caret-top>
                  </el-icon>
                </template>
                <span mr-1>
                  {{ idleData?.result.compareLastMonthEquipmentNumber }}
                </span>
                <span class="tlighter" text-size-3>较上月</span>
              </div>
            </div>
            <div flex-1>
              <div class="tlight" leading-6 text-size-4>累计复核任务总数</div>
              <div leading-8 font-600 text-size-6 class="count total-times">
                <span>{{ idleData?.result.totalCheckTaskNumber }}</span>
              </div>
            </div>
          </div>
          <div mb-2>
            <span style="color: #4e5969" mr-2>充电记录合格率</span>
            <span font-600 text-size-4>
              {{ +(idleData?.result.chargeResultPassRate || 0) * 100 }}%
            </span>
          </div>
          <div class="progress" relative>
            <div
              :style="'width:' + progress + '%'"
              class="inner-progress"
            ></div>
          </div>
        </el-col>
        <el-col :span="11" h-full>
          <el-row h-full :gutter="36">
            <el-col :span="7" flex-col h-full>
              <el-row h-full :gutter="16">
                <el-col :span="24" flex-col justify-around>
                  <div flex-1 mb-5>
                    <div class="tlight" text-size-3.5 leading-6>待复核</div>
                    <span text-size-5 font-600 leading-7 color=" #00b42a">
                      {{ idleData?.result.unCheckNumber }}
                    </span>
                  </div>
                  <div flex-1 mb-5>
                    <div class="tlight" text-size-3.5 leading-6>已复核</div>
                    <span text-size-5 font-600 leading-7 color="#3491fa">
                      {{ idleData?.result.checkNumber }}
                    </span>
                  </div>
                  <div flex-1>
                    <div class="tlight" text-size-3.5 leading-6>复核完成率</div>
                    <span text-size-5 font-600 leading-7 color="#f53f3f">
                      {{ +(idleData?.result.checkNumberRate ?? 0) * 100 }}%
                    </span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="17" class="flex-col!" h-full>
              <div leading-6 text-size-4 font-600>充电记录不合格率top5</div>
              <div flex-1>
                <NrztChart
                  chart-type="hbar"
                  :loading="idleLoading"
                  :dimensions="['stationName', 'chargeResultUnPassRate']"
                  :chart-data="
                    idleData?.result.stationSortByChargeUnPassRateList
                  "
                  :chart-option="idleOption"
                ></NrztChart>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <SearchContainer
      mode="horizontal"
      class="line bline search-form2"
      mb-5
      pb-5
      @search="
        () => {
          fetchTableList({
            queryParams: {
              data: searchForm,
            },
          })
          fetchTableList2({
            queryParams: {
              data: searchForm,
            },
          })
        }
      "
      @reset="
        handleResetForm(() => {
          passRate = [0, 100]
          checkRate = [0, 100]
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
          fetchTableList2(
            {
              queryParams: {
                data: searchForm,
              },
            },
            {
              deepmerge2: false,
            }
          )
        })
      "
    >
      <el-form :model="searchForm" ref="formRef" w-full flex>
        <el-form-item label="区域" label-width="80px">
          <el-select
            v-model="searchForm.areaNo"
            clearable
            @change="
              () => {
                fetchTableList({
                  queryParams: {
                    data: searchForm,
                  },
                })
                fetchTableList2({
                  queryParams: {
                    data: searchForm,
                  },
                })
              }
            "
          >
            <el-option
              v-for="item in useGlobal.areaList.filter(
                v => v.parentAreaNo === runForm.supervisionOrgNo
              )"
              :value="item.areaNo"
              :label="item.areaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充电站名称" label-width="120px">
          <el-input
            clearable
            v-model="searchForm.stationName"
            placeholder="请输入充电桩名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="充电记录合格率" label-width="140px">
          <el-slider w-full v-model="passRate" range />
        </el-form-item>
        <el-form-item label="复核任务完成率" label-width="140px">
          <el-slider w-full v-model="checkRate" range />
        </el-form-item>
      </el-form>
    </SearchContainer>
    <div flex justify-between mb-5 text-size-4 leading-6>
      <div font-600>站点{{ toggleButtons[activeIndex].label }}</div>
      <ToggleButton
        v-model:active="activeIndex"
        :button-list="toggleButtons"
      ></ToggleButton>
    </div>
    <div class="map-list">
      <aliMap
        v-if="activeIndex === 0"
        :markers="markers"
        :current-marker2="currentMarker"
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
          <div text-sm mb-1 :title="currentMarker.stationName">
            {{ currentMarker.stationName }}
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
                currentMarker.stationLongitude,
                currentMarker.stationLatitude,
              ])
            "
          >
            <el-icon :size="16" mr-2>
              <i-ep-location></i-ep-location>
            </el-icon>
            <TextEllipsis :message="currentMarker.stationAddress" />
          </div>
          <div text-size-3 flex items-center mb-2.5 leading-5 class="tlighter">
            <el-icon :size="16" color="#0FC6C2" mr-2>
              <SvgIcon name="chargerate"></SvgIcon>
            </el-icon>
            <div mr-2>本站充电记录合格率</div>
            <span color="#0FC6C2">
              {{ currentMarker.chargeResultPassRate ?? '--' }}%
            </span>
          </div>
          <div text-size-3 flex items-center mb-4.5 leading-5 class="tlighter">
            <el-icon :size="16" color="#0FC6C2" mr-2>
              <SvgIcon name="checkrate"></SvgIcon>
            </el-icon>
            <div mr-2>本站复核任务完成率</div>
            <span color="#0FC6C2">
              {{ currentMarker.checkNumberRate ?? '--' }}%
            </span>
          </div>
          <div text-size-3 mb-2 leading-5 class="tlighter">
            <span mr-2>充电站状态</span>
            <span color="#0FC6C2">
              {{ onDecodeDict(currentMarker, 'equipStatus', 'STATION_STATUS') }}
            </span>
          </div>
          <div text-size-3 mb-2 leading-5 class="tlighter">
            <span mr-2>充电站类型</span>
            <span>
              {{ onDecodeDict(currentMarker, 'equipmentType', 'STATION_TYPE') }}
            </span>
          </div>
          <div text-size-3 mb-2 leading-5 class="tlighter">
            <span mr-2>区域</span>
            <span>
              {{
                getAreaPath(
                  useGlobal.areaList,
                  currentMarker.stationAreaNo as string
                )
              }}
            </span>
          </div>
          <div text-size-3 mb-2 leading-5 class="tlighter">
            <span mr-2>运营商</span>
            <span>{{ currentMarker.operatorName ?? '--' }}</span>
          </div>
          <div text-size-3 leading-5 class="tlighter">
            <span mr-2>充电站编号</span>
            <span>{{ currentMarker.stationNo ?? '--' }}</span>
          </div>
        </div>
      </aliMap>
      <SelectionTable
        v-else
        :loading="false"
        :show-operator="false"
        :table-data="tableData"
        :table-columns="tableColumns"
        :total="total"
        ref="tableRef2"
        v-model:current="current"
        v-model:size="size"
        :has-selected-row="hasSelectedRow"
        @selection="onSelectChange"
        @selection-all="onSelectAll"
        @batchexport="onExportTable('充电站运行监测')"
      ></SelectionTable>
    </div>
  </div>
</template>

<script setup lang="ts">
// import DigitalFlop from '@/components/DigitalFlop.vue'
import { getRunStation, getRunStationsInfo } from '@/api/running'
import NrztChart from '@/components/Chart/NrztChart.vue'
import SearchContainer from '@/components/SearchContainer.vue'
import useForm from '@/hooks/web/useForm'
import ToggleButton from '@/components/ToggleButton.vue'
import aliMap from '@/components/Map/aliMap.vue'
import SelectionTable from '@/components/Table/SelectionTable.vue'
// import RadioGroup from '@/components/RadioGroup.vue'
import { useGlobalStore } from '@/store'
import useQueryTable from '@/hooks/web/useQueryTable'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@vue/shared'
import useDecodeDict from '@/hooks/web/useDecodeDict'
import type { AliMapInfoStruct } from '@/types/alimap'
import { getAreaPath } from '@/utils/index'

const { onDecodeDict } = useDecodeDict()
const useGlobal = useGlobalStore()

const isMapInfoShow = ref(false)

const aliMapRef = ref<InstanceType<typeof aliMap>>()

const { form: runForm } = useForm([
  { name: 'supervisionOrgNo', default: '340100' },
])

const {
  data: idleData,
  loading: idleLoading,
  run,
} = useRequest(getRunStation, {
  defaultParams: [
    {
      queryTime: '',
      supervisionOrgNo: '340100',
    },
  ],
})

const { cascaderRef, cascaderValue, props, handleChange } = useCascader(
  '340100',
  undefined,
  value => {
    if (isArray(value)) {
      runForm.value.supervisionOrgNo = value[value.length - 1]
      searchForm.value.supervisionOrgNo = value[value.length - 1]
      // searchForm.value.areaNo = useGlobal.areaList.filter(
      //   v => v.parentAreaNo === runForm.value.supervisionOrgNo
      // )[0].areaNo
      searchForm.value.areaNo = ''
      run({
        queryTime: '',
        supervisionOrgNo: runForm.value.supervisionOrgNo,
      })
      fetchTableList({
        queryParams: {
          data: {
            ...searchForm.value,
          },
        },
      })
      fetchTableList2({
        queryParams: {
          data: {
            ...searchForm.value,
          },
        },
      })
    }
  }
)

const progress = ref(0)
watch(idleData, newValue => {
  progress.value =
    +(newValue?.result.chargeResultPassRate.replace('%', '') || 0) * 100
})

const idleOption: echarts.EChartsOption = {
  series: {
    name: '不合格率',
    itemStyle: {
      borderRadius: 4,
    },
    barWidth: 9,
  },
  grid: {
    left: 160,
    right: '5%',
    bottom: 0,
  },
  yAxis: {
    axisLabel: {
      width: 400,
      // interval: 1,
      formatter: function (value) {
        var texts = value
        if (texts.length > 12) {
          // 具体多少字就看自己了
          texts = texts.substr(0, 12) + '...'
        }
        return texts
      },
    },
  },
}

const { form: searchForm, handleResetForm } = useForm([
  'areaNo',
  {
    name: 'supervisionOrgNo',
    default: '340100',
  },
  'stationName',
  {
    name: 'lowChargeResultPassRate',
    default: '0',
  },
  {
    name: 'upChargeResultPassRate',
    default: '100',
  },
  {
    name: 'lowCheckNumberRate',
    default: '0',
  },
  {
    name: 'upCheckNumberRate',
    default: '100',
  },
])

const toggleButtons = reactive([
  {
    icon: 'location',
    label: '地图',
  },
  {
    icon: 'list',
    label: '列表',
  },
])

const activeIndex = ref(0)
const passRate = ref<[number, number]>([0, 100])
const checkRate = ref<[number, number]>([0, 100])

watch([passRate, checkRate], ([newValue1, newValue2]) => {
  searchForm.value.lowChargeResultPassRate = newValue1[0]
  searchForm.value.upChargeResultPassRate = newValue1[1]
  searchForm.value.lowCheckNumberRate = newValue2[0]
  searchForm.value.upCheckNumberRate = newValue2[1]
})

const {
  tableData,
  tableColumns,
  total,
  current,
  size,
  tableRef: tableRef2,
  onSelectChange,
  onSelectAll,
  hasSelectedRow,
  onExportTable,
  fetchTableList,
} = useQueryTable(getRunStationsInfo, {
  queryParams: {
    data: {
      ...searchForm.value,
    },
  },
  expectOmitedColumnNames: [
    'id',
    'areaNo',
    'supervisionOrgNo',
    'supervisionOrgName',
  ],
  expectOrderColumnNames: ['areaName'],
})

const markers = ref<AliMapInfoStruct[]>([])
const currentMarker = ref<any>({})
const { tableData: tableData2, fetchTableList: fetchTableList2 } =
  useQueryTable(getRunStationsInfo, {
    queryParams: {
      data: {
        ...searchForm.value,
      },
      page: {
        current: 1,
        size: 10000,
      },
    },
  })

let aliMapData: any = null
watch(tableData2, newValue => {
  if (newValue && newValue.length > 0) {
    markers.value = tableData2.value.map(d => ({
      stationLatitude: d.latitude,
      stationLongitude: d.longitude,
      stationName: d.stationName,
      stationAddress: d.address,
      chargeResultPassRate: d.chargeResultPassRate,
      checkNumberRate: d.checkNumberRate,
      totalEquipmentNumber: d.totalEquipmentNumber,
      stationStatus: d.stationStatus,
      stationType: d.stationType,
      stationAreaNo: d.areaNo,
      operatorName: d.operatorName,
      stationNo: d.stationNo,
    }))

    currentMarker.value = markers.value[0]
    if (aliMapData) {
      nextTick(() => {
        aliMapRef.value?.clearThingsOnMap()
        aliMapRef.value?.addMarkers()
        aliMapRef.value?.clickMarker(currentMarker.value)
        aliMapRef.value?.setMapFitView()
      })
    }
  } else {
    markers.value = []
    nextTick(() => {
      aliMapRef.value?.clearThingsOnMap()
      isMapInfoShow.value = false
      aliMapRef.value?.addGeoCoder()

      aliMapRef.value
        ?.decodePos(
          getAreaPath(
            useGlobal.areaList,
            runForm.value.supervisionOrgNo as string
          )
            .split('/')
            .join()
        )
        .then(res => {
          aliMapRef.value?.moveMapTo(res)
          aliMapRef.value?.setMapZoom(13)
        })
    })
  }
})

const handleMapLoaded = (m: any) => {
  aliMapData = m
  if (markers.value.length > 0) {
    aliMapRef.value?.addMarkers()
    aliMapRef.value?.clickMarker(currentMarker.value)
    aliMapRef.value?.setMapFitView()
  }
}

const handleMarkerClick = e => {
  currentMarker.value = e
  aliMapRef.value?.closeInfoWindow()
  if (!isMapInfoShow.value) isMapInfoShow.value = true
  aliMapRef.value?.openInfoWindow(currentMarker.value)
}

const handleCloseInfo = () => {
  isMapInfoShow.value = false
  aliMapRef.value?.closeInfoWindow()
}
</script>

<style scoped lang="scss">
.info-detail {
  width: 300px;
  // height: 314px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  .close {
    position: absolute !important;
  }
}
.info {
  height: 248px;
}

.count {
  &::after {
    font-size: 12px;
    font-weight: 500;
    margin-left: 0.5em;
    color: #86909c;
  }
}

.total-station {
  &::after {
    content: '个';
  }
}

.total-pile {
  &::after {
    content: '台';
  }
}

.total-times {
  &::after {
    content: '次';
  }
}

.map-list {
  height: 70vh;
}

.scope {
  line-height: 22px;
  // height: 44px;
}

.progress {
  width: 90%;
  height: 12px;
  background: rgba(190, 218, 255, 0.1);
  .inner-progress {
    background-color: #0fc6c2;
    height: 100%;
  }
}
</style>
<style lang="scss">
.noborder {
  .el-input__inner {
    border: none !important;
  }
}

.search-form2 {
  .search-form {
    // 一行有四个
    .el-form-item {
      width: calc((100% - 54px) / 4) !important;
      margin-bottom: 0 !important;
    }
  }
}

.mycascader {
  .el-cascader-panel.is-bordered {
    border-right: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .el-input {
    line-height: 28px;
    font-size: 20px;
    font-weight: 600;
  }
  .el-input__wrapper {
    box-shadow: none !important;
    padding: 0px !important;
    .el-input__inner {
      color: #1d2129;
    }
  }
}
</style>
