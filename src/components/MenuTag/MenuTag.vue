 <template>
  <view id="menu_tag">
    <view class="menu-list">
      <view class="listCon" v-for="(item, index) in menuList" :key="index"  @click="menuChange(index)">
        <span :class="{ 'current': activeTag == index }">{{ item.title }}</span>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        activeTag: this.currentTag
      };
    },
    props: {
      currentTag: {
        type: Number
      },
      menuList: {
        type: Array,
        default: []
      }
    },
    watch: {
      currentTag(newV, oldV) {
        this.activeTag = newV;
      }
    },
    methods: {
      menuChange(index) {
        this.activeTag = index;
        this.$emit('menuTagTrigger', index);
      }
    }
  }
</script>

<style lang="scss" scoped>
   #menu_tag {
    .menu-list {
      z-index: 0;
      position: relative;
      display: flex;
      height: 30rpx;
      font-size: 0;
      &:before {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
        content: '';
        box-sizing: border-box;
        transform-origin: 0 0;
      }
      .listCon {
        display: block;
        flex: 1;
        height: 100%;
        font-size: 0;
        text-align: center;
        border-right:1px solid #fff;
        &:nth-child(3) {
          border:0;
        }
        span {
          z-index: 0;
          position: relative;
          display: inline-block;
          line-height: 30rpx;
          color: #fff;
          font-size: 28rpx;
          padding-bottom:10px;
          &:before {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-bottom: 1rpx solid rgba(0, 0, 0, 0);
            content: '';
            box-sizing: border-box;
            transform-origin: 0 0;
            transition: width .2s;
          }
        }
        .current {
          color: #fff;
          font-weight: bold;
          border-bottom: 1rpx solid #fff;
          &:before {
            width: 100%;
            border-bottom: 1rpx solid #c7000a;
          }
        }
      }
    }
  }
</style>
