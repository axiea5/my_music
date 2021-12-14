import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'

// 统一各个浏览器css的效果
import 'normalize.css/normalize.css'
import '@/styles/normal.less'

// eletron-store
import './store/index'

// element自定义主题颜色
import '@/styles/theme/index.css'
// ElementUI
Vue.use(ElementUI)
// import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

