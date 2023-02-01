import { getAllOrgList, getAllOrgTree, queryDict } from '@/api'
import { defineStore } from 'pinia'
import { DICT_FIELDS } from '@/libs/shared/constant'
import { ResultOrgStruct } from '@/api/model'
import { DictType } from '@/libs/shared/types'

export const useGlobalStore = defineStore('globals', {
  state: () => ({
    tloading: false,
    dicts: {} as DictType,
    orgTree: [] as ResultOrgStruct[],
    orgList: [] as ResultOrgStruct[],
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
  },
})
