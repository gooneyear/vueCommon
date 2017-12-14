<template>
  <div class="order-pay">
    <mu-stepper :activeStep="activeStep" style="width:90%;">
      <mu-step><mu-step-label>创建订单</mu-step-label></mu-step>
      <mu-step><mu-step-label>支付</mu-step-label></mu-step>
      <mu-step><mu-step-label>完成</mu-step-label></mu-step>
    </mu-stepper>
    <div class="demo-step-content">
      <template>
        <div v-if="activeStep==1">
          <mu-row class="pay-list list-title" gutter>
            <mu-col desktop="16">康复服务</mu-col>
            <mu-col desktop="16">开单医生</mu-col>
            <mu-col desktop="16">康复开始时间</mu-col>
            <mu-col desktop="16">天数</mu-col>
            <mu-col desktop="16">单价</mu-col>
            <mu-col desktop="16">小计</mu-col>
          </mu-row>
          <mu-row class="pay-list" gutter>
            <mu-col desktop="16">康复课程</mu-col>
            <mu-col desktop="16">{{order.doc_name}}</mu-col>
            <mu-col desktop="16">{{order.order_use_start_time | datef}}</mu-col>
            <mu-col desktop="16">{{order.order_days}}天</mu-col>
            <mu-col desktop="16">￥{{Math.ceil((order.order_total_fee / order.order_days)*100)/100}}</mu-col>
            <mu-col desktop="16">￥{{order.order_total_fee}}</mu-col>
          </mu-row>
          <div>订单金额：<span class="pay-money">￥{{order.order_total_fee}}</span>，请选择支付方式：</div>
          <mu-row style="margin:20px 0;" gutter>
            <!-- <mu-col desktop="30" :class="{'select-pay-way':aliPay}" class="pay-img">
              <img @click="selectPay(0)" src="../../../assets/img/alipay.png" />
            </mu-col> -->
            <mu-col desktop="30" :class="{'select-pay-way':wxPay}" class="pay-img">
              <img @click="selectPay(1)" src="../../../assets/img/wx.png" />
            </mu-col>
            <mu-col desktop="30"></mu-col>
          </mu-row>
        </div>
        <div v-if="activeStep==2">
          <div gutter class="show-pay">
            <div v-if="payState=='PAID'"><img src="../../../assets/img/icon_right.png" /></div>
            <div v-if="payState=='PAID'">恭喜您，支付成功</div>
            <div v-if="payState=='USER_PAY_FAILED'"><img src="../../../assets/img/icon_wrong.png" /></div>
            <div v-if="payState=='USER_PAY_FAILED'">订单支付失败</div>
            <div v-if="payState=='UNPAID'"><img src="../../../assets/img/icon_wrong.png" /></div>
            <div v-if="payState=='UNPAID'">抱歉，您的支付未完成</div>
          </div>
          <mu-row class="pay-list list-title" gutter>
            <mu-col desktop="33">订单号</mu-col>
            <mu-col desktop="33">支付方式</mu-col>
            <mu-col desktop="33">订单总价</mu-col>
          </mu-row>
          <mu-row class="pay-list" gutter>
            <mu-col desktop="33">{{order.id}}</mu-col>
            <mu-col desktop="33">{{payMode == 'WX_PAY' ? '微信':'支付宝'}}</mu-col>
            <mu-col desktop="33">￥{{order.order_total_fee}}</mu-col>
          </mu-row>
        </div>
        <br>
        <mu-raised-button @click="toPay" v-if="activeStep==1" label="去付款" :disabled="showCheck" class="btn-style" primary />
        <div style="display:flex;justify-content:center;">
          <mu-raised-button @click="handleNext" v-if="activeStep==2" label="查看订单" class="btn-style" primary />
          <!-- <mu-raised-button v-if="activeStep==2" id="zhichiBtnBox" class="zhiCustomBtn btn-style" label="联系客服"
          style="background-color:#F6A623;margin-left:30px;" primary /> -->
        </div>
      </template>
    </div>

    <mu-dialog dialogClass="progress-dialog" :open="showProgress">
      <mu-circular-progress :size="90" color="red"/>
    </mu-dialog>
    <mu-dialog dialogClass="pay-dialog" :open="showPay">
      请在新开的支付平台页面进行付款，付款操作结果结束前请不要关闭页面，付款后选择：
      <mu-raised-button slot="actions" @click="payResult" style="color:#999;margin-right:30px;" label="未完成支付"/>
      <mu-raised-button slot="actions" @click="payResult" label="已完成支付" primary />
    </mu-dialog>
    <mu-dialog :open="showWX" title="微信支付" dialogClass="wxpay-dialog">
      <div class="wxpay-style">
        <div>请拿手机微信扫一扫</div>
        <div><img :src="wxPayImg" /></div>
      </div>
      <mu-raised-button @click="payResult" label="关闭" style="color:#999;" class="defaultBtn" slot="actions" />
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  var _t = null
  export default ({
    props:["orderLists"],
    data() {
      return {
        select: GLOBAL.selectOption,
        order: this.$route.query.order,
        aliPay: false,
        wxPay: false,
        activeStep: 1,
        showCheck: true,
        showWX: false,
        showPay: false,
        showProgress: false,
        payState: '',
        payMode: '',
        wxPayImg: ''
      }
    },
    components:{

    },
    filters: {
      datef: function(val){
        let da = val + '';
        return da.split(' ')[0];
      }
    },
    methods: {
      toPay(){
        if(this.aliPay){
          this.payByAli()
        } else {
          this.payByWX()
        }
        //this.showPay = true;
      },
      payByWX(){
        var body = {
          "out_trade_no":this.$route.params.id,
          "pay_scene":"DOCTOR"
        }
        this.$http.post(GLOBAL.PAYURL+"wxpay/qrpay",body,
        Vue.http.options.emulateJSON = false)
        .then((res)=>{
          this.wxPayImg = GLOBAL.PAYURL + res.body.qr_path;
          this.showWX = true;
        })
      },
      payByAli(){
        var returnURL = window.location.href;
        var body = {
          "out_trade_no": this.$route.params.id,
          "pay_scene": "DOCTOR",
          "return_url": ""
        }
        this.$http.post(GLOBAL.PAYURL+"alipay/qrpay",body,
        Vue.http.options.emulateJSON = false)
        .then((res)=>{
          window.open(res.body.redirect_url);
        })
      },
      getPayStatus(){
        this.$http.get(GLOBAL.ORDER+this.$route.params.id+"/brief",
        Vue.http.options.emulateJSON = false)
        .then((res) => {
          this.payState = res.body.order_status;
          this.payMode = res.body.order_pay_mode;
          if(this.payState == 'USER_PAY_FAILED'){
            this.showProgress = false;
          } else if(this.payState == 'PAID'){
            clearInterval(_t)
            this.showProgress = false;
          } else if(this.payState == 'UNPAID') {
            this.showProgress = false;
          }
        })
      },
      handleNext () {
        this.showPay = false;
        this.activeStep++;
        if(this.activeStep > 2){
          this.$router.push({name:"orderInfo", params:{id:this.$route.params.id},query:{order:this.$route.query.order}});
        }
      },
      payResult (){
        this.showPay = false;
        this.showWX = false;
        this.activeStep++;
        this.showProgress = true;
        var self = this;
        _t = setInterval(function(){
          self.getPayStatus();
        },1000)
        setTimeout(function(){
          clearInterval(_t)
        },5000)
      },
      selectPay (val){
        if(val == 0){
          this.aliPay = true;
          this.wxPay = false;
        } else {
          this.aliPay = false;
          this.wxPay = true;
        }
        this.showCheck = false;
      }
    }
  })
</script>
<style lang="stylus">
  @import "../../../assets/css/app.styl"
  .order-pay
    position absolute
    top 80px
    left 270px
    right 0
  .pay-list
    height 40px;
    margin 20px 30px;
    border-bottom 1px solid #f5f5f5;
  .list-title
    height 40px;
    line-height 40px;
    background-color #f5f5f5;
    font-weight bold;
  .pay-img
    border 1px solid #eee;
    margin-left 10px;
    margin-top 10px;
    display flex
    justify-content center
    align-items center
    height 150px
    width 90%
    border-radius 5px
    cursor pointer
  .show-pay
    display flex
    flex-direction column
    justify-content center
    align-items center
    height 255px
    width 100%
  .select-pay-way
    border 3px solid #0a81e5
  .pay-dialog
    max-width 400px !important
  .progress-dialog
    max-width 150px !important
  .wxpay-dialog
    max-width 500px !important
  .wxpay-style
    text-align center
  .pay-money
    font-size 28px
    color #0a81e5
</style>
