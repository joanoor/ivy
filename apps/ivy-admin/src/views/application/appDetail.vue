<template>
  <div bg-white h-full p-5 pb-14 relative>
    <ButtonList mb-5>
      <template #left>
        <div flex items-end>
          <div leading-8 h-8 font-600 text-size-6 mr-2>
            充电设施在线检定监管平台
          </div>
          <div color="#86909C" leading-5.5 h-5.5>
            {{
              activeTabName === '0'
                ? '配置基础信息'
                : activeTabName === '1'
                ? '控制谁可以访问本应用'
                : activeTabName === '2'
                ? '全局配置整个系统的菜单及其可见性，为功能权限打下基础'
                : activeTabName === '3'
                ? '配置功能权限，默认子级继承父级菜单权限'
                : '为不同角色配置数据权限，默认选择全部数据'
            }}
          </div>
        </div>
      </template>
    </ButtonList>
    <el-tabs v-model="activeTabName" mb-5>
      <el-tab-pane
        v-for="item in tabList"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>
    <div v-show="activeTabName === '0'">
      <AppConfig></AppConfig>
    </div>
    <div v-show="activeTabName === '1'">
      <AccessAuthorization></AccessAuthorization>
    </div>
    <div v-show="activeTabName === '2'">
      <MenuConfig></MenuConfig>
    </div>
    <div v-show="activeTabName === '3'">
      <FunctionPermission></FunctionPermission>
    </div>
    <div v-show="activeTabName === '4'">
      <DataPermission></DataPermission>
    </div>
  </div>
  <!-- <div
    absolute
    bottom-0
    left-0
    h-14
    bg-white
    w-full
    flex
    justify-between
    items-center
    pl-10
    pr-10
    style="box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1)"
  >
    <div>{{}}</div>
    <div>
      <el-button @click="handleCancelAppDetail" type="info">取消</el-button>
      <el-button type="primary" @click="handleSaveOrEdit">
        {{ $route.query.type === 'detail' ? '编辑' : '保存' }}
      </el-button>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import ButtonList from '@/components/ButtonList.vue'

import useTab from '@/hooks/web/useTabs'
import { useRouter, useRoute } from 'vue-router'
import AppConfig from './components/appConfig.vue'
import AccessAuthorization from './components/accessAuthorization.vue'
import MenuConfig from './components/menuConfig.vue'
import FunctionPermission from './components/functionPermission.vue'
import DataPermission from './components/dataPermission.vue'

const router = useRouter()
const route = useRoute()

const { activeTabName, tabList } = useTab(
  [
    {
      name: '0',
      label: '应用配置',
    },
    {
      name: '1',
      label: '访问授权',
    },
    {
      name: '2',
      label: '菜单配置',
    },
    {
      name: '3',
      label: '功能权限',
    },
    {
      name: '4',
      label: '数据权限',
    },
  ],
  activeName => {
    console.log('切换了', activeName)
  }
)

const handleCancelAppDetail = () => {
  router.push('/application')
}

const handleSaveOrEdit = () => {
  router.replace({
    query: {
      ...route.query,
      type: route.query.type === 'detail' ? 'edit' : 'detail',
    },
  })
}
</script>

<style scoped lang="scss">
.tablemode-left {
  width: 304px;
  border: solid 1px #e5e6eb;
}
</style>
