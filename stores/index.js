// stores/index.js
import {
  defineStore
} from 'pinia';

export const useCounterStore = defineStore('counter', {
  id: 'song',
  state: () => ({
    topListId: [],
    nextId: ''
  }),
  actions: {
    //获取榜单歌曲id
    INIT_TOPLISTIDS(payload) {
      this.topListId = payload
    },
    //获取下一首歌id
    NEXT_ID(payload) {
      for (let i = 0; i < this.topListId.length; i++) {
        if (this.topListId[i].id == payload) {
          this.nextId = this.topListId[i + 1].id
        }
      }
    }
  },
});
