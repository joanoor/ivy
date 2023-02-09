<template>
  <el-dropdown
    :trigger="trigger"
    v-bind="$attrs"
    popper-class="locale"
    @command="handleDropdown"
  >
    <slot></slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in dropMenuList"
          :class="hasFocus && selectedKeys.includes(item.event as string) ? 'actived' : ''"
          :key="item.event"
          :command="item"
        >
          {{ item.text }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import type { DropMenu } from './typing'

const emit = defineEmits(['menuEvent'])

const props = withDefaults(
  defineProps<{
    trigger?: 'contextmenu' | 'click' | 'hover'
    dropMenuList: DropMenu[]
    selectedKeys?: string[]
    mode?: 'focus' | 'normal'
  }>(),
  {
    trigger: 'click',
    dropMenuList: () => [],
    selectedKeys: () => [],
    mode: 'normal',
  }
)
const hasFocus = computed(() => props.mode === 'focus')

const handleDropdown = (item: DropMenu) => {
  const { event } = item
  const menu = props.dropMenuList.find(item => `${item.event}` === `${event}`)
  emit('menuEvent', menu)
  item.onClick?.()
}
</script>

<style lang="scss">
/* 消除小三角 */
.locale {
  .el-popper__arrow {
    display: none;
  }
  li.actived {
    background-color: var(--el-dropdown-menuItem-hover-fill);
    color: var(--el-dropdown-menuItem-hover-color);
  }
}
</style>
