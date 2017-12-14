<template>
  <div id="modal">
    <mu-dialog :open="true" title="编辑资料" scrollable>
      <mu-flexbox orient="vertical">
        <mu-flexbox-item>
          <mu-text-field label="姓名" v-model="name" :errorText="errors.first('姓名')"
          v-validate="'required|cnName|max:30'" name="姓名" :maxLength="30" />
        </mu-flexbox-item>
        <mu-flexbox-item>
          <mu-select-field label="性别" v-model="gender" :errorText="errors.first('性别')"
          v-validate="'required'" name="性别">
            <mu-menu-item v-for="item,index in select.gender.options" :key="index" :value="item.id" :title="item.text" />
          </mu-select-field>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <mu-text-field label="医院科室" v-model="uPart" disabled />
        </mu-flexbox-item>
        <mu-flexbox-item>
          <mu-text-field label="常住地" v-model="uPlace" disabled />
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-raised-button label="取消" @click="cancelData" style="color: #999;margin-left:20px;" slot="actions" />
      <mu-raised-button label="保存修改" @click="submitData" class="btn-style" slot="actions" primary />
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import checkBlock from '../../common/checkBlock.vue'

  export default ({
    props:['uName','uGender','uPlace','uPart'],
    data() {
      return {
        select: GLOBAL.selectOption,
        name: this.uName,
        gender: parseInt(this.uGender),
        place: this.uPlace
      }
    },
    components:{
      checkBlock
    },
    methods: {
      submitData: function(){
        var self = this;
        this.$validator.validateAll()
          .then(function(isValid) {
            if(isValid)
            {
              self.$emit('submitData', self.name, self.gender,self.place);
            }
          })
      },
      cancelData: function(){
        this.$emit('close');
        /*解决悬浮层覆盖和无法滑动的bug*/
        $(".controlOverflow").css("overflow","auto");
      },
      getChange: function(option,flag){
        switch (flag) {
          case 'gender':
            this.gender = option;
            break;
          default:
            break;
        }
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl"
  .m-name
    position relative
    span
      position absolute
      display inline-block
      height 40px
      line-height 40px
      margin-left 20px
  .readInput
    color #999
</style>
