<template>
<div class="selectWrap">
  <div class="select-wrapper">
    <div class="select-wrapper-content" @click = "triggerOption">
      <div class="select-content">{{selectContent.text}}</div>
      <div class="triangle-wrapper">
        <div id="triangle-down"></div>
      </div>
    </div>
    <div class="option-wrapper" style="display: none;">
      <div class="option-item" v-for = "(item,index) in subject" :key="index" @mouseout="out($event)" @mouseover="move($event)" @click = "choose(item)">{{item.text}}</div>
    </div>
  </div>
</div>
</template>
<script>
  export default{
    props:{
      selectWidth:{
        type:Number,
        default:100,
      },
      subject:{
        type:Array,
        default:function(){
          return []
        }
      },
      selectContent:{
        type:Object,
        default:function(){
          return {value:0,text:"请选择"}
        }
      },
    },
    mounted(){
      document.querySelector(".selectWrap").style.width = this.selectWidth+"px";
    },
    computed:{
      optionWrapper(){
        return document.querySelector(".option-wrapper");
      },
      selectCon(){
        return document.querySelector(".select-content");
      },
      subjectList(){
        return document.getElementsByClassName("option-item");
      },
    },
    methods:{
      move(event){
        for(var item of this.subjectList){
          item.classList.remove("hover");
        }
        event.currentTarget.classList.add("hover");
      },
      out(event){
        event.currentTarget.classList.remove("hover");
      },
      triggerOption(){
        if (this.optionWrapper.style.display == "none") {
          this.optionWrapper.style.display = "block";
        }else{
          this.optionWrapper.style.display = "none";
        }
        for(var item of this.subjectList){
          if (item.innerHTML == this.selectContent.text) {
            item.classList.add("hover");
          }else{
            item.classList.remove("hover");
          }
        }
      },
      choose(item){
        this.selectContent.text = item.text;
        this.selectContent.value = item.value
        this.optionWrapper.style.display = "none";
        this.$emit("changeSelect",this.selectContent.text,this.selectContent.value);
      }
    },
  }
</script>
<style>
/*   .wrap{
  width: 100px;
} */
  .selectWrap{
    color:#000;
  }
  .select-wrapper-content{
    position: relative;
    overflow: hidden;
    min-width: 80px;
    width: 100%;
    height: 20px;
    line-height: 20px;
    border: 1px solid #000;
    cursor: default;
    font-size: 16px;
  }
  .select-content{
    text-align: left;
    padding-left: 2px;
  }
  .triangle-wrapper{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 20px;
    background-color: #fff;
    cursor: default;
  }
  #triangle-down{
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 6px solid #000;
  }
  .option-wrapper{
    position: relative;
    overflow: hidden;
    min-width: 80px;
    width: 100%;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    border-left: 1px solid #000;
  }
  .option-item{
    min-width: 80px;
    height: 20px;
    line-height: 20px;
    padding-right: 10px;
    padding-left: 2px;
    font-size: 16px;
    text-align: left;
    cursor: default; 
    background-color: #fff;
  }
  /* .option-item:hover{
    background-color: rgb(30,144,255) !important;
    color:#fff !important;
  } */
  .hover{
    background-color: rgb(30,144,255);
    color:#fff !important;
  }
</style>