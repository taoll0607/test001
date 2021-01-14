<template>
  <view class="page">
    <image class="bg" :src="images[type - 1].bg" />
    <view class="screenshot">
      <image :src="images[type - 1].screenshot" />
    </view>
    <view class="is-flex theme-block">
      <view class="theme mr80" @tap="changeTheme(1)">
        <image class="theme-image" :src="images[0].theme" />
        <view :class="{ selected: type == 1 }"></view>
      </view>
      <view class="theme" @tap="changeTheme(2)">
        <image class="theme-image" :src="images[1].theme" />
        <view :class="{ selected: type == 2 }"></view>
      </view>
    </view>

    <view class="send-btn" @tap="toSendCard">去分享</view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      type: 1,
      staffInfo: {},
      images: [
        {
          bg: '../../static/theme/theme-bg1.png',
          screenshot: '../../static/theme/screenshot1.png',
          theme: '../../static/theme/theme1.png',
        },
        {
          bg: '../../static/theme/theme-bg2.png',
          screenshot: '../../static/theme/screenshot2.png',
          theme: '../../static/theme/theme2.png',
        },
      ],
      formworkList: [],
      formworkId: ''
    }
  },
  onLoad (e) {
    uni.setNavigationBarTitle({
      title: '发送名片'
    })
    if (e.staffInfo) {
      this.staffInfo = JSON.parse(decodeURIComponent(e.staffInfo))
      // #ifdef H5  
      if (this.$wechat && this.$wechat.isWechat()) {
        // this.$wechat.share(
        //   {
        //     title: this.staffInfo.realName,
        //     desc: this.staffInfo.companyName,
        //     img: window.FILESERVICE + this.staffInfo.figure,
        //   },
        //   `${window.location.origin}/h5/pages/studio/index?phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}`
        // );
      }
      // #endif 
    }
    this.getFormworkList()
  },
  methods: {
    getFormworkList () {
      this.$Request.post(this.$api.formwork.formworkList).then(res => {
        if (res.resCode == 39321) {
          this.formworkList = res.resData.formworkList
        }
        else {
          uni.showToast({
            title: res.resMsg,
            icon: 'none',
            duration: 2000
          })
        }

      })
    },
    closeShare () {
      this.show_share = false;
    },
    toSendCard () {
      window.location.href = `${window.location.origin}/h5/pages/studio/index?show_share=1&phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}`
      // uni.navigateTo({
      //   url: `/pages/studio/index?show_share=1&phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}` //+ encodeURIComponent(JSON.stringify(this.staffInfo))
      // });

      //this.show_share = true;
    },
    changeTheme (type) {
      this.type = type
      this.formworkList.map(item => {
        if (item.formworkType == type) {
          this.formworkId = item.id
        }
      })
    },


  },
}
</script>

<style lang="scss" scoped>
@import "./sendCard.scss";
</style>