import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

// 在request 拦截器中，展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})
// 在response 拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config;
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
