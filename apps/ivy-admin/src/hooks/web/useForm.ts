/**
 * 与表单相关的操作
 */

import {
  BaseStruct,
  cloneDeep,
  generateFormAndRules,
  isString,
  _console,
  strRandom,
} from '@ivy/core'
import type { RuleItem } from 'async-validator'
import {
  ref,
  reactive,
  toRefs,
  Ref,
  nextTick,
  watchEffect,
  UnwrapRef,
} from 'vue'
import { FormInstance } from 'element-plus'
import { createFormAndRule } from '@/libs/formAndRules/records'
import { ResultColumnsData } from '@/api/model'
import type { DictionaryStruct, FormPropRule } from '@/libs/shared/types'
import { generateDictionary } from './useDecodeDict'
import {
  submitForm,
  resetFormFields,
  Callback,
  ResetCallBack,
} from '@/libs/formAndRules/form'

interface RuleItemExtend extends RuleItem {
  trigger: string
}

// 拿到字典，通过字典获取select选项的值

interface HookOption {
  expectOrderPropNames?: string[] // 期待的表单字段排序
  expectOmitedColumnNames?: string[] // 期待忽略的column字段
  expectPickedColumnNames?: string[] // 期待存在的表单字段
  customDictionary?: Record<string, DictionaryStruct[]> // 用户自定义的字典（当接口没有返回的时候，自定义的字典，用于select选项）
  resetFormFunc?: ResetCallBack
  submitFormFunc?: Callback
}

/**
 * 通过传入接口返回的columns，或者用户自己传入的字符串数组，来生成展示的表单字段
 * 可能存在的主要问题：
 * 1、接口返回的字段有一些是我们不需要的
 * 解决方法：通过字段hidden和传入自定义expectOmitedPropNames或expectPickedPropNames字段来进行过滤
 * 2、页面展示的表单字段和实际提交时的表单字段不一致。（因为页面form表单是自动生成的，所以存在此问题，）
 * 解决方法：先生成我们提交表单时的表单结构字段，然后再通过hidden和传入自定义expectOmitedPropNames或expectPickedPropNames来生成页面展示的字段列表
 * @param myFormProps 表单字段名称组成的字符串数组
 * @param columns 由接口返回
 * @param option
 * @returns
 */
export default function <FormStruct>(
  myFormProps: (FormPropRule<string> | string)[],
  columns?: Ref<ResultColumnsData[]>,
  option: HookOption = {}
) {
  const initialHookOption = {
    expectOrderPropNames: [] as [],
    expectOmitedColumnNames: [] as string[],
    expectPickedColumnNames: [] as string[],
    customDictionary: {} as Record<string, DictionaryStruct[]>,
    ...option,
  }

  const {
    expectOrderPropNames,
    expectOmitedColumnNames,
    expectPickedColumnNames,
    customDictionary,
    resetFormFunc,
    submitFormFunc,
  } = initialHookOption

  const dictionary = generateDictionary(customDictionary)

  // 将用户传入的myFormProps转成FormPropRule[]类型
  const myHandledFormProps = myFormProps.map(v => {
    if (isString(v)) {
      return {
        name: v,
      }
    } else {
      return v
    }
  })

  // 获取表单的全部字段
  const myFormPropNames = myHandledFormProps.map(v => v.name)

  // 获取需要校验的表单字段名称组成的数组
  const expectRequiredPropNames = myHandledFormProps
    .filter(v => v.required)
    .map(v => v.name)

  // 表单涉及的数据
  const formRef = ref<FormInstance>() as Ref<FormInstance> // 表单ref
  const data = reactive({
    form: {} as FormStruct,
    rules: {} as Recordable,
    formColumns: [] as ResultColumnsData[], // 由于接口返回的columns和表单要展示的字段不完全一致，所以这里定义了新的变量formColumns用于保存页面中form要展示的字段
    originalForm: {} as FormStruct, // 保存原始的form表单，用于重置数据
  })

  let attaches: BaseStruct<string, boolean>[] = []
  let pageShowFormColumnNames: string[] = []
  let pageOmitedFormColumnNames: string[] = []
  const uniqIds: string[] = []
  if (columns) {
    // 接口返回列表，自动生成表单结构和校验规则
    const unwatch = watchEffect(() => {
      // 若接口没有返回值，则直接返回
      if (columns.value.length === 0) return

      /**
       * 以下从第1步到第4步，生成的是页面中展示的表单字段（跟提交时的表单字段可能会有区别：比如id字段，不需要在页面中出现，但是编辑提交时需要带上）
       */

      // 1、重新排序并过滤不需要出现在页面中的form字段
      const orderedColumnNames = Array.from(
        new Set([...expectOrderPropNames, ...myFormPropNames])
      )

      expectOmitedColumnNames.forEach(columnName => {
        if (expectPickedColumnNames.indexOf(columnName) === -1) {
          const tmpIndex = orderedColumnNames.indexOf(columnName)
          if (tmpIndex > -1) {
            orderedColumnNames.splice(tmpIndex, 1)
          }
        }
      })

      // 2、生成表单字段的对象数组(ResultColumnsData[]类型)
      const orderedColumns = orderedColumnNames
        .map<ResultColumnsData | undefined>(columnName => {
          return columns.value.find(column => column.name === columnName)
        })
        .filter(v => v) as ResultColumnsData[]

      // 3、设置表单字段的trigger、selectOption、message、component属性
      orderedColumns.forEach(column => {
        const tmp = myHandledFormProps.filter(v => v.name === column.name)[0]
        if (tmp) {
          if (!column.trigger) {
            // 不存在column.trigger，说明不是接口返回的字典字段(因为如果是接口返回装字典，会在useQueryTable中进行设置)
            column.trigger = tmp.trigger || 'blur'

            // 设置字典
            const tmpDictName = tmp.dictName || column.dictName || ''
            column.selectOption = dictionary[tmpDictName] ?? []

            column.message = tmp.message || `请输入${column.title}`
            column.component = tmp.component || 'input'
          } else {
            // 若已经存在column.trigger，说明接口返回时已经确定的，是字典字段。属于select类型，trigger为change（已经生成了上面的这些设置，所以这个else分支里，无须进行配置）
            _console.success(`${column.name}存在默认的trigger`)
          }
        }
      })

      // 4、赋值给表示页面展示的表单字段的变量
      data.formColumns = orderedColumns

      // 获取最终在页面展示的表单字段字符串数组
      pageShowFormColumnNames = orderedColumns.map(v => v.name)

      // 那么不在页面中展示的表单字段就是最终被忽略的字段（不能直接使用expectOmitedColumnNames，因为还有expectPickedColumnNames的存在）
      pageOmitedFormColumnNames = myFormPropNames.filter(
        v => pageShowFormColumnNames.indexOf(v) === -1
      )

      // 用于生成表单和校验规则

      attaches = columns.value
        .filter(v => myFormPropNames.indexOf(v.name) > -1)
        .map(column => {
          let validatorObj: RuleItemExtend = {} as RuleItemExtend
          if (expectRequiredPropNames.some(v => v === column.name)) {
            if (column.validator) {
              validatorObj = {
                trigger: column.trigger ?? 'blur',
                validator: column.validator,
              }
            }
          }
          const uniqId = strRandom()
          uniqIds.push(uniqId)
          return {
            label: column.name,
            default: column.default || '',
            required: expectRequiredPropNames.some(v => v === column.name),
            rule: [
              {
                required: expectRequiredPropNames.some(v => v === column.name),
                message: column.message ?? '',
                trigger: column.trigger ?? 'blur',
              },
              validatorObj,
            ] as RuleItemExtend[],
            id: uniqId,
          }
        })

      // 生成最终的表单和校验规则
      const [_form, _rules] = generateFormAndRules(
        [...myFormPropNames],
        createFormAndRule([...attaches]),
        uniqIds
      )
      data.originalForm = cloneDeep(_form) as UnwrapRef<FormStruct>
      data.form = _form as UnwrapRef<FormStruct>
      data.rules = _rules
      // 取消监听
      unwatch()
    })
  } else {
    // 用于生成表单和校验规则
    attaches = myHandledFormProps.map(myProp => {
      let validatorObj: RuleItemExtend = {} as RuleItemExtend
      if (expectRequiredPropNames.some(v => v === myProp.name)) {
        if (myProp.validator) {
          validatorObj = {
            trigger: myProp.trigger ?? 'blur',
            validator: myProp.validator,
          }
        }
      }
      const uniqId = strRandom()
      uniqIds.push(uniqId)
      return {
        label: myProp.name,
        default: myProp.default || '',
        required: expectRequiredPropNames.some(v => v === myProp.name),
        rule: [
          {
            required: expectRequiredPropNames.some(v => v === myProp.name),
            message: myProp.message ?? '',
            trigger: myProp.trigger ?? 'blur',
          },
          validatorObj,
        ] as RuleItemExtend[],
        id: uniqId,
      }
    })
    const [_form, _rules] = generateFormAndRules(
      [...myFormPropNames],
      createFormAndRule([...attaches]),
      uniqIds
    )
    data.originalForm = cloneDeep(_form) as UnwrapRef<FormStruct>
    data.form = _form as UnwrapRef<FormStruct>
    data.rules = _rules
  }

  // 初始化表单
  const onInitialForm = () => {
    // 因为重置表单只能重置页面中展示的字段，而不在页面中展示的字段，没有办法通过resetFields来重置，所以这里人工设置一下
    // pageOmitedFormColumnNames.forEach(v => {
    //   const t = attaches.find(v2 => v2.label === v)
    //   ;(data.form as Recordable)[v] = t ? t.default : ''
    // })
    data.form = cloneDeep(data.originalForm)
  }

  // 回显表单数据
  const onEchoForm = (obj: Recordable) => {
    // 保存编辑表单需要传入id
    nextTick(() => {
      // 必须要放在nextTick中执行，否则如果一开始就会给表单赋初值，当重置表单的时候就不对了
      for (const prop of Object.keys(data.form as Recordable)) {
        ; (data.form as Recordable)[prop] = obj[prop]
      }
    })
  }

  // 重置表单
  const onResetForm = (callback?: ResetCallBack) => {
    const handleResetForm = !callback
      ? resetFormFields(resetFormFunc)
      : resetFormFields(callback)
    handleResetForm && handleResetForm(formRef.value)
  }

  // 提交表单
  const onSubmitForm = (callback?: Callback) => {
    const handleSubmitForm = !callback
      ? submitFormFunc && submitForm(submitFormFunc)
      : submitForm(callback)
    handleSubmitForm && handleSubmitForm(formRef.value)
  }

  return {
    ...toRefs(data),
    formRef,
    onInitialForm, // 初始化表单数据
    onEchoForm, // 回显表单数据
    onResetForm, // 重置表单
    onSubmitForm, // 提交表单
  }
}

/**
 * 此方法用于生成表单类型推断
 * @param configs 
 * @example
   import useForm, { defineFormTypes } from '@/hooks/web/useForm'
   const searchFormProps = defineFormTypes(['companyName', 'address'])
   const { form: searchForm, formRef: searchFormRef } = useForm<
     {
       [P in typeof searchFormProps[number] as P extends string ? P : never]:any
     } & { [x: string]: any }
   >(searchFormProps)
 */
export function defineFormTypes<T extends string>(
  configs: (FormPropRule<T> | T)[]
) {
  return configs
}
