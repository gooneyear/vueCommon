<template>
  <div id="uploadImg">
    <div class="m-name">
      <img class="imgStyle" id="showImage" :src="imgPath" />
      <span class="danger">{{errorInfo}}</span>
      <span class="danger" v-show="hoverFlag">仅支持JPG/JPEG/PNG图片，且图片大小200KB以内</span>
      <a class="file pointer"
        @mouseover="showInfo(1)"
        @mouseout="showInfo(0)"
        onclick='document.getElementById("changeImage").click()'>
        更换头像
      </a>
        <input v-if="!showUp" type="file" accept="image/*" id="changeImage" style="visibility:hidden" @change="setImagePreview(1)">
    </div>
    <canvas width="80" height="80" id="mycanvas" style="display: none;"></canvas>
    <input v-if="showUp" type="button" class="button pointer" @click="uploadImg" value="上传">
    <input v-if="showUp" type="button" class="button pointer" @click="setImagePreview(0)" value="取消">
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    props:['path'],
    data() {
      return {
        showUp: false,
        hoverFlag: false,
        imgPath: '',
        store: require('../../app/store.js'),
        errorFlag: false
      }
    },
    computed: {
      errorInfo: function(){
        if (this.errorFlag == 1){
          return '图片大小不能超过200KB';
        } else if(this.errorFlag == 2){
          return '仅支持JPG/JPEG/PNG图片';
        }
      }
    },
    created () {
      this.imgPath = this.path;
      console.log(this.imgPath , this.path)
    },
    methods: {
      uploadImg: function(){
        var self = this;
        this.$http.post('/api/Users/updateAvatar', {
            'avatar': this.imgPath
          })
          .then(
            function () {
              self.showUp = false;
              location.reload();
            }
          )
      },
      // 上传头像
      setImagePreview:function(res) {
        var imgObjPreview = document.getElementById("showImage");
        var docObj = document.getElementById("changeImage");
        var self = this;
        if(res){
          var myCanvas = document.getElementById('mycanvas');
          var ctx = myCanvas.getContext('2d');
          var img = new Image();
          img.onload = function(){
            var fileData = docObj.files[0];
            console.log(fileData);
            if(fileData.size > 205600){
              self.errorFlag = 1;
            }else if (!/(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(fileData.type)){
              self.errorFlag = 2;
            } else {
              self.errorFlag = 0;
              self.showUp = true;
            }
            ctx.drawImage(img, 0, 0,80,80);
            // 将图片转化为base64编码格式的图片上传给后台
            self.imgPath = myCanvas.toDataURL('image/jpeg');
          };
          // 添加图片预览
          var binaryData = [];
          binaryData.push(docObj.files[0]);
          imgObjPreview.src = window.URL.createObjectURL(new File(binaryData, {type: "application/zip"}));
          // img.src必须放在img.onload之后，否则onload不会执行
          img.src = window.URL.createObjectURL(new File(binaryData, {type: "application/zip"}));
        } else {
          this.imgPath = this.path;
          this.showUp = false;
        }
      },
      showInfo: function(val){
        this.errorFlag = 0; // 清空可能出现的错误提示
        this.hoverFlag = val;
      }
    }
  };
</script>
<style lang="stylus">
  @import "../../assets/css/app.styl"
  @import "../../assets/css/variable.styl"
  @import "../../assets/css/table.styl"

  .m-name
    position relative
    .danger
      position absolute
      left -20px
      bottom -20px
      width 400px
      line-height 40px
      font-weight normal
      color red
    .hidden
      display hidden
  .file {
    position: relative;
    display: inline-block;
    bottom: 20px;
    margin-left: 10px;
    font-size: 12px;
    overflow: hidden;
    color: #0a81e5;
    text-decoration: underline;
    text-indent: 0;
  }
  .file input {
    position: absolute;
    font-size: 100px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 30px;
    opacity: 0;
    height:20px;
    width:100px;
  }
  .imgStyle {
    border-radius: 50%;
    width:50px;
    height:50px;
  }
</style>
