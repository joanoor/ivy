import { defineStore } from 'pinia'
import { getAllOrgList, getAllOrgTree, queryDict } from '@/api'
import { ResponseOrgStruct } from '@/api/dossier/terminalType'
import { DictType, DictionaryStruct } from '@/libs/types'
import { DICT_FIELDS } from '@/libs/enums/dictEnum'

export const useGlobalStore = defineStore('globals', {
  state: () => ({
    tloading: false,
    dicts: {} as DictType,
    orgTree: [] as ResponseOrgStruct[],
    orgList: [] as ResponseOrgStruct[],
  }),
  getters: {},
  actions: {
    toggleTableLoading() {
      this.tloading = !this.tloading
    },
    async getDicts() {
      const { result } = await queryDict(DICT_FIELDS)
      this.dicts = {
        ...result,
      }
    },
    async getAllOrg() {
      const { result: orgResult } = await getAllOrgTree()
      const { result: orgListResult } = await getAllOrgList()
      this.orgTree = orgResult
      this.orgList = orgListResult
    },
    setCustomDicts(
      dict: Record<Uppercase<string>, DictionaryStruct[]>,
      callback?: () => void
    ) {
      this.dicts = {
        ...this.dicts,
        ...dict,
      }
      callback && callback()
    },
  },
})
