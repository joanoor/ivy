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

export interface ResultOrgStruct {
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
