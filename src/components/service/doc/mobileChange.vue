<template>
  <div id="modal">
    <mu-dialog :open="true" title="修改手机号" scrollable>
      <mu-row>
        <mu-flexbox orient="vertical">
          <mu-flexbox-item>
            <mu-text-field label="当前手机号" v-model="oldMobile" :errorText="oldPError"
            v-validate="'required|phone'" name="当前手机号" :maxLength="11" />
          </mu-flexbox-item>
          <mu-flexbox-item>
            <mu-text-field label="新手机号" v-model="newMobile" :errorText="newPError"
            v-validate="'required|phone'" name="新手机号" :maxLength="11" />
          </mu-flexbox-item>
          <mu-flexbox-item>
            <mu-text-field label="验证码" v-model="valiCode" :errorText="codeError"
            v-validate="'required|numeric'" name="验证码" :maxLength="11" @keydown="clearInfo(2)" />
            <mu-raised-button label="获取验证码" @click="getCode" primary />
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-row>
      <mu-raised-button label="取消" @click="$emit('close')" class="btn-style" style="color:#999;margin-left:20px;" slot="actions" />
      <mu-raised-button label="提交" @click="submitData" class="btn-style" slot="actions" primary />
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default ({
    props: ['mobile'],
    data() {
      return {
        oldMobile: '',
        newMobile: '',
        valiCode: '',
        errorOld: '',
        errorNew: '',
        errorCode: ''
      }
    },
    computed:{
      oldPError: function(){
        if(this.errorOld){
          return this.errorOld;
        } else {
          return this.errors.first('当前手机号');
        }
      },
      newPError: function(){
        if(this.errorNew){
          return this.errorNew;
        } else {
          return this.errors.first('新手机号');
        }
      },
      codeError: function(){
        if(this.errorCode){
          return this.errorCode;
        } else {
          return this.errors.first('验证码');
        }
      }
    },
    methods: {
      submitData: function(){
        var self = this;
        this.$validator.validateAll()
          .then(function(isValid) {
            if(false == isValid){
              return false;
            }
            self.$http.post('/api/Auth/changePhone',{
              cur_phone:self.oldMobile,
              new_phone:self.newMobile,
              code: self.valiCode
            })
              .then(
                function(){
                  self.$emit('submitData',self.oldMobile, self.newMobile)
                },
                function(res){
                  self.errorOld = '';
                  self.errorNew = '';
                  self.errorCode = '';
                  if(res.body.resultMsg.indexOf('当前')>=0){
                    self.errorOld = res.body.resultMsg;
                  } else if(res.body.resultMsg.indexOf('存在')>=0){
                    self.errorNew = res.body.resultMsg;
                  } else {
                    self.errorCode = res.body.resultMsg;
                  }
                }
              )
          })
      },
      // 获取验证码
      getCode: function(){
        var self = this;
        Vue.http({
          method: 'GET',
          url: '/api/Auth/smsCode',
          params: {
            username: this.newMobile
          }
        })
          .then(
            function(res){},
            function(res){
              self.errorCode = '';
              if(res.body.resultMsg.indexOf('成功')<0){
                self.errorCode = res.body.resultMsg;
              }
            }
          )
      },
      // 清空后台给出的提示信息
      clearInfo:function(res){
        if(res == 1){
          this.errorMobile = '';
        } else if(res == 2){
          this.errorCode = '';
        }
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl"
</style>
