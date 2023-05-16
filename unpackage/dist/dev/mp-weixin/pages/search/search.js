"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_api = require("../../utils/api.js");
require("../../utils/config.js");
if (!Math) {
  musichead();
}
const musichead = () => "../../components/musichead/musichead.js";
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const title = "\u641C\u7D22";
    const show = true;
    const iconblack = true;
    const searchType = common_vendor.ref(1);
    common_vendor.onLoad(() => {
      searchHot();
      common_vendor.index.getStorage({
        key: "searchHistory",
        success: (res) => {
          searchHistory.value = res.data;
        }
      });
    });
    let searchHotList = common_vendor.ref([]);
    let searchword = common_vendor.ref("");
    const searchHot = async () => {
      let List = await utils_api.request({
        url: "/search/hot/detail"
      });
      searchHotList.value = List.data;
    };
    const handleToWord = (word) => {
      searchword.value = word;
      handleToSearch(word);
    };
    const searchHistory = common_vendor.ref([]);
    const handleToSearch = (word) => {
      if (word) {
        searchHistory.value.unshift(word);
        searchHistory.value = [...new Set(searchHistory.value)];
        if (searchHistory.value.length > 10) {
          searchHistory.value.length = 10;
        }
        common_vendor.index.setStorage({
          key: "searchHistory",
          data: searchHistory.value
        });
        getSearch(word);
      }
    };
    const handleToClear = () => {
      common_vendor.index.removeStorage({
        key: "searchHistory",
        success: (res) => {
          searchHistory.value = [];
        }
      });
    };
    let searchList = common_vendor.ref({});
    const getSearch = async (word) => {
      let List = await utils_api.request({
        url: "/search?keywords=" + word
      });
      searchList.value = List.result.songs;
      searchType.value = 2;
    };
    const handleToClose = () => {
      searchword.value = "";
      searchType.value = 1;
    };
    const handleToDetail = (songId) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?songId=" + songId
      });
    };
    const handleToSuggest = (e) => {
      let value = e.detail.value;
      if (!value) {
        searchType.value = 1;
        return;
      }
      getSuggest(value);
      searchType.value = 3;
    };
    const suggestList = common_vendor.ref({});
    const getSuggest = async (value) => {
      let List = await utils_api.request({
        url: "/search/suggest?keywords=" + value + "&type=mobile"
      });
      suggestList.value = List.result.allMatch;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title,
          icon: show,
          iconblack
        }),
        b: common_vendor.o(($event) => handleToSearch(common_vendor.unref(searchword))),
        c: common_vendor.o([($event) => common_vendor.isRef(searchword) ? searchword.value = $event.detail.value : searchword = $event.detail.value, handleToSuggest]),
        d: common_vendor.unref(searchword),
        e: searchType.value != 1,
        f: common_vendor.o(handleToClose),
        g: searchType.value == 1
      }, searchType.value == 1 ? {
        h: common_vendor.o(handleToClear),
        i: common_vendor.f(searchHistory.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => handleToWord(item), index)
          };
        }),
        j: common_vendor.f(common_vendor.unref(searchHotList), (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.searchWord),
            c: item.iconUrl,
            d: common_vendor.t(item.content),
            e: common_vendor.t(item.score),
            f: index,
            g: common_vendor.o(($event) => handleToWord(item.searchWord), index)
          };
        })
      } : searchType.value == 2 ? {
        l: common_vendor.f(common_vendor.unref(searchList), (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.artists[0].name),
            c: common_vendor.t(item.album.name),
            d: index,
            e: common_vendor.o(($event) => handleToDetail(item.id), index)
          };
        })
      } : searchType.value == 3 ? {
        n: common_vendor.t(common_vendor.unref(searchword)),
        o: common_vendor.f(suggestList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.keyword),
            b: index,
            c: common_vendor.o(($event) => handleToWord(item.keyword), index)
          };
        })
      } : {}, {
        k: searchType.value == 2,
        m: searchType.value == 3
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4cedc0c6"], ["__file", "D:/uniapp/Vue3-Muni/pages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
