<template>
  <div class="relative h-full">
    <!-- 右上角按钮 今日 | 本月 | 今年 | 自定义-->
    <RadioGroup
      :data="timerank"
      active-tab="今日"
      class="absolute timechange"
      name="one"
      @inner-text="handleInnerText"
    ></RadioGroup>
    <div class="overview-block relative h-full">
      <!-- 第一行 -->
      <BoxContainer class="overview-block-item" height="22%">
        <div class="flex h-full">
          <BoxContainer
            height="100%"
            bgcolor="linear-gradient(180deg, #f2f9fe, #e6f4fe 100%"
            class="box flex-1 mr-5 flex flex-col"
            :title="activeTextCom + '总用电量（kWh）'"
          >
            <el-row :gutter="20" class="flex-1">
              <el-col :span="12" :offset="0">
                <div class="flex flex-col h-full justify-center">
                  <TextEllipsis
                    :message="convertToThousands(totalPowerCount)"
                    class="mt-4 heavy"
                  ></TextEllipsis>
                  <div class="flex items-center amount-detail mt-1">
                    <span>较昨日</span>
                    <span
                      :class="'amount-detail-status-upper'"
                      class="amount-detail-status ml-2 mr-1"
                    >
                      {{ consumeTotalPower.detail.compare }}
                    </span>
                    <SvgIcon
                      :name="'arrow_upper'"
                      size="12"
                      className="cursor-pointer"
                    ></SvgIcon>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" :offset="0">
                <TotalConsumePowerChart
                  :list="consumeTotalPower.records"
                ></TotalConsumePowerChart>
              </el-col>
            </el-row>
          </BoxContainer>
          <BoxContainer
            bgcolor="linear-gradient(180deg, #f5fef2, #e6feee 100%)"
            height="100%"
            class="box flex-1 mr-5 flex flex-col"
            :title="activeTextCom + '总用水量（m³）'"
          >
            <el-row :gutter="20" class="flex-1">
              <el-col :span="12" :offset="0">
                <div class="flex flex-col h-full justify-center">
                  <TextEllipsis
                    :message="convertToThousands(totalWaterCount)"
                    class="mt-4 heavy"
                  ></TextEllipsis>
                  <div class="flex items-center amount-detail mt-1">
                    <span>较昨日</span>
                    <span
                      :class="'amount-detail-status-upper'"
                      class="amount-detail-status ml-2 mr-1"
                    >
                      {{ consumeTotalWater.detail.compare }}
                    </span>
                    <SvgIcon
                      :name="'arrow_upper'"
                      size="12"
                      className="cursor-pointer"
                    ></SvgIcon>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" :offset="0">
                <TotalConsumeWaterChart
                  :list="consumeTotalWater.records"
                ></TotalConsumeWaterChart>
              </el-col>
            </el-row>
          </BoxContainer>
          <BoxContainer
            bgcolor="linear-gradient(180deg,#fffdf6, #fef9e6 100%)"
            height="100%"
            class="box flex-1 mr-5 flex flex-col"
            :title="activeTextCom + '总发电量（kWh）'"
          >
            <el-row :gutter="20" class="flex-1">
              <el-col :span="12" :offset="0">
                <div class="flex flex-col h-full justify-center">
                  <TextEllipsis
                    :message="convertToThousands(totalGenPowerCount)"
                    class="mt-4 heavy"
                  ></TextEllipsis>
                  <div class="flex items-center amount-detail mt-1">
                    <span>较昨日</span>
                    <span
                      :class="'amount-detail-status-upper'"
                      class="amount-detail-status ml-2 mr-1"
                    >
                      {{ consumeTotalGenPower.detail.compare }}
                    </span>
                    <SvgIcon
                      :name="'arrow_upper'"
                      size="12"
                      className="cursor-pointer"
                    ></SvgIcon>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" :offset="0">
                <TotalPowerGenChart
                  :list="consumeTotalGenPower.records"
                ></TotalPowerGenChart>
              </el-col>
            </el-row>
          </BoxContainer>
          <BoxContainer
            bgcolor="linear-gradient(180deg, #f6f7ff, #ececff 100%)"
            height="100%"
            class="box flex-1 flex flex-col"
            :title="activeTextCom + '总碳排放量（吨）'"
          >
            <el-row :gutter="20" class="flex-1">
              <el-col :span="12" :offset="0">
                <div class="flex flex-col h-full justify-center">
                  <TextEllipsis
                    :message="convertToThousands(totalEmissionCount)"
                    class="mt-4 heavy"
                  ></TextEllipsis>
                  <div class="flex items-center amount-detail mt-1">
                    <span>较昨日</span>
                    <span
                      :class="'amount-detail-status-upper'"
                      class="amount-detail-status ml-2 mr-1"
                    >
                      {{ consumeTotalEmission.detail.compare }}
                    </span>
                    <SvgIcon
                      :name="'arrow_upper'"
                      size="12"
                      className="cursor-pointer"
                    ></SvgIcon>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" :offset="0">
                <TotalEmissionCarbonChart
                  :list="consumeTotalEmission.records"
                ></TotalEmissionCarbonChart>
              </el-col>
            </el-row>
          </BoxContainer>
        </div>
      </BoxContainer>

      <!-- 第二行 -->
      <BoxContainer class="overview-block-item mb-4" width="50%" height="45%">
        <div class="flex flex-col h-full">
          <ButtonList>
            <template #left>
              <span class="box-title">{{ activeTextCom }}能耗排名</span>
            </template>
            <template #right>
              <RadioGroup
                :data="rank"
                active-tab="用电"
                name="two"
              ></RadioGroup>
            </template>
          </ButtonList>
          <div class="flex-1 flex flex-col mt-5">
            <el-row :gutter="20" class="h-full">
              <el-col :span="24" :offset="0">
                <consumeEnergyChart></consumeEnergyChart>
              </el-col>
            </el-row>
          </div>
        </div>
      </BoxContainer>
      <BoxContainer class="overview-block-item" width="24%" height="45%">
        <div class="flex flex-col h-full">
          <ButtonList>
            <template #left>
              <span class="box-title">{{ activeTextCom }}能耗分布</span>
            </template>
            <template #right>
              <RadioGroup
                :data="distribution"
                active-tab="用电"
                name="three"
              ></RadioGroup>
            </template>
          </ButtonList>
          <div class="flex-1 flex flex-col justify-between mt-5">
            <el-row :gutter="20" class="distribution">
              <el-col :span="24" :offset="0">
                <ConsumeDistributionChart></ConsumeDistributionChart>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="distribution overflow-y-auto scrollbar">
              <el-col :span="24" :offset="0">
                <RowNotice class="rownotice" height="25%">
                  <div class="flex notice-left">
                    <div class="notice-circle color1"></div>
                    <span class="notice-category">空调用电</span>
                  </div>
                  <div class="notice-count flex justify-end items-center">
                    <TextEllipsis
                      message="2,023.00"
                      class="myfont mt-0 mb-0"
                    ></TextEllipsis>
                    <span class="ml-1 myfont">kWh</span>
                  </div>
                  <div class="notice-percent">32.21%</div>
                </RowNotice>
                <RowNotice class="rownotice" height="25%">
                  <div class="flex notice-left">
                    <div class="notice-circle color2"></div>
                    <span class="notice-category">照明用电</span>
                  </div>

                  <div class="notice-count flex justify-end items-center">
                    <TextEllipsis
                      message="2,023.00"
                      class="myfont mt-0 mb-0"
                    ></TextEllipsis>
                    <span class="ml-1 myfont">kWh</span>
                  </div>
                  <div class="notice-percent">32.21%</div>
                </RowNotice>
                <RowNotice class="rownotice" height="25%">
                  <div class="flex notice-left">
                    <div class="notice-circle color3"></div>
                    <span class="notice-category">充电桩用电</span>
                  </div>

                  <div class="notice-count flex justify-end items-center">
                    <TextEllipsis
                      message="2,023.00"
                      class="myfont mt-0 mb-0"
                    ></TextEllipsis>
                    <span class="ml-1 myfont">kWh</span>
                  </div>
                  <div class="notice-percent">32.21%</div>
                </RowNotice>
                <RowNotice class="rownotice" height="25%">
                  <div class="flex notice-left">
                    <div class="notice-circle color4"></div>
                    <span class="notice-category">其他用电</span>
                  </div>

                  <div class="notice-count flex justify-end items-center">
                    <TextEllipsis
                      message="2,023.00"
                      class="myfont mt-0 mb-0"
                    ></TextEllipsis>
                    <span class="ml-1 myfont">kWh</span>
                  </div>
                  <div class="notice-percent">32.21%</div>
                </RowNotice>
              </el-col>
            </el-row>
          </div>
        </div>
      </BoxContainer>
      <BoxContainer
        class="overview-block-item"
        width="calc(26% - 32px)"
        height="33%"
      >
        <div class="flex flex-col h-full">
          <ButtonList>
            <template #left>
              <span class="box-title">公告</span>
            </template>
            <!-- <template #right>
              <el-button type="primary" size="default" text>查看更多</el-button>
            </template> -->
          </ButtonList>
          <!-- <div class="flex-1 flex flex-col mt-5 overflow-y-auto scrollbar"> -->
          <!-- <div class="flex-1 mt-5 overflow-hidden"> -->
          <LoopScroll class="flex-1 mt-5">
            <RowNotice class="mb-2 one" height="24px">
              <el-tag class="mr-2" type="danger">紧急</el-tag>
              <TextEllipsis
                message="配电房断电！！！"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <RowNotice class="mb-2 two" height="24px">
              <el-tag class="mr-2" type="warning">可疑</el-tag>
              <TextEllipsis
                message="1#空调温度异常！！"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <RowNotice class="mb-2 three" height="24px">
              <el-tag class="mr-2">提醒</el-tag>
              <TextEllipsis
                message="预计今晚18时左右用电超负荷预计今晚18时左右用电超负荷预计今晚18时左右用电超负荷预计今晚18时左右用电超负荷"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <RowNotice class="mb-2 four" height="24px">
              <el-tag class="mr-2" type="info">待办</el-tag>
              <TextEllipsis
                message="路灯维修审核243524354354325"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <RowNotice class="mb-2 five" height="24px">
              <el-tag class="mr-2" type="info">待办</el-tag>
              <TextEllipsis
                message="路灯维修审核4325243543254325"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <RowNotice class="mb-2 six" height="24px">
              <el-tag class="mr-2" type="info">待办</el-tag>
              <TextEllipsis
                message="路灯维修审核2333"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <RowNotice class="mb-2 seven" height="24px">
              <el-tag class="mr-2" type="info">待办</el-tag>
              <TextEllipsis
                message="路灯维修审核1"
                class="announcement"
              ></TextEllipsis>
            </RowNotice>
            <!-- <RowNotice class="mb-2" height="24px">
                <el-tag class="mr-2" type="info">待办</el-tag>
                <TextEllipsis
                  message="路灯维修审核2"
                  class="announcement"
                ></TextEllipsis>
              </RowNotice>
              <RowNotice class="mb-2" height="24px">
                <el-tag class="mr-2" type="info">待办</el-tag>
                <TextEllipsis
                  message="路灯维修审核3"
                  class="announcement"
                ></TextEllipsis>
              </RowNotice>
              <RowNotice class="mb-2" height="24px">
                <el-tag class="mr-2" type="info">待办</el-tag>
                <TextEllipsis
                  message="路灯维修审核4"
                  class="announcement"
                ></TextEllipsis>
              </RowNotice>
              <RowNotice class="mb-2" height="24px">
                <el-tag class="mr-2" type="info">待办</el-tag>
                <TextEllipsis
                  message="路灯维修审核5"
                  class="announcement"
                ></TextEllipsis>
              </RowNotice> -->
          </LoopScroll>
          <!-- </div> -->
        </div>
      </BoxContainer>

      <!-- 第三行 -->
      <BoxContainer
        class="overview-block-item"
        width="calc(74% + 16px)"
        height="calc(33% - 32px)"
      >
        <div class="flex flex-col h-full">
          <ButtonList>
            <template #left>
              <span class="box-title">实时能耗趋势</span>
            </template>
          </ButtonList>
          <div class="flex-1 flex flex-col mt-5">
            <el-row :gutter="20" class="h-full">
              <el-col :span="24" :offset="0">
                <ConsumeEnergyTrendsChart></ConsumeEnergyTrendsChart>
              </el-col>
            </el-row>
          </div>
        </div>
      </BoxContainer>
      <BoxContainer
        class="overview-block-item"
        width="calc(26% - 32px)"
        height="calc(45% - 32px)"
      >
        <div class="flex flex-col h-full relative">
          <ButtonList>
            <template #left>
              <span class="box-title">{{ activeTextCom }}最大用电负荷</span>
            </template>
          </ButtonList>
          <div class="flex-1 flex flex-col mt-4">
            <el-row :gutter="20" class="h-full">
              <el-col :span="24" :offset="0">
                <ConsumePowerPayloadChart></ConsumePowerPayloadChart>
              </el-col>
            </el-row>
          </div>
          <div class="realtime absolute w-full">
            {{ realTime }}
          </div>
        </div>
      </BoxContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 引入依赖
import { computed, onMounted, onUnmounted, Ref, ref, watch } from 'vue'

// 引入组件
import BoxContainer from '@/components/BoxContainer.vue'
import TextEllipsis from '@/components/TextEllipsis.vue'
import ButtonList from '@/components/ButtonList.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import RowNotice from '@/components/RowNotice.vue'
import LoopScroll from '@/components/LoopScroll.vue'

import TotalConsumePowerChart from './components/totalConsumePowerChart.vue'
import TotalConsumeWaterChart from './components/totalConsumeWaterChart.vue'
import TotalPowerGenChart from './components/totalPowerGenChart.vue'
import TotalEmissionCarbonChart from './components/totalEmissionCarbonChart.vue'
import ConsumeDistributionChart from './components/consumeDistributionChart.vue'
import consumeEnergyChart from './components/consumeEnergyChart.vue'
import ConsumePowerPayloadChart from './components/consumePowerPayloadChart.vue'
import ConsumeEnergyTrendsChart from './components/consumeEnergyTrendsChart.vue'

// 引入hooks
import useRealTime from '@/hooks/component/useRealTime'
import useHomeApi from '@/hooks/component/useHomeApi'
import useDigitFlop from '@/hooks/component/useDigitFlop'

// 引入其他
import { FirstListValue } from '@/api/model'
import { convertToThousands } from '@ivy/core'

const timerank: string[] = ['今日', '本月', '今年', '自定义']
const rank: string[] = ['用电', '用水', '用气']
const distribution: string[] = ['用电', '用水']

const activeText = ref('今日')

interface Dat {
  list: FirstListValue[]
  totalNum: Ref<number>
  increaseNum: Ref<number>
}
let intervalTimer: NodeJS.Timer

const {
  consumeTotalData: consumeTotalPower,
  fetchTotalConsumeData: fetchTotalConsumePower,
} = useHomeApi('/api/totalpower')
const {
  consumeTotalData: consumeTotalWater,
  fetchTotalConsumeData: fetchTotalConsumeWater,
} = useHomeApi('/api/totalwater')
const {
  consumeTotalData: consumeTotalGenPower,
  fetchTotalConsumeData: fetchTotalGenPower,
} = useHomeApi('/api/totalgenpower')
const {
  consumeTotalData: consumeTotalEmission,
  fetchTotalConsumeData: fetchTotalEmission,
} = useHomeApi('/api/totalemission')

let totalPowerNum = ref(0)
let totalWaterNum = ref(0)
let totalGenPowerNum = ref(0)
let totalEmissionNum = ref(0)

const { count: totalPowerCount } = useDigitFlop(totalPowerNum)
const { count: totalWaterCount } = useDigitFlop(totalWaterNum)
const { count: totalGenPowerCount } = useDigitFlop(totalGenPowerNum)
const { count: totalEmissionCount } = useDigitFlop(totalEmissionNum)

onMounted(() => {
  intervalTimer = setInterval(() => {
    fetchTotalConsumePower()
    fetchTotalConsumeWater()
    fetchTotalGenPower()
    fetchTotalEmission()
  }, 5000)
})

onUnmounted(() => {
  if (intervalTimer) {
    clearInterval(intervalTimer)
  }
})

watch(
  [
    consumeTotalPower,
    consumeTotalWater,
    consumeTotalGenPower,
    consumeTotalEmission,
  ],
  () => {
    totalPowerNum.value = consumeTotalPower.detail.count
    totalWaterNum.value = consumeTotalWater.detail.count
    totalGenPowerNum.value = consumeTotalGenPower.detail.count
    totalEmissionNum.value = consumeTotalEmission.detail.count
  }
)

const handleInnerText = (e: string) => {
  activeText.value = e
}

const activeTextCom = computed(() => {
  return activeText.value === '自定义' ? '' : activeText.value + '/'
})

const { realTime } = useRealTime()
</script>

<style scoped lang="scss">
.timechange {
  margin-top: -45px;
  right: 0px;
}

.overview-block {
  &-item {
    position: absolute;

    &:nth-child(2) {
      left: 0;
      top: calc(22% + 16px); // 174 + 16
    }

    &:nth-child(3) {
      left: calc(50% + 16px);
      top: calc(22% + 16px); // 174 + 16
    }

    &:nth-child(4) {
      left: calc(50% + 24% + 32px);
      top: calc(22% + 16px);
    }

    &:nth-child(5) {
      left: 0px;
      top: calc(22% + 45% + 32px);
      bottom: 0;
    }

    &:nth-child(6) {
      left: calc(74% + 32px);
      top: calc(22% + 33% + 32px);
      bottom: 0;
      padding-bottom: 10px;
    }
  }

  .info {
    width: calc((100% - 20px) / 2);
    border: solid 1px;
  }

  .amount {
    height: 28px;
    font-size: 24px;
    font-family: Roboto, Roboto-Bold;
    font-weight: 700;
    text-align: LEFT;
    color: #1d2129;
    line-height: 24px;
    text-overflow: ellipsis;
  }

  .amount-detail {
    color: #4e5969;
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;

    &-status {
      font-size: 14px;
      font-family: Roboto, Roboto-Medium;
      font-weight: 600;
    }

    &-status-upper {
      color: #f53f3f;
    }

    &-status-down {
      color: #00b42a;
    }
  }

  .notice-left {
    width: 36%;
  }

  .notice-circle {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    // background: #3491fa;
    margin-right: 10px;
  }

  .notice-category {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #4e5969;
  }

  .notice-count {
    width: calc(64% - 50px);
    font-size: 14px;
    padding-left: 12px;
    // height: 24px;
    font-family: Helvetica Neue, Helvetica Neue-Medium;
    font-weight: 500;
    text-align: right;
    color: #1d2129;
    margin-right: 10px;
    // line-height: 24px
  }

  .notice-percent {
    width: 50px;
    height: 24px;
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica Neue-Regular;
    font-weight: 400;
    text-align: LEFT;
    color: #4e5969;
    line-height: 24px;
  }

  .myfont {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica Neue-Medium;
    font-weight: 600;
    text-align: LEFT;
    color: #1d2129;
    height: 24px;
    line-height: 24px;
  }

  .announcement {
    width: 80%;
    height: 22px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #4e5969;
    line-height: 22px;
  }

  .distribution {
    height: calc((100% - 20px) / 2);
  }

  .rownotice:not(:last-child) {
    border-bottom: 1px solid #e5e6eb;
  }

  .realtime {
    height: 22px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: CENTER;
    color: #86909c;
    line-height: 22px;
    bottom: 0px;
  }
}

.color1 {
  background-color: #722ed1;
}

.color2 {
  background-color: #f7ba1e;
}

.color3 {
  background-color: #0fc6c2;
}

.color4 {
  background-color: #3491fa;
}
</style>
