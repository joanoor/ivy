<template>
  <el-config-provider :locale="zhCn">
    <router-view  v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts"> 
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<style scoped>
#app {
  min-width: $minWidth;
}
</style>
