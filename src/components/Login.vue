<template>
  <div class="login-page-background">
    <div class="login-page-form">
      <span>帐号密码登录</span>

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="psw">
          <el-input v-model="form.psw" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin" class="login-page-form_btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        form: {
          name: '',
          psw: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入账号'},
          ],
          psw: [
            { required: true, message: '请输入密码'}
          ]
        }
      }
    },
    methods: {
      onLogin () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            this.$message.error('请输入账号和密码');
            return false;
          }
        })
      }
    }
  }
</script>

<style>
  .login-page-background {
    height: 100%;
    width: 100%;
    background: url('../assets/background.png') center;
    background-size: cover;
    text-align: right;
  }
  .login-page-form {
    width: 25%;
    height: 50%;
    margin: 100px 80px 0 0;
    display: inline-block;
    padding: 20px 40px;
    background-color: white;
    text-align: center;
    font-size: 20px;
    border-radius: 4px;
  }
  .login-page-form_btn {
    width: 100%;
  }
</style>
