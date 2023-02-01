<template>
  <div class="app-container box-border overflow-y-auto">
    <div class="w-full h-full flex flex-col">
      <!-- 面包屑 -->
      <LayoutBreadCrumb></LayoutBreadCrumb>
      <slot></slot>
    </div>
    <el-backtop target=".app-container"></el-backtop>
  </div>
</template>

<script lang="ts" setup>
import LayoutBreadCrumb from './LayoutBreadCrumb.vue'
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 60px);
  padding: 17px 20px 20px;
}
</style>
