<template>
<div>
  <mu-raised-button label="打印账号" @click="openPrintDialog" class="btnprintClass" primary/>
  <mu-dialog :open="printdialog" @close="close" dialogClass="printdialogClass">
    <div class="print-content">
      <div class="print-content-header">
        <div class="header-title-wrap">
          <div class="header-logo"></div>
          <div class="header-title">六六脑<sup>®</sup> 脑康复云</div>
        </div>
      </div>
      <div class="print-content-accountinfo">
        <mu-table >
          <mu-tr>
            <mu-td class="print-contebt-title">康复账号</mu-td>
          </mu-tr>
          <mu-tr>
            <mu-td>
              <span class="accout-item">姓名：</span>
              <span>{{caseInfo.name}}</span>
            </mu-td>
            <mu-td>
              <span class="accout-item">账号：</span>
              <span>{{caseInfo.username}}</span>
            </mu-td>
          </mu-tr>
          <mu-tr >
            <mu-td>
              <span class="accout-item">年龄：</span>
              <span>{{caseInfo.age}}</span>
            </mu-td>
            <mu-td>
              <span class="accout-item">医生：</span>
              <span>{{caseInfo.addUser}}</span>
            </mu-td>
          </mu-tr>
          <mu-tr >
            <mu-td>
              <span class="accout-item">性别：</span>
              <span>{{sex}}</span>
            </mu-td>
            <mu-td>
              <span class="accout-item">机构：</span>
              <span>{{caseInfo.department}}</span>
            </mu-td>
          </mu-tr>
          <mu-tr >
            <mu-td class="print-contebt-title">使用说明</mu-td>
          </mu-tr>
          <mu-tr >
            <mu-td>
              <span><strong>首次</strong></span><br/>
              <span class="accout-item">首次使用时，建议在医生指导下进行。<br/>
                如果有任何疑问，请及时咨询。<br/>
                之后，医生会逐渐地让您独立操作。</span>
            </mu-td>
          </mu-tr>
          <mu-tr>
            <mu-td>
              <span><strong>登录</strong></span><br/>
              <span class="accout-item">网址：<span style="color:#151515;font-weight:bold;">kangfu.66nao.com</span>
              <br/>在登录页面，请输入“账号”和“密码”（见康复账号信<br />息，初始密码为</span>
              <span style="color:#151515;font-weight:bold;">123456</span>
              <span >)</span>
            </mu-td>
          </mu-tr>
        </mu-table>
      </div>
    </div>
    <div style="width:100%;height:570px;background:#fff;">
      <a ref="cancel" class="cancel" @click="close">关闭</a>
      <a ref="print" class="print" @click="printNow">打印</a></div>
  </mu-dialog>
</div>
</template>

<script>
export default {
  props:["caseInfo"],
  data () {
    return {
      printdialog: false,
    }
  },
  computed:{
    sex(){
      if (this.caseInfo.gender == 2) {
        return "男";
      }else{
        return "女";
      }
    }
  },
  methods: {
    openPrintDialog () {
      this.printdialog = true
    },
    close () {
      this.printdialog = false
    },
    printNow () {
      this.printdialog = false
      document.querySelector(".print").style.display = "none";
      document.querySelector(".cancel").style.display = "none";
      document.querySelector(".print-content").style.backgroundColor = "#fff";
      /*document.querySelector(".printdialogClass").style.width = "100% !important";
      document.querySelector(".printdialogClass").style.maxWidth = "none !important";*/
      document.querySelector(".printdialogClass").className = "print-dialog-css";
      document.querySelector(".mu-dialog-body").style.padding = "0";
      window.print();
      this.$parent.showModal = false;
      document.querySelector(".print").style.display = "block";
//      document.querySelector(".print-content").style.backgroundColor = "rgba(0,0,0,0.5)";
      document.querySelector(".cancel").style.display = "block";
      document.querySelector(".mu-dialog-body").style.padding = "24px 24px 20px";
    }
  }
}

</script>

<style lang="stylus">
.btnprintClass
  border-radius 20px !important

.printdialogClass
  text-align:center;
  width 100% !important
  max-width: none!important;
  height:100%!important;
.print-dialog-css
  text-align:center;
  width 100% !important
  max-width: none!important;
  height:100%!important;

.print-content
  /*width 420px*/
  /*height 515px*/
.print-content-header
  width 420px
  height 80px
.header-title-wrap
  position relative
  width 420px
  height 80px
  /*background-color #0A81E5*/
  margin -24px 0px 0 -24px
.header-logo
  position absolute
  /*width 49.8px*/
  /*height 45px*/
  /*background-image url("../../../../assets/img/logo_s.png")*/
  background-repeat no-repeat
  background-size cover
  /*left 20px*/
  top 50%
  transform translateY(-50%)

.header-title
  height 80px
  padding-left 30px
  color #333
  text-align left
  line-height 80px
  font-size 30px

.print-content-accountinfo
  /*padding 20px*/

.mu-table
  border 0px
  .mu-tr
    border-color #fff
  .mu-td
    padding 0

.accout-item
  color #999

.print-contebt-title
  color #333
  font-size 16px !important
  font-weight bold

.print
  font-size 14px
  bottom 20px
  right 20px
  color #0A81E5
  text-decoration underline
  cursor pointer
.cancel
  font-size 14px
  bottom 20px
  right 68px
  color #999
  text-decoration underline
  cursor pointer
  padding-left 280px
  padding-right 20px
</style>
