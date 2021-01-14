<template>
  <view class="page is-flex">
    <view class="flex-1">
      <!-- 搜索条 -->
      <Search @loadData="searchData" placeholderText="请输入关键词" />

      <view class="list ">
        <view class="  list-item" v-for="(item, index) in list" :key="index">
          <view class="txt flex-1">{{ item.desc }}</view>
          <view class="time">{{ parseTime(item.createTime) }}</view>
        </view>
      </view>
      <!-- 搜索结果-->
      <view class="search-result" v-if="list.length == 0 && loadingType != 1">
        <image src="../../static/manager/search-result.png" />
        <view class="search-row1">没有搜索结果 </view>
        <view class="search-row2">换个关键词试试吧</view>
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
  </view>
</template>

<script>
import Search from "@/components/search";
import LoadMore from "@/components/load-more";
import util from '@/common/util';
export default {
  components: {
    Search,
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
      keywords: "",
      loadingType: 0,
      page: 1,
      list: [],
    };
  },
  onLoad: function (e) {
    console.log("onLoad", e);
    uni.setNavigationBarTitle({
      title: '动态'
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
      return str
    },
    searchData (keywords) {
      this.keywords = keywords
      this.page = 1
      this.loadData()
    },
    loadData (type) {
      this.loadingType = 1
      uni.showLoading({
        title: '加载中'
      })

      this.$Request.post(this.$api.staff.dynamicList,
        {
          "page.page": this.page,
          "page.pageSize": 10,
          keywords: this.keywords,
        }
      ).then(res => {
        uni.hideLoading()
        console.log(type)
        if (type == "Refresh") {
          uni.stopPullDownRefresh(); // 停止刷新
        }
        if (res.resCode == 39321) {
          if (this.page == 1) {
            this.list = [];
          }

          if (res.resData.rows.length != 0) {
            res.resData.rows.forEach(d => {
              this.list.push(d);
            })
            this.loadingType = 0;
          }

          if (res.resData.totalPage == this.page || res.resData.totalPage == 0) {
            this.loadingType = 2;
          }
        }

      }).catch(err => {
      })
    },

    clearKeywords () {
      this.keyword = "";
      this.list = [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./news.scss";
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
</style>