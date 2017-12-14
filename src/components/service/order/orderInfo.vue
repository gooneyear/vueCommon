<template>
  <div class="userInfo">
    <mu-flexbox align="flex-start">
      <mu-flexbox-item class="flex-demo">
        <mu-flexbox orient="vertical" style="margin-left:40px;">
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">订单号</li>
              <li class="evenStyle">{{order.id}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">订单状态</li>
              <li class="evenStyle">
                {{pay}}
                <a v-if="showOrder" class="cancelOrderClass" @click="open">取消订单</a>
                <mu-dialog :open="showCancel"  @close="close" dialogClass="cancelOrderDialog">
                  <div class="cancelOrderContent">是否取消订单?</div>
                  <mu-raised-button class="defaultBtn" slot="actions" primary @click="close" label="否"/>
                  <mu-raised-button class="confirmBtn" slot="actions" @click="cancelOrder" style="color:#999;" label="是"/>
                </mu-dialog>
              </li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">开单医生</li>
              <li class="evenStyle">{{order.doc_name}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">所属机构</li>
              <li class="evenStyle">{{order.org_name}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">患者姓名</li>
              <li class="evenStyle">{{order.user_name}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">订单金额</li>
              <li class="evenStyle">￥{{order.order_total_fee}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item v-if="order.order_status=='PAID'||order.order_status=='END_OF_ORDER_USE'" class="flex-demo">
            <ul>
              <li class="oddStyle">支付方式</li>
              <li class="evenStyle">{{order.order_pay_mode  == 'WX_PAY' ? '微信':'支付宝'}}</li>
            </ul>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
      <mu-flexbox-item>
        <mu-flexbox orient="vertical" style="margin-left:60px;">
          <mu-flexbox-item><ul><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li></ul></mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">开单时间</li>
              <li class="evenStyle">{{order.add_time | dateFormat}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">康复开始时间</li>
              <li class="evenStyle">{{order.order_use_start_time | dateFormat}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">开单天数</li>
              <li class="evenStyle" style="width:200px">
                <span>{{order.order_days}}天</span>
              </li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">所属科室</li>
              <li class="evenStyle">{{order.dept_name}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">患者账号</li>
              <li class="evenStyle">{{order.user_mobile}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle" v-if="pay == '已取消'">取消时间</li>
              <li class="oddStyle" v-else>支付状态</li>
              <li class="evenStyle" v-if="pay == '已取消'">{{order.modify_time | dateFormat}}</li>
              <li class="evenStyle" v-else>{{pay}} &nbsp;&nbsp;
                <span v-if="order.order_status=='UNPAID'" class="cancelOrderClass"
                @click="openPay">去支付</span>
              </li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item v-if="order.order_status=='PAID'||order.order_status=='END_OF_ORDER_USE'" class="flex-demo">
            <ul>
              <li class="oddStyle">支付时间</li>
              <li class="evenStyle">{{order.order_pay_time | dateFormat}}</li>
            </ul>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
      <mu-flexbox-item>
      </mu-flexbox-item>
    </mu-flexbox>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {getSelect,GMTToStr} from '../../../assets/js/common.js'

  export default ({
    data() {
      return {
        showModal: false,
        showContent: false,
        showCancel: false,
        select: GLOBAL.selectOption,
        order: this.$route.query.order
      }
    },
    computed: {
      pay: function() {
        return getSelect('pay', this.order.order_status)
      },
      showOrder: function(){
        if (this.order.order_status == 'UNPAID'){
          return true;
        } else {
          return false;
        }
      }
    },
    filters: {
      dateFormat: function(val){
        let date = val + '';
        return date.split("+")[0];
      }
    },
    mounted(){
      this.getOrderInfo();
    },
    methods: {
      getOrderInfo: function() {
        var body = {
          'search': {
            'keyword':this.order.id
          },
          'id': '',
          'doc_id': this.order.doc_id,
          'user_id': '',
          'org_id': '',
          'product_type': '',
          'trial_type': '',
          'page':{
            "current": 1,
            "limit":10,
          }
        };
        this.$http.post(GLOBAL.ORDER+"list",body,
        Vue.http.options.emulateJSON = false)
        .then((res)=>{
          console.log(res.data)
          this.order = res.data.data[0];
        })
      },
      openPay: function(){
        this.$router.push({name:'orderPay',params:{id:this.order.id},query:{order:this.order}});
      },
      open () {
        this.showCancel = true
     },
      close () {
        this.showCancel = false
     },
      cancelOrder(){
        this.$http.delete(GLOBAL.ORDER+this.order.id+'/del',Vue.http.options.emulateJSON = false)
        .then((res)=>{
          if(res.status == 200){
            this.order.order_status = 'USER_CANCLE';
            console.log(res)
            this.order.modify_time = res.body.modify_time;
          }
        })
        this.showCancel = false
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" >
  @import "../../../assets/css/app.styl"
  @import "../../../assets/css/variable.styl"
  @import "../../../assets/css/table.styl"

  .flex-demo
    ul
      height 70px

  .cancelOrderClass
   color #2196f3
   font-size 10px
   text-decoration underline
   cursor pointer

 .cancelOrderDialog
   max-width 400px !important
   height 200px !important
   border-radius 5px !important

 .cancelOrderContent
   display flex
   align-items center
   justify-content center
   color #5a5555
   font-weight bold
   margin 25px 0px 15px 0px

 .defaultBtn
   border-radius 20px !important
   margin 10px 45px 25px 0 !important

 .confirmBtn
   border-radius 20px !important
   margin 10px 45px 25px 0 !important
</style>
