// 以下是定义表单验证的默认设置
import Vue from 'vue'
import veeExtend from './veeExtend'
import VeeValidate,{Validator} from 'vee-validate'
import messagesCN from './zh_CN.js';
const veeConfig = {
  errorBagName: 'errors', // change if property conflicts.
  delay: 0,
  locale:'cn',
  messages: null,
  strict: true,
  dictionary:{
    cn:{
      messages: messagesCN
    },
    en:{
      messages: messagesCN
    }
  }
};
Vue.use(VeeValidate, veeConfig);
