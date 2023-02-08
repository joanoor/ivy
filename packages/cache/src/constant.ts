// token key
export const TOKEN_KEY = 'TOKEN__'

// user info key
export const USER_INFO_KEY = 'USER__INFO__'

// role info key
export const ROLES_KEY = 'ROLES__KEY__'

// project config key
export const PROJ_CFG_KEY = 'PROJ__CFG__KEY__'

// lock info
export const LOCK_INFO_KEY = 'LOCK__INFO__KEY__'

export const MULTIPLE_TABS_KEY = 'MULTIPLE_TABS__KEY__'

export enum CacheTypeEnum {
  SESSION,
  LOCAL,
}

// 默认的AES加密参数
export const defaultCacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
}

// 默认过期时间：1周
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7
