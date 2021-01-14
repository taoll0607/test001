<template>
  <view class="page">
    <view class="list">
      <view class="list-item is-flex  align-center" @tap="show()">
        <view class="label">地区信息</view>
        <view class="flex-1 input-placeholder" v-if="contactAddressCity == ''">
          请选择
        </view>
        <view class="flex-1 value" v-if="contactAddressCity != ''">
          {{ contactAddressCity }}
        </view>
        <image
          class="right-arrow"
          src="../../static/customer/arrow-right.png"
        />
      </view>
      <view class="list-item is-flex  align-center">
        <view class="label">详细地址</view>
        <input
          class="flex-1 txt-right"
          v-model="contactAddressDetail"
          type="text"
          placeholder="街道门牌信息"
          placeholder-class="input-placeholder"
        />
      </view>
    </view>
    <view class="submit-btn" @tap="submitEvent">完成</view>
    <mpvue-city-picker
      ref="mpvueCityPicker"
      :theme-color="themeColor"
      @onConfirm="onConfirm"
    />
  </view>
</template>

<script>
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
export default {
  components: {
    mpvueCityPicker
  },
  data () {
    return {
      contactAddressCity: '',
      contactAddressDetail: '',
      userId: '',
      title: '',
      themeColor: '#007AFF',
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
    onConfirm (e) {
      console.log(e)
      const cityCode = e.cityCode;
      const label = e.label.split('-');
      // this.info.province = cityCode.slice(0, 2) + '0000'
      // this.info.city = cityCode.slice(0, 4) + '0000'
      // this.info.county = cityCode
      // this.info.region = label.join('')
      this.contactAddressCity = label.join('');
    },
    show () {
      this.$refs.mpvueCityPicker.show()
      uni.hideKeyboard()
    },
    submitEvent () {

      uni.showLoading({
        title: '处理中'
      })

      let url = this.$api.staff.updateAddress
      let param = {
        contactAddressCity: this.contactAddressCity,
        contactAddressDetail: this.contactAddressDetail,
        userId: this.userId
      }

      this.$Request.post(url, param).then(res => {
        uni.hideLoading()
        if (res.resCode == 39321) {
          uni.hideLoading()
          uni.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000,
            success: () => {
              uni.navigateBack()
            }
          })

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
.txt-right {
  text-align: right;
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
