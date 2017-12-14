<template>
  <div class="rightContent">
    <eval-menu ref="menu" @menuEvent="parentFun"></eval-menu>
    <eval-content ref="content" @contentEvent="parentFun"></eval-content>
  </div>
</template>

<script>
  import evalMenu from '../components/service/evaluation/evalMenu.vue'
  import evalContent from '../components/service/evaluation/evalContent.vue'
  import Vue from 'vue'



  export default {
    name: 'evaluation',
    components: {
      evalMenu,
      evalContent
    },
    methods : {
      parentFun:function(evtValue){//侦听evalMenu子页面的事件
        this.$refs.content.childCallTwo(evtValue);
      }
    },mounted(){
      this.$refs.menu.childCallOne(0);//初始化进入evalution页面需要执行的是查询全部
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
</style>
