<template>
  <view class="detail">
    <view class="fixbg" :style="{'backgroundImage':'url('+songDetail.al.picUrl+')'}"></view>
    <musichead :title=" title" :icon="show" :color="color">
    </musichead>
    <view class="container" v-if="!isLoading">
      <scroll-view scroll-y="true">
        <view class="detail-play" :style="{'backgroundImage':'url(/static/disc.png)'}" @tap="handleToPlay">
          <image :src="songDetail.al.picUrl" :class="{'detail-play-run':isPlayRotate}"></image>
          <text class="iconfont " :class="iconPlay"></text>
          <view :style="{'backgroundImage':'url(/static/needle.png)'}"></view>
        </view>
        <!--   歌词 -->
        <view class="detail-lyric">
          <view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex -1 )*80 +'rpx)'}">
            <view class="detail-lyric-item" :class="{active:lyricIndex == index}" v-for="(item,index) in songLyricList"
              :key="index">

              {{item.lyric}}
            </view>
          </view>
        </view>
        <!-- 相似歌曲 -->
        <view class="detail-like">
          <view class="detail-like-head">喜欢这首歌的人也听</view>
          <view class="detail-like-item" v-for="(item,index) in songSimiList" :key="index"
            @tap="handleToSimiDetail(item.id)">
            <view class="detail-like-img">
              <image :src="item.album.picUrl"></image>
            </view>
            <view class="detail-like-song">
              <view>{{item.name}}</view>
              <view>
                <image v-if="item.privilege.flag !=0" src="../../static/dujia.png"></image>
                <image v-if="item.privilege.maxbr === 999000" src="../../static/sq.png"></image>
                {{item.album.artists[0].name}}-{{item.name}}
              </view>
            </view>
            <text class="iconfont icon-bofang1"></text>
          </view>
        </view>

        <view class="detail-comment">
          <view class="detail-comment-head">
            精彩评论 </view>
          <view class="detail-comment-item" v-for="(item,index) in songCommentList" :key="index">
            <view class="detail-comment-img">
              <image :src="item.user.avatarUrl"></image>
            </view>
            <view class="detail-comment-content">
              <view class="detail-comment-title">
                <view class="detail-comment-name">
                  <view>{{item.user.nickname}}</view>
                  <view>{{accountTime(item.time)}}</view>
                </view>
                <view class="detail-comment-like">{{account(item.likedCount)}}<text
                    class="iconfont icon-31dianzan"></text>
                </view>
              </view>
              <view class="detail-comment-text">{{item.content}}</view>
            </view>
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
    onLoad,
    onUnload,
    onHide
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
  const title = ref('歌单')
  const color = ref('white')
  const show = ref(true)
  const isLoading = ref(true)
  const store = useCounterStore();
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
  const accountTime = computed(() => {
    return function(value) {
      let date = new Date(value)
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    }
  })

  onLoad(async (option) => {
    uni.showToast({
      title: '加载中',
      icon: 'loading'
    });
    //option为object类型，会序列化上个页面传递的参数
    // console.log(option.songId); //打印出上个页面传递的参数。
    await getMusic(option.songId)
    await songLyric(option.songId)
    store.NEXT_ID(option.songId)
    songUrl(option.songId)
    songSimi(option.songId)
    songComment(option.songId)
    isLoading.value = false
    uni.hideToast();
  })

  onUnload(() => {
    cancelLyricIndex()

  })
  onHide(() => {
    cancelLyricIndex()
  })

  //歌曲详情
  let songDetail = ref({
    al: {
      picUrl: ''
    }
  })
  const getMusic = async (songId) => {
    let List = await request({
      url: '/song/detail?ids=' + songId,
    })

    songDetail.value = List.songs[0]
  }

  //相似歌曲
  let songSimiList = ref({})
  const songSimi = async (songId) => {
    let List = await request({
      url: '/simi/song?id=' + songId,
    })
    songSimiList.value = List.songs

  }
  //相似歌曲跳转和下一首播放
  const handleToSimiDetail = async (songId) => {
    uni.showToast({
      title: '加载中',
      icon: 'loading'
    });
    await getMusic(songId)
    await songLyric(songId)
    store.NEXT_ID(songId)
    songUrl(songId)
    songSimi(songId)
    songComment(songId)
    // #ifdef H5
    iconPlay.value = 'icon-bofang1'
    isPlayRotate = false;
    // #endif
    lyricIndex.value = -1
    isLoading.value = false
    uni.hideToast();

  }

  //精彩评论
  let songCommentList = ref({})
  const songComment = async (songId) => {
    let List = await request({
      url: '/comment/music?id=' + songId,
    })
    songCommentList.value = List.hotComments

  }
  //歌词
  let songLyricList = reactive({})
  let lyricIndex = ref(-1)
  //格式化歌词
  const formatTimeTose = (value) => {
    let arr = value.split(':')
    return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1)
  }
  const songLyric = async (songId) => {
    let List = await request({
      url: '/Lyric?id=' + songId,
    })
    let lyric = List.lrc.lyric
    let re = /\[([^\]]+)\]([^\[]+)/g
    let result = []
    lyric.replace(re, ($0, $1, $2) => {
      result.push({
        "time": formatTimeTose($1),
        "lyric": $2
      })
    })
    console.log(result)
    songLyricList = result
  }

  //音乐地址播放 
  let iconPlay = ref('icon-zanting')
  let isPlayRotate = true
  // #ifdef MP-WEIXIN
  const bgAudioManager = uni.getBackgroundAudioManager();
  // #endif
  // #ifdef H5
  const bgAudioManager = uni.createInnerAudioContext();
  iconPlay.value = 'icon-bofang1'
  isPlayRotate = false;
  // #endif
  const songUrl = async (songId) => {
    let List = await request({
      url: '/song/Url?id=' + songId,
    })
    // #ifdef MP-WEIXIN
    bgAudioManager.title = songDetail.value.name;
    // #endif

    if (List.data[0].url != null) {
      bgAudioManager.src = List.data[0].url;
    }
    listenLyricIndex
    bgAudioManager.onPlay(() => {
      iconPlay.value = 'icon-zanting'
      isPlayRotate = true;
      listenLyricIndex
    });
    bgAudioManager.onPause(() => {
      iconPlay.value = 'icon-bofang1'
      isPlayRotate = false;
      cancelLyricIndex()
    })
    bgAudioManager.onEnded(() => {
      handleToSimiDetail(store.nextId)
    })
  }
  //监听播放
  const handleToPlay = () => {
    if (bgAudioManager.paused) {
      bgAudioManager.play()
    } else {
      bgAudioManager.pause()
    }
  }

  //监听歌词滚动  //定时器
  const listenLyricIndex = setInterval(() => {
    // 监听播放进度的事件，一秒调用一次  
    bgAudioManager.onTimeUpdate(() => {
      // currentTime = moment(bgAudioManager.currentTime * 1000).format(
      //   "mm:ss"
      // );
      // 根据实时播放时间实现歌词滚动
      // console.log(bgAudioManager.currentTime);
      if (lyricIndex.value < songLyricList.length) {
        // console.log(songLyricList[lyricIndex.value])
        if (
          bgAudioManager.currentTime >= songLyricList[lyricIndex.value + 1].time
        ) {
          lyricIndex.value += 1;
        }
      }
    });

  }, 500);



  //清除定时器
  const cancelLyricIndex = () => {
    clearInterval(listenLyricIndex)
    // #ifdef H5
    bgAudioManager.destroy()
    // #endif
  }
</script>

<style scoped>
  .detail-play {
    width: 580rpx;
    height: 580rpx;
    background-size: cover;
    margin: 214rpx auto 0 auto;
    position: relative;
  }

  .detail-play image {
    width: 370rpx;
    height: 370rpx;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    animation: 10s linear move infinite;
    animation-play-state: paused;

  }

  .detail-play .detail-play-run {
    animation-play-state: running;

  }

  @keyframes move {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .detail-play text {
    width: 100rpx;
    height: 100rpx;
    font-size: 100rpx;
    color: white;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .detail-play view {
    width: 230rpx;
    height: 360rpx;
    position: absolute;
    left: 100rpx;
    top: -200rpx;
    right: 0;
    background-size: cover;
    margin: auto;
  }

  .detail-lyric {
    height: 246rpx;
    font-size: 32rpx;
    line-height: 82rpx;
    height: 246rpx;
    text-align: center;
    color: #919193;
    overflow: hidden;
  }

  .detail-lyric-wrap {
    transition: .5s;

  }

  .detail-lyric-item {
    height: 82rpx;
  }

  .detail-lyric-item.active {
    color: white;
  }

  .detail-like {
    margin: 0 30rpx;
  }

  .detail-like-head {
    font-size: 36rpx;
    color: white;
    margin: 50rpx 0;
  }

  .detail-like-item {
    display: flex;
    margin-bottom: 28rpx;
  }

  .detail-like-img {
    width: 82rpx;
    height: 82rpx;
    border-radius: 22rpx;
    overflow: hidden;
    margin-right: 20rpx;
  }

  .detail-like-img image {
    width: 100%;
    height: 100%;
  }

  .detail-like-song {
    flex: 1;
    color: white;
  }

  .detail-like-song view:nth-child(1) {
    font-size: 28rpx;
    color: white;
    margin-bottom: 12rpx;
    max-width: 450rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .detail-like-song view:nth-child(2) {
    font-size: 22rpx;

    max-width: 450rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .detail-like-song image {
    width: 26rpx;
    height: 20rpx;
    margin-right: 10rpx;
  }

  .detail-like-song text {
    font-size: 50rpx;
    color: white;
  }

  .detail-comment {
    margin: 0 30rpx;
  }

  .detail-comment-head {
    font-size: 36rpx;
    color: white;
    margin: 50rpx 0;
  }

  .detail-comment-item {
    margin-bottom: 28rpx;
    display: flex;
  }

  .detail-comment-img {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 18rpx;
  }

  .detail-comment-img image {
    width: 100%;
    height: 100%;
  }

  .detail-comment-content {
    flex: 1;
  }

  .detail-comment-title {
    display: flex;
    justify-content: space-between;
  }

  .detail-comment-name {}

  .detail-comment-name view:nth-child(1) {
    font-size: 26rpx;
  }

  .detail-comment-name view:nth-child(2) {
    font-size: 20rpx;
  }

  .detail-comment-like {
    font-size: 28rpx;
  }

  .detail-comment-text {
    font-size: 28rpx;
    line-height: 40rpx;
    color: white;
    margin-top: 20rpx;
    border-bottom: 1px #2d2d2e solid;
    padding-bottom: 40rpx;
  }
</style>
