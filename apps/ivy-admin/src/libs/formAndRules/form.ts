import type { ElForm } from 'element-plus'
import type { ValidateFieldsError } from 'async-validator'

export type FormInstance = InstanceType<typeof ElForm>
export type Callback = (
  isValid?: boolean,
  invalidFields?: ValidateFieldsError
) => void

export type ResetCallBack = (...args: any[]) => void

export const submitForm =
  (func: Callback) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(func)
  }

export const resetFormFields =
  (func?: ResetCallBack) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    if (func) func()
    formEl.resetFields()
  }
