<template>
  <div>
    <div class="game-container" :class="{show: show}">
      <div  style="
        width: 1280px;
        height:800px;
        margin:0 auto;
        overflow:auto;
      ">
        <iframe class="game-iframe" name="openGames" :src="gameUrl" scrolling="no" ></iframe>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  // 发送消息的interval
  var _t = null;
  var userID = '';
  // 游戏iframe相关最佳宽高
  var iframe = {
    dom: null,
    bestWidth: 1280,
    bestHeight: 800,
    bestRatio: 1.6
  };

  export default ({
    props:['gameData','gameFlag','caseId','caseName','todayGames'],
    data() {
      return{
        store: require('../../app/store.js'),
        address: require('../../../static/js/config.js'),
        games: {},
        game: {
          gameId: '',
          name: '',
          para: {},
          /* jshint ignore:start */
          game_sno: [],
          /* jshint ignore:end */
          skin: {},
          duration: '',
          url: '',
          cogn: [],
          as: ''
        },
        gameUrl: '',
        // 选中的脑能力
        selectedCogn: {
          code: '',
          name: '',
          description: ''
        },
        remLevel: "",  // 开始等级
        // 游戏code
        gameId: '',
        // 患者uuid
        patientId: '',
        // 游戏运行状态
        running: false,
        // 游戏是否显示
        show: false,
        // 开始页面是否显示
        start: true,
        // 结束页面是否显示
        end: false,
        // 下一个游戏的code
        nextGameCode: '',
        // 游戏训练的数据，用于游戏iframe中
        trainInfo: {
          url: '/api/UserDailyTraining/saveCognGame',
          address: require('../../../static/js/config.js'),
          gameId: null,
          user: null,
          as: null,
          title: null,
          config: {},
          levelDefs: "",
          startLevel: null,
          isFirstTraining: null,
          lastLevel: null,
          gametime: 30,
          gamedata: null,
          postback: {lesson: 'b', tid:'',pid:''}
        },
        // 游戏分数
        score: {
          currentScore: '',
          highestScore: '',
          advancement: ''
        },
        // 游戏iframe
        iframe: {
          left: 0,
          width: iframe.bestWidth,
          height: iframe.bestHeight
        },
        // 是否是体验游戏
        isExperience: false,
        // 是否是医生训练游戏
        isDoctorTraining: false,
        // 错误保存次数
        saveTimes: 1,
        // 游戏已玩的次数
        gameCount: 0
      }
    },
    mounted () {
      window.onload = function(){

      }
      if (!iframe.dom) {
        iframe.dom = document.querySelector('iframe.game-iframe');
        // 首次进入后居中显示
        $(".game-iframe").css({
          'postion': 'fixed',
//          'right': (document.body.clientWidth-1280)/2,
//          'left': (document.body.clientWidth-1280)/2
        });
        // iframe发送回来的消息
        window.addEventListener('message', this.message, false);
      }
      $(".game-container").css({
        'postion': 'fixed',
        'left': '0',
        'top': '0',
        'right': '0',
        'z-index': '99999'
      });
      this.getGameHisLev();
    },
    destroyed (){
      // 清除iframe，避免切换用户时游戏无法退出的问题
      if (iframe.dom) {
        iframe.dom.parentNode.remove();
        iframe.dom = null;
        window.removeEventListener('message', this.message, false);
      }
    },
    methods: {
      //获取游戏上次等级
      getGameHisLev: function(){
        var self = this;
        if(this.gameData.taskId){
          this.gameData["id"] = this.gameData.taskId;
        }
        console.log(this.gameData);
        Vue.http({
            method: 'GET',
            url:'/api/Game/GameLevel',
            params: {
              'gameId': this.gameData.id,
              'patientId': this.caseId
            }
          })
          .then(
            function(res){
              self.trainInfo.levelDefs = res.data.data.level;
              if(typeof res.data.data.count != "undefined"){
                self.gameCount = res.data.data.count;
              }
              self.showGame(self.gameData,self.gameFlag);
            }
          )
      },
      // 开始游戏
      showGame: function(item,flag) {
        console.log(item);
        var self = this;
        // 1.0的认知游戏
        if (item.tag){
          $(".rightContent").css({
            'margin-right': '-17px'
          });
          this.gameUrl = GLOBAL.cognition+'/game/'+item.proto+'?embed=true&ts=02051700';
          this.show = true;
          this.game_id = item.id;
          var userName = '';
          var times = 30;
          var temLastLevel = 1;
          if (flag){
            // 正式训练
            userID   = this.caseId;
            times = 120;
            userName = this.caseName;
            temLastLevel = this.trainInfo.levelDefs;
          } else {
            // 临时训练
            userID  = this.store.account.id;
            userName = this.store.account.name;
          }
          // 初始难度由后台控制，默认都不是首次训练
          var trainInfo = {
            gameId: this.game_id,
            user: {id: userID, name: userName},
            startLevel: temLastLevel,
            isFirstTraining: 1, // this.gameCount>0?0:1
            lastLevel: temLastLevel,
            levelDefs: null,
            gametime: times,
            gamedata: '',
            as: item.args.as,
            postback: {lesson: 'b',tid: item.id, pid: item.p_id, gametime:times, uid: userID}
          };
          this.trainInfo.postback = trainInfo.postback;
          _t = setInterval(function() {
            try
            {
              if(!self.running) {
                window.frames[0].postMessage({action: 'start_game', trainInfo: trainInfo}, '*');
              }
            }
            catch(ex)
            {
            }
          }, 100);
        } else if (item.pathId){
          $(".rightContent").css({
            'margin-right': '-17px'
          });
          for(var i=0; i<this.address.lanGames.length; i++){
            if(item.id == this.address.lanGames[i].trainID){
              var title = this.address.lanGames[i].title;
              break;
            }
          }
          console.log(this.todayGames);
          var nextID = [];
          if(this.todayGames){
            this.todayGames.forEach(function(e){
              nextID.push(e.taskId);
            });
          } else {
            nextID = item.id;
          }
          if(flag == 0){
            this.caseId = '';
          }
          this.gameUrl = GLOBAL.cognition+'/game2/'+title+'/index.html?trainId='+this.caseId+'&taskId='+item.id+'&token='+localStorage.access_token+'&nextId='+nextID+'&uid='+this.caseId;
          console.log(this.gameUrl);
        }
      },
      // 提交游戏分数
      submitScore: function (data) {
        var self = this;
        var submitObj = {gameId: data.gameId, data: data};
        if (this.isDoctorTraining) {
          submitObj.patientId = this.patientId;
        }
        self.$http.post(this.trainInfo.url,submitObj)
          .then(function(score){
            self.start = false;
            self.show = false;
            self.end = true;
            self.score = Object.assign(self.score,score);
            $(".rightContent").css({
              'margin-right': '0'
            });
          })
          .catch(function () {
            self.saveTimes ++;
            if(self.saveTimes < 3){
              self.submitScore(data);
            }
          });
      },
      // iframe发送过的消息
      message: function (event) {
        var val = event.data;
        console.log(val);
        // 开始游戏发送消息标识
        if (val.start_game === 'ok') {
          this.running = true;
          clearInterval(_t);
        } else if (val.action === 'game_over') {
          // 游戏结束,回传分数
          this.$emit("updateScore",val.trainInfo);
          console.log('recved ' + JSON.stringify(val) + ' from ' + event.origin);
          this.running = false;
          // 改变父组件的判断条件，使之可连续打开新的
          // 使用muse-ui之后，$parent方式就不稳定了，故使用emit方式改变父组件属性值
          this.$emit("close");
          var lastObject = val.trainInfo.transcript;
          // 添加打开游戏后直接跳出后的等级判断
          if(lastObject.length > 0 ){
            var lastObjectLevel = lastObject[lastObject.length-1].levelDef.level; //游戏结束后最终的难度
            this.remLevel = lastObjectLevel;
            // 如果打开游戏不训练，则不执行保存
            if (undefined != val.trainInfo) {
              try {
                this.submitScore(JSON.parse(JSON.stringify(val.trainInfo)));
              } catch(ex) {
                console.log(ex);
              }
            }
          } else {
            this.remLevel = this.trainInfo.startLevel;
          }
        } else if (val.action === 'lan_game_over'){
          this.running = false;
          this.$emit("close");
          this.$router.push('/doc/train');

        } else if(val.action === 'lan_game_back_home'){
          // 言语游戏点击返回首页
          this.running = false;
          this.$emit("close");
          this.$router.push('/doc/train');
        }
      }
    }
  })
</script>
<style lang="stylus">
  @import "../../assets/css/app.styl";
  @import "../../assets/css/variable.styl";

/*  .iframe-wrapper
    -webkit-overflow-scrolling touch
    overflow auto*/
  /* 展示游戏页面*/
  .game-iframe
    position absolute
    top 0
    left 50%
    transform translateX(-50%)
    -webkit-transform translateX(-50%)
    z-index 9
    border none
    max-width 1280px
    max-height 800px
    margin-left 0
    width 1280px
    height 800px
  @media (-webkit-max-width: 1366px) and (-webkit-min-width: 1280px),(max-width:1366px) and (min-width:1280px)
    .game-iframe
      width:1024px;
      height:640px;
  @media (-webkit-max-width: 1280px) and (-webkit-min-width: 1024px),(max-width:1280px) and (min-width:1024px)
    .game-iframe
      width 1024px
      height 640px
  @media (-webkit-max-width: 1024px),(max-width:1024px)
    .game-iframe
      width 1024px
      height 650px
</style>
