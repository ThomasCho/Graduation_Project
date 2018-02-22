import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Users from '@/components/Users'
import Register from '@/components/Register'
import Main from '@/components/Main'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '403',
      name: '403',
      title: '无权限访问',
      component: Error
    },
    {
      path: '/',
      name: 'Login',
      title: '系统登录',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      title: '系统登录',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      title: '首页',
      component: Main
    },
    {
      path: '/register',
      name: 'register',
      title: '系统注册',
      component: Register
    },
    {
      path: '/user',
      name: 'Users',
      component: Users
    },
    {
      path: '/user/:email',
      name: 'Users',
      component: Users
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
