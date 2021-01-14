<template>
    <view class="page">
	    <view class="flex-1">
		  	<view class="tab">
		  	   <view class="select">
		  	   		{{orgName}}
              <view @tap="showTree" class="selectTree">
                <image src="../../static/customer/down.png" />
              </view>
              <tki-tree ref="tkitree" :selectParent="selectParent" :multiple="multiple" :range="orgTreeList" rangeKey="text" @confirm="treeConfirm" @cancel="treeCancel"></tki-tree>
		  	   </view>
			   <menu-tag :currentTag="currentTag" :menuList="menuList" @menuTagTrigger="menuChange"></menu-tag>
			</view>
			<view class="con">
				  <Summary v-show="currentTag == 0" :summaryData="summaryList" @click-menu="getSummaryList" :activeTag="timeType"></Summary>
		    	<rank-list v-show="currentTag == 1" :rankData="rankList"></rank-list>
		    	<employee-card v-show="currentTag == 2" :cardData="cardList" @click-search="getCardList" :keyword="keywords"></employee-card>
			</view>
	    </view>

      <!-- 搜索结果-->
      <view class="search-result" v-if="cardList.length == 0&&currentTag ==2">
        <!-- <image src="../../static/home/search-result.png" /> -->
        <view class="search-row1">没有搜索结果</view>
        <view class="search-row2">换个关键词试试吧</view>
      </view>
      <!-- 加载更多提示 -->
      <view class="pb100" v-if="currentTag ==2 ">
        <load-more
          :loadingType="loadingType"
          :contentText="contentText"
          v-if="cardList.length != 0"
        ></load-more>
      </view>
      <!-- 加载更多提示 -->

    </view>
</template>

<script>
import LoadMore from "@/components/load-more";
import MenuTag from "@/components/MenuTag/MenuTag.vue";
import employeeCard from "./employeeCard.vue";
import rankList from "./rankList.vue";
import Summary from "./summary.vue";
import tkiTree from '@/components/tki-tree/tki-tree';
export default {
  components: {
    MenuTag,
    employeeCard,
    rankList,
    Summary,
    LoadMore,
    tkiTree
  },
  data () {
    return {
    	menuList: [
          { title: '概括' },
          { title: '业务排行' },
          { title: '员工名片' }
        ],
      contentText: {
        contentdown: "上拉显示更多",
        contentrefresh: "正在加载...",
        contentnomore: "没有更多数据了"
      },
      currentTag: 0,
      loadingType: 0,
      page: 1,
      keywords: "",
      rankList: [],
      summaryList: {},
      cardList: [],
      orgTreeList: [],
      multiple:false,
      selectParent:true,
      orgId:'',
      orgName:'',
      timeType:0
    };
  },
  onLoad () {
    this.getOrgTree();
  },
  onReachBottom () {
    console.log("onReachBottom")
    if (this.totalPage > this.page) {
      this.page = this.page + 1
      this.loadCardList();
    }
  },
  onPullDownRefresh: function () {
    this.page = 1
    if(this.currentTag==0){
      this.loadSummaryList("Refresh")
    }else if(this.currentTag==1){
      this.loadRanklist("Refresh")
    }else{
      this.loadCardList("Refresh")
    }
  },
  methods: {
  	menuChange(index) {
    	this.currentTag = index;
      this.page = 1;
      this.keywords = "";
      this.cardList = [];
      this.timeType = 0;
      if(index==0){
        this.loadSummaryList()
      }else if(index==1){
        this.loadRanklist()
      }else{
        this.loadCardList()
      }
    },
    getOrgTree () {
      this.$Request.post(this.$api.staff.orgTreeList,
        {}
      ).then(res => {
        if (res.resCode == 39321) {
          this.orgTreeList = res.resData;
          this.orgName = res.resData[0].text;
          this.orgId = res.resData[0].id;
          this.loadSummaryList();
        }
      }).catch(err => {
      })
    },
    getSummaryList(data){
      this.timeType = data
      this.loadSummaryList()
    },
    getCardList(e){
      this.keywords = e;
      this.page = 1;
      this.loadCardList();
    },
    loadRanklist (type) {
      this.loadingType = 1
      uni.showLoading({
        title: '加载中'
      })
      this.$Request.post(this.$api.staff.rankList,
        {
          "orgId":this.orgId
        }
      ).then(res => {
          uni.hideLoading()
        if (type == "Refresh") {
          uni.stopPullDownRefresh(); // 停止刷新
        }
        if (res.resCode == 39321) {
          this.rankList = res.resData
        }
      }).catch(err => {
      })
    },
    loadSummaryList(type){
      uni.showLoading({
        title: '加载中'
      })
      this.$Request.post(this.$api.staff.summaryList,
        {
          "timeType":this.timeType,
          "orgId":this.orgId
        }
      ).then(res => {
        uni.hideLoading()
        if (type == "Refresh") {
          uni.stopPullDownRefresh(); // 停止刷新
        }
        if (res.resCode == 39321) {
          this.summaryList = res.resData
        }
        
        }).catch(err => {
      })
    },
    loadCardList (type) {
      this.loadingType = 1
      uni.showLoading({
        title: '加载中'
      })
      this.$Request.post(this.$api.staff.cardList,
        {
          "page.page": this.page,
          "page.pageSize": 10,
          "orgId":this.orgId,
          "keywords":this.keywords
        }
      ).then(res => {
        uni.hideLoading()
        if (type == "Refresh") {
          uni.stopPullDownRefresh(); // 停止刷新
        }
        if (res.resCode == 39321) {
          if (this.page == 1) {
            this.cardList = [];
          }
          if (res.resData.rows.length != 0) {
            res.resData.rows.forEach(d => {
              this.cardList.push(d);
            })
            this.loadingType = 0;
          }
          if (res.resData.totalPage == this.page || resData.totalPage == 0) {
            this.loadingType = 2;
          }
        }
      }).catch(err => {
      })
    },
    // 确定回调事件
    treeConfirm(e){
      this.orgName = e[0].text
      this.orgId = e[0].id
      this.menuChange(this.currentTag)
    },
    // 取消回调事件
    treeCancel(e){
    },
    // 显示树形选择器
    showTree(){
      this.$refs.tkitree._show();
    },
  }
};
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>