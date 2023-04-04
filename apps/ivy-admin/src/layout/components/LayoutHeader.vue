<template>
  <div flex items-center justify-between p-4 class="app-header">
    <div flex items-center>
      <img src="/sc.svg" mr-2 class="banner" />
      <span ml-2 class="sc-project-title">{{ title }}</span>
    </div>
    <el-dropdown trigger="click" @command="handleCommand">
      <el-icon size="32" cursor-pointer>
        <SvgIcon name="avatar"></SvgIcon>
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { noop } from '@ivy/core'

defineProps({
  title: {
    type: String,
    required: true,
  },
})

const handleCommand = (e: string | number | object) => {
  switch (e) {
    case 'exit':
      noop()
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e5e6eb;

  .holder-img {
    width: 30px;
    height: 30px;
    border: solid 1px;
  }

  .sc-project-title {
    font-size: 20px;
    font-weight: 600;
    text-align: LEFT;
    color: #1d2129;
    line-height: 28px;
  }

  .qjsx {
    // width: 100px;
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: #4e5969;
    line-height: 22px;
  }
}
</style>
