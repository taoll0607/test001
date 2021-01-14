<template>
  <view class="is-flex">
    <view class="flex-1">
        <view class="list" v-if="rankData.length > 0">
      		<view 
            class="list-item"
            v-for="(item, index) in rankData"
            :key="index"
          >
            <view class="first" v-if="index==0"></view>
            <view class="second" v-else-if="index==1"></view>
            <view class="third" v-else-if="index==2"></view>
            <view class="ranking" v-else>{{index}}</view>
            <view class="bankName">{{item.orgName}}</view>
            <view class="num is-flex active">
              <view class="total">{{item.orgNum}}</view>人
            </view>
          </view>
        </view>
      <!-- 搜索结果-->

    </view>
  </view>
</template>

<script>
export default {
  props: {
    rankData: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
.list {
	background:#fff;
  padding:0 44rpx;
  .list-item {
    height: 120rpx;
    border-bottom: 1rpx solid #EBEBEB;
    .first {
      background: url("../../static/customer/dati_icon_1.png") no-repeat 0 30rpx;
      background-size: contain;
      width: 60rpx;
      height: 120rpx;
      float: left;
    }
    .second {
      background: url("../../static/customer/dati_icon_2.png") no-repeat 0 30rpx;
      background-size: contain;
      width: 60rpx;
      height: 120rpx;
      float: left;
    }
    .third {
      background: url("../../static/customer/dati_icon_3.png") no-repeat 0 30rpx;
      background-size: contain;
      width: 60rpx;
      height: 120rpx;
      float: left;
    }
    .ranking {
      line-height: 120rpx;
      font-weight: bold;
      color: #999;
      font-size: 30rpx;
      float: left;
      width: 60rpx;
      text-align: center;
    }
    .bankName{
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      line-height: 120rpx;
      padding-left: 44rpx;
      float: left;
    }
    .num{
      float: 28rpx;
      color: #999;
      font-weight: 500;
      line-height: 120rpx;
      float: right;
      .total {

      }
    }
    .active{
      float: 28rpx;
      color: #FC672F;
      font-weight: 500;
      line-height: 120rpx;
      float: right;
      .total {
        font-size: 38rpx;
        color: #FC672F;
        font-weight: bold;
        line-height: 120rpx;
        padding-right: 18rpx;
      }
    }
  }
}
</style>