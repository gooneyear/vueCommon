<template>
  <div id="showPlan">
    <div class="trainGames clearfix">
      <div class="clearfix" style="padding-left: 10px;padding-top: 10px;">
        <div class="evalItem evalItem-showplan u-addMore u-addMore-showplan" @click="addMore" style="padding: 0; margin: 20px 0 20px 30px"></div>
        <div class="evalItem evalItem-showplan" v-for="(game, index) in games" style="padding: 20px 0">
          <div class="board pointer board-showplan" @click="selectGame(game)">
            <img style="width:140px" :src="address+game.image">
          </div>
          <p class="m-mask m-mask-showplan">
            <span class="u-close" @click="deleteHandler(game, index)">X</span>
          </p>
          <div class="boardName">{{game.name}}</div>
          <level :level="game.level"></level>
          <!--<div class="timeSet m-save-time clearfix">-->
          <!--<label class="u-label-time">分钟</label>-->
          <!--<input class="u-value-time" type="text" placeholder="默认5" v-model="game.duration"/>-->
          <!--</div>-->
          <!--<div class="timeSet m-com-time">{{game.duration}}分钟</div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import level from '../../../common/levels.vue'

  export default {
    name: 'showPlan',
    data () {
      return {
        address: GLOBAL.cognition
      }
    },
    props: {
      saveUrl: String,
      games: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      level
    },
    methods: {
      //选择游戏
      selectGame (game) {
        this.$emit('selectGame', game)
      },
      //删除训练项
      deleteHandler(item, index){
        this.games.splice(index, 1);
        this.$emit('changeSaveStatus');
      },
      //添加更多
      addMore(){
        this.$emit('addMore');
      }
    },
    destroyed() {
      this.$parent.isShowPlan= true;
    }
  }
</script>
<style lang="stylus">
div.evalItem-showplan,div.evalItem-add,div.evalItem-trainmodal{
  width:140px;
}
.board-showplan,.board-add,.board-trainmodal {
  width: 140px!important;
  height: 140px!important;
  background-color: #658456;
  /*background-color: #000;*/
}
.m-mask-showplan {
  width:140px;
  height:140px;
}
.u-addMore-showplan{
  height:140px;
}
.u-addMore-showplan:after {
  content: '+';
  position: absolute;
  width: 140px;
  line-height: 140px;
  font-size: 64px;
  text-align: center;
  cursor: pointer;
}
.board-showplan img,.board-add img,.board-trainmodal img {
  width: 140px;
}
.mengban-add,.mengban-trainmodal {
  position: absolute;
  top: 80px!important;
  left: 50px!important;
}
.itemName-add,.itemName-trainmodal {
  width: 140px;
  margin-right: 30px;
}
.evalItem-add,.evalItem-trainmodal {
  margin-right: 30px;
}
.gameGrade ul li:nth-child(1){
  background-color:#1BBE9F!important;
}
.gameGrade ul li:nth-child(2){
  background-color:#7ED321!important;
}
.gameGrade ul li:nth-child(3){
  background-color:#F5A623!important;
}
.gameGrade ul li:nth-child(4){
  background-color:#F57023!important;
}
.gameGrade ul li:nth-child(5){
  background-color:#D52820!important;
}
</style>
