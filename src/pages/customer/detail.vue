<template>
  <view class="page">
    <view class="info">
      <view class="top is-flex align-center">
        <image class="avatar" :src="userInfo.avatarUrl" />
        <view class="flex-1">
          <view class="name">{{ userInfo.nickName }}</view>
          <!-- <view class="wechat">微信号：{{ userInfo.openId }}</view> -->
        </view>
        <image
          class="call-img"
          src="../../static/customer/icon-call.png"
          @tap="call"
        />
      </view>
      <view class="is-flex align-center" @tap="gotoEdit">
        <view class="flex-1 ">
          <view class="is-flex align-center info-row">
            <image src="../../static/customer/icon_phone.png" />
            <view class="txt">{{ userInfo.mobile }}</view>
          </view>
          <view class="is-flex align-center info-row">
            <image src="../../static/customer/icon_location.png" />
            <view class="txt">{{ userInfo.address }}</view>
          </view>
          <view class="is-flex align-center info-row">
            <image src="../../static/customer/icon_mail.png" />
            <view class="txt location">{{ userInfo.email }}</view>
          </view>
        </view>
        <image
          class="arrow-right"
          src="../../static/customer/arrow-right.png"
        />
      </view>
    </view>
    <view class="action-block">
      <view class="title is-flex align-center">
        <view class="line"></view>
        客户动态
      </view>
      <!-- 搜索条 -->
      <Search @loadData="searchData" placeholderText="请输入昵称或手机号" />
      <view class="action-list">
        <view class="action-item" v-for="(item, index) in list" :key="index">
          <view class="red-dot"></view>
          <view class="time">{{ parseTime(item.createTime) }}</view>
          <view class="action-txt">{{ item.desc }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Search from "@/components/search";
import util from '@/common/util';
export default {
  components: {
    Search
  },
  data () {
    return {
      keywords: '',
      list: [],
      page: 1,
      userData: {},
      userInfo: {
        "nickName": "",
        "avatarUrl": "",
        "openId": "",
        "realName": "石柳杨",
        "mobile": "18322489523",
        "address": "杭州",
        "email": "",
      }
    }
  },
  onLoad (e) {
    if (e.data) {
      this.userData = JSON.parse(decodeURIComponent(e.data))
    }
    uni.setNavigationBarTitle({
      title: '客户详情'
    })
    this.getDynamicList();
    this.getUserInfo()
  },
  onShow () {
    console.log("onShow")
    this.getDynamicList();
    this.getUserInfo()
  },
  methods: {
    parseTime (time) {
      let str = util.dateUtils.parseTime(time)
      return str
    },
    call () {
      uni.makePhoneCall({
        phoneNumber: this.userInfo.mobile
      });
    },
    gotoEdit () {
      uni.navigateTo({
        url: './edit?data=' + encodeURIComponent(JSON.stringify(this.userInfo))
      })
    },
    getDynamicList () {
      this.$Request.post(this.$api.staff.dynamicList + "?userId=" + this.userData.id, {
        // "page.page": this.page,
        // "page.pageSize": 10,
        keywords: this.keywords,
      }).then(res => {
        if (res.resCode == 39321) {
          this.list = res.resData.rows;
        }
      })
    },
    searchData (keywords) {
      console.log(keywords)
      this.keywords = keywords
      this.page = 1
      this.getDynamicList();
    },

    getUserInfo () {
      this.loadingType = 1
      uni.showLoading({
        title: '加载中'
      })

      this.$Request.post(this.$api.staff.userDetail,
        {
          userId: this.userData.id,
        }
      ).then(res => {
        uni.hideLoading()
        if (res.resCode == 39321) {
          let data = res.resData
          this.userInfo = { ...data.user, address: data.userCache.contactAddressCity + data.userCache.contactAddressDetail }
        }

      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./detail.scss";
</style>