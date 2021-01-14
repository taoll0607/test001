var jweixin = require("jweixin-module")
export default {
  //判断是否在微信中
  isWechat: function() {
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/micromessenger/i) == "micromessenger") {
      //console.log('是微信客户端')
      return true
    } else {
      //console.log('不是微信客户端')
      return false
    }
  },
  getUrlParam: name => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },
  getUserInfo() {
    if (this.isWechat()) {
      let appid = window.APPID //为测试号id
      let code = this.getUrlParam("code") //是否存在code
      let local = window.location.href
      let state = this.getUrlParam("state") || 1
      console.log(local)
      if (code == null || code === "") {
        //不存在就打开上面的地址进行授权
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          local
        )}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
      }
    }
  },
  initJssdk: function(callback) {
    var uri = encodeURIComponent(window.location.href.split("#")[0]) //获取当前url然后传递给后台获取授权和签名信息
    uni.request({
      url: window.APIHOST + "/wechat/sign", //你的接口地址
      data: {
        url: uri
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: response => {
        if (response.data.resCode == "39321") {
          let res = response.data

          uni.setStorageSync("signature", res.resData.signature)
          //返回需要的参数appId,timestamp,noncestr,signature等
          //注入config权限配置
          jweixin.config({
            debug: false,
            appId: res.resData.appid,
            timestamp: res.resData.timestamp,
            nonceStr: res.resData.noncestr,
            signature: res.resData.signature,
            jsApiList: [
              //这里是需要用到的接口名称
              "checkJsApi", //判断当前客户端版本是否支持指定JS接口
              "updateAppMessageShareData", //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
              "updateTimelineShareData", //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
              "onMenuShareTimeline",
              "onMenuShareAppMessage", //分享接口
              "getLocation", //获取位置
              "openLocation", //打开位置
              "scanQRCode", //扫一扫接口
              "chooseWXPay", //微信支付
              "chooseImage", //拍照或从手机相册中选图接口
              "previewImage", //预览图片接口
              "uploadImage" //上传图片
            ]
          })
          if (callback) {
            callback(res.resData)
          }
        }
      }
    })
  },
  //在需要自定义分享的页面中调用
  share: function(data, url, callback) {
    url = url ? url : window.location.href
    if (!this.isWechat()) {
      return
    }
    //每次都需要重新初始化配置，才可以进行分享
    this.initJssdk(function(signData) {
      jweixin.ready(function() {
        var shareData = {
          title: data && data.title ? data.title : "signData.site_name",
          desc: data && data.desc ? data.desc : "signData.site_description",
          link: url,
          imgUrl: data && data.img ? data.img : "signData.site_logo",
          success: function(res) {
            console.log(res, "callback")
            //用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的
          }
        }
        if (callback) {
          callback()
        }
        jweixin.updateAppMessageShareData(shareData)
        jweixin.updateTimelineShareData(shareData)

        //分享给朋友接口
        jweixin.onMenuShareAppMessage(shareData)
        //分享到朋友圈接口
        jweixin.onMenuShareTimeline(shareData)
      })
    })
  },
  //在需要定位页面调用
  getlocation: function(callback) {
    if (!this.isWechat()) {
      //console.log('不是微信客户端')
      return
    }
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.getLocation({
          type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            // console.log(res);
            callback(res)
          },
          fail: function(res) {
            console.log(res)
          }
          // complete:function(res){
          //     console.log(res)
          // }
        })
      })
    })
  },
  openlocation: function(data, callback) {
    //打开位置
    if (!this.isWechat()) {
      //console.log('不是微信客户端')
      return
    }
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.openLocation({
          //根据传入的坐标打开地图
          latitude: data.latitude,
          longitude: data.longitude
        })
      })
    })
  },
  chooseImage: function(callback) {
    //选择图片
    if (!this.isWechat()) {
      //console.log('不是微信客户端')
      return
    }
    //console.log(data);
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album"],
          success: function(rs) {
            callback(rs)
          }
        })
      })
    })
  },
  //微信支付
  wxpay: function(data, callback) {
    if (!this.isWechat()) {
      //console.log('不是微信客户端')
      return
    }
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.chooseWXPay({
          timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paysign, // 支付签名
          success: function(res) {
            // console.log(res);
            callback(res)
          },
          fail: function(res) {
            callback(res)
          }
          // complete:function(res){
          //     console.log(res)
          // }
        })
      })
    })
  }
}
