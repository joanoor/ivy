/**
 * **********************表单相关类型**********************
 */

export interface FormPropRule<T> {
  name: T // 表单字段标识符
  default?: any // 默认表单字段的初始值
  uniqId?: string // 重复表单的标识id，这个字段不能重复
  message?: string // 触发表单校验时的提示形式
  trigger?: 'blur' | 'change' // 触发方式
  dictName?: string // 字典表中的字段名称
  required?: boolean // 字段是否需要校验
  validator?: AnyFunction // 自定义校验函数
  component?: // 该属性对应的表单组件类型
  | 'checkbox'
    | 'input'
    | 'select'
    | 'date'
    | 'time'
    | 'number'
    | 'radio'
    | 'switch'
    | 'upload'
    | 'text'
    | 'inputselect'
}
