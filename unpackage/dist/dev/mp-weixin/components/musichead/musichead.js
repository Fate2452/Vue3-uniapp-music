"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "musichead",
  props: {
    title: {
      type: String,
      default: "\u9ED8\u8BA4\u503C"
    },
    icon: {
      type: Boolean,
      default: true
    },
    color: {
      type: String
    },
    iconblack: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    const {
      title,
      icon
    } = common_vendor.toRefs(props);
    const handleToBack = () => {
      common_vendor.index.navigateBack();
    };
    const handleToHome = () => {
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(icon)
      }, common_vendor.unref(icon) ? {
        b: common_vendor.o(handleToBack),
        c: common_vendor.o(handleToHome),
        d: __props.iconblack ? 1 : ""
      } : {}, {
        e: common_vendor.t(common_vendor.unref(title)),
        f: __props.color
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e0b6e5e0"], ["__file", "D:/uniapp/Vue3-Muni/components/musichead/musichead.vue"]]);
wx.createComponent(Component);
