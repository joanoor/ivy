<template>
  <el-dialog
    v-model="dialogVisiable"
    :title="title"
    :width="width"
    @close="handleClose"
    align-center
  >
    <el-form
      :model="myForm"
      :ref="formRef"
      :rules="rules || {}"
      :label-width="labelWidth"
      :inline="inline"
      size="default"
    >
      <el-form-item
        v-for="col in formColumns"
        :key="col.name"
        :prop="col.name"
        :label="col.title"
      >
        <template v-if="col.component === 'input'">
          <el-input
            v-model="myForm[col.name]"
            :placeholder="col.message"
          ></el-input>
        </template>
        <template v-else-if="col.component === 'inputselect'"></template>
        <template v-else-if="col.component === 'select'">
          <el-select
            class="w-full"
            v-model="myForm[col.name]"
            :placeholder="col.message"
            clearable
            filterable
          >
            <el-option
              v-for="item in col.selectOption"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('submit')">
          {{ confirmWord }}
        </el-button>
        <el-button @click="dialogVisiable = false">{{ cancelWord }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ResultColumnsData } from '@/api/model/types/types'
import { FormInstance } from 'element-plus'
import { computed } from 'vue'

const emit = defineEmits(['update:visiable', 'update:form', 'submit'])

const dialogVisiable = computed({
  get: () => props.visiable,
  set: value => {
    emit('update:visiable', value)
  },
})

const props = withDefaults(
  defineProps<{
    visiable: boolean
    title: string
    form: Recordable
    formColumns: ResultColumnsData[]
    rules?: Recordable
    formRef: FormInstance
    confirmWord?: string
    cancelWord?: string
    inline?: boolean
    width?: string
    labelWidth?: string
  }>(),
  {
    confirmWord: '创建',
    cancelWord: '取消',
    inline: false,
    width: '45%',
    labelWidth: '80px',
  }
)

const myForm = computed({
  get: () => props.form,
  set: value => {
    emit('update:form', value)
  },
})

// 关闭弹框
const handleClose = () => {
  emit('update:visiable', false)
}
</script>
