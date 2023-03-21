export interface ResultMainFieldStruct {
  codeSortId: number
  codeType: string
  dispSn: number
  name: string
  validFlag: string
  [x: string]: string | number
}

export interface ResultSubFieldStruct {
  codeId: number
  codeSortId: string
  dispSn: number
  name: string
  validFlag: string
  value: string
  [x: string]: string | number
}
