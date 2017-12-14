<template>
  <div id="container">
    <p class="u-loading" v-if="loading">正在加载，请稍候......</p>
    <div class="m-result" v-if="loaded">
      <searchBar @getSearch="searchList" @getshowModel="openCase" :flag="0"></searchBar>
      <mu-table :fixedFooter="true" :height="tableH" :selectable="false" :showCheckbox="false">
        <mu-thead slot="header">
          <mu-tr style="text-align:left;">
            <mu-th width="20%">患者信息</mu-th>
            <mu-th width="20%">订单号</mu-th>
            <mu-th width="20%">开单信息</mu-th>
            <mu-th width="30%">订单信息</mu-th>
            <mu-th width="10%">操作</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody v-if="orderLists.length>0">
          <mu-tr v-for="(order,index) in orderLists" style="height:90px;">
            <mu-td width="20%" @click="toCaseInfo(order.id,order)">
              <personal :info="order" :keys="index" :flag="1"></personal>
            </mu-td>
            <mu-td width="20%">
              <span><a>{{order.id}}</a></span>
            </mu-td>
            <mu-td width="20%">
              <span><a>{{order.doc_name}}，{{order.add_time | date}}</a></span>
            </mu-td>
            <mu-td width="30%">
              <span><a>￥{{order.order_total_fee}}，{{order.order_use_start_time | date}}，
                {{order.order_days}}天，{{order.order_status | payed}}</a></span>
            </mu-td>
            <mu-td width="10%">
              <router-link :to="{name:'orderInfo', params:{id: order.id}, query:{order:order}}">查看详情</router-link>
            </mu-td>
          </mu-tr>
        </mu-tbody>
        <mu-tbody v-else>
          <mu-tr><mu-td style="text-align:center;">---暂无订单信息---</mu-td></mu-tr>
        </mu-tbody>
        <mu-tfoot v-if="orderLists.length>0" slot="footer">
          <mu-tr>
            <mu-pagination :total="totalNum" :current="curPage" @pageChange="handleClick" style="margin-top:20px;" />
          </mu-tr>
        </mu-tfoot>
      </mu-table>
      <orderModal v-if="showModal" @close="closeCase"></orderModal>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import orderModal from './orderModal.vue'
  import personal from '../../common/personal.vue'
  import {getSelect} from '../../../assets/js/common.js'
  import searchBar from '../../common/searchBar.vue'

  export default ({
    data() {
      return {
        showModal: false,
        //数据加载中的标识
        loading: false,
        //数据加载完毕的标识
        loaded: false,
        select: GLOBAL.selectOption,
        store: require('../../../app/store.js'),
        userID: '',
        search: '',
        orderLists: [],
        caseLists: [],
        curPage: 1,
        totalNum: 1
      }
    },
    computed: {
      tableH: function(){
        return (document.body.clientHeight - 266)+'px';
      }
    },
    filters: {
      date: function(val){
        let format = val + "";
        let tDate = val.split(" ");
        return tDate[0];
      },
      payed: function(val){
        return getSelect('pay', val)
      }
    },
    components: {
      orderModal,
      personal,
      searchBar
    },
    mounted () {
      this.getUserID();
    },
    methods: {
      getOrderLists: function(val) {
        this.loading= true;
        this.loaded= false;
        var body = {
          'search': this.search, // 订单ID，患者手机号，患者姓名
          'id': '',
          'doc_id': this.userID,
          'user_id': '',
          'org_id': '',
          'product_type': '',
          'trial_type': '',
          'page':{
            "current": val,
            "limit":10,
          }
        };
        this.$http.post(GLOBAL.ORDER+"list",body,
        Vue.http.options.emulateJSON = false)
        .then((res)=>{
          this.loading= false;
          this.loaded= true;
          this.orderLists = res.data.data;
          this.totalNum = res.data.total_count;
        })
      },
      getUserID: function(){
        this.$http.get('/api/Users/me')
        .then((res) => {
            this.userID = res.data.account_uuid;
            this.getOrderLists();
          }
        );
      },
      handleClick: function(newIndex){
        this.curPage = newIndex;
        this.getOrderLists(newIndex);
      },
      searchList: function(val) {
        this.search = val;
        this.getOrderLists();
      },
      openCase: function(id){
        this.showModal=id;
      },
      closeCase: function(val){
        this.showModal=false;
        this.showDiag=false;
        if(val){
          this.getOrderLists();
        }
      },
      // 路由到患者信息
      toCaseInfo (id,order) {
        this.$router.push({name: 'orderInfo', params: {id: id}, query:{order:order}});
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
  .addStyle
    font-weight bold
    text-decoration underline
</style>
