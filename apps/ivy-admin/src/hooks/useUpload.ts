import { ElMessage, ElMessageBox, UploadFile } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadInstance } from 'element-plus'
import { http } from '@/utils/http'

const checkFileType = (rawFile: UploadFile) => {
  const file = rawFile.raw
  if (file) {
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      ElMessage.error('请上传小于10M的文件')
      return false
    }
    const type = file?.type
    console.log('type=====>', type)
    if (
      !type?.includes('image') &&
      !type?.includes('pdf') &&
      !type?.includes('word') &&
      !type?.includes('excel') &&
      !type?.includes('vnd.openxmlformats-officedocument') &&
      !file.name.includes('rar') &&
      !file.name.includes('zip')
    ) {
      ElMessage.error('仅支持上传图片、pdf、word、excel、压缩包文件类型')
      return false
    }
    return true
  }
  return false
}

export default function (callback?: Fn<string>) {
  const uploadRef = ref<UploadInstance>()
  const data = reactive({
    fileList: [] as unknown as UploadUserFile[],
    jsonExcel: [] as Recordable[],
    base64URLs: [] as string[],
    formData: new FormData(),
    acceptType:
      '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP,.pdf,.xls,.xlsx,.doc,.docx,.rar,.zip',
  })

  const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log('删除文件', file, uploadFiles)
    const index = data.base64URLs.findIndex(v => v.includes(file.name))
    data.base64URLs.splice(index, 1)
    console.log('data.base64URLs', data.base64URLs)
  }

  const handlePreview: UploadProps['onPreview'] = uploadFile => {
    console.log('预览文件', uploadFile)
  }

  const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
      `The limit is 3, you selected ${
        files.length
      } files this time, add up to ${files.length + uploadFiles.length} totally`
    )
  }

  const beforeRemove: UploadProps['beforeRemove'] = (
    uploadFile,
    uploadFiles
  ) => {
    return ElMessageBox.confirm(
      `Cancel the transfert of ${uploadFile.name} ?`
    ).then(
      () => true,
      () => false
    )
  }

  const onChange = async (rawFile: UploadFile, uploadFiles) => {
    if (!checkFileType(rawFile)) return
    // @ts-ignore
    data.formData.append('files', rawFile.raw)
    data.fileList = uploadFiles
  }

  const upLoadFiles = (url: string, callback?: (fd: FormData) => void) => {
    // console.log('所以此时的data.files', data.files)
    callback && callback(data.formData)
    return http.post({
      url,
      data: data.formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  return {
    ...toRefs(data),
    uploadRef,
    handleRemove,
    handlePreview,
    handleExceed,
    beforeRemove,
    onChange,
    upLoadFiles,
  }
}
