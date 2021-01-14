<template>
  <view class="page-bg">
    <view class="shouquan-modal is-flex is-column ">
      <view class="modal-title">微信授权</view>
      <view class="modal-body flex-1">
        <view class="is-center">
          <image
            class="bank-logo"
            src="../../static/login/bank-logo.jpg"
          ></image>
        </view>
        <view class="shouqun-tips1">某某银行申请获得以下权限：</view>
        <view class="shouqun-tips2">·获得你公开信息（昵称、头像等）</view>
      </view>
      <view class="modal-footer  is-flex">
        <view class="flex-1  is-center border-right">
          <button class="refuse-btn" @tap="handleRefuse">拒绝</button>
        </view>
        <view class="flex-1 is-center">
          <button
            class="accept-btn"
            open-type="getUserInfo"
            @getuserinfo="getUserInfoToLogin"
          >
            允许
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script> 
import login from '../../mixins/authorize'
export default {
  mixins: [login],
  data () {
    return {
      show: true,
      code: '',
    }
  },
  onLoad (e) {
    console.log(e.backTo)
    uni.login({
      provider: 'weixin',
      success: res => {
        this.code = res.code;
      }
    })
  },
  methods: {
    handleRefuse () {

      if (getCurrentPages().length > 1) {
        uni.navigateBack()
      }
      else uni.reLaunch({
        url: '/pages/home/index'
      })
    },
    getUserInfoToLogin (res_user) {
      console.log(res_user)
      // uni.login({
      //   provider: 'weixin',
      //   success: res => {
      this.loginWithCode(this.code, res_user.detail, () => {

        if (getCurrentPages().length > 1) {
          uni.navigateBack()
        }
        else uni.reLaunch({
          url: '/pages/home/index'
        })
      })
      //   }
      // })

    },
  },
}
</script>

<style scoped>
.page-bg {
  height: 100vh;
  background: #eee;
  padding-top: 30%;
}
.shouquan-modal {
  width: 594upx;
  height: 569upx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20upx;
  margin-left: auto;
  margin-right: auto;
}
.modal-title {
  border-bottom: 1rpx solid #e7e3e3;
  line-height: 110rpx;
  font-size: 36rpx;
  color: #333;
  text-align: center;
}
.modal-body {
  padding-left: 35rpx;
  padding-right: 35rpx;
}
.bank-logo {
  width: 80upx;
  height: 80upx;
  border-radius: 50%;
  margin-top: 35rpx;
  margin-bottom: 35rpx;
}
.shouqun-tips1 {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  border-bottom: 1rpx solid #e7e3e3;
  padding-bottom: 20rpx;
  margin-bottom: 25rpx;
}
.shouqun-tips2 {
  font-size: 26rpx;
  font-weight: 500;
  color: #999;
}
.modal-footer {
  border-top: 2rpx solid #e7e3e3;
}
.border-right {
  border-right: 2rpx solid #e7e3e3;
}
.refuse-btn {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
}
.accept-btn {
  font-size: 34rpx;
  font-weight: 500;
  color: rgba(27, 214, 88, 1);
}
.refuse-btn,
.accept-btn {
  background: #fff;
}
.modal-footer button::after {
  border: 0;
}
</style>