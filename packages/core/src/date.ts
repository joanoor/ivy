/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import { default as dateUtil } from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date?: dateUtil.ConfigType,
  format = DATE_TIME_FORMAT
): string {
  return dateUtil(date).format(format)
}

export function formatToDate(
  date?: dateUtil.ConfigType,
  format = DATE_FORMAT
): string {
  return dateUtil(date).format(format)
}

export const dayjs = dateUtil
