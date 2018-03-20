<template>
  <div class="login-page-background" :style="changeBackground">
    <img src="../assets/img/login_logo.png" class="login-page-logo">
    <div class="login-page-form">
      <span class="login-page-form_title">帐号密码登录</span>

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码"
                    @keyup.enter.native="onLogin" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin" class="login-page-form_btn">登录</el-button>
        </el-form-item>
      </el-form>

      <div class="login-page-form_bottom">
        <router-link to="forgetPsw">忘记密码?</router-link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <router-link to="register">注册新账号</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      let validateEmail = (rule, value, callback) => {
        if (value === '' || !/^[\d]{2}[a-z]{3,}[\d]?$/.test(value)) {
          callback(new Error('请输入汕大邮箱'))
        } else {
          callback()
        }
      }

      return {
        form: {
          email: '',
          password: ''
        },
        rules: {
          email: [
            { validator: validateEmail, trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码'}
          ]
        }
      }
    },
    computed: {
      changeBackground () {
        let currentImg = Math.floor(Math.random() * 3)
        let imgArr = ['login_one.png', 'login_two.png', 'login_three.png']
        return {
          backgroundImage: 'url(' + require('../assets/img/' + imgArr[currentImg]) + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }
    },
    methods: {
      onLogin () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$store.dispatch('LoginByEmail', this.form).then(() => {
              this.$message.success('登录成功')
              this.$router.push({ path: '/main' })
            }).catch(err => {
              this.$message.error(err)
            })
          } else {
            this.$message.error('请输入账号和密码')
            return false
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
    text-align: right;
  }
  .login-page-logo {
    margin: 0 15% 20vh 0;
  }
  .login-page-form {
    width: 25%;
    height: 43%;
    margin: 200px 80px 0 0;
    display: inline-block;
    padding: 20px 40px;
    background-color: white;
    text-align: center;
    font-size: 20px;
    border-radius: 4px;
    box-shadow: 0 0 50px #888888;
  }
  .login-page-form_btn {
    width: 100%;
  }
  .login-page-form_title {
    display: inline-block;
    margin: 20px 0;
  }
  a {
    color: #666;
    text-decoration: none;
    font-size: 14px;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
