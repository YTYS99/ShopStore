import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入 axios
import axios from 'axios'
// 设置接口根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器，在请求数据前 设置传递的数据
axios.interceptors.request.use(config => {
  // 在 头文件 中挂在一个 Authorization 值，为登陆后 调用 其他需要权限的 api 时，提供一个命令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将 axios 挂载到 vue 上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
