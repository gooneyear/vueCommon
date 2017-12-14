<template>
  <div class="rightContent">
    <div style="position:relative;">
      <div id="footerBar">
        <div class="shwogbar">{{thisTagid+1}}/{{thisQlen}}</div>
        <div class="progress">
          <span v-if="thisTagid+1 < thisQlen" class="blue" :style="'width:'+parseInt((thisTagid)*100/thisQlen)+'%'"><span></span></span>
          <span v-if="thisTagid+1 == thisQlen" class="blue" :style="'width:'+100+'%'"><span></span></span>
        </div>
      </div>
    <div class="assess question">
    <header>
      <!--<button class="blue" id="print-pic" onclick="print()" style="left:10px;right:auto;">打印图片</button>-->
      <h2><a>$</a>{{ scaledatas.SCALENAME }}</h2>
      <template v-if="czsm!=''">
        <button type="button" id="actBtn" @click="actShow = !actShow">操作说明</button>
      </template>

      <!--<button class="blue" onclick="stop()">终止测试</button>-->

    </header>

    <main id="qMain">
      <form method='post' id='theform' :action="accessendurl">
        <div id="memo"></div>
        <div id="qlist">
          <div class='questions step'>
          <template v-for="q in questions">


            <div class="content clearfix" :class="{'on': thisQid==q['ID']}">
              <div id="actions">
                <!--<div class="op up" @click="actShow = !actShow">操作说明</div>-->
                <div v-show="actShow" class="showBox" :id="'memo' + q['ID']" >{{q['MEMO']}}</div>
              </div>

              <template v-if="q['TESTFACTORID'] != 1">
                <div class="sontag">{{ q['ptestfactor']['name'] }}<span><em v-if="q['ctestfactor'] !='' ">{{ q['ctestfactor']['name'] }}-</em><em v-if="q['ctestfactor'] !='' ">总分{{q['ctestfactor']['score']}}</em><em v-else>总分{{ q['ptestfactor']['score'] }}</em></span></div>
              </template>
              <div>{{ q['TITLE'] }}</div>
              <span v-html="q['CONTENT']"></span>
              <div style="font-size:28px;clear:both;" class="anstag">答案:</div>
              <div v-if="q['QUESTYPE'] == '2'" class="ansbar">
                <template v-for="(answer,dataobj) in q.answers">
                  <label class='radio'>
                    <input :name="'questions['+q['ID']+']['+dataobj+']'" type='number' style="border:1px solid #ccc;border-radius:1px;" oninput="if(value<0){value = 0;}">
                    <em>{{answer['ANSWERCONTENT']}}</em>
                  </label>
                </template>
              </div>
              <div v-else class="ansbar">
                <div v-if="q['ISMULTISELECT'] == '1'">
                  <template v-for="(answer,dataobj) in q.answers">
                    <label class='radio'>
                      <input :name="'questions['+q['ID']+']['+dataobj+']'" type='checkbox' style="border-radius: 0;" :value="answer['ID']" >
                      <em>{{answer['ANSWERCONTENT']}}</em>
                    </label>
                  </template>
                </div>
                <div v-else class="szgdsb">
                  <template v-for="(answer,dataobj) in q.answers">
                    <label class='radio'>
                      <input :name="'questions['+q['ID']+'][]'" type='radio'  :value="answer['ID']" >
                      <em>{{answer['ANSWERCONTENT']}}</em>
                    </label>
                  </template>
                </div>
              </div>

              <div id="rightans">
                <!--<div class="op up" @click="ansShow = !ansShow">查看正确答案</div>-->
                <div v-show="ansShow" class="showBox" :id="'remark' + q['ID']" >{{q['REMARK']}}</div>
              </div>
            </div>
          </template>
          </div>
        </div>

        <div id="progress">
          <!--<div class="fl">量表进度</div>-->
          <!--<div class="progress fl"><span style="" class="bar"></span></div>-->
          <!--<progress id="prestrip" :value="thisTagid+1" :max="thisQlen"></progress>-->
          <!--<div class="fl"><span id='qcurr'></span>{{thisTagid+1}}/{{thisQlen}}<span id='qcount'></span></div>-->
        </div>


        <div id="changeQ">
          <template v-if="ckda!=''">
          <button type="button" id="ckBtn" @click="ansShow = !ansShow">查看正确答案</button>
          </template>
          <button id="btnP" type="button" :class="{'onBtn': prevBtn==0}" @click='prevQ()'>上一题</button>
          <button id="btnN" type="button" :class="{'onBtn': nextBtn==0}" @click='nextQ()'>下一题</button>
          <button id='btnsubmit' :class="{'onBtn': subBtn==0}" type='submit' @click.prevent="subQ()">提交</button>
        </div>

        <input type='hidden'  :value="thisQid" id="nowqid">
        <input type='hidden'  :value="thisTagid">
        <input type='hidden'  :value="thisQlen">
        <input type='hidden'  :value="parseInt((thisTagid-1)*100/thisQlen)">
        <input type='hidden' id="break"  value="0">
      </form>
    </main>
  </div>


    </div>

    <div class="showBox" v-show="showBox">
      <div class="bacMask"></div>
      <figure class="middleContentConform">
        <figcaption>您本题还没有做！</figcaption>
        <button @click="showBox=false">确定</button>
      </figure>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'startEval',
    data(){
      return {
        questiondatas:'',
        questions:'',
        answers:[],
        accessendurl:'',
        thisQid:0,
        thisQlen:0,
        thisTagid:0,
        prevBtn:0,
        nextBtn:0,
        subBtn:0,
        ansShow:false,
        actShow:false,
        assess:this.$route.query.scaleId,
        anon:0,
        uid:this.$route.query.caseId,
        scaledatas:'',
        scalehave:true,
        czsm:'1',
        ckda:'1',
        showBox:false,
        canSubTag:true,
      }
    },
    methods : {
      getallQuestions : function () {
        var self = this;
        Vue.http({
          method : 'POST',
          url : '/api/Evaluation/assess_start',
          params: {
            'uid' : self.uid,
            'sid' : self.assess,
//            'uid' : '24617868096176150',
//            'sid' : '24622587040493694',
          }
        }).then(function(res){
//          console.log(res.data);
          if(!!res.data){
            self.questiondatas = res.data.data;
            self.scaledatas = self.questiondatas.scale;
            self.questions = self.questiondatas.scale.questions;
            self.thisQid = self.questions[0]['ID'];
            self.thisQlen = self.questions.length;
            self.assess = self.questiondatas.assess;
            self.uid=self.questiondatas.uid;
//          self.accessendurl = '/api/Evaluation/assess_end/'+'24617868096176150'+'/'+self.assess+'/'+self.anon;
            //数组形式传递
            for( var iii in self.questions){
              var ansid = self.questions[iii].ID;
              self.answers[ansid]=new Array();
              self.answers[ansid][0] ='' ;
            }
            //end数组形式传递
          }else{
              self.scalehave = false;
          }
        },function(err){
          /*解决ipad测评时首次加载不展示问题*/
          if(err.status == 0){
            window.location.reload();
          }
        }).then(function () {
          self.firstcheck();
          self.showBtn();
          $(".img-container img").css('border',"1px solid #ccc");
          $(".img-container img").css('width',"170px");
          $(".img-container img").css('height',"170px");
        });

      },
      firstcheck:function(){
        var self = this;
        var nowid = parseInt($("#nowqid").val());
        var nowshow = nowid;
        var nowmemo = $("#memo"+nowshow).html();
        var nowremark = $("#remark"+nowshow).html();
//        console.log(nowmemo.length);
//        console.log(nowremark.length);
        if (nowmemo.length==0){
          self.czsm = 0;
        }else if(nowmemo.length!=0){
          self.czsm = 1;
        }
        if(nowremark.length==0){
          self.ckda = 0;
        }else if(nowremark.length!=0){
          self.ckda = 1;
        }
      },
      checkisShow:function(){
        var self = this;
        var nowid = parseInt($("#nowqid").val());
        var nowshow = nowid+1;
        var nowmemo = $("#memo"+nowshow).html();
        var nowremark = $("#remark"+nowshow).html();
//        console.log(nowmemo.length);
//        console.log(nowremark.length);
        if (nowmemo.length==0){
            self.czsm = 0;
        }else if(nowmemo.length!=0){
          self.czsm = 1;
        }
        if(nowremark.length==0){
            self.ckda = 0;
        }else if(nowremark.length!=0){
          self.ckda = 1;
        }
      },precheckisShow:function(){
      var self = this;
      var nowid = parseInt($("#nowqid").val());
      var nowshow = nowid-1;
      var nowmemo = $("#memo"+nowshow).html();
      var nowremark = $("#remark"+nowshow).html();
//      console.log(nowmemo.length);
//      console.log(nowremark.length);
      if (nowmemo.length==0){
        self.czsm = 0;
      }else if(nowmemo.length!=0){
        self.czsm = 1;
      }
      if(nowremark.length==0){
        self.ckda = 0;
      }else if(nowremark.length!=0){
        self.ckda = 1;
      }
    },
      nextQ : function(){
        this.ansShow = false;
        this.actShow = false;
        var self = this;
        if(this.checkSelect()){
            if(self.$route.query.scaleId==72 || self.$route.query.scaleId==68){
                var checkedradio = $("input[name='questions["+self.thisQid+"][]']:eq(1)").is(":checked");
                console.log(checkedradio);
                if(checkedradio){
                    self.subQ2();
                    return false;
                }else{
                  if (self.thisTagid < self.thisQlen-1){
                    this.thisQid = parseInt(this.thisQid)+1;
                    self.thisTagid++;
                    this.checkisShow();//检测是否显示查看答案按钮和操作说明按钮
                  }
                }


            }else{
              if (self.thisTagid < self.thisQlen-1){
                this.thisQid = parseInt(this.thisQid)+1;
                self.thisTagid++;
                this.checkisShow();//检测是否显示查看答案按钮和操作说明按钮
              }
            }
        }
        this.showBtn();
      },
      prevQ : function(){
        var self = this;
        if (self.thisTagid > 0){
          this.thisQid = parseInt(this.thisQid)-1;
          self.thisTagid--;
          this.precheckisShow();//检测是否显示查看答案按钮和操作说明按钮
        }
        this.showBtn();

      },
      subQ:function(){
        var self = this;
        if(self.canSubTag)//禁止多次提交
        {

        }else{
          return;
        }
//        this.nextQ();//检查是否答题
        if(this.checkSelect()){

        self.canSubTag = false;
        //json格式传参
//        var questions = $("#theform").serializeArray();
//        var d = {};
//        $.each(questions, function() {
//          d[this.name] = this.value;
//        });
//        var qqs = JSON.stringify(d);
        //end json格式传参

        //字符串形式传参
//        var questions = $("#theform").serialize();
//        var jss = decodeURIComponent(questions);
        //end字符串形式传参
//        console.log(questions);
        //数组形式传参
        var questions = $("#theform").serializeArray();
//        var questions = decodeURIComponent(questions,true);
//        console.log(questions);
//        console.log(self.answers);
//        console.log('11111');
        var tag = 0;
//        for( var aaa in self.answers){
//            console.log(aaa);
//            self.answers[aaa][0]=questions[tag]['value'];
//            tag++;
//        }
        var re1 = /^questions\[(\d+)\]\[(.*)\]/;
        var cach = '';
        for( var aaa in questions){

          console.log(questions[aaa]['name']);
         // console.log((questions[aaa]['name']).match(re1));
          cach = (questions[aaa]['name']).match(re1);
          console.log(cach[1],Number(cach[2]));
          self.answers[(parseInt(cach[1]))][(Number(cach[2]))]=parseInt(questions[aaa]['value']);
        }
//        console.log(self.answers);
//        console.log('222222');
        var caocao = {};
        for(var bbb in self.answers){
//            var aaa=bbb;
            if(bbb){
//                bbb='"' + bbb + '"';
//                console.log(bbb,self.answers[bbb]);
//                for(var bb in self.answers[bbb]){
                    caocao[bbb]=self.answers[bbb];
//                }
            }
//            console.log(JSON.stringify(caocao));
        }
//        console.log(JSON.stringify(caocao));
        //end数组形式传参
        self.$http.post('/api/Evaluation/assess_end', {
//          uid : '24617868096176150',
          uid : self.uid,
          aid : self.assess,
          anon : self.anon,
          questions : JSON.stringify(caocao) ,
        }).then(function(res){
//          console.log(res);
//          self.$router.push({ path: '/doc/cases/recordDetail/'+self.uid+'/'+self.assess});
          self.$router.push({ path: '/doc/cases/evalRecord/'+self.uid});
        });
      }},
      //数字广度顺背开始
    subQ2:function(){
//        this.nextQ();//检查是否答题
      if(this.$route.query.scaleId==68 || this.$route.query.scaleId==72){


        var self = this;
        //json格式传参
//        var questions = $("#theform").serializeArray();
//        var d = {};
//        $.each(questions, function() {
//          d[this.name] = this.value;
//        });
//        var qqs = JSON.stringify(d);
        //end json格式传参

        //字符串形式传参
//        var questions = $("#theform").serialize();
//        var jss = decodeURIComponent(questions);
        //end字符串形式传参
//        console.log(questions);
        //数组形式传参
        var questions = $("#theform").serializeArray();
//        var questions = decodeURIComponent(questions,true);
//        console.log(questions);
//        console.log(self.answers);
//        console.log('11111');
        var tag = 0;
//        for( var aaa in self.answers){
//            console.log(aaa);
//            self.answers[aaa][0]=questions[tag]['value'];
//            tag++;
//        }
        var re1 = /^questions\[(\d+)\]\[(.?)\]/;
        var cach = '';
        for( var aaa in questions){

//          console.log(questions[aaa]['name']);
//          console.log((questions[aaa]['name']).match(re1));
          cach = (questions[aaa]['name']).match(re1);
//          console.log(cach[1],Number(cach[2]));
          self.answers[(parseInt(cach[1]))][(Number(cach[2]))]=parseInt(questions[aaa]['value']);
        }
//        console.log(self.answers);
//        console.log('222222');
        var caocao = {};
        for(var bbb in self.answers){
//            var aaa=bbb;
          if(bbb){
//                bbb='"' + bbb + '"';
//            console.log(bbb,self.answers[bbb]);
//                for(var bb in self.answers[bbb]){
            caocao[bbb]=self.answers[bbb];
//                }
          }
//            console.log(JSON.stringify(caocao));
        }
//        console.log(JSON.stringify(caocao));
        //end数组形式传参
        self.$http.post('/api/Evaluation/assess_end', {
//          uid : '24617868096176150',
          uid : self.uid,
          aid : self.assess,
          anon : self.anon,
          questions : JSON.stringify(caocao) ,
        }).then(function(res){
//          console.log(res);
//          self.$router.push({ path: '/doc/cases/recordDetail/'+self.uid+'/'+self.assess});
          self.$router.push({ path: '/doc/cases/evalRecord/'+self.uid});
        });
      }},
      //数字广度顺背结束

      //三个按钮的显示与隐藏
      showBtn:function(){
        if(this.thisTagid == 0 && this.thisQlen==1){
          this.prevBtn =0
          this.nextBtn = 0
          this.subBtn = 1
        }else if(this.thisTagid == 0){
          this.prevBtn =0
          this.nextBtn = 1
          this.subBtn = 0
        }else if(this.thisTagid == this.thisQlen-1){
          this.prevBtn =1
          this.nextBtn = 0
          this.subBtn = 1
        }else{
          this.prevBtn =1
          this.nextBtn = 1
          this.subBtn = 0
        }
      },
      //检查是否答题
      checkSelect:function(){
        var self = this;
        var type=1;//单选
        if (self.questions[self.thisTagid]['ISMULTISELECT']==1) {type=2}; //多选
        if (self.questions[self.thisTagid]['QUESTYPE']==2) {type=3}; //填空
//        console.log(self.thisTagid);
        switch(type){
          case 1:
            var radio = $(".on").find("input:checked");
            if(radio.length == 0){
//              alert('您本题还没有做！');
              self.showBox=true;
              return false;
            }else{
                return true;
            }
            break;
          case 2:
            var radio = $(".on").find("input:checked");
            if(radio.length == 0){
//              alert('您本题还没有做！');
              self.showBox=true;
              return false;
            }else{
              return true;
            }
            break;
          case 3:
            var input = $(".on").find("input");//填空题
            var done=false;
            for(var i in input)
            {
              if($.trim(input[i].value))done=true;
            }
            if (!done) {
//              alert('您本题还没有做！');
              self.showBox=true;
              return false;
            }else{
              return true;
            }
            break;
        }
        //检查结束
      }
    },
    mounted(){
      this.getallQuestions();
      this.showBtn();
    },
    updated(){
//        this.firstcheck();
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/css/app.styl"
  @import "../../../assets/css/variable.styl"

  .rightContent
    position absolute
    left 231px
    top $top-height
    right 0
    height calc(100% - 101px)
  .question
    padding 0 30px
    font-weight normal
  header
    position relative
  header h2
    display inline-block
    height 50px
    line-height 50px
    margin-bottom 20px
  header h2 a
    display inline-block
    line-height 48px
    width 48px
    margin-right 20px
    text-indent -999px
    border-radius 50px
    background #658456 url("../../../assets/img/h2.png") no-repeat center center
  button#actBtn
    position absolute
    right 0
    top 20px
    background-color #1bbe9f
  #qMain
    font-size normal
    margin-top 10px
  .radio
    display block
    margin-bottom 20px
  label.radio>input[type=radio]
    -webkit-appearance:radio;
    width 30px
    height 30px
    border 1px solid darkgreen
  label.radio>input[type=checkbox]
    -webkit-appearance:checkbox;
    width 30px
    height 30px
  .radio input,.radio em
    display inline-block
    height 30px
    line-height 30px
    vertical-align middle
    font-style normal
    font-size 18px
  #changeQ
    height 150px
    position relative
  #ckBtn
    margin-right 30px
  #btnP,#btnN,#btnsubmit
    background-color #0a81e5
    margin-right 30px
  #btnN
    background-color #0a81e5
  #btnP
    background-color #0a81e5
  .content
    display none
  .on
    display block
    border-radius 5px
  div.on div:nth-child(3)
    margin-bottom 10px
  .on span
    font-weight bold
  .onBtn
    display none
  #rightans
    margin-top 10px
    color #0a81e5
  .op.up
    position relative
    padding-left 20px
    cursor pointer
  .op.up:before
    border-left-color  #0a81e5
    top  18%;
    left 0px;
  .op:before
    content: " "
    height: 0
    width: 0
    border-color: rgba(0, 0, 0, 0)
    border-style: solid
    border-width: 7px
    position: absolute
    top: 36%
    left: -22px
  #actions
    border-radius 5px
    background #C8EFFF
  .showBox
    margin 5px 30px
    border 1px dashed #1BBE9F
    border-radius 5px
    color #1BBE9F
  .anstag
    margin-top 30px
  .ansbar
    padding-bottom 10px
  #ckBtn
    background #1BBE9F
  #prestrip
    width 100%
    background-color red
  .progress
    position absolute
    top 0
    width 100%
    height: 10px;
    background: #ebebeb;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-radius: 5px;
  .progress .blue
    background: #0A81E5;
    border-color: #0A81E5;

  .progress > span
    position: relative;
    float: left;
    margin: 0 -1px;
    min-width: 30px;
    height: 10px;
    line-height: 10px;
    text-align: right;
    background: #cccccc;
    border:0;
    border-color: #bfbfbf #b3b3b3 #9e9e9e;
    border-radius: 5px;
    background-image: -webkit-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
    background-image: -moz-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
    background-image: -o-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
    background-image: linear-gradient(to bottom, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
    -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  #footerBar
    height 10px
    position absolute
    top 75px
    width 99.8%
    background-color pink

  .on
    background-color #fff
  .sontag
    color #333
    height 60px
    line-height 60px
    background #F8F8F8
    font-size 18px
    font-weight bold
    margin-left: -30px!important
    margin-right: -30px!important
    padding-left 30px
  .sontag span
    color #666
    margin-left 20px
    font-weight normal
  .sontag span em
    font-style normal
    font-weight normal
.shwogbar
  font-weight bold
  font-size 9px!important
  width 100%
  text-align center
  height 10px
  line-height 10px;
  position absolute
  z-index 2147483646!important
.bacMask
  position fixed
  top 0
  left 0
  background-color #cccccc
  opacity 0.7
  margin-top 0
  margin-left 0
  width 100%
  height 100%
  z-index 2147483646!important
.middleContentConform
  text-align center
  width 300px
  height 150px
  border-radius 5px
  background-color #fff
  color #000
  position fixed
  z-index 2147483647!important
  top 30%
  left 40%
.middleContentConform figcaption
  text-align center
  line-height 80px
.middleContentConform button
  background-color #0a81e5
</style>
