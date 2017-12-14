<template>
  <div>
    <mu-dialog :open="true" title="修改信息"  scrollable>
      <mu-flexbox orient="vertical">
        <mu-flexbox-item>
          &nbsp;
        </mu-flexbox-item>
        <mu-flexbox-item>
          <mu-text-field label="姓名" v-validate="'required|cnName|max:20'" :errorText="errors.first('姓名')" name="姓名" v-model="editName" @change="keyupHandler('editName', editName)" /><br/>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <datePickerEl :defaults="caseInfo.birthday" :label="dateName" @changeDate="getBirthday"></datePickerEl>
          <span class="is-danger" style="margin-left:150px;">{{ $parent.errorDate}}</span>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <checkBlock :label="select.gender.name" :value="caseInfo.gender" :options="select.gender.options" :flag="select.gender.flag" @changeVal="getChange"></checkBlock>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <radios :label="select.edus.name" :options="select.edus.options" :value="caseInfo.education" :flag="select.edus.flag" @changeVal="getChange"></radios>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <radios :label="select.hands.name" :options="select.hands.options" :value="caseInfo.hand" :flag="select.hands.flag" @changeVal="getChange"></radios>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-raised-button label="取消" @click="cancelHandler" style="margin-left:20px;color:#999;" slot="actions" />
      <mu-raised-button label="确认" @click="saveInfo" v-if="isChange" slot="actions" primary/>
      <mu-raised-button label="确认" @click="saveInfo" v-else disabled slot="actions" primary/>
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import datePickerEl from '../../../common/datePickerEl.vue'
  import checkBlock from '../../../common/checkBlock.vue'
  import radios from '../../../common/radios.vue'

  export default ({
    props: ['caseInfo'],
    data() {
      return {
        editName: '',
        editAge: '',
        editSex: '1',
        editCount: '',
        editPass: '',
        editPhone: '',
        editEdu: '',
        editHand: '',
        editDate: '',
        showDate: false,
        dateName: "出生日期",
        //用于判断是否有属性值更改
        isChange: false,
        //用于标识isChange变为true是由那个属性引起的
        cause: '',
        //初始值
        initData: {},
        select: GLOBAL.selectOption
      }
    },
    components:{
      checkBlock,
      radios,
      datePickerEl
    },
    mounted() {
      this.editInfo()
    },
    methods: {
      editInfo: function() {
        this.editName    = this.caseInfo.name;
        this.editAge     = this.caseInfo.birthday;
        this.editSex     = this.caseInfo.gender;
        this.editPhone   = this.caseInfo.telephone;
        this.editEdu     = this.caseInfo.education;
        this.editHand    = this.caseInfo.hand;
        this.editDate    = this.caseInfo.expire
        this.initData={
          editName: this.editName,
          editAge: this.editAge,
          editSex: this.editSex,
          editEdu: this.editEdu,
          editHand: this.editHand
        };
      },
      saveInfo: function() {
        var self = this;
        this.$validator.validateAll()
          .then(function(isValid){
            if (false == isValid)
            {
              return;
            }
            self.$http.post('/api/Cases/update', {
                'id': self.$route.params.id,
                'name':self.editName,
                'path': '',
                'birthday': self.editAge,
                'gender': self.editSex,
                'telephone': self.editPhone,
                'education':self.editEdu,
                'hand':self.editHand
              })
              .then(function(){
                this.$emit("submitData");
              })
          })
      },
      getChange: function(option,flag){
        console.log(option,flag)
        let key = '';
        switch (flag) {
          case 'edus':
            this.editEdu = option;
            key = "editEdu";
            break;
          case 'hands':
            this.editHand = option;
            key = "editHand";
            break;
          case 'gender':
            this.editSex = option;
            key = "editSex";
            break;
          default:
            break;
        }
        this.changeHandler(key, option);
      },
      getDate:function(item){
        console.log("caseinfo: " + item);
        var self = this;
        this.editDate = item;
        self.$http.post('/api/Cases/updateValidTime', {
            'id': self.$route.params.id,
            'validDay':self.editDate
          })
          .then(function(){
            self.showDate = false;
            location.reload();
          })
      },
      changeDate: function(){
        this.showDate = true;
      },
      // 获取选择的生日
      getBirthday: function(item){
        this.changeHandler("editAge", item);
        this.editAge = item;
      },
      //change事件处理函数
      keyupHandler(key, value) {
        this.changeHandler(key, value);
      },
      //判断是否有值发生改变
      changeHandler(key, value){
        if(value!=this.initData[key]){
          this.isChange = true;
          return false;
        }
        for(var initKey in this.initData){
          if(this[initKey]!=this.initData[initKey]){
            this.isChange = true;
            break;
          }
          this.isChange = false;
        }
      },
      cancelHandler() {
        this.$emit("close");
        this.isChange = false;
        $("input").blur();
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/css/app.styl"

</style>
