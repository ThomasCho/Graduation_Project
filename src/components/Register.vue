<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="register-page_img"></div>
      </el-col>
      <el-col :span="16">
        <span class="register-page_title">欢迎注册校园邀约活动平台</span>
        <span class="register-page_subtitle">每一天，乐在交友。</span>
        <el-form ref="form" :model="form" :rules="rules" class="register-page_form" label-position="left">
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="账号" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码"
                      auto-complete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPsw">
            <el-input type="password" v-model="form.confirmPsw"
                      auto-complete="off" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onRegister" class="register-page_btn">立即注册</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data () {
      let validateEmail = (rule, value, callback) => {
        if (value === '' || !/^[\d]{2}[a-z]{3,}[\d]?$/.test(value)) {
          callback(new Error('请输入汕大邮箱'))
        } else {
          callback()
        }
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入登录密码'))
        } else {
          if (this.form.password !== '') {
            this.$refs.form.validateField('confirmPsw')
          }
          callback()
        }
      }
      let validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        form: {
          email: '',
          password: '',
          confirmPsw: ''
        },
        rules: {
          email: [
            { validator: validateEmail, trigger: 'blur'}
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          confirmPsw: [
            { validator: validateConfirmPass, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onRegister () {
        let submitData = this.form

        this.$refs.form.validate((valid) => {
          if (valid) {
            this.fetch({
              url: 'api/user/register',
              method: 'post',
              data: submitData
            }).then((res) => {
              if (res.data.success) {
                this.$message.success('注册成功')

                this.$store.dispatch('LoginByEmail', {
                  email: this.form.email,
                  password: this.form.password
                }).then(() => {
                  this.$router.push({ path: '/main' })
                }).catch(err => {
                  this.$message.error(err)
                })
              } else {
                this.$message.error(res.data.message)
              }

            }).catch(err => {
              this.$message.error(err)
            })
          } else {
            this.$message.error('请输入必填项')
            return false
          }
        })
      }
    }
  }
</script>

<style>
  .register-page_title {
    font-size: 44px;
    margin: 100px 0 0 11%;
    display: block;
  }
  .register-page_subtitle {
    font-size: 28px;
    margin: 20px 0 0 11%;
    display: block;
  }
  .register-page_btn {
    width: 100%;
  }
  .register-page_form {
    margin: 70px 0 0 11%;
    width: 50%;
  }
  .register-page_img {
    width: 100%;
    height: 100vh;
    background: url(../assets/img/register.jpg) center;
  }
</style>
