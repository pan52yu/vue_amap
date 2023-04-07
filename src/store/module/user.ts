import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => ({
    name: 'John Doe',
    age: 42,
  }),
  actions: {
    setName(name: string) {
      this.name = name
    },
  },
})
