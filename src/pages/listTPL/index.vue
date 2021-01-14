<template>
  <view class="page  ">
    <view class="list ">
      <view
        class="list-item is-flex"
        v-for="(item, index) in list"
        :key="index"
        @tap="gotoDetail(item)"
      >
        <image :src="item.picPath" />
        <view class="flex-1 ">
          <view class="txt flex-1">{{ item.title }}</view>
          <view class="time">{{ parseTime(item.createTime) }}</view>
        </view>
      </view>
    </view>

    <!-- 加载更多提示 -->
    <load-more
      :loadingType="loadingType"
      :contentText="contentText"
      v-if="list.length != 0"
    >
    </load-more>
    <!-- 加载更多提示 -->
  </view>
</template>

<script>
import LoadMore from "@/components/load-more";
import util from '@/common/util';
export default {
  components: {
    LoadMore
  },
  data () {
    return {
      loadingType: 0,
      contentText: {
        contentdown: "上拉显示更多",
        contentrefresh: "正在加载...",
        contentnomore: "没有更多数据了"
      },
      params: {},
      loadingType: 0,
      page: 1,
      list: [],
    };
  },
  onLoad: function (e) {

    let params = JSON.parse(decodeURIComponent(e.params))
    this.params = params
    uni.setNavigationBarTitle({
      title: params.content
    })
    this.loadData();
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    this.page = 1
    this.loadData("Refresh");
  },
  onReachBottom () {
    console.log("onReachBottom")

    if (this.totalPage > this.page) {
      this.page = this.page + 1
      this.loadData();
    }

  },
  methods: {
    parseTime (time) {
      let str = util.dateUtils.parseTime(time)
      str = str.split(' ')[1].split(":")
      return str[0] + ":" + str[1]
    },
    loadData (type) {
      this.loadingType = 1
      uni.showLoading({
        title: '加载中'
      })

      this.$Request.post(this.$api.open.getArticleList,
        {
          "page.page": this.page,
          "page.pageSize": 10,
          sectionCode: this.params.jumpLink,
        }
      ).then(res => {
        uni.hideLoading()
        if (type == "Refresh") {
          uni.stopPullDownRefresh(); // 停止刷新
        }
        if (res.resCode == 39321) {
          if (this.page == 1) {
            this.list = [];
          }
          let data = res.resData.list;
          if (data.list.length != 0) {
            data.list.forEach(d => {
              this.list.push(d);
            })
            this.loadingType = 0;
          }

          if (data.totalPage == this.page || data.totalPage == 0) {
            this.loadingType = 2;
          }
        }

      })
    },

    gotoDetail (item) {
      let data = {
        title: item.title,
        createTime: item.createTime,
      }
      uni.setStorageSync('content', item.content)
      uni.navigateTo({
        url: '/pages/listTPL/detail?type=0&params=' + encodeURIComponent(JSON.stringify(data))
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  background-color: #f7f5f6;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .list {
    margin-top: 30rpx;
    background: #fff;
    padding: 0 30rpx;

    .list-item {
      padding-top: 30rpx;
      padding-bottom: 30rpx;

      image {
        width: 150rpx;
        height: 150rpx;
        margin-right: 20rpx;
      }
      .txt {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }

      .time {
        font-size: 24rpx;
        font-weight: 500;
        color: #afadb9;
      }
    }

    .list-item + .list-item {
      border-top: 1rpx solid #eeeeee;
    }
  }
}
</style>