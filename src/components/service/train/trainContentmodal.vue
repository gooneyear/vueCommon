<template>
  <div>
    <mu-dialog dialogClass="dialogClass" :open="showDialog" >
      <mu-flexbox>
        <mu-flexbox-item class="flex-demoLeft">
          <mu-paper class="demo-paper" :zDepth="1" style="width:300px;height:300px;">
            <img :src="address+$parent.game.image" style="width:300px;height:300px;" />
          </mu-paper>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demoRight">
          <div class="body-right-head">
            <div v-if="showInput">
              <input type="text" class="inputName" @keyup="showAllIfNull" placeholder="请输入姓名搜索..."  v-model="$parent.search.keyword"/><i class="searchicon pointer" @click="$parent.searchList">搜</i>
            </div>
            <div v-else>
              <input type="text" class="inputName disable-input" disabled="disabled" placeholder="请输入姓名搜索..."><i class="searchicon pointer">搜</i>
            </div>
          </div>
          <div v-if="showInput">
            <div class="body-right-foot">
              <ul v-if="Object.keys($parent.caseLists).length>0">
                <li v-for="(caseList,index) in $parent.caseLists" @click="$parent.choseMe(caseList.id,caseList.name)" :class="{'on':$parent.flag==caseList.id}">
                  <template v-if="caseList.name != '临时测评虚拟患者'">
                    <span>{{(caseList.name+'').substr(-2,2)}}</span>
                    <i>{{caseList.name}}</i>，{{caseList.gender == '1' ? '女' : '男'}}，{{caseList.age}}岁
                  </template>
                </li>
              </ul>
              <ul v-else>
                <li style="text-align: center">无搜索结果</li>
              </ul>
            </div>
          </div>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-flexbox>
        <mu-flexbox-item>
          <!-- <div class="footer-container"> -->
            <div class="footer-left">
              <h4 style="padding:0;margin-top:0;">{{ $parent.game.name }}</h4>
              <level :level="$parent.game.level"></level>
              <p style="padding:0;font-size:15px;">{{$parent.game.desc}}</p>
            </div>
        </mu-flexbox-item>
        <mu-flexbox-item>
            <div class="footer-right">
              <div class="footer-down">
                <trainCronSave v-if="saveGame"
                :gameData="$parent.game"
                :gameFlag="gameFlag"
                :caseId="$parent.caseId"
                :caseName="$parent.caseName"
                :todayGames="todayGames"
                @close="saveGame=false"></trainCronSave>
                <mu-dialog :open="showMes" title="提示">
                  请先选择一个患者！
                  <mu-flat-button slot="actions" @click="showMes=false" label="确定" primary />
                </mu-dialog>
                <a v-if="showInput" class="pointer a-font" @click="openGame(0)">临时练习</a>
                <mu-raised-button label="取消" @click="cancelGame" style="margin-top:5px;color:#999;border-radius:20px;" slot="actions" />
                <button v-if="showInput" class="button" id="justTrain" style="margin-top:5px" @click="openGame(1)" disabled>立刻训练</button>
                <button v-else class="button" id="justTrain" style="margin-top:5px;background-color: rgb(10, 129, 229);" @click="beginTrain(game)">开始训练</button>
              </div>
            </div>
          <!-- </div> -->
        </mu-flexbox-item>
      </mu-flexbox>
    </mu-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import trainCronSave from '../../common/trainCronSave.vue'
  import level from '../../common/levels.vue'

  export default ({
    data() {
      return {
        address: GLOBAL.cognition,
        saveGame: false,  // 打开1.0游戏并保存
        showMes: false,   // 显示消息框
        gameFlag: 0,      // 0：临时训练； 1：正式训练
        todayGames: '',
        showDialog: true,
      }
    },
    props:["showInput","game"],
    components:{
      trainCronSave,
      level
    },
    methods: {
      openGame: function(res){
        if(this.$parent.caseId || res == 0){
          this.gameFlag = res;
          this.saveGame = true;
        } else {
          this.showMes = true;
        }
      },
      cancelGame: function(){
        this.saveGame = false;
        if (this.$parent.showModal) {
          this.$parent.showModal = false;
        }else{
          this.$parent.showContentModal = false;
        }
        /*解决悬浮层覆盖和无法滑动的bug*/
        $(".right-content").css("overflow", "auto");
        $(".controlOverflow").css("overflow","auto");
        this.$parent.caseId = '';
        this.$parent.flag = '';    // 同时取消选中的患者
      },
      beginTrain:function(game){
        var self = this;
        this.showDialog = false;
        Vue.http({
          method: 'GET',
          url:'/api/Train/getDailyTrainingProgram',
          params: {
            'id': self.$route.params.id
          }
        })
          .then(function(data){
            self.$parent.gameData = game;
            self.$parent.saveGame = true;
          })
      },
      // 如果搜索时删除了搜索内容，则自动显示所有患者
      showAllIfNull:function(){
        if(this.$parent.search.keyword == ''){
          this.$parent.searchPeople();
        }
      }
    }
  });
</script>

<style lang="stylus" scoped>
  .dialogClass
    width 800px!important
    height 500px!important
    max-width 800px!important
    max-height 500px!important
  .flex-demoLeft
    max-width 336px
    margin-left 6px
    position relative
    top -10px
  .flex-demoRight
    margin-right 6px
  .body-left
    display block
    width 40%
    float left
    background-color #fff
    vertical-align middle
  .evalItemDetail
    width 300px
    background-color #658456
    height 300px
  .body-right
    display block
    width 400px
    float right
    background-color #fff
  .body-right-head
    position relative
    background-color #fff
    height 40px
    line-height 40px
  .body-right-head input
    width 95%
    line-height 40px
    padding-left 20px
    background-color #f5f5f5
  .body-right-head i
    text-indent -9999px
    position absolute
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
    li:nth-child(4n+1) span
      background-color #1BBE9F!important
    li:nth-child(4n+2) span
      background-color #F6A623!important
    li:nth-child(4n+3) span
      background-color #E8570F!important
    li:nth-child(4n+0) span
      background-color #4990E2!important
    ul li
      line-height 89px
      margin-top 0
      margin-right 20%
      text-align left
      border-bottom 1px solid #eee
    ul li span
      color #fff
      background-color #F6A623
      display inline-block
      width 47px
      height 47px
      line-height 50px
      border-radius 100px
      text-align center
    ul li i
      font-style normal
      font-weight bold
      margin-left 10px
  .footer-container
    clear both
  .footer-left
    float left
    margin-top 0px
    width 320px
  .footer-left h4
    margin 5px 0
    text-align left
  .footer-left p
    margin 0
    text-align left
  .footer-right
    float right
    width 400px
    position relative
    top -45px
    margin-bottom 30px
  .footer-down
    position absolute
    top 70px
    right 6px
    margin-bottom 30px
  .footer-down a
    text-decoration underline
  .a-font
    font-size 14px
    color #333
    text-decoration underline
  .footer-down button
    display inline-block
    margin 0 0 0 30px
  .on
    position relative
  /*box-shadow 5px 5px 5px #ccc*/
  .on::after
    content: ' ';
    position:absolute;
    top:35px;
    right:-30px;
    display:inline-block;
    margin-left:30px;
    width:20px;
    height:20px;
    background-image: url('../../../assets/img/icon_select_blue.png');
    .disable-input:hover
      cursor not-allowed
</style>
