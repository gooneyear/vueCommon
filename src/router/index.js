import Vue from 'vue'
import Router from 'vue-router'

// 1. 引入路由组件。
import reset from '../app/reset.vue'
import login from '../app/login.vue'
import doc from '../app/doc.vue'
import cases from '../app/cases.vue'
import evaluation from '../app/evaluation.vue'
import train from '../app/train.vue'
import activation from '../app/activation.vue'
import userSet from '../components/service/doc/userSet.vue'

import caselist from '../components/service/doc/caselist.vue'
import caseinfo from '../components/service/case/baseInfo/caseinfo.vue'
import caseDiag from '../components/service/case/caseDiag/caseDiag.vue'
import evalRecord from '../components/service/evaluation/evalRecord.vue'
import evalContent from '../components/service/evaluation/evalContent.vue'//wd
import recordDetail from '../components/service/evaluation/recordDetail.vue'//wd
import startEval from '../components/service/evaluation/startEval.vue'//wd
import printWab from '../components/service/evaluation/printWab.vue'//wd
import print10 from '../components/service/evaluation/print10.vue'//wd
import trainPlan from '../components/service/case/trainPlan/trainPlan.vue'
import trainRecord from '../components/service/case/trainRecord/trainRecord.vue'
import collectInfo from '../components/service/case/collectInfo/collectInfo.vue'
import caseOrder from '../components/service/case/caseOrder/caseOrder.vue'

import order from '../app/order.vue'
import orderList from '../components/service/order/orderList.vue'
import orderPay from '../components/service/order/orderPay.vue'
import orderInfo from '../components/service/order/orderInfo.vue'

Vue.use(Router);

// 2. 定义路由及嵌套规则
const routes = [
  { path: '/', component: login },
  { path: '/doc', component: doc ,
    children: [
      { path: 'caselist', name:'caselist', component: caselist },
      { path: 'cases', name:'cases', component: cases,
        children: [
          { path: 'caseinfo/:id', name:'caseinfo', component: caseinfo },
          { path: 'caseDiag/:id', name:'caseDiag', component: caseDiag },
          { path: 'evalRecord/:id', name:'evalRecord', component: evalRecord },
          { path: 'recordDetail/:id/:aid', name:'recordDetail', component: recordDetail },
          { path: 'recordDetail/:id', name:'recordDetail2', component: recordDetail },
          { path: 'trainPlan/:id', name:'trainPlan', component: trainPlan },
          { path: 'trainRecord/:id', name:'trainRecord', component: trainRecord },
          { path: 'collectInfo/:id', name:'collectInfo', component: collectInfo },
          { path: 'caseOrder/:id', name:'caseOrder', component: caseOrder }
        ]
      },
      { path: 'evaluation', name:'evaluation', component: evaluation ,
        children:[
          { path: 'evalContent/:id', name:'evalContent', component: evalContent }
        ]
      },
      { path: 'startEval', name:'startEval', component: startEval },
      { path: 'train', name:'train', component: train },
      { path: 'orderList', name:'orderList', component: orderList },
      { path: 'orderPay/:id', name:'orderPay', component: orderPay },
      { path: 'order', name:'order', component: order ,
        children:[
          { path: 'orderInfo/:id', name:'orderInfo', component: orderInfo }
        ]
      },
      { path: 'userSet', name:'userSet', component: userSet }
    ]
  },
  { path: '/active', component: activation },
  { path: '/reset', component: reset },
  { path: '/printwab/:reportid/:uid', component: printWab },
  { path: '/print10/:aid/:uid', component: print10 },
];


export default new Router({
  linkActiveClass: 'u-link--Active',
  routes
})
