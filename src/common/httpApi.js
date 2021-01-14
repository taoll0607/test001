/**
 * API接口配置文件
 */
const api = {
  wechat: {
    sign: "/wechat/sign", // 微信jsapi_ticket签名
    snsapiUserinfo: "/wechat/snsapiUserinfo" // 获取用户信息
  },
  open: {
    staffInfo: "/open/staff/staffInfo", //获取经理信息
    formworkInfo: "/open/formwork/formworkInfo", //版式详情
    getArticleList: "/open/article/getArticleList", //内容列表
    articleDetail: "/open/article/articleDetail", //内容详情
    logOperation: "/open/user/logOperation" //记录用户点击操作
  },
  staff: {
    updateShareTimes: "/open/wechat/share", //更新分享次数
    myUserList: "/staff/user/myUserList", //客户-我的客户列表数据
    userInfo: "/staff/user/userInfo", //客户详情
    userDetail: "/staff/user/userDetail", //客户详情
    updateAddress: "/staff/user/updateAddress", //我的客户更新地址
    updateEmail: "/staff/user/updateEmail", //我的客户更新邮箱
    updateNote: "/staff/user/updateNote", //我的客户更新备注
    updatePhone: "/staff/user/updateMobile", //我的客户更新手机号
    rankList: "/staff/analysis/businessRanking", //团队-业务排行
    summaryList: "/staff/analysis/overview", //团队-概括
    cardList: "/staff/analysis/staffCard", //团队-员工名片
    orgTreeList: "/staff/analysis/orgTree", //团队-组织树详情
    staffDaily: "/staff/analysis/staffDaily", //折线图
    dynamicList: "/staff/dynamic/dynamicList", // 动态列表
    userOpenAndShareList: "/staff/digital/userOpenAndShareList", // 数据统计
    userSumInfo: "/staff/digital/userSumInfo", // 数据统计
    userSex: "/staff/digital/userSex" // 用户画像
  },
  formwork: {
    formworkList: "/staff/formwork/formworkList" // 版式列表
  },
  miniProgram: {
    getPhoneNumWithJsCode: "/miniProgram/getPhoneNumWithJsCode"
  },
  bindPhone: {
    doMobile: "/open/staff/doMobile", //绑定手机
    registerPhoneCode: "/open/staff/registerPhoneCode" //获取手机验证码
  }
}
module.exports = api
