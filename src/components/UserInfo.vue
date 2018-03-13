<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">我的账户</el-breadcrumb-item>
      <el-breadcrumb-item>账号资料</el-breadcrumb-item>
    </el-breadcrumb>

    <el-tabs v-model="activeName" @tab-click="handleClick" class="userinfo_tabpane">
      <el-tab-pane label="基本资料" name="basicInfo">
        <el-form ref="infoForm" :model="infoForm" :rules="infoRules" label-position="left" label-width="100px">
          <el-form-item prop="avatar" label="头像">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              action="api/img/avatar"
              :headers="uploadHeaders"
              :show-file-list="true"
              limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-error="handleUploadError"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false">

              <img slot="trigger" v-if="fileList.length || infoForm.avatar"
                   :src="fileList[0] ? fileList[0].url : infoForm.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>

              <div slot="tip" class="el-upload__tip">只能上传一个jpg/png文件，且不超过2Mb</div>
            </el-upload>
          </el-form-item>
          <el-form-item prop="name" label="昵称">
            <el-input v-model="infoForm.name" spellcheck="false"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="infoForm.gender">
              <el-radio-button label="男"></el-radio-button>
              <el-radio-button label="女"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="birthday" label="出生日期">
            <el-date-picker
              v-model="infoForm.birthday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="constellation" label="星座">
            <el-input v-model="infoForm.constellation"></el-input>
          </el-form-item>
          <el-form-item prop="introduction" label="自我介绍" spellcheck="false">
            <el-input v-model="infoForm.introduction"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSave">保存资料</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="changePsw">
        <el-form :model="pswForm" status-icon :rules="pswRules" ref="pswForm"
                 class="demo-ruleForm" label-position="left" label-width="50">
          <el-form-item label="登录密码" prop="oldPsw">
            <el-input type="password" v-model="pswForm.oldPsw" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="newPsw">
            <el-input type="password" v-model="pswForm.newPsw" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPsw">
            <el-input type="password" v-model="pswForm.confirmPsw" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onModify">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'UserInfo',
    data () {
      let validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入登录密码'))
        } else {
          if (this.pswForm.oldPsw !== '') {
            this.$refs.pswForm.validateField('newPsw')
          }
          callback()
        }
      }
      let validateNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.pswForm.newPsw !== '') {
            this.$refs.pswForm.validateField('confirmPsw')
          }
          callback()
        }
      }
      let validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.pswForm.newPsw) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        infoForm: {},
        pswForm: {
          oldPsw: '',
          newPsw: '',
          confirmPsw: ''
        },
        activeName: 'basicInfo',
        infoRules: {
          name: [
            { required: true, message: '请输入昵称'},
          ],
          gender: [
            { required: true, message: '请选择性别'}
          ]
        },
        pswRules: {
          oldPsw: [
            { validator: validateOldPass, trigger: 'blur' }
          ],
          newPsw: [
            { validator: validateNewPass, trigger: 'blur' }
          ],
          confirmPsw: [
            { validator: validateConfirmPass, trigger: 'blur' }
          ]
        },
        uploadHeaders: {
          'x-access-token': this.$store.getters.token
        },
        fileList: [],
        canSubmitBasicInfo: true
      }
    },
    mounted () {
      this.getAccountInfo()
    },
    methods: {
      getAccountInfo () {
        this.fetch({
          url: 'api/user/' + this.$store.getters.email,
          method: 'get'
        }).then((res) => {
          if (res.data.success) {
            this.infoForm = {
              avatar: res.data.message.avatar ? 'http://localhost:3000/img/' + res.data.message.avatar + '?token=' + this.$store.getters.token : '',
              name: res.data.message.name,
              gender: res.data.message.gender,
              birthday: res.data.message.birthday,
              constellation: res.data.message.constellation,
              introduction: res.data.message.introduction
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleClick (tab, event) {
        console.log(tab, event)
      },
      uploadBasicInfo (res) {
        // 如果没有修改头像，就不用改头像地址了
        if (res) {
          // 上传成功后，因url没变，img标签不会自动刷新，所以加多了一个随机参数 reload
          this.infoForm.avatar = 'http://localhost:3000/img' + res.msg +
            '?token=' + this.$store.getters.token + '&reload=' + Math.random()
        }

        let submitData = JSON.parse(JSON.stringify(this.infoForm))
        // 提交的 avatar 要预处理，只保留名字
        submitData.avatar = submitData.avatar.slice(submitData.avatar.indexOf('img/') + 4,
          submitData.avatar.indexOf('?'))
        this.fetch({
          url: 'api/user/' + this.$store.getters.email,
          method: 'put',
          data: submitData
        }).then((res) => {
          if (res.data.success) {
            this.$message.success('保存成功')

            // 清空已上传的文件列表
            this.$refs.upload.clearFiles()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleAvatarSuccess (res, file) {
        if (res.success) {
          this.uploadBasicInfo(res)
        } else {
          this.$message.error(res.message)
        }
      },
      beforeAvatarUpload (file) {
        const type = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!type) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }

        this.canSubmitBasicInfo = type && isLt2M

        return type && isLt2M
      },
      handleUploadError (err) {
        this.$message.error(err)
      },
      handlePictureCardPreview (file) {
        console.log(file)
        this.fileList.push(file)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList);
      },
      resetForm () {
        this.$refs.pswForm.resetFields()
      },
      onSave () {
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            this.$refs.upload.submit()
            if (this.canSubmitBasicInfo) {
              this.uploadBasicInfo()
            }
          } else {
            this.$message.error('请输入必填项')
            return false
          }
        })
      },
      onModify () {
        let submitData = this.pswForm

        this.$refs.pswForm.validate((valid) => {
          if (valid) {
            this.fetch({
              url: 'api/user/modPsw/' + this.$store.getters.email,
              method: 'put',
              data: submitData
            }).then((res) => {
              if (res.data.success) {
                this.$message.success('修改成功')
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .userinfo_tabpane {
    margin-top: 20px;
    width: 40%;
  }
</style>
