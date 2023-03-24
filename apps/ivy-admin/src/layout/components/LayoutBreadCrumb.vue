<template>
  <div class="app-breadcrumb">
    <el-breadcrumb class="app-el-breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        <el-icon :size="14">
          <i-ant-design-home-outlined></i-ant-design-home-outlined>
        </el-icon>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in breadList" :key="item.name">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
interface BreadStruct {
  name: string
  path?: string
}

const route = useRoute()
const breadList = ref<BreadStruct[]>([])

watchEffect(() => {
  if (route.matched && route.matched.length > 0) {
    const matched = route.matched
    const _breadList: BreadStruct[] = matched[matched.length - 1].meta
      .breadList as BreadStruct[]

    breadList.value = [..._breadList]
  }
})
</script>
