import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  // persist: true,
  state: () => ({
    chartMapDeepStack: ['340000'] as string[],
  }),
  actions: {
    pushChartMapDeepStack(deep: string) {
      this.chartMapDeepStack.push(deep)
    },
    popChartMapDeepStack() {
      this.chartMapDeepStack.pop()
    },
  },
})
