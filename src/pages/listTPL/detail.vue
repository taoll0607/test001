<template>
  <view class="page">
    <view class="title">{{ params.title }}</view>
    <view class="shelvesTime">
      {{ valueToDate(params.createTime) }}
    </view>

    <uParse :content="content" @preview="preview" @navigate="navigate" />
  </view>
</template>

<script>
import uParse from '@/components/htmlParser/wxParse.vue'
import { dateUtils } from '@/common/util'
export default {
  components: {
    uParse
  },
  data () {
    return {
      params: {},
      content: '<p style="margin-top:100px;text-align:center">加载中...</p>'// htmlString,
    }
  },
  onLoad: function (e) {
    console.log("onLoad", e);
    let params
    if (e.params) {
      params = JSON.parse(decodeURIComponent(e.params))
      this.params = params
    }
    if (e.type == 0) {
      console.log("onLoad", params.content);
      this.content = uni.getStorageSync('content')
      uni.setNavigationBarTitle({
        title: this.params.title
      })
    }

    else if (e.type == 3) {
      this.loadData()

    }

  },
  methods: {
    loadData () {
      console.log(this.params)
      // uni.showLoading({
      //   title: '加载中'
      // })

      this.$Request.post(this.$api.open.articleDetail,
        {
          id: this.params.jumpLink,
        }
      ).then(res => {
        // uni.hideLoading()
        if (res.resCode == "39321") {
          this.params = res.resData
          this.content = res.resData.content
          uni.setNavigationBarTitle({
            title: res.resData.title
          })
        }

      })
    },
    valueToDate (v) {
      return dateUtils.parseTime(v)
    },
    preview (src, e) {
      // do something
      console.log("src: " + src);
    },
    navigate (href, e) {
      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      console.log("href: " + href);
      uni.showModal({
        content: "点击链接为：" + href,
        showCancel: false
      })
    }
  }
}
</script>

<style  scoped>
.page {
  height: 100vh;
  background: #fff;
  padding: 30rpx 30rpx 100rpx;
  overflow-y: scroll;
}
.title {
  font-size: 30rpx;
  font-weight: bold;
  color: rgb(37, 32, 65);
}
.shelvesTime {
  font-size: 24rpx;
  font-weight: 500;
  color: rgba(175, 173, 185, 1);
  line-height: 40rpx;
}
.image {
  width: 650rpx;
  margin: 30rpx auto;
}
</style>