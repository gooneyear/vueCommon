<template>
  <mu-dialog :open="showOver" title="训练小结">
    <mu-row class="center-style" gutter>
      <div>已完成 {{score.name}}</div>
    </mu-row>
    <mu-row class="center-style" gutter>
      <mu-col>
        <div class="scoreLine">
         <span class="lines lines-left"></span><span class="diamond diamond-left"></span>
         <span class="text">{{score.score}}</span>
         <span class="diamond diamond-right"></span><span class="lines lines-right"></span>
        </div>
        <div class = "game-score-desc">本局得分</div>
      </mu-col>
    </mu-row>
    <mu-row class="center-style" gutter>
      <mu-col v-if="gameFlag==1">
        <div class="last-desc">上次得分
          <span class="last-score">{{score.highestScore}}</span>&nbsp;分
        </div>
      </mu-col>
      <mu-col v-else>
        <div class="center-style">
          <span>上次得分&nbsp;{{score.highestScore}}&nbsp;分</span>
          <span style="margin-left:30px;">正确作答平均反应时间&nbsp; 20s</span>
        </div>
        <div class="last-desc">
          <span>正确题数/总体数&nbsp;50/60&nbsp;</span>
          <span style="margin-left:30px;">正确率&nbsp; 80%</span>
        </div>
      </mu-col>
    </mu-row>
    <mu-row class="center-style" gutter>
      <mu-col>
        <div class="all-desc" v-if="showAll">
          <div>恭喜！您已完成今日所有训练任务！</div>
          <div>明天继续加油~</div>
        </div>
      </mu-col>
    </mu-row>
    <mu-raised-button label="再练一次" class="btn-style" @click="restart" primary />
    <mu-raised-button label="返回" style="color:#444;margin-left:20px;" class="btn-style" @click="return2Today" />
  </mu-dialog>
</template>

<script>
import {getSelect} from '../../assets/js/common.js'
export default {
  props:["score"],
  data () {
    console.log(this.score)
    return {
      showAll: false,
      showOver: true,
      // 游戏标识，1为认知，2为言语
      gameFlag: 1,
    }
  },
  computed: {

    sex: function() {
      return getSelect('gender', this.info.gender)
    },
  },
  methods: {
    return2Today: function () {
      this.$emit("close");
      this.showOver = false;
    },
    restart: function(){
      console.log("restart")
    }
  }
}
</script>
<style lang='styl' scoped>
  @import "../../assets/css/app.styl"

.center-style
  display flex
  justify-content center
  text-align center

.scoreLine{
  height:128px;
  line-height:128px;
  text-align:center;
  font-size:112px;
  color:#0a81e5;
  position:relative;
}
.scoreLine .lines{
  display: inline-block;
  width: 150px;
  height: 32px;
  border-top: 1px solid #0a81e5 ;
}
.diamond{
  display:inline-block;
  background-color: #0A81E5;
  width:14px;
  height:14px;
  transform:rotate(-45deg);
  line-height:123px;
  position:absolute;
  top:50%;
}
.diamond-left{
  left:134px;
}

.game-score-desc {
  font-size:18px;
  color:#999;
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
};
.last-desc {
  margin-top: 20px;
  margin-bottom: 60px;
}
.last-score {
  font-size:32px;
  color:#888;
  vertical-align:middle;
  font-family: 'trebuchet ms', verdana, arial
}
.all-desc {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
}
</style>
