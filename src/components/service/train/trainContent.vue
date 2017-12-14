<template>
  <div id="evalContent" style="padding-left:10px">
    <template v-for="item in trainList">
      <div class="evalItem">
          <div class="board pointer" @click="showDetail(item,0)">
            <img :src="address+item.image" />
          </div>
        <div class="boardName">{{ item.name }}</div>
        <level :level="item.level"></level>
      </div>
    </template>
    <div id="container">
      <trainContentmodal :showInput="showInput" v-if="showModal"></trainContentmodal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import trainContentmodal from './trainContentmodal.vue'
import level from '../../common/levels.vue'

  export default ({
    data() {
      return {
        address: GLOBAL.cognition,
        store: require('../../../app/store.js'),
        oneGrade: '',
        twoGrade: '',
        trainList: [],
        showModal: false,
        search: {
          keyword: ''
        },
        caseId: '',   // 选中的患者id
        flag: '',     // 选中的标识
        caseName: '', // 选中的患者名字
        caseLists: [],
        thisname:"",
        thiscontent:"",
        pages: 1,
        showInput:true,
      }
    },
    components: {
      trainContentmodal,
      level
    },
    mounted(){
      var self = this;
      setTimeout(
        function(){
          return self.fetch()
        },10);
    },
    methods:{
      traincontentCall:function(p1,p2,p3){
        if(typeof p3 == 'undefined'){
          this.oneGrade = p1;
          this.twoGrade = p2;
          this.fetch();
        } else {
          this.fetch(p3);
        }
      },
      fetch: function (id) {
        var self = this;
        this.trainList = [];
        if (this.oneGrade >= 0){
          Vue.http({
              method: 'GET',
              url: '/api/Game/getAllGames'
            })
            .then(
              function(res){
                // 从配置文件中获取2.0的认知游戏
                if (self.oneGrade == 11){
                  self.trainList = res.data.data.lan;
                } else if(self.oneGrade == 10) {
                  self.trainList = res.data.data.cogn;
                } else if(self.oneGrade == 12) {
                  self.trainList = res.data.data.men;
                } else {
                  self.trainList = res.data.data.cogn.concat(res.data.data.lan).concat(res.data.data.men);
                }
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
              });
        }
      },
      showDetail:function(item,content){
        /*解决悬浮层覆盖和无法滑动的bug*/
        $(".controlOverflow").css("overflow","");
        this.showInput = true;
        this.search.keyword = '';
        this.showModal=true;
        this.game = item;
        this.searchPeople();
      },
      // 医生选中患者
      choseMe:function(caseId,caseName){
        this.caseId = caseId;
        this.flag = caseId;
        this.caseName = caseName;
        $("#justTrain").attr("disabled",false).css("background-color","#0a81e5");
      },
      searchList: function() {
        this.searchPeople();
      },
      searchPeople: function(curPage,pageNum) {
        var self = this;
        Vue.http({
            method: 'GET',
            url:'/api/Cases/getList',
            params: {
              'search': this.search,
              'page': {
                current: curPage,
                limit: pageNum
              }
            }
          })
          .then(
            function(res){
              self.caseLists = res.data.data;
              self.pages = res.data.page.total;
            })
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";
  .evalItem
    float left
    margin-top 0
    margin-left 30px
  .boardName
    text-align left
  .board img
    width 200px
</style>
