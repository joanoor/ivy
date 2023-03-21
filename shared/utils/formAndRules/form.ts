import type { ElForm } from 'element-plus'
import type { ValidateFieldsError } from '@ivy/form'

export type FormInstance = InstanceType<typeof ElForm>
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

export const resetFormFields =
  (callback?: ResetCallBack) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    if (callback) callback()
    formEl.resetFields()
  }
