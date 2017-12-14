<template>
  <div class="menu">
    <div class="menu-user">
      <div><img :src="imgPath" /></div>
      <div>{{store.account.name}}</div>
    </div>
    <div class="menu-content">
      <router-link :to="{name:'caselist'}"><div>档案</div></router-link>
      <router-link :to="{name:'evaluation'}"><div>测评</div></router-link>
      <router-link :to="{name:'train'}"><div>训练</div></router-link>
      <router-link :to="{name:'orderList'}"><div>居家康复</div></router-link>
    </div>
    <div class="menu-footer">
      <div>Version:{{showVersion}}</div>
      <div class="foot-flag">2017<img src="../../../assets/img/logo_gray.png"/><span v-html="gName"></span></div>
    </div>
  </div>
</template>
<script>
  export default({
    name: 'setting',
    data () {
      return {
        gName: GLOBAL.NAME,
        store: require('../../../app/store.js'),
        version: require('../../../../build/version.json')
      }
    },
    computed:{
      showVersion: function(){
        if(this.version.version){
          return this.version.version;
        } else {
          var date = new Date(this.version.date);
          var Y = date.getFullYear().toString().substr(2,2);
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
          var D = (date.getDate() < 10 ? '0'+(date.getDate()): date.getDate());
          var h = date.getHours().toString().substring(0,2);
          return Y+M+D+h;
        }
      },
      imgPath: function(){
        var k = Math.random();
        var v = Math.random();
        return GLOBAL.cognition +'/'+ this.store.account.path+'?' + k + '=' + v;
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";

  .menu
    position fixed
    top 64px
    width $left-menu-width
    height calc(100% - 80px)
    display flex
    flex-direction column
    align-items center
    justify-content space-between
    border-right 1px solid #dedede
    text-align center
    .menu-user
      flex-grow 1
      margin-top 44px
      img
        border-radius 50%
        width 80px
        height 80px
        margin-bottom 17px
    .menu-content
      flex-grow 5
      font-weight bold
      div
        width $left-menu-width
        height $menu-height
        line-height $menu-height
      :hover
        color $color-font-primary
        background-color $base-bgcolor
      :active
        color $color-font-primary
        background-color $base-bgcolor
    .menu-footer
      margin-bottom 25px
      flex-grow 1
      color #aaa
      img
        height 25px
    .foot-flag
      display flex
      align-items center

</style>
