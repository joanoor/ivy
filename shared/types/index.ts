/**
 * 整个项目各模块涉及的类型
 */

export * from './config' // 系统配置
export * from './dict' // 字典
export * from './form' // 表单
export * from './locale' // 国际化
export * from './store' // 存储
export * from './request' // 网络请求

// 分页接口的baseUrl
export type BaseURLType = 'electricitymeter' | 'bb'
