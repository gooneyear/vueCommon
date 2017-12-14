<template>
  <div class="secMenu">
    <router-link :to="{name:'caseinfo'}"><div>基本资料</div></router-link>
    <router-link :to="{name:'caseDiag'}"><div>病症诊断</div></router-link>
    <router-link :to="{name:'evalRecord'}"><div>测评记录</div></router-link>
    <router-link :to="{name:'trainPlan'}"><div>训练方案</div></router-link>
    <router-link :to="{name:'trainRecord'}"><div>训练记录</div></router-link>
    <router-link :to="{name:'collectInfo'}"><div>信息采集</div></router-link>
    <router-link :to="{name:'caseOrder'}"><div>居家康复</div></router-link>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";
  .secMenu
    top 181px
    left 231px
    background-color $base-bgcolor
    width $second-menu-width
    text-align center
    a
      color #444
    div
      height $menu-height
      line-height $menu-height
    /*:hover
      font-weight bold*/
    :active
      font-weight bold
      color $color-font-primary
      background-color #fff
</style>
