<template>
  <el-table
    :data="tableData"
    :border="false"
    v-loading="tableLoading"
    header-row-class-name="custom-table-header"
    ref="tableRef"
    :height="tableHeight"
    class="mb-3"
  >
    <template #empty>
      <el-empty class="w-full" description="暂无数据" />
    </template>
    <el-table-column label="序号" width="80" align="center">
      <template #default="scope">
        {{ onTableIndex(scope.$index) }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="col in tableColumns"
      :key="col.name"
      :prop="col.name"
      :label="col.title"
      :width="col.width"
      :fixed="col.fixed"
      show-overflow-tooltip
    >
      <template #default="scope">
        <template v-if="col.name === 'operate'">
          <div class="flex">
            <el-button
              type="primary"
              size="small"
              @click="showScope(scope.row)"
            >
              编辑
            </el-button>
            <el-button type="info" size="small">删除</el-button>
          </div>
        </template>
        <template v-else>
          {{ onDecodeDict(scope.row, col.name, col.dictName) }}
        </template>
      </template>
    </el-table-column>
  </el-table>
  <Pagination
    :total="total"
    v-model:current="current"
    v-model:size="size"
  ></Pagination>
  <Dialog
    v-model:visiable="dialogVisiable"
    v-model:form="form"
    :title="dialogTitle"
    :form-ref="formRef"
    :form-columns="formColumns"
    :rules="rules"
    @submit="onSubmitForm(submitFunc)"
  ></Dialog>
</template>

<script setup lang="ts">
import useQueryTable from '@shared/hooks/web/useQueryTable'
import { getAllMeterPage, testError } from '@/api'
import { useGlobalStore } from '@shared/store'
import useDecodeDict from '@shared/hooks/web/useDecodeDict'
import useDialog from '@shared/hooks/web/useDialog'
import useForm, { defineFormTypes } from '@shared/hooks/web/useForm'
import Dialog from '@/components/Dialog.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { ResultElectricityStruct } from '@/api/dossier/model/terminalModel'
const useGlobal = useGlobalStore()

const { onDecodeDict } = useDecodeDict({
  ACVALID: [
    {
      name: '开启',
      value: '1',
    },
    {
      name: '关闭',
      value: '0',
    },
  ],
  ORGNO: useGlobal.orgList.map(v => ({
    name: v.orgName,
    value: v.orgNo,
  })),
})

const {
  tableData,
  tableColumns,
  columns,
  loading: tableLoading,
  onTableIndex,
  fetchTableList,
  total,
  size,
  current,
  tableRef,
  tableHeight,
} = useQueryTable<ResultElectricityStruct>(getAllMeterPage, {
  appendColumns: [
    {
      name: 'operate',
      title: '操作',
      fixed: 'right',
      width: '180',
    },
  ],
  customColumns: [
    {
      name: 'createTime',
      width: '180',
    },
    {
      name: 'phaseLine',
      width: '100',
    },
    {
      name: 'protocolType',
      width: '160',
    },
    {
      name: 'orgNo',
      width: '240',
    },
  ],
  expectOmitedColumnNames: ['meterId'],
  lazy: true,
})

const formProps = defineFormTypes([
  {
    name: 'commMode',
    required: true,
  },
  'commAddress',
  'meterId',
])
const { form, formRef, rules, formColumns, onEchoForm, onSubmitForm } = useForm<
  {
    [P in (typeof formProps)[number] as P extends string ? P : never]: any
  } & { [x: string]: any }
>(formProps, columns, {
  expectOmitedColumnNames: ['meterId'],
})

const submitFunc = async (valid?: boolean) => {
  if (valid) {
    // ;(dialogTitle.value === '编辑电表' &&
    //   (await updateMeter(form.value))) ||
    //   (await addMeter(form.value))

    dialogVisiable.value = false
    fetchTableList() // 更新列表数据
  }
}

const { dialogTitle, dialogVisiable } = useDialog()

const showScope = (row: ResultElectricityStruct) => {
  dialogVisiable.value = true
  onEchoForm(row)
}

onMounted(async () => {
  const res = await testError()
  console.log(`有问题吗`, res)
})
</script>

<style lang="scss" scoped>
.login-container {
  background-color: rgb(5, 21, 32);

  .login-logo {
    top: 3%;
    left: 2%;

    div {
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }
  }

  .login {
    width: 440px;
    height: 416px;
    right: 7%;
    top: 27%;
    border-radius: 4px;
    padding: 60px 40px;
  }

  #bg_video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .login-title,
  .login-subtitle {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    height: 32px;
  }

  .loginform {
    span {
      color: $c-primary-6;
    }
  }
}
</style>
