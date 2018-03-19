<template>
  <div style="padding: 20px;">
    <el-steps :active="active" finish-status="success">
      <el-step title="填写帐号"></el-step>
      <el-step title="输入验证码"></el-step>
      <el-step title="设置新密码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <el-form ref="form" :model="form" :rules="rules" v-show="active === 0" class="forgetPsw-page_form">
      <el-form-item prop="email">
        <el-input v-model="form.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="与该邮箱绑定的电话号码"></el-input>
      </el-form-item>
    </el-form>

    <el-form ref="codeForm" :model="verification" :rules="codeRules" v-show="active === 1" class="forgetPsw-page_form">
      <el-form-item prop="code">
        <el-input v-model="verification.code" placeholder="手机上收到的验证码"></el-input>
      </el-form-item>
    </el-form>

    <el-form ref="newPswForm" :model="newPsw" :rules="newPswRules" v-show="active === 2" class="forgetPsw-page_form">
      <el-form-item prop="psw">
        <el-input v-model="newPsw.psw" placeholder="输入新密码"
                  auto-complete="off" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPsw">
        <el-input v-model="newPsw.confirmPsw" placeholder="再次输入新密码"
                  auto-complete="off" type="password"></el-input>
      </el-form-item>
    </el-form>

    <div v-show="active === 3" class="forgetPsw-page_success-page">
      <img src="../assets/img/changePsw.png">
    </div>

    <el-button style="margin: 12px 0 0 40%;" @click="next">
      {{active === 3 ? '返回登录界面' : '下一步'}}
    </el-button>
  </div>
</template>

<script>
  const TOTAL_STEPS = 3

  export default {
    name: 'ForgetPsw',
    data () {
      let validateEmail = (rule, value, callback) => {
        if (value === '' || !/^[\d]{2}[a-z]{3,}[\d]?$/.test(value)) {
          callback(new Error('请输入汕大邮箱'))
        } else {
          callback()
        }
      }
      let validatePhone = (rule, value, callback) => {
        if (value === '' || !/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(value)) {
          callback(new Error('请输入与该邮箱绑定的电话号码'))
        } else {
          callback()
        }
      }
      let validateCode = (rule, value, callback) => {
        if (value === '' || !/^[\d]{6}$/.test(value)) {
          callback(new Error('请输入手机上收到的6位数的验证码'))
        } else {
          callback()
        }
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.newPsw.psw !== '') {
            this.$refs.newPswForm.validateField('confirmPsw')
          }
          callback()
        }
      }
      let validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.newPsw.psw) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        active: 0,
        form: {
          email: '',
          phone: ''
        },
        rules: {
          email: [
            { validator: validateEmail, trigger: 'blur'}
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        codeRules: {
          code: [
            { validator: validateCode, trigger: 'blur'}
          ]
        },
        newPswRules: {
          psw: [
            { validator: validatePass, trigger: 'blur'}
          ],
          confirmPsw: [
            { validator: validateConfirmPass, trigger: 'blur'}
          ]
        },
        verification: {
          code: ''
        },
        newPsw: {
          psw: '',
          confirmPsw: ''
        }
      }
    },
    methods: {
      // 获取验证码
      sendCode () {
        this.fetch({
          url: 'api/verification',
          method: 'post',
          data: {
            phone: this.form.phone
          }
        }).then((res) => {
          if (res.data.success) {
            console.log(res.data.message)
            if (this.active++ > TOTAL_STEPS) {
              this.active = 0
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      // 校验验证码
      verifyCode () {
        this.fetch({
          url: 'api/verifyCode',
          method: 'post',
          data: {
            code: this.verification.code,
            phone: this.form.phone
          }
        }).then((res) => {
          if (res.data.success) {
            if (this.active++ > TOTAL_STEPS) {
              this.active = 0
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      // 验证某个用户的账号和所留电话号码是否相符，用于忘记密码功能
      verifyUserAndPhone () {
        this.fetch({
          url: 'api/verifyUserAndPhone',
          method: 'post',
          data: {
            email: this.form.email,
            phone: this.form.phone
          }
        }).then((res) => {
          if (res.data.success) {
            this.sendCode()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      // 输入新密码，提交
      updatePsw () {
        this.fetch({
          url: 'api/user/forgetPsw',
          method: 'put',
          data: {
            email: this.form.email,
            newPsw: this.newPsw.confirmPsw
          }
        }).then((res) => {
          if (res.data.success) {
            if (this.active++ > TOTAL_STEPS) {
              this.active = 0
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      next () {
        if (this.active === 0) {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.verifyUserAndPhone()
            } else {
              this.$message.error('请输入账号和手机号码')
              return false
            }
          })
        } else if (this.active === 1) {
          this.$refs.codeForm.validate((valid) => {
            if (valid) {
              this.verifyCode()
            } else {
              this.$message.error('请输入手机上收到的6位数的验证码')
              return false
            }
          })
        } else if (this.active === 2) {
          this.$refs.newPswForm.validate((valid) => {
            if (valid) {
              this.updatePsw()
            } else {
              this.$message.error('请输入新密码')
              return false
            }
          })
        } else if (this.active === 3) {
          this.$router.replace({ path: '/' })
        }
      }
    }
  }
</script>

<style>
  .forgetPsw-page_form {
    margin: 150px 0 0 40%;
    width: 20%;
  }
  .forgetPsw-page_success-page {
    margin: 10vh 0 5vh 35%;
  }
</style>
