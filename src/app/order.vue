<template>
  <div class="rightContent">
    <div class="secInfo">
      <div><b>订单详情</b></div>
    </div>
    <router-view class="right-content" style="
    position:fixed;
    top:181px;
    left:240px;
    right:0;
    bottom:0;
    overflow-y: auto;
    overflow-x: hidden;"></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    data() {
      return {

      }
    }
  }
</script>
<style lang="stylus">
  @import "../assets/css/app.styl"
  @import "../assets/css/variable.styl"

  .rightContent
    position absolute
    left 231px
    top $top-height
    right 0
    height calc(100% - 101px)
    a.u-link--Active div {
      background-color #fff
      font-weight bold
    }
  .secInfo
    height $table-height
    display flex
    justify-content start
    align-items center
    text-align center
    padding-left 40px
    color #000
    border-bottom 1px solid #dedede
</style>
