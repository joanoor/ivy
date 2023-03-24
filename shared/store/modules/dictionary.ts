import { DictionaryStruct, DictType } from '@shared/types'
import { defineStore } from 'pinia'

interface Dictionary {
  dicts: DictType
}

export const useDictionary = defineStore({
  id: 'app-ictionary',
  state: (): Dictionary => ({
    dicts: {} as DictType,
  }),
  actions: {
    async getDicts() {
      const { result } = await getPCodes(DICT_FIELDS)
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
