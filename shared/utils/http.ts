import { checkStatus, createAxios } from '@ivy/request'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
import { Result } from '../types/request'
import { useErrorLogStoreWithOut } from '../store'
import { Persistent } from './cache/persistent'

export const http = createAxios({
  baseURL:
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_BASEAPI_DEV
      : import.meta.env.VITE_APP_BASEAPI_PROD,
  timeout: 15000,
  transform: {
    // 接口正常返回数据的时候，若是需要对返回数据进行处理，则执行以下方法
    transformRequestHook(response, options) {
      const { isTransformResponse, isReturnNativeResponse } = options

      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (isReturnNativeResponse) return response

      // 是否不进行任何处理，直接返回
      if (!isTransformResponse) return response.data

      if (!response.data) throw new Error('请求出错，请稍后重试')

      const result = response.data as unknown as Result
      const { code, message } = result
      const hasSuccess = [200, '200', 0, '0'].indexOf(code) > -1
      if (hasSuccess) return result ?? ''
      else {
        const errMessage = checkStatus(code, message)
        ElMessage.error(errMessage)
        throw new Error(
          `The network request returns a data error-->${code}-->${errMessage}`
        )
      }
    },

    requestInterceptors: (config, options) => {
      // const token = store.get('AUTH_TOKEN')
      const token = Persistent.getLocal('__TOKEN__')
      if (
        token &&
        (config as Recordable)?.requestOptions?.withToken !== false
      ) {
        ;(config as Recordable).headers['Authorization'] =
          options.authenticationScheme
            ? `${options.authenticationScheme} ${token}`
            : token
      }

      return config
    },

    // 响应错误拦截，拦截的是网络错误
    responseInterceptorsCatch: (_instance, err) => {
      const errorLogStore = useErrorLogStoreWithOut()
      errorLogStore.addAjaxErrorInfo(err)
      // @ts-ignore
      const errorMessage = err.message ?? (err.response?.data as any)?.message
      ElMessage.error(errorMessage)
      return Promise.reject(err)
    },
  },
  requestOptions: {
    isTransformResponse: true,
  },
})
