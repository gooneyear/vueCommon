<template>
  <mu-appbar>
    <mu-list-item solt="left">
      <mu-avatar backgroundColor="blue" class="user-img" src="../../../../static/images/logo_white.png" slot="leftAvatar"/>
      <span v-html="gName" class="logo"></span>
    </mu-list-item>
    <!-- <mu-list-item class="divier" slot="right"></mu-list-item>
    <mu-list-item id="zhichiBtnBox" class="zhiCustomBtn" titleClass="online-serve" title="在线客服" slot="right">
      <a id="zhichiBtn"></a>
      <mu-avatar icon="headset_mic" backgroundColor="#2196f3" slot="leftAvatar" />
    </mu-list-item> -->
    <mu-list-item class="divier" slot="right"></mu-list-item>
    <mu-list-item titleClass="login-user" :title="store.account.name" slot="right">
      <mu-avatar :src="imgPath" slot="leftAvatar"/>
      <mu-icon-menu icon="more_vert" iconClass="iconClass" slot="right">
        <mu-menu-item  title="账户信息" @click="toSet"/>
        <mu-menu-item title="退出" @click="logout"/>
      </mu-icon-menu>
    </mu-list-item>
  </mu-appbar>
</template>

<script>
  export default({
    data () {
      return {
        username: '',
        gName: GLOBAL.NAME ,
        store: require('../../../app/store.js')
      }
    },
    computed:{
      imgPath:function(){
		    var k = Math.random();
        var v = Math.random();
        return GLOBAL.cognition +'/'+ this.store.account.path+'?' + k + '=' + v;
      }
    },
    methods: {
      toSet() {
        this.$router.push({name:'userSet'})
      },
      logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.$router.push({ path: '/' });
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  html {
    padding: 0;
  }
  .user-img {
    margin-top: 20px;
  }
  .logo {
    color: #fff;
    padding: 0;
  }
  .login-user {
    color: #fff;
    margin-left: 30px;
    margin-right: 30px;
  }
  .online-serve {
    color: #fff;
  }
  .divier {
    width: 2px;
    border-left: 1px solid #eee;
    opacity: 0.2;
  }
  .iconClass {
    color: #fff;
    margin-top: 3px;
  }
  .menuListClass {
    margin-top: 30px;
    width: 120px;
  }
</style>
