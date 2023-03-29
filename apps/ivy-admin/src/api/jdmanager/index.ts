import { http } from '@utils/http'
import type { Result, ResultColumnsData, ResultPagingData } from '@/types'
import type { RequestOptions } from '@ivy/request'
import {
  ResultChargingRecord,
  JdDetailStruct,
  LoadTaskStruct,
  LocationStruct,
  ErrorStruct,
  CheckStruct,
} from './model'

export enum API {
  CHARGING_RECORD2 = `/inspection/invalid/charge/record`,
  CHARGING_RECORD = `/inspection/valid/charge/record`,
  DETAIL = `/inspection/measure/charge/record/details`,
  LOAD_TASK = `/inspection/check/task/data`,
  CHECK_TASK = `/inspection/check/task/run`,
  LOCATION_DETAIL = `/inspection/valid/charge/station/location`,
  LOCATION_DETAIL2 = `/inspection/invalid/charge/station/location`,
  ERROR_DETAIL = `/inspection/valid/charge/error/details`,
  CHECK_DETAIL = `/inspection/check/task/data/detail`,
  TEST_UPLOAD = `/inspection/test/file/upload`,
  DOWNLOAD_FILE = `/inspection/file/download/file`,
}

type Columns = ResultColumnsData[]

export const getJDManagerList = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.CHARGING_RECORD,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultPagingData<ResultChargingRecord>, Columns>>(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const getJDManagerList2 = <
  QueryParams,
  R = ResultPagingData<ResultChargingRecord>,
  Column = ResultColumnsData[]
>(
  data: QueryParams,
  requestUrl: string = API.CHARGING_RECORD2,
  option: RequestOptions = {}
) => {
  return http.post<Result<R, Column>>(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const getJdDetailList = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.DETAIL,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultPagingData<JdDetailStruct>, Columns>>(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const getLoadTaskList = <QueryParams>(
  data: QueryParams,
  requestUrl: string = API.LOAD_TASK,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultPagingData<LoadTaskStruct>, Columns>>(
    {
      url: requestUrl,
      data,
    },
    { ...option }
  )
}

export const checkTask = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post<Result>(
    {
      url: API.CHECK_TASK,
      data,
    },
    { ...option }
  )
}

export const getLocationDetail = params => {
  return http.get<Result<LocationStruct>>({
    url: API.LOCATION_DETAIL,
    params,
  })
}
export const getLocationDetail2 = params => {
  return http.get<Result<LocationStruct>>({
    url: API.LOCATION_DETAIL2,
    params,
  })
}

export const getErrorDetail = params => {
  return http.get<Result<ErrorStruct>>({
    url: API.ERROR_DETAIL,
    params,
  })
}
export const getCheckDetail = params => {
  return http.get<Result<CheckStruct>>({
    url: API.CHECK_DETAIL,
    params,
  })
}

export const uploadFile = (url: string, formData: FormData) => {
  return http.post({
    url,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    // transformRequest: [
    //   function (data, headers) {
    //     if (headers['Content-Type'] === 'multipart/form-data') {
    //       return data
    //     }
    //     return JSON.stringify(data)
    //   },
    // ],
  })
}

export const downLoadMyFile = (data, option: RequestOptions = {}) => {
  return http.post(
    {
      url: API.DOWNLOAD_FILE,
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      responseType: 'blob',
    },
    option
  )
}
