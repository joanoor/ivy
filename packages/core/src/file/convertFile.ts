import { read, WorkBook } from 'xlsx'

/**
 * @description: base64 to blob
 */
export function dataUrl2Blob(base64Buf: string): Blob {
  const arr = base64Buf.split(',')
  const typeItem = arr[0]
  const mime = typeItem.match(/:(.*?);/)![1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * img url to base64
 * @param url
 */
export function imgUrl2Base64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>
    const ctx = canvas!.getContext('2d')

    const img = new Image()
    img.crossOrigin = ''
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject()
      }
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    }
    img.src = url
  })
}

/**
 * 将excel Blob文件转换成json
 * @param rawFile
 * @param callback
 */
export function excelBlob2Json(
  fileBlob: Blob,
  callback: (data: WorkBook) => void
) {
  const fileReader = new FileReader()
  fileReader.readAsBinaryString(fileBlob)
  fileReader.onload = async ev => {
    const blobData = ev?.target?.result
    const workbook = read(blobData, {
      type: 'binary',
    })
    callback(workbook)
  }
}
