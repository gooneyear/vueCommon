/**
 * Created by Administrator on 2017-05-10.
 */
let API = {
  trainPlan: {
    //自定义保存方案
    saveSelfPlan: '/api/Train/updateManualProgram',
    //系统推荐保存方案
    saveCommandPlan: '/api/Train/updateManualProgram'
  }
}
let plugin = {};
plugin.installed = false;
plugin.install = function (Vue){
  if (plugin.installed) {
    return;
  }
  Vue.prototype.$API = API;
  plugin.installed = true;
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}
export default plugin;
