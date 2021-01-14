<template>
  <view>
    <tki-qrcode
      cid="qrcode1"
      ref="qrcode"
      :val="val"
      :size="size"
      :unit="unit"
      :background="background"
      :foreground="foreground"
      :pdground="pdground"
      :icon="icon"
      :iconSize="iconsize"
      :lv="lv"
      :onval="onval"
      :loadMake="loadMake"
      :usingComponents="true"
      showLoading="false"
    />
  </view>
</template>

<script>
import tkiQrcode from '../tki-qrcode/tki-qrcode'
export default {
  components: {
    tkiQrcode,
  },
  props: {
    // 要生成的二维码值
    val: {
      type: String,
      default: '000000'
    },
    // 二维码大小
    size: {
      type: String,
      default: '200'
    },
  },
  data () {
    return {
      unit: 'upx', // 单位
      background: '#fff', // 背景色
      foreground: '#000', // 前景色
      pdground: '#000', // 角标色
      onval: false, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
    }
  },
}
</script>

<style scoped>
</style>