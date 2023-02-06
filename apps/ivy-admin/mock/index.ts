import type { MockMethod } from 'vite-plugin-mock'
import { FirstInfo, FirstListValue, Result } from '../src/api/types'
import { mock } from 'mockjs'

// 初始数据
export const initTotalList: { records: FirstListValue[] } = {
  ...mock({
    'records|200': [
      {
        update: '@time(mm:ss)',
        value: '@float(3000,6000,2,2)',
      },
    ],
  }),
}

// 启动mock数据
export default [
  {
    url: '/api/login',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        result: {
          name: 'xixi',
        },
      }
    },
  },
  {
    url: '/api/totalpower',
    method: 'get',
    response: (): Result<FirstInfo, FirstListValue> => {
      return {
        code: 0,
        message: 'success',
        result: {
          ...mock({
            'records|10': [
              {
                update: '@time(mm:ss)',
                value: '@float(3000,6000,2,2)',
              },
            ],
          }),
          detail: {
            compare: mock('@integer(1500, 2000)'),
            count: mock('@float(20000,35000,2,2)'),
          },
        },
      }
    },
  },
  {
    url: '/api/totalwater',
    method: 'get',
    response: (): Result<FirstInfo, FirstListValue> => {
      return {
        code: 0,
        message: 'success',
        result: {
          ...mock({
            'records|10': [
              {
                update: '@time(mm:ss)',
                value: '@float(3000,6000,2,2)',
              },
            ],
          }),
          detail: {
            compare: mock('@integer(1500, 2000)'),
            count: mock('@float(20000,35000,2,2)'),
          },
        },
      }
    },
  },
  {
    url: '/api/totalgenpower',
    method: 'get',
    response: (): Result<FirstInfo, FirstListValue> => {
      return {
        code: 0,
        message: 'success',
        result: {
          ...mock({
            'records|10': [
              {
                update: '@time(mm:ss)',
                value: '@float(3000,6000,2,2)',
              },
            ],
          }),
          detail: {
            compare: mock('@integer(1500, 2000)'),
            count: mock('@float(20000,35000,2,2)'),
          },
        },
      }
    },
  },
  {
    url: '/api/totalemission',
    method: 'get',
    response: (): Result<FirstInfo, FirstListValue> => {
      return {
        code: 0,
        message: 'success',
        result: {
          ...mock({
            'records|10': [
              {
                update: '@time(mm:ss)',
                value: '@float(3000,6000,2,2)',
              },
            ],
          }),
          detail: {
            compare: mock('@integer(1500, 2000)'),
            count: mock('@float(20000,35000,2,2)'),
          },
        },
      }
    },
  },
] as MockMethod[]
