export interface ResultChargingRecord {
  areaName: string
  chargeErrorResult: null
  chargeId: string
  chargeResultType: string
  elecError: null
  elecErrorResult: null
  elecErrorRevise: null
  equipStatus: string
  equipmentLevel: string
  equipmentName: string
  equipmentNo: string
  equipmentType: string
  gunCount: number
  level: string | null
  measureElec: string
  measureEndTime: string
  measureModuleNo: string
  measureStartTime: string
  operatorName: string
  operatorNo: string
  operatorStatus: string
  platformElec: null
  platformEndTime: null
  platformStartTime: null
  stationAddress: string
  stationAreaNo: string
  stationLatitude: string
  stationLongitude: string
  latitude: string
  longitude: string
  stationName: string
  stationNo: string
  stationPhoneNo: string
  stationStatus: string
  stationType: string
  supervisionOrgName: string
  supervisionOrgNo: string
  supplierName: string
  supplierStatus: string
  temperature: number
  timeError: null
  timeErrorResult: null
  timeErrorRevise: null
  verificationOrgNo: string
  chargeResultPassRate: string // 充电合格率
  checkNumberRate: string // 复核完成率
  totalEquipmentNumber: number // 充电桩总数
}

export interface JdDetailStruct {
  chargeId: string
  chargedDuration: number
  dataTime: string
  frequency: number
  id: number
  measureModuleNo: string
  realCurrent: number
  realPower: number
  realTemperature: number
  realTotalEnergy: number
  realVoltage: number
}

export interface LoadTaskStruct {
  areaName: string
  checkResult: null
  checkTime: null
  checkUser: null
  equipStatus: string
  equipmentLevel: string
  equipmentName: string
  equipmentNo: string
  equipmentType: string
  fileA: null | string
  fileB: null | string
  fileC: null | string
  id: number
  notes: null | string
  operatorName: string
  operatorNo: string
  operatorStatus: string
  stationAddress: string
  stationAreaNo: string
  stationLatitude: string
  stationLongitude: string
  stationName: string
  stationNo: string
  stationPhoneNo: string | null
  stationStatus: string
  stationType: string
  supervisionOrgName: string
  supervisionOrgNo: string
  supplierName: string
  supplierNo: string
  supplierStatus: string
  taskId: string
  taskStatus: string
}

export interface LocationStruct {
  address: string
  chargeResultPassRate: number
  checkNumberRate: number
  latitude: number
  longitude: number
  operatorName: string
  stationName: string
  stationNo: string
  stationStatus: string
  stationType: string
}
export interface LocationStruct {
  address: string
  chargeResultPassRate: number
  checkNumberRate: number
  latitude: number
  longitude: number
  operatorName: string
  stationName: string
  stationNo: string
  stationStatus: string
  stationType: string
  totalEquipmentNumber: number
  supervisionOrgName: string
  supervisionOrgNo: string
}

export interface ErrorStruct {
  elecError: string | null
  elecErrorResult: string | null
  measureElec: number
  measureEndTime: string
  measureStartTime: string
  platformElec: string | null
  platformEndTime: string | null
  platformStartTime: string | null
  temperature: number
  timeError: string | null
  timeErrorResult: string | null
}

export interface CheckStruct {
  checkResult: string
  checkTime: string
  checkUser: string
  equipmentNo: string
  fileA: string
  fileB: string
  fileC: string
  id: number
  notes: string
  taskId: string
  taskStatus: string
}


export interface 