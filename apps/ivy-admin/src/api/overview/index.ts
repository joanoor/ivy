import { http } from '@utils/http'
import type { Result } from '@/types'
import type { RequestOptions } from '@ivy/request'
import { ResultChargingQS, ResultEquipNum, ResultStatistics } from './model'

export const getChargingqs = <R = ResultChargingQS[]>(
  option: RequestOptions = {}
) => {
  return http.get<Result<R>>(
    {
      url: `/api/chargingqs`,
    },
    { ...option }
  )
}
export const getStatistics = <R = ResultStatistics[]>(
  option: RequestOptions = {}
) => {
  return http.get<Result<R>>(
    {
      url: `/api/statistics`,
    },
    { ...option }
  )
}

export const getEquipNum = <R = ResultEquipNum[]>(
  option: RequestOptions = {}
) => {
  return http.get<Result<R>>(
    {
      url: `/api/equipnum`,
    },
    { ...option }
  )
}
