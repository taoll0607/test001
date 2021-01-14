<template>
  <view :class="{ footer: true, bg: type == 1 }">
    <view class="is-flex ctt1" v-show="data.weixinModuleStatus==1">
      <view class="is-flex ctt1-item">
        <image :src="FILESERVICE + data.serviceNumberQr" />
        <view class="txt">{{ data.serviceNumberContent }}</view>
      </view>
      <view class="is-flex ctt1-item">
        <image :src="FILESERVICE + data.subscriptionNumberQr" />
        <view class="txt">{{ data.subscriptionNumberContent }}</view>
      </view>
    </view>
    <view class="tips" v-show="data.tipsModuleStatus==1">
      <view class="is-flex align-center">
        <image src="../../static/customer/tips.png" />

        温馨提示：
      </view>
      <view>{{ data.tips }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 1
    },
    data: {
      type: Object,
      default: {

      }
    }
  },
  data () {
    return {
      FILESERVICE: window.FILESERVICE,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "./footer.scss";
</style>