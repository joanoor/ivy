import { getStorageShortName } from '@/libs/utils/env'
import { createStorage as create } from './storageCache'
import { enableStorageEncryption } from '@/libs/settings/encryptionSetting'
import { DEFAULT_CACHE_TIME } from '@/libs/settings/encryptionSetting'
import { CreateStorageParams } from './types'

export type Options = Partial<CreateStorageParams>

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  }
}

export const WebStorage = create(createOptions(sessionStorage))

export const createStorage = (
  storage: Storage = sessionStorage,
  options: Options = {}
) => create(createOptions(storage, options))

export const createSessionStorage = (options: Options = {}) =>
  createStorage(sessionStorage, {
    ...options,
    timeout: DEFAULT_CACHE_TIME,
  })

export const createLocalStorage = (options: Options = {}) =>
  createStorage(localStorage, {
    ...options,
    timeout: DEFAULT_CACHE_TIME,
  })
