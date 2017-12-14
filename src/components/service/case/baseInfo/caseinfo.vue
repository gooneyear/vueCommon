<template>
  <div class="userInfo">
    <caseInfoModal :caseInfo="caseInfo" @close="showContent=false" @submitData="submitCase" v-if="showContent"></caseInfoModal>
    <mu-flexbox align="flex-start">
      <mu-flexbox-item class="flex-demo">
        <mu-flexbox orient="vertical" style="margin-left:40px;">
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">姓名</li>
              <li class="evenStyle">{{caseInfo.name}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">年龄</li>
              <li class="evenStyle">{{caseInfo.age}}岁</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">性别</li>
              <li class="evenStyle">{{sex}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">教育程度</li>
              <li class="evenStyle">{{edu}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">利手</li>
              <li class="evenStyle">{{handup}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <span class="pointer changeStyle" @click="showCaseModal">信息有误，点击修改</span>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
      <mu-flexbox-item>
        <mu-flexbox orient="vertical" style="margin-left:60px;">
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">手机号/账号</li>
              <li class="evenStyle">{{caseInfo.username}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">初始密码</li>
              <li class="evenStyle" style="width:200px">
                <span>123456</span>
              </li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-demo">
            <ul>
              <li class="oddStyle">添加人</li>
              <li class="evenStyle">{{caseInfo.addUser}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item>&nbsp;</mu-flexbox-item>
          <mu-flexbox-item>&nbsp;</mu-flexbox-item>
          <mu-flexbox-item>&nbsp;</mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
      <mu-flexbox-item>
        <mu-flexbox orient="vertical" align="flex-start">
          <mu-flexbox-item class="flex-demo">
            <printInfo :caseInfo="caseInfo" @close="showModal=false" v-if="showModal"></printInfo>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
    </mu-flexbox>
  </div>
</template>
<script>
  import Vue from 'vue'
  import caseInfoModal from './caseInfoModal.vue'
  import printInfo from './printInfo.vue'
  import {getSelect,date2Str} from '../../../../assets/js/common.js'

  export default ({
    props: ['caseInfo'],
    data() {
      return {
        showContent: false,
        showModal:true
      }
    },
    computed: {
      sex: function() {
        return getSelect('gender', this.caseInfo.gender)
      },
      edu: function(){
        return getSelect('edus', this.caseInfo.education);
      },
      handup: function(){
        return getSelect('hands', this.caseInfo.hand)
      }
    },
    components:{
      caseInfoModal,
      printInfo,
    },
    methods: {
      showCaseModal: function(){
        this.showContent = true;
      },
      submitCase: function(){
        this.showContent = false;
        location.reload();
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../../assets/css/app.styl"
  @import "../../../../assets/css/variable.styl"
  @import "../../../../assets/css/table.styl"

  .userInfo
    margin-top 20px
  .flex-demo
    ul
      height 70px
</style>
