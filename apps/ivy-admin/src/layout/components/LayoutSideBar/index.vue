<template>
  <div flex flex-col justify-between class="app-sidebar">
    <el-menu
      :default-active="activeIndex"
      overflow-y-auto
      class="el-menu-vertical"
      :collapse="isCollapse"
      :default-openeds="openedIndexs"
      @select="handleSelectMenu"
    >
      <template v-for="menu in menuList">
        <template v-if="menu.children.length > 0">
          <el-sub-menu :key="menu.menuId" :index="'/' + menu.menuId">
            <template #title>
              <el-icon mr-3>
                <SvgIcon :name="menu.icon" size="16"></SvgIcon>
              </el-icon>
              <span>{{ menu.menuName }}</span>
            </template>
            <el-menu-item
              v-for="cmenu in menu.children"
              :index="'/' + cmenu.menuId"
              ml-2
            >
              {{ cmenu.menuName }}
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="'/' + menu.menuId">
            <el-icon mr-3>
              <SvgIcon :name="menu.icon" size="16"></SvgIcon>
            </el-icon>
            <template #title>
              <span>{{ menu.menuName }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div mb-4 mt-4 text-right pr-4 class="fold">
      <el-icon
        cursor-pointer
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
import { ElMenu } from 'element-plus'
import { menuList } from './menuList'

const router = useRouter()
const route = useRoute()

const activeIndex = ref('overview')
const openedIndexs = ref<string[]>([])

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleSelectMenu = (index: string, indexPath: string[]) => {
  router.push(indexPath.join(''))
}

watchEffect(() => {
  if (route.matched && route.matched.length > 0) {
    const paths = route.path.split('/')
    activeIndex.value = '/' + paths[paths.length - 1]
    paths.length > 2 && (openedIndexs.value = ['/' + paths[1]])
  }
})
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

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
</style>
