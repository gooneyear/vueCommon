<template>
  <div id="modal">
    <mu-dialog :open="true" scrollable title="新建订单">
      <mu-stepper :activeStep="activeStep">
        <mu-step><mu-step-label>选择用户</mu-step-label></mu-step>
        <mu-step><mu-step-label>选择天数</mu-step-label></mu-step>
        <mu-step><mu-step-label>订单付款</mu-step-label></mu-step>
      </mu-stepper>
      <div class="demo-step-content">
        <template>
          <div v-if="activeStep==0">
            <mu-text-field style="margin-left:10px;width:80%;" v-model="search" hintText="请输入姓名或手机号搜索"  />
            <mu-raised-button label="搜索" style="border-radius:40px;" @click="getCaseList" slot="right" primary />
            <mu-paper class="select-user" :zDepth="1">
              <mu-grid-list>
                <mu-grid-tile v-for="(caseList,index) in caseLists" :key="index" style="height:90px;" >
                  <personal :info="caseList" :keys="index" @disabledStatus="getDisabledStatus" ></personal>
                </mu-grid-tile>
              </mu-grid-list>
            </mu-paper>
          </div>
          <div v-if="activeStep==1">
            <payProduct v-if="showProduct" @selectDay="selectDay"></payProduct>
          </div>
          <div v-if="activeStep==2">
            <mu-row gutter>
              <mu-col class="show-pay">订单创建成功，建议“立即支付”！</mu-col>
            </mu-row>
          </div>
          <br>
          <mu-raised-button @click="getCase" v-if="activeStep==0" label='下一步'  style="border-radius:40px;" :disabled="disabled" primary/>
          <div v-if="activeStep==1" class="date-wrapper">
            <div class="date-style"></div>
            <mu-date-picker  v-model="orderDate" :errorText="errors.first('康复开始时间')" v-validate="'required'"
            icon="date_range" inputClass="date-class" name="康复开始时间" :underlineShow="false" mode="landscape" hintText="请选择康复开始时间"/>
          </div>
          <mu-flat-button @click="upToCase" v-if="activeStep==1" label='上一步'  style="border-radius:40px;" />
          <mu-raised-button @click="createOrder" v-if="activeStep==1" label='下一步'  style="border-radius:40px;" primary />

          <mu-raised-button @click="$emit('close',0)" v-if="activeStep!=2" label='取消'  style="border-radius:40px;margin-left: 30px;" />

          <mu-flat-button @click="$emit('close',1)" v-if="activeStep==2" color="black" label="暂不支付" style="border-radius:40px;" />
          <mu-raised-button @click="getOrderToPay" v-if="activeStep==2" label='去付款'  style="border-radius:40px;" primary />
        </template>
      </div>
    </mu-dialog>
    <mu-toast v-if="toast" message="网速有点慢，请耐心等待，不要多次点击哦……" @close="hideToast"/>  </div>
</template>
<script>
  import Vue from 'vue'
  import personal from '../../common/personal.vue'
  import payProduct from '../../common/payProduct.vue'

  export default ({
    props: ["caseTrans", "caseId"],
    data() {
      return {
        select: GLOBAL.selectOption,
        showProduct: false,
        activeStep: 0,
        disabled: true,
        caseLists: [],
        pID: 0,
        orderID: '',
        orderDate: '',
        caseList: {},
        search: '',
        // 点击次数
        clickTime: 0,
        toast: false
      }
    },
    components:{
      personal,
      payProduct
    },
    mounted (){
      this.clickTime = 0;
      if(this.caseTrans){
        this.caseList = this.caseTrans;
        this.activeStep = 1;
        this.showProduct = true;
      } else {
        this.getCaseList();
      }
    },
    methods: {
      getCaseList(){
        Vue.http({
          method: 'GET',
          url:'/api/Cases/getList',
          params: {
            'search': {
              'keyword': this.search
            },
            'page': {
              current: 1,
              limit: 10
            }
          }
        })
        .then((res) => {
          this.caseLists = res.data.data;
        })
      },
      getOrderToPay: function() {
        var body = {
          'search': {
            'keyword': this.orderID
          }, // 订单ID，患者手机号，患者姓名
          'id': '',
          'doc_id': '',
          'user_id': '',
          'org_id': '',
          'product_type': '',
          'trial_type': '',
          'page':{
            "current": 1,
            "limit":10,
          }
        };
        this.$http.post(GLOBAL.ORDER+'list',body,
        Vue.http.options.emulateJSON = false)
        .then((res)=>{
          this.orderLists = res.data.data[0];
          this.$emit("close");
          this.$router.push({name:'orderPay',params:{id:this.orderID},query:{order:this.orderLists}});
        })
      },
      createOrder(){
        this.clickTime++;
        console.log(this.clickTime)
        if(this.clickTime > 1){
          this.showToast()
          return;
        }
        var acc = require('../../../app/store.js');
        if(this.caseList.id){
          var id = this.caseList.id;
          var mobile = this.caseList.mobile;
        } else {
          var id = this.caseId;
          var mobile = this.caseList.telephone;
        }
        var body = {
          'user_id': id,
          'user_name': this.caseList.name,
          'user_mobile': mobile,
          'pro_id': this.pID,
          'order_use_start_time': this.orderDate,
          'order_quantity': 1,
          'remark': 'remark',
          'order_mode': 1,
          'doc_id': acc.account.account_uuid,      // 医生id(说明 不可以为空)，类型字符串
          'doc_name': acc.account.name,  // 医生姓名(说明 不可以为空)，类型字符串
          'dept_id': acc.account.dept_id,    // 下单人科室(说明 可以为空)，类型字符串
          'dept_name': acc.account.dept_name,// 下单人科室名称(说明 可以为空)，类型字符串
          'org_id': acc.account.org_uuid,      // 机构id(说明 可以为空)，类型字符串
          'org_name': acc.account.orgName,  // 机构名称患者姓名(说明 可以为空)，类型字符串
        };
        var self = this;
        this.$validator.validateAll()
        .then(function(isValid){
          if (false == isValid){
            return;
          }
          self.$http.post(GLOBAL.ORDER+'create',body,
          Vue.http.options.emulateJSON = false)
          .then((res)=>{
            self.orderID = res.data;
            self.activeStep++;
          })
        })
      },
      upToCase(){
        this.activeStep--;
        this.disabled = true;
      },
      getCase(){
        this.activeStep++;
        this.showProduct = true;
      },
      getDisabledStatus(val,temp){
        this.disabled = val;
        this.caseList = temp;
      },
      selectDay(val){
        this.pID = val;
      },
      showToast () {
        this.toast = true
        if (this.toastTimer) clearTimeout(this.toastTimer)
        this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
      },
      hideToast () {
        this.toast = false
        if (this.toastTimer) clearTimeout(this.toastTimer)
      }
    }
  })
</script>
<style lang="stylus" >
  @import "../../../assets/css/app.styl"
  .select-user
    height 200px
    overflow-y auto
    overflow-x hidden
  .show-day
    border 1px solid #eee;
    color #444
    font-size 48px
    margin-left 10px;
    margin-top 10px;
    display flex
    justify-content center
    align-items center
    height 100px
    width 90%
    border-radius 5px
  .day-font
    font-size 14px;
    margin-top 20px;
    margin-left 5px;
  .select-day
    background-color #0a81e5;
    color #fff;
  .show-pay
    display flex
    justify-content center
    align-items center
    height 255px
    width 100%
  .mu-grid-tile-titlebar
    height 0 !important;
    background-color #fff !important;

  .date-wrapper{
    position: relative;
    display: inline-block;
    width: 220px;
    height: 40px;
  }
  .date-style{
    position: absolute;
    left: 0px;
    width: 220px;
    height: 40px;
    background-color: #F5F5F5;
    border-radius: 40px;
  }
</style>
