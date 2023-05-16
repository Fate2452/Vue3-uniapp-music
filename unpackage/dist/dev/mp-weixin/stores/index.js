"use strict";
var common_vendor = require("../common/vendor.js");
const useCounterStore = common_vendor.defineStore("counter", {
  id: "song",
  state: () => ({
    topListId: [],
    nextId: ""
  }),
  actions: {
    INIT_TOPLISTIDS(payload) {
      this.topListId = payload;
    },
    NEXT_ID(payload) {
      for (let i = 0; i < this.topListId.length; i++) {
        if (this.topListId[i].id == payload) {
          this.nextId = this.topListId[i + 1].id;
        }
      }
    }
  }
});
exports.useCounterStore = useCounterStore;
