<template>
  <div id="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" style="display: flex">
        <div style = "
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        " class="modal-container">
          <div class="modal-header">
            <h3>现场训练</h3>
              <selectComponent :selectWidth="selectWidth" :subject="subject" :selectContent="selectContent" @changeSelect="choose"></selectComponent>
          </div>
          <div class="modal-body" ref = 'body' style="
              flex-grow: 1;
              display: flex;
          ">
            <div class="modal-evalBody">
              <template v-if = "selectContent.value == 'all'">
                <trainMenu @trainmenuEvent="traincontentCall"></trainMenu>
              </template>

              <template v-else-if = "selectContent.value == 'daily'">
                <div class="evalMenu">
                  <span class="nowtrain" @click="chooseMenu1(0)" :class="{'on':oneNum==0}">全部</span>
                  <span class="nowtrain" @click="chooseMenu1(10)" :class="{'on':oneNum==10}">认知</span>
                  <span class="nowtrain" @click="chooseMenu1(11)" :class="{'on':oneNum==11}">言语-语言</span>
                  <span class="nowtrain" @click="chooseMenu1(12)" :class="{'on':oneNum==12}">情绪与社会认知</span>
                </div>
                <div class="evalMenu">
                  <div v-if="menu == 0">
                    <span class="u-first">一级能力:</span>
                    <span class="all u-second" @click="changeDaily(item)" v-for="(item,index) in dailyClass" :class="{'on1':twoNum==item.id}">{{item.name}}</span>
                  </div>
                  <div v-else-if="menu != 0">
                    <span class="u-first">一级能力:</span>
                    <span class="all u-second" @click="changeDaily(item)" v-for="(item,index) in dailyClass" v-if="item.pid == menu" :class="{'on1':twoNum==item.id}">{{item.name}}</span>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="evalMenu">
                  <span class="nowtrain" @click="chooseMenu2(0)" :class="{'on':oneNum==0}">全部</span>
                  <span class="nowtrain" @click="chooseMenu2(10)" :class="{'on':oneNum==10}">认知</span>
                  <span class="nowtrain" @click="chooseMenu2(11)" :class="{'on':oneNum==11}">言语-语言</span>
                  <span class="nowtrain" @click="chooseMenu2(12)" :class="{'on':oneNum==12}">情绪与社会认知</span>
                </div>
                  <div class="evalMenu">
                    <div v-if="menu == 0">
                      <span class="u-first">一级能力:</span>
                      <span class="all u-second" @click="changePlan(item)" v-for="(item,index) in planClass" :class="{'on1':twoNum==item.id}">{{item.name}}</span>
                    </div>
                    <div v-else-if="menu != 0">
                      <span class="u-first">一级能力:</span>
                      <span class="all u-second" @click="changePlan(item)" v-for="(item,index) in planClass" v-if="item.pid == menu" :class="{'on1':twoNum==item.id}">{{item.name}}</span>
                    </div>
                  </div>
              </template>
              <div class="modalList modalList-train" >
                <span v-show="noContent" class="no-content"></span>
                <!--训练方案修改 start-->
                <template v-if = "selectContent.value == 'all'"> <!-- 显示全部游戏 -->
                  <div class="evalItem evalItem-trainmodal showAll" v-for="(item, index) in trainList" @click="selectedItem(item, index)">
                    <div class="board board-trainmodal" :class="{touming:item.checked}">
                      <img :src="address+item.image" />
                    </div>
                    <div class="itemName itemName-trainmodal">{{item.name}}</div>
                    <div class="mengban mengban-trainmodal" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                  </div>
                </template>

                <template v-else-if = "selectContent.value == 'daily'"> <!-- 显示今日训练 -->
                  <div class="evalItem evalItem-trainmodal showDaily" v-for="(item, index) in trainDailyList" @click="selectedItem(item, index)">
                    <div class="board board-trainmodal" :class="{touming:item.checked}">
                      <img :src="address+item.image" />
                    </div>
                    <div class="itemName itemName-trainmodal">{{item.name?item.name:item.taskName}}</div>
                    <div class="mengban mengban-trainmodal" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                  </div>
                </template>

                <template v-else> <!-- 显示训练方案 -->
                  <div class="evalItem evalItem-trainmodal showPlan" v-for="(item, index) in trainPlanList" @click="selectedItem(item, index)">
                    <div class="board board-trainmodal" :class="{touming:item.checked}">
                      <img :src="address+item.image" />
                    </div>
                    <div class="itemName itemName-trainmodal">{{item.name}}</div>
                    <div class="mengban mengban-trainmodal" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                  </div>
                </template>
                <!--训练方案修改 end-->
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <mu-raised-button label="取消" @click="cancelhandler" style="color:#999;" />
            <mu-raised-button label="去训练" :disabled="showDoTrain" @click="submitAction" primary />
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
  import selectComponent from '../../../common/selectComponent.vue'
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
        type: String,
        default: function(){
          return this.$route.params.id
        }
      }
    },
    data() {
      return {
        address: GLOBAL.cognition,
        config: require('../../../../../static/js/config.js'),
        showDoTrain: true,
        checkItem:{},
        oneGrade: '',
        twoGrade: '',
        trainList: [],
        trainDailyList:[],
        trainPlanList:[],
        selectTrain:'daily',
        postDaily:[],
        dailyList:[],
        postPlan:[],
        menu:"",
        dailyClass:[],
        dailyCount:0,
        dailyTrainClass:[],
        planCount:0,
        planClass:[],
        planTrainClass:[],
        oneNum:"",
        twoNum:"",
        noContent:false,
        subject:[{value:"daily",text:"显示今日训练"},{value:"plan",text:"显示训练方案"},{value:"all",text:"显示全部"}], //为select组件传递option值
        selectContent:{value:"daily",text:"显示今日训练"},
        selectWidth:120,
      }
    },
    components:{
      trainMenu,
      selectComponent,
    },
    mounted() {
      /*this.getDaily();*/
      this.$refs.body.style.maxHeight = String(this.$refs.body.clientHeight) + 'px';
      this.getDaily();
    },
    computed:{
      content(){
        return "当前没有训练内容！";
      },
      dom(){
        return document.querySelector(".no-content");
      }
    },
    methods: {
      chooseMenu1 (num) {
        this.menu = num;
        this.oneNum = num;
        this.twoNum = "";
        this.getDaily();
      },
      chooseMenu2(num){
        this.menu = num;
        this.oneNum = num;
        this.twoNum = "";
        this.getPlan();
      },
      changeDaily(item){
        this.trainDailyList = [];
        this.twoNum = item.id;
        for (var i = 0; i < this.dailyTrainClass.length; i++) {
          var labelArr = this.dailyTrainClass[i].label.split(",");
          //每次切换脑能力取消所有的选中效果，否则会有两个训练一块选中的bug
          this.$set(this.dailyTrainClass[i],"checked",false);
          for (var j = 0; j < labelArr.length; j++) {
            if (labelArr[j] == item.id) {
              this.trainDailyList.push(this.dailyTrainClass[i]);
            }
          }
        }
      },
      changePlan(item){
        this.trainPlanList = [];
        this.twoNum = item.id;
        for (var i = 0; i < this.planTrainClass.length; i++) {
          var labelArr = this.planTrainClass[i].label.split(",");
          this.$set(this.planTrainClass[i],"checked",false);
          for (var j = 0; j < labelArr.length; j++) {
            if (labelArr[j] == item.id) {
              this.trainPlanList.push(this.planTrainClass[i]);
            }
          }
        }
      },
      choose (text,value) {
        if (value == "daily") {
          this.twoNum ="";
          this.chooseMenu1(0);
        }else if(value == "plan"){
          this.twoNum ="";
          this.chooseMenu2(0);
        }else if(value == "all"){
          this.twoNum ="";
          this.fetch();
        }

      },
      getDaily:function(id){
        var self = this;
        Vue.http({
          method: 'GET',
          url:'/api/Train/getDailyTrainingProgram',
          params: {
            'id': self.caseId
          }
        })
        .then(function(res){
          var cogn = res.data.data.cogn;
          var cognList = [];//后台返回的今日训练接口没有精神健康与社会分类，需要在前端手动分类
          var menList = [];
          var dailyArr = [];
          var listAll = cogn.concat(res.data.data.lan);
          if (listAll.length > 0) { //当今日训练有内容时
            self.noContent = false;
            listAll.forEach(function(item,index){//取到所有训练的label值
              var daily = item.label.split(",");
              for (var i = 0; i < daily.length; i++) {
                dailyArr.push(daily[i]);
              }
            })
            dailyArr.sort();
            self.postDaily = [dailyArr[0]];
            for (var j = 0; j < dailyArr.length; j++) { //去掉重复的label值，获取到全部的一级能力
              if (dailyArr[j] !== self.postDaily[self.postDaily.length-1]) {
                self.postDaily.push(dailyArr[j]);
              }
            };
            self.dailyCount++;
            if (self.dailyCount <= 1) { //通过判断点击次数来解决一级脑能力不断叠加的bug
              for (var y = 0; y < self.config.trainClass.length; y++) { //通过label值匹配脑能力对象
                for (var z = 0; z < self.postDaily.length; z++) {
                  if (self.config.trainClass[y].id == self.postDaily[z]) {
                    self.dailyClass.push(self.config.trainClass[y]);
                  }
                }
              }
            }
            if (self.menu == 11) {
              if (res.data.data.lan.length > 0) {
                self.trainDailyList = res.data.data.lan;
              }else{
                self.noContent = true;
                self.dom.innerHTML = self.content;
                self.trainDailyList = res.data.data.lan;
              }
            }else if(self.menu == 10){ //后台接口没有把精神健康与社会和认知训练区分，通过ID区分开
              cogn.forEach(function(item,index){
                if (item.id != 46001 && item.id != 49001 && item.id != 50001) {
                  cognList.push(item);
                }
              })
              if (cognList.length > 0) {
                self.trainDailyList = cognList;
              }else{
                self.noContent = true;
                self.dom.innerHTML = self.content;
                self.trainDailyList = cognList;
              }
            }else if(self.menu == 12){
              cogn.forEach(function(item,index){
                if (item.id == 46001 || item.id == 49001 || item.id == 50001) {
                  menList.push(item);
                }
              })
              if (menList.length > 0) {
                self.trainDailyList = menList;
              }else{
                self.noContent = true;
                self.dom.innerHTML = self.content;
                self.trainDailyList = menList;
              }
            }else{
              self.trainDailyList = res.data.data.cogn.concat(res.data.data.lan);
              self.dailyTrainClass = self.trainDailyList;
            }
            /*if(typeof id != 'undefined'){
              var tempList = [];
                for(var x=0; x<self.trainDailyList.length; x++){
                  var tempLabel = self.trainDailyList[x].label.split(',');
                  for(var y=0; y<tempLabel.length; y++){
                    if (tempLabel[y] == id){
                      tempList.push(self.trainDailyList[x]);
                    }
                  }
                }
              self.trainDailyList = tempList;
            }*/
          }else{
            self.noContent = true;
            self.dom.innerHTML = self.content;
          }
        })
      },
      getPlan:function(id){
        var self = this;
        Vue.http({
          method: 'GET',
          url:'api/Train/getManualProgram',
          params: {
            'id': self.caseId
          }
        })
        .then(function(res){
          var cogn = res.data.data.cogn;
          var cognList = [];//后台返回的训练方案接口没有精神健康与社会分类，需要在前端手动分类
          var menList = [];
          var planArr = [];
          var listAll = res.data.data.cogn.concat(res.data.data.lan);
          if (listAll.length > 0) {
            self.noContent = false;
            listAll.forEach(function(item,index){
              var plan = item.label.split(",");
              for (var i = 0; i < plan.length; i++) {
                planArr.push(plan[i]);
              }
            })
            planArr.sort();
            self.postPlan = [planArr[0]];
            for (var j = 1; j < planArr.length; j++) {
              if (planArr[j] !== self.postPlan[self.postPlan.length-1]) {
                self.postPlan.push(planArr[j]);
              }
            };
            self.planCount++;
            if (self.planCount <= 1) {
              for (var y = 0; y < self.config.trainClass.length; y++) {
                for (var z = 0; z < self.postPlan.length; z++) {
                  if (self.config.trainClass[y].id == self.postPlan[z]) {
                    self.planClass.push(self.config.trainClass[y]);
                  }
                }
              }
            }
              if (self.menu == 11) {
                if (res.data.data.lan.length > 0) {
                self.trainPlanList = res.data.data.lan;
              }else{
                self.noContent = true;
                self.dom.innerHTML = self.content;
                self.trainPlanList = res.data.data.lan;
              }
              }else if(self.menu == 10){
                cogn.forEach(function(item,index){
                  if (item.id != 46001 && item.id != 49001 && item.id != 50001) {
                    cognList.push(item);
                  }
                })
                if (cognList.length > 0) {
                  self.trainPlanList = cognList;
                }else{
                  self.noContent = true;
                  self.dom.innerHTML = self.content;
                  self.trainPlanList = cognList;
                }
              }else if(self.menu == 12){
                cogn.forEach(function(item,index){
                  if (item.id == 46001 || item.id == 49001 || item.id == 50001) {
                   menList.push(item);
                  }
                })
                if (menList.length > 0) {
                  self.trainPlanList = menList;
                }else{
                  self.noContent = true;
                  self.dom.innerHTML = self.content;
                  self.trainPlanList = menList;
                }
              }else{
                self.trainPlanList = res.data.data.cogn.concat(res.data.data.lan);
                self.planTrainClass = self.trainPlanList;
              }
          }else{
            self.noContent = true;
            self.dom.innerHTML = self.content;
          }
        })
      },
      fetch: function (id) {
        var self = this;
        self.noContent = false;
        this.trainList = [];
        if (this.oneGrade >= 0){
          Vue.http({
              method: 'GET',
              url: '/api/Game/getAllGames'
            })
            .then(function(res){
              // 区分2.0的言语训练
              if (self.oneGrade == 11){
                self.trainList = res.data.data.lan;
              } else if(self.oneGrade == 10) {
                self.trainList = res.data.data.cogn;
              } else if(self.oneGrade == 12) {
                self.trainList = res.data.data.men;
              } else {
                self.trainList = res.data.data.cogn.concat(res.data.data.lan).concat(res.data.data.men);
              }
              /*self.$refs.postDailyList.getAll();*/
              // 以下从配置文件中匹配标签
              if(typeof id != 'undefined'){
                var tempList = [];
                for(var x=0; x<self.trainList.length; x++){
                  var tempLabel = self.trainList[x].label.split(',');
                  for(var y=0; y<tempLabel.length; y++){
                    if (tempLabel[y] == id){
                      tempList.push(self.trainList[x]);
                    }
                  }
                }
                self.trainList = tempList;
              }
            })
            .then(function(){
              if(self.games.length){
                self.games.forEach(function(elem, index){
                  for(let i=0, len=self.trainList.length; i<len; i++ ){
                    if(elem.game_id){
                      if(elem.game_id==self.trainList[i].game_id){
                        self.trainList.splice(i,1);
                        break;
                      }
                    }else if(elem.trainID){
                      if(elem.trainID==self.trainList[i].trainID){
                        self.trainList.splice(i,1);
                        break;
                      }
                    }
                  }
                })
              }
            });
        }
      },
      selectedItem: function (item, index) {
        if (this.selectContent.value == "all") {
          for (var i=0; i<this.trainList.length; i++){
            this.$set(this.trainList[i],"checked",false);
          }
        }else if (this.selectContent.value == "daily") {
          for (var i=0; i<this.trainDailyList.length; i++){
            this.$set(this.trainDailyList[i],"checked",false);
          }
        }else if(this.selectContent.value == "plan"){
          for (var i=0; i<this.trainPlanList.length; i++){
            this.$set(this.trainPlanList[i],"checked",false);
          }
        }
        item.checked = true;
        this.checkItem = item;
        this.showDoTrain = false;
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
      },
      submitAction(){
        this.$emit('submitData',this.checkItem);
      }
    },
    beforeDestroy(){
      if(!this.addPlan){
        return;
      }
      this.checkItem.forEach(function(item, index){
        item.checked = false;
      });
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"
  @import "../../../../assets/css/modal.styl"

  /*===下方是本页弹出框的样式补充=======*/
  .modal-header
    position relative
    select
      position absolute
      right 100px
      top 60px
  .modal-container
    @media screen and (max-height: 800px)
      width 90vw
      height 90vh
    width 1024px
    height 800px
  .modal-evalBody
    width 100%
    margin-top -16px
    text-align left
  @media screen and (max-height: 800px)
    .modalList-train
      max-height unset !important
  .evalItem
    padding-top 30px
    position relative
    .mengban
      position absolute
      top 110px
      left 70px
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
  .hideImg
    display none
  .u-train-doc
    text-align left
  button#doTrain
    background-color: #ccc;
  /*菜单样式*/
  .evalMenu
    border-bottom 1px solid #eee
    span
      display inline-block
      height 60px
      line-height 60px
      text-align center
      cursor pointer
    .u-second
      line-height 60px
    .nowtrain
      line-height 75px
    div
      display inline
    :hover
        color $color-font-primary
    :active
      color $color-font-primary
    .u-first
      width 77px
      padding-left 35px
  .on
    font-weight bold
  .on1
    color #444
  .on1.u-second
    opacity 1
  .no-content
    position absolute
    left 50%
    top 50%
    transform translateX(-50%)
    font-family: PingFangTC-Semibold;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  #showChoose
    option
      font-size 14px
  .selectWrap
    position absolute
    top 50px
    right 100px
    z-index 99
</style>
