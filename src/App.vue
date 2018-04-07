<template>
  <div id="app">
    <el-container>
      <el-header v-show="showHeader">
        <!--<router-link to="register" replace>-->
          <!--<span>注册</span>-->
        <!--</router-link>-->
        <el-menu :default-active="activeIndex" class="el-menu-demo header-menu"
                 mode="horizontal" @select="handleSelect" :router="true">
          <el-menu-item index="/main">首页</el-menu-item>
          <el-menu-item index="/eventWall">活动墙</el-menu-item>
          <el-submenu index="/account">
            <template slot="title">我的账户</template>
            <el-menu-item index="/userInfo" :route="routers.userInfo">
              <i class="el-icon-info"></i>
              <span slot="title">账号资料</span>
            </el-menu-item>
            <el-menu-item index="/hasJoin" :route="routers.hasJoin">
              <i class="el-icon-plus"></i>
              <span slot="title">我已参加</span>
            </el-menu-item>
            <el-menu-item index="/hasPost" :route="routers.hasPost">
              <i class="el-icon-edit"></i>
              <span slot="title">我已发布</span>
            </el-menu-item>
            <el-menu-item index="/hasStar" :route="routers.hasStar">
              <i class="el-icon-star-on"></i>
              <span slot="title">我已收藏</span>
            </el-menu-item>
            <el-menu-item index="/logout">
              <i class="el-icon-back"></i>
              <span slot="title">退出登录</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main :style="elMainStyle">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import UserInfo from '@/components/UserInfo'
  import UserHas from '@/components/UserHas'

  let whiteList = ['/', '/login', '/register', '/forgetPsw']

  export default {
    name: 'App',
    data () {
      return {
        activeIndex: 'main',
        routers: {
          userInfo: {
            path: '/info',
            name: 'info',
            title: '账号资料',
            component: UserInfo
          },
          hasPost: {
            path: '/userHas/post',
            component: UserHas
          },
          hasStar: {
            path: '/userHas/star',
            component: UserHas
          },
          hasJoin: {
            path: '/userHas/join',
            component: UserHas
          },
        }
      }
    },
    computed: {
      elMainStyle () {
        return {
          height: whiteList.indexOf(this.$route.path) === -1 ? '92vh' : '100vh',
          padding: '0'
        }
      },
      showHeader () {
        return whiteList.indexOf(this.$route.path) === -1
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath); // for debug
        if (key === '/logout') {
          this.logout()
        }
      },
      logout () {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/' })
        })
      }
    }
  }
</script>

<style>
  #app {
    fontFamily: "Microsoft YaHei UI Light";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .el-header {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 8vh !important;
    box-shadow: 0px 0px 5px darkgrey;
  }

  .el-main {
    background-color: white;
    color: #333;
  }

  .header-menu {
    padding-left: 78%;
  }
</style>
