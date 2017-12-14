<template>
  <div id="caseOrder" style='height: 100%'>
    <p class="u-loading" v-if="loading">正在加载，请稍候......</p>
    <div class="m-result" v-if="loaded">
      <div class="noOrder" v-if="totalNum==0">
        <span>当前还没有订单，点击添加</span>
        <button class="button" @click="openOrder" style="background-color: #0a81e5">新建订单</button>
      </div>
      <div v-else class="showOrder">
        <div width="100%" class="newOrdBtn">
          <mu-raised-button label="新建订单" class="button" @click="openOrder" style="background-color: #1bbe9f;" />
        </div>
        <mu-table :height="tableH" :fixedFooter="true" :selectable="false" :showCheckbox="false">
          <mu-thead slot="header">
            <mu-tr>
              <mu-th width="20%">订单ID</mu-th>
              <mu-th width="30%">开单信息</mu-th>
              <mu-th width="35%">订单信息</mu-th>
              <mu-th width="15%">操作</mu-th>
            </mu-tr>
          </mu-thead>
          <mu-tbody v-if="orderLists.length>0">
            <mu-tr v-for="(order,index) in orderLists" style="height:90px;">
              <mu-td width="20%">
                <span><a>{{order.id}}</a></span>
              </mu-td>
              <mu-td width="30%">
                <span><a>{{order.doc_name}}，{{order.add_time | date}}</a></span>
              </mu-td>
              <mu-td width="35%">
                <span><a>￥{{order.order_total_fee}}，{{order.order_use_start_time | date}}，{{order.order_days}}天，{{order.order_status | payed}}</a></span>
              </mu-td>
              <mu-td width="15%">
                <router-link :to="{name:'orderInfo', params:{id: order.user_id}, query:{order:order}}">查看详情</router-link>
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
      </div>
      <!-- <proModal v-if="showCreate" :caseList="caseInfo" @caseCreate="caseCreate" @close="showCreate=false"></proModal> -->
      <orderModal v-if="showCreate" :caseTrans="caseInfo" :caseId="$route.params.id" @close="closeCase"></orderModal>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import orderModal from '../../order/orderModal.vue'
  import {getSelect,date2Str} from '../../../../assets/js/common.js'

  export default ({
    props: ['caseInfo'],
    data() {
      return {
        showModal: false,
        showCreate: false,
        //数据加载中的标识
        loading: false,
        //数据加载完毕的标识
        loaded: true,
        select: GLOBAL.selelctOption,
        orderLists: [],
        curPage: 1,
        totalNum: 0,
      }
    },
    computed: {
      sex: function() {
        return getSelect('gender', this.caseInfo.gender)
      },
      tableH: function(){
        return (document.body.clientHeight - 320)+'px';
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
    created() {
      this.fetch(this.curPage)
    },
    components:{
      orderModal
    },
    methods: {
      fetch: function(val) {
        this.loading= true;
        this.loaded= false;
        var body = {
          'search': '', // 订单ID，患者手机号，患者姓名
          'id': '',
          'doc_id': '',
          'user_id': this.$route.params.id,
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
          console.log(res)
          this.orderLists = res.body.data;
          this.totalNum = res.body.total_count;
          this.loading= false;
          this.loaded= true;
        })
      },
      openOrder: function(){
        this.showCreate = true;
      },
      handleClick: function(newIndex){
        this.curPage = newIndex;
        this.fetch(newIndex);
      },
      caseCreate: function(){
        this.showCreate = false;
        this.fetch();
      },
      closeCase: function(val){
        this.showCreate=false;
        if(val){
          this.fetch();
        }
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"
  @import "../../../../assets/css/table.styl"

  #caseOrder
    position absolute
    top 161px
    left $second-menu-width
    right 0
    display flex
    flex-direction column
    flex-grow 1
  .noOrder
    padding 30px 0 0 40px
    span
      display block
      margin-bottom 20px
      color #999
  .showOrder
    text-align center
  .newOrdBtn
    height 60px
    display flex
    justify-content flex-end
    align-items center
    padding-right 40px
    background-color $base-bgcolor
    border-bottom 1px solid #eee
</style>
