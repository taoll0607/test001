<template>
  <view class="is-flex box">
    <view class="flex-1">
      <view class="menu-list">
        <view
          v-for="(item, index) in menuList"
          :key="index"
          @click="menuChange(index)"
        >
          <span :class="{ current: activeTag == index }">{{ item.title }}</span>
        </view>
      </view>
      <view class="con is-flex">
        <view class="data">
          <view class="title">客户总数</view>
          <view class="num">{{summaryData.totalCustomerNum}}</view>
          <!-- <view class="rate" :class="{ red: summaryData.totalCustomerPercent < 0 }">{{summaryData.totalCustomerPercent}}%</view> -->
        </view>

        <view class="data">
          <view class="title">名片打开次数</view>
          <view class="num">{{summaryData.totalOpenNum}}</view>
          <!-- <view class="rate" :class="{ red: summaryData.totalOpenNumPercent < 0 }">{{summaryData.totalOpenNumPercent}}%</view> -->
        </view>
      </view>

      <view class="con is-flex">
        <view class="data">
          <view class="title">名片转发次数</view>
          <view class="num">{{summaryData.totalShareNum}}</view>
         <!--  <view class="rate" :class="{ red: summaryData.totalShareNumPercent < 0 }">{{summaryData.totalShareNumPercent}}%</view> -->
        </view>

        <view class="data">
          <view class="title">跟进客户数</view>
          <view class="num">{{summaryData.followUpNum}}</view>
          <!-- <view class="rate" :class="{ red: summaryData.followUpPercent < 0 }">{{summaryData.followUpPercent}}%</view> -->
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    summaryData: {
      type: Object
    },
    activeTag: {
      type: Number,
    },
  },
  data () {
    return {
      menuList: [
        { title: '今日' },
        { title: '昨日' },
        { title: '近7日' },
        { title: '近15日' },
        { title: '近30日' }
      ]
    };
  },
  methods: {
    menuChange (index) {
      //props.activeTag = index;
      this.$emit("click-menu",index)
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  padding-bottom: 100px;
  .menu-list {
    background: #fff;
    height: 110rpx;
    padding: 0 30rpx;
    span {
      background: #fff6f2;
      width: 122rpx;
      height: 50rpx;
      border-radius: 25rpx;
      color: #fc672f;
      font-size: 26rpx;
      font-weight: 500;
      display: inline-block;
      float: left;
      text-align: center;
      line-height: 50rpx;
      margin-right: 16rpx;
      margin-top: 30rpx;
    }
    .current {
      background: #fc672f;
      color: #fff;
      font-weight: bold;
      font-size: 26rpx;
    }
  }
  .con {
    padding-top: 30rpx;
    .data {
      width: 330rpx;
      height: 260rpx;
      background: #fff;
      border-radius: 10rpx;
      margin-left: 30rpx;
      .title {
        color: #999;
        font-size: 28rpx;
        padding-top: 30rpx;
        text-align: center;
        font-weight: 500;
      }
      .num {
        color: #333;
        font-size: 50rpx;
        text-align: center;
      }
      .rate {
        color: #11c27d;
        font-size: 30rpx;
        text-align: center;
      }
      .red {
        color: #FC2F2F;
      }
    }
  }
}
</style>