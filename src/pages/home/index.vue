<template>
  <view :class="isBind ? 'page' : ''">
    <template v-if="isBind">
      <!-- 名片 -->
      <view class="card">
        <view class="is-flex">
          <view class="left-block">
            <image :src="staffInfo.figure" />
            <view class="realName">{{ staffInfo.realName }}</view>
          </view>
          <view class="rigth-block">
            <view class="is-flex align-center">
              <image src="../../static/manager/position.png" />
              <view class="txt">{{ staffInfo.position }}</view>
            </view>
            <view class="is-flex align-center">
              <image src="../../static/manager/phone.png" />
              <view class="txt">{{ staffInfo.mobile }}</view>
            </view>
            <!-- <view class="is-flex align-center">
              <image src="../../static/manager/location.png" />
              <view class="txt location">{{ staffInfo.businessAddress }}</view>
            </view> -->
          </view>
        </view>
        <!-- <view class="visit-data is-flex">
          <view class="visiter">
            最近 1230923 人浏览
          </view>
          <view class="is-flex align-center">
            <image src="../../static/manager/zan.png" />赞 25
          </view>
        </view> -->
        <view class="is-flex btn-row">
          <view class="btn send-btn" @tap="gotoSendCard">发送名片</view>
          <view class="btn watch-btn" @tap="gotoCustomer">查看名片</view>
        </view>
      </view>
      <!-- 名片 end-->
      <!-- 最新动态  -->
      <view class="news" @tap="goToNews">
        <view class="header is-flex align-center">
          <view class="title flex-1">
            <view class="txt">最新动态</view>
            <view class="line"></view>
          </view>
          <image src="../../static/manager/arrow_right.png" />
        </view>
        <view class="news-item is-flex" v-if="dynamicList.length > 0">
          <view class="flex-1">{{ dynamicList[0].desc }}</view>
          <view class="time">{{ parseTime(dynamicList[0].createTime) }}</view>
        </view>
      </view>
      <!--  最新动态 end-->
      <!-- 数据统计-->
      <view class="chart">
        <view class="title is-flex align-center">
          <view class="line"></view>
          数据统计
        </view>
        <view>
          <canvas
            canvas-id="canvasLineA"
            id="canvasLineA"
            class="charts"
            @touchstart="touchLineA"
          ></canvas>
        </view>
      </view>
      <!-- 数据统计 end-->
    </template>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
import util from '@/common/util';
var _self;
var canvasObj = {};
export default {
  data () {
    return {
      pixelRatio: 1,

      cWidth: '',
      cHeight: '',
      loadingType: 0,
      page: 1,
      staffInfo: {},
      list: [],
      dynamicList: [],
      lineData: {
        categories: [],
        series: []
      },
      type: 1,
      isBind: uni.getStorageSync('phone') || '',
      phone: uni.getStorageSync('phone'),
    }
  },
  onLoad (e) {
    if (e.isBind) {
      this.isBind = true
    }
    _self = this;
    this.cWidth = uni.upx2px(630);
    this.cHeight = uni.upx2px(600);

    // #ifdef H5  
    if (this.$wechat && this.$wechat.isWechat()) {

      this.getSnsapiUserinfo(e)
    }
    // #endif
  },
  onShow () {
    //alert(`${this.phone}   ${uni.getStorageSync('phone')}   ${String(this.isBind)}`)
    if (this.phone != '') {
      this.loadStaffInfo();
      this.getLineData();
      this.getDynamicList();
    }

    // else {
    //   this.gotoBindPhone()
    // }

  },
  methods: {
    getSnsapiUserinfo (e) {
      let code = e.code; //是否存在code  
      let openId = uni.getStorageSync("openId");

      if (e.code) {
        this.$Request.post(this.$api.wechat.snsapiUserinfo, {
          code,
          type: e.type,
          formworkId: e.formworkId,
          phone: e.phone,
          isCustomer: 0,
        }).then(res => {
          if (res.resCode == 39321) {
            uni.setStorageSync("Authorization", res.resData.Authorization);
            uni.setStorageSync('snsapiUserinfo', res.resData)
            if (res.resData.staffPhoneFlag != 1) {
              this.gotoBindPhone()
            } else {
              this.isBind = true
              uni.setStorageSync("phone", res.resData.staffPhone);
              this.phone = res.resData.staffPhone
              console.log("授权信息成功")
              this.loadStaffInfo();
              this.getLineData();
              this.getDynamicList();
            }
          } else {
            //code 失效
            if (res.resCode == 7) {
              let appid = window.APPID //为测试号id
              let local = window.location.origin + '/h5'
              let state = this.$wechat.getUrlParam("state") || 1
              //不存在就打开上面的地址进行授权
              window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.APPID}&redirect_uri=${encodeURIComponent(
                local
              )}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
            }
          }
        })
      }
    },
    parseTime (time) {
      let str = util.dateUtils.parseTime(time)
      str = str.split(' ')[1].split(":")
      return str[0] + ":" + str[1]
    },
    getDynamicList () {
      this.$Request.post(this.$api.staff.dynamicList).then(res => {
        if (res.resCode == 39321) {
          this.dynamicList = res.resData.rows;
        }
      })
    },
    getLineData () {

      this.$Request.post(this.$api.staff.staffDaily).then(res => {
        if (res.resCode == 39321) {
          this.lineData = res.resData
          this.showLineA("canvasLineA", this.lineData);
        }
      })
    },

    gotoBindPhone () {
      uni.showModal({
        title: "提示",
        content: "您的手机号尚未绑定，请先绑定",
        success: function (res) {
          if (res.confirm) {
            uni.reLaunch({
              url: '/pages/login/bindPhone'
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })

    },
    gotoSendCard () {
      console.log(this.staffInfo)
      if (this.phone == "") {
        this.gotoBindPhone()
        return
      }
      let data = {
        realName: this.staffInfo.realName,
        companyName: this.staffInfo.companyName,
        figure: this.staffInfo.figure,
        mobile: this.staffInfo.mobile,
      }
      uni.navigateTo({
        url: '/pages/home/sendCard?staffInfo=' + encodeURIComponent(JSON.stringify(data))
      })
    },
    touchLineA (e) {
      canvasObj['canvasLineA'].scrollStart(e);
    },
    moveLineA (e) {
      canvasObj['canvasLineA'].scroll(e);
    },
    touchEndLineA (e) {
      canvasObj['canvasLineA'].scrollEnd(e);
      //下面是toolTip事件，如果滚动后不需要显示，可不填写
      canvasObj['canvasLineA'].showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        }
      });
    },
    showLineA (canvasId, chartData) {
      let arr = [...chartData.series[0].data, ...chartData.series[1].data]
      let max = Math.max(...arr)
      let min = Math.min(...arr)


      if (max < 10) {
        min = Math.min(min, 0)
        max = 10;
      }
      else if (10 < max < 250) {
        min = Math.min(min, 10)
        max = 250;
      }
      else if (250 < max < 1000) {
        min = Math.min(min, 250)
        max = 1000;
      }
      else if (1000 < max < 2500) {
        min = Math.min(min, 1000)
        max = 2500;
      }
      else if (2500 < max < 5000) {
        min = Math.min(min, 2500)
        max = 5000;
      }
      else if (5000 < max < 10000) {
        min = Math.min(min, 5000)
        max = 10000;
      }
      else if (10000 < max) {
        min = Math.min(min, 10000)
        max = max
      }

      console.log("max", max, min)

      canvasObj[canvasId] = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'line',
        fontSize: 11,
        padding: [15, 15, 0, 15],
        legend: {
          show: true,
          padding: 5,
          lineHeight: 11,
          margin: 5,
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        //animation: false, 
        //enableScroll: true, //开启图表拖拽功能
        xAxis: {
          disableGrid: true,
          // type: 'grid',
          // gridType: 'dash',
          // itemCount: 4,
          // scrollShow: true,
          // scrollAlign: 'left',
          // scrollBackgroundColor: '#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
          // scrollColor: '#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
        },
        yAxis: {
          //disabled:true
          // gridType: 'dash',
          // splitNumber: 8,
          min: min,
          max: max,
          format: (val) => {
            return val.toFixed(0)
          } //如不写此方法，Y轴刻度默认保留两位小数
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: true,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        },
      });

    },
    goToNews () {
      uni.navigateTo({
        url: '/pages/home/news'
      })
    },
    gotoCustomer () {
      if (this.phone == "") {
        this.gotoBindPhone()
        return
      }
      uni.navigateTo({
        url: `/pages/studio/index?phone=${this.staffInfo.mobile}`
      })
    },

    loadStaffInfo () {
      this.$Request.post(this.$api.open.staffInfo, {
        phone: this.phone
      }).then(res => {
        if (res.resCode == 39321) {
          this.staffInfo = res.resData
          // this.$wechat.share(
          //   {
          //     title: this.staffInfo.realName,
          //     desc: '银行描述',
          //     img: this.staffInfo.figure,
          //   },
          //   window.location.origin + '/h5/'
          // );

        }

      })
    },

  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
.charts {
  width: 630upx;
  height: 600upx;
  background-color: #ffffff;
}
</style>