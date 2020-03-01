import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid' // 导入树形表格
import './assets/css/global.css' // 导入全局样式表
import './assets/fonts/iconfont.css' // 导入字体图标

import axios from 'axios' // 导入 axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 设置接口根路径
// 请求拦截器，在请求数据前 设置传递的数据
axios.interceptors.request.use(config => {
  // 在 头文件 中挂在一个 Authorization 值，为登陆后 调用 其他需要权限的 api 时，提供一个命令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios // 将 axios 挂载到 vue 上
Vue.component('tree-table', TreeTable) // 将 vue-table-with-tree-grid 注册为一个全局组件
// 时间过滤器
Vue.filter('dataFormat', function (origValue) {
  const dt = new Date(origValue)
  const y = dt.getFullYear() // 年份
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 小于10 用 0 来补充
  const d = (dt.getDate() + '').padStart(2, '0') // 小于10 用 0 来补充
  const HH = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${HH}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
