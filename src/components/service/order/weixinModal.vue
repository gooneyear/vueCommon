<template>
  <div id="modal">
    <mu-dialog :open="true" scrollable title="新建订单">
      
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import personal from '../../common/personal.vue'
  export default ({
    props:["orderLists"],
    data() {
      return {
        select: GLOBAL.selectOption,
        activeStep: 0,
        cols: 3,
        selected: 0
      }
    },
    components:{
      personal
    },
    methods: {
      handleNext () {
        this.activeStep++;
        if(this.activeStep > 2){
          this.$emit("close");
          this.$router.push("orderPay");
        }
      },
      selectDay(day,val){
        this.selected = val;
      }
    }
  })
</script>
<style lang="stylus" >
  @import "../../../assets/css/app.styl"

</style>
