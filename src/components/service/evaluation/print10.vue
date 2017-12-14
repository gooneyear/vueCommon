<template>
  <div id="wd-Evalreport">
    <div class="wd-loading" v-if="loading">
      正在加载，请稍后......
    </div>

    <div>
        <header>
          <h2>认知测评</h2>
          <h4>{{ comment.SCALENAME }}</h4>
        </header>

        <div id="report-content">
          <div id="content-basic">
            <h4>基础信息</h4>
            <table>
              <!--<tr>-->
                <!--<th>编　　号：</th>-->
                <!--<td>{{curr_1_0_record.userdatas.user_sno}}</td>-->
                <!--<th>病  历  号：</th>-->
                <!--<td>{{curr_1_0_record.uid}}</td>-->
              <!--</tr>-->
              <tr>
                <th>姓　　名：</th>
                <td>	{{userdatas.user_realname}}</td>
                <th>联系方式：</th>
                <td>{{userdatas.user_tel}}</td>
              </tr>
              <tr>
                <th>文　　化：</th>
                <td v-if="userdatas.user_education==1">文盲</td>
                <td v-else-if="userdatas.user_education==2">小学</td>
                <td v-else-if="userdatas.user_education==3">初中</td>
                <td v-else-if="userdatas.user_education==4">高中</td>
                <td v-else-if="userdatas.user_education==5">专科</td>
                <td v-else-if="userdatas.user_education==6">本科及以上</td>
                <td v-else-if="userdatas.user_education==''">其他</td>
                <td v-else>其他</td>
                <!--<td v-else-if="curr_1_0_record.userdatas.user_education==''">未知</td>-->
                <th>性　　别：</th>
                <td v-if="userdatas.user_gender == 1">女</td>
                <td v-else-if="userdatas.user_gender == 2">男</td>
                <td v-else>其他</td>
              </tr>
              <tr>
                <th>利　　手：</th>
                <td v-if="userdatas.user_hands==1">左利手</td>
                <td v-else-if="userdatas.user_hands==2">右利手</td>
                <td v-else-if="userdatas.user_hands==3">双利手</td>
                <td v-else>右利手</td>
                <th>生　　日：</th>
                <td>{{userdatas.user_birthday}}</td>
              </tr>
              <!--<tr>-->
                <!--<th>既往病史：</th>-->
                <!--<td>{{curr_1_0_record.userdatas.pastmedicalhistory}}</td>-->
                <!--<td></td>-->
                <!--<td></td>-->
              <!--</tr>-->
            </table>
          </div>

          <div id="content-detail">
            <h4>测评结果</h4>
            <table>
              <tr>
                <th>项目</th>
                <th>总分</th>
                <th>实际得分</th>
              </tr>

              <tr v-for="item in scoredatas">
                <template v-if="item.name != '无类别 - 无类别'">
                  <!--<template v-if="item.name.substr(-1,7) ==' -MMSE' ">-->
                    <td>{{ item.name.split('-')[0].trim() }}</td>
                  <!--</template>-->
                  <td>{{ item.totalscore }}</td>
                  <td>{{ item.score }}</td>
                </template>
              </tr>
            </table>
            <div id="score-declare">
              <h5>得分说明</h5>
              <p v-html="comment.RESULTEXPLAIN"></p>
              <span style="text-align:left;">请在打印页面勾选上“背景图片”，如果没有看到这个设置，请点击“+更多设置”</span>
            </div>
            <section class="wd-suggest">
              <!--<h4 style="text-align: left;border-left: 10px solid #1e90ff;padding-left: 10px;background-color: #fff;color:#444;">建议<span style="color:red;display:none;" class="showred1">（此处不能为空，且字数不能超过500！）</span></h4>-->
              <!--<textarea name="" rows="10" placeholder="请输入建议..." class="suggesttext">{{ reportdatas.advice }}</textarea>-->
            </section>
          </div>
        </div>
      <div class="wd-print-signature">
        <span>测评人签名：_________________</span>
      </div>

        <div id="report-footer"  class="wd-print-btn">
          <button @click="print()" style="cursor:pointer;">打印</button>
          <button @click="closeWin()" style="cursor:pointer;">取消</button>
        </div>

      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import recordPage from '../evaluation/recordPage.vue'
import evaluationModal from '../case/evalRecord/evaluationModal.vue'
import eChart from 'echarts'
var store = require('../../../app/store.js');
import Swiper from '../../../assets/js/swiper.js';
  //自定义过滤器，过滤毫秒为日期格式
  Vue.filter('time',
    function(value) {
      var date = new Date(parseInt(value)*1000);
      var Y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        H = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
      if (m < 10) {
        m = '0' + m;
      }
      if (d < 10) {
        d = '0' + d;
      }
      if (H < 10) {
        H = '0' + H;
      }
      if (i < 10) {
        i = '0' + i;
      }
      if (s < 10) {
        s = '0' + s;
      }
      var t = Y + '-' + m + '-' + d;
      return t;
    });
  //end过滤器
  export default ({
    data() {
      return {
        showEval: false,
        showModal: false,
        showConfirm: false,
        showList:1,
        uid :'' ,
        reportdatas:'',
        reportdatasresult:'',
        smallresults:[],
        samllchartresults:[],
        chart1:[],
        chart1data:[],
        chart2:[],
        chart2data:[],
//        reportLists:reportdas,
        reportLists:'',
        store:store,
        tsys:'',
        tsylx:'',
        tczs:'',
        tyys:'',
        tpzs:'',
        tzfyy:'',
        ttlj:'',
        tfs:'',
        tmm:'',
        tyd:'',
        tsx:'',
        tyy:'',
        tjg:'',
        tttlj:'',
        ttfs:'',
        ttmm:'',
        reportid:'',
        //是否显示左右切换箭头
        arrow_flag:true,
        //正在加载
        loading: false,
        //已经加载完毕
        loaded: false,
        listindex:0,
        canreportlists:[],
        assessRecords: [],
        showWAB: 0,
        show_1_0: 0,
//        curr_1_0_record: {
//          userdatas: undefined,
//          scoredatas: undefined,
//          comment: undefined,
//        },
        userdatas: undefined,
        scoredatas: undefined,
        comment: undefined,
        disabledA:true,
        disabledB:true,
        disabledC:true,

        showEvaluation:false,

      }
    }, // end of data
    components:{
      recordPage,
      evaluationModal,
    },
    methods: {
      get10Details(){
        var self = this;
        self.$http.post('/api/Evaluation/assess_report', {
          uid : self.$route.params.uid,
          aid : self.$route.params.aid,
          anon : 0,
        }).then(function(res){
          console.log('----')
          console.log(res.data.data.scale)
          self.userdatas = res.data.data.item.ext_info;
          self.scoredatas = res.data.data.score;
          self.comment = res.data.data.scale;
          self.scaleN = res.data.data.scale.SCALENAME;
          // this.getSwiper();
        });
      },
      print:function(){
          window.print();

      },
      getUserInfo: function() {
        var self = this;
        Vue.http({
          method: 'GET',
          url: '/api/Cases/detail',
          params: {
            'id': self.$route.params.uid
          }
        })
          .then(
            function(res){
              self.caseInfo = res.data.data;
              console.log(self.caseInfo)
            }
          )
      },
      closeWin:function () {
        if
        (confirm("您确定要关闭本页吗？")){
          window.opener=null;
          window.open('','_self',"");
          window.close();
        }
      }
    }, // end of methods
    beforeMount(){
//      window.print();
    },
    mounted(){
      this.getUserInfo();
      this.get10Details();
    },
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl"
  @import "../../../assets/css/variable.styl"
  @import "../../../assets/css/swiper.css"
  #wd-Evalreport
    background-color #fff
    font-size 14px
  .wd-chosetag
    display inline-block
    width 100px
    height 50px
    line-height 50px
    text-align center
    color #000
    background-color #ccc
    margin-bottom 4px
  .wd-choseyytag
    color #fff
    background-color dodgerblue
  .wd-reporttag
    display inline-block
    width 100px
    height 60px
    line-height 60px
    background-color #ccc
    margin-right 5px
  .wd-reporttag span
    display inline-block
    text-align center
    width 100px
    height 30px
    line-height 30px
    float left
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  span.wd-reporttag-left,span.wd-reporttag-right
    display inline-block
    width 50px
    height 60px
    line-height 60px
    text-align center
    float left
  article.total
    width 100%
    /*background-color #cccccc*/
    text-align center
  article.total header h1
    color dodgerblue
  section h4
    text-align left
    border-left 10px solid dodgerblue
    padding-left 10px
  table.wd-jcxxtable tr td:nth-child(odd)
    background-color rgb(230,242,252)
  table.wd-jcxxtable tr td:nth-child(even)
    background-color #eee
  table.wd-jcxxtable tr
    border-bottom 1px solid #fff
    height 50px
  table.wd-jcxxtable tr td
    width 25%
    text-align center
    padding 0
    height 20px

  table.wd-cpjgtable th
    background-color rgb(230,242,252)
  table.wd-cpjgtable tr:nth-child(odd)
    background-color #fff
  table.wd-cpjgtable tr:nth-child(even)
    background-color #eee
  table.wd-cpjgtable tr
    border-bottom 1px solid #fff
    height 50px
  table.wd-cpjgtable tr td
    width 50%
    text-align center
    padding 0
    height 20px

  aside.wd-echart
    min-height 300px
  table.wd-dxbgtable th
    background-color rgb(230,242,252)
  table.wd-dxbgtable tr:nth-child(odd)
    background-color #fff
  table.wd-dxbgtable tr:nth-child(even)
    background-color #eee
  table.wd-dxbgtable tr
    border-bottom 1px solid #fff
    height 50px
  table.wd-dxbgtable tr td
    width 33%
    text-align center
    padding 0
    height 20px

  aside.wd-echart
    min-height 300px
  table.wd-xxbgtable th
    background-color rgb(230,242,252)
  table.wd-xxbgtable tr:nth-child(odd)
    background-color #fff
  table.wd-xxbgtable tr:nth-child(even)
    background-color #eee
  table.wd-xxbgtable tr
    border-bottom 1px solid #fff
    height 50px
  table.wd-xxbgtable tr td
    width 33%
    text-align center
    padding 0
    height 20px

  dl.wd-dfsm-list
    text-align left
  dl.wd-dfsm-list dd
    display inline-block
    height 30px
    line-height 30px
  table.wd-dfsmtable th
    background-color rgb(230,242,252)
  table.wd-dfsmtable tr:nth-child(odd)
    background-color #fff
  table.wd-dfsmtable tr:nth-child(even)
    background-color #eee
  table.wd-dfsmtable tr
    border-bottom 1px solid #fff
    height 50px
  table.wd-dfsmtable tr td
    width 20%
    text-align center
    padding 0
    height 20px

  section.wd-remark textarea,section.wd-suggest textarea
    width 99%
  section.wd-remark em,section.wd-suggest em
    color red
  footer
    margin-bottom 30px
  footer aside
    text-align center
    margin-top 10px
  footer aside a
    cursor pointer
    display inline-block
    width 100px
    height 40px
    line-height 40px
    color #fff
    border-radius 20px
  a.ensure
    background-color rgb(10,129,229)
  a.print
    margin-left 30px
    background-color #0a81e5
  div.wd-print-signature
    display none
    margin-top 10px
    text-align right
  div.wd-print-signature span
    margin-right 30px
  a.active
    font-weight bold

  /*    打印样式*/
  @media print {
    div.wd-print-signature{
      display:block !important;
    }
    .wd-print-btn{
      display:none!important;
    }
  }
/**
  1.0 量表样式开始
  */
  .report
    width 100%
    /*margin 0 auto*/
    text-align center
    margin-bottom 170px
  .report-content
    background #eee
  #content-basic
    padding-bottom 10px
  #content-basic h4,#content-detail h4
    color #fff
    text-align center
    display block
    width 150px
    background-color #0a81e5
  header
    color #0a81e5
  #content-basic
    border-bottom 2px solid #0a81e5
  table
    color #000
  table tr:nth-child(odd)
    background-color rgb(230,230,230)
  table tr:nth-child(even)
    background-color #fff
  table tr th:nth-child(even),table tr td:nth-child(even)
    border-left 1px solid #ccc
    border-right 1px solid #ccc
  table tr:hover
    background-color #C8EFFF
  table tr th
    color #000
  table tr td
    text-align center
    padding 5px 0
  #content-detail table
    border 1px solid #0a81e5
  #score-declare
    background-color #eee
    padding 10px 0
    margin 10px 0
  #score-declare p
    text-align left
    display block
  #score-declare span
    color #fd6f49
    display block
  #report-footer button
    float right
    margin-right 30px
    background-color #0a81e5
  #report-footer:after
    content ""
    float right
    clear both
    margin-bottom 50px
  .pc-slide {
    margin: 0 auto;
  }
  .preview {
    width: 100%;
    margin-top: 10px;
    position: relative;
  }
  .preview .swiper-container {
    /*width: 430px;*/
    height: 82px;
    margin-left: 35px;
    margin-right: 35px;
  }
  .preview .swiper-slide {
    width: 20%;
    height: 58px;
    /*line-height:60px;*/
    padding:10px 0;
    box-sizing:border-box;
    border:1px solid transparent;
    cursor:pointer;
  }
  .preview .arrow-left, .preview .arrow-right{
    position: absolute;
    top: 50%;
    margin-top: -19px;
    width: 9px;
    height: 18px;
    z-index: 10;
  }
  .preview .arrow-left {
    background: url("../../../assets/img/feel3.png") no-repeat left top;
    left: 10px;
  }
  .preview .arrow-right {
    background: url("../../../assets/img/feel4.png") no-repeat left bottom;
    right: 10px;
  }
  .preview img {
    padding: 1px;
  }
  .preview .active-nav {
    font-weight: bold;
  }
  .preview .swiper-wrapper{
    width: 100% !important;
  }
  .tagsplit{
    height:60px;
    line-height:60px;
    margin-bottom:10px;
  }
  .u-tag{
    color:#000;
    float:left;
    display:inline-block;
    width:100px;
    height:60px;
  }
  .u-tag.cur{
    background-color:#0a81e5;
    color:#fff;
  }
  .fn-hide{
    display:none
  }
  #content-detail table tr:nth-last-child(1){
    font-weight: bold;
    color:#0a81e5!important;
  }
  header
    text-align left
  .wd-chosetag
    display inline-block
    width 100px
    height 50px
    line-height 50px
    text-align center
    color #000
    background-color #ccc
    margin-bottom 4px
  .wd-choseyytag
    color #fff
    background-color dodgerblue
  .wd-reporttag
    display inline-block
    width 100px
    height 60px
    line-height 60px
    background-color #eee
    margin-right 5px
  .wd-reporttag span
    display inline-block
    text-align center
    width 100px
    height 30px
    line-height 30px
    float left
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  span.wd-reporttag-left,span.wd-reporttag-right
    font-size 20px
    display inline-block
    width 50px
    height 60px
    line-height 60px
    text-align center
    float left
  span.wd-reporttag-left:hover,span.wd-reporttag-right:hover
    background-color #999
    font-weight bold
  .advice
    box-sizing:border-box;
    border 1px solid #0a81e5
    border-radius 0
    width 100%
    height 100px
    margin-bottom 10px
/**
  1.0 量表样式结束
  */

</style>
