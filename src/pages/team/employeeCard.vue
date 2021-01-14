<template>
  <view class="is-flex">
    <view class="flex-1">
      <!-- 搜索条 -->
      <Search @loadData="searchFun" placeholderText="请输入员工姓名" />

      <view class="list" v-if="cardData.length > 0">
        <view
          class="is-flex list-item"
          v-for="(item, index) in cardData"
          :key="index"
        >
          <image class="avatar" :src="item.figure" />
          <view class="top is-flex">
            <view class="name">{{item.realName}}</view>{{item.orgName}}
          </view>
          <view class="down">
            <view class="num">
              <view class="data">{{item.customerNum}}</view>
              服务客户数
            </view>
            <view class="num">
              <view class="data">{{item.shareNum}}</view>
              名片转发数
            </view>
            <view class="num">
              <view class="data">{{item.openNum}}</view>
              名片打开数
            </view>
          </view>
        </view>
      </view>
      <!-- 搜索结果-->
    </view>
  </view>
</template>

<script>
import Search from "@/components/search";
export default {
  components: {
    Search
  },
  props: {
    cardData: {
      type: Array,
      default () {
        return [];
      }
    },
    keyword: {
      type: String,
    },
  },
  data () {
    return {
    };
  },
  methods: {
    searchFun (e) {
      if (e == '') {
        uni.showToast({
          title: '未输入员工姓名',
          icon: 'none',
          duration: 1000
        });
        return false;
      }
      this.$emit("click-search",e)
    }
  }
};
</script>

<style lang="scss" scoped>
.search-result {
  margin-top: 260rpx;
  text-align: center;
}
.search-result image {
  width: 150rpx;
  height: 150rpx;
}
.search-row1 {
  font-size: 32rpx;
  font-weight: 500;
  color: #666666;
}
.search-row2 {
  font-size: 24rpx;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.list {
  padding: 20rpx;
  background: #f5f5f5;
  .list-item {
    background: #fff;
    border-radius: 10rpx;
    position: relative;
    margin-bottom: 20rpx;
    .avatar {
      width: 110rpx;
      height: 110rpx;
      border-radius: 110rpx;
      margin: 35rpx 0 35rpx 20px;
      background: #000;
    }
    .top {
      position: absolute;
      font-size: 24rpx;
      color: #999;
      left: 180rpx;
      top: 15rpx;
      line-height: 35px;
      .name {
        color: #333;
        font-size: 34rpx;
        font-weight: bold;
        margin-right: 20rpx;
      }
    }
    .down {
      position: absolute;
      bottom: 24rpx;
      left: 180rpx;
      width: 75%;
      .num {
        width: 33%;
        float: left;
        font-size: 22rpx;
        color: #999;
        line-height: 22rpx;
        .data {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }
}
</style>