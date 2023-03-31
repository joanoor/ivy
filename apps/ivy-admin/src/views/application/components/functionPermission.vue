<template>
  <ToggleButton
    text-size-4
    absolute
    top-21
    right-5
    :button-list="buttonList"
    v-model:active="activeMode"
    @toggle="handleToggleMode"
  ></ToggleButton>
  <el-button absolute right-5 top-9 type="primary" :icon="Plus">
    添加角色/用户
  </el-button>
  <div v-show="activeMode === 0"></div>
  <div v-show="activeMode === 1" flex>
    <TreeBox title="菜单列表" width="304px" mr-5>
      <el-input
        :suffix-icon="Search"
        placeholder="搜索"
        v-model="treeKeywords"
        clearable
      ></el-input>
      <el-tree
        mt-3
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        :indent="4"
        :filter-node-method="onFilterTreeNode"
        @node-click="handleNodeClick"
      />
    </TreeBox>
    <div class="tablemode-right" flex-1>
      <SearchContainer nobutton mode="horizontal">
        <el-form :model="authorizedSearchForm" flex flex-wrap>
          <el-form-item label="授权类型" mr-15>
            <el-select
              class="w-full!"
              v-model="authorizedSearchForm.authorizedStatus"
              clearable
              placeholder="请选择"
            ></el-select>
          </el-form-item>
          <el-form-item label="授权对象名称" mr-15>
            <el-input
              v-model="authorizedSearchForm.roleName"
              clearable
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="授权对象ID">
            <el-input
              clearable
              v-model="authorizedSearchForm.roleId"
              placeholder="请输入ID"
            ></el-input>
          </el-form-item>
        </el-form>
      </SearchContainer>
      <el-table>
        <el-table-column label="序号"></el-table-column>
        <el-table-column label="授权对象名称"></el-table-column>
        <el-table-column label="所属组织名称"></el-table-column>
        <el-table-column label="授权类型"></el-table-column>
        <el-table-column label="用户数量"></el-table-column>
        <el-table-column label="授权访问"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Plus } from '@element-plus/icons-vue'
import ToggleButton from '@/components/ToggleButton.vue'
import useForm from '@/hooks/web/useForm'
import useTree from '@/hooks/web/useTree'
import TreeBox from './TreeBox.vue'
import SearchContainer from '@/components/SearchContainer.vue'

// 功能权限
const activeMode = ref(0)

const buttonList = [
  {
    icon: 'overview',
    label: '总览模式',
  },
  {
    icon: 'table',
    label: '列表模式',
  },
]

const { form: authorizedSearchForm } = useForm([
  'roleName',
  'roleId',
  'authorizedStatus',
])

const handleToggleMode = () => {}

const data = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
const {
  treeData,
  treeKeywords,
  treeRef,
  treeProps,
  handleNodeClick,
  onFilterTreeNode,
} = useTree(data, {
  onFilterNodeMethod: (value, data) => {
    return data.label.includes(value)
  },
})
</script>

<style scoped></style>
