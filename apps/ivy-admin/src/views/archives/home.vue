<template>
  <div flex-col h-full>
    <SearchContainer mb-5 p-5 bg-white mode="horizontal" class="line bline">
      <el-form :model="form" ref="formRef" label-width="80px" :inline="true">
        <el-form-item label="区域">
          <el-cascader
            v-model="form.companyName"
            :options="options"
            :props="props"
            placeholder="请选择区域"
          />
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="form.address"
            type="daterange"
            :disabled-date="isDisableData"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
    </SearchContainer>
    <div flex mb-5 p-5 class="classname">
      <div class="panel flex items-center">
        <el-icon size="40" mr-3>
          <i-iemp-operatorNum></i-iemp-operatorNum>
        </el-icon>
        <div flex-col justify-center>
          <div text-size-4 font-600 mb-4 class="title">{{ '运营商数量' }}</div>
          <div text-size-7 font-700 class="count">
            <DigitalFlop :digit="2342"></DigitalFlop>
          </div>
        </div>
      </div>
      <div pl-4 items-center class="panel flex">
        <el-icon size="40" mr-3>
          <i-iemp-supplierNum></i-iemp-supplierNum>
        </el-icon>
        <div flex-col justify-center>
          <div text-size-4 font-600 mb-4 class="title">{{ '供应商数量' }}</div>
          <div text-size-7 font-700 class="count">
            <DigitalFlop :digit="2089"></DigitalFlop>
          </div>
        </div>
      </div>
      <div pl-4 items-center class="panel flex">
        <el-icon size="40" mr-3>
          <i-iemp-stationNum></i-iemp-stationNum>
        </el-icon>
        <div flex-col justify-center>
          <div text-size-4 font-600 mb-4 class="title">{{ '充电站数量' }}</div>
          <div text-size-8 font-700 class="count">
            <DigitalFlop :digit="253"></DigitalFlop>
          </div>
        </div>
      </div>
      <div pl-4 items-center class="panel flex">
        <el-icon size="40" mr-3>
          <i-iemp-meterageNum></i-iemp-meterageNum>
        </el-icon>
        <div flex-col justify-center>
          <div text-size-4 font-600 mb-4 class="title">
            {{ '计量设备数量（直流/交流）' }}
          </div>
          <div text-size-7 font-700 class="count">
            <DigitalFlop :digit="8919"></DigitalFlop>
          </div>
        </div>
      </div>
      <div pl-4 items-center class="panel flex">
        <el-icon size="40" mr-3>
          <i-iemp-pileNum></i-iemp-pileNum>
        </el-icon>
        <div flex-col justify-center>
          <div text-size-4 font-600 mb-4 class="title">
            {{ '充电桩数量（直流/交流）' }}
          </div>
          <div text-size-7 font-700 class="count">
            <DigitalFlop :digit="8919"></DigitalFlop>
          </div>
        </div>
      </div>
    </div>

    <div flex flex-1 class="third-cards">
      <Card w-full h-full bg-white>
        <template #title-left>
          <el-icon size="16" color="#0FC6C2">
            <SvgIcon name="group"></SvgIcon>
          </el-icon>
          <span text-black text-size-4 ml-3>区域充电桩分布</span>
        </template>
        <el-row h-full>
          <el-col :span="24" h-full>
            <el-row h-full>
              <el-col :span="24" h-full>
                <NrztChart
                  :chart-data="data?.result"
                  :dimensions="['address', 'num']"
                  :chart-option="taskOption"
                  :loading="loading"
                  chart-type="vbar"
                ></NrztChart>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import DigitalFlop from '@/components/DigitalFlop.vue'

import { getChargingqs } from '@/api/overview'
import useForm from '@/hooks/web/useForm'
import { isDisableData } from '@/utils'
import Card from '@/components/Card.vue'
import NrztChart from '@/components/Chart/NrztChart.vue'
import SearchContainer from '@/components/SearchContainer.vue'

const { form, formRef } = useForm(['companyName', 'address'])
const { data, loading } = useRequest(getChargingqs)

const props = {
  expandTrigger: 'hover' as const,
  checkStrictly: true,
}

const options = [
  {
    value: '340000',
    label: '安徽省',
    children: [
      {
        value: '340100',
        label: '合肥市',
      },
      {
        value: '340200',
        label: '芜湖市',
      },
      {
        value: '340300',
        label: '蚌埠市',
      },
      {
        value: '340400',
        label: '淮南市',
      },
    ],
  },
]

const taskOption: echarts.EChartsOption = {
  series: {
    name: '统计任务数',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
    barWidth: 33,
  },
}
</script>
<style scoped lang="scss">
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

// .panel{
//   display: flex;
//   width:20%;
//   border-radius: 4px;
//   &:not(:last-child){
//     border-right:solid 1px #e5e6eb;
//   }
// }

.panel {
  height: 100px;
  width: 20%;
  //border-radius: 200px;
  position: relative;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 60px;
    background-color: #eef0f4;
    right: 0;
  }
}

.classname {
  background-color: white;
  height: 140px;
  // width: 82%;
}
</style>
