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
