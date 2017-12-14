<template>
  <div class="evalMenu">
    <span class="wdspan" @click="childCallOne(0)" :class="{'on':flag==0}"><div>全部</div></span>
    <span class="wdspan" @click="childCallOne(4)" :class="{'on':flag==4}"><div>认知</div></span>
    <span class="wdspan" @click="childCallOne(5)" :class="{'on':flag==5}"><div>言语-语言</div></span>
    <span class="wdspan" @click="childCallOne(6)" :class="{'on':flag==6}"><div>情绪与社会认知</div></span>
    <span class="wdspan" @click="childCallOne(71)" :class="{'on':flag==71}"><div>生活能力</div></span>
  </div>
</template>
<script>
  export default ({
    data() {
      return {
        flag:0,
        activeTab: "all"
      }
    },
    methods: {
      childCallOne:function(childparam){//父页面侦听事件
        this.flag = childparam;
        this.$store.commit("changeEvalMenu");
        this.$emit('menuEvent',childparam);
      },
      handleTabChange (val) {
        this.activeTab = val;
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";

  .evalMenu
    border-bottom 1px solid #eee
    span
      display inline-block
      width 112px
      height $menu-height
      line-height $menu-height
      text-align center
    :hover
      color $color-font-primary
      background-color $type-selected
      cursor pointer
    :active
      color $color-font-primary
      background-color $type-selected

    a.u-link--Active  div {
      background-color #f5f5f5
    }
    .on
      font-weight bold

  .mu-tab-link
    color #000 !important
</style>
