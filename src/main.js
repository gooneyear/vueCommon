// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'
import store from './store'
import App from './App'
import router from './router'
import API from './assets/js/api'
import jquery from 'jquery'
//引入表单验证插件
import validate from './validate'
//引入muse-ui框架
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-light.css'
Vue.use(MuseUI);

// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(vueResource);  // 后台ajax请求
Vue.use(API);  // 接口
Vue.http.options.emulateJSON = true; // 设置数据提交的方式为formData

// 添加双月显示的插件begin
import 'vue-bimonthly-calendar/dist/style.css'
import vueBimonthlyCalendar from 'vue-bimonthly-calendar'
Vue.use(vueBimonthlyCalendar, {locale: 'zh'}) //locale can be 'zh' , 'en'
// 添加双月显示的插件end

// 在请求发送前添加认证信息
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', 'Bearer ' + localStorage.access_token);
  request.headers.set('Accept', 'application/json');
  next(res => {
    if (res.status === 401) {
      router.push('/');
    }
  })
});

// 4. 创建和挂载根实例。
var vm = new Vue({
  router,
  store,
  validate,
  el: '#app',
  template: '<App/>',
  components: { App }
}).$mount('#app');
