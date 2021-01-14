<template>
  <!-- 搜索条 -->
  <view class="search-box is-flex">
    <view class="flex-1 search-radius is-flex">
      <image
        class="search-icon"
        src="../../static/customer/search-icon.png"
        mode="widthFix"
      />
      <input
        class="searchBoxIpt flex-1"
        type="text"
        v-model="keywords"
        @confirm="searchNow($event)"
        :placeholder="placeholderText"
        placeholder-class="input-placeholder"
        confirm-type="search"
      />
    </view>
    <!-- <view class="cancel-txt" @tap="clearkeywordss">取消</view> -->
  </view>
</template>

<script>
import LoadMore from "@/components/load-more";
export default {
  components: {
    LoadMore
  },
  props: {
    placeholderText: {
      type: String,
      default: ""
    },
  },
  data () {
    return {
      keywords: "",
    };
  },
  methods: {
    searchNow (e) {
      console.log(e)
      let keywords = e.detail.value
      this.keywords = keywords
      if (this.keywords == '') {
        uni.showToast({
          title: '未输入搜索关键字',
          icon: 'none',
          duration: 1000
        });
        //return false;
      }

      this.$emit('loadData', this.keywords)
    },
  }
};
</script>

<style scoped>
.search-box {
  height: 100rpx;
  background: rgba(255, 255, 255, 1);
  align-items: center;
}
.search-radius {
  height: 60rpx;
  background: rgba(245, 245, 244, 1);
  border-radius: 30rpx;
  align-items: center;
  margin: auto 20rpx;
}
.search-icon {
  width: 30rpx;
  height: 30rpx;
  margin-left: 20rpx;
  margin-right: 10rpx;
}
.cancel-txt {
  width: 100rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.input-placeholder {
  color: #999;
  font-size: 26rpx;
  font-weight: 500;
}
</style>