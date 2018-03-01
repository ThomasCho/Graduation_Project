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
          <el-submenu index="/account">
            <template slot="title">我的账户</template>
            <el-menu-item index="/userInfo" :route="routers.userInfo">
              <i class="el-icon-info"></i>
              <span slot="title">账号资料</span>
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

  export default {
    name: 'App',
    data () {
      return {
        showHeader: this.$route.path !== '/' && this.$route.path !== '/login',
        activeIndex: 'main',
        routers: {
          userInfo: {
            path: '/info',
            name: 'info',
            title: '账号资料',
            component: UserInfo
          }
        }
      }
    },
    computed: {
      elMainStyle () {
        let showHeader = this.$route.path !== '/' && this.$route.path !== '/login'
        return {
          height: showHeader ? '92vh' : '100vh',
          padding: showHeader ? '20px 20px 20px 50px' : '0'
        }
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
    font-family: helvetica,arial,微软雅黑,华文黑体;
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
    padding-left: 88%;
  }
</style>
