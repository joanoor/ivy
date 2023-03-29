import { defineStore } from 'pinia'
import { DictionaryStruct, DictType } from '@/types'
import { DICT_FIELDS } from '@/enums/dictEnum'
import { getPCodes } from '@/api/system'
import {
  getSupervisionOrgManage,
  getVerificationOrgManage,
  getAreaManage,
} from '@/api/dossier'
import {
  ResultAreaStruct,
  ResultSupervisionOrgStruct,
  ResultVerificationOrgStruct,
} from '@/api/dossier/model'
import { changeToTree } from '@ivy/core'

interface GlobalStoreState {
  dicts: DictType
  supervisionOrgs: ResultSupervisionOrgStruct[]
  verificationOrgs: ResultVerificationOrgStruct[]
  areas: ResultAreaStruct[]
  areaList: ResultAreaStruct[]
  areaLevel2: ResultAreaStruct[]
}

export const useGlobalStore = defineStore('globals', {
  state: (): GlobalStoreState => ({
    dicts: {} as DictType,
    supervisionOrgs: [],
    verificationOrgs: [],
    areas: [],
    areaList: [],
    areaLevel2: [],
  }),
  getters: {},
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

    async getSupervisionOrgs() {
      const { result } = await getSupervisionOrgManage()
      this.supervisionOrgs = result
    },
    async getVerificationOrgs() {
      const { result } = await getVerificationOrgManage()
      this.verificationOrgs = result
    },
    async getAreas() {
      const { result } = await getAreaManage()
      this.areaList = result
      this.areaLevel2 = changeToTree(
        result.filter(v => v.distLv !== '03'),
        'areaNo',
        'parentAreaNo'
      )
      this.areas = changeToTree(result, 'areaNo', 'parentAreaNo')
      // this.areas = result
    },
  },
})
