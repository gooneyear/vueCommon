<template>
  <div id="modal">
    <mu-dialog :open="true" scrollable title="新建订单">
      <payProduct @selectDay="selectDay"></payProduct>
      <mu-raised-button label="取消" @click="$emit('close')" class="btn-style" slot="actions" />
      <mu-raised-button label="确定" @click="createOrder" class="btn-style" slot="actions" primary />
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import payProduct from '../../../common/payProduct.vue'
  export default ({
    props: ['caseList'],
    data() {
      return {
        pID: 9
      }
    },
    components:{
      payProduct
    },
    methods: {
      selectDay(val){
        this.pID = val;
      },
      createOrder(){
        var body = {
          'user_id': this.$route.params.id,
          'user_name': this.caseList.name,
          'user_mobile': this.caseList.telephone,
          'pro_id': this.pID,
          'order_quantity': 1,
          'remark': 'remark',
          'order_mode': 1
        };
        this.$http.post(GLOBAL.ORDER+'create',body,
        Vue.http.options.emulateJSON = false)
        .then((res)=>{
          this.$emit('caseCreate')
        })
      }
    }
  })
</script>
<style lang="stylus" >
  @import "../../../../assets/css/app.styl"
  .btn-style
    border-radius 40px !important
    width 120px
</style>
