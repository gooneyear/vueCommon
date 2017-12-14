<template>
  <div id="chinaArea">
    <div class="m-wrap-collect">
      <select name="province" v-model="province" class="oneInput" required @change="getProv" @focus="focusHandler('pCode')" @blur="blurHandler('pCode')">
        <option v-for="prov in provinces" :value="prov.id">
          {{ prov.areaname }}
        </option>
      </select>省
      <select name="city" v-model="city" class="oneInput" required @change="getCity" @focus="focusHandler('cCode')" @blur="blurHandler('cCode')">
        <option v-for="ct in cities" :value="ct.id">
          {{ct.areaname}}
        </option>
      </select>市
      <select name="area" v-model="area" class="oneInput" required @change="getArea" @focus="focusHandler('aCode')" @blur="blurHandler('aCode')">
        <option v-for="ae in areas" :value="ae.id">
          {{ae.areaname}}
        </option>
      </select>区
      <br/>
      <!-- v-validate="{rules:{regex: /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/,max:50}}"-->
      <input name="家庭住址" class="addressInput" v-model="address" @change="getAddr" @focus="focusHandler('addr')" @blur="blurHandler('addr')">
      <!--<span class="is-danger" style="margin: 0 -20px 0 20px; ">{{ errors.first('家庭住址') }}</span>-->
      <span class="is-danger" :style='warning_style || "margin-left: 20px;"'>{{errorInfo}}</span>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default ({
    props: ['family','isFirst', 'warning_style'],
    data() {
      return {
        // 后台返回的错误信息
        errorMessage: '',
        provinces: [],
        cities: '',
        areas: '',
        province: this.family.pCode,
        city: this.family.cCode,
        area: this.family.aCode,
        address:  this.family.addr,
        all:{
          pCode: this.family.pCode,
          pName: this.family.pName,
          cCode: this.family.cCode,
          cName: this.family.cName,
          aCode: this.family.aCode,
          aName: this.family.aName,
          addr: this.family.addr
        },
        isFirstFlag: this.isFirst
      }
    },
    computed: {
      errorInfo: function(){
        /*if(!this.all.pCode&&!this.isFirstFlag.pCode){
            //console.log(11)
          return '必填项，请填写省！'
        }
        //console.log(this.all.cCode,this.isFirstFlag.cCode)
        if(!this.all.cCode&&!this.isFirstFlag.cCode){
          //console.log(22)
          return '必填项，请填写市！'
        }
        if(!this.all.aCode&&!this.isFirstFlag.aCode){
          //console.log(33)
          return '必填项，请填写区！'
        }
        if(!this.all.addr&&!this.isFirstFlag.addr){
          //console.log(44)
          return '必填项，请填写详细地址！'
        }*/
      }
    },
    watch: {
      province: function(newProv){
        this.all.cCode = '';
        this.all.aCode = '';
        this.getAreas({id: newProv});
        this.errorMessage = '';
      },
      city: function(newCity){
        this.all.aCode = '';
        this.getAreas({id: newCity});
        this.errorMessage = '';
      },
      area: function(){
        this.errorMessage = '';
      }
    },
    mounted: function() {
      this.getAreas({id: '0'});
      this.getAreas({id: this.family.pCode});
      this.getAreas({id: this.family.cCode});
    },
    methods: {
      getAreas:function(param) {
        var self = this;
        this.$http.get('api/Orgs/getArea', { params: param })
          .then(function(res) {
            var ccID = param.id + '';
            if (param.id === '0'){
              self.provinces = res.data.data;
            } else if(ccID.substring(4,2) == '00') {
              self.cities = res.data.data;
            } else {
              self.areas = res.data.data;
            }
          });
      },
      getProv:function(e){
        this.all.pCode = e.target.value;
        if (e.target.value) {
          this.all.pName = $.trim($("[value='"+e.target.value+"']")[0].innerHTML);
        }
      },
      getCity:function(e){
        this.all.cCode = e.target.value;
        if (e.target.value) {
          this.all.cName = $.trim($("[value='"+e.target.value+"']")[0].innerHTML);
        }
      },
      getArea:function(e){
        this.all.aCode = e.target.value;
        if (e.target.value) {
          this.all.aName = $.trim($("[value='"+e.target.value+"']")[0].innerHTML);
        }
      },
      getAddr:function(e){
        this.all.addr = e.target.value;
        this.$emit('changeAddress',this.all);
//        var self = this;
//        this.$validator.validateAll()
//          .then(function(){
//            self.$emit('changeAddress',self.all)
//          })
      },
      focusHandler: function(type){
          //console.log(type, this.isFirstFlag)
        this.isFirstFlag[type]= 1;
      },
      blurHandler: function(type){
        //console.log(type, this.isFirstFlag)
        this.isFirstFlag[type]= 0;
      }
    }
  })
</script>
<style lang="stylus">
  @import "../../assets/css/app.styl"
  @import "../../assets/css/variable.styl"

  .oneInput
    border-radius 0
    height $button-height
    border 1px solid #eee
    background-color #f8f8f8
    width 85px
  .addressInput
    margin-top 10px
    border-radius 0
    border 1px solid #eee
    background-color #f8f8f8
    height 36px
    width 298px
  .m-wrap-collect
    /*margin-left 240px*/
    margin: auto
    text-align left
  .m-wrap-collect input
    margin-left 0
</style>
