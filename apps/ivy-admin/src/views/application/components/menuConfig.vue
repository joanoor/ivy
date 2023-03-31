<template>
  <el-button
    absolute
    right-5
    top-9
    type="primary"
    :icon="Plus"
    @click="hanleMenuInfo"
  >
    新增菜单
  </el-button>
  <SearchContainer nobutton mode="horizontal">
    <el-form :model="menuSearchForm" flex flex-wrap>
      <el-form-item label="菜单名称" mr-15>
        <el-input
          v-model="menuSearchForm.menuName"
          clearable
          placeholder="请输入名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" mr-15>
        <el-select
          v-model="menuSearchForm.menuType"
          class="w-full!"
          placeholder="请选择"
          clearable
        ></el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          class="w-full!"
          v-model="menuSearchForm.menuStatus"
          placeholder="请选择"
          clearable
        ></el-select>
      </el-form-item>
    </el-form>
  </SearchContainer>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    align-center
    width="40%"
  >
    <el-form
      :model="menuForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="type" label="类型">
            <el-radio-group v-model="menuForm.type">
              <el-radio label="0">菜单</el-radio>
              <el-radio label="1">组件</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="状态">
            <el-radio-group v-model="menuForm.status">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="menuName" label="菜单名称">
            <el-input
              v-model="menuForm.menuName"
              placeholder="请输入名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="parentMenu" label="上级菜单">
            <el-tree-select
              class="w-full!"
              v-model="menuForm.parentMenu"
              filterable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="menuURL" label="菜单URL">
            <el-input
              v-model="menuForm.menuURL"
              placeholder="请输入菜单URL"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="authorizatedCode" label="授权编码">
            <el-input
              v-model="menuForm.authorizatedCode"
              placeholder="授权编码"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item prop="order" label="排序">
            <el-input
              v-model="menuForm.order"
              placeholder="请输入"
              clearable
              @input="menuForm.order = menuForm.order.replace(/[^\d]/g, '')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="info" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import useDialog from '@/hooks/web/useDialog'
import SearchContainer from '@/components/SearchContainer.vue'
import { Plus } from '@element-plus/icons-vue'

// 菜单配置
const { form: menuSearchForm } = useForm(['menuName', 'menuType', 'menuStatus'])

// 新增或修改菜单
const { dialogTitle, dialogVisible } = useDialog(undefined, () => {
  handleResetForm()
})
const {
  form: menuForm,
  formRef,
  rules,
  handleResetForm,
  handleSubmitForm,
} = useForm(
  [
    { name: 'type', required: true, default: '0', message: '请选择类型' },
    { name: 'parentMenu', required: true, message: '请选择上级菜单' },
    { name: 'authorizatedCode', required: true, message: '请输入授权编码' },
    { name: 'status', required: true, default: '0', message: '请选择状态' },
    { name: 'menuName', required: true, message: '请输入菜单名称' },
    { name: 'menuURL', required: true, message: '请输入菜单URL' },
    'order',
    'id',
  ],
  undefined,
  {
    expectOmitedColumnNames: ['id'],
    onSubmit: data => {
      console.log('菜单', data)
    },
  }
)

const hanleMenuInfo = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增菜单'
}
</script>

<style scoped></style>
