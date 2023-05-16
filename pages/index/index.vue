<template>
  <view class="index">
    <musichead :title="title" :icon="show"></musichead>
    <view class="container">
      <scroll-view scroll-y="true">
        <view class="index-search" @tap="handleToSearch()">
          <text class="iconfont icon-fangdajing"></text>
          <input type="text" placeholder="搜索歌曲" />
        </view>

        <view class="index-list">
          <view class="index-list-item" v-for="(item,index) in TopList" :key="index" @tap="handleToList(item.id)">
            <view class="index-list-img">
              <image :src="item.coverImgUrl"></image>
              <text>{{item.updateFrquency}}</text>
            </view>
            <view class="index-list-text">
              <view v-for="(musicItem,index) in item.tracks" :key="index">
                {{index+1}}.{{musicItem.first}}-{{musicItem.second}}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import {
    request
  } from '../../utils/api.js'
  import {
    onMounted,
    reactive,
    ref
  } from 'vue'
  import musichead from '../../components/musichead/musichead.vue'

  const title = '网易云音乐'
  const show = false
  const isLoading = ref(true)

  onMounted(() => {
    toLsit()
  })
  //获取榜单
  let TopList = ref([])
  const toLsit = async () => {
    let List = await request({
      url: "/toplist/detail",
    })
    TopList.value = List.list.slice(0, 4)
  }
  //跳转榜单
  const handleToList = (id) => {
    uni.navigateTo({
      url: '/pages/list/list?id=' + id
    })
  }
  //跳转搜索
  const handleToSearch = () => {
    uni.navigateTo({
      url: '/pages/search/search'
    })
  }
</script>

<style scoped>
  .index {}

  .index-search {
    display: flex;
    align-items: center;
    height: 70rpx;
    margin: 70rpx 30rpx 30rpx 30rpx;
    background: #f7f7f7;
    border-radius: 50rpx;
  }

  .index-search text {
    margin: 0 26rpx;
  }

  .index-search input {
    font-size: 28rpx;
    flex: 1;
  }

  .index-list {
    margin: 0 30rpx;
  }

  .index-list-item {
    display: flex;
    margin-bottom: 34rpx;
  }

  .index-list-img {
    width: 212rpx;
    height: 212rpx;
    position: relative;
    border-radius: 30rpx;
    overflow: hidden;
    margin-right: 20rpx;
  }

  .index-list-img image {
    width: 100%;
    height: 100%;
  }

  .index-list-img text {
    position: absolute;
    left: 12rpx;
    bottom: 16rpx;
    color: white;
    font-size: 20rpx;
  }

  .index-list-text {
    font-size: 24rpx;
    line-height: 66rpx;
  }

  /* 防止数据过长  隐藏成省略号*/
  .index-list-text view {
    width: 60vw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
