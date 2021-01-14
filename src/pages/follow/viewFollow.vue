<template>
  <view class="page">
    <view class="con">
      <view class="top flex-1">
        <view class="icon is-flex"><image src="../../static/customer/flowTime.png" />跟进时间<view class="time is-flex">2020年3月10日10:40</view></view>
      </view>
      <view class="down">
        <view class="content">111111111111111111111111111</view>
        <view class="contactBtn">联系客户</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  onLoad (e) {
    
  },
  onShow () {
    this.getInfo()
  },
  methods: {
    getInfo () {

    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: #f6f6f6;
}
.con{
  padding: 0 30rpx;
  background: #fff;
  .top{
    font-size:28rpx;
    color: #333;
    padding:20rpx 0;
    position: relative;
    border-bottom: 2rpx solid #eee;
    image {
      width:44rpx;
      height:44rpx;
      margin-right:25rpx;
      margin-top: 4rpx;
    }
    .time{
      position: absolute;
      right: 0;
    }
  }
  .down{
    padding: 50rpx 0;
    .content{
      color:#666;
      font-size:28rpx;
      line-height:28rpx;
      padding-bottom:220rpx;
    }
    .contactBtn{
      width:500rpx;
      height:88rpx;
      text-align:center;
      line-height:88rpx;
      background:rgba(252,88,27,1);
      box-shadow:0px 9px 27px 2px rgba(252,88,27,0.26);
      border-radius:44px;
      font-size:32rpx;
      font-weight:bold;
      color:#fff;
      margin: 0 auto 100rpx;
    }
  }
}

</style>
