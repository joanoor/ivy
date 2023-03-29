<template>
  <div bg-white pl-5 pr-5 pb-5>
    <SearchContainer
      mode="horizontal"
      class="line bline"
      pt-5
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
                data: searchForm,
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
        <!-- <el-form-item label="区域">
          <el-select
            class="w-full!"
            clearable
            filterable
            v-model="searchForm.supervisionOrgs"
            placeholder="请选择"
          >
            <el-option
              v-for="item in useGlobal.supervisionOrgs"
              :key="item.supervisionOrgNo"
              :label="item.supervisionOrgName"
              :value="item.supervisionOrgNo"
            ></el-option>
          </el-select>
        </el-form-item> -->

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
              :value="item.supplierName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商编号">
          <el-input
            clearable
            v-model="searchForm.supplierNo"
            placeholder="请输入编号"
          ></el-input>
        </el-form-item>
      </el-form>
    </SearchContainer>
    <ButtonList mb-5>
      <template #left>
        <el-button
          type="primary"
          size="default"
          :icon="Plus"
          @click="handleAddSupplier"
        >
          新增
        </el-button>
        <el-button
          type="info"
          size="default"
          mr-2
          @click="downloadTemplate('/供应商导入模板.xlsx')"
        >
          模板下载
        </el-button>
        <el-upload
          class="upload mr-2"
          :auto-upload="false"
          action=""
          :on-change="(e: UploadFile) => uploadExcel(e,transformData,callback)"
          :show-file-list="false"
        >
          <el-button type="info">批量导入</el-button>
        </el-upload>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#FF7D00"
          title="确认删除这些选中的记录？"
          :width="400"
          @confirm="handleBatchDelete"
        >
          <template #reference>
            <el-button
              type="info"
              size="default"
              :disabled="tableData.length === 0"
            >
              批量删除
            </el-button>
          </template>
        </el-popconfirm>

        <el-popover placement="right" trigger="click">
          <template #reference>
            <el-button type="info" size="default" @click="handleSetShow">
              显示设置
            </el-button>
          </template>
          <PopoverColumn
            v-model:table-columns="tableColumns"
            :columns="columns"
          ></PopoverColumn>
        </el-popover>
      </template>
    </ButtonList>
    <SelectionTable
      @selection="handleSelection"
      :loading="loading"
      :table-columns="tableColumns"
      :table-data="tableData"
      :total="total"
      v-model:current="current"
      v-model:size="size"
      ref="tableRef"
      :table-height="tableHeight"
      @delete-record="handleDeleteRecord"
      @edit-record="handleEditSupplier"
      :has-selected-row="hasSelectedRow"
      @selection-all="onSelectAll"
    >
      <template #button>
        <el-button
          type="info"
          size="default"
          :icon="Download"
          :disabled="tableData.length === 0"
          @click="onExportTable('供应商管理')"
        >
          {{ hasSelectedRow ? '导出所选' : '导出全部' }}
        </el-button>
      </template>
    </SelectionTable>
  </div>

  <el-dialog
    v-model="dialogVisiable"
    :title="dialogTitle"
    width="25%"
    align-center
  >
    <el-form :model="form2" :rules="rules2" ref="formRef2" label-width="100px">
      <el-form-item
        v-for="col in formColumns"
        :key="col.name"
        :prop="col.name"
        :label="col.title"
        pr-15
      >
        <template v-if="col.component === 'input'">
          <el-input
            class="w-1/2"
            v-model="form2[col.name]"
            :placeholder="col.message"
          ></el-input>
        </template>
        <template v-else-if="col.component === 'cascader'">
          <!-- <el-cascader
            class="w-full!"
            v-model="form2[col.name]"
            :options="useGlobal.areas"
            :props="props"
            clearable
            @change="handleChange"
            popper-class="archive-cascader"
          /> -->
          <el-cascader
            class="w-full!"
            v-model="cascaderValue2"
            :options="useGlobal.areas"
            :props="props2"
            clearable
            placeholder="请选择区域"
            @change="handleChange2"
            ref="cascaderRef2"
            popper-class="archive-cascader"
          />
        </template>
        <template v-else-if="col.component === 'inputselect'"></template>
        <template v-else-if="col.component === 'select'">
          <el-select
            class="w-1/2"
            v-model="form2[col.name]"
            :placeholder="col.message"
            clearable
            filterable
          >
            <el-option
              v-for="item in col.selectOption"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template v-else-if="col.component === 'time'">
          <el-date-picker
            class="w-full!"
            v-model="form2[col.name]"
            type="datetime"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
          />
        </template>
        <template v-else-if="col.component === 'radio'">
          <el-form-item prop="supplierStatus">
            <el-radio-group v-model="form2.supplierStatus">
              <el-radio label="0" size="large">正常</el-radio>
              <el-radio label="1" size="large">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisiable = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef2)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import SearchContainer from '@/components/SearchContainer.vue'
import ButtonList from '@/components/ButtonList.vue'
import { Plus, Download, InfoFilled } from '@element-plus/icons-vue'

import { batchAddSupplier, getDossierList } from '@/api/dossier'
import SelectionTable from '@/components/Table/SelectionTable.vue'

import useDialog from '@/hooks/web/useDialog'
import useQueryTable from '@/hooks/web/useQueryTable'

import { ResultSupplierStruct } from '@/api/dossier/model'
import { SupplierDeleteRow } from '@/api/dossier/index'
import { submitForm } from '@/utils/formAndRules/form'
import { downloadTemplate } from '@/utils/index'

import {
  SupplierBatchDelete,
  addSuppliermanage,
  SupplierEditRow,
} from '@/api/dossier'
import { ElMessage, UploadFile } from 'element-plus'
import { API } from '@/api/dossier'
import { useGlobalStore } from '@/store'
import { getAllSupplier } from '@/api/dossier'
import PopoverColumn from './components/PopoverColumn.vue'
import useCascader from '@/hooks/web/useCascader'
import { isArray } from '@/libs/core'
import { formChecker } from '@ivy/form'

import useDownload from '@/hooks/web/useDownload'

const useGlobal = useGlobalStore()
const { uploadExcel } = useDownload()

const transformData = (data: Recordable[]) => {
  return data.map(v => {
    let result: Recordable = {}
    Object.keys(v).forEach(key2 => {
      const key = key2.replace('（编码）', '').replace('(编码)', '')
      const tmpColumn = tableColumns.value.find(column => column.title === key)

      if (tmpColumn) {
        result[tmpColumn['name']] = v[key2]
      } else {
        result[key2] = v[key2]
      }
    })
    return result
  })
}

const callback = async (data: Recordable[]) => {
  await batchAddSupplier(data)
  fetchTableList()
}

const { data: supplierList } = useRequest(getAllSupplier)
const {
  cascaderValue: cascaderValue2,
  props: props2,
  handleChange: handleChange2,
  cascaderRef: cascaderRef2,
} = useCascader('340100', undefined, value => {
  if (isArray(value)) {
    form2.value.areaNo = value[value.length - 1]
  }
})

const {
  form: searchForm,
  formRef,
  handleResetForm,
} = useForm(['supervisionUnit', 'supplierNo', 'supplierName'])

const {
  tableData,
  tableColumns,
  columns,
  loading,
  size,
  current,
  total,
  tableHeight,
  fetchTableList,
  tableRef,
  hasSelectedRow,
  onSelectChange,
  onSelectAll,
  onExportTable,
  allSelectedData,
  onGetAllSelectedRows,
} = useQueryTable(getDossierList, {
  requestUrl: API.SUPPLIER_MANAGER,
  queryParams: { data: {} },
  customColumns: [
    {
      name: 'createdTime',
      width: '',
    },
    {
      name: 'address',
      width: '',
    },
    // {
    //   name: 'areaNo',
    //   title: '区域',
    //   decode: row => {
    //     return getAreaPath(useGlobal.areaList, row['areaNo'])
    //   },
    // },
  ],

  expectOrderColumnNames: ['id', 'supplierName', 'supplierNo'],
  expectOmitedColumnNames: ['id'],
})

const { dialogVisiable, dialogTitle } = useDialog(undefined, () => {
  onInitialForm()
  onResetForm()
})

const {
  form: form2,
  formRef: formRef2,
  rules: rules2,
  formColumns,
  onEchoForm,
  onResetForm,
  onInitialForm,
} = useForm(
  [
    'id',
    {
      name: 'supplierName',
      required: true,
      title: '供应商名称',
    },
    {
      name: 'supplierNo',
      required: true,
      title: '供应商编号',
    },
    {
      name: 'address',
      required: true,
      title: '地址',
    },
    {
      name: 'phoneNo',
      required: true,
      title: '电话号码',
      rule: [
        {
          required: true,
          validator: formChecker.phoneChecker(),
          trigger: 'blur',
        },
      ],
    },
    {
      name: 'supplierStatus',
      title: '供应商状态',
      component: 'radio',
      default: '0',
    },
  ],
  // tableColumns,
  columns,
  {
    expectOmitedColumnNames: ['id'],
    customDictionary: {
      CONNECTORTYPE: useGlobal.dicts['connector_type'],
    },
  }
)

const handleSubmit = submitForm(async (valid?: boolean) => {
  if (valid) {
    if (isArray(form2.value.areaNo)) {
      form2.value.areaNo = form2.value.areaNo[form2.value.areaNo.length - 1]
    }
    if (dialogTitle.value.includes('新增')) {
      await addSuppliermanage(form2.value)
      dialogVisiable.value = false
      fetchTableList()
    } else if (dialogTitle.value.includes('修改')) {
      SupplierEditRow(form2.value).then(() => {
        ElMessage.success('修改成功')
        dialogVisiable.value = false
        fetchTableList()
      })
    } else {
      console.log('取消')
    }
  }
})

const handleDeleteRecord = async (row: ResultSupplierStruct) => {
  await SupplierDeleteRow(row.id)
  ElMessage.success({
    message: '删除成功',
  })
  fetchTableList()
}

const handleAddSupplier = () => {
  dialogTitle.value = '新增供应商'
  dialogVisiable.value = true
}

const handleEditSupplier = (row: ResultSupplierStruct) => {
  dialogTitle.value = '修改供应商'
  dialogVisiable.value = true
  onEchoForm(row)
}

// const resetSearch = () => {
//   form.value = cloneDeep(originalForm.value)
//   fetchTableList()
// }

const ids = ref<number[]>([])
const handleSelection = (val: any[]) => {
  ids.value = val.map(v => v.id)
  onSelectChange(val)
}

const handleBatchDelete = async () => {
  onGetAllSelectedRows()
  if (allSelectedData.value.length > 0) {
    await SupplierBatchDelete(ids.value)
    fetchTableList()
  } else {
    ElMessage.error('没有选择删除项')
  }
}

const handleSetShow = () => {}
</script>
<style lang="scss">
.el-popover {
  width: 210px !important;
}
</style>
