<template>
  <view class="search">
    <musichead :title="title" :icon="show" :iconblack="iconblack"></musichead>
    <view class="container">
      <scroll-view scroll-y="true">

        <view class="search-search">
          <text class="iconfont icon-fangdajing"></text>
          <input type="text" placeholder="搜索歌曲" v-model="searchword" @confirm="handleToSearch(searchword)"
            @input="handleToSuggest" />
          <text v-show="searchType !=1" class="iconfont icon-guanbi" @tap="handleToClose"></text>
        </view>
        <block v-if="searchType==1">
          <!-- 历史记录 -->
          <view class="search-history">
            <view class="search-history-head">
              <text>历史记录</text>
              <text class="iconfont icon-lajixiang" @tap="handleToClear"></text>
            </view>
            <view class="search-history-list">
              <view v-for="(item,index) in searchHistory" :key="index" @tap="handleToWord(item)">{{item}}</view>

            </view>
          </view>
          <!-- 热词 -->
          <view class="search-hot">
            <view class="search-hot-head">热搜榜</view>
            <view class="search-hot-item" v-for="(item,index) in searchHotList" :key="index"
              @tap="handleToWord(item.searchWord)">
              <view class="search-hot-top">{{index + 1}}</view>
              <view class="search-hot-word">
                <view>
                  {{item.searchWord}}
                  <image :src="item.iconUrl" mode="aspectFit"></image>
                </view>
                <view>{{item.content}}</view>
              </view>
              <text class="search-hot-count">{{item.score}}</text>
            </view>
          </view>
        </block>
        <block v-else-if="searchType==2">
          <view class="search-result">
            <view class="search-result-item" v-for="(item,index) in searchList" :key="index"
              @tap="handleToDetail(item.id)">
              <view class="search-result-word">
                <view>{{item.name}}</view>
                <view>{{item.artists[0].name}} - {{item.album.name}}</view>
              </view>
              <text class="iconfont icon-bofang1"></text>
            </view>
          </view>
        </block>
        <block v-else-if="searchType ==3">
          <view class="search-suggest">
            <view class="search-suggest-head">
              搜索"{{searchword}}"
            </view>
            <view class="search-suggest-item" v-for="(item,index) in suggestList" :key="index"
              @tap="handleToWord(item.keyword)">
              <text class="iconfont icon-fangdajing"></text>{{item.keyword}}
            </view>
          </view>
        </block>
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
  const title = '搜索'
  const show = true
  const iconblack = true
  const searchType = ref(1)

  onLoad(() => {
    searchHot()
    uni.getStorage({
      key: 'searchHistory',
      success: (res) => {
        searchHistory.value = res.data
      }
    })
  })


  //搜索热词
  let searchHotList = ref([])
  let searchword = ref('')
  const searchHot = async () => {
    let List = await request({
      url: '/search/hot/detail',
    })
    searchHotList.value = List.data

  }
  //点击热词,历史记录,搜索提示表单双向绑定
  const handleToWord = ((word) => {
    searchword.value = word
    handleToSearch(word)
  })

  //历史记录
  const searchHistory = ref([])
  //搜索
  const handleToSearch = (word) => {
    if (word) {
      //放在数组头部
      searchHistory.value.unshift(word)
      //数组去重
      searchHistory.value = [...new Set(searchHistory.value)]
      if (searchHistory.value.length > 10) {
        searchHistory.value.length = 10
      }
      uni.setStorage({
        key: 'searchHistory',
        data: searchHistory.value
      })
      getSearch(word)
    }
  }
  //清除历史记录
  const handleToClear = () => {
    uni.removeStorage({
      key: 'searchHistory',
      success: (res) => {
        searchHistory.value = []
      }
    })

  }
  //获取搜索结果
  let searchList = ref({})
  const getSearch = async (word) => {
    let List = await request({
      url: '/search?keywords=' + word,
    })
    searchList.value = List.result.songs
    searchType.value = 2
  }
  //回到搜索页面
  const handleToClose = () => {
    searchword.value = ''
    searchType.value = 1
  }
  //跳转歌曲详情
  const handleToDetail = (songId) => {
    uni.navigateTo({
      url: '/pages/detail/detail?songId=' + songId,
    })
  }
  //弹出提示
  const handleToSuggest = (e) => {
    let value = e.detail.value
    if (!value) {
      searchType.value = 1
      return;
    }
    getSuggest(value)
    searchType.value = 3
  }
  //获取提示
  const suggestList = ref({})
  const getSuggest = async (value) => {
    let List = await request({
      url: '/search/suggest?keywords=' + value + '&type=mobile',
    })
    suggestList.value = List.result.allMatch

  }
</script>

<style scoped>
  .search-search {
    display: flex;
    align-items: center;
    height: 70rpx;
    margin: 70rpx 30rpx 50rpx 30rpx;
    background: #f7f7f7;
    border-radius: 50rpx;
  }

  .search-search text {
    margin: 0 26rpx;
  }

  .search-search input {
    flex: 1;
    font-size: 26rpx;
  }

  .search-history {
    font-size: 26rpx;
    margin: 0rpx 30rpx 50rpx 30rpx;

  }

  .search-history-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 36rpx;
  }

  .search-history-list {
    display: flex;
    flex-wrap: wrap;
  }

  .search-history-list view {
    padding: 16rpx 28rpx;
    border-radius: 40rpx;
    margin-right: 30rpx;
    margin-bottom: 30rpx;
    background-color: #f7f7f7;
  }

  .search-hot {
    margin: 0 30rpx;
    font-size: 26rpx;
  }

  .search-hot-head {
    margin-bottom: 36rpx;
  }

  .search-hot-item {
    display: flex;
    align-items: center;
    margin-bottom: 58rpx;
  }

  .search-hot-top {
    color: #fb2222;
    width: 60rpx;
    margin-left: 8rpx;
  }

  .search-hot-word {
    flex: 1;
  }

  .search-hot-word view:nth-child(1) {
    font-size: 30rpx;
  }

  .search-hot-word view:nth-child(2) {
    font-size: 24rpx;
    color: #878787;
  }

  .search-hot-word image {
    width: 48rpx;
    height: 22rpx;
  }

  .search-hot-count {
    color: #878787;
  }

  .search-result {
    border-top: 2rpx #e4e4e4 solid;
    padding: 30rpx;
  }

  .search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    margin-bottom: 30rpx;
    border-bottom: 2rpx #e4e4e4 solid;
  }

  .search-result-word {}

  .search-result-word view:nth-child(1) {
    font-size: 28rpx;
    color: #235790;
    margin-bottom: 12rpx;
  }

  .search-result-word view:nth-child(2) {
    font-size: 22rpx;
    color: #898989;
  }

  .search-result-item text {
    font-size: 50rpx;
  }

  .search-suggest {
    border-top: 2rpx #e4e4e4 solid;
    padding: 30rpx;
    font-size: 26rpx;
  }

  .search-suggest-head {
    color: #4574a5;
    margin-bottom: 74rpx;
  }

  .search-suggest-item {
    color: #5d5d5d;
    margin-bottom: 74rpx;
  }

  .search-suggest-item text {
    color: #bdbdbd;
    margin-right: 28rpx;
  }
</style>
