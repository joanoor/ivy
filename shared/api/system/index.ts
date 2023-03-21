import { http } from '../../utils/http'
import type {
  DictType,
  Result,
  ResultColumnsData,
  ResultPagingData,
} from '../../types'
import type { RequestOptions } from '@ivy/request'
import { ResultMainFieldStruct, ResultSubFieldStruct } from './model'

export enum API {
  MAIN_FIELD = `/system/codesort/page`,
  SUB_FIELD = `/system/code/page`,
  PUT_MAIN_FIELD = `/system/codesort`,
  DELETE_MAIN_FIELD = `/system/codesort`,
  ADD_MAIN_FIELD = `/system/codesort`,
  PUT_SUB_FIELD = `/system/code`,
  DELETE_SUB_FIELD = `/system/code`,
  ADD_SUB_FIELD = `/system/code`,
  CODELIST = `/system/code/codelist`,
}
type Columns = ResultColumnsData[]
export const getMainCodePage = <QueryParams>(
  data: QueryParams,
  url: string = API.MAIN_FIELD,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultPagingData<ResultMainFieldStruct>, Columns>>(
    {
      url,
      data,
    },
    { ...option }
  )
}

export const getSubCodePage = <QueryParams>(
  data: QueryParams,
  url: string = API.SUB_FIELD,
  option: RequestOptions = {}
) => {
  return http.post<Result<ResultPagingData<ResultSubFieldStruct>, Columns>>(
    {
      url,
      data,
    },
    { ...option }
  )
}

export const updateMainCode = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.put(
    {
      url: API.PUT_MAIN_FIELD,
      data,
    },
    {
      ...option,
    }
  )
}
export const addMainCode = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post(
    {
      url: API.ADD_MAIN_FIELD,
      data,
    },
    {
      ...option,
    }
  )
}
export const deleteMainCode = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete(
    {
      url: API.DELETE_MAIN_FIELD,
      data,
    },
    {
      ...option,
    }
  )
}
export const updateSubCode = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.put(
    {
      url: API.PUT_SUB_FIELD,
      data,
    },
    {
      ...option,
    }
  )
}
export const addSubCode = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.post(
    {
      url: API.ADD_SUB_FIELD,
      data,
    },
    {
      ...option,
    }
  )
}
export const deleteSubCode = <QueryParams>(
  data: QueryParams,
  option: RequestOptions = {}
) => {
  return http.delete(
    {
      url: API.DELETE_SUB_FIELD,
      data,
    },
    {
      ...option,
    }
  )
}

export const getPCodes = <T>(codeTypes: T) => {
  return http.post<Result<DictType>>({
    url: API.CODELIST,
    data: {
      codeTypes,
    },
  })
}
