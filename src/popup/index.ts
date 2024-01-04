/*
 * @Author: cwd
 * @Date: 2024-01-03 14:55:30
 * @LastEditors: cwd
 * @LastEditTime: 2024-01-04 09:52:06
 * @FilePath: \chromepie-nozhihu\no-fishing-allowed\src\popup\index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by cwd, All Rights Reserved. 
 */
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import routes from '~pages'
import '../assets/base.scss'
import App from './app.vue'
import './index.scss'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
routes.push({
  path: '/',
  redirect: '/popup',
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next('/popup')
  }

  next()
})

createApp(App).use(router).use(ElementPlus,{
  locale: zhCn,
}).mount('#app')
