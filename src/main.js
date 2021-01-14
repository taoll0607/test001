import Vue from "vue"
import App from "./App"
import httpApi from "./common/httpApi"
import HttpRequest from "./common/httpRequest"
import store from "./store"
// #ifdef H5
import wechat from "./common/wechat"
if (wechat.isWechat()) {
	Vue.prototype.$wechat = wechat
}
// #endif
Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = httpApi
Vue.prototype.$Request = HttpRequest
Vue.prototype.$Sysconf = HttpRequest.config
App.mpType = "app"

const app = new Vue({
	store,
	...App
})
app.$mount()
