<template>
  <div id="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" style="display: flex">
        <div class="modal-container" style="
        display: flex;
        flex-direction: column;
        ">
          <div class="modal-header">
            <h3>现场测评</h3>
          </div>
          <div class="modal-body" ref='body' style="
            flex-grow: 1;
          ">
            <div class="modal-evalBody">
              <div class="evalMenu">
                <span class="wdspan" @click="childCallOne(0)" :class="{'on':flag==0}"><div>全部</div></span>
                <span class="wdspan" @click="childCallOne(4)" :class="{'on':flag==4}"><div>认知</div></span>
                <span class="wdspan" @click="childCallOne(5)" :class="{'on':flag==5}"><div>言语-语言</div></span>
                <span class="wdspan" @click="childCallOne(6)" :class="{'on':flag==6}"><div>情绪与社会认知</div></span>
                <span class="wdspan" @click="childCallOne(71)" :class="{'on':flag==71}"><div>生活能力</div></span>
                <!--<span class="wdspan" @click="childCallOne(5)" :class="{'on':flag==5}"><div>综合</div></span>-->
              </div>
              <template>
                <div class="evalMenu">
                  <div v-if="flag == 0">
                    <span class="u-first">一级脑能力：</span>
                    <span class="u-second" :class="{'on1':num==item.scaleTagId}" v-for="item in evalList" @click = "changeList(item)">{{item.scaleTagName}}</span>
                   <!--  <span class="u-second" :class="{'on1':num==item.scaleTagId}" v-for="item in extraList" @click = "clearEvalList">{{item.scaleTagName}}</span> -->
                  </div>

                  <div v-else-if="flag != 0">
                    <span class="u-first">一级脑能力：</span>
                    <span class="u-second" :class="{'on1':num==item.scaleTagId}" v-for="item in evalList" v-if = "item.scaleGroupId == flag" @click = "changeList(item)">{{item.scaleTagName}}</span>
                    <!-- <span class="u-second" :class="{'on1':num==item.scaleTagId}" v-for="item in extraList" v-if = "item.scaleGroupId == routetype" @click = "clearEvalList">{{item.scaleTagName}}</span> -->
                  </div>
                </div>

              </template>
              <div class="modalList modal-set" style = "
                /* max-height: 578px */
              ">
                <!--训练方案修改 start-->
                <!--2.0量表开始-->
                  <template v-for="(item,index) in trainList2">
                    <div v-show="showList">
                      <div class="evalItem evalItem-trainmodal" v-if="flag == 0">
                          <div class="board pointer " :class="{touming:item.checked}" @click="selectedItem(item,index)">
                          <img :src="'/static/images/assess_icons/' + item.scaleName + '/icon.svg'"/>
                          </div>
                        <div class="itemName itemName-add">{{item.scaleName}}</div>
                        <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                      </div>

                      <div class="evalItem evalItem-trainmodal" v-else-if="flag != 0">
                        <div v-if="item.scaleGroupId==flag">
                          <div class="board pointer" :class="{touming:item.checked}" @click="selectedItem(item,index)">
                            <img :src="'/static/images/assess_icons/' + item.scaleName + '/icon.svg'"/>
                          </div>
                          <div class="itemName itemName-add">{{item.scaleName}}</div>
                          <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                        </div>
                      </div>
                    </div>
                    <div v-show="hideList">
                      <div class="evalItem evalItem-trainmodal">
                        <div v-if="item.scaleTagId == judge">
                          <div class="board pointer " :class="{touming:item.checked}" @click="selectedItem(item,index)">
                            <img :src="'/static/images/assess_icons/' + item.scaleName + '/icon.svg'"/>
                          </div>
                          <div class="itemName itemName-add">{{item.scaleName}}</div>
                          <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                        </div>
                      </div>
                    </div>
                </template>
                <!--2.0量表结束-->

                  <!--1.0量表开始-->
                <div v-show="showList">
                  <template v-for="(item,index) in trainList">
                    <div class="evalItem evalItem-trainmodal" v-if="flag == 0 && item.RESULTEXPLAIN != null">
                      <div class="board pointer" :class="{touming:item.checked}" @click="selectedItem(item,index)">
                        <img :src="'/static/images/assess_icons/' + item.SCALENAME + '/icon.svg'"/>
                      </div>
                      <div class="itemName itemName-add">{{item.SCALENAME}}</div>
                      <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                    </div>

                    <div class="evalItem evalItem-trainmodal" v-else-if="flag != 0 && item.RESULTEXPLAIN!=null">
                      <div v-if="item.scaleGroupId == flag">
                        <div class="board pointer" :class="{touming1:item.checked}" @click="selectedItem(item,index)">
                        <img :src="'/static/images/assess_icons/' + item.SCALENAME + '/icon.svg'"/>
                        </div>
                        <div class="itemName itemName-add">{{item.SCALENAME}}</div>
                        <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                      </div>
                    </div>
                  </template>
                </div>
                <div v-show="hideList">
                  <template v-for="item in trainList">
                    <div class="evalItem evalItem-trainmodal" v-if="item.RESULTEXPLAIN!=null">
                      <div v-if="item.scaleTagId == judge">
                        <div class="board pointer"  :class="{touming:item.checked}" @click="selectedItem(item,index)">
                        <img :src="'/static/images/assess_icons/' + item.SCALENAME + '/icon.svg'"/>
                        </div>
                        <div class="itemName itemName-add">{{item.SCALENAME}}</div>
                        <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                      </div>
                    </div>
                  </template>
                </div>
                  <!--1.0量表结束-->
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <mu-raised-button label="取消" @click="cancelhandler" style="color:#999;" />
            <mu-raised-button :disabled="disabled" label="去测评" @click="submitAction" primary/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import trainMenu from '../../../common/trainMenu.vue'
  import {removeByValue} from '../../../../assets/js/common.js'
  var _ = require('lodash');
  export default ({
    // 获取父级数据
    props: {
      //已经选择的训练方案
      games: {
        type: Array,
        default: function(){
          return []
        }
      },
      caseId:{
        type:String,
      }
    },
    data() {
      return {
        evalList: [],
        judge:" ",
        eval1:[],
        num:" ",
        WAB:{
          scaleTagId:21,
          scaleTagName:"言语综合测验",
          scaleGroupId:5,
        },//wab量表
        checkItem:{},
        oneGrade: '',
        twoGrade: '',
        trainList: [],
        trainList2: [],
        //第三方测评变量开始
        message: {
          initPromise: null,
          caseId: '', //病例id
          scaleId: '',//量表id
          scaleAliasName: '', //量表别名
          isRestart: false, //是否是重新测评
          // 是否开始监听message
          inited: false,
          targetWindow: null,
          modules: []
        },//第三方测评变量结束
        flag:0,
        routetype:0,
//        thirdpartyurl:"http://rc-thirdparty.66nao.com"
        thirdpartyurl:"http://rc-thirdparty.66nao.com",
        disabled:true,
      }
    },
    components:{
      trainMenu
    },
    computed:{
      showList () {
        return this.$store.state.evalItems.show;
      },
      hideList () {
        return this.$store.state.evalItems.hide;
      }
    },
    methods: {
      changeList (item) {
        this.judge = item.scaleTagId;
        this.num = item.scaleTagId;
        this.$store.commit("changeEval");
      },
      childCallOne:function(childparam){//父页面侦听事件
        this.flag = childparam;
        this.$store.commit("changeEvalMenu");
      },
      fetch: function (id) {
        var self = this;
        var cachekk = '';
        if (this.oneGrade >= 0){
            //
          Vue.http({
            method: 'GET',
            url:'/api/Evaluation/getScales',
            params: {
            }
          })
            .then(
              function(res){
                for(var key in res.data.data){
                  var kk = res.data.data[key];
                  kk["checked"] = false;
                  self.trainList2.push(kk);
                  cachekk = kk;
                }
              }
            );
          //
          Vue.http({
              method: 'GET',
              url: '/api/Evaluation/assess_scales'
            })
            .then(function(res){
              // 区分2.0的言语训练
                console.log(res.data.data);
                for(var key in res.data.data){
                  var kk1 = res.data.data[key];
                  kk1["checked"] = false;
                  self.trainList.push(kk1);
                }
                console.log(self.trainList);
/*                self.trainList.unshift(cachekk);*/
                var log = console.log.bind(console);
                self.eval1 = res.data.data;
                console.log(self.eval1);
                var count = res.data.data;
                var listArrTI = [],
                    listArrTN = [],
                    listArrGI = [];
                var listGI = [];
                for (var i = 0; i < count.length; i++) {
                  if (typeof count[i].scaleTagName != "undefined") {
                    for (var j = 0; j < Object.keys(count[i]).length; j++) {
                      if (listArrTN.indexOf(count[i].scaleTagName) == -1) {
                        listArrTN.push(count[i].scaleTagName);
                      }
                      if (listArrTI.indexOf(count[i].scaleTagId) == -1) {
                        listArrTI.push(count[i].scaleTagId);
                        switch(count[i].scaleTagId){
                          case 13:
                          case 14:
                          case 15:
                          case 19:
                            listArrGI.push(4);
                            break;
                          case 28:
                          case 29:
                          case 32:
                            listArrGI.push(6);
                            break;
                          case 73:
                          case 75:
                          case 74:
                            listArrGI.push(71);
                            break;
                          case 27:
                            listArrGI.push(5);
                            break;
                        }
                      }
                    }
                  }
                }
                log(listArrTI);
                log(listArrTN);
                log(listArrGI);
                for (var i = 0; i < listArrTI.length; i++) {
                  var list = {};
                  list["scaleTagId"] = listArrTI[i];
                  list["scaleTagName"] = listArrTN[i]
                  list["scaleGroupId"] = listArrGI[i]
                  self.evalList.push(list);
                }
                self.evalList.push(self.WAB);
                log(self.evalList);
                });
        }
      },
      uncheckItem:function(){},
      selectedItem: function (item, index) {
        this.disabled = false;
        this.uncheckItem();
        item.checked = true;
        this.checkItem = item;
        this.uncheckItem = ((item)=>{item.checked = false;}).bind(undefined, item);
        /*$("#doTrain").attr("disabled",false).css("background-color","#0a81e5");*/
        console.log(this.checkItem);
      },
      traincontentCall:function(p1,p2,p3){
        if(typeof p3 == 'undefined'){
          this.oneGrade = p1;
          this.twoGrade = p2;
          this.fetch();
        } else {
          this.fetch(p3);
        }
      },
      cancelhandler(){
        this.$emit('close');
      },//1.0测评开始
      gotoEval1:function(caseId,scaleId){
        var self = this;
        if(caseId){
          self.$router.push({ path: "/doc/startEval/",query: { caseId: caseId, scaleId:scaleId}});
        }

      },
      submitAction(){
          var self = this;
          var caseParamsId = "";
          if (self.$route.params.id) {
            caseParamsId = self.$route.params.id;
          }else if (self.caseId) {
            caseParamsId = self.caseId;
          }
          console.log(caseParamsId);
          console.log(self.checkItem['ID']);
        if(self.checkItem['id'] != undefined){
          console.log('2.0 ok!!');
          var caseId = caseParamsId;
          var scaleId = self.checkItem['id'];
          var scaleAliasName = self.checkItem['scaleAlias'];
          var isRestart= false;
          self.openThirdparty(caseId, scaleId, scaleAliasName, isRestart);
        }else{
          console.log('1.0 ok!!');
          this.gotoEval1(caseParamsId,this.checkItem['ID']);
        }

      },
      //第三方测评开始
      openThirdparty: function (caseId, scaleId, scaleAliasName, isRestart) {
        var self = this;
        _.assign(self.message, {
          caseId: caseId,
          scaleId: scaleId,
          scaleAliasName: scaleAliasName,
          isRestart: isRestart
        });
//        self.message.caseId=caseId;
//        self.message.scaleId=scaleId;
//        self.message.scaleAliasName=scaleAliasName;
//        self.message.isRestart = isRestart;
//        self.initPromise = isRestart ? Promise.resolve() : self.$http.get('/api/Thirdparty/getModules', { scaleId: scaleId, caseId: caseId });
        self.initPromise = isRestart ? Promise.resolve() : Vue.http({
          method:'GET',
          url:'/api/Thirdparty/getModules',
          params:{ scaleId: scaleId, caseId: caseId }
        });
//        this.initPromise = self.$http.get('/api/Thirdparty/getModules', { scaleId: scaleId, caseId: caseId });
        // 为解决弹出窗口会被拦截的问题，需要设置为先打开地址然后获取模块
//        self.message.targetWindow = window.open('http://thirdparty.66nao.com' + '/#!/'
        self.message.targetWindow = window.open(self.thirdpartyurl + '/#!/'
          + scaleAliasName + '?origin=' + location.origin + (isRestart ? '&restart=restart' : ''));
        self.message.inited = true;
        self.initPromise.then(function (result) {
          if (result) {
            self.message.caseId=result.data.data.uid;
            self.message.modules = result.data.data.modules;
            self.message.lastDay = result.data.data.lastDay;
//            console.log(result.data.data.lastDay);
          }
        });
      },
      messageHandler: function (data) {
        var self = this;
        // 页面当开第三方测评后才开始监听
        if (self.message.inited) {
          if (data.data.source && data.data.source === 'thirdparty') {
//            console.log(new Date(),'----------->', data);
            switch (data.data.message) {
              // 页面加载完成
              case 'opened':
                console.log('打开：');
                var postData = { source: 'rehab', message: 'start', aliasName: self.message.scaleAliasName };
                if (!self.message.isRestart) {
                  _.assign(postData, { modules: this.message.modules, lastDay: this.message.lastDay });
//                  postData.module = self.message.modules;
//                  postData.lastDay = self.message.lastDay;
                }
                // 数据获取完成后再发送消息
                self.initPromise.then(function () {
                  // 开始测评消息
//                  setTimeout(function(){
//                    self.message.targetWindow.postMessage(postData,'http://kf.ngrehab.66nao.com:90');
//                  },1000);
                  self.message.targetWindow.postMessage(postData,self.thirdpartyurl);
                });
                break;
              // 获取模块具体完成信息
              case 'module:status':
                console.log('状态：');
                var moduleIndex = data.data.moduleIndex;
//                console.log(moduleIndex,self.message.scaleId,self.message.caseId);
//                self.$http.get('/api/Thirdparty/getModuleStatus', {
//                  scaleId: self.message.scaleId,
//                  caseId: self.message.caseId,
//                  moduleIndex: moduleIndex
//                })
                Vue.http({
                  method:'GET',
                  url:'/api/Thirdparty/getModuleStatus',
                  params:{
                    scaleId: self.message.scaleId,
                    caseId: self.message.caseId,
                    moduleIndex: moduleIndex
                  }
                })
                  .then(function (result) {
                    self.message.targetWindow.postMessage({
                      source: 'rehab',
                      message: 'module:status:ok',
                      aliasName: self.message.scaleAliasName,
                      module: result.data
                    }, self.thirdpartyurl);
                  });
                break;
              // 更新模块信息
              case 'module:update':
                console.log('更新：');
//                  console.log('testID');
//                console.log(self.message.scaleId);
                self.$http.post('/api/Thirdparty/updateModule', {
                  scaleId: self.message.scaleId,
                  caseId: self.message.caseId,
                  moduleIndex: data.data.index,
                  time: data.data.time,
                  module: data.data.module
                })
                  .then(function (result) {
                    self.message.targetWindow.postMessage({
                      source: 'rehab',
                      message: 'module:update:ok'
                    },self.thirdpartyurl);
                  });
                break;
              // 提交测评，生成报告
              case 'commit':
                console.log('提交：');
//                  console.log(data.data);
                self.$http.post('/api/Thirdparty/commit', {
                  scaleId: self.message.scaleId,
                  caseId: self.message.caseId
                })
                  .then(function (result) {
                    self.message.targetWindow.postMessage({ source: 'rehab', message: 'commit:ok' }, self.thirdpartyurl);
                    if (result.data.resultCode === 20000) {
                      console.log('commit is ok!!');
                      self.$parent.showEvaluation=false;//隐藏现场测评浮层
                      self.$router.push({ path: '/doc/cases/evalRecord/'+self.message.caseId,query: { reId: result.data.reportId}});
                    }
                  });
                break;
            }
          }
        }
      }
      //第三方测评结束
    },
    mounted(){
//        console.log(this.store.account);
      this.$refs.body.style.maxHeight = String(this.$refs.body.clientHeight) + "px";
      this.fetch();//第三方测评结束
    window.addEventListener('message', this.messageHandler);//第三方测评结束
  },
    beforeDestroy(){
      this.inited = false;//第三方测评结束
      window.removeEventListener('message', this.messageHandler);//第三方测评结束
      if(!this.addPlan){
        return;
      }
      this.checkItem.forEach(function(item, index){
        item.checked = false;
      });
    }
  })
</script>
<style lang="stylus">
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"
  @import "../../../../assets/css/modal.styl"

  /*===下方是本页弹出框的样式补充=======*/
  .modal-container
    @media screen and (max-height: 800px)
      width 90vw
      height 90vh
    width 1024px
    height 800px
  .modal-evalBody
    margin-top -16px
    text-align left
  .evalItem
    padding-top 30px
    position relative
    .mengban
      position absolute
      top 110px
      left 70px
  .modal-set
    @media screen and (max-height: 800px)
      max-height unset !important
  .touming1
    background-color #000!important
    opacity 0.5
  .hideImg
    display none
  .u-train-doc
    text-align left
  .itemName
    width 200px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  .evalItem:empty
    display none
  button#doTrain
    background-color: #ccc;
  .evalMenu
    border-bottom 1px solid #eee
    tap-highlight-color transparent
    -webkit-tap-highlight-color transparent
    -moz-tap-highlight-color transparent
    span
      display inline-block
      width 112px
      height 60px
      line-height 60px
      text-align center
      cursor pointer
    :hover
        color $color-font-primary
    :active
      color $color-font-primary
    .u-first
      width 120px
      padding-left 35px
      white-space nowrap
    .u-second
      padding-left 30px
      text-align center
      width auto
      opacity .5
      tap-highlight-color transparent
      -webkit-tap-highlight-color transparent
      -moz-tap-highlight-color transparent
  .touming
    position relative
  .touming::after
    content ' '
    position absolute
    left 0
    top 0
    display inline-block
    width 140px
    height 140px
    background-color #000
    opacity 0.5
  .on1
    color #444
  .on1.u-second
    opacity 1
  .hideImg
    display none
  .evalItem-trainmodal
    width 140px
    .board
      width 140px
      height 140px !important
      img
        width 140px !important
</style>
