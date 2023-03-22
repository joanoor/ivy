import { openWindow } from '@ivy/core'
import { convertDataURLtoBlob, convertUrlToBase64 } from './convertFile'
import { utils, WorkBook, write } from 'xlsx'

// 将字符串转ArrayBuffer
function s2ab(s: any) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

function workbook2blob(workbook: WorkBook) {
  const wbout = write(workbook, {
    // 要生成的文件类型
    bookType: 'xlsx',
    // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary',
  })

  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  })
  return blob
}

function download(blob: string, fileName: string) {
  const aLink = document.createElement('a')
  aLink.href = blob
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || ''
  let event
  if (window.MouseEvent) event = new MouseEvent('click')
  //   移动端
  else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
}

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  convertUrlToBase64(url).then(base64 => {
    downloadByBase64(base64, filename, mime, bom)
  })
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const base64Buf = convertDataURLtoBlob(buf)
  downloadByData(base64Buf, filename, mime, bom)
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  const blobURL = window.URL.createObjectURL(blob)
  download(blobURL, filename)
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: TargetContext
  fileName?: string
}): boolean {
  const isChrome =
    window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  const isSafari =
    window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined) {
      link.download =
        fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download'
  }

  openWindow(url, { target })
  return true
}

/**
 * 通过blob下载文件
 * @param ablob
 * @param fileName
 * @param callback
 */
export function downloadByBlob(ablob: any, fileName: string) {
  let blob = ''
  if (typeof ablob == 'object' && ablob instanceof Blob) {
    blob = URL.createObjectURL(ablob) // 创建blob地址
  } else {
    return
  }
  download(blob, fileName)
}

/**
 * 通过后端返回的json数据来下载excel
 * @param data
 * @param option
 * @returns
 */
export function downloadByJson<T extends any[]>(
  data: T,
  option: {
    tableName: string
    transform?: (data: T) => T
  }
) {
  if (!data || data.length === 0) return
  const { tableName, transform } = option
  const data2 = transform ? transform(data) : data

  let sheet1 = utils.json_to_sheet(data2)
  const jsonSheet1 = JSON.stringify(sheet1)
  sheet1 = JSON.parse(jsonSheet1)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, sheet1, 'sheet1')
  const workbookBlob = workbook2blob(wb)
  let fileName = `${tableName}.xlsx`
  if (tableName.includes('.')) {
    fileName = fileName.split('.')[0] + '.xlsx'
  }

  downloadByBlob(workbookBlob, fileName)
}
