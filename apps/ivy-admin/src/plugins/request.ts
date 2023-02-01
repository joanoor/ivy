import { checkStatus, createAxios, ResultEnum } from '@ivy/request'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
import store from 'store2'
import { Result } from '@/api/model'

export const http = createAxios({
  baseURL:
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_BASEAPI_DEV
      : import.meta.env.VITE_APP_BASEAPI_PROD,
  timeout: 30000,
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
      const hasSuccess = [ResultEnum.SUCCESS, '200', 0, '0'].indexOf(code) > -1
      if (hasSuccess) return result ?? ''
      else {
        const [errMessage] = checkStatus(code, message)
        ElMessage.error(errMessage)
        throw new Error(
          `The network request returns a data error-->${code}-->${errMessage}`
        )
      }
    },

    // 请求 —— 统一拦截器
    requestInterceptors: (config, options) => {
      const token = store.get('AUTH_TOKEN')
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

    // 响应 —— http请求网络错误拦截器
    responseInterceptorsCatch: ({ response }) => {
      if (response?.status) {
        const [errorMessage] = checkStatus(
          response?.status,
          response?.data?.message
        )
        ElMessage.error(errorMessage)
        // 如果返回的不是Promise.reject，那么将会接着执行transformRequestHook中的代码；如果返回的是Promise.reject，那么将会执行requestCatchHook中的代码
        return Promise.reject(errorMessage)
      }
    },
  },
  requestOptions: {
    isTransformResponse: true,
  },
})
