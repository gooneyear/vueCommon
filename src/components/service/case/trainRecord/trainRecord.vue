<template>
  <div id="trainRecord">
    <p class="u-loading" v-if="loading">正在加载，请稍候......</p>
    <div class="m-result" v-if="loaded">
      <div v-if="showTrain" class="trainDate">
        <div class="date">
          <div class="dateLabel">
            <strong style="color:#0a81e5">{{this.caseInfo.name}}</strong>&nbsp;&nbsp;累计训练了
            <span style="color:#0a81e5">{{this.trainDays}}</span>天；
            <span style="color:#0a81e5">{{this.trainGames}}</span>个程序；
            共计<span style="color:#0a81e5">{{this.trainTimes}}</span>局；
            平均每天<span style="color:#0a81e5">{{(this.trainTimes/this.trainDays).toFixed(1)}}</span>局。
          </div>
        </div>
        <div class="date">
          <div class="dateLabel">首次训练日期：{{this.firstDate | format}}</div>
        </div>
        <div class="date">
          <div class="dateLabel">最近两月出勤情况：</div>
        </div>
        <vue-bimonthly-calendar
          :events="hasVal"
          :selectedDay="selectedDay"
          @day-changed="dateData">
        </vue-bimonthly-calendar>
        <div class="trainResult" v-for="(list,index) in dataLists">
          <div class="resultShow">
            <ul>
              <li class="oddStyle">名称</li>
              <li class="evenStyle">{{list.name}}</li>
            </ul>
            <div style="column-count: 2; width:200px;">
              <ul style="margin-top:0;">
                <li class="oddStyle" style="margin-top:0;">今日训练次数</li>
                <li class="evenStyle">{{list.times}}</li>
              </ul>
              <ul>
                <li class="oddStyle">当前难度</li>
                <li class="evenStyle">{{list.currentProgress}}</li>
              </ul>
              <ul>
                <li class="oddStyle">训练时长</li>
                <li class="evenStyle">{{list.duration/60 | keepBit}}分钟</li>
              </ul>
              <ul>
                <li class="oddStyle">今日最高分</li>
                <li class="evenStyle">{{list.maxScore}}</li>
              </ul>
            </div>
            <ul>
              <li class="oddStyle">对应脑能力</li>
              <li class="evenStyle">{{list.label | clean}}</li>
            </ul>
          </div>
          <div class="resultChart">
            <echart
              v-if="showChart"
              :name="list.name"
              :date="list.trainDate" :index="index" :curData="list" :chartData="trainLists"></echart>
          </div>
        </div>
      </div>
      <div v-else class="noTrain">
        <span>还没有训练记录，可点击现场训练</span>
        <button class="button" style="background-color: #0a81e5" @click="openTrain">现场训练</button>
      </div>
      <trainModal v-if="showModal" @close="cancelShow" @submitData="submitCase"></trainModal>
      <trainCronSave v-if="saveGame" :gameData="gameData" :gameFlag="1" :caseId="$route.params.id" @updateScore="getGameScore" @close="saveGame=false"></trainCronSave>
      <gameOver v-if="showOver" :score="gameScore"></gameOver>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import trainModal from './trainModal.vue'
  import trainCronSave from '../../../common/trainCronSave.vue'
  import echart from '../../../common/echart.vue'
  import gameOver from '../../../common/gameOver.vue'
  import {curDate,dateFormat,contains} from '../../../../assets/js/common.js'

  export default ({
    props: ['caseInfo'],
    data() {
      return {
        store: require('../../../../app/store.js'),
        select: require('../../../../../static/js/selectContent.js'),
        showTrain: false,
        showModal: false,
        showChart: false,  // 显示图表的销毁重建
        saveGame: false,
        showOver: false,
        firstDate: '', // 首次训练日期
        trainDays: 0,  // 累计训练天数
        trainGames: 0, // 累计训练游戏数
        trainTimes: 0, // 累计训练局数
        gameData: '',
        gameScore: {},
        trainData: {}, // 存储所有训练数据
        trainLists: {},
        dataLists: {},
        caseLists: {},
        //数据加载中的标识
        loading: false,
        //数据加载完毕的标识
        loaded: false
      }
    },
    computed:{
      rev: function(){
        var dateLen = Object.keys(this.trainLists).slice().reverse();
        if (dateLen.length >this.pageNum){
          return dateLen.slice(0,this.pageNum);
        } else {
          return dateLen;
        }
      },
      hasVal: function(){
        let tDate = [];
        var sDate = {};
        var dList = Object.keys(this.trainLists);
        // 插件要求必须添加title属性
        for(let i=0;i<dList.length;i++){
          let date = dList[i].substr(0,4) + '/' + dList[i].substr(4,2) + '/' + dList[i].substr(6,2);
          let title = "";
          date = {date};
          title = {title};
          sDate = Object.assign(date,title);
          tDate.push(sDate);
        }
        return tDate;
      },
      selectedDay: function(){
        let DateList = Object.keys(this.trainLists);
        let dLen = DateList.length;
        let selectDay = DateList[dLen-1].substr(0,4) + '/' + parseInt(DateList[dLen-1].substr(4,2)) + '/' + parseInt(DateList[dLen-1].substr(6,2));
        return selectDay;
      }
    },
    filters:{
      format: function(val){
        if(curDate(1) == val){
          return '今天';
        } else if(curDate(-1) == val) {
          return '昨天';
        } else {
          return dateFormat(val,'-');
        }
      },
      clean: function(val){
        var brain = "";
        for(var i= 0;i<val.length;i++){
          if(i == val.length-1){
            brain += val[i];
          } else {
            brain += val[i]+",";
          }
        }
        return brain;
      },
      keepBit: function(val) {
        return val.toFixed(0)
      }
    },
    components: {
      trainModal,
      trainCronSave,
      echart,
      gameOver
    },
    mounted () {
      this.fetch();
    },
    methods: {
      fetch: function(){
        this.showChart = true;
        this.loading= true;
        var self = this;
        Vue.http({
            method: 'GET',
            url:'/api/train/getCloudTrainRecord',
            params: {
              'caseId': this.$route.params.id
            }
          })
          .then(function(res){
            self.loading= false;
            self.loaded= true;
            // 判断认知游戏和言语训练的纪录是否为空
            if(Object.keys(res.data.data.lan).length !=0){
              self.trainLists = self.objectAssgin(res.data.data.lan,res.data.data.cron);
            } else {
              self.trainLists = res.data.data.cron;
            }
            //console.log(self.trainLists);
            self.getGameStat(self.trainLists);
            self.trainData = self.trainLists;
            self.tabData = Object.keys(self.trainLists).slice().reverse();
            self.showFirst();
            self.getPage();
          })
      },
      // 实现对象的深度合并
      objectAssgin: function(lan,cogn){
        for(var i=0; i<Object.keys(lan).length; i++){
          for(var j=0; j<Object.keys(cogn).length; j++){
            if(Object.keys(lan)[i] == Object.keys(cogn)[j]){
              lan[Object.keys(lan)[i]] = lan[Object.keys(lan)[i]].concat(cogn[Object.keys(cogn)[j]]);
            }
          }
        }
        return Object.assign(cogn,lan);
      },
      // 获取游戏的统计
      getGameStat: function(item){
        this.trainDays = Object.keys(item).length;
        this.firstDate = Object.keys(item)[0];
        let gameItem = [];
        for(let i=0; i<Object.keys(item).length; i++){
          for(let j=0; j<item[Object.keys(item)[i]].length;j++){
            // 对每天训练的重复游戏去重计数
            if(!contains(gameItem,item[Object.keys(item)[i]][j].name)){
              gameItem.push(item[Object.keys(item)[i]][j].name);
            }
            this.trainTimes += parseInt(item[Object.keys(item)[i]][j].times);
          }
        }
        this.trainGames = gameItem.length;
      },
      openTrain: function(){
        $(".right-content").css("overflow","");
        $(".controlOverflow").css("overflow","");
        this.showModal = true;
      },
      submitCase: function(res) {
        if (res.length == 0) {
          alert('請選擇訓練項目');
        } else {
          this.gameData = res;
          this.saveGame = true;
        }
      },
      getGameScore: function(res){
        console.log(res);
        // this.showOver = true;
      },
      dateData: function(item){
        let e = item.date.split("/");
        let m = e[1] + '';
        let d = e[2] + '';
        if(e[1]<10){
          m = '0' + e[1];
        }
        if(e[2]<10){
          d = '0' + e[2];
        }
        let selectDate = e[0]+m+d;
        // 判断点击日期是否在列表中，如果不在，不提交请求
        if(contains(Object.keys(this.trainLists),selectDate)){
          this.dataLists = JSON.parse(JSON.stringify(this.trainLists[selectDate]));
          this.showChart = false;
        }
      },
      // 点击取消时，重调接口获取最新的游戏数据
      cancelShow: function(){
        this.fetch();
        this.showModal=false;
      },
      // 获取训练纪录的页数
      getPage: function(){
        this.allPage = Math.ceil(Object.keys(this.trainLists).length/this.pageNum);
        this.curPage = 1;
        if(this.allPage == this.curPage){
          $("#rightIcon").attr("src",this.select.rightGray);
        }
      },
      // 默认展示第一个标签
      showFirst: function(){
        // 把日期列表和数据显示分开存储，默认展示第一个
        this.dataLists = this.trainLists[Object.keys(this.trainLists)[Object.keys(this.trainLists).length-1]];
        if(typeof this.trainLists && Object.keys(this.trainLists).length>0){
          this.showTrain = true;
        }
      }
    },
    destroyed() {
      this.loading= false;
      this.loaded= false;
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"
  @import "../../../../assets/css/modal.styl"

  #trainRecord
    position absolute
    top 101px
    left $second-menu-width
    right 0
  .noTrain
    padding 30px 0 0 40px
    span
      display block
      margin-bottom 20px
      color #999
  .trainDate
    display block
    height $menu-height
    line-height $menu-height
    .date
      display flex
      justify-content space-between
      span
        text-align center
        display inline-block
        height $menu-height
        width 30px
      span:hover
        background-color #fff
      .switchLabel
        width 100px
      .dateLabel
        margin-left 40px
        height 40px
        display inline-block
  .trainResult
    position relative
    .resultChart
      position absolute
      top 20px
      left 30%
  .resultShow
    padding-left 50px
    padding-bottom 50px
    border-bottom 1px solid #f5f5f5
    ul
      height 60px
      li
        margin-top 5px
        height 15px
  .active
    background-color #fff
</style>
