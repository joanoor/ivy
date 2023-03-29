import { CascaderValue } from 'element-plus'

export default function () {
  const detailAddress = ref('')

  const props = {
    expandTrigger: 'hover' as const,
    value: 'areaNo', // areaNo
    label: 'areaName',
    checkStrictly: true,
  }

  const handleChange = (value: CascaderValue) => {
    console.log('看看看看看看', value)
  }

  return {
    detailAddress,
    props,
    handleChange,
  }
}
