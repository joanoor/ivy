import type { FormInstance } from 'element-plus'
import type { ValidateFieldsError } from '@ivy/form'

export type Callback = (
  isValid?: boolean,
  invalidFields?: ValidateFieldsError
) => void

export type ResetCallBack = (...args: any[]) => void

export const submitForm =
  (callback: Callback) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(callback)
  }

export const resetForm =
  (callback?: ResetCallBack) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    if (callback) callback()
    formEl.resetFields()
  }
