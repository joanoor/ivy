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
        handleResetForm(() => {
          cascaderValue = '340100'
          fetchTableList(
            {
              queryParams: {
                data: {
                  ...searchForm,
                  taskStatus: activeTabName,
                },
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
        <el-form-item label="任务单号">
          <el-input
            clearable
            v-model="searchForm.taskId"
            placeholder="请输入任务单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="充电桩编号">
          <el-input
            clearable
            v-model="searchForm.equipmentNo"
            placeholder="请输入充电桩编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="运营商名称">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.operatorName"
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
        <el-form-item label="充电站名称">
          <el-input
            class="w-full!"
            clearable
            v-model="searchForm.stationName"
            placeholder="请输入充电站名称"
          ></el-input>
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
      @selection="onSelectChange"
      @selection-all="onSelectAll"
    >
      <template #default="{ row }">
        <div flex items-center>
          <el-button
            link
            type="primary"
            v-if="row.taskStatus === '1'"
            size="default"
            @click="handleClickRow(row, 'detail')"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            v-else
            size="default"
            @click="handleClickRow(row, 'review')"
          >
            复核
          </el-button>
        </div>
      </template>
      <template #button>
        <el-button
          type="info"
          size="default"
          @click="handleBatchCheck"
          :disabled="!hasSelectedRow"
          v-if="activeTabName === '0'"
        >
          批量复核
        </el-button>
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="
            onExportTable(
              `${
                activeTabName === '0'
                  ? '待'
                  : activeTabName === '1'
                  ? '已'
                  : '全部'
              }复核记录`,
              {
                data: {
                  taskStatus: activeTabName,
                },
              }
            )
          "
        >
          {{ hasSelectedRow ? '导出所选' : '导出全部' }}
        </el-button>
      </template>
    </SelectionTable>

    <el-dialog
      v-model="dialogVisiable"
      :title="dialogTitle"
      class="loadtask"
      width="520px"
      align-center
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        :inline="false"
        size="default"
      >
        <el-form-item label="任务单号">
          <el-input
            v-if="isSingleReview"
            v-model="currentSelectedRecord.taskId"
            disabled
          ></el-input>
          <el-select
            v-else
            class="w-full!"
            v-model="data.taskId"
            multiple
            disabled
            collapse-tags
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in allSelectedData"
              :key="item.taskId"
              :label="item.taskId"
              :value="item.taskId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="充电桩编号">
          <el-input
            v-if="isSingleReview"
            v-model="currentSelectedRecord.equipmentNo"
            disabled
          ></el-input>
          <el-select
            v-else
            class="w-full!"
            v-model="data.equipmentNo"
            multiple
            disabled
            collapse-tags
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in allSelectedData"
              :key="item.equipmentNo"
              :label="item.equipmentNo"
              :value="item.equipmentNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="复核时间" prop="checkTime">
          <el-date-picker
            v-model="form.checkTime"
            type="date"
            :disabled="disabled"
            placeholder="请选择复核日期"
            value-format="YYYY-MM-DD"
            class="w-full!"
            :disabled-date="isDisableData"
          />
        </el-form-item>
        <el-form-item label="复核人员" prop="checkUser">
          <el-input
            :disabled="disabled"
            clearable
            v-model="form.checkUser"
            placeholder="请输入复核人员"
          ></el-input>
        </el-form-item>
        <el-form-item label="复核结果" prop="checkResult">
          <el-select
            :disabled="disabled"
            w-full
            v-model="form.checkResult"
            placeholder="请选择复核结果"
            clearable
          >
            <el-option
              v-for="item in useGlobal.dicts['CHECK_RESULT']"
              :key="item.codeId"
              :value="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :disabled="disabled"
            v-model="form.notes"
            placeholder="请输入..."
            type="textarea"
            maxlength="120"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            :accept="acceptType"
            ref="uploadRef"
            :file-list="fileList"
            class="upload-demo"
            :auto-upload="false"
            action=""
            multiple
            :on-change="(e, uploadFiles) => onChange(e, uploadFiles)"
            :limit="3"
            :on-remove="handleRemove"
          >
            <el-button type="info" :icon="Plus">上传文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持图片、pdf、word、excel、压缩包等，且不超过10M
                <br />
                <span color="red">最多只允许上传3个文件</span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogVisiable2"
      :title="dialogTitle2"
      class="loadtask"
      width="50vw"
      align-center
    >
      <div leading-7 text-size-5 font-600 mb-4>复核信息</div>
      <el-row :gutter="10" mb-2 leading-5.5>
        <el-col :span="4" class="detail-info">任务单号</el-col>
        <el-col :span="8">{{ onDecodeDict(detailData, 'taskId') }}</el-col>
        <el-col :span="4" class="detail-info">复核结果</el-col>
        <el-col :span="8">
          {{ onDecodeDict(detailData, 'checkResult', 'CHECK_RESULT') }}
        </el-col>
      </el-row>
      <el-row :gutter="10" mb-2 leading-5.5>
        <el-col :span="4" class="detail-info">充电桩编号</el-col>
        <el-col :span="8">{{ onDecodeDict(detailData, 'equipmentNo') }}</el-col>
        <el-col :span="4" class="detail-info">备注</el-col>
        <el-col :span="8">{{ onDecodeDict(detailData, 'notes') }}</el-col>
      </el-row>
      <el-row :gutter="10" leading-5.5 mb-8>
        <el-col :span="4" class="detail-info">复核时间</el-col>
        <el-col :span="8">{{ onDecodeDict(detailData, 'checkTime') }}</el-col>
      </el-row>

      <div leading-7 text-size-5 font-600 mb-4>附件</div>
      <el-table header-row-class-name="iemp-table-header" :data="fileAttaches">
        <el-table-column label="文件名称" prop="fileName"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="handleSee(scope.row)">
              查看
            </el-button>
            <el-button type="primary" link @click="downLoadFile(scope.row)">
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="dialogVisiable2 = false">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SearchContainer from '@/components/SearchContainer.vue'
import SelectionTable from '@/components/Table/SelectionTable.vue'
import useForm from '@/hooks/web/useForm'
import { isDisableData, seePic, getPreviewUrl } from '@/utils'
import useQueryTable, { GenStruct } from '@/hooks/web/useQueryTable'
import {
  checkTask,
  downLoadMyFile,
  getCheckDetail,
  getLoadTaskList,
} from '@/api/jdmanager'
import useDialog from '@/hooks/web/useDialog'
import useUpload from '@/hooks/web/useUpload'
import { Plus, Download } from '@element-plus/icons-vue'
import useTab from '@/hooks/web/useTab'
import { useGlobalStore } from '@/store'
import { getAllOperator } from '@/api/dossier'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@vue/shared'
import { CheckStruct } from '@/api/jdmanager/model'
import useDecodeDict from '@/hooks/web/useDecodeDict'
import { download } from '@/hooks/web/useDownload'
import { useRouter } from 'vue-router'

const useGlobal = useGlobalStore()
const { onDecodeDict } = useDecodeDict()
const router = useRouter()

const { cascaderValue, props, handleChange, cascaderRef } = useCascader(
  '340100',
  undefined,
  value => {
    if (isArray(value)) {
      searchForm.value.supervisionOrgNo = value[value.length - 1]
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

const detailData = ref<CheckStruct>({})
const fileAttaches = ref<{ fileName: string }[]>([])

const { data: operatorList } = useRequest(getAllOperator)

const { activeTabName, tabList } = useTab(
  [
    {
      name: '0',
      label: '待复核任务',
    },
    {
      name: '1',
      label: '已复核任务',
    },
    {
      name: '',
      label: '所有任务',
    },
  ],
  () => {
    fetchTableList({
      queryParams: {
        data: {
          taskStatus: activeTabName.value,
          supervisionOrgNo: searchForm.value.supervisionOrgNo,
        },
      },
    })
  }
)

const { onChange, uploadRef, acceptType, fileList, handleRemove, upLoadFiles } =
  useUpload()

const { form: searchForm, handleResetForm } = useForm([
  {
    name: 'supervisionOrgNo',
    default: '340100',
  },
  'taskId',
  'equipmentNo',
  'operatorName',
  'stationName',
])

const {
  tableData,
  tableColumns,
  columns,
  tableHeight,
  tableRef,
  loading,
  total,
  current,
  size,
  currentSelectedRecord,
  hasSelectedRow,
  allSelectedData,
  onCurrentSelectRecord,
  onSelectChange,
  onSelectAll,
  onExportTable,
  onGetAllSelectedRows,
  fetchTableList,
} = useQueryTable(getLoadTaskList, {
  queryParams: {
    data: {
      taskStatus: activeTabName.value,
      supervisionOrgNo: '340100',
    },
  },
  customColumns: [
    {
      name: 'taskId',
      minWidth: '280',
      title: '任务单号',
    },
    {
      name: 'equipmentNo',
      minWidth: '200',
    },
    {
      name: 'checkResult',
      fixed: 'right',
    },
  ],
  expectOmitedColumnNames: ['supervisionOrgNo'],
})

watch(currentSelectedRecord, (newValue, oldValue) => {
  if (!newValue) {
    currentSelectedRecord.value = oldValue
  }
})

watch(tableColumns, () => {
  tableColumns.value.forEach(v => {
    if (v.name === 'checkResult') {
      v.hidden = activeTabName.value === '0'
    }
  })
})

const {
  form,
  rules,
  onSubmitForm,
  formRef,
  onInitialForm,
  onEchoForm,
  onResetForm,
} = useForm(
  [
    'id',
    'taskId',
    'equipmentNo',
    { name: 'checkTime', required: true },
    {
      name: 'checkUser',
      required: true,
    },
    {
      name: 'checkResult',
      required: true,
    },
    'notes',
  ],
  columns,
  {
    expectOmitedColumnNames: ['id'],
  }
)

const { dialogTitle, dialogVisiable, disabled } = useDialog(
  () => {
    onEchoForm(currentSelectedRecord.value)
  },
  () => {
    onInitialForm()
    onResetForm()
    fetchTableList()
    uploadRef.value?.clearFiles()
    fileList.value = []
  }
)

const { dialogTitle: dialogTitle2, dialogVisiable: dialogVisiable2 } =
  useDialog()

type ClickType = 'review' | 'detail'

const obj: Record<ClickType, string> = {
  detail: '详情',
  review: '复核',
}

const isSingleReview = ref(true)
const data = reactive({
  taskId: [] as string[],
  equipmentNo: [] as string[],
})

const handleClickRow = (
  row: GenStruct<typeof getLoadTaskList>,
  type: ClickType
) => {
  if (type === 'detail') {
    dialogTitle2.value = obj[type]
    dialogVisiable2.value = true
    runCheckDetail({
      taskId: row.taskId,
    }).then(res => {
      detailData.value = res.result
      if (res.result.fileA) {
        fileAttaches.value = res.result.fileA
          .split('***<<<>>>???')
          .map(v => ({
            fileName: v,
            taskId: row.taskId,
          }))
          .filter(v => v.fileName)
      } else {
        // 否则清空
        fileAttaches.value = []
      }
    })
  } else {
    dialogTitle.value = obj[type]
    dialogVisiable.value = true
    isSingleReview.value = true
    nextTick(() => {
      onCurrentSelectRecord(row)
    })
  }
}

const downLoadFile = row => {
  downLoadMyFile(
    {
      fileName: row.fileName,
      taskId: row.taskId,
    },
    { isTransformResponse: false }
  ).then(res => {
    download(res, row.fileName)
  })
}

const handleSee = row => {
  downLoadMyFile(
    {
      fileName: row.fileName,
      taskId: row.taskId,
    },
    { isTransformResponse: false }
  ).then(res => {
    const url = getPreviewUrl(res)
    let type = ''
    if (row.fileName.includes('.png') || row.fileName.includes('.jpg')) {
      seePic(url)
    } else if (row.fileName.includes('.pdf')) {
      type = 'pdf'
    } else if (
      row.fileName.includes('.xls') ||
      row.fileName.includes('.xlsx')
    ) {
      type = 'excel'
    } else if (row.fileName.includes('.doc') || row.file.includes('.docx')) {
      type = 'word'
    }

    const newHref = router.resolve({
      path: '/preview',
      query: {
        type,
        src: url,
      },
    })
    window.open(newHref.href, '_blank')
  })
}

const handleBatchCheck = () => {
  onGetAllSelectedRows()
  dialogTitle.value = '批量复核'
  dialogVisiable.value = true
  isSingleReview.value = false

  data.taskId = allSelectedData.value.map(v => v.taskId)
  data.equipmentNo = allSelectedData.value.map(v => v.equipmentNo)
}

const handleConfirm = () => {
  onSubmitForm(async valid => {
    if (valid) {
      if (!disabled.value) {
        // const fileNames = ['multipartFileA', 'multipartFileB', 'multipartFileC']
        // const files = {}
        // for (let i = 0; i < formDatas.value.length; i++) {
        //   files[fileNames[i]] = formDatas.value[i]
        // }
        const objs = !isSingleReview.value
          ? allSelectedData.value.map(v => ({
              checkResult: form.value.checkResult,
              checkTime: form.value.checkTime,
              checkUser: form.value.checkUser,
              notes: form.value.notes,
              equipmentNo: v.equipmentNo,
              id: v.id,
              taskId: v.taskId,
            }))
          : [
              {
                checkResult: form.value.checkResult,
                checkTime: form.value.checkTime,
                checkUser: form.value.checkUser,
                notes: form.value.notes,
                equipmentNo: currentSelectedRecord.value.equipmentNo,
                id: currentSelectedRecord.value.id,
                taskId: currentSelectedRecord.value.taskId,
              },
            ]
        // const url =
        //   fileList.value.length === 1
        //     ? `/inspection/file/upload/file`
        //     : `/inspection/file/upload/Batch`
        const url = `/inspection/file/upload/Batch`

        await upLoadFiles(url, fd => {
          fd.append('taskId', currentSelectedRecord.value.taskId)
        })
        await checkTask(objs, { showSuccessModal: true })
      }
      dialogVisiable.value = false
    }
  })
}

const { runAsync: runCheckDetail } = useRequest(getCheckDetail, {
  defaultParams: [
    {
      taskId: '',
    },
  ],
  manual: true,
})
</script>

<style lang="scss" scoped>
.noninputform {
  width: 100%;
  height: var(--el-component-size);
  line-height: var(--el-input-height);
  background-color: var(--el-disabled-bg-color);
  color: var(--el-text-color-disabled);
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  border-radius: var(--el-border-radius-base);
  padding: 1px 11px;
  cursor: not-allowed;

  .batch {
    width: 114px;
    height: 24px;
    background: #ffffff;
    border: 1px solid #e5e6eb;
    border-radius: 2px;
    padding: 0 5px;
  }
}
</style>

<style scoped lang="scss">
.detail-info {
  color: #86909c;
  text-align: right;
}
</style>

<style lang="scss">
.loadtask {
  .el-dialog__body {
    padding: 40px !important;
    .el-input__wrapper {
      width: 100% !important;
    }
  }
  .el-tag.el-tag--info {
    --el-tag-text-color: #1d2129 !important;
  }
}
</style>
