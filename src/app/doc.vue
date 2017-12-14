<template>
  <div @click="hideDiv">
    <div>
      <topmenu></topmenu>
    </div>
    <div class="content">
      <div class="content-left">
        <leftmenu ></leftmenu>
      </div>
      <div class="content-right">
        <div class="body">
          <router-view class="controlOverflow" style="position: fixed;top:64px;right:0;bottom:0;overflow: auto"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import topmenu from '../components/service/doc/topmenu.vue'
  import leftmenu from '../components/service/doc/leftmenu.vue'
  var store = require('./store.js');

  export default {
    name: 'doc',
    data () {
      return {
        activeTab: 'tab1',
        activeList: 'list1'
      }
    },
    components: {
      topmenu,
      leftmenu
    },
    mounted() {
      this.getAccount();
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      },
      handleListChange (val) {
        this.activeList = val
      },
      getAccount: function () {
        var token = localStorage.getItem('access_token');
        if (token) {
          this.$http.get('/api/Users/me').then(
            function (res) {
              store.setAccount(res.data);
            }
          );
        } else {
          console.log('token失效，跳转到登录页面。')
          this.$router.push({ path: '/' });
        }
      },
      /* 使用在子组件中阻止特定冒泡事件的方式，在根节点隐藏弹出框 */
      hideDiv: function() {
        var caseMore = document.getElementsByClassName("showMore");
        for (var i=0; i<caseMore.length; i++) {
          caseMore[i].style.display = 'none';
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .content{
    overflow: hidden;
  }
  .content-left{
    width: 30%;
    float: left;
    background-color: white;
    margin-bottom: -4000px;
    padding-bottom: 4000px;
  }
  .content-right{
    width: 70%;
    display: inline-block;
    float: right;
    padding: 10px 20px;
    background-color: rgba(0, 0, 0, 0)
  }
  .body{
    background-color: white;
    border-radius: 5px;
    min-height: 500px;
  }
</style>
