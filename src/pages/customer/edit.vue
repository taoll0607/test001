<template>
  <view class="page">
    <view class="list ">
      <view class="list-item is-flex">
        <view class="label">昵称</view>
        <view class="value">{{ userInfo.nickName }}</view>
      </view>
      <!-- <view class="list-item is-flex">
        <view class="label">微信号</view>
        <view class="value">{{ userInfo.openId }}</view>
      </view> -->
      <view
        class="list-item is-flex align-center"
        @tap="goto('editField', '手机号')"
      >
        <view class="label">手机号</view>
        <view class="value">{{ userInfo.mobile }}</view>
        <image
          class="right-arrow"
          src="../../static/customer/arrow-right.png"
        />
      </view>
      <!-- <view class="list-item is-flex">
        <view class="label">地区</view>
        <view class="value">{{ userInfo.address }}</view>
      </view> -->
      <view class="list-item is-flex">
        <view class="label">所用语言</view>
        <view class="value">{{ userCache.country }}</view>
      </view>
    </view>
    <view class="list mt25">
      <view
        class="list-item is-flex  align-center"
        @tap="goto('editField', '邮箱')"
      >
        <view class="label">邮箱</view>
        <view class="value">{{ userInfo.email }}</view>
        <image
          class="right-arrow"
          src="../../static/customer/arrow-right.png"
        />
      </view>
      <view
        class="list-item is-flex  align-center"
        @tap="goto('address', '联系地址')"
      >
        <view class="label">联系地址</view>
        <view class="value">
          {{ userCache.contactAddressCity + userCache.contactAddressDetail }}
        </view>
        <image
          class="right-arrow"
          src="../../static/customer/arrow-right.png"
        />
      </view>
      <view
        class="list-item is-flex  align-center"
        @tap="goto('editField', '备注')"
      >
        <view class="label">备注</view>
        <view class="value">{{ userCache.note }}</view>
        <image
          class="right-arrow"
          src="../../static/customer/arrow-right.png"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {
        "nickName": "",
        "avatarUrl": "",
        "openId": "",
        "realName": "",
        "mobile": "",
        "address": "",
        "email": "",
        "country": ""
      },
      userId: "",
      userCache: {
        country: "",
        note: "",
        province: "",
        contactAddressCity: '',
        contactAddressDetail: '',
      }
    }
  },
  onLoad (e) {
    if (e.data) {
      this.userId = JSON.parse(decodeURIComponent(e.data)).id
    }
    uni.setNavigationBarTitle({
      title: '客户详情'
    })
  },
  onShow () {
    this.getUserInfo()
    this.getUserDetail()
  },
  methods: {
    getUserDetail () {

      this.$Request.post(this.$api.staff.userDetail,
        {
          userId: this.userId,
        }
      ).then(res => {
        uni.hideLoading()

        if (res.resCode == 39321) {
          this.userCache = res.resData.userCache
        }

      })
    },
    getUserInfo () {
      this.loadingType = 1

      this.$Request.post(this.$api.staff.userInfo,
        {
          userId: this.userId,
        }
      ).then(res => {
        uni.hideLoading()
        if (res.resCode == 39321) {
          this.userInfo = res.resData
        }

      })
    },
    goto (page, title) {

      let data = { title: title, userId: this.userInfo.id }
      page = page + '?data=' + encodeURIComponent(JSON.stringify(data))

      uni.navigateTo({
        url: '/pages/customer/' + page
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
}
</style>
