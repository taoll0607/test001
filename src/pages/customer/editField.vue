<template>
  <view class="page">
    <view class="list">
      <view class="list-item is-flex  align-center" v-if="title == '备注'">
        <textarea
          class="flex-1"
          v-model="note"
          type="text"
          placeholder="备注内容备注内容对应我们可以理解填写"
          placeholder-class="input-placeholder"
        />
      </view>
      <view class="list-item is-flex  align-center" v-if="title == '邮箱'">
        <view class="label">邮箱地址</view>
        <input
          class="flex-1"
          v-model="email"
          type="text"
          placeholder="请输入邮箱地址"
          placeholder-class="input-placeholder"
        />
      </view>
      <view class="list-item is-flex  align-center" v-if="title == '手机号'">
        <view class="label">手机号</view>
        <input
          class="flex-1"
          v-model="mobile"
          type="text"
          placeholder="请输入手机号"
          placeholder-class="input-placeholder"
        />
      </view>
    </view>
    <view class="submit-btn" @tap="submitEvent">完成</view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      note: '',
      title: '',
      userId: '',
      mobile: ''
    }
  },
  onLoad (e) {

    if (e.data) {

      let data = JSON.parse(decodeURIComponent(e.data))

      this.title = data.title;
      this.userId = data.userId
      uni.setNavigationBarTitle({
        title: this.title
      })
    }
  },
  methods: {

    show () {
      this.$refs.mpvueCityPicker.show()
      uni.hideKeyboard()
    },
    submitEvent () {
      let url = "", param = {}
      uni.showLoading({
        title: '处理中'
      })
      if (this.title == "邮箱") {
        url = this.$api.staff.updateEmail
        param = {
          email: this.email,
          userId: this.userId
        }
      }
      if (this.title == "备注") {
        url = this.$api.staff.updateNote
        param = {
          note: this.note,
          userId: this.userId
        }
      }
      if (this.title == "手机号") {
        if (!/^1[34578]\d{9}$/.test(this.mobile)) {
          uni.showToast({
            title: "手机号格式错误",
            icon: "none",
            duration: 2000
          });
          return;
        }
        else {
          url = this.$api.staff.updatePhone
          param = {
            mobile: this.mobile,
            userId: this.userId
          }
        }
      }
      this.$Request.post(url, param).then(res => {
        uni.hideLoading()
        if (res.resCode == 39321) {
          uni.hideLoading()
          uni.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000
          })
          uni.navigateBack()
        }

      })
    }
  },
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: #f6f6f6;
  padding-top: 30rpx;
}

.mt25 {
  margin-top: 25rpx;
}
.list {
  background: #fff;
  padding-left: 30rpx;
  padding-right: 30rpx;
  .list-item {
    padding-top: 20rpx;
    padding-bottom: 15rpx;
  }
  .label {
    font-size: 28rpx;
    color: #999;
    font-weight: 500;
    width: 140rpx;
  }
  .value {
    font-size: 28rpx;
    color: #333;
    text-align: right;
    flex: 1;
  }
  .right-arrow {
    width: 32rpx;
    height: 32rpx;
    margin-left: 15rpx;
  }
  .list-item + .list-item {
    border-top: 1rpx solid #eeeeee;
  }
  .input-placeholder {
    color: #d1d1d1;
    font-size: 28rpx;
    font-weight: 500;
  }
}
.submit-btn {
  width: 500rpx;
  height: 88rpx;
  margin: 60rpx auto;
  line-height: 88rpx;
  text-align: center;
  background: rgba(252, 88, 27, 1);
  box-shadow: 0rpx 9rpx 27rpx 2rpx rgba(252, 88, 27, 0.26);
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
</style>
