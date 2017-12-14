<template>
  <mu-grid-list :cols="cols">
    <mu-grid-tile v-for="day,index in pLists" :key="index" style="height:130px;" >
      <div class="show-day" :class="{'select-day': selected==index}" @click="selectDay(day,index)">{{day.days}}
        <div class="day-font">天</div>
      </div>
    </mu-grid-tile>
  </mu-grid-list>
</template>

<script>
import Vue from "vue"
export default {
  data () {
    return {
      cols: 3,
      selected: 0,
      pLists: []
    }
  },
  created(){
    this.getProduct();
  },
  methods: {
    // 获取产品列表，即选择订单天数
    getProduct(){
      var body = {
        'trial_type': '1',
        'product_type': '',
        'disabled': false
      };
      this.$http.post(GLOBAL.ORDER+"rehab-product/list",body,
      Vue.http.options.emulateJSON = false)
      .then((res)=>{
        this.pLists = res.body;
        this.$emit("selectDay",res.body[0].id)
      })
    },
    selectDay(day,val){
      this.selected = val;
      this.$emit("selectDay",day.id)
    }
  }
}
</script>
<style scoped lang="stylus">
.select-day
  background-color #0a81e5;
  color #fff;
</style>
