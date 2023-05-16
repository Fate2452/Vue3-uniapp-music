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
  __name: "detail",
  setup(__props) {
    const title = common_vendor.ref("\u6B4C\u5355");
    const color = common_vendor.ref("white");
    const show = common_vendor.ref(true);
    const isLoading = common_vendor.ref(true);
    const store = stores_index.useCounterStore();
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
    const accountTime = common_vendor.computed$1(() => {
      return function(value) {
        let date = new Date(value);
        return date.getFullYear() + "\u5E74" + (date.getMonth() + 1) + "\u6708" + date.getDate() + "\u65E5";
      };
    });
    common_vendor.onLoad(async (option) => {
      common_vendor.index.showToast({
        title: "\u52A0\u8F7D\u4E2D",
        icon: "loading"
      });
      await getMusic(option.songId);
      await songLyric(option.songId);
      store.NEXT_ID(option.songId);
      songUrl(option.songId);
      songSimi(option.songId);
      songComment(option.songId);
      isLoading.value = false;
      common_vendor.index.hideToast();
    });
    common_vendor.onUnload(() => {
      cancelLyricIndex();
    });
    common_vendor.onHide(() => {
      cancelLyricIndex();
    });
    let songDetail = common_vendor.ref({
      al: {
        picUrl: ""
      }
    });
    const getMusic = async (songId) => {
      let List = await utils_api.request({
        url: "/song/detail?ids=" + songId
      });
      songDetail.value = List.songs[0];
    };
    let songSimiList = common_vendor.ref({});
    const songSimi = async (songId) => {
      let List = await utils_api.request({
        url: "/simi/song?id=" + songId
      });
      songSimiList.value = List.songs;
    };
    const handleToSimiDetail = async (songId) => {
      common_vendor.index.showToast({
        title: "\u52A0\u8F7D\u4E2D",
        icon: "loading"
      });
      await getMusic(songId);
      await songLyric(songId);
      store.NEXT_ID(songId);
      songUrl(songId);
      songSimi(songId);
      songComment(songId);
      lyricIndex.value = -1;
      isLoading.value = false;
      common_vendor.index.hideToast();
    };
    let songCommentList = common_vendor.ref({});
    const songComment = async (songId) => {
      let List = await utils_api.request({
        url: "/comment/music?id=" + songId
      });
      songCommentList.value = List.hotComments;
    };
    let songLyricList = common_vendor.reactive({});
    let lyricIndex = common_vendor.ref(-1);
    const formatTimeTose = (value) => {
      let arr = value.split(":");
      return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1);
    };
    const songLyric = async (songId) => {
      let List = await utils_api.request({
        url: "/Lyric?id=" + songId
      });
      let lyric = List.lrc.lyric;
      let re = /\[([^\]]+)\]([^\[]+)/g;
      let result = [];
      lyric.replace(re, ($0, $1, $2) => {
        result.push({
          "time": formatTimeTose($1),
          "lyric": $2
        });
      });
      console.log(result);
      songLyricList = result;
    };
    let iconPlay = common_vendor.ref("icon-zanting");
    let isPlayRotate = true;
    const bgAudioManager = common_vendor.index.getBackgroundAudioManager();
    const songUrl = async (songId) => {
      let List = await utils_api.request({
        url: "/song/Url?id=" + songId
      });
      bgAudioManager.title = songDetail.value.name;
      if (List.data[0].url != null) {
        bgAudioManager.src = List.data[0].url;
      }
      listenLyricIndex;
      bgAudioManager.onPlay(() => {
        iconPlay.value = "icon-zanting";
        isPlayRotate = true;
        listenLyricIndex;
      });
      bgAudioManager.onPause(() => {
        iconPlay.value = "icon-bofang1";
        isPlayRotate = false;
        cancelLyricIndex();
      });
      bgAudioManager.onEnded(() => {
        handleToSimiDetail(store.nextId);
      });
    };
    const handleToPlay = () => {
      if (bgAudioManager.paused) {
        bgAudioManager.play();
      } else {
        bgAudioManager.pause();
      }
    };
    const listenLyricIndex = setInterval(() => {
      bgAudioManager.onTimeUpdate(() => {
        if (lyricIndex.value < songLyricList.length) {
          if (bgAudioManager.currentTime >= songLyricList[lyricIndex.value + 1].time) {
            lyricIndex.value += 1;
          }
        }
      });
    }, 500);
    const cancelLyricIndex = () => {
      clearInterval(listenLyricIndex);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: "url(" + common_vendor.unref(songDetail).al.picUrl + ")",
        b: common_vendor.p({
          title: title.value,
          icon: show.value,
          color: color.value
        }),
        c: !isLoading.value
      }, !isLoading.value ? {
        d: common_vendor.unref(songDetail).al.picUrl,
        e: common_vendor.unref(isPlayRotate) ? 1 : "",
        f: common_vendor.n(common_vendor.unref(iconPlay)),
        g: common_vendor.o(handleToPlay),
        h: common_vendor.f(common_vendor.unref(songLyricList), (item, index, i0) => {
          return {
            a: common_vendor.t(item.lyric),
            b: common_vendor.unref(lyricIndex) == index ? 1 : "",
            c: index
          };
        }),
        i: "translateY(" + -(common_vendor.unref(lyricIndex) - 1) * 80 + "rpx)",
        j: common_vendor.f(common_vendor.unref(songSimiList), (item, index, i0) => {
          return common_vendor.e({
            a: item.album.picUrl,
            b: common_vendor.t(item.name),
            c: item.privilege.flag != 0
          }, item.privilege.flag != 0 ? {} : {}, {
            d: item.privilege.maxbr === 999e3
          }, item.privilege.maxbr === 999e3 ? {} : {}, {
            e: common_vendor.t(item.album.artists[0].name),
            f: common_vendor.t(item.name),
            g: index,
            h: common_vendor.o(($event) => handleToSimiDetail(item.id), index)
          });
        }),
        k: common_vendor.f(common_vendor.unref(songCommentList), (item, index, i0) => {
          return {
            a: item.user.avatarUrl,
            b: common_vendor.t(item.user.nickname),
            c: common_vendor.t(common_vendor.unref(accountTime)(item.time)),
            d: common_vendor.t(common_vendor.unref(account)(item.likedCount)),
            e: common_vendor.t(item.content),
            f: index
          };
        })
      } : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3e159eb4"], ["__file", "D:/uniapp/Vue3-Muni/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
