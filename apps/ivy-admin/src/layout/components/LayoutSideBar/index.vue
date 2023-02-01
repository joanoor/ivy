<template>
  <div class="app-sidebar flex flex-col justify-between">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo overflow-y-auto"
      :collapse="isCollapse"
      @select="handleSelectMenu"
      ref="menuRef"
    >
      <template v-for="menu in menuList">
        <template v-if="menu.children.length > 0">
          <el-sub-menu :key="menu.menuId" :index="menu.menuId">
            <template #title>
              <el-icon class="mr-3">
                <SvgIcon :name="menu.icon" size="16"></SvgIcon>
              </el-icon>
              <span>{{ menu.menuName }}</span>
            </template>
            <el-menu-item
              v-for="cmenu in menu.children"
              :index="'/' + cmenu.menuId"
              class="ml-2"
            >
              {{ cmenu.menuName }}
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="menu.menuId">
            <el-icon class="mr-3">
              <SvgIcon :name="menu.icon" size="16"></SvgIcon>
            </el-icon>
            <template #title>
              <span>{{ menu.menuName }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="fold mb-4 mt-4 text-right pr-4">
      <el-icon
        class="cursor-pointer"
        style="backgroundcolor: #f7f8fa"
        @click="toggleCollapse"
      >
        <IEpFold v-if="!isCollapse" />
        <IEpExpand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onBeforeMount,
  onMounted,
  watchEffect,
  watch,
} from 'vue'
import { ElMenu } from 'element-plus'
import { useRouter } from 'vue-router'
import { menuList } from './menuList'
import { usePathStore } from '@/store'

let activeIndex = ref('user_overview')

const menuRef = ref<typeof ElMenu>()

const router = useRouter()

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log('ttttttttttt', key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log('aaaaaaaaaaa', key, keyPath)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

watchEffect(() => {
  console.log(``)
})

const usePath = usePathStore()

const handleSelectMenu = (index: string, indexPath: string[]) => {
  console.log(`1===>`, index, '2===>', indexPath)
  router.push('/' + indexPath.join(''))
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.app-sidebar {
  height: calc(100vh - 60px);
  // width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e6eb;

  .mr-4 {
    margin-right: 14px !important;
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
</style>
