/**
 * 通过el-upload上传文件
 */

import { UploadFile } from 'element-plus'
import { read, WorkBook } from 'xlsx'

/**
 * 将上传的excel文件转换成json
 * @param rawFile
 * @param callback
 */
export const convertExcelToJson = (
  rawFile: UploadFile,
  callback: (data: WorkBook) => void
) => {
  const fileReader = new FileReader()
  fileReader.readAsBinaryString(rawFile.raw as Blob)
  fileReader.onload = async ev => {
    const blobData = ev?.target?.result
    const workbook = read(blobData, {
      type: 'binary',
    })
    callback(workbook)
  }
}
