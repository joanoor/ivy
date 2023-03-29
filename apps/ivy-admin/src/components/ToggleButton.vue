<template>
  <div flex>
    <div
      v-for="(item, index) in buttonList"
      class="button"
      @click="handleClick(item, index)"
      flex
      items-center
      cursor-pointer
      pr-3
      pl-3
      :style="activeIndex === index ? 'color:#0FC6C2' : ''"
    >
      <el-icon color="inherit" mr-1>
        <SvgIcon :name="item.icon"></SvgIcon>
      </el-icon>
      <span style="font-size: inherit">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ButtonStruct {
  icon: string
  label: string
}

const emit = defineEmits(['update:active', 'toggle'])

const props = defineProps<{
  buttonList: ButtonStruct[]
  active: number
}>()

const activeIndex = computed({
  get: () => props.active,
  set: value => {
    emit('update:active', value)
  },
})

const handleClick = (item: ButtonStruct, index: number) => {
  activeIndex.value = index
  emit('toggle', item)
}
</script>

<style scoped lang="scss">
.button {
  &:not(:first-child) {
    border-left: solid 1px #d9d9d9;
  }
}
</style>
