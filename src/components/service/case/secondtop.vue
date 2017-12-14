<template>
  <div id="secTop">
    <trainModal v-if="showTrain" @close="closeTrain" @submitData="submitCase"></trainModal>
    <evaluationModal v-if="showEvaluation" @close="closeEvaluation" @submitData="submitEvaluation"></evaluationModal>
    <trainCronSave v-if="saveGame" :gameData="gameData" :gameFlag="1" :caseId="$route.params.id" @updateScore="getGameScore" @close="saveGame=false"></trainCronSave>
    <gameOver v-if="showOver" :score="gameScore" @close="closeGame"></gameOver>
    <personal :info="caseInfo" :keys="1"></personal>
    <div class="operate-area">
      <button class="button" style="background-color: #1bbe9f" @click="openEvaluation">现场测评</button>
      <button class="button" style="background-color: #4990E2" @click="openTrain">现场训练</button>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue'
  import trainModal from './trainRecord/trainModal.vue'
  import evaluationModal from './evalRecord/evaluationModal.vue'
  import trainCronSave from '../../common/trainCronSave.vue'
  import personal from '../../common/personal.vue'
  import gameOver from '../../common/gameOver.vue'
  import {getSelect} from '../../../assets/js/common.js'

  export default ({
    props: ['caseInfo'],
    data(){
      return{
        saveGame: false,   // 打开1.0游戏
        showTrain: false,  // 显示现场训练
        showEvaluation: false,  // 显示现场测评
        showOver: false,
        gameData: '',       // 游戏数据
        gameScore: {}
      }
    },
    components:{
      trainModal,
      evaluationModal,
      trainCronSave,
      personal,
      gameOver
    },
    computed: {
      showName: function(){
        var names = this.caseInfo.name+'';
        var len = names.split('').length;
        if(len <2){
          return names;
        } else {
          return names.split('')[len-2]+names.split('')[len-1]
        }
      },
      sex: function() {
        return getSelect('gender', this.caseInfo.gender)
      }
    },
    methods: {
      submitCase: function(res) {
        if (res.length == 0) {
          alert('請選擇訓練項目');
        } else {
          this.gameData = res;
          this.saveGame = true;
          this.showTrain = false;
        }
      },
      submitEvaluation: function(res) {
        if (res.length == 0) {
          alert('請選擇訓練項目');
        } else {
          this.gameData = res;
          this.saveGame = true;
          this.showEvaluation = false;
        }
      },
      getGameScore: function(res){
        console.log(res);
        //this.showOver = true;
        this.gameScore = res;
      },
      closeGame: function(){
        this.showOver = false;
      },
      openEvaluation:function(){
        this.showEvaluation=true;
        $(".controlOverflow").css("overflow","");
      },
      openTrain:function(){
        this.showTrain=true;
        /*解决开始训练悬浮层覆盖bug*/
        $(".controlOverflow").css("overflow","");
      },
      closeTrain:function(){
        this.showTrain=false;
        $(".controlOverflow").css("overflow","auto");
      },
      closeEvaluation:function(){
        this.showEvaluation=false;
        $(".controlOverflow").css("overflow","auto");
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";
  #secTop
    height $table-height
    display flex
    justify-content space-between
    align-items center
    text-align center
    color #fff
    border-bottom 1px solid #dedede
  .nameCircular
    height 48px
    width 48px
    line-height 48px
    background-color #1BBE9F
    color #fff
    text-align center
    border-radius 50%
    margin-right 20px
  .operate-area
    display flex
    justify-content space-between
    align-items center
    padding-right 40px
    button
      margin-left 20px
</style>
