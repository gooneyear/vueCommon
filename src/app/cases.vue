<template>
  <div class="rightContent"
    style = "
      overflow: auto;
      display: flex;
      flex-direction: column;
    "
    >
    <secondtop :caseInfo="caseInfo"></secondtop>
    <div style="
      display: flex;
      flex-direction: row;
      align-items: stretch;
      flex-grow: 1;
    ">
      <secondmenu :class=""></secondmenu>
      <router-view class="right-content" :caseInfo="caseInfo" style="
      position:fixed;
      top:164px;
      left:390px;
      right:0;
      bottom:0;
      overflow-y: auto;
      overflow-x: hidden;"></router-view>
    </div>
  </div>
</template>

<script>
  import secondtop from '../components/service/case/secondtop.vue'
  import secondmenu from '../components/service/case/secondmenu.vue'
  import Vue from 'vue'
  export default {
    name: 'cases',
    components: {
      secondtop,
      secondmenu
    },
    data() {
      return {
        caseInfo: {}
      }
    },
    watch:{

    },
    methods: {
      getUserInfo: function() {
        var self = this;
        Vue.http({
            method: 'GET',
            url: '/api/Cases/detail',
            params: {
              'id': self.$route.params.id
            }
          })
          .then(
            function(res){
              self.caseInfo = res.data.data;
            }
          )
      }
    },
    mounted () {
      this.getUserInfo();
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
</style>
