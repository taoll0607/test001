<template>
  <view class="page">
    <view class="title">绑定手机号</view>
    <view class="ctt">
      <view class="uni-form-item">
        <view class="label">手机号码</view>
        <input
          type="number"
          placeholder-style="color:#999;font-weight:normal"
          class="input"
          placeholder="请输入手机号"
          @input="bindInput"
          :value="formData.phone"
          data-val="phone"
          maxlength="11"
        />

        <button
          class="code-btn"
          :class="{ active: !disableCodeBtn }"
          :disabled="disableCodeBtn"
          @tap="sendCode"
        >
          {{ codeBtn.text }}
        </button>
      </view>
      <view class="uni-form-item">
        <view class="label">验证码</view>
        <input
          type="number"
          placeholder-style="color:#999;font-weight:normal"
          class="input"
          placeholder="请输入验证码"
          @input="bindInput"
          :value="formData.code"
          data-val="code"
        />
      </view>
      <view class="text"
        >点击确定即同意<text class="xieyi">《银行云平台用户协议》</text></view
      >
      <button class="submit-btn" @tap="bindPhone">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      seconds: 60,
      codeBtn: {
        text: "获取验证码",
        waitingCode: false,
        count: this.seconds
      },
      formData: {
        phone: "",
        code: ""
      }
    };
  },
  onLoad () {
    uni.setNavigationBarTitle({
      title: '绑定手机号'
    })
  },
  computed: {
    disableCodeBtn: function () {
      return this.codeBtn.waitingCode;
    }
  },
  methods: {
    bindInput (e) {
      var dataval = e.currentTarget.dataset.val;
      this.formData[dataval] = e.detail.value;
    },
    sendCode: function () {
      if (!/^1[34578]\d{9}$/.test(this.formData.phone)) {
        uni.showToast({
          title: "手机号格式错误",
          icon: "none",
          duration: 2000
        });
        return;
      }

      this.codeBtn.waitingCode = true;
      this.codeBtn.count = this.seconds;
      this.codeBtn.text = this.codeBtn.count + "s";
      let countdown = setInterval(() => {
        this.codeBtn.count--;
        this.codeBtn.text = this.codeBtn.count + "s";
        if (this.codeBtn.count < 0) {
          clearInterval(countdown);
          this.codeBtn.text = "重新发送";
          this.codeBtn.waitingCode = false;
        }
      }, 1000);
      this.$Request.post(this.$api.bindPhone.registerPhoneCode,
        {
          mobile: this.formData.phone
        }
      ).then(res => {
        if (res.resCode == -1) {
          uni.showToast({
            title: res.resMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => {
      })
    },
    //绑定手机号
    bindPhone () {
      console.log(this.formData.phone)
      this.$Request.post(this.$api.bindPhone.doMobile,
        {
          mobile: this.formData.phone,
          code: this.formData.code
        }
      ).then(res => {
        if (res.resCode == 39321) {
          uni.setStorageSync('phone', this.formData.phone)
          uni.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })

          window.location.href = window.location.origin + '/h5/pages/home/index?isBind=1'

        } else {
          uni.showToast({
            title: res.resMsg,
            icon: 'none',
            duration: 2000
          })
        }

      })

    }
  }
};
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 135rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("../../static/login/bg_bindPhone.png");
}
.title {
  font-size: 45rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}
.ctt {
  height: 500rpx;
  margin-top: 80rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx;
  padding: 60rpx 40rpx 0rpx;
}
.uni-form-item {
  flex: 1;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
  display: flex;
  align-items: center;
}

.label {
  width: 160rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: rgba(102, 102, 102, 1);
}
.code-btn {
  width: 176rpx;
  height: 56rpx;
  background: rgba(255, 231, 217, 1);
  border-radius: 10rpx;
  font-size: 22rpx;
  font-weight: 500;
  color: rgba(254, 72, 27, 1);
}
.code-btn::after {
  border: 0;
}
.submit-btn {
  width: 618rpx;
  height: 88rpx;
  font-size: 34rpx;
  color: #fff;
  margin-top: 55rpx;
  background: linear-gradient(
    120deg,
    rgba(253, 149, 57, 1),
    rgba(255, 0, 0, 1)
  );
  border-radius: 44rpx;
}

.uni-form-item .input {
  width: 250rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.text {
  font-size: 28rpx;
  color: #777;
}
.xieyi {
  font-size: 28rpx;
  color: #fd8c35;
}
</style>