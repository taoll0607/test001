<template>
  <view>
    <view :class="`page${type}`">
      <!-- <view class="bank is-flex">
        <view class="bank-logo"></view>
        <view class="bank-logo-text"></view>
      </view> -->
      <view class="card ">
        <template v-if="type == 1">
          <view class="is-flex">
            <image class="avatar" :src="staffInfo.figure" />
            <view class="card-info">
              <view class="name">{{ staffInfo.realName }}</view>
              <view class="dept">电子银行科技部 客户经理</view>
              <view class="number">NO.{{ staffInfo.empNo }}</view>
              <view class="btn" @tap="showModal('Certificate')">
                查看资格证书 >
              </view>
            </view>
          </view>
        </template>
        <template v-if="type == 2">
          <view class="number">NO.{{ staffInfo.empNo }}</view>

          <image class="avatar" :src="staffInfo.figure" />
          <view class="is-flex card-info align-center is-column">
            <view class="name">{{ staffInfo.realName }}</view>
            <view class="dept">电子银行科技部 客户经理</view>

            <view class="is-flex align-center icon-row">
              <view class="btn" @tap="showModal('Certificate')">
                查看资格证书
              </view>
              <view class="QR" @tap="showModal('QR')"></view>
              <view class="phone" @tap="call"></view>
            </view>
          </view>
        </template>
        <view class="zan" :class="{ red: isZan }" @tap="toggleZan"></view>
        <template v-if="type == 1">
          <view class="QR" @tap="showModal('QR')"></view>
          <view class="phone" @tap="call"></view>
        </template>
        <view class="domain" @tap="showModal('Skill')">
          擅长领域：{{ staffInfo.skill }}
        </view>
      </view>
      <view class="is-flex ctt1" v-show="frameData.formwork.firstModuleStatus==1">
        <view
          class="is-flex ctt1-item"
          v-for="(item, index) in frameData.firstModuleList"
          :key="index"
          @tap="navigateTo(item)"
        >
          <image :src="FILESERVICE + item.uploadPicture" />
          <view class="txt">{{ item.content }}</view>
        </view>
      </view>
      <view class="title is-flex align-center" v-show="frameData.formwork.secondModuleStatus==1">
        <view class="line" v-if="type == 2"></view>
        {{ frameData.formwork.secondName }}
      </view>
      <view class="is-flex ctt2" v-show="frameData.formwork.secondModuleStatus==1">
        <view
          class="is-flex ctt2-item "
          v-for="(item, index) in frameData.secondModuleList"
          :key="index"
          @tap="navigateTo(item)"
        >
          <image :src="FILESERVICE + item.uploadPicture" />
          <view class="txt">
            {{ item.content }}
          </view>
        </view>
      </view>

      <view class="title is-flex align-center" v-show="frameData.formwork.thirdModuleStatus==1">
        <view class="line" v-if="type == 2"></view>
        {{ frameData.formwork.thirdName }}
      </view>
      <view class="is-flex ctt3" id="ctt3" v-show="frameData.formwork.thirdModuleStatus==1">
        <view
          class="is-flex ctt3-item"
          v-for="(item, index) in frameData.thirdModuleList"
          :key="index"
          @tap="navigateTo(item)"
        >
          <image :src="FILESERVICE + item.uploadPicture" />
          <view class="txt pos">{{ item.content }}</view>
        </view>
      </view>
    </view>
    <Footer :type="type" :data="frameData.formwork" />
    <view class="shareit" v-if="show_share">
      <image class="arrow" src="../../static/manager/jiant.png"></image>
      <text class="follow">点击右上角按钮！【发送给朋友】</text>
    </view>
    <Modal ref="modalCertificate">
      <image
        class="credentials"
        v-for="(item, index) in staffInfo.credentials"
        :key="index"
        :src="FILESERVICE + item"
      />
    </Modal>
    <Modal ref="modalSkill">
      <view class="txt-left">{{ staffInfo.skill }}</view>
    </Modal>
    <Modal ref="modalQR">
      <view>
        <image class="credentials" :src="FILESERVICE + staffInfo.wxQr" />
      </view>
    </Modal>
  </view>
</template>

<script>
import Footer from '@/components/footer/index.vue';
import wechat from '@/common/wechat';
import Modal from '@/components/modal.vue';

export default {
  components: {
    Footer,
    Modal,
  },
  data () {
    return {
      show_share: false,
      type: '1',
      isZan: false,
      FILESERVICE: window.FILESERVICE,
      formworkId: 'db7d129921814e49a4dd10d83c4a06ad',
      phone: "",
      frameData: {
        firstModuleList: [],
        secondModuleList: [],
        thirdModuleList: [],
        fourthModuleList: [],
        formwork: {}
      },
      staffInfo: {
        figure: ''
      }
    }
  },

  onLoad (e) {
    console.log(e)
    if (e.show_share) {
      this.show_share = true
    }
    if (e.type) {
      this.type = e.type
    }
    if (e.phone) {
      this.phone = e.phone
    }
    if (e.formworkId) {
      this.formworkId = e.formworkId
    }

    let snsapiUserinfo = uni.getStorageSync('snsapiUserinfo')
    // #ifdef H5  
    if (snsapiUserinfo == '') {
      if (this.$wechat && this.$wechat.isWechat()) {
        let code = e.code; //是否存在code  

        this.$Request.post(this.$api.wechat.snsapiUserinfo, {
          code,
          type: e.type,
          formworkId: e.formworkId || '7ab4c772c276421db793230deddd398b',
          phone: e.phone,
          isCustomer: 1,
        }).then(res => {
          if (res.resCode == 39321) {
            uni.setStorageSync("Authorization", res.resData.Authorization);
            uni.setStorageSync('snsapiUserinfo', res.resData)
            // this.$wechat.share(
            //   {
            //     title: this.staffInfo.realName,
            //     desc: '银行描述',
            //     img: this.staffInfo.figure,
            //   },
            //   `${window.location.origin}/h5/pages/studio/index?phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}`
            //   , () => {
            //     // alert(`${window.location.origin}/h5/pages/studio/index?phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}`)
            //   });
          }
        })
      }
    }
    // #endif
    this.loadStaffInfo()
    this.formworkInfo()
  },

  methods: {
    logOperation (item) {
      this.$Request.post(this.$api.open.logOperation, {
        formworkModuleId: item.id,
        moduleContent: item.content
      }).then(res => {
        console.log(res)
      })
    },
    updateShareTimes () {

      this.$Request.post(this.$api.staff.updateShareTimes, {
        formworkId: this.formworkId,
        signature: uni.getStorageSync("signature"),
        type: this.type,
      }).then(res => {
        console.log("updateShareTimes", res)
      })
    },
    navigateTo (item) {
      this.$Request.post(this.$api.open.logOperation, {
        formworkModuleId: item.id,
        moduleContent: item.content
      }).then(res => {
        console.log(res)
        if (item.jumpType == 1) {
          // #ifdef H5  
          window.location.href = item.jumpLink
          // #endif
        } else if (item.jumpType == 0) {
          uni.navigateTo({
            url: '/pages/listTPL/index?params=' + encodeURIComponent(JSON.stringify(item))
          })
        }
        else if (item.jumpType == 3) {
          uni.navigateTo({
            url: '/pages/listTPL/detail?type=3&params=' + encodeURIComponent(JSON.stringify(item))
          })
        }
      })
    },
    showModal (field) {
      this.$refs[`modal${field}`].open()
    },
    toggleZan () {
      this.isZan = !this.isZan
    },
    call () {
      uni.makePhoneCall({
        phoneNumber: this.staffInfo.mobile
      });
    },
    loadStaffInfo () {
      this.$Request.post(this.$api.open.staffInfo, {
        phone: this.phone
      }).then(res => {
        this.staffInfo = res.resData
        //alert(res.resData.realName)
        // #ifdef H5  
        this.$wechat.share(
          {
            title: this.staffInfo.realName,
            desc: '银行描述',
            img: this.staffInfo.figure,
          },
          `${window.location.origin}/h5/pages/studio/index?phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}`
          , () => {
            console.log("share callback")
            if (this.show_share) {
              this.updateShareTimes()
            }

            //alert(`${window.location.origin}/h5/pages/studio/index?phone=${this.staffInfo.mobile}&type=${this.type}&formworkId=${this.formworkId}`)
          });
        // #endif
      })
    },
    formworkInfo () {
      this.$Request.post(this.$api.open.formworkInfo, {
        formworkId: this.formworkId
      }).then(res => {
        if (res.resCode == 39321) {
          this.frameData = res.resData
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./style1.scss";
@import "./style2.scss";
.txt-left {
  text-align: left;
}
.credentials {
  width: 200rpx;
  height: 200rpx;
}
.shareit {
  -webkit-user-select: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  text-align: center;
  top: 0;
  left: 0;
  z-index: 999;

  image {
    max-width: 100%;
  }

  .arrow {
    width: 100rpx;
    height: 150rpx;
    position: absolute;
    right: 5%;
    top: 1%;
  }

  .follow {
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    text-decoration: none;
    font-size: 28rpx;
    color: white;
    float: left;
    margin-top: 260rpx;
  }
}
</style>