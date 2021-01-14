<template>
  <!-- 名片打开次数-->
      <view class="chart">
          <view class="title is-flex align-center" >
          <view class="line"></view>年龄分布
        </view>
        <view class="select is-flex">
          <view class="qiun-charts" >
            <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
          </view>
        </view>
      </view>
  <!-- 名片打开次数 end-->
</template>
<script>
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
var canvaColumn=null;
var chartData = {
  "categories": ["2012", "2013", "2014", "2015", "2016"],
  "series": [{
  "name": "成交量1",
  "data": [15, 20, 45, 37, 43],
  "color": "#FC672F"
  }]
}
export default {
  data () {
    return {
      pixelRatio: 1,
      cWidth: '',
      cHeight: '',
      piearr:[]
    };
  },
  created() {
    _self = this;
    this.cWidth=uni.upx2px(630);
    this.cHeight=uni.upx2px(700);
    this.getServerData();
  },
  methods: {
    getServerData () {
      uni.showLoading({
        title: "正在加载数据..."
      })
      uni.request({
        url: 'https://unidemo.dcloud.net.cn/hello-uniapp-ucharts-data.json',
        data: {},
        success: function (res) {
            _self.serverData=chartData;
            let Column={categories:[],series:[]};
            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
            Column.categories=chartData.categories;
            Column.series=chartData.series;
            _self.showColumn("canvasColumn",Column);
        },
        fail: () => {
          _self.tips = "网络错误";
        },
        complete () {
          uni.hideLoading();
        }
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
              width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length,
            }
            }
        });
        
      },
    touchColumn(e){
      canvaColumn.showToolTip(e, {
        format: function (item, category) {
          if(typeof item.data === 'object'){
            return category + ' ' + item.name + ':' + item.data.value 
          }else{
            return category + ' ' + item.name + ':' + item.data 
          }
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.qiun-padding {
  padding: 2%; 
  width: 96%;
}
.qiun-wrap{
  display: flex; 
  flex-wrap: wrap;
}
.qiun-rows {
  display:flex; 
  flex-direction:row !important;
}
.qiun-columns {
  display:flex; 
  flex-direction:column !important;
}
.qiun-common-mt {
  margin-top: 10upx;
}
.qiun-bg-white {
  background: #FFFFFF;
}
.qiun-title-bar {
  width:96%; 
  padding:10upx 2%; 
  flex-wrap:nowrap;
}
.qiun-title-dot-light {
  border-left: 10upx solid #0ea391; 
  padding-left: 10upx; 
  font-size: 32upx;
  color: #000000
}
.qiun-charts {
  width: 630upx; 
  height:700upx;
  background-color: #FFFFFF;
}
.charts {
  width: 630upx; 
  height:700upx;
  background-color: #FFFFFF;
}
</style>