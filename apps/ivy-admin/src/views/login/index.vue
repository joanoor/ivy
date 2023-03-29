<template>
  <div h-screen w-screen relative overflow-hidden class="login-container">
    <SvgIcon name="bg" absolute class="w-full! h-full!"></SvgIcon>
    <div absolute z-10 flex items-center text-white class="login-logo">
      <el-icon :size="32">
        <SvgIcon name="sc"></SvgIcon>
      </el-icon>
      <div ml-3>{{ projectName }}</div>
    </div>
    <div flex flex-col absolute z-10 h-screen bg-white class="login">
      <div class="login-title">{{ timeSayHello }}，欢迎使用</div>
      <div mb-5 class="login-subtitle">{{ projectName }}</div>
      <el-form
        ref="loginFormRef"
        class="loginform searchForm"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            autocomplete="off"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <SvgIcon name="usericon" :size="14"></SvgIcon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :type="isShow ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <template #prefix>
              <SvgIcon name="lockicon" :size="14"></SvgIcon>
            </template>
            <template #suffix>
              <SvgIcon
                :name="isShow ? 'closeeye' : 'openeye'"
                size="16"
                @click="isShow = !isShow"
              ></SvgIcon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div flex justify-between w-full>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <!-- <el-checkbox v-model="checked">自动登录</el-checkbox> -->
            <span class="cursor-pointer">忘记密码</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            w-full
            size="large"
            @click="handleLoginForm(loginFormRef)"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div fixed bottom-4 text-white left-0 right-0 text-center text-sm>
      {{
        `© 安徽南瑞中天电力电子有限公司（ANHUI NARI ZENITH ELECTRICITY & ELECTRONIC CO.,LTD.）` +
        `   ${projectYear}`
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import { useUserStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { _console } from '@ivy/core'
import { formChecker } from '@ivy/form'
import { submitForm } from '@/utils/formAndRules/form'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const checked = ref(true)
const loading = ref(false)
const isShow = ref(false)

const {
  form: loginForm,
  rules: loginFormRules,
  formRef: loginFormRef,
} = useForm([
  {
    name: 'username',
    required: true,
    message: '请输入用户名',
  },
  {
    name: 'password',
    required: true,
    message: '请输入密码',
    validator: formChecker.easyPasswordChecker(),
  },
  {
    name: 'captcha',
    required: true,
    message: '请输入验证码',
  },
  'appId',
  'redirectUrl',
  'token',
])

const handleLoginForm = submitForm(async (valid?: boolean) => {
  if (valid) {
    const res = await userStore.loginByUser({
      ...loginForm.value,
      redirectUrl: `${route.query['redirectURL'] ?? ''}${location.hash ?? ''}`,
    })
    if (res) router.push('/')
    else {
      _console.error('登录失败！')
    }
  }
})

// 问候语设置
const timeSayHello = computed(() => {
  let date = new Date().getHours()
  let hoursTip = ''
  if (date >= 0 && date < 12) {
    hoursTip = '上午好'
  } else if (date >= 12 && date < 18) {
    hoursTip = '下午好'
  } else {
    hoursTip = '晚上好'
  }
  return hoursTip
})

// 项目页面名称
const projectName = computed(() => `${window.config.projectName}`)
const projectYear = computed(() => `${window.dayjs().format('YYYY')}`)
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
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      line-height: 28px;
    }
  }

  .login {
    width: 440px;
    height: 388px;
    right: 7%;
    top: 27%;
    border-radius: 4px;
    padding: 60px 40px;
  }

  .login-title,
  .login-subtitle {
    font-size: 24px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 600;
    color: #1d2129;
    line-height: 32px;
    height: 32px;
  }

  .loginform {
    span {
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #165dff;
    }
  }
}
</style>
