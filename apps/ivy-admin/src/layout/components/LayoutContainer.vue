<template>
  <div box-border overflow-hidden overflow-y-auto class="app-container">
    <!-- 面包屑 -->
    <LayoutBreadCrumb mb-4></LayoutBreadCrumb>
    <slot></slot>
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
