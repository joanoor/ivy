<template>
  <el-date-picker
    v-model="chargeTime"
    :type="type"
    :value-format="valueFormat"
    :format="format"
    :disabled-date="isDisableData"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
</template>

<script setup lang="ts">
import { isDisableData } from '@/utils'
import { isArray } from '@vue/shared'
import { IDatePickerType } from 'element-plus/es/components/date-picker/src/date-picker.type'

const chargeTime = ref<string | [string, string]>('')

const emit = defineEmits(['update:start', 'update:end'])

const props = withDefaults(
  defineProps<{
    type?: IDatePickerType
    valueFormat?: string
    start: string
    end: string
    format?: string
  }>(),
  {
    type: 'daterange',
    start: '',
    end: '',
    valueFormat: 'YYYY-MM-DD',
    format: 'YYYY-MM-DD',
  }
)

const startTime = computed({
  get: () => props.start,
  set: value => emit('update:start', value),
})

const endTime = computed({
  get: () => props.end,
  set: value => emit('update:end', value),
})

watch(chargeTime, newValue => {
  if (isArray(newValue) && newValue.length === 2) {
    startTime.value = newValue[0]
    endTime.value = newValue[1]
  }
})

watchEffect(() => {
  chargeTime.value = [startTime.value, endTime.value]
})
</script>

<style scoped></style>
