<template id="my-echarts">
  <div class="echart" :id="'echart'+index">
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .echart{
    width: 500px;
    height: 250px;
  }
@media (-webkit-max-width: 1024px),(max-width:1024px){
  .echart{
    width:400px;
    height:200px;
  }
  .echart div{
    width:400px !important;
    height:200px !important;
  }
  .echart canvas{
    width:360px !important;
    height:180px !important;
    left:26px !important;
    top:20px !important;
  }
}

</style>

<script>
  import Vue from 'vue'
  import echarts from 'echarts'
  import {dateFormat} from '../../assets/js/common.js'
  export default ({
    /*
    * index: 图标ID，避免绘图时冲突
    * curData: 当前图标数据
    * chartData: 所有图标数据，用于遍历
    * */
    props: ['name', 'date', 'index','curData', 'chartData'],
    data() {
      return {
        dataNum: 5,    // 定义图表中显示的数据个数
        now: new Date(),
      }
    },
    mounted() {
      this.getChartData();
      this.time_delta('done');
    },
    // 销毁子组件后重建，避免第一个数据不更新的问题
    destroyed() {
      this.$parent.showChart = true;
    },
    methods: {
      time_delta: function(msg)
      {
        var dt = new Date();
        console.log(`${msg}; delta: ${(dt.getTime() - this.now.getTime()) / 1000}`);
      },
      getChartData: function(){
        var xDate = [];
        var yData = [];
        //this.chartData = {...this.chartData};
        var times = Object.keys(this.chartData);
        for(var i=0; i<times.length; i++){
          for(var j=0; j<this.chartData[times[i]].length; j++){
            var item = this.chartData[times[i]][j];
            if(item.name == this.curData.name){
              xDate.push(item.trainDate);
              yData.push(item.maxScore);
              break;
            }
          }
        }

        // 找出当前日期所处的位置
        var midID = 0;
        var tempX = [];
        var tempY = [];
        for (var k=0; k<xDate.length; k++){
          if(this.date == xDate[k]){
            midID = k;
          }
        }

        // 根据当前日期重组数据
        for(var l=0; l<this.dataNum; l++){
          tempX.push(xDate[midID+l-2]);
          tempY.push(yData[midID+l-2]);
        }
        // 清除数组中未定义的值
        var cleanX = [];
        var cleanY = [];
        for (var m=0; m<this.dataNum; m++) {
          if(typeof tempX[m] != 'undefined'){
            cleanX.push(dateFormat(tempX[m],"/"));
            cleanY.push(tempY[m]);
          }
        }
        this.showCharts(cleanX,cleanY);
      },
      showCharts: function(x,y) {
        var options = {
          title: {
            text: this.name,
            x: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          // 显示折线的名称
//          legend: {
//            data:['分数']
//          },
          xAxis: {
            name: '日期',
            nameTextStyle: {
              color: '#444'
            },
            axisLine: {
              lineStyle: {
                color: '#eee'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#444'
              }
            },
            // 从y轴开始显示
            boundaryGap : false,
            data: x
          },
          yAxis: {
            name: '最高得分',
            nameTextStyle: {
              color: '#444'
            },
            axisLine: {
              lineStyle: {
                color: '#eee'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#444'
              }
            },
            splitLine: {
              lineStyle: false
            }
          },
          series: [{
            name: ['分数'],
            type: 'line',
            itemStyle: {
              normal: {
                // 填充区域颜色
                areaStyle: {
                  type: 'default',
                  color:'#CDE5FA'
                },
                // 曲线颜色
                lineStyle: {
                  color: '#0a81e5'
                },
                // 标注颜色
                color: '#0a81e5'
              }
            },
            // 折线平滑展示
            smooth: true,
            data: y
          }]
        };
        // 基于准备好的dom，初始化echarts实例
        var chartID = 'echart'+this.index;
        var myChart = echarts.init(document.getElementById(chartID));
        // 使用指定的配置项和数据显示图表。
        myChart.setOption(options);
      }
    }
  })
</script>
