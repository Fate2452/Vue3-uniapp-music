"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_api = require("../../utils/api.js");
var stores_index = require("../../stores/index.js");
require("../../utils/config.js");
if (!Math) {
  musichead();
}
const musichead = () => "../../components/musichead/musichead.js";
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const isLoading = common_vendor.ref(true);
    const title = "\u6B4C\u5355";
    const color = "white";
    const show = true;
    const playList = common_vendor.ref([]);
    const store = stores_index.useCounterStore();
    const toplayLsit = async (id) => {
      let List = await utils_api.request({
        url: "/playlist/detail?id=" + id
      });
      playList.value = List.playlist;
      store.INIT_TOPLISTIDS(List.playlist.trackIds);
      isLoading.value = false;
      common_vendor.index.hideToast();
    };
    const account = common_vendor.computed$1(() => {
      return function(value) {
        if (value.toString().length >= 4 && value.toString().length < 9) {
          return parseFloat(value / 1e4).toFixed(1) + "\u4E07";
        } else if (value.toString().length >= 9) {
          return parseFloat(value / 1e8).toFixed(1) + "\u4EBF";
        } else {
          return value;
        }
      };
    });
    common_vendor.onLoad((option) => {
      common_vendor.index.showToast({
        title: "\u52A0\u8F7D\u4E2D",
        icon: "loading"
      });
      toplayLsit(option.id);
    });
    const handleToDetail = (songId) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?songId=" + songId
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: "url(" + playList.value.coverImgUrl + ")",
        b: common_vendor.p({
          title,
          icon: show,
          color
        }),
        c: !isLoading.value
      }, !isLoading.value ? {
        d: playList.value.coverImgUrl,
        e: common_vendor.t(common_vendor.unref(account)(playList.value.playCount)),
        f: common_vendor.t(playList.value.name),
        g: playList.value.creator.avatarUrl,
        h: common_vendor.t(playList.value.description),
        i: common_vendor.f(playList.value.tracks, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.ar[0].name),
            d: common_vendor.t(item.name),
            e: index,
            f: common_vendor.o(($event) => handleToDetail(item.id), index)
          };
        })
      } : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7d5e07c6"], ["__file", "D:/uniapp/Vue3-Muni/pages/list/list.vue"]]);
wx.createPage(MiniProgramPage);
