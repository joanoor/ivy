<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <el-icon size="50">
    <i i-ant-design-apple-outlined text-green-300 />
  </el-icon>
  <el-icon size="16">
    <SvgIcon name="arrow_down" style="color: red"></SvgIcon>
  </el-icon>
  <el-icon size="16">
    <i-ant-design-alipay-circle-filled style="color: lightgreen" />
  </el-icon>
  <el-icon size="80">
    <i-carbon-3d-software style="color: green" />
  </el-icon>
  <!-- <i i-ant></i> -->
  <el-icon size="50">
    <i-iemp-avatar></i-iemp-avatar>
  </el-icon>
  <el-icon size="16">
    <SvgIcon name="carbon_esmission_monitor"></SvgIcon>
  </el-icon>
  <el-icon size="16">
    <i-ep-edit style="color: fuchsia" />
  </el-icon>
  <!-- <i i-ant></i> -->
</template>
