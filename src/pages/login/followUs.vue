<template>
  <view class="page" :style="{backgroundImage: 'url(' +bg+ ')'}">
    <view class="ctt">
      <view class="bank-logo">
        <image src="../../static/login/bank-logo.jpg" />
      </view>

      <view class="bank-name">招商银行</view>
      <view class="code-block"></view>
      <view class="tips">长按二维码关注我们</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bg: "../../static/login/bg_followUs.png"
    };
  },
  methods: {}
};
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 280rpx;
  padding-left: 78rpx;
  padding-right: 78rpx;
  background-size: contain;
  background-repeat: no-repeat;
}
.ctt {
  height: 500rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx; 
  padding: 115rpx 130rpx  0;
  text-align: center;
}
.bank-logo {
  position: absolute;
  left: 290rpx;
  top: 198rpx;
  width: 168rpx;
  height: 168rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 0rpx 30rpx 0px rgba(0, 0, 0, 0.14);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bank-logo image {
  width: 106rpx;
  height: 118rpx;
}
.bank-name {
  font-size: 34rpx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.code-block {
  width: 335rpx;
  height: 340rpx;
  
}
.tips {
  font-size: 28rpx;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
</style>