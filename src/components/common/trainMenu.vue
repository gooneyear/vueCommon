<template>
  <div style="margin-top:20px;">
    <mu-tabs lineClass="mu-tab-line" style="background-color:#fff;" :value="activeTab" @change="handleTabChange">
      <mu-tab value="all" @click="getGrade(0,1)" title="全部"/>
      <mu-tab value="cogn" @click="getGrade(10,1)" title="认知"/>
      <mu-tab value="lan" @click="getGrade(11,1)" title="言语-语言"/>
      <mu-tab value="men" @click="getGrade(12,1)" title="情绪与社会认知"/>
    </mu-tabs>
    <mu-tabs :value="activeTab2" @change="handleTabChange2" style="background-color:#fff;">
      <mu-tab style="color:#000" title="一级能力" disabled />
      <mu-tab v-if="index<9" titleClass="tab-font" :title="c.name" :value="index" v-for="(c,index) in allClass" @click="getTwoGrade(index,2,c.id)" />
    </mu-tabs>
    <mu-tabs :value="activeTab2" @change="handleTabChange2" style="background-color:#fff;">
      <mu-tab v-if="index>8" titleClass="tab-font" :title="c.name" :value="index" v-for="(c,index) in allClass" @click="getTwoGrade(index,2,c.id)" />
    </mu-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
  export default ({
    data() {
      return{
        address: require('../../../static/js/config.js'),
        activeTab: "all",
        activeTab2: "",
        allClass: [],
        oneNum:0,
        twoNum: -1,  // 默认不选中
        threeNum: -1,
        active:0,
        dailyClass:[],
        count:0,
        dailyList:[],
        planClass:[],
        planCount:0,
        planList:[],
        show10:false,//用来控制是否展示最高级菜单
        show11:false,
        show12:false,
      }
    },
    props:["all","daily","plan"],
    mounted(){
        this.allClass = this.address.trainClass;
    },
    methods : {
      trainmenuCall : function(menuparam1,menuparam2,id){
        this.$emit('trainmenuEvent',menuparam1,menuparam2,id);//抛出事件给父页面
      },
      handleTabChange (val) {
        this.activeTab = val;
        this.activeTab2 = '';
      },
      handleTabChange2 (val) {
        this.activeTab2 = val;
      },
      getGrade:function(chosNum,grade){
        switch(grade){
          case 1:
            this.oneNum = chosNum;
            break;
          case 2:
            this.twoNum = chosNum;
            break;
          case 3:
            this.threeNum = chosNum;
            break;
          default:
            this.oneNum = chosNum;
            break;
        }
        // 不是全部的分类
        if (chosNum >0){
          this.allClass = [];
          for(var i=0; i<this.address.trainClass.length; i++){
            if(this.address.trainClass[i].pid == chosNum){
              this.allClass.push(this.address.trainClass[i]);
            }
          }
        } else {
          this.allClass = this.address.trainClass;
        }
        this.twoNum = -1;
        this.trainmenuCall(this.oneNum,this.twoNum);
      },
      getTwoGrade:function(chosNum,grade,id){
        this.twoNum = chosNum;
        this.trainmenuCall(chosNum,grade,id);
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  .mu-tab-line
    background-color #0a81e5 !important
  .mu-tabs
    background-color #fff
  .tab-font
    color #999 !important
</style>
