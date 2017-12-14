<template>
  <div id="login">
    <div class="login-logo">
      <img src="../assets/img/logo_s.png"/>
      <span style="display: inline-block;margin-left:10px;" v-html="gname"></span>
    </div>
    <mu-paper class="demo-paper" :zDepth="1">
      <div class="login-title">
        <div><img src="../../static/images/logo-font.png" /></div>
        <div>|</div>
        <div>医生登录</div>
      </div>
      <div class="login-content">
        <div>
          <mu-text-field v-model="user.username" hintText="手机号"  />
        </div>
        <div>
          <mu-text-field v-model="user.password" type="password" hintText="密码"  />
        </div>
        <div class="danger" v-show="hasSubmitted && !isValid">{{error}}</div>
        <div class="danger" v-show="authError">{{errorMessage}}</div>
        <div>
          <mu-raised-button label="登录" class="demo-raised-button" @click="login" primary/>
        </div>
      </div>

      <div class="login-forget"><router-link to="/reset">忘记密码</router-link></div>
    </mu-paper>

  </div>
</template>
<script>
  import Vue from 'vue'
  var store = require('./store.js');
  export default {
    data: function () {
      return {
        gname: GLOBAL.NAME,
        user: {
          'grant_type': 'password',
          username: '',
          password: '',
          'client_id': 'wispirit',
          'client_type': 'doctor'
        },
        hasSubmitted: false,
        authError: false,
        errorMessage: '手机号或密码错误'
      }
    },

    computed: {
      validation: function () {
        return {
          username: !!this.user.username.trim(),
          password: !!this.user.password.trim()
        }
      },
      isValid: function () {
        var validation = this.validation
        return Object.keys(validation).every(function (key) {
          return validation[key]
        })
      },
      error: function() {
        if (!this.validation.username) {
          return '手机号不能为空';
        }
        if (!this.validation.password) {
          return '密码不能为空';
        }
      }
    },

    watch: {
      user: {
        deep: true,
        handler: function () {
          this.hasSubmitted = false;
          this.authError = false;
        }
      }
    },

    methods: {
      getAccount: function () {
        var token = localStorage.getItem('access_token');
        if (token) {
          this.$http.get('/api/Users/me').then(
            function (res) {
              store.setAccount(res.data);
            },
            function(res){
              console.log(res)
            }
          );
        }
      },

      login: function (event) {
        console.log(event);
        event.preventDefault();
        var self  = this;
        self.hasSubmitted = true;
        if (self.isValid) {
          self.$http.post('/api/Auth/login', self.user,
          Vue.http.options.emulateJSON = true).then(
            function (res) {
              if(res.data.resultCode == 50000){
                self.authError = true;
                self.errorMessage = res.data.resultMsg;
                return;
              }
              localStorage.setItem("access_token", res.data.access_token);
              localStorage.setItem('refresh_token', res.data.refresh_token);
              self.getAccount();
              if (res.data.status === '1') {
                self.$router.push({ path: '/active' });
              }  else {
                self.$router.push({ path: '/doc/caselist/' });
              }
            },
            function(res) {
              self.authError = true;
              if(res.data.resultCode == 50000){
                self.errorMessage = res.data.resultMsg;
              }
              if (res.status === 401) {
                self.errorMessage = '用户名或密码错误';
              }
            }
          );
        } else {

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  ::-webkit-input-placeholder {
    text-align: center;
  }
  .login-logo {
    color: #ffffff;
    font-size: 22px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    position: absolute;
    left: 40px;
    top: 20px;

  }
  #login {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #0a81e5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .demo-paper {
    display: inline-block;
    height: 400px;
    width: 400px;
    text-align: center;
  }
  .login-title {
    display: flex;
    justify-content: space-around;
    padding-left: 60px;
    padding-right: 60px;
    margin-top: 60px;
    font-size: 22px;
    color: #999;
  }
  .login-content {
    margin-top: 30px;
  }
  .demo-raised-button {
    margin: 12px;
  }
  .login-forget {
    margin-top:10px;
    color: #999;
    font-size: 14px;
    text-decoration: underline;
  }
</style>
