import { http } from '@/plugins/request'
import { Result, ResultOrgStruct } from './model'
import type { DictType } from '@/libs/shared/types'
import { DICT_FIELDS } from '@/libs/shared/constant'

export * from './terminal'

/**
 * 获取项目字典
 * @param codeTypes
 * @returns
 *
 * 通信方式,COMM_MODE
 * 规约类型,PROTOCOL_TYPE
 * 相线,PHASE_LINE
 * 波特率,BAUDRATE
 * 设备状态,METER_STATE
 */
export const queryDict = (codeTypes: typeof DICT_FIELDS) => {
  return http.post<Result<DictType>>({
    url: `/system/code/codelist`,
    data: {
      codeTypes,
    },
  })
}

// 获取所有的组织，返回结果是数组（树形）
export const getAllOrgTree = () => {
  return http.get<Result<ResultOrgStruct[]>>({
    url: `/system/org/tree`,
    params: {
      orgNo: '00000',
    },
  })
}
// 获取所有的组织，返回结果是数组（不是树形）
export const getAllOrgList = () => {
  return http.get<Result<ResultOrgStruct[]>>({
    url: `/system/org/all`,
    params: {
      orgNo: '00000',
    },
  })
}
