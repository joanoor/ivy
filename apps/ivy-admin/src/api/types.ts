import { DictionaryStruct, FormPropRule } from '@/libs/types'

export * from './model/dict'
export * from './dossier/terminalType'
export interface Result<T = any, K = ResultColumnsData[]> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message: string
  result: T
  columns?: K // 字段说明，可以当作表头
}

// 接口返回的columns字段类型
export interface ResultColumnsData extends FormPropRule<string> {
  title?: string // 列的中文名称
  nullable?: boolean
  hidden?: boolean // 是否可以隐藏列
  format?: string
  readOnly?: boolean
  notes?: string // 是否与字典相关的说明名字，其中含有字典名称，可以正则匹配出来
  width?: string // 列的宽度
  fixed?: boolean | 'right' | 'left' // 列是否固定
  selectOption?: DictionaryStruct[] // 如果与字典相关，从字典中获取select选项(可以是接口返回的字典，也可以是用户自定义的字典)
  [x: string]: any
}

// 分页接口返回的类型
export interface ResultPagingData<T> {
  current: number
  orders: string[]
  pages: number
  records: T[]
  searchCount: boolean
  size: number
  total: number
}

/******************************************************************/
export interface ResponseLogin {
  name: string
  token: string
  role: string
}

export interface FirstListValue {
  update: string
  value: string | number
}

export type FirstInfo = {
  count: number
  compare: number
}

export interface ConsumePower {
  detail: FirstInfo
  records: FirstListValue[]
}

export interface FirstListValue {
  update: string
  value: string | number
}

export interface ResponseOrgStruct {
  orgId: number
  orgNo: string
  orgName: string
  orgLevel: number
  upOrgNo: string
  isProspect: null
  upOrgNos: null
  childList: null
  [x: string]: string | number | null
}
