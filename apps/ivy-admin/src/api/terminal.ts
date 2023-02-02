import { BaseURLType } from '@/libs/shared/types'
import { http } from '@/plugins/request'
import type { RequestOptions } from '@ivy/request'
import type { Result, ResultPagingData, ResultElectricityStruct } from './model'

export const getAllMeterPage = <QueryParams = Recordable>(
  data: QueryParams,
  baseURL: BaseURLType = 'electricitymeter',
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultPagingData<ResultElectricityStruct>>>(
    {
      url: `/dossier/${baseURL}/page`,
      data,
    },
    option
  )
}
