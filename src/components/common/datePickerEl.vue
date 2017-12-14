<template>
  <div id="time">
    <mu-date-picker
      hintText="选择日期"
      :label="this.label"
      mode="landscape"
      :autoOk="true"
      v-model="value"
      @change="inputHandler">
    </mu-date-picker>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    props: ['defaults','label','start','index'],
    data () {
      const self = this;
      let curDate = '';
      let mon = '';
      let day = '';

      // ipad中对于没有补全为8位的日期格式认为是非法日期，
      // 导致无法弹出日期选择框，故做处理。
      let dateStr = self.defaults.split('-');
      if(self.defaults) {
        if(dateStr[1] < 10 && dateStr[1].length==1) {
          mon = '0' + dateStr[1];
        } else {
          mon = dateStr[1];
        }
        if(dateStr[2]<10 && dateStr[1].length==1){
          day = '0' + dateStr[2];
        } else {
          day = dateStr[2];
        }
        curDate = dateStr[0] + '-' + mon + '-' + day;
      } else {
        curDate = '';
      }
      return {
        value: curDate
      }
    },
    methods: {
      inputHandler (value) {
        this.$emit('changeDate', value,this.index)
      }
    }
  }
</script>

<style lang="stylus">

</style>
