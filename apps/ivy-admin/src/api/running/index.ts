import { http } from '@utils/http'
import type { Result, ResultColumnsData, ResultPagingData } from '@/types'
import type { RequestOptions } from '@ivy/request'
import {
  ConnectorStruct,
  EquipStruct,
  ResultBindStatisticsStruct,
  ResultEquipStatisticsStruct,
  ResultMeasureConnectorStruct,
  ResultMeasureNumberStruct,
  ResultOperatorStatisticsStruct,
  ResultRunStation,
  ResultRunStationInfoStruct,
  ResultStatisticsStruct,
  ResultToBeReviewedStruct,
} from './model'
import { ResultIdleStruct, ResultStationInfo } from './model'
import { ResultActiveNumberStruct } from './model'
import {
  ResultConnectorStruct,
  ResultEquipmentStruct,
  ResultStationStruct,
} from '../dossier/model'

export const getIdleList = <R = ResultIdleStruct[]>(
  option: RequestOptions = {}
) => {
  return http.get<Result<R>>(
    {
      url: `/api/idleList`,
    },
    { ...option }
  )
}
export const getStationInfo = <R = ResultStationInfo>(
  option: RequestOptions = {}
) => {
  return http.get<Result<R>>(
    {
      url: `/api/stationinfo`,
    },
    { ...option }
  )
}

type Columns = ResultColumnsData[]

enum API {
  MEASURE_CONNECTOR = `/run/measureconnector/rel/query/tree`,
  BIND_MEASURE = `/run/measureconnector/rel/bind`,
  MEASURE_MODULE = `/dossier/measuremodulemanage/list`,
  STATION_LIST = `/dossier/stationmanage/list`,
  MEASURE_RUN = `/run/measuremodule/run/query`,
  MEASURE_NUMBER = `/run/measuremodule/run/number`,
  HMPAGE_STATISTICS = `/run/homePage/statistics`,
  HMPAGE_EQUIP_STATISTICS = `/run/homePage/equipmentSta`,
  HMPAGE_OPERATOR_STATISTICS = `/run/homePage/operator`,
  HMPAGE_ACTIVE_NUMBER = `/run/homePage/effectiveNumber`,
  TOBE_REVIEWED = `/run/homePage/toBeReviewed`,
  CJ_INFO = `/run/measuremodule/infopage`,
  CONFIG_CJ = `/run/measuremodule/configBatch`,
  RUN_STATION = `/run/operation/monitoring/query/collect/number`,
  RUN_STATIONS_INFO = `/run/operation/monitoring/query/station/list`,
  ALL_CONNECTOR = `/dossier/equipmentmanage/pageTree`,
  RUN_STATISTICS = `/run/measureconnector/rel/query/statistics`,
  BIND_LIST = `/run/measureconnector/rel/query/bindstatus/measurelist`,
  EQUIPMENT_LIST = `/dossier/equipmentmanage/list`,
  CONNECTOR_LIST = `/dossier/connectormanage/list`,
}

export const getMeasureConnector = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.MEASURE_CONNECTOR,
  option: RequestOptions = {}
) => {
  return http.post<
    Result<ResultPagingData<ResultMeasureConnectorStruct>, Columns>
  >(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const bindMeasure = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post(
    {
      url: API.BIND_MEASURE,
      data,
    },
    { ...option }
  )
}

export const getMeasureModuleManage = (option: RequestOptions = {}) => {
  return http.get<Result<ResultMeasureConnectorStruct[]>>(
    {
      url: API.MEASURE_MODULE,
    },
    { ...option }
  )
}

export const getMeasureModuleRun = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.MEASURE_RUN,
  option: RequestOptions = {}
) => {
  return http.post<
    Result<ResultPagingData<ResultMeasureConnectorStruct>, Columns>
  >(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const getMeasureNumber = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultMeasureNumberStruct>>(
    {
      url: API.MEASURE_NUMBER,
      data,
    },
    { ...option }
  )
}

export const getPageStatistics = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultStatisticsStruct>>(
    {
      url: API.HMPAGE_STATISTICS,
      data,
    },
    option
  )
}
export const getPageEquipStatistics = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultEquipStatisticsStruct[]>>(
    {
      url: API.HMPAGE_EQUIP_STATISTICS,
      data,
    },
    option
  )
}
export const getPageOperatorStatistics = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultOperatorStatisticsStruct[]>>(
    {
      url: API.HMPAGE_OPERATOR_STATISTICS,
      data,
    },
    option
  )
}
export const getPageActiveNumber = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultActiveNumberStruct[]>>(
    {
      url: API.HMPAGE_ACTIVE_NUMBER,
      data,
    },
    option
  )
}
export const getToBeReviewed = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultToBeReviewedStruct[]>>(
    {
      url: API.TOBE_REVIEWED,
      data,
    },
    option
  )
}
export const modifyCj = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultToBeReviewedStruct[]>>(
    {
      url: API.CONFIG_CJ,
      data,
    },
    option
  )
}

export const getCJInfo = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.CJ_INFO,
  option: RequestOptions = {}
) => {
  return http.post<
    Result<ResultPagingData<ResultMeasureConnectorStruct>, Columns>
  >(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const getRunStation = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultRunStation>>(
    {
      url: API.RUN_STATION,
      data,
    },
    option
  )
}

export const getRunStationsInfo = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.RUN_STATIONS_INFO,
  option: RequestOptions = {}
) => {
  return http.post<
    Result<ResultPagingData<ResultRunStationInfoStruct>, Columns>
  >(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const getStationList = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultStationStruct>>(
    {
      url: API.STATION_LIST,
      data,
    },
    option
  )
}

export const getAllEquip = <QueryParams>(
  params: QueryParams,
  option: RequestOptions = {}
) => {
  return http.get<Result<EquipStruct[]>>(
    {
      url: API.EQUIPMENT_LIST,
      params,
    },
    option
  )
}
export const getAllConnector = <QueryParams>(
  params: QueryParams,
  option: RequestOptions = {}
) => {
  return http.get<Result<ConnectorStruct[]>>(
    {
      url: API.CONNECTOR_LIST,
      params,
    },
    option
  )
}

export const getBindStatistics = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultBindStatisticsStruct>>(
    {
      url: API.RUN_STATISTICS,
      data,
    },
    option
  )
}
export const getBindList = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result<{ measureModuleNo: string }[]>>(
    {
      url: API.BIND_LIST,
      data,
    },
    option
  )
}
