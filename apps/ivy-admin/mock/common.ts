import type { MockMethod } from 'vite-plugin-mock'
import { FirstInfo, FirstListValue, Result } from '../src/api/model'
import { mock } from 'mockjs'


// 启动mock数据
export default [
  {
    url: '/api/login',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          name: 'xixi',
          token: 'bd593d99e47f4943adbeabb9b8ccc9f1',
          role: 'admin'
        },
      }
    },
  }
] as MockMethod[]
