<template>
  <p mt-8>限制重复登录</p>
  <el-radio-group
    v-model="accessForm.restrictRepeatLogin"
    @change="handleRadioClick"
    :disabled="$route.query.type === 'detail'"
  >
    <el-radio
      v-for="(item, index) in radioList"
      :key="index"
      :label="item.label"
      :disabled="item.disabled"
    >
      {{ item.name }}
    </el-radio>
  </el-radio-group>

  <div mt-8 mb-5 flex justify-between items-center>
    <div flex>
      <div mr-10>
        <div flex items-center mb-2>
          <p mr-1>访问授权</p>
          <el-icon :size="12">
            <SvgIcon name="question"></SvgIcon>
          </el-icon>
        </div>
        <el-select
          v-model="authorizedType"
          :disabled="$route.query.type === 'detail'"
        >
          <el-option value="0" label="所有授权类型"></el-option>
          <el-option value="1" label="用户"></el-option>
          <el-option value="2" label="角色"></el-option>
          <el-option value="3" label="岗位"></el-option>
          <el-option value="4" label="用户组"></el-option>
          <el-option value="5" label="组织"></el-option>
        </el-select>
      </div>
      <div>
        <p mb-1>禁止全体用户登录</p>

        <el-switch
          class="authorization-switch"
          :before-change="handleBeforeSwitch"
          active-text="已启用"
          inactive-text="已关闭"
          inline-prompt
          v-model="allowedAll"
          :disabled="$route.query.type === 'detail'"
        />
      </div>
    </div>
    <el-button
      type="primary"
      link
      :disabled="$route.query.type === 'detail'"
      :icon="Plus"
      @click="addAuthorization"
    >
      添加授权主体
    </el-button>
  </div>

  <el-dialog
    align-center
    width="27%"
    v-model="dialogVisible"
    :title="dialogTitle"
  >
    <el-form
      :model="mainForm"
      ref="mainFormRef"
      :rules="mainRules"
      label-position="top"
    >
      <el-form-item prop="authorizationType" label="授权类型">
        <el-radio-group v-model="mainForm.authorizationType">
          <el-radio label="0">组织</el-radio>
          <el-radio label="1">用户组</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="authorizationOrg" label="授权组织">
        <el-select
          class="w-full!"
          v-model="mainForm.authorizationOrg"
          clearable
          placeholder="请选择组织"
        ></el-select>
      </el-form-item>
      <el-form-item prop="authorizationAccess" label="授权访问">
        <el-radio-group v-model="mainForm.authorizationAccess">
          <el-radio label="0">允许访问</el-radio>
          <el-radio label="1">拒绝访问</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitMainForm">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    align-center
    width="27%"
    v-model="subDialogVisible"
    :title="subDialogTitle"
  >
    <el-form
      :model="subForm"
      ref="subFormRef"
      :rules="subRules"
      label-position="top"
    >
      <el-form-item prop="authorizationType" label="授权类型">
        <el-checkbox-group @change="handleChangeCheckBox" v-model="checkedList">
          <el-checkbox
            v-for="(item, index) in checkboxList"
            :key="index"
            :label="item.label"
            :disabled="item.disabled"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-if="checkedList.includes('0')"
        prop="authorizationUser"
        label="授权用户"
      >
        <el-select
          class="w-full!"
          v-model="subForm.authorizationUser"
          clearable
          placeholder="请选择授权用户"
        ></el-select>
      </el-form-item>
      <el-form-item
        v-if="checkedList.includes('1')"
        prop="authorizationRole"
        label="授权角色"
      >
        <el-select
          class="w-full!"
          v-model="subForm.authorizationRole"
          clearable
          placeholder="请选择授权用户"
        ></el-select>
      </el-form-item>
      <el-form-item
        v-if="checkedList.includes('2')"
        prop="authorizationPost"
        label="授权岗位"
      >
        <el-select
          class="w-full!"
          v-model="subForm.authorizationPost"
          clearable
          placeholder="请选择授权岗位"
        ></el-select>
      </el-form-item>
      <el-form-item
        v-if="checkedList.includes('3')"
        prop="authorizationDep"
        label="授权部门"
      >
        <el-select
          class="w-full!"
          v-model="subForm.authorizationDep"
          clearable
          placeholder="请选择授权部门"
        ></el-select>
      </el-form-item>
      <el-form-item prop="authorizationAccess" label="授权访问">
        <el-radio-group v-model="subForm.authorizationAccess">
          <el-radio label="0">允许访问</el-radio>
          <el-radio label="1">拒绝访问</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="subDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitSubForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useDialog from '@/hooks/web/useDialog'
import useForm from '@/hooks/web/useForm'
import useCheckBoxGroup from '@/hooks/web/useCheckBoxGroup'
import useRadioGroup from '@/hooks/web/useRadioGroup'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const allowedAll = ref(false)

const handleBeforeSwitch = () => {
  if (!allowedAll.value) {
    return ElMessageBox({
      message: `
      <div flex items-center> 
        <el-icon :size="20">
          <SvgIcon name="exclamation"></SvgIcon>
        </el-icon>
        <span>开启后全体用户将无法登录，确定要开启吗？</span>
      </div>
      `,
      dangerouslyUseHTMLString: true,
      type: 'warning',
      showClose: false,
      showCancelButton: true,
      customClass: 'authorization-messagebox',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(action => {
        console.log('action', action)
        if (action === 'confirm') {
          return true
        } else {
          return false
        }
      })
      .catch(() => {
        return false
      })
  } else {
    return true
  }
}

const { radioList, handleRadioClick } = useRadioGroup(
  [
    {
      label: '0',
      name: '限制',
    },
    {
      label: '1',
      name: '不限制',
    },
  ],
  value => console.log(value)
)

// 访问授权
const { form: accessForm } = useForm([
  {
    name: 'restrictRepeatLogin',
    default: '0',
  },
])

const authorizedType = ref('0')

const { dialogTitle, dialogVisible } = useDialog(undefined, () => {
  handleResetMainForm()
})

const addAuthorization = () => {
  dialogTitle.value = '添加授权'
  dialogVisible.value = true
}
const {
  form: mainForm,
  rules: mainRules,
  formRef: mainFormRef,
  handleResetForm: handleResetMainForm,
  handleSubmitForm: handleSubmitMainForm,
} = useForm(
  [
    {
      name: 'authorizationType',
      required: true,
      message: '请选择授权类型',
      default: '0',
    },
    {
      name: 'authorizationOrg',
      required: true,
      message: '请选择授权组织',
    },
    {
      name: 'authorizationAccess',
      required: true,
      message: '请选择授权访问',
      default: '0',
    },
  ],
  undefined,
  {
    onSubmit: data => {
      console.log('@@@@@', data)
    },
  }
)

const { dialogTitle: subDialogTitle, dialogVisible: subDialogVisible } =
  useDialog(undefined, () => {
    handleResetSubForm()
  })
const {
  form: subForm,
  rules: subRules,
  formRef: subFormRef,
  handleResetForm: handleResetSubForm,
  handleSubmitForm: handleSubmitSubForm,
} = useForm(
  [
    {
      name: 'authorizationType',
      required: true,
      message: '请选择授权类型',
      default: [],
    },
    {
      name: 'authorizationUser',
      required: true,
      message: '请选择授权用户',
    },
    {
      name: 'authorizationRole',
      required: true,
      message: '请选择授权角色',
    },
    {
      name: 'authorizationPost',
      required: true,
      message: '请选择授权岗位',
    },
    {
      name: 'authorizationDep',
      required: true,
      message: '请选择授权部门',
    },
    {
      name: 'authorizationAccess',
      required: true,
      default: '0',
    },
  ],
  undefined,
  {
    onSubmit: data => {
      console.log('~~~~~', data)
    },
  }
)

const { checkboxList, checkedList, handleChangeCheckBox } = useCheckBoxGroup(
  [
    {
      name: '用户',
      label: '0',
    },
    {
      name: '角色',
      label: '1',
    },
    {
      name: '岗位',
      label: '2',
    },
    {
      name: '部门',
      label: '3',
    },
  ],
  value => {
    console.log('我选择的是', value)
    subForm.value.authorizationType = value
  }
)
</script>

<style lang="scss">
.authorization-switch {
  .el-switch__core {
    height: 25px !important;
    border-radius: 100px !important;
  }
}
</style>
