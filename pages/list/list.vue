<template>
  <view class="list">
    <view class="fixbg" :style="{'backgroundImage':'url('+playList.coverImgUrl+')'}"></view>
    <musichead :title="title" :icon="show" :color="color"></musichead>
    <view class="container" v-if="!isLoading">
      <scroll-view scroll-y="true">
        <view class="list-head">
          <view class="list-head-img">
            <image :src="playList.coverImgUrl"></image>
            <text class="iconfont icon-yousanjiao">{{account(playList.playCount)}}</text>
          </view>
          <view class="list-head-text">
            <view>{{playList.name}}</view>
            <view>
              <image :src="playList.creator.avatarUrl"></image>网易云音乐
            </view>
            <view>{{playList.description }}</view>
          </view>
        </view>
        <!-- #ifdef  MP-WEIXIN -->
        <button class="list-share" open-type="share">
          <text class="iconfont icon-fenxiang"></text>分享给微信好友
        </button>
        <!--  #endif -->
        <view class="list-music">
          <view class="list-music-head">
            <text class="iconfont icon-bofang1"></text>
            <text>播放全部</text>
            <text>(共100首)</text>
          </view>
          <view class="list-music-item" v-for="(item,index) in playList.tracks" :key="index"
            @tap="handleToDetail(item.id)">
            <view class="list-music-top">{{index+1}}</view>
            <view class="list-music-song">
              <view>{{item.name}}</view>
              <view>{{item.ar[0].name}} - {{item.name}}</view>
            </view>
            <text class="iconfont icon-bofang1"></text>
          </view>
        </view>
      </scroll-view>

    </view>
  </view>
</template>

<script setup>
  import musichead from '../../components/musichead/musichead.vue'
  import {
    request
  } from '../../utils/api.js'
  import {
    onLoad
  } from '@dcloudio/uni-app'
  import {
    onMounted,
    reactive,
    ref,
    computed
  } from 'vue'
  import {
    useCounterStore
  } from '@/stores/index.js';
  const isLoading = ref(true)
  const title = '歌单'
  const color =
    'white'
  const show = true
  const playList = ref([])
  const store = useCounterStore();

  //获取榜单歌曲
  const toplayLsit = async (id) => {
    let List = await request({
      url: "/playlist/detail?id=" + id,
    })

    playList.value = List.playlist
    store.INIT_TOPLISTIDS(List.playlist.trackIds)
    isLoading.value = false
    uni.hideToast();
    // console.log(playList)
  }
  //转换大数字
  const account = computed(() => {
    return function(value) {
      if (value.toString().length >= 4 && value.toString().length < 9) {
        return parseFloat(value / 10000).toFixed(1) + '万'
      } else if (value.toString().length >= 9) {
        return parseFloat(value / 100000000).toFixed(1) + '亿'
      } else {
        return value
      }
    }
  })
  onLoad((option) => {

    uni.showToast({
      title: '加载中',
      icon: 'loading'
    });
    //option为object类型，会序列化上个页面传递的参数
    // console.log(option.id); //打印出上个页面传递的参数。
    toplayLsit(option.id)
  })
  //跳转歌曲详情
  const handleToDetail = (songId) => {
    uni.navigateTo({
      url: '/pages/detail/detail?songId=' + songId,
    })
  }
</script>

<style scoped>
  .list-head {
    display: flex;
    margin: 30rpx;
  }

  .list-head-img {
    width: 264rpx;
    height: 264rpx;
    border-radius: 30rpx;
    overflow: hidden;
    position: relative;
    margin-right: 42rpx;
  }

  .list-head-img image {
    width: 100%;
    height: 100%;
  }

  .list-head-img text {
    position: absolute;
    right: 8rpx;
    top: 8rpx;
    color: white;
    font-size: 26rpx;
  }

  .list-head-text {
    color: white;
    flex: 1;
  }

  .list-head-text view:nth-child(1) {
    color: white;
    font-size: 34rpx;
  }

  .list-head-text view:nth-child(2) {
    display: flex;
    margin: 20rpx 0;
    font-size: 24rpx;
    align-items: center;
  }

  .list-head-text view:nth-child(2) image {
    width: 54rpx;
    height: 54rpx;
    border-radius: 50%;
    margin-right: 14rpx;

  }

  .list-head-text view:nth-child(3) {
    line-height: 34rpx;
    font-size: 22rpx;
    /*  多行 */
    overflow: hidden;
    text-overflow: ellipsis;
    /* 基于-webkit- */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .list-share {
    width: 330rpx;
    height: 74rpx;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 37rpx;
    color: white;
    text-align: center;
    line-height: 74rpx;
    font-size: 28rpx;
  }

  .list-share text {
    margin-top: 20rpx;
    margin-right: 20rpx;
  }

  .list-music {
    background: white;
    border-radius: 50rpx;
    margin-top: 40rpx;
    overflow: hidden;
  }

  .list-music-head {
    height: 50rpx;
    margin: 30rpx 0 70rpx 26rpx;
  }

  .list-music-head text:nth-child(1) {
    height: 50rpx;
    font-size: 50rpx;
  }

  .list-music-head text:nth-child(2) {
    font-size: 30rpx;
    margin: 0 10rpx 0 26rpx;
  }

  .list-music-head text:nth-child(3) {
    font-size: 26rpx;
    color: #a6a6a6;
  }

  .list-music-item {
    display: flex;
    margin: 0 32rpx 66rpx 22rpx;
    align-items: center;
  }

  .list-music-top {
    width: 58rpx;
    font-size: 30rpx;
    line-height: 30rpx;
  }

  .list-music-song {
    flex: 1;
  }

  .list-music-song view:nth-child(1) {
    font-size: 28rpx;
    color: black;
    width: 60vw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .list-music-song view:nth-child(2) {
    display: flex;
    font-size: 20rpx;
    align-items: center;
    color: #979797;
    width: 60vw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

  }


  .list-music-song view:nth-child(2) image {
    width: 32rpx;
    height: 20rpx;
    margin-right: 10rpx;
    flex-shrink: 0;
  }

  .list-music-item text {
    font-size: 50rpx;
    color: #c7c7c7;
  }
</style>
