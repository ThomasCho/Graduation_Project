<template>
  <div>
    <div class="main-one_title">校园邀约活动平台</div>
    <div class="main-one_subtitle">快速发布&nbsp;&nbsp;/&nbsp;&nbsp;便捷管理&nbsp;&nbsp;/&nbsp;&nbsp;免服务费</div>
    <el-button type="primary" class="main-one_start-btn" @click="linkToPublishPage">免费使用</el-button>
  </div>
</template>

<script>
  export default {
    name: 'Main_One',
    methods: {
      linkToPublishPage () {
        this.$router.push({ path: '/publish' })
      }
    }
  }
</script>

<style>
  .main-one_title {
    font-size: 60px;
  }
  .main-one_subtitle {
    margin-top: 30px;
    font-size: 20px;
  }
  .main-one_start-btn {
    width: 25%;
    margin-top: 50px;
  }
</style>
