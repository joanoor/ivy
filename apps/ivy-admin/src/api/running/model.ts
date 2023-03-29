export interface ResultMeasureLeafStruct {
  bindTime: string | null
  commAddress: string | null
  connectorName: string
  connectorNo: string
  equipmentNo: string
  measureModuleName: string
  measureModuleNo: string
  measureStatus: string
}
export interface ResultMeasureConnectorStruct {
  id: string
  measureModuleNo: string
  measureModuleName: string
  supplierNo: string
  measureModuleType: string
  verificationOrgNo: string
  commAddress: string
  allowedError: string
  precision: string
  measureStatus: string
}

interface StationInfo {
  time: string
  chargingValue: string
  idleValue: string
  offlineValue: string
}

export interface ResultStationInfo {
  list: StationInfo[]
}

export interface ResultIdleStruct {
  company: string
  percent: string
}

interface StationInfo {
  time: string
  value: string
}

export interface ResultStationInfo {
  charging: StationInfo[]
  idle: StationInfo[]
  offline: StationInfo[]
}

export interface ResultMeasureNumberStruct {
  offlineTotalNumber: string
  onlineRate: string
  onlineTotalNumber: string
  totalNumber: string
}

export interface ResultStatisticsStruct {
  stationNum: string
  equipmentNum: string
  emeasureNum: string
  taskNum: string
  efficiency: string
}
export interface ResultEquipStatisticsStruct {
  orgNo: string
  countNum: string
  orgNoName: string
  moduleNo: string
}
export interface ResultOperatorStatisticsStruct {
  operatorNo: string
  operatorName: string
  countNum: number
  countN: number
  proportion: string
}

export interface ResultActiveNumberStruct {
  orgNo: string
  countNum: string
  orgNoName: string
}

export interface ResultToBeReviewedStruct {
  orgNo: string
  countNum: number
  orgName: string
}

export interface ResultRunStation {
  supervisionOrgNo: string
  totalStationNumber: string
  lastYearTotalStationNumber: string
  compareLastYearStationNumber: string
  totalEquipmentNumber: string
  lastMonthTotalEquipmentNumber: string
  compareLastMonthEquipmentNumber: string
  totalCheckTaskNumber: string
  checkNumber: string
  unCheckNumber: string
  checkNumberRate: string
  chargeResultPassRate: string
  stationSortByChargeUnPassRateList: {
    chargeResultPassRate: number
    chargeResultUnPassRate: number
    checkNumber: number
    checkNumberRate: number
    id: number
    invalidChargeNumber: number
    stationName: string
    stationNo: string
    totalChargeNumber: number
    totalCheckTaskNumber: number
    totalEquipmentNumber: number
    unCheckNumber: number
    validChargeNumber: number
  }[]
}

export interface ResultRunStationInfoStruct {
  id: number
  stationNo: string
  stationName: string
  supervisionOrgNo: string
  supervisionOrgName: string
  stationType: string
  operatorNo: string
  operatorName: string
  phoneNo: string
  longitude: number
  latitude: number
  address: string
  areaNo: string
  areaName: string
  supportVehicle: null
  chargeFeeRateNo: null
  serviceFeeRateNo: null
  parkFeeRateNo: null
  supportReservation: null
  stationStatus: string
  buildDate: string
  chargeResultPassRate: string
  checkNumberRate: string
  totalEquipmentNumber: number
}

export interface ResultBindStatisticsStruct {
  totalEquipmentNumber: string
  totalConnectorNumber: string
  totalMeasureNumber: string
  bindMeasureNumber: string
  measureCoverage: string
}

export interface EquipStruct {
  buildDate: string
  connectorCount: null
  constructionDate: null
  equipStatus: string
  equipmentName: string
  equipmentNo: string
  equipmentType: string
  id: number
  latitude: number
  level: string
  longitude: number
  onlineTime: null
  operatorNo: string
  producedDate: string
  productModel: string
  ratedPower: string
  stationNo: string
  supplierNo: string
}

export interface ConnectorStruct {
  connectorName: string
  connectorNo: string
  connectorStatus: null
  connectorType: string
  equipmentNo: string
  id: number
  nationStandard: null
  ratedCurrent: null
  ratedPower: null
  ratedVoltage: null
  voltLowerLimit: null
  voltUpperLimit: null
}
