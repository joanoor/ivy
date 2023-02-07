<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <transition
        name="custom-classes"
        enter-active-class="animate__animated animate__tada"
        leave-active-class="animate__animated animate__bounceOutRight"
      >
        <div class="">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </el-config-provider>
  <el-dialog
    title="提示"
    v-model="dialogShow"
    align-center
    append-to-body
    width="30%"
  >
    <span></span>
    <template #footer>
      <span>
        <el-button @click="dialogShow = false">Cancel</el-button>
        <el-button type="primary" @click="">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { _console, getBrowserInfo } from '@ivy/core'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

/**
 * 判断是否是支持的浏览器
 */
const dialogShow = ref(false)
const browserInfo = getBrowserInfo()
if (browserInfo) {
  const realBrowserInfo = Array.isArray(browserInfo)
    ? browserInfo[0]
    : browserInfo
  if (['IE/7', 'IE/8', 'IE/9', 'IE/10'].includes(realBrowserInfo)) {
    dialogShow.value = true
    _console.error(`当前浏览器：${realBrowserInfo}`)
  }
}
</script>

<style scoped>
#app {
  min-width: $minWidth;
}

.lefti {
  width: 100px;
  height: 100px;
  background-color: red;
}

.group.reorder {
  flex-direction: row;
}

h1 {
  color: white;
  font-weight: 400;
}

.group {
  width: 740px;
  height: auto;
  padding: 4px;
  background: #111;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: black;
  position: relative;
}

.box {
  margin: 4px;
  padding: 8px;
  font-size: 22px;
  line-height: 28px;
}

.box:nth-child(1) {
  background: rgba(85, 102, 205, 0.7);
}

.box:nth-child(2) {
  background: rgba(125, 70, 200, 0.7);
}

.box:nth-child(3) {
  background: rgba(33, 150, 243, 0.7);
}

.box:nth-child(4) {
  background: rgba(0, 188, 212, 0.7);
}

.button {
  padding: 10px 20px;
  margin-bottom: 10px;
}
</style>
