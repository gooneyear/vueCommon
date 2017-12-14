<template>
  <div>
    <mu-dialog :open="true" title="病症诊断"  scrollable>
      <mu-flexbox>
        <mu-flexbox-item>
          <div class="modal-body" style="overflow: hidden">
            <div class="diagContent">
              <div class="diagMenu">
                <ul><li v-for="(menu,index) in diagMenu">
                    <a class="pointer" :class="{fontW:checkMenu==index}" @click="getDiag(index)">{{menu.name}}</a>
                </li></ul>
              </div>
              <mu-dialog :open="showInfo" :title="diagDesc.name">
                {{diagDesc.description  == '' ? '暂无说明':diagDesc.description}}
                <mu-flat-button slot="actions" @click="showInfo=false" label="确定" style="background-color:#0a81e9;" />
              </mu-dialog>
              <div class="diagList">
                <ul style="font-size:13px;">
                  <li v-for="(diag,index) in diagNames" >
                    <div>
                      <a class="pointer" v-on:click="setSecond(diag)">
                        <span :class="{checked:diag.isCheck}"></span>
                        {{diag.name}}
                      </a>
                      <i v-if="!diag.child" class="pointer" style="background-color:#ddd" @click="sendInfo(diag)">?</i>
                      <input id='other-diag-input' style="margin-left:10px;width:200px;"
                      class="newInput" v-model="diag.remark" v-if="diag.isCheck&&diag.name=='其他'"
                      @blur="changHandler" required placeholder='请填入具体病症名称'>
                      <span style="color:red;display: inline-block;width:200px;background-color: #fff;line-height: 10px;" v-if="diag.isCheck&&diag.name=='其他'"></span>
                    </div>
                    <div class="lastClass pointer">
                      <a v-for="(item,index) in diag.child" @click="setThird(diag,item)">
                        <i :class="{checked:item.isCheck}"></i>{{item.name}}
                        <span @click="sendInfo(item)">?</span>
                      </a>
                    </div>
                  </li><i></i>
                </ul>
              </div>
            </div>
          </div>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-raised-button label="取消" @click="$emit('close')" style="margin-left:20px;color:#999;" slot="actions" />
      <mu-raised-button label="确认" @click="submitData" slot="actions" primary/>
    </mu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {removeByValue,resetData,contains,addCheck} from '../../../../assets/js/common.js'
  export default ({
    el: "#modal-dialog",
    props: ['id'],
    data() {
      return {
        userID: '',
        checkMenu: 0,       // 判断菜单是否选中
        diagInfo: [],       // 所有的诊断信息
        diagMenu: [],       // 诊断的一级列表
        diagNames: [],      // 诊断的二级列表
        showInfo: false,    // 是否显示诊断说明
        elseFlag: true,     // ‘其他’选项的合法性标识。
        diagDesc: '',       // 诊断说明内容
        selectLanguages:{
          "lan":[],
          "cogn": []
        },  // 已保存的诊断id列表，点开时从后端获取的
        singleDiag: require('../../../../../static/js/selectContent.js')
      }
    }, // end of data
    mounted() {
      this.fetch();
    },
    methods: {
      diagInputErrorInfo(diagName)
      {
        if(undefined === diagName || diagName == ''){
          return "必填项，请输入其他病症！"
        }else if(diagName.length > 30){
          return "长度不能超过30个字符！"
        } else {
          this.elseFlag = true;
          return "";
        }
      },
      fetch: function() {
        var self = this;
        // 由于ID有两个地方调用，如果父组件传入id，则用父组件的，否则直接从路由中获取
        if(this.id){
          this.userID = this.id
        } else {
          this.userID = this.$route.params.id
        }
        Vue.http({
            method: 'GET',
            url:'/api/Cases/getAllDiag',
            params: {
              'id': this.userID
            }
          })
          .then(function(data){
            // 将每个诊断数据项添加一个isCheck属性
            var diag = data.data.data;
            self.diagInfo = addCheck(diag);
            // 添加其他诊断的具体病症名称
            const walker = (t, c) =>
            {
              for (var ch of t)
              {
                if (ch.id !== undefined && c[ch.id] != undefined)
                {
                  ch.remark = c[ch.id];
                }
                var children = ch.child || [];
                walker(children, c);
              }
            };
            walker(self.diagInfo, data.data.checked);
            // 获取病例诊断的一级分类
            for (var i=0; i<self.diagInfo.length; i++) {
              if (self.diagInfo[i].parentid == 0){
                self.diagMenu.push(self.diagInfo[i]);
              }
            }
            // 默认显示第一个分类的内容
            self.getDiag(0);
            // 显示已经有的诊断
            self.selectLanguages = data.data.checked;
            if(Object.keys(self.selectLanguages).length > 0){
              self.showCheck();
            }
          })
      },
      changHandler: function(e){
        //$(e.target).siblings('span').html(this.errorInfo);
        $(e.target).siblings('span').html(this.diagInputErrorInfo(e.target.value));
      },
      // 展示已经选中的项
      showCheck: function(){
        // 获取当前有哪些选中的病症
        for(var i=0; i<this.diagInfo.length; i++) {
          for (var j = 0; j < this.diagInfo[i].child.length; j++) {
            if(contains(Object.keys(this.selectLanguages),this.diagInfo[i].child[j].id)){
              this.diagInfo[i].child[j].isCheck = 1;
            }
            if(this.diagInfo[i].child[j].child){
              for (var k=0; k<this.diagInfo[i].child[j].child.length; k++){
                if(contains(Object.keys(this.selectLanguages),this.diagInfo[i].child[j].child[k].id)){
                  this.diagInfo[i].child[j].child[k].isCheck = 1;
                }
              }
            }
          }
        }
      },
      // 提交数据
      submitData: function(){
        const generateItem = (item) =>
        {
          const diagId = item.id;
          var diagName = item.name;
          if (diagName == '其他')
          {
            diagName = item.remark;
            // 判断其他的输入内容，如果非法则设置标识，后续判断标识使之无法提交
            if(undefined === diagName || diagName.trim() == "" || diagName.length > 30) {
              this.elseFlag = false;
              $('#other-diag-input').siblings('span').html(this.diagInputErrorInfo(diagName));
            }
          }
          else
          {
            diagName = '';
          }
          var item = {};
          item[diagId] = diagName;
          return item;
        };

        this.selectLanguages = [];
        // 获取当前有哪些选中的病症
        for(var i=0; i<this.diagInfo.length; i++) {
          if(this.diagInfo[i].child){
            for (var j = 0; j < this.diagInfo[i].child.length; j++) {
              if(this.diagInfo[i].child[j].isCheck == 1){
                this.selectLanguages.push(generateItem(this.diagInfo[i].child[j]));
                // this.selectLanguages.push(this.diagInfo[i].child[j].id);
              }
              if (this.diagInfo[i].child[j].child){
                for (var k = 0; k < this.diagInfo[i].child[j].child.length; k++) {
                  if(this.diagInfo[i].child[j].child[k].isCheck == 1){
                    this.selectLanguages.push(generateItem(this.diagInfo[i].child[j].child[k]));
                    // this.selectLanguages.push(this.diagInfo[i].child[j].child[k].id);
                  }
                }
              }
            }
          }
        }
        console.log(this.selectLanguages);
        var ret = {};
        for (var d of this.selectLanguages)
        {
          for (var k in d)
          {
            ret[k ] = d[k];
          }
        }
        if(this.elseFlag){
          this.$emit('submitData', ret, this.userID);
        }
      },
      // 获取二级诊断分类
      getDiag: function(index){
        this.checkMenu = index;
        this.diagNames = this.diagInfo[index]['child'];
      },
      // 二级病例诊断显示效果
      setSecond: function(item) {
        // 如果是认知疾病的选项，默认选择第一项
        item.isCheck = !item.isCheck;
        if(item.child && item.isCheck){
          item.child[0].isCheck = 1;
          for(var i=1; i<item.child.length; i++){
            item.child[i].isCheck = 0;
          }
        } else if(item.child) {
          for(var j=0; j<item.child.length; j++){
            item.child[j].isCheck = 0;
          }
        }
        // 如果是单选，则需要把其它选项置空
        if (contains(this.singleDiag.diag.id,item.id)){
          this.singleCheck(item);
        }
      },
      // 三级病例诊断显示单选效果
      setThird: function(parentItem,item){
        if (contains(this.singleDiag.diag.id,item.id)){
          this.singleCheck(item);
        }
        var pItem = parentItem.child;
        parentItem.isCheck = 1;
        for(var i=0; i<pItem.length; i++){
          if(pItem[i].id == item.id){
            pItem[i].isCheck = 1;
          } else {
            pItem[i].isCheck = 0;
          }
        }
      },
      // 病症单选效果
      singleCheck: function(item){
        // 定义一个临时变量保存单选的原有效果。
        var tempCheck = item.isCheck;
        if(item.child){
          var subTempCheck = item.child[0].isCheck;
        }
        for(var i=0; i<this.diagInfo.length; i++){
          for(var j=0; j<this.diagInfo[i].child.length; j++){
            if(this.diagInfo[i].child[j].child){
              for(var k=0; k<this.diagInfo[i].child[j].child.length; k++){
                this.diagInfo[i].child[j].child[k].isCheck = 0;
              }
            }
            if(contains(this.singleDiag.diag.id,this.diagInfo[i].child[j].id)){
              this.diagInfo[i].child[j].isCheck = 0;
            }
          }
        }
        item.isCheck = tempCheck;
        if(item.child){
          item.child[0].isCheck = subTempCheck;
        }
      },
      // 查看诊断说明
      sendInfo: function(val){
        this.diagDesc = val;
        this.showInfo = true;
      }
    }, //end of methods
    destroyed: function(){
      var wrapperElement = document.getElementById("dialog-wrapper");
      var dialogDiv = document.createElement("div");
      dialogDiv.setAttribute('id', 'modal-dialog');
      wrapperElement.appendChild(dialogDiv);
    },
  })
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/css/app.styl"

  .mu-dialog-body
    padding-right 0!important
  .diagContent
    display flex
    flex-direction row
    justify-content space-between
    .diagMenu
      font-size 15px
      display flex
      flex-direction column
      width 200px
      margin-left 40px
      border-right solid 1px #f5f5f5
    .diagList
      font-size 14px
      margin-top 0
      margin-left 40px
      width 100%
      ul
        margin-top -20px
        li
          padding-bottom 20px
      i
        display inline-block
        width 10px
        height 10px
        line-height 10px
        opacity 0.8
        border-radius 5px
        margin-left 10px
      span
        margin-right 18px
  .fontW
    font-weight bold
  .lastClass
    a
      margin-left 10px
      i
        margin-right 10px
        border 1px solid #999
      span
        display inline-block
        width 10px
        height 10px
        line-height 10px
        opacity 0.8
        border-radius 5px
        margin-left 10px
  .checked
    background-color #000
</style>
