<template>
  <div class="app-breadcrumb">
    <el-breadcrumb class="app-el-breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }" @click="handleClick">
        <el-icon
          class="i-ant-design-home-outlined"
          style="font-size: 14px"
        ></el-icon>
      </el-breadcrumb-item>
      <!-- <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
      <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.menuId">
        {{ item.menuName }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { usePathStore } from '@/store'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const usePath = usePathStore()

const { breadcrumbList } = storeToRefs(usePath)
watch(breadcrumbList, () => {}, { immediate: true })

const router = useRouter()

const handleClick = () => {
  console.log('点击我了！！！')
}
</script>

<style lang="scss" scoped>
.app-el-breadcrumb {
  margin-bottom: 17px;
}
</style>
