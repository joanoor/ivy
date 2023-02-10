// 电表
export interface ResultElectricityStruct {
  assetNo: string
  baudrate: number
  commAddress: string
  commMode: number
  createTime: string
  creator: string
  ct: number
  meterId: number
  orgNo: string
  phaseLine: number
  protocolType: number
  pt: number
  state: number
  [x: string]: string | number
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
