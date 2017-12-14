<template>
  <div id="modal">
    <mu-dialog :open="true" scrollable title="新建档案" dialogClass="dialog-horizon" bodyClass='dialogBody'>
        <div style="
          display: flex;
          flex-direction: column;

        ">
          <mu-text-field label="姓名" :errorText="errors.first('姓名')" v-validate="'required|cnName'" name="姓名" :maxLength="20" v-model="name" /><br/>
        
        
          <!-- <datePickerEl :defaults="birthday" :label="dateName" @changeDate="getBirthday" style="transform: translate(3px, 0px);"></datePickerEl> -->
          <mu-date-picker :label="dateName" :errorText="errors.first('出生日期')" v-validate="'required'" name="出生日期" v-model="birthday"
          style="transform: translate(3px, 0px);" :defaults="birthday"  @changeDate="getBirthday" />
          <span class="is-danger" style="margin-left:150px;">{{ $parent.errorDate}}</span>
        
        
          <checkBlock :value="2" :label="select.gender.name" :options="select.gender.options" :flag="select.gender.flag" @changeVal="getChange"></checkBlock>
        
        
          <mu-text-field label="手机号" :errorText="phoneError" v-validate="'required|numeric|phone|digits:11'" :maxLength="11" name="手机号" v-model="tele" />
        
        
          <mu-select-field :label="select.edus.name" hintText="请选择"
          :errorText="errors.first('教育程度')" v-validate="'required'" name="教育程度" v-model="edu">
            <mu-menu-item v-for="item, index in select.edus.options"
            @click="getChange(item.id,select.edus.flag)"
            :key="index" :title="item.text" :value="item.id"/>
          </mu-select-field>
        
        
          <mu-select-field :label="select.hands.name" hintText="请选择"
          :errorText="errors.first('利手')" v-validate="'required'" name="利手" v-model="hand" >
            <mu-menu-item v-for="item, index in select.hands.options"
            @click="getChange(item.id,select.hands.flag)"
            :key="index" :title="item.text" :value="item.id"/>
          </mu-select-field>
        </div>
        
      <mu-raised-button label="确定" @click="submitData" class="btn-style" slot="actions" primary />
      <mu-raised-button label="取消" @click="cancelData" style="color:#999;margin-left:20px;" slot="actions" />
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import checkBlock from '../../common/checkBlock.vue'
  import datePickerEl from '../../common/datePickerEl'
  import {curDate, getOtherDate, getSelect} from '../../../assets/js/common.js'

  export default ({
    data() {
      return {
        select: GLOBAL.selectOption,
        birthWidth: '288px',
        name: '',
        birthday: '',
        dateName: '出生日期',
        tele: '',
        gender: '2',
        edu: '',
        hand: ''
      }
    },
    components:{
      checkBlock,
      datePickerEl
    },
    computed:{
      errorText(){
        return this.edu ? '' : '这是必选项'
      },
      phoneError: function(){
        if(this.$parent.errorMobile){
          return this.$parent.errorMobile
        }
        return this.errors.first('手机号');
      }
    },
    watch:{
      birthday(a,b){
        if(a != b) {
          this.$parent.errorDate = '';
        }
      },
      tele(a,b){
        if(a != b) {
          this.$parent.errorMobile = '';
        }
      }
    },
    methods: {
      submitData: function(){
        var self = this;
        this.$validator.validateAll()
          .then(function(isValid) {
            if (false == isValid){
              return;
            }
            self.$emit('submitData', self.name, self.gender, self.birthday, self.tele, self.edu, self.hand);
          })
      },
      cancelData: function(){
        this.$parent.error = '';
        this.$emit('close');
      },
      getChange: function(option,flag){
        switch (flag) {
          case 'edus':
            this.edu = option;
            break;
          case 'hands':
            this.hand = option;
            break;
          case 'gender':
            this.gender = option;
            break;
          default:
            break;
        }
      },
      // 获取选择的生日
      getBirthday: function(item){
        this.birthday = item;
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl"

</style>
