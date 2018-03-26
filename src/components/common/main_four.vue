<template>
  <div>
    <el-row class="main-four_list" :gutter="150">
      <el-col :span="8">
        <div>
          <p class="main-four_list-title">客服支持</p>
          <p>客服反馈: 14zmcao@stu.edu.cn</p>
          <p>客服QQ: 371331811</p>
          <p>帮助中心</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p class="main-four_list-title">商务合作</p>
          <p>商务邮箱: bb371331811@msn.cn</p>
          <p>商务QQ: 371331811</p>
        </div>
      </el-col>
      <el-col :span="8">
        <img src="../../assets/img/QRCode.jpg" class="main-four_QRCode">
        <div class="main-four_list-title main-four_QRCode-title">扫码加微信</div>
      </el-col>
    </el-row>
    <div class="main-four_contact">汕头大学计算机系学生曹智铭版权所有</div>
  </div>
</template>

<script>
  export default {
    name: 'Main_Four',
  }
</script>

<style>
  .main-four_QRCode {
    width: 300px;
    height: 330px;
    margin-bottom: 20px;
  }
  .main-four_list {
    margin-top: 100px;
    font-size: 18px;
    text-align: left;
  }
  .main-four_list-title {
    font-weight: bold;
    font-size: 24px;
  }
  .main-four_QRCode-title {
    margin-left: 37%;
  }
  .main-four_contact {
    margin: 50px 0 -70px 0;
    font-size: 16px;
    height: 80px;
  }
</style>
