import configdata from "./config"
import httpApi from "./httpApi"
module.exports = {
  config: function(name) {
    var info = null
    if (name) {
      var name2 = name.split(".") //字符分割
      if (name2.length > 1) {
        info = configdata[name2[0]][name2[1]] || null
      } else {
        info = configdata[name] || null
      }
    }
    return info
  },
  post: function(url, data, contentType) {
    url = this.config("APIHOST") + url
    let header = this.getHeader(contentType, url)

    return new Promise((succ, error) => {
      uni.request({
        url: url,
        data: data,
        method: "POST",
        header: header,
        success: result => {
          //token过期
          let code = result.data.code

          let callback = token => {
            uni.request({
              url: url,
              data: data,
              method: "POST",
              header: header,
              success: result => {
                succ.call(this, result.data)
              }
            })
          }
          if (code == "0002" || code == "0003") {
            this.getUserInfoToLogin(callback)
          } else if (code == "0004") {
            this.refreshToken(callback)
          } else succ.call(self, result.data)
        },
        fail: function(e) {
          console.log(e)
          error.call(self, e)
        }
      })
    })
  },
  getHeader(contentType, url) {
    let header = {}
    const token = uni.getStorageSync("Authorization")
    //const uuid = uni.getStorageSync("uuid")
    if (token) {
      header["Authorization"] = token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // if (uuid) {
    //   header["userId"] = uuid
    // }
    header["content-type"] = contentType || "application/x-www-form-urlencoded"
    return header
  },
  get: function(url, data, contentType) {
    let header = this.getHeader(contentType, url)

    url = this.config("APIHOST") + url
    return new Promise((succ, error) => {
      uni.request({
        url: url,
        data: data,
        method: "GET",
        header: header,
        success: result => {
          //token过期
          let code = result.data.code

          let callback = token => {
            uni.request({
              url: url,
              data: data,
              method: "GET",
              header: this.getHeader(contentType, url),
              success: result => {
                succ.call(this, result.data)
              }
            })
          }
          if (code == "0002" || code == "0003") {
            this.getUserInfoToLogin(callback)
          } else if (code == "0004") {
            this.refreshToken(callback)
          } else succ.call(self, result.data)
        },
        fail: function(e) {
          error.call(self, e)
        }
      })
    })
  },

  login(callback) {
    uni.login({
      provider: "weixin",
      success: res => {
        if (res.code) {
          uni.getUserInfo({
            provider: "weixin",
            success: res_user => {
              let { iv, encryptedData } = res_user
              let { avatarUrl, nickName } = res_user.userInfo
              console.log(res_user)
              let params = {
                jsCode: res.code,
                iv,
                encryptedData,
                ip: "",
                deviceUA: "",
                avatarUrl,
                nickName
              }
              if (this.inviterId != "") {
                params.inviterId = this.inviterId
              }
              uni.request({
                url: this.config("APIHOST") + httpApi.common.login,
                data: params,
                method: "POST",
                success: resLogin => {
                  let res = resLogin.data
                  if (res.code == "0005") {
                    uni.showToast({
                      title: "您的账号已被冻结，如有疑问，请联系客服",
                      icon: "none",
                      duration: 2000
                    })
                    return
                  }
                  if (res.code == "200") {
                    console.log(res)
                    let data = res.data
                    this.storeData(data)
                    if (callback) {
                      callback(data.token)
                    }
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  storeData(data) {
    uni.setStorageSync("token", data.token)
    uni.setStorageSync("uuid", data.uuid)
    uni.setStorageSync("userId", data.uuid)
    uni.setStorageSync("silverAccount", data.silverAccount)
    uni.setStorageSync("goldAccount", data.goldAccount)
    uni.setStorageSync("isLogin", "1")
  },
  getUserInfoToLogin(callback) {
    this.login(callback)
  },
  refreshToken(callback) {
    uni.request({
      url: this.config("APIHOST") + httpApi.common.refreshToken,
      data: { refreshToken: uni.getStorageSync("refreshToken") },
      method: "GET",
      success: response => {
        let res = response.data

        if (res.code == "200") {
          let data = res.data
          this.storeData(data)
          uni.setStorageSync("refreshToken", data.refreshToken)
          if (callback) {
            callback(data.token)
          }
        } else {
          this.login(callback)
        }
      }
    })
  }
}
