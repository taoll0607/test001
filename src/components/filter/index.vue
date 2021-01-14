<template>
  <view class="filter-page" v-if="show">
    <view class="filter-page-mask"></view>
    <view class="filter-container">
      <view class="filters is-flex">
        <template v-if="activeTab == 1">
          <view
            class="filter-item"
            v-for="(item, index) in tab1"
            :key="index"
            :class="{ active: activeItem == item }"
            @tap="changeFilter(item)"
            >{{ item }}</view
          >
        </template>
        <template v-if="activeTab == 2">
          <view
            class="filter-item"
            v-for="(item, index) in tab2"
            :key="index"
            :class="{ active: activeItem == item }"
            @tap="changeFilter(item)"
            >{{ item.trade }}</view
          >
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    activeTab: {
      type: Number,
      default: 0
    },
  },
  data () {
    return {
      activeItem: "",
      tab1: ["离我最近", "最新发布", "人气最高"],
      tab2: [{ trade: "全部类别" }]
    };
  },
  created () {
    this.loadGoodsSort()
  },
  methods: {
    loadGoodsSort () {
      this.$Request.get(this.$api.common.sortList).then(res => {
        if (res.code == 200) {
          this.tab2 = [{ trade: "全部类别" }, ...res.data];
        }
      })
    },
    changeFilter (item) {
      console.log(item);
      if (this.activeItem == item) {
        return
      }
      this.activeItem = item;
      this.$emit('changeFilter', item);
    }
  }
};
</script>

<style scoped>
.filter-page {
  position: fixed;
  top: 0rpx;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  overflow: hidden;
}
.filter-page-mask {
  position: absolute;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  z-index: 998;
}
.filter-container {
  position: absolute;
  z-index: 999;
  top: 0rpx;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1rpx solid #eaeaea;
}
.filters {
  background: rgba(255, 255, 255, 1);
  flex-wrap: wrap;
  padding-bottom: 30rpx;
  padding-left: 40rpx;
}
.filter-item {
  width: 210rpx;
  height: 60rpx;
  font-size: 26rpx;
  color: #333;
  background: #f5f5f4;
  border-radius: 5rpx;
  text-align: center;
  line-height: 60rpx;
  margin-top: 30rpx;
  margin-right: 20rpx;
}
.filter-item.active {
  color: #ff3f25;
  background: rgba(255, 242, 242, 1);
}
</style>