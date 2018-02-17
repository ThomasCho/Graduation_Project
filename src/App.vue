<template>
  <div id="app">
    <el-container>
      <el-header v-show="showHeader">
        <router-link to="register" replace>
          <span>注册</span>
        </router-link>
      </el-header>
      <el-main :style="{height: showHeader ? '87vh' : '100vh'}">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        showHeader: this.$route.path !== '/'
      }
    }
  }
</script>

<style>
  #app {
    font-family: helvetica,arial,微软雅黑,华文黑体;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 13vh !important;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding: 0;
  }
</style>
