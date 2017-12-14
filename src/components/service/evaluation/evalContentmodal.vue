<template>
  <div id="modal">
    <mu-dialog dialogClass="eval-dialog" :open="true" scrollable bodyClass='eval-dialog-body'>
      <mu-flexbox>
        <mu-flexbox-item class="flex-demoLeft">
          <mu-paper class="demo-paper" :zDepth="1" style="width:300px;height:300px;">
            <img :src="'/static/images/assess_icons/'+$parent.scaleName+'/icon.svg'" style="width:300px;height:300px;" />
          </mu-paper>
          <h4 class="footer-left-header">{{ $parent.scaleName }}</h4>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demoRight" v-if="$parent.startType == 2">
          <div class="body-right-head">
            <input type="text" name="" ref="search" @keyup="showAllIList" placeholder="输入搜索内容" v-model="$parent.search.keyword"/><i class="searchicon" @click="$parent.searchPeople">搜</i>
          </div>
          <div class="body-right-foot">
            <ul>
              <li v-for="(caseList,index) in $parent.caseLists" :class="{'on':$parent.flag==caseList.id}" @click="$parent.choseMe(caseList.id)" class="clearfix">
                <template v-if="caseList.name != '临时测评虚拟患者'">
                <span>{{(caseList.name+'').substr(-2,2)}}</span>
                <i :title="caseList.name">{{caseList.name}}</i>，<i v-if="caseList.gender == '1'">女</i><i v-else-if="caseList.gender == '2'">男</i><i v-else>其他</i>，{{caseList.age}}岁
                </template>
              </li>
            </ul>
          </div>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demoRight" v-else-if="$parent.startType == 1">
          <div class="body-right-head">
            <input type="text" class="searchEval" name="" placeholder="输入搜索内容" v-model="$parent.search.keyword"/><i class="searchicon" @click="$parent.searchPeople">搜</i>
          </div>
          <div class="body-right-foot">
            <ul>
              <li class="caseListEval" v-for="(caseList,index) in $parent.caseLists" @click="$parent.choseMe(caseList.id)" :class="{'on':$parent.flag==caseList.id}">
                <template v-if="caseList.name != '临时测评虚拟患者'">
                <span>{{(caseList.name+'').substr(-2,2)}}</span>
                <i>{{caseList.name}}</i>，<i v-if="caseList.gender == '1'">女</i><i v-else-if="caseList.gender == '2'">男</i><i v-else>其他</i>，{{caseList.age}}岁
                </template>
              </li>
            </ul>
            <div v-if="$parent.pages==0">
              无结果
            </div>
          </div>
        </mu-flexbox-item>
      </mu-flexbox>
      <div class="footer-button-position" v-if="$parent.startType == 2">
        <a href="javascript:void(0);"  @click="$parent.gotoEval($parent.caseIdDoc,$parent.scaleId, $parent.scaleAlias,false)" class="a-font">临时测评</a>
        <mu-raised-button label="取消" @click="closeEval2" style="margin:5px 20px 0 20px;color:#999;border-radius:20px;" slot="actions" />
        <!-- <button class="button startevm" @click="$parent.gotoEval($parent.caseId,$parent.scaleId, $parent.scaleAlias,false)" style="background-color: #0a81e5;margin-top:5px">开始测评</button> -->
        <button class="button" id="justTrain" style="margin-top:5px" @click="$parent.gotoEval($parent.caseId,$parent.scaleId, $parent.scaleAlias,false)" disabled>开始测评</button>
      </div>

      <div class="footer-button-position" v-else-if="$parent.startType == 1">
        <a href="javascript:void(0);" @click="$parent.gotoEval1($parent.caseIdDoc,$parent.scaleId)" class="a-font">临时测评</a>
        <mu-raised-button label="取消" @click="closeModal" style="margin:5px 30px 0 30px;color:#999;border-radius:20px;" slot="actions" />
        <!-- <button class="button startevm" @click="$parent.gotoEval1($parent.caseId,$parent.scaleId)" style="background-color: #0a81e5;margin-top:5px">开始测评</button> -->
        <button class="button" id="justTrain" style="margin-top:5px" @click="$parent.gotoEval1($parent.caseId,$parent.scaleId)" disabled>开始测评</button>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default ({
    data() {
      return {
        address: GLOBAL.cognition,
        // showModal: false,
      }
    },
    props:['parentData','showModal'],
    computed: {
      filteredStr: function() {
         var tmpStr = this.$parent.scaleAlias.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
        return tmpStr.replace(/&nbsp;/g, "").replace(/&le;/g, "<=").replace(/&ge;/g, ">=").replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<span style="line-height:1.5;">/g, "").replace(/<\/span>/g, "").replace(/&mdash;/g, "—").replace(/&plusmn;/g, "±").replace(/&rdquo;/g, "“").replace(/&ldquo;/g, "”").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      }
    },
    methods: {
      closeEval2:function(){
        this.$parent.showModal = false;
        this.$parent.caseId = '';
        this.$parent.flag = '';
        this.$parent.search.keyword = "";
      },
      closeModal:function(){
        this.$parent.showModal=false;
        this.$parent.caseId = '';
        this.$parent.flag = '';
        this.$parent.search.keyword = "";
      },
      showAllIList:function(){
        if(this.$parent.search.keyword == ''){
          this.$parent.searchPeople();
        }
      }
    }
  })
</script>

<style lang="stylus" scoped>
  .dialogClass
    width 800px!important
    height 500px!important
    max-width 800px!important
    max-height 500px!important
  .mu-dialog-body
    margin-top 8px
  .flex-demoLeft
    max-width 336px
  .flex-demoRight
    margin-top -30px
    margin-right 6px
  .demo-paper
    margin-left 6px
    margin-top 8px
    position relative
    top 8px
  .body-right-head
    position relative
    background-color #fff
    height 40px
    line-height 40px
  .body-right-head input
    width 100%
    height 40px
    margin-top 6px
    line-height 40px
    padding-left 20px
    background-color #f5f5f5
    outline none
  .body-right-head i
    text-indent -9999px
    position absolute
    margin-top 6px
    top 0
    right 0
    display inline-block
    width 40px
    height 40px
    border-radius 100px
    background #0A81E5 url("../../../assets/img/search.png") no-repeat center
  .body-right-foot
    margin 30px 0
    height 240px
    overflow auto
  ul li
    line-height 99px
    margin-top 0
    margin-right 30px
    text-align left
    border-bottom 1px solid #eee
    cursor pointer
  ul li span
    color #fff
    background-color #F6A623
    display inline-block
    width 47px
    height 47px
    line-height 50px
    border-radius 100px
    text-align center
  ul li:nth-child(4n+1) span
    background-color #1BBE9F!important
  ul li:nth-child(4n+2) span
    background-color #F6A623!important
  ul li:nth-child(4n+3) span
    background-color #E8570F!important
  ul li:nth-child(4n+0) span
    background-color #4990E2!important
  ul li i
    font-style normal
    font-weight bold
    margin-left 10px
    display inline-block
    vertical-align middle
    height 47px
    line-height 47px
    max-width 100px
    text-align center
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  .footer-container
    height 80px
    clear both
  .footer-left
    float left
    width 45%
  /*.footer-left h4
    margin 5px 0
    text-align left*/
  .footer-left-header
    margin-left 6px
    margin-top 15px
  .footer-left p
    margin 0
    text-align left
  .footer-right
    float right
    width 50%
    position relative
  .footer-down
    position absolute
    top 54px
    right 0
  .a-font
    font-size 14px
    color #333
    text-decoration underline
  .footer-down button
    margin 0 0 0 30px
    outline none!important
  .footer-button-position
    text-align right
    margin-top 30px
    margin-right 6px
  p.sec-p
    padding:0 0 0 -100px!important
  .on
    position relative
    /*background-color #eee*/
  .on::before
    content: '';
    position:absolute;
    top:35px;
    right:20px;
    display:inline-block!important;
    margin-left:30px;
    width:20px;
    height:20px;
    background-image: url('../../../assets/img/icon_select_blue.png');
  .clearfix {*zoom: 1;}
  .clearfix:after {display: table;line-height: 0;content: "";clear: both;}

  .startevm
    cursor not-allowed
    background #ddd!important
</style>
