import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Error from '@/components/Error'
import UserInfo from '@/components/UserInfo'
import PublishEvent from '@/components/PublishEvent'
import ForgetPsw from '@/components/ForgetPsw'
import Register from '@/components/Register'
import EventWall from '@/components/EventWall'
import Event from '@/components/Event'
import UserHas from '@/components/UserHas'
import Admin from '@/components/Admin'
import HasFollow from '@/components/HasFollow'
import FollowBy from '@/components/FollowBy'
import EventCard from '@/components/common/event_card'
import DataAnalysis from '@/components/DataAnalysis'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/403',
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
      path: '/info',
      name: 'info',
      title: '账号资料',
      component: UserInfo
    },
    {
      path: '/publish',
      name: 'publish',
      title: '活动发布',
      component: PublishEvent
    },
    {
      path: '/eventWall',
      name: 'eventWall',
      title: '活动墙',
      component: EventWall
    },
    {
      path: '/event',
      name: 'event',
      title: '活动',
      component: Event
    },
    {
      path: '/forgetPsw',
      name: 'forgetPsw',
      title: '忘记密码',
      component: ForgetPsw
    },
    {
      path: '/register',
      name: 'register',
      title: '注册新账号',
      component: Register
    },
    {
      path: '/userHas/:type',
      name: 'userHas',
      title: '用户已',
      component: UserHas
    },
    {
      path: '/admin',
      name: 'admin',
      title: '管理员页面',
      component: Admin
    },
    {
      path: '/hasFollow',
      name: 'hasFollow',
      title: '已关注',
      component: HasFollow
    },
    {
      path: '/followBy',
      name: 'followBy',
      title: '被关注',
      component: FollowBy
    },
    {
      path: '/eventCard/:id',
      name: 'eventCard',
      title: '活动卡片',
      component: EventCard
    },
    {
      path: '/dataAnalysis',
      name: 'dataAnalysis',
      title: '数据统计分析',
      component: DataAnalysis
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
