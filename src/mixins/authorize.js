export default {
  data () {
    return {}
  },
  methods: {
    //failcallback没有授权回调，弹出授权弹窗
    checkLogin (failcallback, loginCallback) {
      var token = uni.getStorageSync('token')
      var uuid = uni.getStorageSync('uuid')
      uni.getSetting({
        success: res => {
          let authSetting = res.authSetting

          if (authSetting && !authSetting['scope.userInfo']) {
            if (failcallback) {
              console.log('authSetting', authSetting)
              failcallback()
            }
          } else if (!token || !uuid) {
            this.getUserInfoToLogin(loginCallback)
          }
        }
      })
    },
    
    loginWithCode ( code, res_user, callback) { 
        
      let { iv, encryptedData } = res_user
      let { avatarUrl, nickName } = res_user.userInfo
      console.log(res_user)
      let params = {
        jsCode:  code,
        iv,
        encryptedData,
        ip: '',
        deviceUA: '',
        avatarUrl,
        nickname:nickName
      }
      uni.showLoading({
        title: '登录中...'
      })
      this.$Request
        .post(this.$api.common.login, params)
        .then(resLogin => {
          uni.hideLoading()
          let data = resLogin.data
          if (resLogin.code == 200) {
            uni.setStorageSync('token', data.token)
            uni.setStorageSync('uuid', data.uuid)
            uni.setStorageSync('userId', data.uuid)
            uni.setStorageSync('silverAccount', data.silverAccount)
            uni.setStorageSync('goldAccount', data.goldAccount)
            uni.setStorageSync('isLogin', '1')
            if (callback) {
              callback()
            }
          } else if (resLogin.code == '0001'){
            uni.showToast({
              title: '授权登录失败',
              icon: 'none',
              duration: 3000
            }) 
          }  
        }) 
    },
    getUserInfoToLogin (callback) {
      console.log('getUserInfoToLogin')
      uni.getUserInfo({
        provider: 'weixin',
        success: res_user => {
          console.log('getUserInfo', res_user)
          this.login(res_user, callback)
        }
      })
    },
    //获取用户信息
    loadUserInfo (callback) {
      this.$Request
        .get(this.$api.wechat.personalInfo, {
          uuid: uni.getStorageSync('uuid')
        })
        .then(res => {
          if (res.code == 200) {
            let data = res.data
            uni.setStorageSync('vipCode', data.vipCode)
            uni.setStorageSync('avatarUrl', data.avatarUrl)
            uni.setStorageSync('nickname', data.nickname)
            uni.setStorageSync('inviteCode', data.inviteCode)
            uni.setStorageSync('isLogin', '1')
            if (callback) {
              callback(data)
            }
          }
        })
        .catch(err => { })
    }
  }
}
