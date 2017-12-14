<template>
  <div>
    <template>
      <div>
        <mu-tabs v-if="routetype == 0" style="background-color:#fff;" :value="activeTab1" @change="handleTabChange1">
          <mu-tab value="all1" style="color:#000;" title="一级脑能力" disabled />
          <mu-tab v-if="index < 5" :value="index" titleClass="tab-font" v-for="item,index in evalList" @click="changeList(item)" :title="item.scaleTagName"/>
        </mu-tabs>
        <mu-tabs v-if="routetype == 0" style="background-color:#fff;" :value="activeTab1" @change="handleTabChange1">
          <mu-tab v-if="index > 4" :value="index" titleClass="tab-font" v-for="item,index in evalList" @click="changeList(item)" :title="item.scaleTagName"/>
        </mu-tabs>
        <mu-tabs v-else-if="routetype != 0" style="background-color:#fff;" :value="activeTab2" @change="handleTabChange2">
          <mu-tab value="all2" style="color:#000;" title="一级脑能力" disabled />
          <mu-tab :value="index" titleClass="tab-font" v-for="item,index in evalList" v-if = "item.scaleGroupId==routetype" @click="changeList(item)" :title="item.scaleTagName"/>
        </mu-tabs>
      </div>
    </template>
    <div id="evalContent">

      <!--2.0量表开始-->
      <template v-for="item in evllist">
        <div v-show="showList">
          <div class="evalItem" v-if="routetype == 0">
              <div class="board pointer" @click="showDetail(item.scaleName,item.id,item.scaleAlias,caseId='')">
              <img :src="'/static/images/assess_icons/' + item.scaleName + '/icon.svg'"/>
              </div>
            <div class="boardName">{{ item.scaleName }}</div>
          </div>

          <div class="evalItem" v-else-if="routetype != 0">
            <div v-if="item.scaleGroupId==routetype">
              <div class="board pointer" @click="showDetail(item.scaleName,item.id,item.scaleAlias,caseId='')">
                <img :src="'/static/images/assess_icons/' + item.scaleName + '/icon.svg'"/>
              </div>
              <div class="boardName">{{ item.scaleName }}</div>
            </div>
          </div>
        </div>
        <div v-show="hideList">
          <div class="evalItem">
            <div v-if="item.scaleTagId == judge">
              <div class="board pointer" @click="showDetail(item.scaleName,item.id,item.scaleAlias,caseId='')">
                <img :src="'/static/images/assess_icons/' + item.scaleName + '/icon.svg'"/>
              </div>
              <div class="boardName">{{ item.scaleName }}</div>
            </div>
          </div>
        </div>
    </template>
    <!--2.0量表结束-->

      <!--1.0量表开始-->
    <div v-show="showList">
      <template v-for="item in eval1">
        <div class="evalItem" v-if="routetype == 0 && item.RESULTEXPLAIN != null">
          <div class="board pointer" @click="showDetail1(item.SCALENAME,item.ID,item.RESULTEXPLAIN,caseId='')">
            <img :src="'/static/images/assess_icons/' + item.SCALENAME + '/icon.svg'"/>
          </div>
          <div class="boardName">{{ item.SCALENAME }}</div>
        </div>

        <div class="evalItem" v-else-if="routetype != 0 && item.RESULTEXPLAIN!=null">
          <div v-if="item.scaleGroupId == routetype">
            <div class="board pointer" @click="showDetail1(item.SCALENAME,item.ID,item.RESULTEXPLAIN,caseId='')">
            <img :src="'/static/images/assess_icons/' + item.SCALENAME + '/icon.svg'"/>
            </div>
            <div class="boardName">{{ item.SCALENAME }}</div>
          </div>
        </div>
      </template>
    </div>
    <div v-show="hideList">
      <template v-for="item in eval1">
        <div class="evalItem" v-if="item.RESULTEXPLAIN != null">
          <div v-if="item.scaleTagId == judge">
            <div class="board pointer" @click="showDetail1(item.SCALENAME,item.ID,item.RESULTEXPLAIN,caseId='')">
            <img :src="'/static/images/assess_icons/' + item.SCALENAME + '/icon.svg'"/>
            </div>
            <div class="boardName">{{ item.SCALENAME }}</div>
          </div>
        </div>
      </template>
    </div>
      <!--1.0量表结束-->

  <div id="container">
    <evalContentmodal v-if="showModal" :parentData="parentData" :showModal="showModal"></evalContentmodal>
  </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import evalContentmodal from './evalContentmodal.vue'
var _ = require('lodash');
// import evalPage from '../evaluation/recordPage.vue'

  export default ({
    data() {
      return {
        store: require('../../../app/store.js'),
        activeTab1: "",
        activeTab2: "",
        evalList: [],
        judge:" ",
        num:" ",
        parentData:{
          name:'wsd',
          age:23
        },
        /*extraList:[
          {
            scaleTagName:"注意力",
            scaleGroupId:4,
            scaleTagId:
          },
          {
            scaleTagName:"感知觉",
            scaleGroupId:4,
          },
          {
            scaleTagName:"敏捷性",
            scaleGroupId:4,
          },
          {
            scaleTagName:"计算与推理",
            scaleGroupId:4,
          },
          {
            scaleTagName:"听理解",
            scaleGroupId:5,
          },
          {
            scaleTagName:"口语生成",
            scaleGroupId:5,
          },
          {
            scaleTagName:"阅读能力",
            scaleGroupId:5,
          },
          {
            scaleTagName:"书写能力",
            scaleGroupId:5,
          },
          {
            scaleTagName:"物体识别",
            scaleGroupId:5,
          },
          {
            scaleTagName:"气质与人格",
            scaleGroupId:6,
          },
        ],//已经分好类但后台没接口的数据*/
        WAB:{
          scaleTagId:21,
          scaleTagName:"言语综合测验",
          scaleGroupId:5,
        },//wab量表
        searchNum:'',
        searchCon:'',
        routetype:this.$route.params.id,
        evllist:[],
        caseId: '', //病例id
//        caseIdDoc:'96869571285224558',//临时测评
        caseIdDoc:'',//临时测评
        scaleId: '',//量表id
        scaleAlias: '', //量表
        scaleAliasName: '', //量表别名
        startType:'',//判断是1.0或者2.0测评

        //test
        showModal: false,
        sexB: '男',
        sexClick: true,
        name: '',
        age: '',
        search: {
          keyword: ''
        },
        caseLists: [],
        pages:1,
//        1.0量表
        eval1:[],
        scalehave:true,
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
        lsuser:'',
        thirdpartyurl:"http://rc-thirdparty.66nao.com",
      }
    },
    components: {
      evalContentmodal
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
      handleTabChange1 (val) {
        this.activeTab1 = val;
      },
      handleTabChange2 (val) {
        this.activeTab2 = val;
      },
      clearEvalList () {
        this.$store.commit("clearEval");
      },
      childCallTwo:function(childparam){//接受evalution.vue父页面传来的参数
        this.routetype=childparam;
      },
      startTest:function(){
        alert('test');
      },
      fetch:function(type){
        var self = this;
        Vue.http({
            method: 'GET',
            url:'/api/Evaluation/getScales',
            params: {}
          })
          .then(
            function(res){
              for(var key in res.data.data){
                var kk = res.data.data[key];
                self.evllist.push(kk);
              }
            }
          );
        //     1.0接口开始
        Vue.http({
          method : 'GET',
          url : '/api/Evaluation/assess_scales',
        }).then(function(res){
            var log = console.log.bind(console);
            self.eval1 = res.data.data;
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
            listArrGI = listArrGI.sort();
            for (var i = 0; i < listArrTI.length; i++) {
              var list = {};
              list["scaleTagId"] = listArrTI[i];
              list["scaleTagName"] = listArrTN[i]
              list["scaleGroupId"] = listArrGI[i]
              self.evalList.push(list);
            }
            self.evalList.push(self.WAB);
        });
          //   1.0接口结束
      },
      showDetail:function(scaleName,scaleId,scaleAlias,caseId){
          this.caseId= caseId;
        this.showModal=true;
        /*解决悬浮层覆盖和无法滑动的bug*/
        $(".controlOverflow").css("overflow","");
        this.startType=2;
        this.scaleName = scaleName;
        this.scaleId = scaleId;
        this.scaleAlias = scaleAlias;
        this.caseId = caseId;
        this.searchPeople();
      },
      showDetail1:function (scaleName,scaleId,scaleAlias,caseId) {
        this.showModal=true;
        /*解决悬浮层覆盖和无法滑动的bug*/
        $(".controlOverflow").css("overflow","");
        this.startType=1;
        this.scaleName = scaleName;
        this.scaleId = scaleId;
        this.scaleAlias = scaleAlias;
        this.caseId = caseId;
        this.searchPeople();
      },
      searchPeople: function(curPage,pageNum) {
        var self = this;
        Vue.http({
            method: 'GET',
            url:'/api/Cases/getListByDt',
            params: {
              'search': this.search
            }
          })
          .then(function(res){
            self.caseLists = res.data.data;
            self.pages = res.data.page.total;
          });
      },
      choseMe:function(caseId){
        this.caseId = caseId;
        this.flag = caseId;
        $(".startevm").removeProp("disabled");
        $(".startevm").removeClass("startevm");
        $("#justTrain").attr("disabled",false).css("background-color","#0a81e5");
      },
      gotoEval:function(caseId,scaleId, scaleAliasName, isRestart){
        this.openThirdparty(caseId, scaleId, scaleAliasName, isRestart);
      },
      //1.0测评开始
      gotoEval1:function(caseId,scaleId){
        this.$router.push({ path: "/doc/startEval/",query: { caseId: caseId, scaleId:scaleId}});
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
        self.initPromise = isRestart ? Promise.resolve() : Vue.http({
          method:'GET',
          url:'/api/Thirdparty/getModules',
          params:{ scaleId: scaleId, caseId: caseId }
        });
//        this.initPromise = self.$http.get('/api/Thirdparty/getModules', { scaleId: scaleId, caseId: caseId });
        // 为解决弹出窗口会被拦截的问题，需要设置为先打开地址然后获取模块
        self.message.targetWindow = window.open(self.thirdpartyurl + '/#!/'
          + scaleAliasName + '?origin=' + location.origin + (isRestart ? '&restart=restart' : ''));
        self.message.inited = true;
        self.initPromise.then(function (result) {
          if (result) {
            self.message.caseId=result.data.data.uid;
            self.message.modules = result.data.data.modules;
            self.message.lastDay = result.data.data.lastDay;
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
                }
                // 数据获取完成后再发送消息
                self.initPromise.then(function () {
                  // 开始测评消息
                  self.message.targetWindow.postMessage(postData,self.thirdpartyurl);
                });
                break;
              // 获取模块具体完成信息
              case 'module:status':
                console.log('状态：');
                var moduleIndex = data.data.moduleIndex;
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
                self.$http.post('/api/Thirdparty/commit', {
                  scaleId: self.message.scaleId,
                  caseId: self.message.caseId
                })
                .then(function (result) {
                  self.message.targetWindow.postMessage({ source: 'rehab', message: 'commit:ok' }, self.thirdpartyurl);
                  if (result.data.resultCode === 20000) {
                    console.log('commit is ok!!');
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
      this.fetch(0);
      window.addEventListener('message', this.messageHandler);
},
    beforeDestroy: function () {
      this.inited = false;
      window.removeEventListener('message', this.messageHandler);
    }
  })

  function  getLsUserCaseId(){
    var globalCaseIdDoc = ''
    var search ={
      keyword: '临时测评虚拟患者'
    }

    Vue.http({
      method: 'GET',
      url:'/api/Cases/getList',
      params: {
        'search':  search,
      }
    }).then(
        function (res){
          globalCaseIdDoc = res.data.data[0].id;
        }
    );
    return globalCaseIdDoc;
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";

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
      width 86px
      padding-left 35px
    .u-second
      padding-left 30px
      text-align center
      width auto
      opacity .5
      tap-highlight-color transparent
      -webkit-tap-highlight-color transparent
      -moz-tap-highlight-color transparent
  .on1
    color #444
  .on1.u-second
    opacity 1
  /*以下是本页面自定义样式*/
  .evalItem
    display block
    margin-top 0
    margin-left 30px
  :empty
    margin-left 0
  .boardName
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  div.evalItem:nth-child(4n+1) div.board
    background-color #658456!important
  div.evalItem:nth-child(4n+2) div.board
    background-color #374D6C!important
  div.evalItem:nth-child(4n+3) div.board
    background-color #C44646!important
  div.evalItem:nth-child(4n+0) div.board
    background-color #90633C!important
</style>
