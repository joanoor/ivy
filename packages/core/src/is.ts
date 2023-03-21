import { default as isMyPromise } from 'is-promise'
import { isUndefined, isNull } from 'lodash-es'
import { getTypeOfValue } from './utils'

export {
  isString,
  isNumber,
  isArray,
  isBoolean,
  isDate,
  isRegExp,
  isUndefined,
  isNull,
  isPlainObject,
  isElement,
  isFunction,
  isEmpty,
  isMap,
  isWeakMap,
  isWeakSet,
} from 'lodash-es'

export const isWindow = (val: unknown): val is Window =>
  typeof window !== 'undefined' && getTypeOfValue(val) === 'window'

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isUrl = (path: string): boolean => {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export const isNullOrUnDef = (val: unknown): val is null | undefined =>
  isUndefined(val) || isNull(val)

export const isPromise = <T = any>(val: any): val is Promise<T> =>
  isMyPromise(val)

export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}
