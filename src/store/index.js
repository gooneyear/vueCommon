/**
 * Created by zhouxin on 2017/8/7.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 定义全局状态，VUEX使用
export default new Vuex.Store({
  state: {
    // 用于存储患者基本资料、信息采集页中修改后的信息
    caseName: '',
    case:{
      name: '',
      age: 0,
      gender: ''
    },
    // 用于存储登录医生修改页中需要多组件共享的信息
    login: {
      name: '',
      imgPath: ''
    },
    evalItems:{
      show:true,
      hide:false,
    },
  },
  mutations: {
    changeInfo (state,caseName) {
      state.caseName = caseName;
    },
    changeEvalMenu (state,evalItems) {
      state.evalItems.show = true;
      state.evalItems.hide = false;
    },
    changeEval (state,evalItems) {
      state.evalItems.show = false;
      state.evalItems.hide = true;
    },
    clearEval (state,evalItems) {
      state.evalItems.show = false;
      state.evalItems.hide = false;
    }
  },
  actions: {
    changeInfo (context,caseName) {
      context.commit('changeInfo',caseName);
    }
  }
});
