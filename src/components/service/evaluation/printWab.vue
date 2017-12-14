<template>
  <div id="wd-Evalreport">
    <div class="wd-loading" v-if="loading">
      正在加载，请稍后......
    </div>


      <div>

      <article class="total print_area">
        <header>
          <h1>测评报告————西部失语症量表（WAB）</h1>
          <h4>六六脑@云平台系统 &nbsp;科室:{{ reportdatas.modifyEmpDepart }} &nbsp;测评人:{{ store.account.name }} &nbsp;评估日期:{{reportdatas.modifyTime | time}}</h4>
        </header>

        <section>
          <h4>基础信息</h4>
          <table class="wd-jcxxtable">
            <thead>

            </thead>
            <tbody>
            <tr>
              <td>姓名</td>
              <td>{{reportdatas.name}}</td>
              <td>联系方式</td>
              <td>{{ caseInfo.telephone }}</td>
            </tr>
            <tr>
              <td>文化</td>
              <td v-if="reportdatas.education==1">文盲</td>
              <td v-if="reportdatas.education==2">小学</td>
              <td v-if="reportdatas.education==3">初中</td>
              <td v-if="reportdatas.education==4">高中</td>
              <td v-if="reportdatas.education==5">专科</td>
              <td v-if="reportdatas.education==6">本科及以上</td>
              <td v-else-if="reportdatas.education==''">未知</td>
              <td>性别</td>
              <td v-if="reportdatas.gender == 1">女</td>
              <td v-else-if="reportdatas.gender == 2">男</td>
              <td v-else>其他</td>
            </tr>
            <tr>
              <td>利手</td>
              <td v-if="reportdatas.handedness==1">左利手</td>
              <td v-else-if="reportdatas.handedness==2">右利手</td>
              <td v-else-if="reportdatas.handedness==3">双利手</td>
              <td v-else>右利手</td>
              <td>年龄</td>
              <td>{{reportdatas.age}}</td>
            </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h4>测评结果</h4>
          <table class="wd-cpjgtable">
            <!--<caption>失语类型：Test</caption>-->

            <thead>
            <tr>
              <th colspan="2">失语类型：{{ tsylx }}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>失语商：{{ tsys }}</td>
              <td>语言商：{{ tyys }}</td>
            </tr>
            <tr>
              <td>操作商：{{ tczs }}</td>
              <td>皮质商：{{ tpzs }}</td>
            </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h4>大项报告</h4>
          <aside class="wd-echart">
              <div id="main" style="width: 500px;height:300px;">123</div>
          </aside>
          <table class="wd-dxbgtable">
            <!--<caption>大项报告得分</caption>-->

            <thead>
            <tr>
              <th>成绩项</th>
              <th>总分</th>
              <th>实际得分</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(result,index) in reportdatasresult">
              <td>{{result.name}}</td>
              <td>{{result.total}}</td>
              <td>{{result.score}}</td>
            </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h4>小项报告</h4>
          <aside class="wd-echart">
              <div id="main2" style="width:500px;height:700px;">123</div>
          </aside>
          <table class="wd-xxbgtable">
            <!--<caption>小项报告得分</caption>-->

            <thead>
            <tr>
              <th>成绩项</th>
              <th>总分</th>
              <th>实际得分</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(result,index) in smallresults">
              <template v-if="result.tag == 1">
                <td style="color:blue;">{{result.name}}</td>
                <td style="color:blue;">{{result.total}}</td>
                <td style="color:blue;">{{result.score}}</td>
              </template>
              <template v-if="result.tag != 1">
                <td>{{result.name}}</td>
                <td>{{result.total}}</td>
                <td>{{result.score}}</td>
              </template>
            </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h4>得分说明</h4>
          <dl class="wd-dfsm-list">
            <dd>1,失语商=(自发言语分数+听理解分数/20+复述分数/10+命名分数/10)*2</dd>
            <dd>2,语言商=听理解分数/10+自发言语分数+复述分数/10+命名分数/10+阅读分数/5+书写分数/5</dd>
            <dd>3,操作商=阅读分数/10+书写分数/10+运用分数/6+结构分数/10</dd>
            <dd>4,皮质商=自发言语分数+听理解分数/10+复述分数/10+命名分数/10+阅读分数/10+书写分数/10+运用分数/6+结构分数/10</dd>
            <dd>5,WAB失语症检查的失语分类标准</dd>
          </dl>
          <table class="wd-dfsmtable">
            <thead>
              <tr>
                <th>失语分类</th>
                <th>流畅性</th>
                <th>听理解</th>
                <th>复述</th>
                <th>命名</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>完全性失语</td>
                <td>0-4</td>
                <td>0-3.9</td>
                <td>0-4.9</td>
                <td>0-6</td>
              </tr>
              <tr>
                <td>Broca失语</td>
                <td>0-5</td>
                <td>4-10</td>
                <td>0-7.9</td>
                <td>0-8</td>
              </tr>
              <tr>
                <td>Wernicke失语</td>
                <td>5-10</td>
                <td>0-6.9</td>
                <td>0-7.9</td>
                <td>0-9</td>
              </tr>
              <tr>
                <td>命名性失语</td>
                <td>5-10</td>
                <td>7-10</td>
                <td>7-10</td>
                <td>0-6</td>
              </tr>
              <tr>
                <td>经皮质混合性失语</td>
                <td>0-4</td>
                <td>0-3.9</td>
                <td>5-10</td>
                <td>0-6</td>
              </tr>
              <tr>
                <td>经皮质运动性失语</td>
                <td>0-4</td>
                <td>4-10</td>
                <td>8-10</td>
                <td>0-8</td>
              </tr>
              <tr>
                <td>经皮质感觉性失语</td>
                <td>5-10</td>
                <td>0-6.9</td>
                <td>8-10</td>
                <td>0-9</td>
              </tr>
              <tr>
                <td>传导性失语</td>
                <td>5-10</td>
                <td>7-10</td>
                <td>0-6.9</td>
                <td>0-9</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section class="wd-suggest">
          <h4>建议<span style="color:red;display:none;" class="showred1">（此处不能为空，且字数不能超过500！）</span></h4>
          <textarea name="" rows="10" placeholder="请输入建议..." maxlength="500" class="suggesttext" disabled>{{ reportdatas.advice }}</textarea>
        </section>

      </article>

      <footer>
        <aside class="wd-print-btn">
          <a href="javascript:void(0);" class="ensure" @click="closeWin()">取消</a>
          <a href="javascript:void(0);" class="print" @click="print()" >打印</a>
        </aside>
        <div class="wd-print-signature">
          <span>测评人签名：_________________</span>
        </div>
      </footer>


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
        curr_1_0_record: {
          userdatas: undefined,
          scoredatas: undefined,
          comment: undefined,
        },
        disabledA:true,
        disabledB:true,
        disabledC:true,

        showEvaluation:false,
        caseInfo:'',

      }
    }, // end of data
    components:{
      recordPage,
      evaluationModal,
    },
    methods: {
      submitEvaluation: function(res) {
        console.log(res)
        if (res.length == 0) {
          alert('請選擇訓練項目');
        } else {
          this.gameData = res;
          this.saveGame = true;
          this.showEvaluation = false;
        }
      },
      openEvaluation:function(){
        this.showEvaluation=true;
      },
      closeEvaluation:function(){
        this.showEvaluation=false;
      },
      submitCase: function(res) {
        if (res.length == 0) {
          console.log('请选择一个量表。')
        } else {
          window.open( 'http://www.baidu.com');
          this.showModal = false;
          this.showConfirm = true;
        }
      },
      confirmCase: function(){
        this.showEval = true;
        this.showConfirm = false;
      },
      gotoScale:function(){
        window.history.back(-1);
      },
      gotoyy:function () {
        this.$router.push({ path: '/doc/cases/evalRecord/'+this.$route.params.uid, });
      },
      gotorz:function () {
        this.$router.push({ path: '/doc/cases/recordDetail/'+this.$route.params.uid});
      },
      getactive:function(index){
          $(".wd-normaltag").removeClass("active");
          $(".wd-normaltag").eq(index).addClass("active");
      },
      canlistreport:function(start=0,end=5){//需要改
        console.log('canlistreport-----------'+start+"===="+end);
        console.log(this.reportLists.slice(start,end));
        // this.canreportlists = this.reportLists.slice(start,end);
        this.canreportlists = this.assessRecords.slice(start, end);
      },
      getnewlistsjian:function () {//左切换标签使用
//        $(".wd-normaltag").removeClass("active");
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
          if(self.assessRecords.length<=5){
            self.listindex=0;
            self.canlistreport(0,self.assessRecords.length);
          }else if(self.assessRecords.length>5){
            $(".wd-normaltag").removeClass("active");//去除切换标签
            if(self.listindex<self.assessRecords.length){
              self.canlistreport(self.listindex,self.listindex+5);
              console.log('初始111---'+self.listindex+"-->"+self.assessRecords.length);

            }else if(self.listindex>=self.assessRecords.length){
              self.listindex =self.listindex-5;
              console.log('初始222---'+self.listindex+"-->"+self.assessRecords.length);

              //self.canlistreport(self.listindex,self.listindex+5);
            }
          }
//        if(self.listindex>0){
//            if(self.assessRecords.length < 3){
//              self.canlistreport(0,self.assessRecords.length);
//            }else if(self.listindex>3 && self.listindex<self.assessRecords.length){
//              self.canlistreport(self.listindex);
//              console.log('小于'+self.listindex);
//            }else if(self.listindex > self.assessRecords.length){
//              self.listindex=self.listindex-self.assessRecords.length;//需要改
//              console.log('大于'+self.listindex);
//              self.canlistreport(self.listindex,self.assessRecords.length);
//            }
//
////          console.log(self.listindex);
//        }else if(self.listindex<=0){
//          self.listindex =0;
//          self.canlistreport(self.listindex);
//          console.log('小于零'+self.listindex);
//        }
      },
      getRecordLists:function(){
          //查看测评报告列表
        var self = this;
        Vue.http({
          method: 'GET',
          url:'/api/Evaluation/getReList',
          params: {
            'id' : self.$route.params.uid,
          }
        }).then(function(res){
          self.loading = false;
          if(res.data.page.total == 0){
            self.showList=0;
          }else{
            self.reportLists = res.data.data;
            self.assessRecords =
              self.assessRecords.concat(res.data.data.map(
                (x)=>
                {
                  return {
                    title: x.scalename,
                    assessTime: x.modifyTime,
                    origin: x,
                    trigger: ((val)=>
                    {
                      self.showList = 1;
                      self.showWAB = 1;
                      self.show_1_0 = 0;
                      self.getRecordDetails(val.id);
                    }).bind(undefined, x),
                  };
                }));
            // if(self.reportLists.length<6){//显示切换标签
            var id = res.data.data[0].id;
            self.reportid = id;
          }
        }).then(function () {
          return self.$http.get('/api/Users/me')
          .then(function (res)
          {
            return res.data;
          })
          .then(function (data)
          {
            return self.$http.post('/api/Evaluation/assess_history', {
              search: '',
              docid: data.account_uuid,
              orguuid: data.org_uuid,
              mrsid: self.$route.params.uid,
            });
          })
          .then(function (res)
          {
            return res.data.data;
          })
          .then(function (list)
          {
            self.assessRecords =
              self.assessRecords.concat(list.map((x)=>
              {
                return {
                  title: x.SCALENAME,
                  assessTime: x.ENDTIME,
                  origin: x,
                  trigger: ((val)=>
                  {
                    self.showList = 1;
                    self.showWAB = 0;
                    self.show_1_0 = 1;
                    const uid = val.PATIENTINFOID;
                    const aid = val.ID;
                    self.$http.post('/api/Evaluation/assess_report', {
                      uid : uid,
                      aid : aid,
                      anon : 0,
                    }).then(function(res){
                      self.curr_1_0_record.userdatas = res.data.data.item.ext_info;
                      self.curr_1_0_record.scoredatas = res.data.data.score;
                      self.curr_1_0_record.comment = res.data.data.scale;
                      // this.getSwiper();
                    });
                  }).bind(undefined, x),
                  };
              }));
            self.assessRecords = self.assessRecords.sort((x, y)=> y.assessTime - x.assessTime);
            if (self.assessRecords.length > 0)
            {
              self.assessRecords[0].trigger();
            }
            if(self.assessRecords.length<6){//显示切换标签
                self.disabledA=false;
            }
            self.canlistreport();//初始化列表
          });
        }).then(function () {
          self.getSwiper();
        });
      },
      getRecordDetails:function(id){
        var self = this;
        self.reportid = id;
        Vue.http({
          method: 'GET',
          url:'/api/Evaluation/detail',
          params: {
            'id': id,
          }
        }).then(
            function(res){
              //每次查詢都需要初始化内容：
              self.chart1=[];self.chart1data=[];self.smallresults=[];self.chart2=[];self.chart2data=[];
               self.reportdatas = res.data.data.info;
               console.log(self.reportdatas);
               var rlength = res.data.data.result.length;
               if(res.data.data.result[3]){
                 self.reportdatasresult = res.data.data.result[3];
               }else if(res.data.data.result[2]){
                 self.reportdatasresult = res.data.data.result[2];
               }else if(res.data.data.result[1]){
                 self.reportdatasresult = res.data.data.result[1];
               }
               //处理result信息
              for(var ri in self.reportdatasresult){
                  var datai = self.reportdatasresult[ri];
                self.chart1.push(self.reportdatasresult[ri].name);
                self.chart1data.push(self.reportdatasresult[ri].score);
                  datai.tag=1;
                self.smallresults.push(datai);
                  for(var rii in datai.sub){
                    self.smallresults.push(datai.sub[rii]);
                    self.chart2.push(datai.sub[rii].name);
                    self.chart2data.push(datai.sub[rii].score);
                    switch (datai.sub[rii].name){
                      case "流畅性":
                        self.tlcx = (datai.sub[rii].score ? parseInt(datai.sub[rii].score) : 0);
                        break;
                    }
                  }
                  switch(self.reportdatasresult[ri].name){
                    case "自发言语":
                      self.tzfyy = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "听理解":
                      self.ttlj = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "复述":
                      self.tfs = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "命名":
                      self.tmm = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "阅读":
                      self.tyd = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "书写":
                      self.tsx = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "运用":
                      self.tyy = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                    case "结构":
                      self.tjg = (self.reportdatasresult[ri].score ? parseInt(self.reportdatasresult[ri].score) : 0);
                      break;
                  }
              }
              self.tsys =((self.tzfyy+self.ttlj/20+self.tfs/10+self.tmm/10)*2).toFixed(2);
              self.tyys=(self.ttlj/10+self.tzfyy+self.tfs/10+self.tmm/10+self.tyd/5+self.tsx/5).toFixed(2);
              self.tczs=(self.tyd/10+self.tsx/10+self.tyy/6+self.tjg/10).toFixed(2);
              self.tpzs=(self.tzfyy+self.ttlj/10+self.tfs/10+self.tmm/10+self.tyd/10+self.tsx/10+self.tyy/6+self.tjg/10).toFixed(2);
              self.tttlj = self.ttlj/20;
              self.ttfs = self.tfs/10;
              self.ttmm = self.tmm/10;
              if(self.tlcx>=0 && self.tlcx<=4 && self.tttlj>=3 && self.tttlj<=3.9 && self.ttfs>=0 && self.ttfs <=4.9 && self.ttmm>=0 && self.ttmm<=6){
                self.tsylx="完全性失语";
              }else if(self.tlcx>=0 && self.tlcx<=5 && self.tttlj>=4 && self.tttlj<=10 && self.ttfs>=0 && self.ttfs <=7.9 && self.ttmm>=0 && self.ttmm<=8){
                self.tsylx="Broca失语";
              }else if(self.tlcx>=5 && self.tlcx<=10 && self.tttlj>=0 && self.tttlj<=6.9 && self.ttfs>=0 && self.ttfs <=7.9 && self.ttmm>=0 && self.ttmm<=9){
                self.tsylx="Wernicke失语";
              }else if((self.tlcx>=5 && self.tlcx<=10 && self.tttlj>=7 && self.tttlj<=10 && self.ttfs>=7 && self.ttfs <=10 && self.ttmm>=0 && self.ttmm<=6)){
                self.tsylx="命名性失语";
              }else if((self.tlcx>=0 && self.tlcx<=4 &&self.tttlj>=0 && self.tttlj<=3.9 && self.ttfs>=5 && self.ttfs <=10 && self.ttmm>=0 && self.ttmm<=6)){
                self.tsylx="经皮质混合性失语";
              }else if((self.tlcx>=0 && self.tlcx<=4 && self.tttlj>=4 && self.tttlj<=10 && self.ttfs>=8 && self.ttfs <=10 && self.ttmm>=0 && self.ttmm<=8)){
                self.tsylx="经皮质运动性失语";
              }else if((self.tlcx>=5 && self.tlcx<=10 && self.tttlj>=0 && self.tttlj<=6.9 && self.ttfs>=8 && self.tfs <=10 && self.ttmm>=0 && self.ttmm<=9)){
                self.tsylx="经皮质感觉性失语";
              }else if((self.tlcx>=5 && self.tlcx<=10 && self.tttlj>=7 && self.tttlj<=10 && self.ttfs>=0 && self.ttfs <=6.9 && self.ttmm>=0 && self.ttmm<=9)){
                self.tsylx="传导性失语";
              }else {
                self.tsylx="";
              }
              //处理result信息结束
            }
          ).then(function () {
          self.uid = self.$route.params.uid;
          self.showCharts();
        })
      },
      showCharts: function(){
          var self =this;
        //echarts开始
        // 基于准备好的dom，初始化echarts实例
        var myChart = eChart.init(document.getElementById('main'));
        var option = {
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            containLabel: true,
            y2:50
          },
          xAxis : [
            {
              axisLabel: {
                interval:0,//横轴信息全部显示
                rotate: 45,
              },
              type : 'category',
              data: self.chart1,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              min: 0,
              type : 'value',
              name: '分项结果'
            }
          ],
          series : [
            {
              name:'分项结果',
              type:'bar',
              barWidth: '60%',
              // data:[10, 52, 200, 334, 390, 330, 220]
              data: self.chart1data,
              markLine : {
                data : [
                  {
                    name: '良好',
                    yAxis: 70,
                    lineStyle:{
                      normal:{
                        color:'green'
                      }
                    }
                  },
                  {
                    name: '中下',
                    yAxis: 25,
                    lineStyle:{
                      normal:{
                        color:'red'
                      }
                    }
                  },
                ]
              }
            }
          ]
        };
        //-----------------------------------------------------------------------

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


        //第二张图
        var myChart2 = eChart.init(document.getElementById('main2'));

        // 指定图表的配置项和数据

        var option2 = {
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            containLabel: true,
            y2:50
          },
          xAxis : [
            {
              axisLabel: {
                interval:0,//横轴信息全部显示
              },
              type : 'value',
            },

          ],
          yAxis : [
            {
              type : 'category',
              axisLine : {onZero: false},
              data : self.chart2,
            }
          ],
          series : [
            {
              type:'line',
              smooth:true,
              data: self.chart2data,
            }
          ]
        };
        //-----------------------------------------------------------------------
        // 使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option2);
        //echarts结束
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
      this.getRecordDetails(this.$route.params.reportid);
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
