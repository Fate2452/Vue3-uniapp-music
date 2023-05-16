<template>
  <view class="music-head" :style="{color:color}">
    <view v-if="icon" class="music-head-icon" :class="{'music-head-iconblack':iconblack}">
      <text @tap="handleToBack" class="iconfont icon-xiangzuojiantou"></text>|
      <text @tap="handleToHome" class="iconfont icon-shouye"></text>
    </view>
    {{title}}
  </view>
</template>

<script setup>
  import {
    toRefs
  } from 'vue'
  //子传值
  const props = defineProps({
    title: {
      type: String,
      default: "默认值"
    },
    icon: {
      type: Boolean,
      default: true
    },
    color: {
      type: String
    },
    iconblack: {
      type: String,

    }

  })
  //解构
  const {
    title,
    icon
  } = toRefs(props)
  const handleToBack = () => {
    uni.navigateBack()
  }
  const handleToHome = () => {
    uni.navigateTo({
      url: '/pages/index/index'
    })
  }
</script>

<style lang="scss" scoped>
  .music-head {
    width: 100%;
    height: 75px;
    font-size: 16px;
    line-height: 80px;
    text-align: center;
    color: #000;
    position: relative;

    .music-head-icon {
      position: absolute;
      left: 8px;
      top: 25px;
      width: 90px;
      height: 31px;
      background: rgb(0, 0, 0, 0.4);
      color: white;
      line-height: 31px;
      border-radius: 15px;
      display: flex;
      justify-content: space-evenly;
    }

    .music-head-iconblack {
      color: black;
      border: 1px #eaeaea solid;
      background: white;
    }
  }
</style>