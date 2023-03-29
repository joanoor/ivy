/**
 * 带分页的列表
 */

import { UnwrapRef } from 'vue'
import { cloneDeep, textSize } from '@ivy/core'
import type { RequestOptions } from '@ivy/request'
import { useGlobalStore } from '@/store'
import type { Result, ResultColumnsData, ResultPagingData } from '@/types'
import { useEventListener, useElementBounding } from '@vueuse/core'
import SelectionTable from '@/components/Table/SelectionTable.vue'
import deepmerge from 'deepmerge'
import useDownload from './useDownload'
import useDecodeDict from '@/hooks/web/useDecodeDict'
import { judgeWord } from '@/utils/index'

/**
 * 通过类型谓词转换指定变量的类型
 * @param val 需要转换的变量
 */
// @ts-ignore
export function assertType<T>(val: any): val is T {
  return true
}

/**
 * 获取接口返回数据的records类型
 */
export type GenStruct<T extends AnyFunction> = ReturnType<T> extends Promise<
  Result<ResultPagingData<infer F>, ResultColumnsData[]>
>
  ? F
  : never

// 拿到字典，用于设置列的selectOption字段
const useGlobal = useGlobalStore()
const { onDecodeDict } = useDecodeDict()

type Data = {
  loading: boolean // 是否loading
  tableHeight: number
  columns: ResultColumnsData[] // 接口返回中的columns数据，原始的未经过过滤的列
  tableColumns: ResultColumnsData[] // 也是columns数据，只是有的时候页面中的table的某些列不需要显示，这里通过tableColumns来保存处理后显示的列
  total: number // 总数
  size: number // pageSize
  current: number // currentPage
  keywords: string // 关键词（暂时没有用到）
}

interface HookOption<U> {
  queryParams?: U // 调用hooks时传递的参数
  requestUrl?: string // 不同接口的baseUrl
  expectOrderColumnNames?: string[] // 期待的列的排序
  expectPickedColumnNames?: string[] // 期待存在的列
  expectOmitedColumnNames?: string[] // 期待忽略的列
  appendColumns?: ResultColumnsData[] // 新增加的自定义列，比如“操作”
  customColumns?: ResultColumnsData[] // 自定义列，不会影响上面的appendColumns
  lazy?: boolean // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
  mustPaging?: boolean // 是否开启监听分页变化
  opt?: RequestOptions // RequestOptions类型的选项
  baseOffsetWidth?: number // 基础的列宽
  transform?: <T>(data: T) => void
}

interface FetchTableOpt {
  isDownloadXlsx?: boolean // 是否是下载excel的情况，因为下载excel的时候，要求不影响分页列表
  deepmerge2?: boolean // 是否需要深度合并
}

const baseOption = {
  expectOrderColumnNames: [] as string[],
  expectPickedColumnNames: [] as string[],
  expectOmitedColumnNames: [] as string[],
  appendColumns: [] as ResultColumnsData[],
  customColumns: [] as ResultColumnsData[],
  lazy: false,
  mustPaging: true,
  opt: {} as RequestOptions,
  baseOffsetWidth: 80,
}

/**
 * 获取tableData数据以及与此相关的数据
 * @param requestPromiseFunc 请求接口的方法
 * @param option HookOption类型的配置
 */
export default function <
  Struct, // 列表接口返回的Record数据类型
  QueryParams extends Recordable = Recordable // 请求参数
>(
  requestPromiseFunc: (
    data: QueryParams,
    requestUrl?: string,
    opt?: RequestOptions
  ) => Promise<Result<ResultPagingData<Struct>>>,
  option: HookOption<QueryParams> = {}
) {
  const initialOption = {
    ...baseOption,
    ...option,
  }

  let localHookOption: HookOption<QueryParams> = {
    ...initialOption,
  } // 用于保存传递的请求参数
  const current2 = initialOption.queryParams?.page?.current || 1
  const size2 = initialOption.queryParams?.page?.size || 10

  const tableRef = ref<HTMLElement | InstanceType<typeof SelectionTable>>()

  const tdata = reactive({
    loading: false, // 是否loading
    tableHeight: 500,
    columns: [] as ResultColumnsData[],
    tableColumns: [] as ResultColumnsData[],
    total: 0,
    current: current2,
    size: size2,
    keywords: '', // 关键词（暂时没有用到）
    tableData: [] as Struct[],
    allSelectedData: [] as Struct[],
    allExcelData: [] as Struct[],
    currentSelectedRecord: {} as Struct,
    hasSelectedRow: false, // selection模式下，是否选择了行（true表示选择了，false表示没有选择）
  })

  /**
   * @param hookQueryOption
   * @param opt2
   */
  const fetchTableList = async <
    Struct2 = Struct,
    QueryParams2 extends Recordable = Recordable
  >(
    hookQueryOption = {} as HookOption<QueryParams2>,
    opt2: FetchTableOpt = { isDownloadXlsx: false, deepmerge2: true }
  ) => {
    assertType<
      Data & {
        tableData: UnwrapRef<Struct2[]>
        allSelectedData: UnwrapRef<Struct2[]>
        allExcelData: UnwrapRef<Struct2[]>
        currentSelectedRecord: UnwrapRef<Struct2>
      }
    >(tdata)

    const { isDownloadXlsx, deepmerge2 } = opt2

    const initialOption2: Recordable = {
      ...hookQueryOption,
    }

    let saveXlxsOption: HookOption<QueryParams> = {}

    if (!isDownloadXlsx) {
      // 不是下载excel的情况
      deepmerge2
        ? (localHookOption = deepmerge(localHookOption, initialOption2))
        : (localHookOption = {
            ...localHookOption,
            ...initialOption2,
          })
    } else {
      // 当属于下载excel的情况
      saveXlxsOption = deepmerge(initialOption, initialOption2)
    }

    const {
      expectOrderColumnNames,
      expectPickedColumnNames,
      expectOmitedColumnNames,
      customColumns,
      opt,
      baseOffsetWidth,
      requestUrl,
      appendColumns,
      transform,
    } = {
      ...baseOption,
      ...(!isDownloadXlsx ? localHookOption : saveXlxsOption),
    }

    const tmpQueryParams = isDownloadXlsx
      ? saveXlxsOption.queryParams || {}
      : localHookOption.queryParams || {}

    if (tmpQueryParams.hasOwnProperty('data')) {
      tmpQueryParams['data'] = judgeWord(tmpQueryParams['data'])
    }

    const requestOpt = deepmerge<any>(
      {
        page: {
          current: tdata.current,
          size: tdata.size,
        },
      },
      tmpQueryParams
    )
    !isDownloadXlsx && (tdata.loading = true)

    try {
      let {
        result,
        columns,
      }: { result: ResultPagingData<Struct2>; columns: ResultColumnsData[] } =
        (await requestPromiseFunc(requestOpt, requestUrl, {
          ...opt, // RequestOptions
        })) as unknown as {
          result: ResultPagingData<Struct2>
          columns: ResultColumnsData[]
        }

      if (!isDownloadXlsx) {
        // @ts-ignore
        tdata.tableData = result.records as UnwrapRef<Struct2[]>

        // 当前选中的记录（默认选中table表格的第一行）
        // @ts-ignore
        tdata.currentSelectedRecord = tdata.tableData[0] as UnwrapRef<Struct2>

        /*****************************************************************************/

        if (columns) {
          // 对整个columns的元素设置常用属性的初始值
          columns = columns.map(v => {
            v.minWidth = v.title
              ? textSize(v.title).width + baseOffsetWidth + ''
              : ''

            v.fixed = false

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
              v.dictName = v.name.toUpperCase() // 转成大写字符串
            }

            // 设置字典表中存在字段的selectOption
            v.selectOption = useGlobal.dicts[v.dictName] || []
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
            .map<ResultColumnsData | undefined>(columnName => {
              return columns2.find(column => column.name === columnName)
            })
            .filter(v => v) as ResultColumnsData[]

          tdata.columns = columns
          tdata.tableColumns = orderedColumns
        }

        tdata.total = result.total

        transform && transform(tdata)
        // tdata.size = result.size
        // tdata.current = result.current
      } else {
        // @ts-ignore
        tdata.allExcelData = result.records as UnwrapRef<Struct2[]>
      }
    } catch (err) {
      console.error(err)
    } finally {
      tdata.loading = false
    }
  }

  /**
   * 修改当前选中的行
   * @param row
   */
  const onCurrentSelectRecord = <T>(row: T) => {
    assertType<
      Data & {
        tableData: T[]
        allSelectedData: T[]
        allExcelData: T[]
        currentSelectedRecord: T
      }
    >(tdata)
    // @ts-ignore
    tdata.currentSelectedRecord = row
  }

  // 是否开启监听分页变化
  if (initialOption.mustPaging) {
    watch([() => tdata.current, () => tdata.size], () => {
      fetchTableList({
        queryParams: { ...(localHookOption.queryParams || {}) },
      })
    })
  }

  /**
   * 监听element-plus中table的高度的变化
   * 当离开页面的时候销毁监听
   */
  const setTableHeight = () => {
    const { top } = useElementBounding(
      // @ts-ignore
      tableRef.value?.tableRef2 || tableRef.value // 因为可能对el-table进行再一次的封装，所以是tableRef.value?.tableRef2
    )
    /**
     *  上面返回的top等属性是相对于页面视图左上角来计算的
     *  32是分页组件的高度，3个20分别表示table与分页的距离，分页距离页面边缘的padding距离，以及右侧的padding
     */
    tdata.tableHeight = window.innerHeight - top.value - (32 + 20 + 20 + 20)
  }
  onMounted(() => {
    nextTick(() => {
      setTableHeight()
    })
  })
  const clearUp = useEventListener('resize', setTableHeight)
  onUnmounted(() => {
    clearUp()
  })

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
  const onDecideIfCanSelect = <T>(
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

  return {
    tableRef,
    ...toRefs(tdata),
    fetchTableList, // 调用接口
    onCurrentSelectRecord, // 当编辑行数据的时候
    onTableIndex,
    onExportTable,
    onDecideIfCanSelect,
    onSelectChange,
    onSelectAll,
    onGetAllSelectedRows,
  }
}
