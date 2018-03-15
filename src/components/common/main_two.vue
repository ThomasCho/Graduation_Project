<template>
  <div class="main-two">
    帮您解决活动管理难题
    <el-row class="main-two_list">
      <el-col :span="6">
        <img src="../../assets/img/page2-publish.png" class="main-two_img">
        <div>活动发布</div>
      </el-col>
      <el-col :span="6">
        <img src="../../assets/img/page2-admin.png" class="main-two_img">
        <div>活动管理</div>
      </el-col>
      <el-col :span="6">
        <img src="../../assets/img/page2-list.png" class="main-two_img">
        <div>名单管理</div>
      </el-col>
      <el-col :span="6">
        <img src="../../assets/img/page2-comment.png" class="main-two_img">
        <div>留言管理</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Main_Two',
  }
</script>

<style>
  .main-two {
    width: 100%;
  }
  .main-two_list {
    margin-top: 100px;
    font-size: 18px;
  }
  .main-two_img {
    margin-bottom: 20px;
  }
</style>
