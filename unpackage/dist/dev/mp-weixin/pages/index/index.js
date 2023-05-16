"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_api = require("../../utils/api.js");
require("../../utils/config.js");
if (!Math) {
  musichead();
}
const musichead = () => "../../components/musichead/musichead.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const title = "\u7F51\u6613\u4E91\u97F3\u4E50";
    const show = false;
    common_vendor.ref(true);
    common_vendor.onMounted(() => {
      toLsit();
    });
    let TopList = common_vendor.ref([]);
    const toLsit = async () => {
      let List = await utils_api.request({
        url: "/toplist/detail"
      });
      TopList.value = List.list.slice(0, 4);
    };
    const handleToList = (id) => {
      common_vendor.index.navigateTo({
        url: "/pages/list/list?id=" + id
      });
    };
    const handleToSearch = () => {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title,
          icon: show
        }),
        b: common_vendor.o(($event) => handleToSearch()),
        c: common_vendor.f(common_vendor.unref(TopList), (item, index, i0) => {
          return {
            a: item.coverImgUrl,
            b: common_vendor.t(item.updateFrquency),
            c: common_vendor.f(item.tracks, (musicItem, index2, i1) => {
              return {
                a: common_vendor.t(index2 + 1),
                b: common_vendor.t(musicItem.first),
                c: common_vendor.t(musicItem.second),
                d: index2
              };
            }),
            d: index,
            e: common_vendor.o(($event) => handleToList(item.id), index)
          };
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-57280228"], ["__file", "D:/uniapp/Vue3-Muni/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
