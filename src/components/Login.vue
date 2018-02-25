<template>
  <div class="login-page-background">
    <div class="login-page-form">
      <span>帐号密码登录</span>

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
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        form: {
          email: '',
          password: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入账号'},
          ],
          password: [
            { required: true, message: '请输入密码'}
          ]
        }
      }
    },
    methods: {
      onLogin () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$store.dispatch('LoginByEmail', this.form).then((res) => {
              if (res.success) {
                this.$message.success('登录成功')
                this.$router.push({ path: '/main' })
              } else {
                this.$message.error(res.message)
              }
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
    box-shadow: 0 0 50px #888888;
  }
  .login-page-form_btn {
    width: 100%;
  }
</style>
