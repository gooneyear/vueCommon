<template>
  <div class="login">
    <div class="login__logo">健脑云平台</div>
    <div class="login__form">
      <div class="login__title">
        <div>{{ store.account.name }}</div>
        <div>为保证账号安全性及密码找回请短信激活并重新设置密码</div>
        <div>{{ store.account.mobile }}</div>
      </div>
      <form class="login__body">
        <input class="textbox__login" type="textbox" v-model="verificationCode" placeholder="验证码">
        <button id="hi" v-bind:disabled="hasGetCode" v-bind:style="styleObject" v-on:click="getVerificationCode">{{ buttonText }}</button>
        <br>
        <input class="textbox__login" type="textbox" v-model="newPassword" placeholder="6-16位字母数字混合新密码"><br>
        <ul class="textbox__login" style="border-bottom:none">
          <li class="textbox__login error">{{ error }}</li>
        </ul>
        <button type="submit" v-model="val" class="button__login" v-on:click="activateAccount" disabled>激活账号</button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        store: require('./store.js'),
        verificationCode: '',
        newPassword: '',
        isValid: true,
        hasSubmitted: false,
        hasGetCode: false,
        countdown: 60,
        val: '',
        passFormat: /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/
      }
    },
    watch: {
      verificationCode(a) {
        if(this.newPassword != '' && a != ''){
          $(".button__login").css("backgroundColor","#0a81e5").removeAttr("disabled");

        }
      },
      newPassword(a){
        if(this.verificationCode != '' && a != ''){
          $(".button__login").css("backgroundColor","#0a81e5").removeAttr("disabled");
        }
      }
    },
    computed: {
      data2post: function () {
        return {
          username: this.store.account.mobile,
          password: this.newPassword,
          code: this.verificationCode
        }
      },
      error: function() {
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
      login: function (event) {
        event.preventDefault();
        var self  = this;
        self.$router.push({ path: '/doc' });
      },
      getVerificationCode: function() {
        var self = this;
        event.preventDefault();
        this.hasGetCode = true;
        var aa = window.setInterval(function() {
          if(--self.countdown<0) {
            self.hasGetCode = false;
            self.countdown = 60;
            window.clearInterval(aa);
          }
        }, 1000);
        var url = '/api/Auth/smsCode?username='+ this.store.account.mobile;
        this.$http.get(url).then(
          function (res) {
            console.log(res.data.resultMsg);
          },
          function(res){
            if(res.body.resultMsg.charAt('成功')<0){
              self.errorMsg = res.body.resultMsg;
            }
          }
        );
      },
      activateAccount: function() {
        event.preventDefault();
        var self = this;
        if(this.isValid){
          this.$http.post('/api/Auth/activation', this.data2post).then(
            function (res) {
              console.log(res.data.resultMsg);
              this.$router.push({ path: '/doc/caselist/' });
            },
            function(res){
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
  top: 0;
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
  padding: 1.875rem 0 0 1.8125rem;
  color: #ffffff;
  font-size: 0.8125rem;
}

.login__title {
  width: 15.625rem;
  margin: 3.0625rem auto 2.5rem auto;
  font-size: 0.875rem;
  text-align: center;
}

.button__login {
  width: 15.625rem;
  height: 2.5rem;
  margin: 0 auto 2.5rem auto;
  border: none;
  color: #ffffff;
  font-size: 0.875rem;
  text-align: center;
  outline: none;
  border-radius: 1.875rem;
  cursor: pointer;
}

.textbox__login {
  width: 15.625rem;
  height: 2.5rem;
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
  top: 50%;
  left: 50%;
  width: 25rem;
  height: 25rem;
  margin: -12.5rem;
  background-color: #ffffff;
  border-radius: .25rem;
}
</style>
