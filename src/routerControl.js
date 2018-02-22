import router from './router'
import store from './store'

const whiteList = ['/login', '/authredirect'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login' || to.path === '/') {
      next({path: '/main'})
    } else {
      // 拉取user_info
      store.dispatch('GetInfo').then(() => {
        next()
      }).catch(() => {
        store.dispatch('LogOut').then(() => {
          next({path: '/login'})
        })
      })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})
