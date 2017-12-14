<template>
  <mu-appbar class="bgClass"  titleClass="appbarTitle">
    <div class="input-wrapper">
      <div class="input-style"></div>
      <mu-text-field  :underlineShow="false" slot="left" :hintText="hintDesc" hintTextClass="textField" v-model="search.keyword"/>
      <mu-raised-button class="btnSearchClass" color="#0a81e9" label="搜索" slot="left" @click="searchKeyword" />
    </div>
    <mu-raised-button class="btnNewbuild" :label="labelFlag" slot="right" primary  @click="buildNewOrder" />
  </mu-appbar>
</template>

<script>
export default{
  props:["flag"],
  data(){
    return{
      search: {
        keyword: ''
      },
      showModal: false
    }
  },
  computed:{
    labelFlag:function(){
      if(this.flag == 1){
        return "新建档案"
      } else {
        return "新建订单"
      }
    },
    hintDesc: function(){
      if(this.flag == 1){
        return "请输入姓名或账号搜索…"
      } else {
        return "请输入订单ID或患者手机号查询…"
      }
    }
  },
  methods:{
    searchKeyword: function() {
      this.$emit('getSearch',this.search);
    },
    buildNewOrder: function(){
      this.showModal = true;
      this.$emit('getshowModel',this.showModal);
    }

  }
}
</script>

<style >
.appbarTitle{
  height: 100px !important;
}
.bgClass{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff !important;
}
.input-wrapper{
  position: relative;
  display: inline-block;
  margin-top:20px;
  width: 230px;
  height: 56px;
  padding-left: 20px;

}
.input-style{
  position: absolute;
  left: 0px;
  width: 250px;
  height: 40px;
  background-color: #F5F5F5;
  border-radius: 50px;
  margin: 15px;
}
.textField{
  font-size: 15px;
}
.btnSearchClass{
  background-color: #1BBE9F !important;
  border-radius: 20px !important;
  color:#fff !important;
  font-size: 15px !important;
  font-family: _GB2312 KaiTi_GB2312 !important;
}
.btnNewbuild{
  border-radius: 20px !important;
  color:#fff !important;
  font-size: 15px !important;
  font-family: _GB2312 KaiTi_GB2312 !important;
}
</style>
