<template>
  <el-form :model="form" ref="formRef" :rules="rules" mb-1 label-position="top">
    <el-row :gutter="80">
      <el-col :span="12">
        <el-form-item prop="appName" label="应用名称">
          <el-input
            v-model="form.appName"
            placeholder="请输入应用名称"
            clearable
            :disabled="$route.query.type === 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item prop="appUrl" label="应用地址">
          <el-input
            v-model="form.appUrl"
            placeholder="请输入应用域名地址"
            clearable
            :disabled="$route.query.type === 'detail'"
          >
            <template #prepend>
              <el-select style="width: 100px" v-model="appUrlType">
                <el-option label="http://" value="http://"></el-option>
                <el-option label="https://" value="https://"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="appId" label="App Id">
          <el-input
            disabled
            v-model="form.appId"
            placeholder="请输入App Id"
            clearable
          >
            <template #append>
              <el-button
                :icon="CopyDocument"
                @click="copy(form.appId)"
              ></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="appDesc" label="应用简介">
          <el-input
            :disabled="$route.query.type === 'detail'"
            type="textarea"
            :rows="4"
            v-model="form.appDesc"
            placeholder="请输入简介..."
            clearable
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="appDesc" label="应用LOGO">
          <el-upload
            :limit="limit"
            ref="uploadRef"
            :class="myUploadClass"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-icon :size="16"><Camera /></el-icon>
            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemovePic(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div>
    <el-button type="info">重置</el-button>
    <el-button type="primary" @click="handleSubmitForm">
      {{ $route.query.type === 'detail' ? '编辑' : '保存' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import useForm from '@/hooks/web/useForm'
import { CopyDocument, Camera, Delete } from '@element-plus/icons-vue'
import useCopy from '@/hooks/web/useCopy'
import useUpload from '@/hooks/web/useUpload'
import { pattern } from '@ivy/core'

const { copy } = useCopy()

// 应用配置
const appUrlType = ref('http://')

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
      rule: [
        {
          required: true,
          trigger: 'blur',
          validator: (_rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入应用域名地址'))
            } else if (!pattern.testIpDomain(value)) {
              callback(new Error('请输入正确的域名地址'))
            } else {
              callback()
            }
          },
        },
      ],
    },
    'appId',
    'appDesc',
    'appPic',
  ],
  undefined,
  {
    onSubmit: data => {
      console.log('生成的data', data)
    },
  }
)

const handleRemovePic = file => {
  uploadRef.value?.handleRemove(file)
}

const { myUploadClass, limit, uploadRef, handleRemove, handleChange } =
  useUpload()
</script>

<style scoped></style>
