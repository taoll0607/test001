<script>
import wechat from '@/common/wechat';


export default {
  onLaunch: function () {
    console.log('App Launch');
    if (wechat.getUrlParam('show_share')) {
      return
    }
    wechat.getUserInfo();
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    test: ''
  }
}
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";
.is-flex {
  display: flex;
}
.is-column {
  flex-direction: column;
}
.flex-1 {
  flex: 1;
}
.is-center {
  text-align: center !important;
}
.row-reverse {
  flex-direction: row-reverse;
}
.align-center {
  align-items: center;
}
.content-center {
  justify-content: center;
}
</style>
