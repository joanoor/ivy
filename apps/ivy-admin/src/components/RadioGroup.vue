<template>
  <div class="flex items-center">
    <transition>
      <el-date-picker
        v-if="activeTab === '自定义'"
        class="mr-5"
        v-model="time"
        type="year"
        size="default"
        placeholder="选择日期时间"
      ></el-date-picker>
    </transition>

    <el-radio-group class="mimesis" v-model="data.localActiveTab" @change="handleChange">
      <el-radio-button
        v-for="item in data"
        :key="item"
        class="splitline"
        :class="'line' + name"
        :label="item"
      >
        {{ item }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref,reactive,watch } from 'vue'
const time = ref('')
const data = reactive({
  time: '',
  localActiveTab:''
})

const props = withDefaults(
  defineProps<{
    data: string[]
    activeTab: string
    name?: string
  }>(),
  {
    name: '',
  }
)

watch(()=>props.activeTab,(newValue) => {
  data.localActiveTab=newValue
})

const emit = defineEmits<{
  (e: 'innerText', value: string): void
}>()

/**
 * 点击之后样式的变化
 */
let $allEl: NodeListOf<Element> | null = null
onMounted(() => {
  $allEl = document.querySelectorAll(`.el-radio-button.line${props.name}`)
})
const handleChange = (e: string) => {
  console.log('点击了', e)
  emit('innerText', e)

  // 下方代码用于设置分割线
  const $activeEl = document.querySelector(
    `.el-radio-button.line${props.name}.is-active`
  )
  if ($allEl) {
    if ($activeEl) {
      const $prev = $activeEl.previousElementSibling
      for (let i = 0; i < $allEl.length; i++) {
        const el = $allEl[i]
        if (!el.className.includes(`splitline`)) {
          el.setAttribute('class', el.className.concat(' splitline'))
        }
      }
      // 删除当前激活按钮的前一个按钮的splitline样式类名
      $prev?.setAttribute('class', $prev?.className.replace('splitline', ''))
      $activeEl.setAttribute(
        'class',
        $activeEl.className.replace('splitline', '')
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.mimesis {
  :deep(.el-radio-button) {
    padding: 3px;
    background-color: #f2f3f5;
    border-radius: 2px;
  }

  .el-radio-button.splitline:not(:last-child)::after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 2px;
    // height: 20px;
    height: 60%;
    transform: translateY(-50%);
    top: 50%;
    // background-color: red;
    background-color: #e5e6eb;
  }

  .el-radio-button.splitline.is-active::after {
    display: none;
  }

  :deep(.el-radio-button__inner) {
    border: none !important;
    font-size: 12px;
    border-radius: 2px !important;
    background-color: transparent;
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    color: #165dff !important;
    background-color: #fff;
    box-shadow: none;
  }
}
</style>
