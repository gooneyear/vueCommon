<template>
  <div id="container">
    <p class="u-loading" v-if="loading">正在加载，请稍候......</p>
    <div class="m-result" v-if="loaded">
      <mu-dialog :open="showTrain">
      <trainModal v-if="showTrain" :caseId="caseId" @close="closeTrain" @submitData="submitTrain"></trainModal>
      </mu-dialog>
      <trainCronSave v-if="saveGame" :gameData="gameData" :gameFlag="1" :caseId="caseId" @close="saveGame=false"></trainCronSave>
      <searchBar :flag="1" @getSearch="searchList" @getshowModel="openCase"></searchBar>
      <mu-table :fixedFooter="true" :height="tableH" :selectable="false" :showCheckbox="false">
        <mu-thead slot="header">
          <mu-tr>
            <mu-th width="40%">资料</mu-th>
            <mu-th width="16%">诊断</mu-th>
            <mu-th width="15%">测评</mu-th>
            <mu-th width="17%">训练方案</mu-th>
            <mu-th width="29%">操作</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody v-if="caseLists.length>0">
          <diagModal v-if="showDiag" @close="closeCase" :id="userID" @submitData="submitDiag"></diagModal>
          <mu-tr v-for="(caseList,index) in caseLists" v-if="caseList.name != '临时测评虚拟患者'" style="height:90px;">
            <mu-td width="40%" @click="toCaseInfo(caseList.id)">
              <personal :info="caseList" :keys="index" ></personal>
            </mu-td>
            <mu-td width="15%">
              <span class="addStyle pointer" v-if="caseList.isDiag==0" @click="addDiag(1,caseList.id)"><a>添加诊断</a></span>
              <span v-else><a>已诊断</a></span>
            </mu-td>
            <mu-td width="15%">
              <span class="addStyle pointer" v-if="caseList.isEva==0">
                <a @click="openEvaluation(caseList)">点击测评</a>
              </span>
              <span v-else><a>已测评</a></span>
            </mu-td>
            <mu-td width="15%">
              <span class="addStyle pointer" v-if="caseList.isSetTrain==0" @click="toTrainPlan(caseList.id)"><a>添加方案</a></span>
              <span v-else><a>已设置</a></span>
            </mu-td>
            <mu-td width="25%">
              <router-link :to="{name:'caseinfo', params:{id: caseList.id}}">查看</router-link>
              <span class="pointer" v-on:click="showMore(index)"><a>更多</a></span>
              <div class="containMore">
                <div class="showMore">
                  <ul>
                    <li><div @click="openTrain(caseList.id)">现场训练</div></li>
                    <li><router-link :to="{name:'trainRecord', params:{id: caseList.id}}"><div>训练记录</div></router-link></li>
                    <li><router-link :to="{name:'evalRecord', params:{id: caseList.id}}"><div>测评记录</div></router-link></li>
                    <li><router-link :to="{name:'collectInfo', params:{id: caseList.id}}"><div>信息采集</div></router-link></li>
                  </ul>
                </div>
              </div>
            </mu-td>
          </mu-tr>
        </mu-tbody>
        <mu-tbody v-else>
          <mu-tr><mu-td style="text-align:center;">---暂无档案信息---</mu-td></mu-tr>
        </mu-tbody>
        <mu-tfoot v-if="caseLists.length>0" slot="footer">
          <mu-tr>
            <mu-pagination :total="totalNum" :current="curPage" @pageChange="handleClick" style="margin-top:20px;" />
          </mu-tr>
        </mu-tfoot>
      </mu-table>
      <caseModal v-if="showModal" @close="closeCase" @submitData="submitCase"></caseModal>
    </div>
      <mu-dialog :open="showEvaluation">
      <evaluationModal :caseId = "caseId" v-if="showEvaluation" @close="closeEvaluation" @submitData="submitEvaluation"></evaluationModal>
      </mu-dialog>

  </div>
</template>
<script>
  import Vue from 'vue'
  import caseModal from './caseModal.vue'
  import {getSelect,curDate,getOtherDate} from '../../../assets/js/common.js'
  import diagModal from '../case/caseDiag/diagModal.vue'
  import evaluationModal from '../case/evalRecord/evaluationModal.vue'
  import trainModal from '../case/trainRecord/trainModal.vue'
  import trainCronSave from '../../common/trainCronSave.vue'
  import personal from '../../common/personal.vue'
  import searchBar from '../../common/searchBar.vue'

  export default ({
    data() {
      return {
        showEval: 0,  // 1：训练；2：测评。值将传到弹出的子组件中作为判断依据。
        showModal: false,
        showDiag: false,
        saveGame: false,   // 打开1.0游戏
        showTrain: false,  // 显示现场训练
        gameData: '',      // 游戏数据
        //数据加载中的标识
        loading: false,
        //数据加载完毕的标识
        loaded: false,
        userID: '',
        name: '',
        age: '',
        search: {
          keyword: ''
        },
        caseLists: [],
        curPage: 1,
        totalNum: 1,
        errorMobile: '',   // 子组件中的错误提示
        errorDate: '',
        showEvaluation:false,
        caseId:"",
        cache : {}, //缓存页码及事件的对象
      }
    },
    computed: {
      tableH: function(){
        return (document.body.clientHeight - 266)+'px';
      }
    },
    components: {
      caseModal,
      diagModal,
      evaluationModal,
      trainModal,
      trainCronSave,
      personal,
      searchBar
    },
    mounted () {
      this.fetch(this.curPage);
    },
    methods: {
      openEvaluation:function(caseList){
        this.showEvaluation=true;
        this.caseId = caseList.id;
      },
      closeEvaluation:function(){
        this.showEvaluation=false;
      },
      submitEvaluation: function(res) {
        if (res.length == 0) {
          alert('请选择训练项目');
        } else {
          this.gameData = res;
          this.saveGame = true;
          this.showEvaluation = false;
        }
      },
      fetch: function(curPage,pageNum) {
        var self = this;
        self.loading= true;
        self.loaded= false;
        if (self.cache[curPage]) {
          self.loading= false;
          self.loaded= true;
          self.caseLists = self.cache[curPage].data;
          self.totalNum = self.cache[curPage].page.total;
        }else{
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
              self.loading= false;
              self.loaded= true;
              self.caseLists = res.data.data;
              self.totalNum = res.data.page.total;
              // self.cache[curPage] = res.data;
            }
          )
        }
      },
      handleClick: function(newIndex){
        this.curPage = newIndex;
        this.fetch(newIndex,10);
      },
      submitCase: function(name,gender,birthday,tele,edu,hand) {
        var self = this;
        self.$http.post('/api/Cases/create', {
          'name': name,
          'gender': gender,
          'birthday': birthday,
          'telephone': tele,
          'education': edu,
          'hand': hand
        },Vue.http.options.emulateJSON = true)
          .then(
            function(res){
              if(res.body.resultCode == 30000){
                if(res.body.resultMsg.indexOf('手机') >= 0){
                  self.errorMobile = res.body.resultMsg;
                } else {
                  self.errorDate = res.body.resultMsg;
                }
              } else {
                /* 变量初始化，以免影响下一次新建档案的显示 */
                self.showModal=false;
                self.name = '';
                self.age = '';
                self.fetch();
                // 新建患者时，同时新建一个院内试用订单（一个月）
                self.createTrialOrder(res.body.aid,name,tele);
              }
            }
          )
      },
      createTrialOrder: function(id,name,tele){
        var acc = require('../../../app/store.js');
        this.$http.post(GLOBAL.ORDER+'trial-create',{
          'user_id': id,
          'user_name': name,
          'order_use_start_time': curDate(),
          'order_use_end_time': getOtherDate(curDate(),30),
          'user_mobile':tele,
          'remark': 'remark',
          'order_mode': 1,        // 订单生成方式，0、管理端，1、医生端，2、患者端
          'doc_id': acc.account.account_uuid,      // 医生id(说明 不可以为空)，类型字符串
          'doc_name': acc.account.username,  // 医生姓名(说明 不可以为空)，类型字符串
          'dept_id': acc.account.dept_id,    // 下单人科室(说明 可以为空)，类型字符串
          'dept_name': acc.account.dept_name,// 下单人科室名称(说明 可以为空)，类型字符串
          'org_id': acc.account.org_uuid,      // 机构id(说明 可以为空)，类型字符串
          'org_name': acc.account.orgName,  // 机构名称患者姓名(说明 可以为空)，类型字符串
        },
        Vue.http.options.emulateJSON = false)
      },
      submitDiag: function(res,id) {
        var self = this;
        self.$http.post('/api/Cases/updateDiag',{
            id: id,
            checked: res,
            other: ''
          },Vue.http.options.emulateJSON = true)
          .then(function(){
            self.showDiag=false;
            // 解决因代码执行顺序问题造成作用域失效，导致self.showDiag无法执行的问题
            setTimeout(function(){
              self.$router.push({name: 'caseDiag', params: {id: id}});
            },0);
          })
      },
      searchList: function(val) {
        this.search = val;
        this.fetch();
      },
      showMore: function(index) {
        var userSetting = document.getElementsByClassName("showMore");
        window.event.stopPropagation();
        if (userSetting[index].style.display == 'block') {
          userSetting[index].style.display = 'none';
        } else {
          for (var i=0; i<userSetting.length; i++) {
            userSetting[i].style.display = 'none';
          }
          userSetting[index].style.display = 'block';
        }
      },
      submitTrain: function(res) {
        console.log(res)
        if (res.length == 0) {
          alert('請選擇訓練項目');
        } else {
          this.gameData = res;
          this.saveGame = true;
          this.showTrain = false;
        }
      },
      openTrain:function(id){
        this.showTrain=true;
        this.caseId = id;
      },
      closeTrain:function(){
        this.showTrain=false;
      },
      openCase: function(id){
        this.showModal=true;
      },
      closeCase: function(){
        this.showModal=false;
        this.showDiag=false;
      },
      // 路由到训练方案
      toTrainPlan (id) {
        this.$router.push({name: 'trainPlan', params: {id: id}});
      },
      // 路由到患者信息
      toCaseInfo (id) {
        this.$router.push({name: 'caseinfo', params: {id: id}});
      },
      addDiag: function(res,id){
        this.showDiag = res;
        this.userID = id;
      }
    },
    destroyed() {
      this.loading= false;
      this.loaded= false;
    }
  })
</script>

<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl";

  #container
    position absolute
    top 80px
    left 229px
    right 0
    border-left 1px solid #eee
    a
      color $color-font-primary
    .containMore
      position relative
    .showMore
      display none
      position absolute
      top 5px
      right 50px
      background-color $base-bgcolor
      border-radius 5px
      box-shadow 2px 5px 5px #eee
      ul
        width $second-menu-width
        text-align center
        li
          height $button-height
          line-height $button-height
          font-weight bold
          color #666
        :hover
          color #999
          cursor pointer
  .addStyle
    font-weight bold
    text-decoration underline
</style>
