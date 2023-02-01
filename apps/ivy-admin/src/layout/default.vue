<template>
  <div class="app-sc overflow-hidden">
    <!-- Header -->
    <LayoutHeader :title="projectName"></LayoutHeader>

    <div class="flex">
      <!-- 左侧菜单 -->
      <LayoutSideBar></LayoutSideBar>

      <!-- 主体内容 -->
      <LayoutContainer class="flex-1 relative">
        <router-view v-slot="{ Component }">
          <!-- <transition name="fade-transform" mode="out-in"> -->
          <component :is="Component" />
          <!-- </transition> -->
        </router-view>
      </LayoutContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutSideBar from './components/LayoutSideBar/index.vue'

import LayoutContainer from './components/LayoutContainer.vue'
const cachedViews = ref('')

const projectName = computed(() => `${window.config.projectName}`)
</script>

<style lang="scss" scoped>
.app-sc {
  background-color: #f7f8fa;
}
</style>
