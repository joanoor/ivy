<template>
  <div relative overflow-hidden class="h-screen w-screen login-container">
    <div absolute z-10 flex items-center text-white class="login-logo">
      <el-icon size="32">
        <SvgIcon name="sc_white"></SvgIcon>
      </el-icon>
      <div class="ml-3">{{ t('sys.app.projectName') }}</div>
    </div>
    <AppLocalePicker absolute z-10></AppLocalePicker>
    <!-- <div absolute z-10 pr-0 pb-0>
      <HelloWorld msg="I love the world"></HelloWorld>
    </div> -->
    <div class="flex flex-col login absolute z-10 h-screen bg-white">
      <div class="login-title">{{ timeSayHello }}，欢迎使用</div>
      <div class="login-subtitle mb-5">{{ t('sys.app.projectName') }}</div>
      <el-form
        ref="loginFormRef"
        class="loginform form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="loginName">
          <el-input
            v-model="loginForm.loginName"
            autocomplete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLoginForm(loginFormRef)"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <div class="flex justify-between w-full">
            <el-checkbox v-model="checked">自动登录</el-checkbox>
            <span>忘记密码</span>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="w-full"
            size="large"
            @click="handleLoginForm(loginFormRef)"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <video id="bg_video" class="absolute top-0 left-0" autoplay loop muted>
      <source src="/static/bg.mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
import useLogin from '@/hooks/useLogin'
import useCommon from '@/hooks/useCommon'
import { useI18n } from 'vue-i18n'
import { AppLocalePicker } from '@/components/Applicatioin'
// import { createAsyncComponent } from '@/libs/utils/factory/createAsyncComponent'

// const HelloWorld = createAsyncComponent(
//   () => import('@/components/HelloWorld.vue')
// )

const checked = ref(false)
const loading = ref(false)

const { loginFormRef, loginForm, loginFormRules, handleLoginForm } = useLogin()

const { timeSayHello } = useCommon()

// 背景视频控制
const controlVideoPlaySpeed = () => {
  const $video = document.getElementById('bg_video') as HTMLVideoElement
  $video.playbackRate = 0.66
}
onMounted(controlVideoPlaySpeed)

const { t } = useI18n()
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
