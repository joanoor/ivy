import { defineStore } from 'pinia'
import { DictType, DictionaryStruct } from '../../types'
import { getPCodes } from '../../api/system'

interface GlobalStoreState {
  dicts: DictType
}

export const useGlobalStore = defineStore('globals', {
  state: (): GlobalStoreState => ({
    dicts: {} as DictType,
  }),
  getters: {},
  actions: {
    async getDicts<T>(dictFields: T) {
      const { result } = await getPCodes(dictFields)
      this.dicts = {
        ...result,
      }
    },
    /**
     * 添加自定义的字典
     * @param customDictionary
     */
    setDicts(customDictionary: Record<string, DictionaryStruct[]>) {
      this.dicts = {
        ...this.dicts,
        ...customDictionary,
      }
    },
  },
})
