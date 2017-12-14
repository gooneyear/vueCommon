<template>
  <div id="addMoreModal">
    <div class="modal-mask">
      <div class="modal-wrapper" style="display:flex">
        <div class="modal-container" style="
          display: flex;
          flex-direction: column;
        ">
          <div class="modal-header" ref='header' style="
          ">
            <h3 class="u-train-doc" >{{title}}</h3>
          </div>
          <div class="modal-body" ref='body' style="
          flex-grow: 1;
overflow-y: auto;
          ">
            <div class="modal-evalBody">
              <trainMenu @trainmenuEvent="traincontentCall"></trainMenu>
              <div class="modalList modalList-add">
                <div class="evalItem evalItem-add" v-for="(item, index) in trainList" @click="selectedItem(item, index)">
                  <div class="board board-add" :class="{touming:item.checked}">
                    <img :src="address+item.image" :title="item.name" :alt="item.name"/>
                  </div>
                  <div class="itemName itemName-add">{{item.name}}</div>
                  <div class="mengban mengban-add" :class="{hideImg:!item.checked}"><img src="../../../../assets/img/icon_select_white.png"/></div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" ref='footer'>
            <mu-raised-button label="取消" @click="cancelhandler"  />
            <mu-raised-button :label="itemLength" :disabled="disabled" @click="confirmHandler(checkItem)" primary />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  //  import trainPlanMenu from './trainPlanMenu.vue'
  import trainMenu from '../../../common/trainMenu.vue'
  import {removeByValue} from '../../../../assets/js/common.js'
  export default ({
    // 获取父级数据
    props: {
      //用于显示弹框的title
      title: {
        type: String,
        default: ''
      },
      //已经选择的训练方案
      games: {
          type: Array,
          default: function(){
              return []
          }
      },
      //请求的接口
      url: String
    },
    computed: {
      //当前选中的游戏项数
      itemLength: function(){
        return '确认 (' + this.checkItem.length + ')';
      }
    },
    data() {
      return {
        address: GLOBAL.cognition,
        //选中的游戏
        checkItem:[],
        oneGrade: '',
        twoGrade: '',
        trainList: [],
        disabled: true
      }
    },
    components:{
//      trainPlanMenu
      trainMenu
    },
    mounted() {
      this.$refs.body.style.maxHeight = String(this.$refs.body.clientHeight) + 'px';
      this.fetch();

    },
    methods: {
      //获取全部games并处理数据
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
              let cogn = res.data.data.cogn;
              let cogn_len = cogn.length;
              let lan = res.data.data.lan;
              let lan_len = lan.length;
              let men = res.data.data.men;
              let men_len = men.length;
              if(men_len>0){
                men.forEach(function(elem, index){
                  elem.flag = 1;
                });
              }
              if(cogn_len>0){
                cogn.forEach(function(elem, index){
                    elem.flag = 1;
                });
              }
              if(lan_len>0){
                lan.forEach(function(elem, index){
                  elem.flag = 2;
                });
              }
              // 区分2.0的言语训练
              if(self.oneGrade == 11){
                self.trainList = lan;
              } else if (self.oneGrade == 10){
                self.trainList = cogn;
              } else if (self.oneGrade == 12){
                self.trainList = men;
              } else{
                self.trainList = cogn.concat(lan).concat(men);
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
          }).then(function(){
            dealTrainList(self.games, function (index) {
              self.trainList.splice(index,1);
            });
            dealTrainList(self.checkItem, function (index) {
              self.$set(self.trainList[index], "checked", true);
            });
            function dealTrainList(obj, cb){
              if(obj.length){
                obj.forEach(function(elem, index){
                  for(let i=0, len= self.trainList.length; i<len;i++){
                    if(elem.id==self.trainList[i].id){
                      cb(i);
                      break;
                    }
                  }
                })
              }
            }
          });
        }
      },
      //多选
      selectedItem: function (item, index) {
        let obj= {};
        //多选
        this.$set(this.trainList[index], "checked", !item.checked);
        this.$set(this.trainList[index], "itemTime", 5);
        if(item.checked){
          this.checkItem.push(item);
        }else{
          this.checkItem.pop(item);
        }
        if(this.checkItem.length>0){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
      },
      //分类
      traincontentCall:function(p1,p2,p3){
        if(typeof p3 == 'undefined'){
          this.oneGrade = p1;
          this.twoGrade = p2;
          this.fetch();
        } else {
          this.fetch(p3);
        }
      },
      //取消按钮
      cancelhandler(){
        this.$emit('close');
      },
      //确认按钮
      confirmHandler(checkItem){
        console.log(checkItem)
        this.$emit('submitData',checkItem);
        $(".right-content").css("overflow","auto");
      }
    },
    beforeDestroy(){
      this.checkItem.forEach(function(item, index){
        item.checked = false;
      });
    }
  })
</script>
<style lang="stylus">
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"
  @import "../../../../assets/css/modal.styl"

/*===下方是本页弹出框的样式补充=======*/
  .modal-evalBody
    text-align left
  .evalItem
    padding-top 30px
    position relative
    .mengban
      position absolute
      top 110px
      left 70px
  @media screen and (max-height: 800px)
    .modalList-add
      max-height unset !important
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
    text-align center

  .modal-footer
    button
      border-radius 20px !important
</style>
