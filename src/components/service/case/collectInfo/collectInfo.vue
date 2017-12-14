<template>
  <div class="m-space">
    <collectModal v-if="showModal" @close="resetCollect" :collect="collectInfo" :contact="contactInfo" :ill="familyInfo" :history="history" @submitData="submitCase"></collectModal>
    <mu-flexbox align="flex-start" class="box-margin">
      <mu-flexbox-item class="item-margin">
        <mu-flexbox orient="vertical"  style="margin-left:40px;">
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">姓名</li>
            <li class="evenStyle">{{collectInfo.name}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle" style="margin-top:0;">性别</li>
            <li class="evenStyle">{{sex}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">教育程度</li>
            <li class="evenStyle">{{edu}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">现居住地</li>
            <li class="evenStyle">{{place}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">当前职业</li>
            <li class="evenStyle">{{collectInfo.currentJob}}</li>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
      <mu-flexbox-item class="item-margin">
        <mu-flexbox orient="vertical" style="margin-left:40px;">
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">工作单位</li>
            <li class="evenStyle">{{collectInfo.workspace}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">出生日期</li>
            <li class="evenStyle">{{collectInfo.birthday}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">家庭住址</li>
            <li class="evenStyle">{{family}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">婚姻状态</li>
            <li class="evenStyle">{{marry}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">曾经职业</li>
            <li class="evenStyle">{{collectInfo.previousJob}}</li>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
    </mu-flexbox>
    <mu-divider />
    <mu-flexbox align="flex-start" class="box-margin">
      <mu-flexbox-item class="item-margin">
        <mu-flexbox orient="vertical"  style="margin-left:40px;">
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle" style="margin-top:0;">联系人</li>
            <li class="evenStyle">{{contactInfo.contacts}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">联系电话</li>
            <li class="evenStyle">{{contactInfo.telephone}}</li>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
      <mu-flexbox-item class="item-margin">
        <mu-flexbox orient="vertical" style="margin-left:40px;">
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">与患者关系</li>
            <li class="evenStyle">{{contactInfo.relation}}</li>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
    </mu-flexbox>
    <mu-divider />
    <mu-flexbox align="flex-start" class="box-margin">
      <mu-flexbox-item class="item-margin">
        <mu-flexbox orient="vertical"  style="margin-left:40px;">
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">服药史</li>
            <ul v-for="pill in pillInfo">
              <li class="evenStyle">{{pill.begin}}<span v-if="pill.begin != ''">至</span>{{pill.end}}</li>
              <li class="evenStyle" style="width:400px">{{pill.desc}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">病史</li>
            <ul v-for="ill in illInfo">
              <li class="evenStyle">{{ill.begin}}<span v-if="ill.begin != ''">至</span>{{ill.end}}</li>
              <li class="evenStyle" style="width:400px">{{ill.desc}}</li>
            </ul>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <li class="oddStyle">家族病史</li>
            <li class="evenStyle" style="width:400px">{{familyInfo}}</li>
          </mu-flexbox-item>
          <mu-flexbox-item class="item-margin">
            <span class="pointer changeStyle" @click="openModal">修改/新增</span>
          </mu-flexbox-item>
        </mu-flexbox>
      </mu-flexbox-item>
    </mu-flexbox>
  </div>
</template>
<script>
  import Vue from 'vue'
  import jquery from 'jquery'
  import collectModal from './collectModal.vue'
//  import collectModal2 from './collectModal2.vue'
  import {getSelect} from '../../../../assets/js/common.js'
  export default ({
    data() {
      return {
        showModal: false,
        collectInfo: {
          name: '',
          gender: '',
          birthday: '',
          education: '',
          currentJob: '',
          workspace: '',
          address: '',
          area: '', // 新增字段
          marry: '',      // 新增字段
          previousJob: ''
        },
        contactInfo: {
          contacts: '',
          relation: '',
          telephone: ''
        },
        illInfo: [],  // 新增字段
        pillInfo:[],
        familyInfo:'',
        history: ''   // 用于给子组件传递数据的
      }
    },
    computed: {
      sex: function(){
        return getSelect('gender', this.collectInfo.gender)
      },
      edu: function(){
        return getSelect('edus', this.collectInfo.education)
      },
      place: function(){
        return getSelect('place', this.collectInfo.area)
      },
      marry: function(){
        return getSelect('marry', this.collectInfo.marry)
      },
      family: function(){
        // 如果保存的地址不不是json格式的，则直接显示原字符串，否则按层级显示。
        try{
          var ff = JSON.parse(this.collectInfo.address);
          return ff.pName +'-'+ ff.cName +'-'+ ff.aName +'-'+ ff.addr;
        } catch(e){
          return this.collectInfo.address;
        }
      }
    },
    components:{
      collectModal
    },
    mounted (){
      this.fetch();
    },
    methods: {
      fetch: function(){
        var self = this;
        Vue.http({
            method: 'GET',
            url:'/api/Cases/getCollectionTable',
            params: {
              'id': this.$route.params.id
            }
          })
          .then(
            function(res){
              self.collectInfo = res.data.information;
              if(res.data.preparer){
                self.contactInfo = res.data.preparer;
              }
              console.log(res.data)
              self.history = res.data.history;
              self.illInfo = res.data.history.ill;
              self.pillInfo = res.data.history.pill;
              self.familyInfo = res.data.family_ill;
            }
          )
      },
      submitCase: function(collect,contact,ill,history){
        var self = this;
        this.$http.post('/api/Cases/collectionTable', {
            'id': this.$route.params.id,
            'information': collect,
            'preparer': contact,
            'family_ill': ill,
            'history': history
          },
          Vue.http.options.emulateJSON = true)
          .then(function(res){
            self.showModal = false;
            location.reload();
          });
      },
      openModal: function(){
        this.showModal = true;
        $(".controlOverflow").css("overflow","");
        $(".right-content").css("overflow","");
      },
      // 点击取消时，恢复为初始数据
      resetCollect: function(){
        this.showModal=false;
        $(".controlOverflow").css("overflow","auto");
        $(".right-content").css("overflow","auto");
        this.fetch();
      }
    }
  })
</script>
<style lang="stylus" scoped>
  .m-space
    padding-left 0
  .box-margin
    margin-top 20px
    margin-bottom 20px
  .item-margin
    margin-bottom 10px
</style>
