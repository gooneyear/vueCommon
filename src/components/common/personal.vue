<template>
<div>
  <mu-list-item  @click="chooseThis(keys)" :class="{'on':selectPerson == keys}" class="selectUser">
    <mu-avatar :class="colorSelect" slot="leftAvatar" style="font-size:14px;">{{showName}}</mu-avatar>
    <span>
      <span v-if="flag != 1"><b>{{info.name | short}}，</b>{{sex}}，{{info.age}}岁</span>
      <span v-else><b>{{info.user_name | short}}，</b>{{info.user_mobile}}</span>
    </span>
  </mu-list-item>
</div>
</template>

<script>
import {getSelect} from '../../assets/js/common.js'
export default {
  props:["info","keys", "flag"],
  data () {
    return {
      selectPerson: -1,
      disabled: true
    }
  },
  computed: {
    showName: function(){
      if(this.flag){
        var names = this.info.user_name+'';
      } else {
        var names = this.info.name+'';
      }
      var len = names.split('').length;
      if(len <2){
        return names;
      } else {
        return names.split('')[len-2]+names.split('')[len-1]
      }
    },
    sex: function() {
      return getSelect('gender', this.info.gender)
    },
    colorSelect:function(){
      if((this.keys)%4 == 0){
        return "fourOne"
      } else if((this.keys)%4 == 1){
        return "fourTwo"
      } else if((this.keys)%4 == 2){
        return "fourThree"
      } else if((this.keys)%4 == 3){
        return "fourFour"
      }
    }
  },
  filters: {
    short: function(val){
      let ll = val + "";
      if(ll.length > 6){
        return ll.substring(0,6) + "...";
      } else {
        return ll;
      }
    },
  },
  methods: {
    chooseThis(val){
      this.selectPerson = val;
      this.disabled = false;
      this.$emit('disabledStatus',this.disabled, this.info);
      $(".selectUser").click(function(){
        $(".selectUser").removeClass("on");
        $(this).addClass('on');
      })
    },
  }
}
</script>
<style scoped lang="stylus">
.fourOne
  background-color #1BBE9F
  border-radius 50%

.fourTwo
  background-color #F6A623
  border-radius 50%

.fourThree
  background-color #E8570F
  border-radius 50%

.fourFour
  background-color #4990E2
  border-radius 50%


.on
  position relative
.on::before
  content: '';
  position:absolute;
  top:20px;
  right:20px;
  display:inline-block!important;
  margin-left:30px;
  width:20px;
  height:20px;
  background-image: url('../../assets/img/icon_select_blue.png');
</style>
