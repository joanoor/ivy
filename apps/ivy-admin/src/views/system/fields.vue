<template>
  <div class="regions" flex bg-white>
    <div flex flex-col p-5 class="regions-left">
      <div pb-5 mb-5 class="regions-left-upper">
        <ButtonList mb-5>
          <template #left>
            <span style="font-size: 16px; color: #1d2129; font-weight: 600">
              主字段总览
            </span>
          </template>
          <template #right>
            <el-icon
              :size="14"
              cursor-pointer
              mr-4
              @click="handleAddMainFieldDialog"
            >
              <i-ep-plus></i-ep-plus>
            </el-icon>
            <el-icon
              :size="14"
              cursor-pointer
              mr-4
              @click="handleEditMainFieldRecord(currentSelectedRecord)"
            >
              <i-ep-edit-pen></i-ep-edit-pen>
            </el-icon>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#FF7D00"
              :title="'确认删除' + currentSelectedRecord.name + '?'"
              width="200"
              @confirm="handleDeleteMainFieldRecord(currentSelectedRecord)"
            >
              <template #reference>
                <el-icon :size="14" cursor-pointer>
                  <i-ep-delete></i-ep-delete>
                </el-icon>
              </template>
            </el-popconfirm>
          </template>
        </ButtonList>
        <SearchButton
          @search="
            value =>
              fetchMainFieldList({
                queryParams: {
                  name: value,
                },
              })
          "
        />
      </div>
      <div
        overflow-hidden
        overflow-y-scroll
        class="regions-left-down scrollbar"
        v-loading="mainFieldLoading"
      >
        <div
          flex
          items-center
          cursor-pointer
          v-for="dict in mainFieldTableData"
          :key="dict.codeSortId"
          :style="
            currentSelectedRecord?.codeSortId === dict.codeSortId
              ? 'color:#0FC6C2'
              : 'color:#4E5969'
          "
          @click="onCurrentSelectRecord(dict)"
        >
          <el-icon :size="14" class="mr-2">
            <i-ep-document></i-ep-document>
          </el-icon>
          <div leading-8>
            {{ dict.name }}
          </div>
        </div>
      </div>
    </div>
    <div flex-1 p-5 flex flex-col class="regions-right">
      <ButtonList mb-5>
        <template #left>
          <span style="font-size: 16px; color: #1d2129; font-weight: 600">
            {{ currentSelectedRecord?.name }}
          </span>
        </template>
        <template #right>
          <el-button
            type="primary"
            :icon="Plus"
            size="default"
            @click="handleAddSubFieldDialog"
          >
            新增子字段
          </el-button>
        </template>
      </ButtonList>

      <NrztTable
        ref="tableRef"
        :loading="subFieldLoading"
        v-model:current="current2"
        v-model:size="size2"
        :total="total2"
        :table-data="subFieldTableData"
        :table-columns="subFieldTableColumns"
        :table-height="subTableHeight"
        @edit-record="handleEditSubFieldRecord"
        @delete-record="handleDeleteSubFieldRecord"
      >
        <template #button>
          <!-- 占位 -->
          <div></div>
        </template>
      </NrztTable>
    </div>
  </div>
  <Dialog
    v-model:visiable="dialogMainVisiable"
    v-model:form="dictMainForm"
    :title="dialogMainTitle"
    :rules="mainDictRules"
    ref="mainFormRef"
    :form-columns="mainFormColumns"
    :confirm-word="confirmMainWord"
    :cancel-word="cancelMainWord"
    @submit="handleSubmitMainFields(mainFormRef.formRef2 || mainFormRef)"
  ></Dialog>
  <Dialog
    v-model:visiable="dialogSubVisiable"
    v-model:form="dictSubForm"
    :title="dialogSubTitle"
    :rules="subDictRules"
    ref="subFormRef"
    :form-columns="subFormColumns"
    :confirm-word="confirmSubWord"
    :cancel-word="cancelSubWord"
    @submit="handleSubmitSubFields(subFormRef.formRef2 || subFormRef)"
  ></Dialog>
</template>

<script setup lang="ts">
import { InfoFilled, Plus } from '@element-plus/icons-vue'
import ButtonList from '@/components/ButtonList.vue'
import SearchButton from '@/components/SearchButton.vue'
import NrztTable from '@/components/Table/NrztTable.vue'
import useQueryTable, { GenStruct } from '@/hooks/web/useQueryTable'
import useQueryList from '@/hooks/web/useQueryList'
import useForm from '@/hooks/web/useForm'
import useDialog from '@/hooks/web/useDialog'
import { submitForm } from '@utils/formAndRules/form'
import {
  addMainCode,
  addSubCode,
  deleteMainCode,
  deleteSubCode,
  getMainCodePage,
  getSubCodePage,
  updateMainCode,
  updateSubCode,
} from '@/api/system'
import { ElMessage } from 'element-plus'
import Dialog from '@/components/Dialog.vue'

// 主字段列表接口
const {
  loading: mainFieldLoading,
  tableData: mainFieldTableData,
  columns: mainFieldColumns,
  fetchTableList: fetchMainFieldList,
  currentSelectedRecord,
  onCurrentSelectRecord,
} = useQueryList(getMainCodePage)

// 子字段列表接口
const {
  loading: subFieldLoading,
  tableData: subFieldTableData,
  columns: subFieldColumns,
  tableColumns: subFieldTableColumns,
  fetchTableList: fetchSubFieldList,
  tableRef,
  current: current2,
  tableHeight: subTableHeight,
  size: size2,
  total: total2,
} = useQueryTable(getSubCodePage, {
  queryParams: {
    page: {
      size: 20,
      current: 1,
    },
  },
  lazy: true,
  customColumns: [
    {
      name: 'name',
      width: '',
    },
    {
      name: 'value',
      width: '',
    },
  ],
  expectOmitedColumnNames: ['codeSortId', 'codeId'],
  expectOrderColumnNames: ['name', 'value'],
})

watch(currentSelectedRecord, newValue => {
  fetchSubFieldList({
    queryParams: {
      data: {
        codeSortId: newValue.codeSortId,
      },
    },
  })
})

/**
 * 主字段的弹框和表单以及相关操作
 */
const {
  form: dictMainForm,
  rules: mainDictRules,
  formRef: mainFormRef,
  formColumns: mainFormColumns,
  onEchoForm: onEchoMainForm,
  onInitialForm: onInitialMainForm,
  onResetForm: onResetMainForm,
} = useForm(
  [
    'codeSortId',
    'dispSn',
    {
      name: 'name',
      required: true,
    },
    {
      name: 'validFlag',
      required: true,
    },
    {
      name: 'codeType',
      required: true,
    },
  ],
  mainFieldColumns,
  {
    expectOmitedColumnNames: ['codeSortId'],
    customDictionary: {
      VALIDFLAG: [
        {
          codeId: '1',
          name: '无效',
          value: '0',
        },
        {
          codeId: '2',
          name: '有效',
          value: '1',
        },
      ],
    },
  }
)
const {
  dialogVisiable: dialogMainVisiable,
  dialogTitle: dialogMainTitle,
  confirmWord: confirmMainWord,
  cancelWord: cancelMainWord,
} = useDialog()

const handleSubmitMainFields = submitForm(async (valid?: boolean) => {
  if (valid) {
    ;(dialogMainTitle.value.includes('编辑') &&
      (await updateMainCode(dictMainForm.value))) ||
      (await addMainCode(dictMainForm.value))

    dialogMainVisiable.value = false
    // 更新页面
    fetchMainFieldList()
  }
})

// 重置表单
watch(dialogMainVisiable, newValue => {
  if (!newValue) {
    onInitialMainForm()
    onResetMainForm()
  }
})

const handleAddMainFieldDialog = () => {
  dialogMainTitle.value = '新建主字段'
  dialogMainVisiable.value = true
}

const handleEditMainFieldRecord = (row: Recordable) => {
  dialogMainTitle.value = '编辑主字段'
  dialogMainVisiable.value = true
  onEchoMainForm(row)
}

const handleDeleteMainFieldRecord = async (row: Recordable) => {
  await deleteMainCode({
    codeSortId: row.codeSortId,
  })
  ElMessage.success('删除成功')
  fetchMainFieldList()
}

/**
 * 子字段的弹框和表单以及相关操作
 */
const {
  form: dictSubForm,
  rules: subDictRules,
  formRef: subFormRef,
  formColumns: subFormColumns,
  onEchoForm: onEchoSubForm,
  onInitialForm: onInitialSubForm,
  onResetForm: onResetSubForm,
} = useForm(
  [
    'codeSortId',
    'dispSn',
    {
      name: 'name',
      required: true,
    },
    {
      name: 'validFlag',
      required: true,
    },
    {
      name: 'value',
      required: true,
    },
    'codeId',
  ],
  subFieldColumns,
  {
    expectOmitedColumnNames: ['codeId', 'codeSortId'],
    customDictionary: {
      VALIDFLAG: [
        {
          codeId: '1',
          name: '无效',
          value: '0',
        },
        {
          codeId: '2',
          name: '有效',
          value: '1',
        },
      ],
    },
  }
)
const {
  dialogVisiable: dialogSubVisiable,
  dialogTitle: dialogSubTitle,
  confirmWord: confirmSubWord,
  cancelWord: cancelSubWord,
} = useDialog()

const handleSubmitSubFields = submitForm(async (valid?: boolean) => {
  if (valid) {
    ;(dialogSubTitle.value.includes('编辑') &&
      (await updateSubCode(dictSubForm.value))) ||
      (await addSubCode({
        ...dictSubForm.value,
        codeSortId: currentSelectedRecord.value.codeSortId,
      }))
    dialogSubVisiable.value = false
    fetchSubFieldList()
  }
})

watch(dialogSubVisiable, newValue => {
  if (!newValue) {
    onInitialSubForm()
    onResetSubForm()
  }
})

const handleAddSubFieldDialog = () => {
  dialogSubTitle.value = '新建子字段'
  dialogSubVisiable.value = true
}

const handleEditSubFieldRecord = (row: GenStruct<typeof getSubCodePage>) => {
  dialogSubTitle.value = '编辑子字段'
  dialogSubVisiable.value = true
  onEchoSubForm(row)
}

const handleDeleteSubFieldRecord = async (
  row: GenStruct<typeof getSubCodePage>
) => {
  await deleteSubCode({
    codeSortId: row.codeSortId,
    codeId: row.codeId,
  })
  ElMessage.success('删除成功')
  fetchSubFieldList()
}
</script>

<style lang="scss" scoped>
.regions {
  height: calc(100% - 32px);

  &-left {
    width: 320px;
    border-right: 1px solid #e5e6eb;

    &-upper {
      border-bottom: 1px solid #e5e6eb;
    }
    // &-down {
    //   max-height: 2000px;
    // }
  }

  &-right {
    width: calc(100% - 320px);
  }
}
</style>
