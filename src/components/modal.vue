<template>
  <view class="modal is-center" v-if="showPopup">
    <view class="modal-mask"></view>
    <view class="modal-wrapper">
      <view class="btn-close" @click="close"> </view>
      <slot />
    </view>
  </view>
</template>

<script>
export default {

  data () {
    return {
      showPopup: false
    }
  },
  methods: {
    open () {
      this.showPopup = true
    },
    close () {
      this.showPopup = false
    }
  },
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  overflow: hidden;
}

.modal-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.2);
}
.modal-wrapper {
  position: absolute;
  z-index: 999;
  top: 150rpx;
  left: 50rpx;
  right: 50rpx;
  padding: 50rpx;
  background: #fff;
  border-radius: 10rpx;
  box-sizing: border-box;
}
.btn-close {
  position: absolute;
  left: 315rpx;
  bottom: -130rpx;
  z-index: 2;
  width: 60rpx;
  height: 60rpx;
  background: url("../static/customer/btn_close.png") 100% 100%;
  background-size: contain;
}
</style>