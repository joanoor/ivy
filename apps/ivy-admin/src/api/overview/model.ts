export interface ResultChargingQS {
  address: string
  num: number
}

export interface ResultStatistics {
  company: string
  num: number
  percent: string
}

export type ResultEquipNum = ResultChargingQS

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
