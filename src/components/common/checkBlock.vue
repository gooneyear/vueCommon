<template>
  <div class="block-style">
    <div class="oddStyle">{{this.label}}</div>
    <div id="checkBlock">
      <div class="block pointer" :class="{checkColor: op.checked}" v-for="(op,index) in optionVal" @click="sendData(op)">{{op.text}}</div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default ({
    props: ['value','label', 'options','flag'],
    data() {
      return {
        optionVal: this.options,
        check: ''
      }
    },
    mounted (){
      var self = this;
      this.optionVal.forEach(function (it) {
        if (it.id == self.value) {
          self.$set(it, 'checked', true);
        } else {
          self.$set(it, 'checked', false);
        }
      })
    },
    methods: {
      sendData: function(item){
        var self = this;
        // 判断对象中的某个属性是否存在
        if(typeof item.checked == 'undefined'){
          this.$set(item, 'checked', true);
          this.check = item.id;
        } else {
          item.checked = true;
          this.check = item.id;
          this.optionVal.forEach(function(it) {
              if (typeof it.checked == 'undefined') {
                self.$set(it, "checked", false);
              } else {
                if (item.id != it.id){
                  it.checked = false;
                }
              }
            })
        }
        this.$emit('changeVal',this.check,this.flag);
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../assets/css/app.styl"
  @import "../../assets/css/modal.styl"
  @import "../../assets/css/variable.styl"

  .block-style
    width 256px
    height 80px
  #checkBlock
    display flex
    flex-direction row
    justify-content flex-start
    color #000
    text-align center
    .block
      width 85px
      height 38px
      line-height 40px
      border 1px solid #eee
      background-color #f5f5f5
    .checkColor
      background-color #0a81e5
      color #fff
</style>
