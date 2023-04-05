import { Result, ResultColumnsData, ResultPagingData } from "@/types";
import type { RequestOptions } from "@ivy/request";
import { ElTable } from "element-plus";
import { useGlobalStore } from '@/store'
import { default as deepmerge2 } from 'deepmerge'
import { assertType, textSize } from "@ivy/core";
import { judgeWord } from "@/utils";
import useDecodeDict from '@/hooks/web/useDecodeDict'
import {MaybeComputedElementRef} from '@vueuse/core'
import { useEventListener } from "@vueuse/core";
import useDownload from "./useDownload";


// 拿到字典，用于设置列的selectOption字段
const useGlobal = useGlobalStore()
const { onDecodeDict } = useDecodeDict()

export type ServiceType<TData, TParams extends Recordable> = (data: TParams, requestUrl?: string, opt?: RequestOptions) => Promise<Result<ResultPagingData<TData>, ResultColumnsData<keyof TData>[]>>

interface HookOption<TData, TParams extends Recordable> {
  queryParams?: TParams // 调用hooks时传递的参数
  requestUrl?: string // 不同接口的baseUrl
  appendColumns?: ResultColumnsData<keyof TData>[] // 新增加的自定义列，比如“操作”
  customColumns?: ResultColumnsData<keyof TData>[]
  expectOmitedColumnNames?: (keyof TData)[]
  expectPickedColumnNames?: (keyof TData)[]
  expectOrderColumnNames?: (keyof TData)[]
  lazy?: boolean // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
  baseOffsetWidth?: number // 基础的列宽
  requestOpt?: RequestOptions
  onTransformData?: (data: TData[]) => void
  onTransformColumns?: (columns: ResultColumnsData<keyof TData>[]) => void
  onSetTableHeight?: (tableRef:MaybeComputedElementRef) => void
}

interface AdditionalOption {
  downloadTable?: boolean // 是否是下载table的情况，因为下载excel的时候，要求不影响分页列表
  deepmerge?: boolean  // 是否需要深度合并
}



interface UseQueryTableResult<TData> {
  loading: boolean
  tableHeight: number
  total: number
  current: number
  size: number
  hasSelectedRow: boolean  // el-table的selection模式下，表示是否选择了行（true表示选择了，false表示没有选择）
  columns: ResultColumnsData<keyof TData>[]
  tableColumns: ResultColumnsData<keyof TData>[]
  tableData: TData[]
  allSelectedData: TData[]
  allExeclData: TData[]
}

const getBaseOption = <TData, TParams extends Recordable = Recordable>(): Omit<Required<HookOption<TData, TParams>>, 'queryParams' | 'requestUrl' | 'requestOpt' | 'onTransformData' | 'onTransformColumns' | 'onSetTableHeight'> => ({
  expectOrderColumnNames: [],
  expectPickedColumnNames: [],
  expectOmitedColumnNames: [],
  appendColumns: [],
  customColumns: [],
  lazy: false,
  baseOffsetWidth: 80,
})

const setLocalHookOption = <TData, TParams extends Recordable>(option): HookOption<TData, TParams> => {
  return option
}

export default function <TData, TParams extends Recordable>(
  service: ServiceType<TData, TParams>,
  option: HookOption<TData, TParams>
) {

  const initialOption = {
    ...getBaseOption<TData>(),
    ...option
  }

  let localHookOption = setLocalHookOption<TData, TParams>(initialOption)

  const current2 = initialOption.queryParams?.page?.current || 1
  const size2 = initialOption.queryParams?.page?.size || 10

  const tableRef = ref<InstanceType<typeof ElTable>>()
  const currentSelectedRecord = ref<TData>()

  const tdata: UseQueryTableResult<TData> = reactive({
    loading: false,
    tableHeight: 500,
    total: 0,
    current: current2,
    size: size2,
    hasSelectedRow: false,
    tableData: [],
    columns: [],
    tableColumns: [],
    allExeclData: [],
    allSelectedData: [],
  })

  const fetchTableList = async (
    hookQueryOption: HookOption<TData, TParams> = {},
    additionalOption: AdditionalOption = {
      downloadTable: false,
      deepmerge:true
    }
  ) => {



    const { downloadTable, deepmerge } = additionalOption
    const initialOption2 = {
      ...hookQueryOption
    }

    let saveXlxsOption: HookOption<TData, TParams> = {}

    if (!downloadTable) {
      deepmerge ? (localHookOption = deepmerge2(localHookOption, initialOption2)) : (localHookOption = { ...localHookOption, ...initialOption2 })
    } else {
      saveXlxsOption = deepmerge2(initialOption, initialOption2) as HookOption<TData, TParams>
    }

    const { expectOrderColumnNames,
      expectPickedColumnNames,
      expectOmitedColumnNames,
      customColumns,
      requestOpt,
      baseOffsetWidth,
      requestUrl,
      appendColumns,
      onTransformColumns,
      onTransformData,
    } = { ...getBaseOption<TData>(), ...(downloadTable ? localHookOption : saveXlxsOption) }


    const tmpQueryParams = downloadTable ? saveXlxsOption.queryParams || {} : localHookOption.queryParams || {}

    if (tmpQueryParams.hasOwnProperty('data')) {
      tmpQueryParams['data'] = judgeWord(tmpQueryParams['data'])
    }

    const tmpRequestOption = deepmerge2<any>(
      {
        page: {
          current: tdata.current,
          size: tdata.size,
        },
      },
      tmpQueryParams
    )
    !downloadTable && (tdata.loading = true)

    try {
      let { result, columns } = await service(tmpRequestOption, requestUrl, requestOpt)
      if (!downloadTable) {

        onTransformData && onTransformData(result.records)
        tdata.tableData = result.records

        currentSelectedRecord.value = tdata.tableData[0]

        if (columns) {
          // 对整个columns的元素设置常用属性的初始值
          columns = columns.map(v => {
            v.minWidth = v.title
              ? textSize(v.title).width + baseOffsetWidth + ''
              : ''

            v.fixed = false
            v.checked = true

            const tmpColumn = customColumns.find(
              column => column.name === v.name
            )
            return tmpColumn
              ? {
                ...v,
                ...tmpColumn,
              }
              : v
          })

          columns.forEach(v => {
            const r = v.notes?.match(/[A-Z](_*[A-Z]*)+[A-Z]/g) // 匹配字典的名称
            if (r) {
              v.dictName = r[r.length - 1]
              v.component = 'select'
              v.trigger = 'change'
              v.message = `请选择${v.title}`
            } else {
              v.dictName = (v.name as string).toUpperCase() // 转成大写字符串
            }

            // 设置字典表中存在字段的selectOption
            v.selectOption = useGlobal.dicts[v.dictName as string] || []
          })

          /**
           * 以下从第1步到第4步，生成的是页面中展示的table字段
           */

          // 1、首先过滤不需要出现在页面中的table字段
          let columns2 = columns.filter(v => !v.hidden)

          // 2、新增加的列
          appendColumns && (columns2 = columns2.concat(appendColumns))

          // 3、初始的列的名称组成的数组
          const column2Names = columns2.map(v => v.name)

          // 4、重新排序并过滤需要忽略的列
          const orderedColumnNames = Array.from(
            new Set([...expectOrderColumnNames, ...column2Names])
          )
          expectOmitedColumnNames.forEach(columnName => {
            if (expectPickedColumnNames.indexOf(columnName) === -1) {
              const tmpIndex = orderedColumnNames.indexOf(columnName)
              if (tmpIndex > -1) {
                orderedColumnNames.splice(tmpIndex, 1)
              }
            }
          })

          // 生成排序并过滤过的 列的对象数组
          const orderedColumns = orderedColumnNames
            .map<ResultColumnsData<keyof TData> | undefined>(columnName => {
              return columns2.find(column => column.name === columnName)
            })
            .filter(v => v) as ResultColumnsData<keyof TData>[]

          tdata.columns = columns

          onTransformColumns && onTransformColumns(orderedColumns)
          tdata.tableColumns = orderedColumns
        }

        onTransformColumns && columns && onTransformColumns(columns)
      }
    } catch (err) {
      console.error(err)
    } finally {
      tdata.loading = false
    }
  }

  const onCurrentSelectRecord = (row: TData) => {
    currentSelectedRecord.value = row
  }

  watch([() => tdata.current, () => tdata.size], () => {
    fetchTableList({
      queryParams: localHookOption.queryParams ,
    })
  })

  const { onSetTableHeight } = option
  if (onSetTableHeight) {
    
    onMounted(() => {
      nextTick(() => {
        onSetTableHeight(tableRef.value)
      })
    })
    const clearUp = useEventListener('resize', onSetTableHeight)
    
    onUnmounted(() => {
      clearUp()
    })
  }

  /**
   * 生成分页列表的序号
   * table的第一条数据的index是从0开始的，所以index要加上1
   * @param index scope.$index
   */
  const onTableIndex = (index: number) =>
    index + 1 + (tdata.current - 1) * tdata.size

  // 当不是懒加载的时候
  if (!initialOption.lazy) {
    onMounted(fetchTableList)
  }

  /**
   * 当el-table是selection的时候，判断当前行是否可选
   * @param row 行
   * @param index
   * @param callback
   * @example
   * 在type=selection的列上，添加属性
   * :selectable="(row,index)=>onDecideIfCanSelect(row,index,callback)"
   * 其中的callback为传递的回调函数
   */
  const onDecideThisRowCanSelect = <T>(
    row: T,
    index: number,
    callback: (row: T, index: number) => boolean
  ) => callback(row, index)


  /**
   * 当选择项发生变化时
   * @param _selection
   * @example
   * \@selection-change="onSelectChange"
   */
  const onSelectChange = <T>(_selection: T) => {
    const data: any[] = // @ts-ignore
      (tableRef.value?.tableRef2 || tableRef.value).getSelectionRows()
    if (data.length > 0) tdata.hasSelectedRow = true
    else tdata.hasSelectedRow = false
  }

  /**
   * 当用户手动勾选全选 Checkbox 时
   * @param selection
   * @example
   * \@select-all="onSelectAll"
   */
  const onSelectAll = <T extends any[]>(selection: T) => {
    if (selection.length > 0) tdata.hasSelectedRow = true
    else tdata.hasSelectedRow = false
  }

  /**
   * 获取全部已选择的行
   */
  const onGetAllSelectedRows = () => {
    tdata.allSelectedData =
      // @ts-ignore
      (
        tableRef.value?.tableRef2 || tableRef.value
      ).getSelectionRows() as UnwrapRefSimple<Struct>[]
  }

  // 用于导出excel表格
  const { downloadExcel } = useDownload()

  
  /**
   * 导出excel表格
   * @param fileName 文件的名称（可以带后缀名，也可以不带）
   */
  const onExportTable = async (
    fileName: string,
    obj = {
      data: {},
    }
  ) => {
    onGetAllSelectedRows()
    let tmpData: Recordable[] = []
    tdata.loading = true
    if (tdata.allSelectedData.length === 0) {
      // 表示完全下载
      await fetchTableList(
        {
          queryParams: Object.assign(
            {
              page: {
                current: 1,
                size: tdata.total,
              },
            },
            obj
          ),
        },
        {
          isDownloadXlsx: true,
        }
      )
      tmpData = cloneDeep(tdata.allExcelData) as Recordable[]
    } else {
      // 表示选中下载
      tmpData = tdata.allSelectedData as Recordable[]
    }

    tmpData.forEach(row => {
      tdata.tableColumns.forEach(col => {
        row[col.name] = onDecodeDict(row, col.name, col.dictName)
      })
    })

    downloadExcel(tmpData, tdata.tableColumns, fileName, () => {
      tdata.loading = false
    })
  }
}