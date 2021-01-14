function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
var dateUtils = {
  UNITS: {
    年: 31557600000,
    月: 2629800000,
    天: 86400000,
    小时: 3600000,
    分钟: 60000,
    秒: 1000
  },
  humanize: function(milliseconds) {
    var humanize = ""
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + "前"
        break
      }
    }
    return humanize || "刚刚"
  },
  format: function(dateStr) {
    var date = this.parse(dateStr)
    var diff = Date.now() - date.getTime()
    if (diff < this.UNITS["天"]) {
      return this.humanize(diff)
    }
    var _format = function(number) {
      return number < 10 ? "0" + number : number
    }
    return (
      date.getFullYear() +
			"/" +
			_format(date.getMonth() + 1) +
			"/" +
			_format(date.getDate()) +
			"-" +
			_format(date.getHours()) +
			":" +
			_format(date.getMinutes())
    )
  },
  parse: function(str) {
    //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/)
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
  },
  parseTime(time) {
    if (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
			 * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
			 * */
      var month =
				date.getMonth() + 1 < 10
				  ? "0" + (date.getMonth() + 1)
				  : date.getMonth() + 1
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
      var minutes =
				date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      var seconds =
				date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
      // 拼接
      return (
        year +
				"-" +
				month +
				"-" +
				day +
				" " +
				hours +
				":" +
				minutes +
				":" +
				seconds
      )
    } else {
      return ""
    }
  }
}
/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
function checkUpdateVersion () {
  //判断微信版本是否 兼容小程序更新机制API的使用
  if (uni.canIUse("getUpdateManager")) {
    //创建 UpdateManager 实例
    const updateManager = uni.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        updateManager.onUpdateReady(function () {
          //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
          updateManager.applyUpdate();
        });
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          uni.showModal({
            title: "已经有新版本喽~",
            content:
              "请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~"
          });
        });
      }
    });
  } else {
    //TODO 此时微信版本太低（一般而言版本都是支持的）
    uni.showModal({
      title: "溫馨提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  }
}
module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  dateUtils: dateUtils,
  checkUpdateVersion
}
