<template>
  <div class="rightContent">
    <trainMenu ref="trainmenu" @trainmenuEvent="trainFun"></trainMenu>
    <trainContent ref="traincontent"></trainContent>
  </div>
</template>

<script>
  import trainMenu from '../components/common/trainMenu.vue'
  import trainContent from '../components/service/train/trainContent.vue'

  export default {
    name: 'user',
    components: {
      trainMenu,
      trainContent
    },
    methods: {
      trainFun:function(evtValue1,evtValue2,evtValue3){
        this.$refs.traincontent.traincontentCall(evtValue1,evtValue2,evtValue3);
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
</style>
