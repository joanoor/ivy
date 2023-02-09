<template>
  <Dropdown
    :dropMenuList="localeList"
    mode="focus"
    :selectedKeys="selectedKeys"
    @menuEvent="handleMenuEvent"
  >
    <el-icon size="18">
      <i-ion:language />
    </el-icon>
    <span v-if="showText" ml-1>{{ getLocaleText }}</span>
  </Dropdown>
</template>

<script setup lang="ts">
import { Dropdown, DropMenu } from '@/components/Dropdown'
import { LOCALE } from '@/libs/settings/localeSetting'
import { LocaleType } from '@/libs/types'
import { useLocale } from '@/plugins/locales/useLocale'
const props = withDefaults(
  defineProps<{
    showText?: boolean
    reload?: boolean
  }>(),
  {
    showText: false,
    reload: false,
  }
)

const localeList: DropMenu[] = [
  {
    text: '简体中文',
    event: LOCALE.ZH_CN,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
]
const { changeLocale, getLocale } = useLocale()

const selectedKeys = ref<string[]>([])
watchEffect(() => {
  selectedKeys.value = [unref(getLocale)]
})

const getLocaleText = computed(() => {
  const key = selectedKeys.value[0]
  if (!key) {
    return ''
  }
  return localeList.find(item => item.event === key)?.text
})

async function toggleLocale(lang: LocaleType | string) {
  await changeLocale(lang as LocaleType)
  selectedKeys.value = [lang as string]
  props.reload && location.reload()
}

function handleMenuEvent(menu: DropMenu) {
  console.log(`menu`, menu, unref(getLocale))
  if (unref(getLocale) === menu.event) {
    return
  }
  toggleLocale(menu.event as string)
}
</script>
