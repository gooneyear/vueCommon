<template>
  <div class="login">
    <div class="login__logo">
      <img src="../assets/img/logo_s.png"/>
      <span style="display: inline-block;margin-left:10px;" v-html="gName"></span>
    </div>
    <div class="login__form">
      <div class="login__title">
        <div><img src="../../static/images/logo-font.png" /></div>
        <div style="margin:auto 15px;">|</div>
        <div style="font-size: 22px;color:#999;">忘记密码</div>
      </div>
      <form class="login__body" style='transform: translate(-0.5px, 0)'>
        <input class="textbox__login" type="search" v-model="username" placeholder="手机号" style="
          transform: translate(7px, 0);
          font-size: 14px;
        "><br>
        <input class="textbox__login" type="textbox" maxlength="6" v-model="verificationCode" placeholder="验证码" style="
          transform: translate(-1px, 0);
          font-size: 14px;
        ">
        <button id="hi" :disabled="hasGetCode" :style="styleObject" @click="getVerificationCode">{{ buttonText }}</button><br>
        <input class="textbox__login" type="textbox" v-model="newPassword" placeholder="6-16位字母数字混合新密码" style="top: 0px; font-family: 'Microsoft Yahei'; transform:translate(-1px, 0); font-size: 14px"><br>
        <ul class="textbox__login" style="border-bottom:none">
          <li class="textbox__login error" style="
              font-size: 14px;
              transform: translate(0, 1px);
              border-bottom: none;
            ">{{ error }}{{errorMsg}}</li>
        </ul>
        <button type="submit" class="button__login" @click="resetPass" style="font-size: 14px">重置密码</button>
      </form>
    </div>
  </div>
</template>
<script>
  var store = require('./store.js');
  export default {
    data: function () {
      return {
        gName: GLOBAL.NAME,
        username: '',
        verificationCode: '',
        newPassword: '',
        passFormat: new RegExp(/^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/),
        isValid: true,
        authError: false,
        hasGetCode: false,
        countdown: 60,
        errorMsg:''
      }
    },

    computed: {
      data2post: function() {
        return {
          username: this.username,
          password: this.newPassword,
          confirm_password: this.newPassword,
          code: this.verificationCode
        }
      },
      error: function() {
        this.errorMsg = '';
        if (this.username == '') {
          this.isValid = false;
          return '手机号不能为空';
        }
        if (this.verificationCode == '') {
          this.isValid = false;
          return '验证码不能为空';
        }
        if (this.newPassword  == '') {
          this.isValid = false;
          return '新密码不能为空';
        }
        if (!this.passFormat.test(this.newPassword)) {
          this.isValid = false;
          return '新密码必须为字母和数字的组合';
        }
        if (this.newPassword.length<6 || this.newPassword.length>16) {
          this.isValid = false;
          return '新密码位数为6-16位';
        }
        this.isValid = true;
      },
      buttonText: function () {
        return this.hasGetCode?this.countdown+'s':'获取验证码';
      },
      styleObject: function () {
        if (this.hasGetCode) {
          return {
            cursor: 'default'
          };
        } else {
          return {};
        }
      }
    },

    methods: {
      getVerificationCode: function() {
        var self = this;
        event.preventDefault();
        var url = '/api/Auth/smsCode?username='+ this.username;
        this.$http.get(url).then(
          function (res) {
            console.log(res.data.resultMsg);
            self.hasGetCode = true;
            var aa = window.setInterval(function() {
              if(--self.countdown<0) {
                self.hasGetCode = false;
                self.countdown = 60;
                window.clearInterval(aa);
              }
            }, 1000);
          },
          function(res) {
            if(res.body.resultMsg.charAt('成功')<0){
              self.errorMsg = res.body.resultMsg;
            }
          }
        );
      },
      resetPass: function() {
        event.preventDefault();
        var self = this;
        if (this.isValid) {
          this.$http.post('/api/Auth/resetPassword', this.data2post).then(
            function (res) {
              console.log(res.data.resultMsg);
              this.$router.push({ path: '/' });
            },
            function(res) {
              self.errorMsg = res.body.resultMsg;
            }
          );
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#hi {
  position: absolute;
  top: 3rem;
  right: 0;

  width: auto;

  border: none;
  margin: 0;
  padding: 0;
  color: black;
  text-align: center;
  background-color: transparent;
  outline: none;
}

::-webkit-input-placeholder {
   text-align: center;
}

.login {
  width: 100%;
  height: 100%;
  background-color: #0a81e5;
}

.login__logo {
  padding: 20px 0 0 40px;
  color: #ffffff;
  font-size: 22px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.login__title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3.0625rem auto 60px auto;
  text-align: center;
  padding-bottom: -20px;
  line-height: 10px;
}

.button__login {
  width: 15.625rem;
  height: 3rem;
  margin: 0 auto 2.5rem auto;
  border: none;
  background-color: #0a81e5;
  color: #ffffff;
  font-size: 0.875rem;
  text-align: center;
  outline: none;
  border-radius: 1.875rem;
  cursor: pointer;
}

.textbox__login {
  width: 15.625rem;
  height: 3rem;
  border: none;
  border-bottom: 1px solid #EEEEEE;
  text-align: center;
  outline: none;
  border-radius: 0;
}

.error {
  color: red;
  line-height: 2.5rem;
}

.login__body {
  position: relative;
  width: 15.625rem;
  margin: 0 auto;
  font-size: 0.875rem;
  text-align: center;
}

.login__forget {
  color: #999999;
}

.login__form {
  position: absolute;
  top: 48%;
  left: 48%;
  width: 400px;
  height: 400px;
  margin: -175px;
  background-color: #ffffff;
  border-radius: .25rem;
}
</style>
