<template>
  <ul class="pagination">
    <li v-show="current != 1" @click="current-- && goto(current)">
      <a href="javascript:void(0);" class="lileft">
        <
      </a>
    </li>
    <li v-for="index in pages" @click="goto(index.index)" :class="{'active':current == index.index}" :key="index.index">
      <!--<a href="javascript:void(0);" >{{index}}</a>-->
      <a href="javascript:void(0);" @click="showRecord(index.id)">
        <span>{{index.scalename}}</span><span>{{index.modifytime | time}}</span>
      </a>

    </li>
    <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)">
      <a href="javascript:void(0);" class="liright">
      >
    </a>
    </li>
  </ul>
</template>
<script>
  import Vue from 'vue';

  export default ({
    // 从父组件接受测评报告列表数据
    props: ['reportLists'],
    data() {
      return{
        current:1,
        showItem:5,
        allpage:0,//初始化页面个数，数值没有实际作用
        lists:this.reportLists,
        listsdetails:[],
      }
    },
    computed:{
      pages:function(){
          //動態配置父頁面的測評報告列表
          this.lists = this.reportLists;
          this.allpage = parseInt(this.reportLists.data.length);
        var pag = [];
        var ll = [];
        var self = this;
        if( this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
          //总页数和要显示的条数那个大就显示多少条
          var i = Math.min(this.showItem,this.allpage);
          while(i){
            pag.unshift(i--);
          }
          pagg(pag,self);
        }else{ //当前页数大于显示页数了
          var middle = this.current - Math.floor(this.showItem / 2 ),//从哪里开始
            i = this.showItem;
          if( middle >  (this.allpage - this.showItem)  ){
            middle = (this.allpage - this.showItem) + 1
          }
          while(i--){
            pag.push( middle++ );
          }
          pagg(pag,self);
        }
//        console.log(pag);
        //格式化测评报告列表
        function pagg(pag,self){
          for(var pp in pag){
            ll[pp]={};
            ll[pp].index = pag[pp];
            ll[pp].id = self.lists.data[pag[pp]-1].id;
            ll[pp].scalename = self.lists.data[pag[pp]-1].scalename;
            ll[pp].modifytime = self.lists.data[pag[pp]-1].modifyTime;
          }
        }
        //end格式化测评报告列表
//        console.log(ll);

        return ll
      }
    },
    methods: {
      goto:function(index){
        if(index == this.current) return;
        this.current = index;
        //这里可以发送ajax请求
      },showRecord:function(id){
          //更新父頁面的測評詳情資料
        alert(id);
          this.$parent.getRecordDetails(id);
      }
    },mounted(){
//      this.allpage = parseInt(this.lists.page.total);

    },
    beforeUpdate(){
    }
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../../../assets/css/app.styl";
  @import "../../../assets/css/variable.styl";

  li{
    list-style:none;
  }
  a{
    text-decoration:none;
  }
  .pagination {
    position: relative;

  }
  .pagination li{
    display: inline-block;
    margin:0;
  }
  .pagination li a{
    padding:0 1rem;
    display:inline-block;
    /*border:1px solid #ddd;*/
    background:#f8f8f8;
  }
  .pagination li a:hover{
    background:#f8f8f8;
  }
  .pagination li.active a{
    background:#0a81e5;
    color:#fff;
  }
  .pagination li a span{
    display: block;
    height 30px
    line-height 30px
  }
  a.lileft
    position absolute
    top 0
    right 41px
  a.liright
    position absolute
    top 0
    right 0
  @media print {
    .pagination{
      display:none !important;
    }
  }
</style>
