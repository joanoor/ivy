<template>
  <div flex justify-center items-center cursor-pointer class="icon-circle">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.icon-circle {
  width: 32px;
  height: 32px;
  background: #f2f3f5;
  border-radius: 18px;
}
</style>
