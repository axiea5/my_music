import Vue from 'vue'

// 本地音乐存储
const LocalStore = require('./LocalStore')
Vue.prototype.$localStore = new LocalStore({ name: 'Music Data' })

// 当前播放
const PlayStore = require('./PlayStore')
Vue.prototype.$playStore = new PlayStore({ name: 'Music Data' })
