import type { EncryptionParams } from '@ivy/cipher'
import {
  TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  MULTIPLE_TABS_KEY,
} from '../../enums/cacheEnum'
import type { LockInfo, UserInfo } from '../../types/store'
import type { ProjectConfig } from '../../types/config'
import type { RouteLocationNormalized } from 'vue-router'

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string
  storage: Storage
  hasEncrypt: boolean
  timeout?: Nullable<number>
}

export interface Cache<V = any> {
  value?: V
  timeoutId?: ReturnType<typeof setTimeout>
  time?: number
  alive?: number
}

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined
  [USER_INFO_KEY]: UserInfo
  [ROLES_KEY]: string[]
  [LOCK_INFO_KEY]: LockInfo
  [PROJ_CFG_KEY]: ProjectConfig
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[]
}

export type LocalStore = BasicStore
export type SessionStore = BasicStore

export type BasicKeys = keyof BasicStore
export type LocalKeys = keyof LocalStore
export type SessionKeys = keyof SessionStore
