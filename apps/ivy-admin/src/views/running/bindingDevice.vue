<template>
  <div bg-white p-5>
    <el-row mb-5>
      <!-- <el-col :span="4" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>总库存</div>
          <div text-size-3 leading-5 mb-2>计量设备总数</div>
          <div leading-5.5 font-700 text-size-5.5>
   
            <p class="count">{{ data?.result.totalMeasureNumber }}</p>
          </div>
        </div>
      </el-col> -->
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>已绑定计量设备总数</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="2089"></DigitalFlop> -->
            <p class="count">{{ data?.result.bindMeasureNumber }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>计量设备覆盖率</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="253"></DigitalFlop> -->
            <p class="percent">{{ data?.result.measureCoverage }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>充电枪总数</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="89.19"></DigitalFlop -->
            <p class="count">{{ data?.result.totalConnectorNumber }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" flex items-center p-5>
        <el-icon size="40" mr-3>
          <i-iemp-countnum></i-iemp-countnum>
        </el-icon>
        <div>
          <div text-size-3 leading-5>{{ areaName }}</div>
          <div text-size-3 leading-5 mb-2>充电桩总数</div>
          <div leading-5.5 font-700 text-size-5.5>
            <!-- <DigitalFlop :digit="89.19"></DigitalFlop -->
            <p class="count">{{ data?.result.totalEquipmentNumber }}</p>
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
        fetchTableList({
          queryParams: {
            data: searchForm,
          },
        })
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
        <el-form-item label="区域" w-full>
          <el-cascader
            class="w-full!"
            v-model="cascaderValue"
            :options="useGlobal.areas"
            :props="props"
            clearable
            placeholder="请选择区域"
            @change="handleChange"
            ref="cascaderRef"
            popper-class="archive-cascader"
          />
        </el-form-item>

        <el-form-item label="充电桩编号" w-full>
          <el-input
            clearable
            v-model="searchForm.equipmentNo"
            placeholder="请输入充电桩编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="充电站名称" w-full>
          <el-input
            clearable
            v-model="searchForm.stationName"
            placeholder="请输入充电站名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="地址" w-full>
          <el-input
            clearable
            v-model="searchForm.stationAddress"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>

        <el-form-item label="充电桩状态" w-full>
          <el-select
            class="w-full!"
            clearable
            v-model="searchForm.equipStatus"
            placeholder="请选择充电桩状态"
          >
            <el-option
              v-for="item in useGlobal.dicts['EQUIPMENT_STATUS']"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备绑定状态" w-full>
          <el-select
            class="w-full!"
            clearable
            v-model="searchForm.bindStatus"
            placeholder="请选择充电桩状态"
          >
            <el-option label="已绑定" value="0"></el-option>
            <el-option label="未绑定" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </SearchContainer>
    <ButtonList mb-5>
      <template #left>
        <el-button :icon="Plus" type="primary" @click="handleEdquipBind">
          设备绑定
        </el-button>
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
      @bind="handleBind"
      @selection="onSelectChange"
      @selection-all="onSelectAll"
      @batchexport="onExportTable('设备绑定')"
    ></SelectionExpandTable>

    <el-dialog
      class="measure"
      width="25%"
      v-model="dialogVisiable"
      :title="dialogTitle"
      align-center
    >
      <template #header>
        <div flex items-center>
          <div font-600 leading-6 text-size-4 mr-2>{{ title1 }}</div>
          <div style="color: #86909c">{{ title2 }}</div>
        </div>
      </template>
      <el-form label-width="120" :model="form" :rules="rules" ref="formRef">
        <el-form-item label="计量设备编号" prop="measureModuleNo">
          <el-select
            class="w-full!"
            v-model="form.measureModuleNo"
            filterable
            placeholder="请选择计量设备编号"
          >
            <el-option
              v-for="item in moduleManages?.result"
              :key="item.id"
              :label="item.measureModuleNo"
              :value="item.measureModuleNo"
            />
            <template #empty>
              <div flex-col justify-center items-center pt-5 pb-5>
                <span color="#86909C" mb-4>无数据</span>
                <router-link
                  to="/archives/chargingMeterage"
                  target="_blank"
                  style="color: #0fc6c2"
                >
                  点击“新增计量设备”
                </router-link>
              </div>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="安装时间" prop="bindTime">
          <el-date-picker
            class="w-full!"
            v-model="form.bindTime"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择安装时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="info" @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog
      class="binddialog"
      align-center
      :title="dialogTitle2"
      v-model="dialogVisiable2"
      width="1200px"
    >
      <template #header>
        <div mr-1 leading-6>{{ dialogTitle2 }}</div>
        <div flex items-center absolute class="rightbind">
          <div text-size-3.5 leading-5.5 mr-4>搜索仅显示未绑定设备</div>
          <el-switch
            v-model="switchStatus"
            inline-prompt
            active-text="开"
            :active-value="false"
            inactive-text="关"
            :inactive-value="true"
            @change="handleSwitchChange"
          />
        </div>
      </template>
      <el-form
        style="max-height: 70vh"
        :model="dynamicValidateForm"
        overflow-hidden
        overflow-y-auto
        class="w-full! scrollbar"
        label-position="top"
        label-width="auto"
        ref="formRef2"
      >
        <div
          class="equip"
          w-full
          flex-col
          items-center
          justify-center
          mb-4
          v-for="(domain, index) in dynamicValidateForm.domains"
        >
          <el-row w-full align="middle">
            <el-col :span="6">
              <el-form-item
                :label="domain.key + '#计量设备编号'"
                :prop="'domains.' + index + '.value'"
                :rules="{
                  required: true,
                  message: '计量设备编号不能为空',
                  trigger: 'change',
                }"
              >
                <el-select
                  class="w-full!"
                  v-model="domain.value"
                  filterable
                  clearable
                  placeholder="请选择计量设备编号"
                >
                  <el-option
                    v-for="item in bindMeasureModules?.result"
                    :key="item.measureModuleNo"
                    :value="item.measureModuleNo"
                    :label="item.measureModuleNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" flex items-center justify-center>
              <el-icon :size="32">
                <i-iemp-link></i-iemp-link>
              </el-icon>
            </el-col>
            <el-col :span="14">
              <el-form-item
                :label="domain.key + '#充电接口编号'"
                :prop="'domains.' + index + '.value2'"
                :rules="{
                  required: true,
                  message: '充电接口编号不能为空',
                  trigger: 'change',
                }"
              >
                <div relative w-full>
                  <el-popover
                    placement="bottom-start"
                    :width="900"
                    trigger="click"
                    popper-class="mycascaderpanel"
                    ref="popoverRef"
                    @hide="handleHidePopover"
                  >
                    <template #reference>
                      <el-input
                        w-full
                        v-model="domain.value2"
                        placeholder="可直接输入充电接口编号或通过充电桩去选择"
                        @input="handleInput"
                        clearable
                      ></el-input>
                    </template>
                    <el-row>
                      <el-col :span="12" pt-2 pb-2 pl-3 flex items-center>
                        <el-icon :size="16" ml-4 mr-2>
                          <SvgIcon name="chargingpile"></SvgIcon>
                        </el-icon>
                        <span mr-5 text-size-3.5>表示充电桩</span>
                      </el-col>
                      <el-col
                        :span="12"
                        pt-2
                        pb-2
                        pl-3
                        flex
                        items-center
                        style="border-left: solid #e5e6eb 1px"
                      >
                        <el-icon :size="16" ml-4 mr-2>
                          <SvgIcon name="charginginterface"></SvgIcon>
                        </el-icon>
                        <span text-size-3.5>表示充电接口</span>
                      </el-col>
                    </el-row>
                    <el-cascader-panel
                      @change="value => handleChangeCascader(value, domain)"
                      :props="props2"
                      :options="equipData"
                      :show-all-levels="false"
                    >
                      <template #default="{ node, data }">
                        <div flex items-center>
                          <el-icon :size="16" mr-2>
                            <SvgIcon
                              :name="
                                node.level === 1
                                  ? 'chargingpile'
                                  : 'charginginterface'
                              "
                            ></SvgIcon>
                          </el-icon>
                          <span>{{ data.label }}</span>
                        </div>
                      </template>
                    </el-cascader-panel>
                  </el-popover>
                </div>
                <!-- <el-cascader
                  class="w-full!"
                  ref="cascaderRef2"
                  v-model="domain.value2"
                  :props="props2"
                  @input.native="handleInput"
                  filterable
                  :before-filter="handleBeforeFilter"
                /> -->
              </el-form-item>
            </el-col>
            <el-col :span="2" flex items-center justify-center>
              <el-icon
                :size="32"
                :color="
                  dynamicValidateForm.domains.length === 1
                    ? '#C0C4CC'
                    : '#0FC6C2'
                "
                :class="
                  dynamicValidateForm.domains.length === 1
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="removeDomain(domain)"
              >
                <!-- <i-iemp-minus></i-iemp-minus> -->
                <SvgIcon name="minus"></SvgIcon>
              </el-icon>
            </el-col>
          </el-row>
        </div>
        <el-icon :size="32" cursor-pointer @click="addDomain">
          <i-iemp-plus></i-iemp-plus>
        </el-icon>
      </el-form>
      <template #footer>
        <el-button type="info" @click="handleClose(formRef2)">取消</el-button>
        <el-button type="primary" @click="handleBatchBind(formRef2)">
          绑定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  bindMeasure,
  getAllConnector,
  getBindStatistics,
  getMeasureConnector,
  getMeasureModuleManage,
  getBindList,
  getAllEquip,
} from '@/api/running'
import { API } from '@/api/dossier'
import SearchContainer from '@/components/SearchContainer.vue'
import useForm from '@/hooks/web/useForm'
import useQueryTable from '@/hooks/web/useQueryTable'
import SelectionExpandTable from './components/SelectionExpandTable.vue'
import useDialog from '@/hooks/web/useDialog'
import { useGlobalStore } from '@/store'
import { isArray } from '@vue/shared'
import useCascader from '@/hooks/web/useCascader'
import ButtonList from '@/components/ButtonList.vue'
import { Plus } from '@element-plus/icons-vue'
import {
  CascaderProps,
  CascaderValue,
  ElCascader,
  FormInstance,
  ElPopover,
} from 'element-plus'
import { formatToDate } from '@/utils/dateUtil'
import { getDossierList } from '@/api/dossier'

const useGlobal = useGlobalStore()

const switchStatus = ref(true)
const cascaderRef2 = ref<InstanceType<typeof ElCascader>>()
const popoverRef = ref<InstanceType<typeof ElPopover>>()

const props2: CascaderProps = {
  expandTrigger: 'hover',
  children: 'aconnectorVOS',
  // lazy: true,
  // lazyLoad: async (node, resolve) => {
  //   const { level } = node
  //   if (level === 0) {
  //     // @ts-ignore
  //     resolve(equipData.value)
  //   } else if (level === 1) {
  //     await runAllConnector({ equipmentNo: node.data?.value })
  //     // @ts-ignore
  //     resolve(connectorData.value?.result)
  //   }
  // },
}

const { cascaderValue, props, handleChange, cascaderRef } = useCascader(
  '340100',
  undefined,
  value => {
    if (isArray(value)) {
      searchForm.value.supervisionOrgNo = value[value.length - 1]
      run({ supervisionOrgNo: value[value.length - 1] + '' })
      fetchTableList({
        queryParams: {
          data: {
            supervisionOrgNo: value[value.length - 1] + '',
          },
        },
      })
    }
  }
)

const areaName = ref('')
watch(
  () => searchForm.value.supervisionOrgNo,
  value => {
    areaName.value = useGlobal.areaList.filter(
      v => v.areaNo === value
    )[0].areaName
  },
  { immediate: true }
)

const { data, run } = useRequest(getBindStatistics, {
  defaultParams: [
    {
      supervisionOrgNo: '340100',
    },
  ],
})

const { data: bindMeasureModules, run: getBindMeasureModules } = useRequest(
  getBindList,
  {
    defaultParams: [
      {
        bindStatus: '',
      },
    ],
  }
)

const handleSwitchChange = e => {
  getBindMeasureModules({
    bindStatus: e ? '' : '1',
  })
}

const { form: searchForm, handleResetForm } = useForm([
  {
    name: 'supervisionOrgNo',
    default: '340100',
  },
  'equipmentNo',
  'stationName',
  'stationAddress',
  'equipStatus',
  'bindStatus',
])

const {
  tableData,
  tableColumns,
  loading,
  total,
  current,
  size,
  tableRef,
  fetchTableList,
  onExportTable,
  onSelectChange,
  hasSelectedRow,
  onSelectAll,
  tableHeight,
} = useQueryTable(getMeasureConnector, {
  queryParams: {
    data: {
      supervisionOrgNo: '340100',
    },
  },
  expectOmitedColumnNames: [
    'measureLeafVOList',
    'operatorNo',
    'supervisionOrgNo',
    'stationNo',
  ],
})

const { tableData: equipData, fetchTableList: fetchEquipList } = useQueryTable(
  getDossierList,
  {
    requestUrl: API.EQUIPMENT_MANAGER,
    queryParams: {
      data: {
        supervisionOrgNo: '340100',
      },
    },
    // lazy: true,
  }
)

// const { data: equipData } = useRequest(getAllEquip)

const handleInput = async (keyword: string) => {
  await fetchEquipList({
    queryParams: {
      data: {
        supervisionOrgNo: searchForm.value.supervisionOrgNo,
        equipmentNameOrNoLike: keyword,
      },
    },
  })
}

watch(equipData, () => {
  equipData.value?.forEach((v: any) => {
    v['value'] = v.equipmentNo
    v['label'] = `${v.equipmentNo}(${v.equipmentName})`
    if (v['aconnectorVOS'] && v['aconnectorVOS'].length > 0) {
      v['aconnectorVOS'].forEach(v2 => {
        v2['value'] = v2.connectorNo
        v2['label'] = `${v2.connectorNo}(${v2.connectorName})`
      })
    }
  })
  console.log('所以结果就是', equipData.value)
})
const { data: connectorData, run: runAllConnector } = useRequest(
  getAllConnector,
  {
    manual: true,
  }
)

watch(connectorData, () => {
  connectorData.value?.result.forEach(v => {
    v['value'] = v.connectorNo
    v['label'] = `${v.connectorNo}(${v.connectorName})`
    v['leaf'] = true
  })
})

const handleChangeCascader = (value: CascaderValue, values: any) => {
  if (isArray(value)) {
    values.value2 = value[1]
  }
  nextTick(() => {
    if (isArray(popoverRef.value)) {
      popoverRef.value.forEach(v => {
        v['hide']()
      })
    }
  })
}

const { dialogTitle, dialogVisiable } = useDialog(undefined, () => {
  handleResetMeasureForm(() => fetchTableList())
})
const {
  form,
  rules,
  formRef,
  onSubmitForm,
  handleResetForm: handleResetMeasureForm,
} = useForm([
  {
    name: 'measureModuleNo',
    required: true,
    message: '请选择计量设备编号',
  },
  'bindTime',
  'connectorNo',
  'equipmentNo',
])

const title1 = ref('')
const title2 = ref('')

const handleBind = (row: Recordable) => {
  dialogVisiable.value = true
  title1.value = '计量设备绑定'
  title2.value = `${row.connectorName}/${row.connectorNo}`
  form.value.connectorNo = row.connectorNo
  form.value.equipmentNo = row.equipmentNo
}

const { data: moduleManages } = useRequest(getMeasureModuleManage)

const handleConfirm = () => {
  onSubmitForm(async valid => {
    if (valid) {
      await bindMeasure([form.value], { showSuccessModal: true })
      dialogVisiable.value = false
    }
  })
}

const { dialogTitle: dialogTitle2, dialogVisiable: dialogVisiable2 } =
  useDialog()

const handleEdquipBind = () => {
  dialogVisiable2.value = true
  dialogTitle2.value = '设备绑定'
}

const handleHidePopover = async () => {
  if (isArray(popoverRef.value)) {
    popoverRef.value.forEach(v => {
      v['hide']()
    })
  }
  await fetchEquipList(
    {
      queryParams: {
        data: {
          supervisionOrgNo: searchForm.value.supervisionOrgNo,
        },
        page: {
          current: 1,
          size: 10,
        },
      },
    },
    {
      deepmerge2: false,
    }
  )
}

interface DomainItem {
  key: number
  value: string
  value2: string
}

const formRef2 = ref<FormInstance>()
const dynamicValidateForm = reactive<{
  domains: DomainItem[]
}>({
  domains: [
    {
      key: 1,
      value: '',
      value2: '',
    },
  ],
})

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.domains.indexOf(item)
  if (index !== -1 && dynamicValidateForm.domains.length !== 1) {
    dynamicValidateForm.domains.splice(index, 1)
  }
}

const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: dynamicValidateForm.domains.length + 1,
    value: '',
    value2: '',
  })
}

const handleBatchBind = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      const values = dynamicValidateForm.domains.map(v => ({
        bindTime: formatToDate(),
        connectorNo: v.value2,
        measureModuleNo: v.value,
        equipmentNo: connectorData.value?.result.filter(
          v2 => v2.connectorNo === v.value2
        )[0].equipmentNo,
      }))
      await bindMeasure(values, { showSuccessModal: true })
      dialogVisiable2.value = false
    } else {
      return false
    }
  })
}

const handleClose = (formEl: FormInstance | undefined) => {
  dialogVisiable2.value = false
  resetForm(formEl)
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="scss" scoped>
.equip {
  // height: 100px;
  padding: 20px 20px 2px 20px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
}
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

<style lang="scss">
.measure {
  .el-dialog__body {
    padding: 40px !important;
  }

  .el-input__wrapper {
    width: 100% !important;
  }
}

.binddialog {
  .el-dialog__header {
    position: relative;
    width: 100%;
    font-size: 16px;
    color: #1d2129;
  }
  .el-dialog__body {
    padding: 20px !important;
  }
}

.rightbind {
  right: 60px;
}
.mycascaderpanel {
  // background-color: white;
  .el-cascader-panel.is-bordered {
    border-right: none !important;
    border-left: none !important;
    border-bottom: none !important;
  }
  padding: 0 !important;
  .el-cascader-panel {
    border-radius: 0px;
  }
  .el-cascader-menu__wrap.el-scrollbar__wrap {
    width: 450px;
  }
}

.el-popover.mycascaderpanel {
  width: 900px !important;
  .el-scrollbar__view.is-empty {
    width: 100%;
  }
}
</style>
