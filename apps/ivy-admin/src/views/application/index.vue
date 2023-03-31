<template>
  <ButtonList mb-5>
    <template #left>
      <div flex items-end>
        <div leading-8 h-8 font-600 text-size-6 mr-2>应用管理</div>
        <div color="#86909C" leading-5.5 h-5.5>创建Web、移动端应用平台</div>
      </div>
    </template>
    <template #right>
      <SearchButton>
        <el-input
          class="search-input"
          placeholder="搜索应用"
          v-model="keywords"
          @keyup.enter.native="handleSearchApp(keywords)"
          @clear="handleSearchApp(keywords)"
          clearable
          size="default"
          :prefix-icon="Search"
        ></el-input>
      </SearchButton>
      <el-button ml-4 type="primary" :icon="Plus" @click="handleAddApp">
        创建应用
      </el-button>
    </template>
  </ButtonList>
  <div class="app-list" flex flex-wrap>
    <div
      class="app-item"
      bg-white
      rounded-1
      p-4
      mb-4
      relative
      cursor-pointer
      v-for="item in 5"
      :key="item"
    >
      <el-popover
        placement="bottom"
        :width="100"
        trigger="click"
        :show-arrow="false"
      >
        <template #reference>
          <el-icon
            :size="24"
            class="absolute!"
            cursor-pointer
            top-4
            right-4
            @click.prevent=""
          >
            <SvgIcon name="more"></SvgIcon>
          </el-icon>
        </template>
        <div flex-col items-center justify-center p-3>
          <div
            w-full
            text-left
            cursor-pointer
            hover:text-primary
            mb-3
            @click="handleAppDetail(item.id || 56478, 'edit')"
          >
            编辑
          </div>
          <div
            w-full
            text-left
            cursor-pointer
            hover:text-primary
            @click="handleDelete"
          >
            删除
          </div>
        </div>
      </el-popover>
      <div @click="handleAppDetail(item.id || 56478, 'edit')">
        <div flex items-start mb-6>
          <el-icon :size="48" mr-4>
            <SvgIcon name="avatar"></SvgIcon>
          </el-icon>
          <div>
            <TextEllipsis
              class="app-title"
              truncate
              leading-6
              h-6
              font-600
              text-size-4
              mb-2
              message="充电设施在线检定监管平台"
            ></TextEllipsis>

            <p
              class="app-desc"
              color="#86909C"
              leading-5.5
              text-size-3.5
              title="主要实现充电站/桩、充电桩供应商、运营商、在线远程检定模块主要实现充电站/桩、充电桩供应商、运营商、在线远程检定模块"
            >
              主要实现充电站/桩、充电桩供应商、运营商、在线远程检定模块主要实现充电站/桩、充电桩供应商、运营商、在线远程检定模块
            </p>
          </div>
        </div>
        <div flex justify-center items-center>
          <div flex items-end mr-15>
            <span class="label-name">组织</span>
            <span class="count">3</span>
          </div>
          <div flex items-end mr-15>
            <span class="label-name">角色</span>
            <span class="count">28</span>
          </div>
          <div flex items-end>
            <span class="label-name">用户</span>
            <span class="count">7638</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="30vw"
    align-center
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      :inline="false"
      label-position="top"
    >
      <el-form-item prop="appName" label="应用名称">
        <el-input
          v-model="form.appName"
          placeholder="请输入应用名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="appUrl" label="应用地址">
        <el-input
          v-model="form.appUrl"
          placeholder="请输入应用域名地址"
          clearable
        >
          <template #prepend>
            <el-select style="width: 100px" v-model="urlType">
              <el-option label="http://" value="http://"></el-option>
              <el-option label="https://" value="https://"></el-option>
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="appDesc" label="应用简介">
        <el-input
          type="textarea"
          :rows="4"
          v-model="form.appDesc"
          placeholder="请输入简介..."
          clearable
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
  <DeleteApp
    v-model:visible="deleteDialogVisible"
    :title="deleteDialogTitle"
    :app="{
      appName: '充电设施在线检定监管平台',
      appDesc: '',
      appId: '',
      appUrl: '',
    }"
    @delete="handleDeleteApp"
  ></DeleteApp>
</template>

<script setup lang="ts">
import ButtonList from '@/components/ButtonList.vue'
import SearchButton from '@/components/SearchButton.vue'
import TextEllipsis from '@/components/TextEllipsis.vue'
import DeleteApp from './components/DeleteApp.vue'
import { Search, Plus } from '@element-plus/icons-vue'
import useDialog from '@/hooks/web/useDialog'
import useForm from '@/hooks/web/useForm'
import { handleDeleteApp } from './shared'

import { useRouter } from 'vue-router'

const router = useRouter()

const keywords = ref('')
const urlType = ref('http://')
const handleSearchApp = (_value: string) => {}

const { dialogTitle, dialogVisible } = useDialog()
const { form, rules, formRef, handleSubmitForm } = useForm(
  [
    {
      name: 'appName',
      required: true,
      message: '请输入应用名称',
    },
    {
      name: 'appUrl',
      required: true,
      message: '请输入应用域名地址',
    },
    'appDesc',
  ],
  undefined,
  {
    onSubmit: async data => {
      console.log('我是谁？？？', data)
      dialogVisible.value = false
    },
  }
)

const handleAddApp = () => {
  dialogTitle.value = '创建应用'
  dialogVisible.value = true
}

const handleAppDetail = (appId: string, type: 'detail' | 'edit') => {
  router.push({
    path: '/application/appdetail',
    query: {
      appId,
      type,
    },
  })
}

const { dialogTitle: deleteDialogTitle, dialogVisible: deleteDialogVisible } =
  useDialog()

const handleDelete = () => {
  deleteDialogVisible.value = true
  deleteDialogTitle.value = '你是否真的确定？'
}
</script>

<style scoped lang="scss">
.app-list {
  .app-item {
    .app-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .app-desc {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .label-name {
      color: #86909c;
      font-size: 12px;
      margin-right: 8px;
    }
    .count {
      color: #f77234;
      font-size: 20px;
    }
  }
}

@media screen and (min-width: 1440px) {
  .app-item {
    width: calc((100% - 32px) / 3);
    height: 170px;
    &:not(:nth-child(3n)) {
      margin-right: 16px;
    }
    &:nth-child(3n) {
      margin-right: 0px;
    }
  }
}

@media screen and (min-width: 1920px) {
  .app-item {
    width: calc((100% - 48px) / 4);
    height: 170px;
    &:not(:nth-child(4n)) {
      margin-right: 16px;
    }
    &:nth-child(4n) {
      margin-right: 0px;
    }
  }
}

@media screen and (min-width: 3840px) {
  .app-item {
    width: calc((100% - 64px) / 5);
    height: 170px;
    &:not(:nth-child(5n)) {
      margin-right: 16px;
    }
    &:nth-child(5n) {
      margin-right: 0px;
    }
  }
}
</style>
