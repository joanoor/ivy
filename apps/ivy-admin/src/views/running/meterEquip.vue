<template>
  <div bg-white p-5>
    <el-row mb-5>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>计量设备总数</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="data?.result.totalNumber"></DigitalFlop> -->
            <p class="count">{{ data?.result.totalNumber }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>计量设备总在线数</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="2089"></DigitalFlop> -->
            <p class="count">{{ data?.result.onlineTotalNumber }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>计量设备总离线数</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="253"></DigitalFlop> -->
            <p class="count">{{ data?.result.offlineTotalNumber }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>计量设备在线率</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="89.19"></DigitalFlop -->
            <p class="percent">{{ data?.result.onlineRate }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <SearchContainer
      mode="vertical"
      class="line bline"
      pb-5
      mb-5
      @search="
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
      "
      @reset="
        handleResetForm(() => {
          cascaderValue = '340100'
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
        <el-form-item label="检定单位">
          <el-cascader
            class="w-full!"
            v-model="cascaderValue"
            :options="useGlobal.areas"
            :props="props"
            placeholder="请选择检定单位"
            @change="handleChange"
            ref="cascaderRef"
            popper-class="archive-cascader"
          />
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

        <el-form-item label="在线状态">
          <el-select class="w-full!" clearable v-model="searchForm.isOnline">
            <el-option
              v-for="item in useGlobal.dicts['IS_ONLINE']"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
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
      :show-operator="false"
      @selection="onSelectChange"
      @selection-all="onSelectAll"
    >
      <template #button>
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="onExportTable('计量设备运行监测')"
        >
          {{ hasSelectedRow ? '批量导出' : '导出全部' }}
        </el-button>
      </template>
    </SelectionTable>
  </div>
</template>

<script setup lang="ts">
import { getAllSupplier } from '@/api/dossier'
import { getMeasureModuleRun, getMeasureNumber } from '@/api/running'
// import DigitalFlop from '@/components/DigitalFlop.vue'
import SearchContainer from '@/components/SearchContainer.vue'
import useForm from '@/hooks/web/useForm'
import useQueryTable from '@/hooks/web/useQueryTable'
import { useGlobalStore } from '@/store'
import { Download } from '@element-plus/icons-vue'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@vue/shared'

const useGlobal = useGlobalStore()

const { cascaderValue, props, handleChange, cascaderRef } = useCascader(
  '340100',
  undefined,
  value => {
    if (isArray(value)) {
      searchForm.value.verificationOrgNo = value[value.length - 1]
      run({ verificationOrgNo: value[value.length - 1] + '' })
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

const areaName = ref('')
watch(
  () => searchForm.value.verificationOrgNo,
  value => {
    areaName.value = useGlobal.areaList.filter(
      v => v.areaNo === value
    )[0].areaName
  },
  { immediate: true }
)

const { data: supplierList } = useRequest(getAllSupplier)

const { data, run } = useRequest(getMeasureNumber, {
  defaultParams: [
    {
      verificationOrgNo: '340100',
    },
  ],
  onSuccess: data => {
    const valueObj = data.result
    Object.keys(valueObj).forEach(key => {
      const value = valueObj[key]
      if (value) {
        valueObj[key] = value.replace('%', '')
      }
    })
  },
})

const { form: searchForm, handleResetForm } = useForm([
  {
    name: 'verificationOrgNo',
    default: '340100',
  },
  'measureModuleNo',
  'measureModuleName',
  'supplierName',
  'isOnline',
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
} = useQueryTable(getMeasureModuleRun, {
  queryParams: {
    data: {
      verificationOrgNo: '340100',
    },
  },
  customColumns: [
    {
      name: 'isOnline',
      fixed: 'right',
      title: '在线状态',
    },
    {
      name: 'measureModuleName',
      minWidth: '260',
      title: '计量设备名称',
    },
    {
      name: 'measureModuleNo',
      minWidth: '180',
      title: '计量设备编号',
    },
    {
      name: 'equipmentName',
      minWidth: '160',
    },
    {
      name: 'equipmentNo',
      minWidth: '160',
    },
  ],
  expectOmitedColumnNames: ['verificationOrgNo', 'verificationOrgName'],
})
</script>

<style scoped lang="scss">
.count,
.percent {
  &::after {
    position: absolute;
    font-size: 12px;
    color: #4e5969;
    margin-left: 8px;
  }
}

.count::after {
  content: '只';
}

.percent::after {
  content: '%';
}
</style>
