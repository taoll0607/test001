<template>
  <view class="page">
	    <view class="flex-1">
			<view class="tab is-flex">
		        <view class="listCon" :class="{ 'current': currentTag == index }" v-for="(item, index) in menuList" :key="index"  @click="menuChange(index)">
			        {{ item.title }}
			        <view :class="{ 'line': currentTag == index }"></view>
			     </view>
		    </view>
			<view class="con">
				 <view v-show="currentTag == 0">
				 	<view class="total is-flex">
				 		<view class="data">
				          <view class="title">名片转发数</view>
				          <view class="num">{{totalData.sumShareNum}}</view>
				          <view class="addNum">较昨日 <span>+{{totalData.addShareNum}}</span></view>
				        </view>
				        <view class="data">
				          <view class="title">名片打开数</view>
				          <view class="num">{{totalData.sumOpenNum}}</view>
				          <view class="addNum">较昨日 <span>+{{totalData.addOpenNum}}</span></view>
				        </view>
				        <view class="data">
				          <view class="title">客户新增数</view>
				          <view class="num">{{totalData.sumUserNum}}</view>
				          <view class="addNum">较昨日 <span>+{{totalData.addUserNum}}</span></view>
				        </view>
				 	</view>
				 	<!-- 名片打开次数-->
					<view class="chart">
					    <view class="title is-flex align-center" >
							<view class="line"></view>名片打开次数
						</view>
						<view class="select is-flex">
							<view 
								v-for="(item, index) in dateList"
	          					:key="index"
	      						@click="dateSclect(index,1)">
	      						<view class="selectBtn" :class="{ current: activeTag1 == index }">{{ item.title }}</view>
	      					</view>
	      				</view>
						<view class="qiun-charts" >
							<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts"></canvas>
						</view>
					</view>
					<!-- 名片打开次数 end-->
					<!-- 新增用户数-->
					<view class="chart">
					    <view class="title is-flex align-center" >
							<view class="line"></view>新增用户数
						</view>
						<view class="select is-flex">
							<view 
								v-for="(item, index) in dateList"
	          					:key="index"
	      						@click="dateSclect(index,2)">
	      						<view class="selectBtn" :class="{ current: activeTag2 == index }">{{ item.title }}</view>
	      					</view>
	      				</view>
						<view class="qiun-charts" >
							<canvas canvas-id="canvasLineB" id="canvasLineB" class="charts"></canvas>
						</view>
					</view>
					<!-- 新增用户数 end-->
					<!-- 名片被转发次数-->
					<view class="chart">
					    <view class="title is-flex align-center" >
							<view class="line"></view>名片被转发次数
						</view>
						<view class="select is-flex">
							<view 
								v-for="(item, index) in dateList"
	          					:key="index"
	      						@click="dateSclect(index,3)">
	      						<view class="selectBtn" :class="{ current: activeTag3 == index }">{{ item.title }}</view>
	      					</view>
	      				</view>
						<view class="qiun-charts" >
							<canvas canvas-id="canvasLineC" id="canvasLineC" class="charts"></canvas>
						</view>
					</view>
					<!-- 名片被转发次数 end-->
				 </view>
				 <view v-show="currentTag == 1">
				 	<view class="chart">
				 		<!-- 年龄分布 -->
				        <!-- <view class="title is-flex align-center" >
				          <view class="line"></view>年龄分布
				        </view>
				        <view class="select is-flex">
				          <view class="qiun-charts" >
				            <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
				          </view>
				        </view> -->
				        <!-- 年龄分布 end-->
				        <!-- 性别分布 -->
				        <view class="title is-flex align-center" >
				          <view class="line"></view>性别分布
				        </view>
				        <view class="select is-flex">
				          <view class="qiun-charts" >
				            <canvas canvas-id="canvasRing" id="canvasRing" class="charts"></canvas>
				          </view>
				        </view>
				        <!-- 性别分布 end-->
				    </view>
				 </view>
			</view>
	    </view>

    </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
import ageChart from "./ageChart.vue";
var _self;
var canvaArea1=null;
var canvaArea2=null;
var canvaArea3=null;
var canvaColumn=null;
var canvaRing=null;
/*var columnData = {
  "categories": ["2012", "2013", "2014", "2015", "2016"],
  "series": [{
  "name": "成交量1",
  "data": [15, 20, 45, 37, 43],
  "color": "#FC672F"
  }]
}*/
export default {
	components: {
	    ageChart
	},
	data () {
	    return {
	    	menuList: [
	            { title: '数据统计' },
	            { title: '用户画像' }
	        ],
	        dateList: [
		        { title: '近7日' },
		        { title: '近15日' },
		        { title: '近30日' }
		    ],
	        currentTag: 0,
	        activeTag1: 0,
	        activeTag2: 0,
	        activeTag3: 0,
	        pixelRatio: 1,
	      	cWidth: '',
	      	cHeight: '',
	      	totalData: []
	    };
	 },
	onLoad (e) {
	   _self = this;
	   this.cWidth = uni.upx2px(630);
	   this.cHeight = uni.upx2px(500);
	   this.getTotalData();
	   this.getStatisticalData(1);
	   this.getStatisticalData(2);
	   this.getStatisticalData(3);
	},
	methods: {
	 	menuChange(index) {
	    	this.currentTag = index;
	    	if(index==0){
	    		this.getTotalData();
			   	this.getStatisticalData(1);
			   	this.getStatisticalData(2);
			   	this.getStatisticalData(3);
	    	}else{
	    		this.getSexData();
	    	}
	    },
	    getTotalData(){
			this.$Request.post(this.$api.staff.userSumInfo,
			        {}
			      ).then(res => {
			        if (res.resCode == 39321) {
			            this.totalData = res.resData
			        }
			      }).catch(err => {
			   })
		},
	    getStatisticalData (t) {
	      if(t==1){
				this.$Request.post(this.$api.staff.userOpenAndShareList,
			        {
			          "timeType":this.activeTag1,
			          "type":1
			        }
			      ).then(res => {
			        if (res.resCode == 39321) {
			            let Area={categories:[],series:[]};
						Area.categories=res.resData.categories;
						Area.series=res.resData.series;
						_self.showArea("canvasLineA",Area);
			        }
			      }).catch(err => {
			   })
		    }
		    if(t==2){
		  		this.$Request.post(this.$api.staff.userOpenAndShareList,
			        {
			          "timeType":this.activeTag2,
			          "type":2
			        }
			      ).then(res => {
			        if (res.resCode == 39321) {
			            let Area={categories:[],series:[]};
						Area.categories=res.resData.categories;
						Area.series=res.resData.series;
						_self.showArea("canvasLineB",Area);
			        }
			      }).catch(err => {
			   })
		  	}
		  	if(t==3){
		      this.$Request.post(this.$api.staff.userOpenAndShareList,
			        {
			          "timeType":this.activeTag3,
			          "type":3
			        }
			      ).then(res => {
			        if (res.resCode == 39321) {
			            let Area={categories:[],series:[]};
						Area.categories=res.resData.categories;
						Area.series=res.resData.series;
						_self.showArea("canvasLineC",Area);
			        }
			      }).catch(err => {
			   })
		  	}
	    },
	    /*getAgeData () {
	      uni.showLoading({
	        title: "正在加载数据..."
	      })
	      uni.request({
	        url: 'https://unidemo.dcloud.net.cn/hello-uniapp-ucharts-data.json',
	        data: {},
	        success: function (res) {
	            let Column={categories:[],series:[]};
	            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
	            Column.categories=columnData.categories;
	            Column.series=columnData.series;
	            _self.showColumn("canvasColumn",Column);
	        },
	        fail: () => {
	          _self.tips = "网络错误";
	        },
	        complete () {
	          uni.hideLoading();
	        }
	      });
	    },*/
	    getSexData(){
			this.$Request.post(this.$api.staff.userSex,
			        {}
			      ).then(res => {
			        if (res.resCode == 39321) {
			            let Ring={series:[]};
						Ring.series=res.resData;
						_self.showRing("canvasRing",Ring);
			        }
			      }).catch(err => {
			   })
		},
		showRing(canvasId,chartData){
				canvaRing=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'ring',
					fontSize:12,
					legend:true,
					extra: {
						pie: {
						  offsetAngle: -45,
						  ringWidth: 20*_self.pixelRatio,
						  labelWidth:15
						}
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
				});
		},
	    showColumn(canvasId,chartData){
	      	canvaColumn=new uCharts({
	          $this:_self,
	          canvasId: canvasId,
	          type: 'column',
	          legend:{show:false},
	          fontSize:11,
	          background:'#FFFFFF',
	          pixelRatio:_self.pixelRatio,
	          animation: true,
	          categories: chartData.categories,
	          series: chartData.series,
	          xAxis: {
	            disableGrid:true,
	          },
	          yAxis: {
	            //disabled:true
	          },
	          dataLabel: false,
	          width: _self.cWidth*_self.pixelRatio,
	          height: _self.cHeight*_self.pixelRatio,
	          extra: {
	            column: {
	              type:'group',
	              width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
	            }
	            }
	        });
      	},
	    showArea(canvasId,chartData){
	    	let arr = [...chartData.series[0].data]
  			let max = Math.max(...arr)

  			if(max<10){
  				max = 10
  			}
				canvaArea1=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'area',
					fontSize:12,
					padding: [15, 15, 0, 15],
					legend:{show:false},
					dataLabel:true,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						disableGrid:true,
						gridColor:'#EFF0F8'
					},
					yAxis: {
						max: max,
				        format: (val) => {
				            return val.toFixed(0)
				        } //如不写此方法，Y轴刻度默认保留两位小数				
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						area:{
							type: 'straight',
							opacity:0.2,
							addLine:true,
							width:2,
							gradient:true
						}
					}
				});
				
		},
		/*moveLineA(e) {
			canvaArea1.scroll(e);
		},
		touchEndLineA(e) {
			canvaArea1.scrollEnd(e);
			//下面是toolTip事件，如果滚动后不需要显示，可不填写
			canvaArea1.showToolTip(e, {
				format: function (item, category) {
					return category + ' ' + item.name + ':' + item.data 
				}
			});
		},*/
		dateSclect(index,t){
			if(t == 1){
				this.activeTag1 = index
				this.getStatisticalData(1);
			}else if(t == 2){
				this.activeTag2 = index
				this.getStatisticalData(2);
			}else{
				this.activeTag3 = index
				this.getStatisticalData(3);
			}
		}
	 }
}
</script>

<style lang="scss" scoped>
	@import "./index.scss";
	.qiun-charts {
		width: 630upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 630upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>