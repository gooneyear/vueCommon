<template>
  <div id="userSet">
    <userSetModal v-if="showEdit"
      :uName="store.account.name" :uGender="userSet.gender"  :uPlace="userSet.permanentPlace"
      :uPart="department" @submitData="saveUser" @close="cancelModal">
    </userSetModal>
    <div class="partStyle">
      <ul>
        <li class="evenStyle" style="color:#999;">基本信息</li>
        <li class="oddStyle">头像</li>
        <li class="evenStyle">
          <uploadImg v-if="showIMG" :path="imgPath"></uploadImg>
        </li>
      </ul>
      <ul>
        <li class="oddStyle">姓名</li>
        <li class="evenStyle">{{store.account.name}}</li>
      </ul>
      <ul>
        <li class="oddStyle">性别</li>
        <li class="evenStyle">{{sex}}</li>
      </ul>
      <ul>
        <li class="oddStyle">医院科室</li>
        <li class="evenStyle">{{department}}</li>
      </ul>
      <ul>
        <li class="oddStyle">常住地</li>
        <li class="evenStyle">{{userSet.permanentPlace}}</li>
      </ul>
      <div class="changeStyle pointer" @click="editUser">信息有误，修改信息</div>
    </div>
    <div class="partStyle">
      <mobileChange v-if="showMobile" :mobile="userSet.mobile" @close="cancelMobile" @submitData="submitCase"></mobileChange>
      <mu-dialog :open="showAlert" title="手机绑定成功">
        <span>您当前的手机号为{{newPhone}}，下次登录请使用此手机号。</span>
        <mu-flat-button slot="actions" primary @click="goBack" label="确定"/>
      </mu-dialog>
      <ul>
        <li class="evenStyle" style="color:#999;">电话/账号绑定</li>
        <li class="oddStyle">绑定电话</li>
        <li class="evenStyle">{{userMobile}} &nbsp;&nbsp;<span class="changeStyle pointer" style="color:#0a81e5;width:30px;" @click="changeMobile">修改</span></li>
      </ul>
      <ul></ul>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {getSelect} from '../../../assets/js/common.js'
  import checkBlock from '../../../components/common/checkBlock.vue'
  import mobileChange from './mobileChange.vue'
  import uploadImg from '../../common/uploadImg.vue'
  import userSetModal from './userSetModal.vue'

  var store = require('../../../app/store.js');
  export default ({
    data() {
      return {
        store: require('../../../app/store.js'),
        select: GLOBAL.selectOption,
        userSet: {},
        showMobile: false,
        showAlert: false,
        showIMG: false,
        showEdit: false,
        imgPath: '',
        userMobile: '',
        userID: '',
        setOrg: '',
        oldPhone: '',
        newPhone:''
      }
    },
    components: {
      checkBlock,
      mobileChange,
      uploadImg,
      userSetModal
    },
    computed: {
      sex: function() {
        return getSelect('gender', this.userSet.gender)
      },
      department: function(){
        return this.store.account.orgName + '·' + this.userSet.departmentName;
      }
    },
    mounted () {
      this.getAccount();
    },
    methods: {
      getUserSet: function() {
        var self = this;
        Vue.http({
          method: 'GET',
          url:'/api/Users/getDtDetail',
          params: {
            'username': this.store.account.username
          }
        })
        .then(
          function(res){
            self.userSet = res.data.data[0];
            self.userMobile = self.userSet.mobile;
            var k = Math.random();
            var v = Math.random();
            self.imgPath = GLOBAL.cognition +'/'+ self.userSet.path +'?' + k + '=' + v;;
            console.log(self.imgPath);
            self.showIMG = true;
          }
        )
      },
      getAccount: function () {
        var self = this;
        var token = localStorage.getItem('access_token');
        if (token) {
          this.$http.get('/api/Users/me').then(
            function (res) {
              store.setAccount(res.data);
              self.getUserSet();
            }
          );
        }
      },
      editUser: function() {
        this.showEdit = true;
      },
      saveUser: function(name,gender,place) {
        this.showEdit = false;
        var self = this;
        this.$validator.validateAll()
          .then(function(isValid) {
            if(false == isValid)
            {
              return;
            }
            self.$http.post('/api/Users/updateme', {
                'id': self.store.account.account_uuid,
                'name': name,
                'gender': gender,
                'permanentPlace': place,
                'mobile': self.userSet.mobile
              })
              .then(
                function () {
                  this.getUserSet();
                  location.reload();
                }
              )
          })
      },
      changeMobile: function(){
        this.showMobile = true;
      },
      submitCase: function(old,news){
        this.oldPhone = old;
        this.newPhone = news;
        this.showMobile = false;
        this.showAlert = true;
      },
      cancelModal: function(){
        this.showEdit = false;
      },
      cancelMobile: function(){
        this.showMobile = false;
      },
      goBack: function(){
        this.showAlert=false;
        this.userMobile = this.newMobile;
      }
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../assets/css/app.styl"
  @import "../../../assets/css/variable.styl"

  #userSet
    position absolute
    top 80px
    left $second-menu-width
    padding-left 110px
    text-align left
    div
      margin-bottom 30px
  .partStyle
    border-bottom 1px solid #e5e5e5
    margin-right 30px
    ul
      margin 30px 0
      li
        margin 10px 0
  .changeStyle
    font-weight normal
    width 150px
    color #999
    text-decoration underline
</style>
