import { reactive, onMounted } from 'vue'
import { ConsumePower } from '@/api/types'
import { http } from '@/plugins/request'

export default function (url: string) {
  const consumeTotalData = reactive<ConsumePower>({
    detail: {
      count: 0,
      compare: 0,
    },
    records: [],
  })

  // 网络请求，获取消耗
  const fetchTotalConsumeData = async () => {
    const { detail, records } = await http.get<ConsumePower>({
      url,
    })

    consumeTotalData.detail = detail
    consumeTotalData.records = records
  }

  // 组件加载的时候
  onMounted(fetchTotalConsumeData)

  return {
    consumeTotalData,
    fetchTotalConsumeData,
  }
}
