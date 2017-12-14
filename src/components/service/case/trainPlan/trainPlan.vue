<template>
  <div id="trainPlan">
    <p class="u-loading" v-if="loading">正在加载，请稍候......</p>
    <div class="m-result" v-if="loaded">
      <!--无数据时展示 start-->
      <div class="m-hasno" v-if="!hasResult">
        <div class="m-hasno-result">
          <div class="m-btn-operate" v-if="!isUpdate">
            <p class="u-title-trainPlan">当前还没有方案，可点击增加方案</p>
            <button class="u-btn u-btn-add"  @click="showMoreModal">添加方案</button>
            <button class="sysBtn"  @click="sysHandler" :disabled="disabled">系统推荐</button>
          </div>
          <div class="m-btn-update" v-else>
            <div class="m-wrap-btnno">
              <div class="m-no-save" v-if="isSave">
                <mu-raised-button label="保存方案" class="u-btn u-btn-save" @click="saveHandler_nores" primary />
                <mu-raised-button label="系统推荐" class="u-btn u-btn-cancel" @click="cancelSys" v-if="isRecommend" />
              </div>
              <div class="m-no-recommend" v-else>
                <mu-raised-button label="使用系统推荐" class="u-btn u-btn-uses" :disabled="disabled" @click="useSys" primary />
                <mu-raised-button label="取消" class="u-btn u-btn-cancel" @click="cancelSys" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--无数据时展示 end-->
      <!--有数据时展示 start-->
      <div class="m-wrap-p40" v-else>
        <div v-if="!isUpdate">
          <button class="u-btn u-btn-change" @click="changeHandler">更改方案</button>
          <button class="sysBtn"  @click="sysHandler" :disabled="disabled">系统推荐</button>
        </div>
        <div class="m-wrap-btnhas" v-else>
          <div class="m-has-save" v-if="isSave">
            <mu-raised-button label="保存方案" class="btn-100-len u-btn u-btn-save" @click="saveHandler(saveUrl)" primary />
            <mu-raised-button label="取消" class="btn-100-len u-btn u-btn-cancel" @click="cancelSys" v-if="isRecommend" />
          </div>
          <div class="m-has-recommend" v-else>
            <mu-raised-button label="使用系统推荐" class="btn-100-len u-btn u-btn-uses" :disabled="disabled" @click="useSys" primary />
            <mu-raised-button label="取消" class="btn-100-len u-btn u-btn-cancel" @click="cancelSys" />
          </div>
        </div>
      </div>
      <!--有数据时展示 end-->
      <showPlan :games="games" :class="{'m-edit': isEdit}" @changeSaveStatus="changeSaveStatus" @selectGame="selectGame" @addMore="addMore" v-if="isShowPlan"></showPlan>
      <addMoreModal v-if="showModal" title="添加方案" @close="close" @submitData="submitData" :games="games"></addMoreModal>
      <trainCronSave v-if="saveGame" :gameData="gameData" :gameFlag="1" :caseId="$route.params.id" :todayGames="todayGames" @close="saveGame=false"></trainCronSave>
      <trainContentmodal :game="game" :showInput="showInput" v-if="showContentModal"></trainContentmodal>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import addMoreModal from './addMoreModal.vue'
  import showPlan from './showPlan.vue'
  import trainCronSave from '../../../common/trainCronSave.vue'
  import trainContentmodal from '../../train/trainContentmodal.vue'

  export default ({
    data() {
      return {
        disabled: true,
        //保存游戏（添加方案和系统推荐分别保存）
        saveUrl: this.$API.trainPlan['saveSelfPlan'],
        // 被选中的游戏
        gameData: {},
        saveGame: false,
        showMsg: false,
        //数据加载中的标识
        loading: false,
        //数据加载完毕的标识
        loaded: false,
        //没有结果的情况
        hasResult: false,
        //所有方案
        showModal: false,
        //是否显示被选的方案
        isShowPlan: false,
        // true表示显示保存按钮，false为使用系统推荐或取消
        isSave: false,
        //无数据情况下未做添加操作
        isUpdate: false,
        //是否为编辑态
        isEdit: false,
        //是否为系统推荐
        isRecommend: false,
        store: require('../../../../app/store.js'),
        games: [],
        selectedCogn: {
          code: '',
          name: '',
          description: ''
        },
        // 今日推荐的训练列表
        todayGames: '',
        game:"",
        showContentModal:false,
        showInput:true,
      }
    },
    mounted () {
      this.isEdit= false;
      this.fetch();
    },
    components: {
      addMoreModal,
      trainCronSave,
      showPlan,
      trainContentmodal,
    },
    methods: {
      //获取训练方案
      fetch: function () {
        var self = this;
        self.loading= true;
        Vue.http({
          method: 'GET',
          url: '/api/Train/getManualProgram',
          params: {
            'id': self.$route.params.id
          }
        })
        .then(function(res){
          let datas = [];
          let cogn = [];
          let lan = [];
          self.loading= false;
          self.loaded= true;
          if(res.data.resultCode!='20000'){
            return false;
          }
          cogn = res.data.data.cogn;
          lan = res.data.data.lan;
          if(cogn.length>0){
            cogn.forEach(function(elem, index){
                elem.flag=1;
            })
          }
          if(lan.length>0){
            lan.forEach(function(elem, index){
              elem.flag=2;
            })
          }
          datas = cogn.concat(lan);
          if(datas.length){
            self.hasResult = true;
            self.isShowPlan= true;
            self.games = datas;
          }
        }).then(function(){
            Vue.http({
              method: 'get',
              url: '/api/Train/getSystemProgram',
              params: {
                'id': self.$route.params.id
              }
            }).then((res)=>{
              let data= res.data.data;
              if(res.data.resultCode!='20000'){
                return false;
              }
              if(data.cogn.length>0||data.lan.length>0){
                self.disabled = false;
                $('.sysBtn').addClass('changeColorSys');
                $('.u-btn-add').addClass('changeColorAdd');
              }
            })
        })
      },
      //处理添加方案
      submitData(checkItem){
        if(checkItem.length==0){
          alert('您还没有添加方案')
          return false;
        }
        console.log(this.games);
        console.log(checkItem);
        this.games = checkItem.concat(this.games);
        this.isEdit = true;
        this.isUpdate= true;
        this.isSave= true;
        this.isShowPlan= true;
        this.showModal = false;
      },
      //更改方案的处理
      changeHandler(){
        this.isEdit= true;
        this.isSave = true;
        this.isUpdate= true;
        this.isRecommend= false;
      },
      //保存训练项
      saveHandler(url){
        let checked= {
            "lan": [],
            "cogn": []
        };
        let self = this;
        let params= {};
        this.games.forEach(function(elem){
          if(elem.flag==1){
            checked.cogn.push(elem.id);
          }else{
            checked.lan.push(elem.id);
          }
        });
        params= {
          'id': self.$route.params.id,
          'checked': checked
        }
        if(this.isRecommend){
            params.system= 1;
        }
        this.$http.post(
          url, params,Vue.http.options.emulateJSON = true
        )
        .then(function(res){
          let data = res.data;
          if(data.resultCode!='20000'){
            alert('系统忙，请稍候重试！');
            return false;
          }
          self.init();
          self.fetch();
        },
        function(){
          alert('系统忙，请稍候重试！');
        });
      },
      //添加更多
      addMore(){
        this.showModal = true;
        $(".right-content").css("overflow", "");
        $(".controlOverflow").css("overflow","");
      },
      //关闭添加弹层
      close (){
        this.showModal = false
        $(".right-content").css("overflow", "auto");
        $(".controlOverflow").css("overflow","auto");
      },
      selectGame (game) {
        this.showContentModal = true;
        this.game = game;
/*        this.getDailyTask(game);*/
        this.showInput = false;
        $(".right-content").css("overflow", "");
        $(".controlOverflow").css("overflow","");
      },
      closeMsg(){
        this.showMsg = false;
        $(".right-content").css("overflow", "auto");
        $(".controlOverflow").css("overflow","auto");
      },
      //获取系统推荐的数据
      sysHandler() {
        this.getSysData();
      },
      //使用系统推荐按钮
      useSys() {
        this.saveHandler('/api/Train/chooseSystemProgram');
      },
      //获取系统推荐的数据
      getSysData() {
        var self = this;
        Vue.http({
          method: 'get',
          url: '/api/Train/getSystemProgram',
          params: {
            'id': self.$route.params.id
          }
        }).then((res)=>{
          let data= res.data.data;
          let datas= [];
          let cogn= [];
          let lan= [];
          if(res.data.resultCode!='20000'){
            return false;
          }
          cogn= data.cogn;
          lan= data.lan;
          if(cogn.length>0){
            cogn.forEach(function(elem, index){
              elem.flag=1;
            })
          }
          if(lan.length>0){
            lan.forEach(function(elem, index){
              elem.flag=2;
            })
          }

          datas = cogn.concat(lan);
          self.games = datas;
          self.isEdit= true;
          self.isUpdate= true;
          self.isRecommend=true;
          self.isShowPlan= true;
        }).then(function(){
          if(self.games.length>0){
            $('.u-btn-uses').removeAttr('disabled').removeClass('u-disabled');
          }
        })
      },
      //无结果情况，添加方案
      showMoreModal () {
        this.showModal = true;
        this.isRecommend= false;
        $(".right-content").css("overflow", "");
        $(".controlOverflow").css("overflow","");
      },
      //无结果情况，取消按钮
      cancelSys() {
          this.init();
          this.fetch();
      },
      //保存方案
      saveHandler_nores() {
          this.saveHandler(this.saveUrl);
      },
      //改变使用系统推荐到保存
      changeSaveStatus() {
        if(this.isRecommend){
          this.isSave= true;
        }
      },
      init() {
        this.saveGame= false;
        this.loading= false;
        this.loaded= false;
        this.hasResult= false;
        this.showModal= false;
        this.isShowPlan= false;
        this.isSave= false;
        this.isUpdate= false;
        this.isEdit= false;
        this.isRecommend= false;
        this.games= [];
      },
      destroyed() {
          this.init();
          console.log('destroyed')
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"

  .btn-100-len
    width 120px
    height 30px

  #trainPlan
    position absolute
    top 101px
    left $second-menu-width
    right 0
  .trainTime
    display flex
    height $menu-height
    line-height $menu-height
    justify-content space-between
    align-items center
    padding 0 40px
    background-color #f8f8f8
  .gameGrade
    height 25px
  .timeSet
    display block
    padding-bottom 5px
    height 25px
    line-height 25px
    font-weight bold
    border-bottom 1px solid #ddd
  .game-container
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    background-color #333
    z-index 99
  .game-iframe
    border none
/*样式添加*/
  .u-loading, .m-hasno, .m-wrap-p40
    padding 0 40px
    margin 0
  .u-loading, .m-wrap-p40
    line-height 60px
  .m-wrap-p40
    background-color #F8F8F8
  .u-title-trainPlan
    margin-top 30px
    margin-bottom 20px
  .u-btn-add, .u-btn-change, .u-btn-save, .u-btn-uses
    background-color rgb(10, 129, 229)
    border-radius 20px !important
    line-height 40px
  /*.u-btn-recommend, .u-btn-sys, .u-btn-cancel*/
  .u-btn-recommend, .u-btn-cancel
    margin-left 20px
    background-color rgb(10, 129, 229)
    border-radius 20px !important
  /*.u-btn-save, .m-save .u-btn-change, .m-save .u-btn-sys*/
    /*display none*/
  /*.u-btn-sys, .u-btn-change, .m-save .u-btn-save*/
    /*display inline-block*/
  .m-save .evalItem, .m-edit .evalItem
    position: relative
  .m-save .u-addMore, .m-edit .u-addMore
    display block
  .m-mask
    display none
    margin 0
    position absolute
    top 20px
    left 0
    width 200px
    height 200px
  .m-save .m-mask, .m-edit .m-mask
    display block
  .m-save .u-close, .m-edit .u-close
    position absolute
    top 0
    right 0
    width 24px
    height 24px
    line-height 24px
    cursor pointer
    background-color rgba(0, 0, 0, .5)
    color #fff
    text-align center
  .u-addMore
    display none
    width 200px
    height 200px
    background-color #F5F5F5
    color #999
  .u-addMore:after
    content '+'
    position absolute
    width 200px
    line-height 200px
    font-size 64px
    text-align center
    cursor pointer
  .u-label-time
    float right
    line-height 24px
  .u-value-time
    float left
    height 20px
    line-height 20px
    color #ccc
  .m-save .m-com-time, .m-save-time
    display none
  .m-com-time, .m-save .m-save-time
    display block
  .m-btn-update
    line-height 60px
  .u-disabled
    background-color rgb(221, 221, 221)!important
    cursor not-allowed!important
  .sysBtn
    border-radius 20px !important
    outline none
    line-height 40px
  .changeColorSys
    background-color rgb(10, 129, 229) !important
    color #fff !important
  .changeColorAdd
    background-color rgb(27, 190, 159) !important
    color #fff !important
</style>
