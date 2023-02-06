/**
 * 不带分页的列表
 */

import { reactive, toRefs, UnwrapRef, onMounted, watch, ref, Ref } from 'vue'
import type { RequestOptions } from '@ivy/request'
import { textSize } from '@ivy/core'
import { useGlobalStore } from '@/store'
import type { Result, ResultColumnsData, ResultPagingData } from '@/api/types'
import type { BaseURLType } from '@/libs/types'
import { TableInstance } from 'element-plus'

// 拿到字典，去设置列的selectOption字段
const useGlobal = useGlobalStore()

interface HookOption<T, U> {
  baseUrl?: BaseURLType // 不同接口的baseUrl
  hookQueryParams?: U // 调用hooks时传递的参数
  expectOrderColumnNames?: string[] // 期待的列的排序
  expectPickedColumnNames?: string[] // 期待存在的列
  expectOmitedColumnNames?: string[] // 期待忽略的列
  appendColumns?: ResultColumnsData[] // 新增加的自定义列，比如“操作”
  customColumns?: ResultColumnsData[] // 自定义列，不会影响上面的appendColumns
  lazy?: boolean // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
  opt?: RequestOptions
  baseOffsetWidth?: number // 基础的列宽
}

/**
 * 获取tableData数据以及与此相关的数据
 * @param requestPromiseFunc 请求接口
 * @param option 配置
 */
export default function <
  Struct, // 数组table的对象类型
  QueryParams extends Recordable = Recordable // 请求参数
>(
  requestPromiseFunc: (
    data: QueryParams,
    baseUrl?: BaseURLType,
    opt?: RequestOptions
  ) => Promise<Result<ResultPagingData<Struct>>>,
  option: HookOption<Struct, QueryParams> = {}
) {
  const initialHookOption = {
    hookQueryParams: {} as QueryParams,
    expectOrderColumnNames: [] as string[], // 期待的列的排序
    expectPickedColumnNames: [] as string[], // 期待存在的列
    expectOmitedColumnNames: [] as string[], // 期待忽略的列
    appendColumns: [] as ResultColumnsData[],
    customColumns: [] as ResultColumnsData[], // 自定义列的信息，这里自定义的列不会影响上面的appendColumns
    lazy: false, // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
    opt: {} as RequestOptions,
    baseOffsetWidth: 80,
    ...option,
  }

  // 用于保存传递的请求参数
  let localQueryParams = { ...initialHookOption.hookQueryParams } as QueryParams

  const tableRef = ref<TableInstance>() as Ref<TableInstance>
  const tdata = reactive({
    loading: false, // 是否loading
    tableHeight: 500,
    tableData: [] as Struct[], // 列表数据
    columns: [] as ResultColumnsData[], // 接口返回中的columns数据，原始的未经过过滤的列
    tableColumns: [] as ResultColumnsData[], // 也是columns数据，只是有的时候页面中的table的某些列不需要显示，这里通过tableColumns来保存处理后显示的列
    keywords: '', // 关键词（暂时没有用到）
    currentSelectedRecord: {} as Struct, // 当前选中的record(默认是table的第一行)
  })

  const fetchTableList = async (
    hookQueryOption = {} as HookOption<Struct, QueryParams>,
    opt2: RequestOptions = {}
  ) => {
    tdata.loading = true
    const initialHookOption2 = {
      ...initialHookOption,
      ...hookQueryOption,
    }
    const {
      hookQueryParams,
      expectOrderColumnNames,
      expectPickedColumnNames,
      expectOmitedColumnNames,
      customColumns,
      opt,
      baseOffsetWidth,
      baseUrl,
      appendColumns,
    } = initialHookOption2

    localQueryParams = {
      ...localQueryParams,
      ...hookQueryParams,
    }

    try {
      let { result, columns } = await requestPromiseFunc(
        {
          ...hookQueryParams, // 调用hooks时候传递的参数
        },
        baseUrl,
        {
          ...opt, // 调用hooks时候传递的RequestOptions
          ...opt2, // 调用fetchTableList时传递的RequestOptions
        }
      )

      tdata.tableData = result.records as unknown as UnwrapRef<Struct[]>
      // 当前选中的记录（默认选中table表格的第一行）
      tdata.currentSelectedRecord = tdata
        .tableData[0] as unknown as UnwrapRef<Struct>

      if (columns) {
        // 对整个columns的元素设置常用属性的初始值
        columns = columns.map(v => {
          v.width = v.title
            ? textSize(v.title).width + baseOffsetWidth + ''
            : ''
          v.fixed = false

          const tmpColumn = customColumns.find(column => column.name === v.name)
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
          } else {
            v.dictName = v.name.toUpperCase() // 转成大写字符串
          }

          // 设置字典表中存在字段的selectOption
          v.selectOption = useGlobal.dicts[v.dictName]
          if (v.selectOption) {
            v.trigger = 'change'
            v.component = 'select'
            v.message = `请选择${v.title}`
          }
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
    } catch (err) {
      console.error(err)
    } finally {
      tdata.loading = false
    }
  }

  // 编辑行记录时
  const onCurrentSelectRecord = (row: Struct) => {
    tdata.currentSelectedRecord = row as UnwrapRef<Struct>
  }

  // 监听element-plus中table的高度的变化
  onMounted(() => {
    tdata.tableHeight = window.innerHeight - tableRef.value.$el.offsetTop - 85
    // 监听浏览器高度变化
    window.onresize = () => {
      tdata.tableHeight = window.innerHeight - tableRef.value.$el.offsetTop - 85
    }
  })

  // 当不是懒加载的时候
  if (!initialHookOption.lazy) {
    onMounted(fetchTableList)
  }

  return {
    tableRef,
    ...toRefs(tdata),
    fetchTableList, // 调用接口
    onCurrentSelectRecord, // 当编辑行数据的时候
  }
}
