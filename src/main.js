import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

// 统一各个浏览器css的效果
import 'normalize.css/normalize.css'

import '@/styles/normal.less'

// element自定义主题颜色
import '@/styles/theme/index.css'
// ElementUI
// import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
