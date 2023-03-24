export interface AliMapInfoStruct {
  stationLatitude: number
  stationLongitude: number
  stationName: string // 充电站名称
  stationAddress: string // 充电站地址
  chargeResultPassRate?: string // 充电合格率
  checkNumberRate?: string // 复核完成率
  totalEquipmentNumber?: number // 充电桩总数
  stationStatus?: string // 充电站状态
  stationType?: string // 充电站类型
  stationAreaNo?: string // 归属区域
  operatorName?: string // 运营商名称
  stationNo?: string // 充电站编号
  [x: string]: string | number | null | undefined
}
