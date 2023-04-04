import { Result,ResultColumnsData,ResultPagingData } from "@/types";
import { RequestOptions } from "@ivy/request";

export type ServiceType<TData, TParams extends any[]> = (data: TParams, requestUrl?: string, opt?: RequestOptions) => Promise<Result<ResultPagingData<TData>>>

interface HookOption<TData,TParams>{
  queryParams?: TParams // 调用hooks时传递的参数
  requestUrl?: string // 不同接口的baseUrl
  appendColumns?: ResultColumnsData[] // 新增加的自定义列，比如“操作”
  customColumns?: ResultColumnsData[]
  expectOmitedColumnNames?:<keyof TData>
  lazy?: boolean // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
  baseOffsetWidth?: number // 基础的列宽
  onTransformData?: (data: TData[]) => void
  
}


export default function <Tdata, TParams extends[]>(
  service: ServiceType<Tdata, TParams>,
  option: HookOption<TData,TParams>
) {
  
}