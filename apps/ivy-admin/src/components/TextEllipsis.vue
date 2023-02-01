<template>
  <div class="textellipsis" :class="{heavy,normal}">
    <p v-if="!flag" class="digital h-full mt-0 mb-0 overflow-hidden" ref="rawTextRef">{{message}}</p>
    <el-tooltip v-else :content="message" placement="top">
      <p class="digital h-full mt-0 mb-0 overflow-hidden">{{message}}</p>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, unref, Ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  message: string | number
  heavy?: boolean
  normal?: boolean
}>(), {
  message: '',
  heavy: false,
  normal: true
})

const flag = ref(false)

const rawTextRef = ref<HTMLElement | null>(null)
onMounted(() => {
  nextTick(() => {
    toggleFlag()
  })
})

const toggleFlag = () => {
  const $rawText = unref(rawTextRef as Ref<HTMLElement>)
  if ($rawText && $rawText.offsetWidth < $rawText.scrollWidth) {
    flag.value = true
  } else {
    flag.value = false
  }
}

watch(() => props.message, toggleFlag, { immediate: true })
</script>

<style lang="scss" scoped>
.digital {
  color: #1d2129;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 24px;
}

.normal {
  .digital {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica Neue-Medium;
    font-weight: 500;
    height: 24px;
  }
}

.heavy {
  .digital {
    height: 28px;
    font-size: 24px;
    font-family: Roboto, Roboto-Bold;
    font-weight: 700;
  }
}
</style>