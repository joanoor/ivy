import { http } from '@utils/http'
import type { Result, ResultColumnsData, ResultPagingData } from '@/types'
import type { RequestOptions } from '@ivy/request'
import {
  ResultAreaStruct,
  ResultOperatorStruct,
  ResultSupervisionOrgStruct,
  ResultSupplierStruct,
  ResultVerificationOrgStruct,
  ResultStationStruct,
} from './model'

export enum API {
  OPERATOR_MANAGER = `/dossier/operatormanage/page`,
  SUPPLIER_MANAGER = `/dossier/suppliermanage/page`,
  METERRAGE_MANAGER = `/dossier/measuremodulemanage/page`,
  // EQUIPMENT_MANAGER = `/dossier/equipmentmanage/pageNew`,
  EQUIPMENT_MANAGER = `/dossier/equipmentmanage/pageTree`,
  STATION_MANAGER = `/dossier/stationmanage/pageNew`,
  SUPERVISIONORG_MANAGE = `/dossier/SupervisionOrgManage/list`,
  VERIFICATIONORG_MANAGE = `/dossier/VerificationOrgManage/list`,
  AREA_MANAGE = `/dossier/AreaManage/list`,
  ALL_SUPPLIER = `/dossier/suppliermanage/list`,
  ALL_OPERATOR = `/dossier/operatormanage/list`,
  ALL_STATION = `/dossier/stationmanage/list`,
  BATCH_CONNECTOR_MANAGER = `/dossier/connectormanage/saveorupdatebatch`,
}

export const getDossierList = <
  QueryParams,
  R = ResultPagingData<ResultOperatorStruct>,
  Column = ResultColumnsData[]
>(
  data: QueryParams,
  url: string = API.OPERATOR_MANAGER,
  option: RequestOptions = {}
) => {
  return http.post<Result<R, Column>>(
    {
      url: url,
      data,
    },
    { ...option }
  )
}

export const addOperatormanage = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: `/dossier/operatormanage`,
      data,
    },
    option
  )
}

export const addSuppliermanage = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: `/dossier/suppliermanage`,
      data,
    },
    option
  )
}

export const addMeteragemanage = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: `/dossier/measuremodulemanage`,
      data,
    },
    option
  )
}

export const addEquipmentmanage = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: `/dossier/equipmentmanage`,
      data,
    },
    option
  )
}

export const addStationmanage = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: `/dossier/stationmanage`,
      data,
    },
    option
  )
}

export const OperatorEditRow = (data: any, option: RequestOptions = {}) => {
  return http.put(
    {
      url: `/dossier/operatormanage`,
      data,
    },
    option
  )
}

export const SupplierEditRow = (data: any, option: RequestOptions = {}) => {
  return http.put(
    {
      url: `/dossier/suppliermanage`,
      data,
    },
    option
  )
}

export const MeterageEditRow = (data: any, option: RequestOptions = {}) => {
  return http.put(
    {
      url: `/dossier/measuremodulemanage`,
      data,
    },
    option
  )
}

export const EquipmentEditRow = (data: any, option: RequestOptions = {}) => {
  return http.put(
    {
      url: `/dossier/equipmentmanage`,
      data,
    },
    option
  )
}

export const StationEditRow = (data: any, option: RequestOptions = {}) => {
  return http.put(
    {
      url: `/dossier/stationmanage`,
      data,
    },
    option
  )
}

export const OperatorDeleteRow = (operatorNo: string) => {
  return http.delete({
    url: `/dossier/operatormanage/${operatorNo}`,
  })
}

export const SupplierDeleteRow = (supplierNo: string) => {
  return http.delete({
    url: `/dossier/suppliermanage/${supplierNo}`,
  })
}

export const MeterageDeleteRow = (measureModuleNo: string) => {
  return http.delete({
    url: `/dossier/measuremodulemanage/${measureModuleNo}`,
  })
}

export const EquipmentDeleteRow = (equipmentNo: string) => {
  return http.delete({
    url: `/dossier/equipmentmanage/${equipmentNo}`,
  })
}

export const StationDeleteRow = (stationNo: string) => {
  return http.delete({
    url: `/dossier/stationmanage/${stationNo}`,
  })
}

export const OperatorBatchDelete = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete<QueryParams>(
    {
      url: `/dossier/operatormanage/list`,
      data,
    },
    option
  )
}

export const SupplierBatchDelete = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete<QueryParams>(
    {
      url: `/dossier/suppliermanage/list`,
      data,
    },
    option
  )
}

export const MeterageBatchDelete = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete<QueryParams>(
    {
      url: `/dossier/measuremodulemanage/list`,
      data,
    },
    option
  )
}

export const EquipmentBatchDelete = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete<QueryParams>(
    {
      url: `/dossier/equipmentmanage/list`,
      data,
    },
    option
  )
}

export const StationBatchDelete = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete<QueryParams>(
    {
      url: `/dossier/stationmanage/list`,
      data,
    },
    option
  )
}

/******************************************* */
// 区域
export const getSupervisionOrgManage = () => {
  return http.get<Result<ResultSupervisionOrgStruct[]>>({
    url: API.SUPERVISIONORG_MANAGE,
  })
}

// 检定单位
export const getVerificationOrgManage = () => {
  return http.get<Result<ResultVerificationOrgStruct[]>>({
    url: API.VERIFICATIONORG_MANAGE,
  })
}

// 行政区域
export const getAreaManage = () => {
  return http.get<Result<ResultAreaStruct[]>>({
    url: API.AREA_MANAGE,
  })
}

export const getAllOperator = () => {
  return http.get<Result<ResultOperatorStruct[]>>({
    url: API.ALL_OPERATOR,
  })
}

export const getAllSupplier = () => {
  return http.get<Result<ResultSupplierStruct[]>>({
    url: API.ALL_SUPPLIER,
  })
}

export const getAllStation = () => {
  return http.get<Result<ResultStationStruct[]>>({
    url: API.ALL_STATION,
  })
}

export const batchAddConnectorManager = (
  data: any,
  option: RequestOptions = {}
) => {
  return http.post<Result>(
    {
      url: API.BATCH_CONNECTOR_MANAGER,
      data,
    },
    option
  )
}

export const batchAddOperator = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: API.ALL_OPERATOR,
      data,
    },
    option
  )
}
export const batchAddSupplier = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: API.ALL_SUPPLIER,
      data,
    },
    option
  )
}
export const batchAddStation = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: API.ALL_STATION,
      data,
    },
    option
  )
}
export const batchAddEquipment = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: '/dossier/equipmentmanage/list',
      data,
    },
    option
  )
}
export const batchAddConnnector = (data: any, option: RequestOptions = {}) => {
  return http.post(
    {
      url: '/dossier/connectormanage/list',
      data,
    },
    option
  )
}
export const batchAddMeasureModule = (
  data: any,
  option: RequestOptions = {}
) => {
  return http.post(
    {
      url: '/dossier/measuremodulemanage/list',
      data,
    },
    option
  )
}
