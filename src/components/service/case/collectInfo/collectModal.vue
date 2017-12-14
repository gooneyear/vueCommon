<template>
  <div id="modal">
    <mu-dialog :open="true" scrollable title="信息采集" bodyClass='info-dialog-body' dialogClass='info-dialog'>
      <mu-flexbox>
        <mu-flexbox-item>
          <mu-flexbox orient="vertical">
            <mu-flexbox-item>
              <mu-text-field label="姓名" v-validate="'required|cnName|max:20'" name="姓名"
              :errorText="errors.first('姓名')" v-model="collect.name" /><br/>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <checkBlock :label="select.gender.name" :value="collect.gender" :options="select.gender.options" :flag="select.gender.flag" @changeVal="getChange"></checkBlock>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <datePickerEl :label="dateName" :defaults="collect.birthday"  @changeDate="getDate" style="transform: translate(3px, 0px);"></datePickerEl>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <radios
                :label="select.edus.name"
                :value="collect.education"
                :isFirst="1"
                ref="edu"
                :options="select.edus.options"
                :flag="select.edus.flag"
                :styles="{warning: {position: 'absolute', transform: 'translate(300px,  -30px)',}}"
                @changeVal="getChange"
              ></radios>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <radios
                :label="select.place.name"
                :value="collect.area"
                :isFirst="1"
                ref="curAddr"
                :options="select.place.options"
                :flag="select.place.flag"
                :styles="{warning: {position: 'absolute', transform: 'translate(300px,  -30px)',}}"
                @changeVal="getChange"
                style="
                  transform: translate(0px, 0px);
                "></radios>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <radios
                :label="select.marry.name"
                :value="collect.marry"
                :isFirst="1" ref="marriage"
                :options="select.marry.options"
                :flag="select.marry.flag"
                :styles="{warning: {position: 'absolute', transform: 'translate(300px,  -30px)',}}"
                @changeVal="getChange"
                style="
                  transform: translate(0px, 0px);
                "></radios>
            </mu-flexbox-item>
          </mu-flexbox>
        </mu-flexbox-item>

        <mu-flexbox-item>
          <mu-flexbox orient="vertical">
            <mu-flexbox-item>
              <mu-text-field label="当前职业" v-validate="'cnName|max:20'" name="当前职业"
              :errorText="errors.first('当前职业')" v-model="collect.currentJob" /><br/>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <mu-text-field label="工作单位" v-validate="'cnName|max:30'" name="工作单位"
              :errorText="errors.first('工作单位')" v-model="collect.workspace" /><br/>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <mu-text-field label="曾经职业" v-validate="'cnName|max:20'" name="曾经职业"
              :errorText="errors.first('曾经职业')" v-model="collect.previousJob" /><br/>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <mu-text-field label="联系人" v-validate="'cnName|max:20'" name="联系人"
              :errorText="errors.first('联系人')" v-model="contact.contacts" /><br/>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <mu-text-field label="与患者关系" v-validate="'cnName|max:10'" name="与患者关系"
              :errorText="errors.first('与患者关系')" v-model="contact.relation" /><br/>
            </mu-flexbox-item>
            <mu-flexbox-item>
              <mu-text-field label="联系电话" v-validate="'contact|max:20'" name="联系电话"
              :errorText="errors.first('联系电话')" v-model="contact.telephone" /><br/>
            </mu-flexbox-item>
          </mu-flexbox>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-flexbox orient="vertical">
        <mu-flexbox-item>
          <span style="font-size:12px;">家庭住址</span><br>
          <chinaArea
            :family="all"
            :isFirst="{pCode:1, cCode:1, aCode:1, addr:1 }"
            :warning_style = "{marginLeft: '20px', position: 'absolute', width: '200px', top: '60px'}"
            ref="addr"
            v-model="collect.address"
            @changeAddress="getAddress"></chinaArea>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <mu-text-field label="家族病史" v-validate="'max:600'" name="家族病史"
          :errorText="errors.first('家族病史')" v-model="illFamily" /><br/>
        </mu-flexbox-item>
        <mu-flexbox-item>
          <mu-list>
            <mu-sub-header>病史</mu-sub-header>
            <mu-list-item v-for="(ill,index) in ills">
              <mu-icon value="delete_forever" slot="right" v-if="Object.keys(ills).length > 1" @click="deleteIll(ill)"/>
              <mu-icon value="add_box" slot="left" @click="addIll"/>
              <div class="m-wrap-collect">
                <div style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                ">
                  <datePickerEl :defaults="ill.begin" :index="index" @changeDate="getIllBegin"></datePickerEl>&nbsp;至&nbsp;
                  <datePickerEl :defaults="ill.end" :index="index" @changeDate="getIllEnd"></datePickerEl>
                  <span class="is-danger" style="transform:translate(300px, 0)">{{ills[index].illError}}</span>
                </div>
                <div style="display: flex;flex-direction: row;">
                  <mu-text-field v-validate="{max:600}" name="病史" v-model="ills[index].desc" />
                  <span class="is-danger" style="transform:translate(300px, -40px)">{{ errors.first('病史') }}</span>
                </div>
              </div>
            </mu-list-item>
          </mu-list>
          <mu-list>
            <mu-sub-header>服药史</mu-sub-header>
            <mu-list-item v-for="(pill,index) in pills">
              <mu-icon value="delete_forever" slot="right" v-if="Object.keys(pills).length > 1" @click="deletePill(pill)"/>
              <mu-icon value="add_box" slot="left" @click="addPill"/>
                <div class="m-wrap-collect">
                  <div style="
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                  ">
                    <datePickerEl :defaults="pill.begin" :index="index" @changeDate="getPillBegin" ></datePickerEl>&nbsp;至&nbsp;
                    <datePickerEl :defaults="pill.end" :index="index" @changeDate="getPillEnd" ></datePickerEl>
                    <span class="is-danger" style="transform:translate(300px, 0)">{{pills[index].pillError}}</span>
                  </div>
                  <div style="
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                  ">
                    <mu-text-field v-validate="{max:600}" name="服药史" v-model="pills[index].desc"/>
                    <span class="is-danger">{{ errors.first('服药史') }}</span>
                  </div>
                </div>
            </mu-list-item>
          </mu-list>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-raised-button label="取消" @click="$emit('close')" style="color:#999;margin-left:20px;" slot="actions" />
      <mu-raised-button label="确认" @click="submitData" class="btn-style" slot="actions" primary/>
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import checkBlock from '../../../common/checkBlock.vue'
  import radios from '../../../common/radios.vue'
  import datePickerEl from '../../../common/datePickerEl'
  import chinaArea from '../../../common/chinaArea.vue'
  import {curDate,removeByValue,compareDate,date2Str} from '../../../../assets/js/common.js'
  import VeeValidate from 'vee-validate'

  export default ({
    props: ['collect', 'contact', 'ill', 'history'],

    data() {
      return {
        select: GLOBAL.selectOption,
        dateName: "出生日期",
        ills: [
          {begin:'',end:'',desc:'',illError:''}
        ],
        pills:[
          {begin:'',end:'',desc:'',pillError:''}
        ],
        historys:{},
        illFamily: '',
        illFlag: false,
        pillFlag: false,
        all: '',
        tempAll: '', // 临时保存家庭地址的json对象，用于检测的
        errorFlag: false,
        //提示
        name_tip: ''
      }
    },
    computed: {
      marry: function(){
        if (this.collect.marry == 0){
          return '请选择婚姻状态.'
        }
      }
    },
    created (){
      try{
        this.all = JSON.parse(this.collect.address);
      } catch(e){
        this.all = this.collect.address
      }
      // 此句解决修改信息采集时，若不修改地址就不发请求的问题。
      this.tempAll = this.all;
      this.illFamily = this.ill;
      if(Object.keys(this.history.ill).length>0){
        this.ills = this.history.ill;
      }
      if(Object.keys(this.history.pill).length>0){
        this.pills = this.history.pill;
      }
    },
    components:{
      checkBlock,
      radios,
      chinaArea,
      datePickerEl
    },
    methods: {
      // 将编辑好的数据提交给后台接口
      submitData: function(){
        var self = this;
        let edu = self.$refs.edu;
        let curAddr = self.$refs.curAddr;
        let marriage = self.$refs.marriage;
        let addr = self.$refs.addr;
        edu.isFirstFlag = (edu.select==0)?0:1;
        curAddr.isFirstFlag = (curAddr.select==0)?0:1;
        marriage.isFirstFlag = (marriage.select==0)?0:1;
        addr.isFirstFlag.pCode = addr.province?1:0;
        console.log(addr.city, (addr.city))
        addr.isFirstFlag.cCode = addr.city?1:0;
        addr.isFirstFlag.aCode = addr.area?1:0;
        addr.isFirstFlag.addr = addr.address?1:0;
        // 判断各下拉字段若为空则不许提交
        if(this.collect.education == 0 ||
          this.illFlag || this.pillFlag){
          console.log(!this.tempAll,!this.tempAll.aCode,!this.tempAll.cCode,!this.tempAll.pCode,!this.tempAll.addr, !this.illFlag,!this.pillFlag);
          this.errorFlag = true;
        } else {
          this.errorFlag = false;
        }
        this.historys.ills = this.ills;
        this.historys.pills = this.pills;
        this.$validator.validateAll()
          .then(function(result) {
            // 添加下拉框未选择时不能提交数据的判断
            if(true == result && !self.errorFlag){
              self.$emit('submitData', self.collect, self.contact, self.illFamily, self.historys);
            }
          })
      },
      getChange: function(option,flag){
        switch (flag) {
          case 'edus':
            this.collect.education = option;
            break;
          case 'place':
            this.collect.area = option;
            break;
          case 'marry':
            this.collect.marry = option;
            break;
          case 'gender':
            this.collect.gender = option;
            break;
          default:
            break;
        }
      },
      // 获取选定的病例日期
      getIllBegin: function(date,index){
        this.ills[index].begin = date;
        if (compareDate(this.ills[index].begin,this.ills[index].end)){
          this.ills[index].illError = "结束时间必须大于开始时间！";
          this.illFlag = true;
        } else {
          this.ills[index].illError = "";
          this.illFlag = false;
        }
      },
      getIllEnd: function(date,index){
        this.ills[index].end = date;
        if (compareDate(this.ills[index].begin,this.ills[index].end)){
          this.ills[index].illError = "结束时间必须大于开始时间！";
          this.illFlag = true;
        } else {
          this.ills[index].illError = "";
          this.illFlag = false;
        }
      },
      getPillBegin: function(date,index){
        this.pills[index].begin = date;
        if (compareDate(this.pills[index].begin,this.pills[index].end)){
          this.pills[index].pillError = "结束时间必须大于开始时间！";
          this.pillFlag = true;
        } else {
          this.pills[index].pillError = "";
          this.pillFlag = false;
        }
      },
      getPillEnd: function(date,index){
        this.pills[index].end = date;
        if (compareDate(this.pills[index].begin,this.pills[index].end)){
          this.pills[index].pillError = "结束时间必须大于开始时间！";
          this.pillFlag = true;
        } else {
          this.pills[index].pillError = "";
          this.pillFlag = false;
        }
      },
      getBirthday: function(item){
        this.collect.birthday = item;
      },
      // 获取选定的日期
      getDate: function(item){
        this.collect.birthday = item;
      },
      getAddress: function(all){
        this.tempAll = all;
        this.collect.address = JSON.stringify(all);
      },
      deleteIll:function(item){
        removeByValue(this.ills,item);
      },
      deletePill:function(item){
        removeByValue(this.pills,item);
      },
      addIll: function(){
        this.ills.push({begin:'',end:'',desc:''});
      },
      addPill: function(){
        this.pills.push({begin:'',end:'',desc:''});
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/css/app.styl"

</style>
