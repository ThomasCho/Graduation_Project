import router from './router'
import store from './store'

const whiteList = ['/login', '/forgetPsw', '/register'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
    // 拉取user_info
    store.dispatch('GetInfo')
      .then(() => {
        if (store.getters.isAdmin === 1 && to.path !== '/admin' && to.path !== '/event' && to.path !== '/dataAnalysis') {
          // 如果管理员跳转到 /admin 或 /event 或 /dataAnalysis 页面以外的页面，则重导向回 /admin 页面
          next({path: '/admin'})
        } else if (to.path === '/login' || to.path === '/') {
          next({path: '/main'})
        } else if (store.getters.isAdmin !== 1 && to.path === '/admin') {
          // 又不是管理员，又想跳转到管理员界面的，重导向到403页面
          next({path: '/403'})
        } else {
          next()
        }
      })
      .catch(() => {
        store.dispatch('LogOut').then(() => {
          next({path: '/login'})
        })
      })
  } else {
    if (whiteList.indexOf(to.path) !== -1 || whiteList.indexOf(to.redirectedFrom) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})
