<template>
  <div id="radioSelect">
    <mu-select-field :label="label" v-model="select" :errorText="errorInfo">
      <mu-menu-item @click="sendData(op.id)"  v-for="op,index in optionVal" :key="index" :value="op.id" :title="op.text" />
    </mu-select-field>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default ({
    props: ['value','options','flag', 'label', 'isFirst'],
    data() {
      return {
        optionVal: this.options,
        // 必须是数字类型，否则不识别
        select: parseInt(this.value)
      }
    },
    computed:{
      errorInfo:function(){
        if (this.select == 0 && this.flag != 'place' && this.flag != 'marry'){
          return '必填项，请填写'+this.label;
        }
      }
    },
    mounted (){
      // 新建档案时，默认值为第一个选项
      console.log(this.select);
      if(!this.value){
        this.select = 0;
      }
    },
    methods: {
      sendData: function(val){
        this.$emit('changeVal',val,this.flag);
      }
    }
  })
</script>
<style lang="stylus">
  @import "../../assets/css/app.styl"
  @import "../../assets/css/variable.styl"

</style>
