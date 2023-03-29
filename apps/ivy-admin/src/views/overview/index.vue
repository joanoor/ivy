<template>
  <SearchContainer
    mode="horizontal"
    bg-white
    mb-5
    p-5
    @search="getAllApi({ ...searchForm, supervisionOrgNo: '' })"
    @reset="
      handleResetForm(() => {
        getAllApi({ ...searchForm, supervisionOrgNo: '' })
      })
    "
  >
    <el-form
      :model="searchForm"
      ref="formRef"
      label-width="80px"
      :inline="true"
    >
      <el-form-item label="日期选择">
        <DatePicker
          v-model:start="searchForm.startTime"
          v-model:end="searchForm.endTime"
        ></DatePicker>
      </el-form-item>
    </el-form>
  </SearchContainer>
  <div flex w-full mb-5>
    <Panel
      :count="statisticsData?.result.stationNum"
      title="充电站总数"
      class-name="station"
      @goto="jumpTo($router, '/archives/chargingstation')"
    ></Panel>
    <Panel
      :count="statisticsData?.result.equipmentNum"
      title="充电桩总数"
      class-name="equip"
      @goto="jumpTo($router, '/archives/chargingpile')"
    ></Panel>
    <Panel
      :count="statisticsData?.result.emeasureNum"
      title="计量设备总数"
      class-name="meterequip"
      @goto="jumpTo($router, '/archives/chargingMeterage')"
    ></Panel>
    <Panel
      :count="statisticsData?.result.taskNum"
      title="复核任务总数"
      class-name="station2"
      @goto="
        jumpTo($router, {
          path: '/jdmanager/loadtask',
          query: {
            activeTabName: '',
          },
        })
      "
    ></Panel>
    <Panel
      :count="statisticsData?.result.efficiency"
      title="充电记录有效率"
      class-name="station3"
      @goto="jumpTo($router, '/jdmanager/chargerecord')"
    ></Panel>
  </div>
  <div flex class="second-cards" mb-5>
    <Card width="30%" bg-white mr-5>
      <template #title-left>
        <el-icon size="16" color="#0FC6C2">
          <SvgIcon name="group"></SvgIcon>
        </el-icon>
        <span text-black text-size-4 ml-3>充电记录检定有效数</span>
      </template>
      <el-row h-full>
        <el-col :span="24" h-full>
          <NrztChart
            :chart-data="activeNumberData?.result"
            :dimensions="['orgNoName', 'countNum']"
            :chart-option="chargingQSOption"
            :loading="activeNumberLoading"
            chart-type="hbar"
          ></NrztChart>
        </el-col>
      </el-row>
    </Card>
    <Card flex-1 bg-white mr-5>
      <template #title-left>
        <el-icon size="16" color="#0FC6C2">
          <SvgIcon name="group"></SvgIcon>
        </el-icon>
        <span text-black text-size-4 ml-3>计量设备统计</span>
      </template>
      <template #title-right>
        <el-icon
          v-show="useApp.chartMapDeepStack.length > 1"
          size="20"
          color="#0FC6C2"
          cursor-pointer
          @click="useApp.popChartMapDeepStack"
        >
          <SvgIcon name="back"></SvgIcon>
        </el-icon>
      </template>
      <el-row h-full>
        <el-col :span="24" h-full>
          <EchartMap
            :chart-data="equipStatisticsData?.result"
            :chart-option="equipOption"
            :dimensions="['orgNoName', 'countNum']"
          ></EchartMap>
        </el-col>
      </el-row>
    </Card>
    <Card width="30%" bg-white>
      <template #title-left>
        <el-icon size="16" color="#0FC6C2">
          <SvgIcon name="group"></SvgIcon>
        </el-icon>
        <span text-black text-size-4 ml-3>运营商品牌统计</span>
      </template>
      <div h-full flex-col>
        <div flex-1>
          <el-row h-full flex-col>
            <el-col :span="24">
              <NrztChart
                :chart-data="operatorStatisticsData?.result"
                :dimensions="['operatorName', 'countNum']"
                :chart-option="statisticsOption"
                :loading="operatorStatisticsLoading"
                :callback="handleChart"
                chart-type="pie"
              ></NrztChart>
            </el-col>
          </el-row>
        </div>
        <div class="max-h-1/2">
          <el-row h-full flex-col>
            <el-col :span="24">
              <div
                flex
                justify-center
                items-center
                v-for="(item, index) in operatorStatisticsData?.result"
                class="statistics"
              >
                <div
                  class="circle default"
                  :style="'background:' + colors[index]"
                ></div>
                <div flex-1 ml-2 class="company">{{ item.operatorName }}</div>
                <div class="w-1/8 num" text-right mr-6>
                  <DigitalFlop :digit="item.countNum"></DigitalFlop>
                </div>
                <div class="w-1/8 num" text-right>{{ item.proportion }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </Card>
  </div>
  <div flex class="third-cards">
    <Card w-full h-full bg-white>
      <template #title-left>
        <el-icon size="16" color="#0FC6C2">
          <SvgIcon name="group"></SvgIcon>
        </el-icon>
        <span text-black text-size-4 ml-3>待复核任务统计</span>
      </template>
      <el-row h-full>
        <el-col :span="24" h-full>
          <el-row h-full>
            <el-col :span="24" h-full>
              <NrztChart
                :chart-data="toBeReviewedData?.result"
                :dimensions="['orgName', 'countNum']"
                :chart-option="taskOption"
                :loading="toBeReviewedLoading"
                chart-type="vbar"
              ></NrztChart>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </Card>
  </div>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import SearchContainer from '@/components/SearchContainer.vue'
import Card from '@/components/Card.vue'
import Panel from './components/Panel.vue'
import EchartMap from '@/components/Chart/Map/index.vue'
import NrztChart from '@/components/Chart/NrztChart.vue'
import { useAppStore } from '@/store'
import DigitalFlop from '@/components/DigitalFlop.vue'
import { colors, IChart } from '@ivy/chart'
import DatePicker from '@/components/DatePicker/DatePicker.vue'
import {
  getPageActiveNumber,
  getPageEquipStatistics,
  getPageOperatorStatistics,
  getPageStatistics,
  getToBeReviewed,
} from '@/api/running'
import { jumpTo } from '@/utils'

const useApp = useAppStore()

const {
  form: searchForm,
  formRef,
  handleResetForm,
} = useForm(['startTime', 'endTime'])

const chargingQSOption: echarts.EChartsOption = {
  series: {
    name: '有效数',
    itemStyle: {
      borderRadius: [0, 4, 4, 0],
    },
    barWidth: 16,
  },
  grid: {
    left: '10%',
    bottom: '5%',
  },
}

const taskOption: echarts.EChartsOption = {
  series: {
    name: '统计任务数',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
    barWidth: 33,
  },
  grid: {
    left: '4%',
    right: '4%',
  },
}

const { data: statisticsData, run: runStatistics } = useRequest(
  getPageStatistics,
  {
    defaultParams: [
      {
        ...searchForm.value,
        supervisionOrgNo: '',
      },
    ],
  }
)

const {
  data: activeNumberData,
  loading: activeNumberLoading,
  run: runActiveNumber,
} = useRequest(getPageActiveNumber, {
  defaultParams: [
    {
      ...searchForm.value,
      supervisionOrgNo: '',
    },
  ],
})

const { data: equipStatisticsData, run: runEquipStatistics } = useRequest(
  getPageEquipStatistics,
  {
    defaultParams: [
      {
        ...searchForm.value,
        supervisionOrgNo: '',
      },
    ],
  }
)

const handleChart = (chart: IChart) => {
  chart.getChartInstance().on('click', e => {
    console.log(e)
  })
}

const {
  data: operatorStatisticsData,
  loading: operatorStatisticsLoading,
  run: runOperatorStatistics,
} = useRequest(getPageOperatorStatistics, {
  defaultParams: [
    {
      ...searchForm.value,
      supervisionOrgNo: '',
    },
  ],
})

const {
  data: toBeReviewedData,
  loading: toBeReviewedLoading,
  run: runToBeReviewed,
} = useRequest(getToBeReviewed, {
  defaultParams: [
    {
      ...searchForm.value,
      supervisionOrgNo: '',
    },
  ],
})

interface RequestOpt {
  startTime: string
  endTime: string
  supervisionOrgNo: string
}

const getAllApi = (form: RequestOpt) => {
  runStatistics(form)
  runActiveNumber(form)
  runEquipStatistics(form)
  runOperatorStatistics(form)
  runToBeReviewed(form)
}

const statisticsOption: echarts.EChartsOption = {
  grid: {
    top: '50%',
    bottom: '0%',
  },
  series: {
    name: '运营商品牌统计',
    // roseType: 'radius',
    center: ['50%', '50%'],
    radius: ['60%', '80%'],
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
  },
}

const equipOption: echarts.EChartsOption = {
  series: {
    name: '计量设备统计',
    map: '安徽省',
    aspectScale: 1,
    zoom: 1.2,
    itemStyle: {
      borderWidth: 0.1,
    },
    label: {
      color: 'rgba(0,0,0,0.78)',
    },
  },
  tooltip: {},
  visualMap: {
    type: 'piecewise',
    pieces: [
      { gt: 4000, label: '4000及以上', color: '#0AA5A8' },
      { gt: 3000, lte: 3999, label: '3000～3999', color: '#0FC6C2' },
      { gt: 2000, lte: 2999, label: '2000～2999', color: '#39E1D9' },
      { gt: 1000, lte: 1999, label: '1000～1999', color: '#86E8DD' },
      { gt: 0, lte: 999, label: '0～999', color: '#E8FFFB' },
    ],
  },
}
</script>

<style scoped lang="scss">
.second-cards {
  height: 50vh;
}
.third-cards {
  height: 42vh;
}

.statistics {
  line-height: 20px;
  height: 20px;
  &:not(:last-child) {
    margin-bottom: 3px;
  }
  .company {
    color: $c-text-4;
    font-size: 12px;
  }

  .num {
    color: #000;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
