<template>
  <view class="page-bg">
    <view class="shouquan-modal is-flex is-column ">
      <view class="modal-title">·获取手机号</view>
      <view class="modal-body flex-1">
        <view class="is-center">
          <image
            class="bank-logo"
            src="../../static/login/bank-logo.jpg"
          ></image>
        </view>
        <view class="shouqun-tips1">某某银行申请获得以下权限：</view>
        <view class="shouqun-tips2"></view>
        <button
          class="accept-btn"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          ·获取手机号
        </button>
        <button class="loginbtn" open-type="share">立即分享</button>
        <button
          class="accept-btn"
          open-type="getUserInfo"
          @getuserinfo="getUserInfoToLogin"
        >
          授权用户信息
        </button>
      </view>
      <!-- <view class="modal-footer  is-flex">
        <view class="flex-1  is-center border-right">
          <button class="refuse-btn" @tap="handleRefuse">拒绝</button>
        </view>
        <view class="flex-1 is-center">
          <button
            class="accept-btn"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            允许
          </button>
        </view>
      </view> -->
    </view>
  </view>
</template>

<script> 
import login from '../../mixins/authorize'
export default {
  mixins: [login],
  data () {
    return {
      code: '',
    }
  },
  onLoad (e) {
    // uni.checkSession({
    //   success: res => {

    //   },
    //   fail: res => {
    uni.login({
      success: res => {
        this.code = res.code;
      }
    })
    //   },
    // })  
  },
  onShareAppMessage (res) {
    console.log(res)
    return {
      title: '微信小程序测试分享',
      path: '/pages/index/index'
    }
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
    getPhoneNumber (e) {

      var ency = e.detail.encryptedData;
      var iv = e.detail.iv;

      if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
        uni.showModal({
          title: '提示',
          content: '若不授权微信登录，则无法使用小程序。点击"授权"按钮并允许使用"用户信息"方可正常使用。',
          showCancel: false,
          confirmText: '授权',
          success: (res => {
            uni.openSetting({
              success: (res) => {
              }
            })
          })
        })
      }
      //同意授权 
      else {

        uni.login({
          success: res => {
            this.code = res.code;
            this.$Request.post(this.$api.miniProgram.getPhoneNumWithJsCode, {
              "jsCode": this.code,
              "encryptedDataEncoded": ency,
              "ivEncoded": iv
            }).then(res => {
              uni.setStorageSync("phonenumber", res.data.phoneNumber);
            })
          }
        })

      }
    },

    getUserInfoToLogin (e) {
      console.log(e)
      uni.getSystemInfo({
        success: function (res) {
          console.log(res.brand);
          console.log(res.model);
        }
      });
      var ency = e.detail.encryptedData;
      var iv = e.detail.iv;

      if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
        uni.showModal({
          title: '提示',
          content: '若不授权微信登录，则无法使用小程序。点击"授权"按钮并允许使用"用户信息"方可正常使用。',
          showCancel: false,
          confirmText: '授权',
          success: (res => {
            uni.openSetting({
              success: (res) => {
              }
            })
          })
        })
      }
      //同意授权 
      else {
        this.$Request.post(this.$api.miniProgram.getPhoneNumWithJsCode, {
          "jsCode": this.code,
          "encryptedDataEncoded": ency,
          "ivEncoded": iv
        }).then(res => {
          uni.setStorageSync("phonenumber", res.data.phoneNumber);
        })
      }

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