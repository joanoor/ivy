export interface RequestDossier {
  current: number
  size: number
}

export interface ResultOperatorStruct {
  address: string
  createdBy: string
  createdTime: string
  id: string
  operatorName: string
  operatorNo: string
  phoneNumber: string
  supervisionUnit: string
  updatedBy: string
  updatedTime: string
  verificationUnit: string
}

export interface ResultSupplierStruct {
  address: string
  createdBy: string
  createdTime: string
  id: string
  phoneNumber: string
  supplierName: string
  supplierNo: string
  updatedBy: string
  updatedTime: string

  supervisionUnit: string
}

export interface ResultMeterageStruct {
  allowedError: string
  buildDate: string
  commAddress: string
  id: string
  measureModuleName: string
  measureModuleNo: string
  measureModuleType: string
  measurePrecision: string
  measureStatus: string
  supplierNo: string
  verificationOrgNo: string
}

export interface ResultEquipmentStruct {
  address: string
  city: string
  constructionDate: string
  createdBy: string
  createdTime: string
  equipmentName: string
  equipmentNo: string
  equipmentNumber: string
  equipmentType: string
  gunCount: string
  id: string
  level: string
  onlineTime: string
  operatorNo: string
  phoneNumber: string
  producedDate: string
  productModel: string
  ratedPower: string
  stationNo: string
  supervisionCode: string
  supplierNo: string
  updatedBy: string
  updatedTime: string
  verificationCode: string

  aconnectorVOS: {
    connectorName: string
    connectorNo: string
    connectorStatus: null
    connectorType: null
    equipmentNo: string
    id: number
    nationStandard: null
    ratedCurrent: null
    ratedPower: null
    ratedVoltage: null
    voltLowerLimit: null
    voltUpperLimit: null
  }[]
}

export interface ResultStationStruct {
  address: string
  areaNo: string
  chargeRate: string
  createdBy: string
  createdTime: string
  id: string
  latitude: string
  longitude: string
  operatorNo: string
  originBy: string
  parkRate: string
  phoneNumber: string
  serviceRate: string
  stationName: string
  stationNo: string
  stationType: string
  supportReservation: string
  supportVehicle: string
  updatedBy: string
  updatedTime: string
  tradeTime: string
}

export interface ResultMainFieldStruct {
  ids: []
}

/**************************** */
export interface ResultSupervisionOrgStruct {
  distLv: string
  parentOrgNo: string | null
  sortNo: string | null
  supervisionOrgName: string
  supervisionOrgNo: string
  validFlag: string
}
export interface ResultVerificationOrgStruct {
  distLv: string
  parentOrgNo: string | null
  sortNo: string | null
  verificationOrgName: string
  verificationOrgNo: string
  validFlag: string
}
export interface ResultAreaStruct {
  distLv: string
  parentAreaNo: string
  sortNo: string | null
  areaName: string
  areaNo: string
}

export interface ResultConnectorStruct {
  connectorName: string
  connectorNo: string
  connectorType: string
  equipmentNo: string
  id: number
  ratedCurrent: number
  ratedPower: number
  ratedVoltage: number
  voltLowerLimit: number
  voltUpperLimit: number
}
