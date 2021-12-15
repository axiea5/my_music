import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 主页自动重定向到本地音乐页面
    redirect: '/local_music'
  },
  {
    path: '/local_music',
    component: () => import('@/views/localMusic/index'),
    meta: { title: '本地音乐' }
  }, {
    path: '/find_music',
    component: () => import('@/views/findMusic/index'),
    meta: { title: '发现音乐' }
  }, {
    path: '/collect_music',
    component: () => import('@/views/collectMusic/index'),
    meta: { title: '我的收藏' }
  }, {
    path: '/list_music',
    component: () => import('@/views/listMusic/index'),
    meta: { title: '我的歌单' }
  }, {
    path: '/load_music',
    component: () => import('@/views/loadMusic/index'),
    meta: { title: '下载管理' }
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/local_music', hidden: true }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
