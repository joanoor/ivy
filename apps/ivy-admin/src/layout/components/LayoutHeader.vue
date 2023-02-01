<template>
  <div class="app-header flex items-center justify-between p-4">
    <div class="flex items-center">
      <img src="/sc.svg" alt="" class="banner mr-2" />
      <span class="ml-2 sc-project-title">{{ title }}</span>
    </div>
    <div class="flex items-center">
      <div class="flex items-center">
        <span class="qjsx mr-1 w-24">全局筛选</span>
        <el-popover
          placement="top-start"
          trigger="hover"
          content="全局筛选所需模块"
        >
          <template #reference>
            <el-icon class="mr-4" :size="14" color="#c9cdd4">
              <IAntDesignQuestionCircleOutlined />
            </el-icon>
          </template>
        </el-popover>
        <el-input
          v-model="input2"
          class="mr-4"
          placeholder="全部"
          :suffix-icon="Search"
        />
      </div>
      <div class="flex items-center">
        <el-dropdown
          trigger="click"
          popper-class="caution"
          :hide-on-click="false"
          placement="bottom-end"
        >
          <IconCircle class="mr-4">
            <el-icon :size="12">
              <el-badge is-dot :hidden="false">
                <IEpBell />
              </el-badge>
            </el-icon>
          </IconCircle>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <NoticeInfo></NoticeInfo>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <IconCircle class="mr-4">
          <el-icon :size="12">
            <IEpSetting />
          </el-icon>
        </IconCircle>
        <el-dropdown trigger="click" @command="handleCommand">
          <SvgIcon name="avatar" size="32" className="cursor-pointer"></SvgIcon>
          <!-- <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon> -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <IconCircle class="ml-4">
          <IAntDesignMessageFilled></IAntDesignMessageFilled>
        </IconCircle> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconCircle from './IconCircle.vue'
import NoticeInfo from './NoticeInfo.vue'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store2 from 'store2'

const router = useRouter()

defineProps({
  title: {
    type: String,
    required: true,
  },
})

const input2 = ref('')

const handleCommand = (e: string | number | object) => {
  console.log('点击了 ', e)
  switch (e) {
    case 'exit':
      store2.clearAll()
      router.push('/login')
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
