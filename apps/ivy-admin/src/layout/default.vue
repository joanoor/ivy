<template>
  <div class="app-sc" overflow-hidden>
    <LayoutHeader :title="projectName"></LayoutHeader>

    <div class="flex" overflow-hidden>
      <!-- 左侧菜单 -->
      <LayoutSideBar></LayoutSideBar>

      <!-- 主体内容 -->
      <LayoutContainer flex-1 relative>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </LayoutContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutSideBar from './components/LayoutSideBar/index.vue'

import LayoutContainer from './components/LayoutContainer.vue'

const projectName = computed(() => `${window.config.projectName}`)
</script>

<style lang="scss" scoped>
.app-sc {
  min-width: 1360px;
  background-color: #f7f8fa;
}
</style>
