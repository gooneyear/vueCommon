<template>
  <div id="caseDiag" style='height: 100%'>
    <p class="u-loading" v-if="loading">正在加载，请稍候......</p>
    <div class="m-result" v-if="loaded">
      <div class="noDiag" v-if="isDiag==0">
        <span>当前还没有诊断，点击添加</span>
        <button class="button" @click="openModal" style="background-color: #0a81e5">添加诊断</button>
      </div>
      <div
        v-else
        class="showDiag"
        style = '
          display: flex;
          flex-direction: column;
          min-height: 200px;
          position: absolute;
          top: 0px;
          bottom: 0px;
          left: 0px;
          right: 0px;
        '
      >
        <div
          class="diagShow"
          style = '
            overflow: auto;
          '
        >
          <ul v-for="(diag,index) in diagCheck">
            <li style="border-bottom: solid 1px #eee; padding-bottom:20px;">
              <ul>
                <li style="font-weight: bold;margin-left:30px;margin-top:20px">{{diag.name}}</li>
              </ul>
              <ul v-for="secDiag in diag.child">
                <li style="margin-left: 40px;margin-top:10px">{{secDiag.name}}
                  <span style="color:#aaa" >{{secDiag.id | getOther}}</span>
                  <span style="color:#aaa" v-for="thrDiag in secDiag.child">-{{thrDiag.name}}</span>
                </li>
              </ul>
            </li>
          </ul>
          <div class="editDiag" style='
            display: flex;
            flex-direction: column;
            '
          >
            <span class="pointer" style="color:#999;padding-bottom:20px;text-decoration: underline; height: 20px; flex-grow: 1; display: block" @click="openModal">信息有误，点击修改</span>
          </div>
        </div>
        <!--此处为解决病症过多无法全部显示的问题，略蛋疼的方案，后面重构-->
        <br><br><br><br><br><br><br><br><br>
      </div>

      <diagModal v-if="showModal" @close="closeModal" @submitData="submitCase"></diagModal>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import diagModal from './diagModal.vue'
  import {removeByValue,resetData,contains,addCheck} from '../../../../assets/js/common.js'
var checkedItem = [];
  export default ({
    props: ['caseInfo'],
    data() {
      return {
        showModal: false,
        isDiag: 0,           // 该变量用于数据提交后重新加载当前子组件
        checkedName:[],      // 带id 和 name的已诊断列表
        diagCheck: [],       // 格式整理后的已诊断列表
        //数据加载中的标识
        loading: false,
        //数据加载完毕的标识
        loaded: false
      }
    },
    components:{
      diagModal
    },
    mounted() {
      this.fetch()
    },
//    beforeDestroy(){
//      this.diagCheck = [];
//    },
    filters:{
      getOther: function(val){
        if(checkedItem[val]){
          return '-'+checkedItem[val];
        }
      }
    },
    methods: {
      fetch: function() {
        var self = this;
        self.loading= true;
        Vue.http({
            method: 'GET',
            url:'/api/Cases/getAllDiag',
            params: {
              'id': self.$route.params.id
            }
          },Vue.http.options.emulateJSON = true)
          .then(function(data){
            self.loading= false;
            self.loaded= true;
            checkedItem = data.data.checked;
            if(Object.keys(data.data.checked).length >0){
              self.isDiag = 1;
            } else {
              self.isDiag = 0;
            }
            var diag = data.data.data;
            var diagInfos = data.data;
            var itemCheck = addCheck(diag);
            // 查找一级分类
            for(var i= 0, len=itemCheck.length; i<len; i++){
              var first = false;
              // 查找二级分类
              for(var k= 0, len2=itemCheck[i].child.length; k<len2; k++){
                var second = false;
                // 查找三级分类
                if(itemCheck[i].child[k].child){
                  for(var l=0; l<itemCheck[i].child[k].child.length; l++){
                    var third = false;
                    for (var j=0; j<Object.keys(diagInfos.checked).length; j++){
                      if(itemCheck[i].child[k].child[l].id == Object.keys(diagInfos.checked)[j]){
                        first = true;
                        second = true;
                        third = true;
                      }
                    }
                    // 删除三级分类
                    if (!third){
                      delete itemCheck[i].child[k].child[l];
                    }
                  }
                  // 过滤被删掉的三级分类
                  itemCheck[i].child[k].child=itemCheck[i].child[k].child.filter(function(temp){
                    return temp;
                  });
                } else {
                  for (var m=0; m<Object.keys(diagInfos.checked).length; m++) {
                    if (itemCheck[i].child[k].id == Object.keys(diagInfos.checked)[m]) {
                      first = true;
                      second = true;
                    }
                  }
                }
                // 删除二级分类
                if (!second){
                  delete itemCheck[i].child[k];
                }
              }
              // 过滤被删掉的二级分类
              itemCheck[i].child=itemCheck[i].child.filter(function(it){
                return it;
              });
              // 如果该一级分类中没有诊断项，则删除该一级分类
              if (!first){
                delete itemCheck[i];
              }
            }
            // 过滤被删掉的一级分类
            itemCheck=itemCheck.filter(function(item){
              return item;
            });
            // 将临时变量的值赋给vue变量，更新data
            self.diagCheck = itemCheck;
          })
      },
      submitCase: function(res) {
        console.log(JSON.stringify(res));
        var self = this;
        self.$http.post('/api/Cases/updateDiag',{
          id: self.$route.params.id,
          checked: res
        },
        Vue.http.options.emulateJSON = true)
          .then(function(){
            var self = this;
            self.showModal=false;
            this.fetch();
          })
      },
      openModal: function(){
        this.showModal=true;
        $(".right-content").css("overflow","");
        $(".controlOverflow").css("overflow","");
      },
      closeModal: function(){
        this.showModal=false;
        $(".right-content").css("overflow","auto");
        $(".controlOverflow").css("overflow","auto");
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
  #caseDiag
    top 101px
    left $second-menu-width
    right 0
    display flex
    flex-direction column
    flex-grow 1
/*    overflow auto*/
  .noDiag
    padding 30px 0 0 40px
    span
      display block
      margin-bottom 20px
      color #999
  .diagList
    height 400px
    overflow auto
    text-align left
    margin-left 200px
    margin-top -40px
    span
      display inline-block
      width 15px
      height 15px
      vertical-align middle
      margin-right 20px
      background-color #ddd
    a
      vertical-align middle
    li
      height 30px
      line-height 30px
  .editDiag
    text-align left
    margin-top 15px
    margin-left 40px
    margin-bottom 40px
</style>
