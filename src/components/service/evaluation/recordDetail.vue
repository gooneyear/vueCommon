<template>
  <div class="rightContent">
    <div class="m-loading" v-if="loading"></div>
    <div class="m-loaded" v-else>
      <div class="m-hasNoResult" v-if="showList==0">
        <div class="noDiag" >
          <span>当前还没有记录，点击测评</span>
          <router-link :to="{name:'evaluation', params:{id: 0}}">
            <button class="button" @click="showModal = true" style="background-color: #1bbe9f">现场测评</button>
          </router-link>
        </div>
      </div>
      <div class="m-hasResult" v-else>
        <div class="report">
      <!--<div class="tagsplit">-->
        <!--<a href="javascript:void(0);" @click="gotoyy" class="u-tag">言语</a>-->
        <!--<a href="javascript:void(0);" @click="gotorz" class="u-tag cur">认知</a>-->
      <!--</div>-->
      <!--Start轮播-->
      <!--<div class="container">-->
        <!--<div class='row'>-->
          <!--<div class="pc-slide">-->
            <!--<div class="preview">-->
              <!--<a class="arrow-left" href="javascript:void(0)" :class="{'fn-hide': arrow_flag}"></a>-->
              <!--<a class="arrow-right" :class="{'fn-hide': arrow_flag}" href="javascript:void(0)"></a>-->
              <!--<div class="swiper-container">-->
                <!--<div class="swiper-wrapper">-->
                  <!--<template v-for="(ret,index) in retlists">-->
                    <!--<div class="swiper-slide swiper-slide-visible " :class="{'active-nav':index==0}">-->
                      <!--<a @click="gotoretdetail(ret.PATIENTINFOID,ret.ID)" style="display:block;">{{ ret.SCALENAME }}</a>-->
                      <!--<a @click="gotoretdetail(ret.PATIENTINFOID,ret.ID)">{{ ret.ENDTIME | time }}</a>-->
                    <!--</div>-->
                  <!--</template>-->

                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--End轮播-->
          <!--轮播-->
          <header>

            <div>
          <span>
            <a href="javascript:void(0);" class="wd-reporttag wd-normaltag" v-for="(ret,index) in canreportlists" @click="getactive(index)" :class="{'active':index==0}">
              <span @click="gotoretdetail(ret.PATIENTINFOID,ret.ID)">{{ret.ENDTIME | time}}</span>
              <span @click="gotoretdetail(ret.PATIENTINFOID,ret.ID)" :title="ret.SCALENAME">{{ret.SCALENAME}}</span>
            </a>
          </span>

              <a href="javascript:void(0);" class="wd-reporttag" v-show="disabledA">
                <span class="wd-reporttag-left" @click="getnewlistsjian" v-show="disabledB"><</span>
                <span class="wd-reporttag-right" @click="getnewlistsadd" v-show="disabledC">></span>
              </a>

            </div>
          </header>
          <!--轮播-->
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
              <!--<td>{{userdatas.user_sno}}</td>-->
              <!--<th>病  历  号：</th>-->
              <!--<td>{{uid}}</td>-->
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
              <!--<td v-else-if="userdatas.user_education==''">未知</td>-->
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
              <th>生　　日：</th>
              <td>{{userdatas.user_birthday}}</td>
            </tr>
            <!--<tr>-->
              <!--<th>既往病史：</th>-->
              <!--<td>{{userdatas.pastmedicalhistory}}</td>-->
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
                  <!--<td>{{ item.name.split('-')[0].trim() }}{{ item.name.split('-').length }}</td>-->
                <td v-if="item.name.split('-').length>2">{{ item.name.split('-')[0].trim() }}-{{ item.name.split('-')[1].trim() }}</td>
                <td v-else>{{ item.name.split('-')[0].trim() }}</td>
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
        </div>
      </div>

      <div id="report-footer">
        <button @click="print()" style="cursor:pointer;">打印</button>
        <button @click="gotoScale()" style="cursor:pointer;">确定</button>
      </div>


    </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Swiper from '../../../assets/js/swiper.js';
//  var store = require('../../app/store.js');
//  console.log(store.account)
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
  export default {
    name: 'recordDetail',
    data(){
      return {
//        docid:store.account.account_uuid,
//        orgid:store.account.org_uuid,
        uid:this.$route.params.id,
        aid:1,
        anon : 0,
        userdatas:'',
        scoredatas:'',
        comment:'',
        store:'',
        retlists:'',
        lists: '',
        arrow_flag:true,
        //正在加载
        loading: true,
        //加载完毕后，0为无数据，其他为有数据
        showList:1,
        listindex:0,
        canreportlists:[],
        disabledA:true,
        disabledB:true,
        disabledC:true,
      }
    },
    watch:{
      aid: function(){
          var temp= '/doc/cases/recordDetail/'+this.uid + '/' +  this.aid;
        this.$router.push({ path: temp});
      }
    },
    components: {

    },
    methods : {
      print:function(){
        window.print();
      },
      gotoScale:function () {
        this.$router.push({ path: '/doc/evaluation/'});
      },
      gotoretdetail:function (sid,aid) {
          this.uid=sid,
          this.aid=aid,
          this.$router.push({ path: '/doc/cases/recordDetail/'+sid+'/'+aid});
          this.gotoretdetail2();
      },
      gotoyy:function () {
        this.$router.push({ path: '/doc/cases/evalRecord/'+this.uid });
      },
      gotorz:function () {
        this.$router.push({ path: '/doc/cases/recordDetail/'+this.uid});
      },
      getactive:function(index){
        $(".wd-normaltag").removeClass("active");
        $(".wd-normaltag").eq(index).addClass("active");
      },
      canlistreport:function(start=0,end=5){//需要改
        console.log('canlistreport-----------'+start+"===="+end);
        console.log(this.retlists.slice(start,end));
        this.canreportlists = this.retlists.slice(start,end);
      },
      getnewlistsjian:function () {//左切换标签使用
        var self = this;
        self.listindex -=5;
        if(self.listindex<=0){
          self.listindex=0;
          self.canlistreport(0,5);
        }else{
          self.canlistreport(self.listindex,self.listindex+5);
        }
      },
      getnewlistsadd:function () {//右切换标签使用
        var self = this;
        self.listindex +=5;
        console.log('初始000--'+self.listindex);
        console.log('donum' + 5);
        if(self.retlists.length<=5){
          self.listindex=0;
          self.canlistreport(0,self.retlists.length);
        }else if(self.retlists.length>5){
          if(self.listindex<self.retlists.length){
            self.canlistreport(self.listindex,self.listindex+5);
            console.log('初始111---'+self.listindex+"-->"+self.retlists.length);

          }else if(self.listindex>=self.retlists.length){
            self.listindex =self.listindex-5;
            console.log('初始222---'+self.listindex+"-->"+self.retlists.length);

            //self.canlistreport(self.listindex,self.listindex+5);
          }
        }
      },
      getDetails:function(listPromise){
        if (undefined === listPromise)
        {
          listPromise = this.lists;
        }
        var self = this;
        listPromise.then(function(data){
          self.loading= false;
          if(data.length==0){
            self.showList=  0;
          }else{
            self.retlists = data;
            if(self.retlists.length<6){//显示切换标签
              self.disabledA=false;
            }
            self.uid = data[0]. PATIENTINFOID,
            self.aid = data[0].ID;
            console.log(self.aid);
            self.showList=  1;
            self.canlistreport();//初始化列表
          }
        }).then(function(){
          self.$http.post('/api/Evaluation/assess_report', {
            uid : self.uid,
            aid : self.aid,
            anon : self.anon,
          }).then(function(res){
            console.log(self.uid,self.aid);
            self.userdatas = res.data.data.item.ext_info;
            self.scoredatas = res.data.data.score;
            self.comment = res.data.data.scale;
            console.log(this.uid,this.scoredatas);
            this.getSwiper();
          });
        });
      },
      gotoretdetail2:function(){
        var self = this;
          self.$http.post('/api/Evaluation/assess_report', {
            uid : self.uid,
            aid : self.aid,
            anon : self.anon,
          }).then(function(res){
            console.log(self.uid,self.aid);
            self.userdatas = res.data.data.item.ext_info;
            self.scoredatas = res.data.data.score;
            self.comment = res.data.data.scale;
            console.log(this.uid,this.scoredatas);
          });
      },
      getReLists:function(){
          var self= this;
          console.log('getReLists' +  this.store);
          function getLists () {
            return Promise.resolve(self.store).then(function (data) {
              return self.$http.post('/api/Evaluation/assess_history', {
                search: '',
                docid: data.account_uuid,
                orguuid: data.org_uuid,
                mrsid: self.uid,
              }).then(function (res) {
                return res.data.data;
              })
              .then(((list)=>
              {
                return list;
              }));
            });
          }
          return getLists();
      },
      getSwiper:function () {
        var previewSwiper = new Swiper('.preview .swiper-container', {
          visibilityFullFit: true,
          slidesPerView: 'auto',
          onlyExternal: true,
          onSlideClick: function() {
            updateNavPosition1(previewSwiper.clickedSlideIndex)
          }
        });
        if((typeof previewSwiper.slides)=='undefined'){
          return;
        }
        if(previewSwiper.slides.length > 6){
          this.arrow_flag = false;
        }
        $('.preview .arrow-left').on('click', function(e) {
          e.preventDefault()
          if (previewSwiper.activeIndex == 0) {
            updateNavPosition1(previewSwiper.slides.length - 1);
            return
          }
          updateNavPosition1(previewSwiper.activeIndex-1)
        })
        $('.preview .arrow-right').on('click', function(e) {
          e.preventDefault();
          if (previewSwiper.activeIndex == previewSwiper.slides.length - 1) {
            updateNavPosition1(0);
            return
          }
          updateNavPosition1(previewSwiper.activeIndex+1)
        })
        function updateNavPosition1(index){
          $('.preview .active-nav').removeClass('active-nav')
          var activeNav = $('.preview .swiper-slide').eq(index).addClass('active-nav')
          if (!activeNav.hasClass('swiper-slide-visible')) {
            if (index > previewSwiper.activeIndex) {
              var thumbsPerNav = Math.floor(previewSwiper.width / activeNav.width()) - 1
              previewSwiper.swipeTo(index - thumbsPerNav)
            } else {
              previewSwiper.swipeTo(index)
            }
          }
          previewSwiper.activeIndex= index;
          console.log(index, previewSwiper.activeIndex)
        }
      }
    },
    beforeCreate(){
    },
    created(){

      var self = this;
      function aaa(){
        return self.$http.get('/api/Users/me').then(
          function (res) {
            return res.data;
          }
        )
      }
      this.store= aaa();
      console.log(this.store);

    },
    mounted(){
      this.getDetails(this.getReLists());
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl"
  @import "../../../assets/css/variable.styl"
  @import "../../../assets/css/swiper.css"

  .rightContent
    position absolute
    left 231px
    top $top-height
    right 0
    height calc(100% - 101px)
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
  a.active
    font-weight bold
</style>
