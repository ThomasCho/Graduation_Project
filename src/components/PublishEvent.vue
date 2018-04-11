<template>
  <div style="padding: 20px;">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item prop="poster" label="活动海报">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          action="api/img/poster"
          :headers="uploadHeaders"
          :show-file-list="true"
          limit="1"
          :on-remove="handleRemove"
          :on-error="handleUploadError"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false">

          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传一个jpg/png文件，且不超过2Mb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动地点" prop="region">
        <div class="amap-page-container">
          <el-amap-search-box class="search-box" :on-search-result="onSearchResult"></el-amap-search-box>
          <el-amap ref="map" vid="amap" :amap-manager="amapManager" :plugin="plugin"
                   :center="center" :zoom="zoom" :events="events" class="amap-demo">
            <el-amap-marker v-for="marker in markers" :position="marker" :key="marker[0]" ></el-amap-marker>
          </el-amap>
        </div>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date">
            <el-date-picker type="date" placeholder="选择日期" :editable="false" v-model="form.date" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line time-picker_bar" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="time">
            <el-time-picker type="fixed-time" placeholder="选择时间" :is-range="true" :editable="false" v-model="form.time" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="收费" prop="isCharged">
        <el-switch v-model="form.isCharged"></el-switch>
      </el-form-item>
      <el-form-item label="费用" prop="money" v-if="form.isCharged">
        <el-input placeholder="请输入内容" v-model="form.money">
          <template slot="prepend">每人(元)：</template>
        </el-input>
      </el-form-item>
      <el-form-item label="活动类型" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="学习" name="type"></el-checkbox>
          <el-checkbox label="吃喝" name="type"></el-checkbox>
          <el-checkbox label="玩耍" name="type"></el-checkbox>
          <el-checkbox label="旅行" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="form.resource">
          <el-radio label="活动组织者提供"></el-radio>
          <el-radio label="活动参加者自备"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="详情" prop="detail">
        <div ref="editor" style="text-align:left"></div>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import VueAMap from 'vue-amap'

  export default {
    name: 'PublishEvent',
    data () {
      let amapManager = new VueAMap.AMapManager()
      let self = this

      return {
        form: {
          name: '',
          date: '',
          time: '',
          isCharged: false,
          money: '',
          type: [],
          resource: '',
          desc: '',
          remark: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        uploadHeaders: {
          'x-access-token': this.$store.getters.token
        },
        amapManager,
        zoom: 12,
        center: [113.8, 23.1],
        lang: 'zh_en',
        events: {
          init: (o) => {
            console.log(this.$refs.map.$$getPosition())
            o.getCity(result => {
              console.log(result)
            })
          },
          'click': (e) => {
            this.markers = [[e.lnglat.lng, e.lnglat.lat]]
          }
        },
        markers: [],
        plugin: [{
          pName: 'Geolocation',
          events: {
            init (o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng
                  self.lat = result.position.lat
                  self.center = [self.lng, self.lat]
                  self.markers = [[self.lng, self.lat]]
                  self.$nextTick()
                }
              })
            }
          }
        }, {
          pName: 'Scale',
          events: {
            init (instance) {
              console.log(instance);
            }
          }
        }],
        editorContent: ''
      }
    },
    mounted () {
      let editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.create()
    },
    methods: {
      handleRemove (file, fileList) {
        console.log(file, fileList);
      },
      handleUploadError (err) {
        this.$message.error(err)
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

        return type && isLt2M
      },
      uploadBasicInfo (res) {
        let submitData = JSON.parse(JSON.stringify(this.form))
        submitData.detail = this.editorContent
        submitData.region = this.center
        // 如果不收费，则money那项要清零
        if (!submitData.isCharged) {
          submitData.money = ''
        }
        submitData.poster = res.msg
        // 加上发布者是谁这一项
        submitData.owner = this.$store.getters.email

        this.fetch({
          url: 'api/publishEvent',
          method: 'post',
          data: submitData
        }).then((res) => {
          if (res.data.success) {
            this.$message.success('发布成功')
            this.$router.replace({ path: '/eventWall' })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      validateOthers () {
        let errMsg = []

        // 验证有没有选择地点
        if (!this.center) {
          errMsg.push('请选择活动地点')
        }
        // 验证有没有输入活动费用
        if (this.form.isCharged) {
          if (!this.form.money) {
            errMsg.push('请输入活动费用')
          } else if (!/^[\d]+$/.test(this.form.money)) {
            errMsg.push('活动费用必须为数字')
          }
        }
        // 验证活动时间符不符合规范
        if ((new Date(this.form.time[1]) - new Date(this.form.time[0])) <= 0) {
          errMsg.push('结束时间必须晚于开始时间')
        } else if ((new Date(this.form.time[1]) - new Date(this.form.time[0])) <= (60 * 30 * 1000)) {
          errMsg.push('活动时间不得少于半小时')
        }
        // 验证有没有上传海报
        if (!this.$refs.upload.uploadFiles.length) {
          errMsg.push('请上传活动海报')
        }

        return errMsg
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let errMsg = this.validateOthers()
            if (errMsg.length) {
              this.$message.error(errMsg.join(','))
            } else {
              this.$refs.upload.submit()
            }
          } else {
            this.$message.error('请输入必填项')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      onSearchResult (pois) {
        let latSum = 0
        let lngSum = 0
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi
            lngSum += lng
            latSum += lat
          })
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          }
          this.markers = [[center.lng, center.lat]]
          this.center = [center.lng, center.lat]
        }
      }
    }
  }
</script>

<style>
  .amap-demo {
    width: 500px;
  }
  .amap-page-container {
    width: 500px;
    height: 500px;
    margin-bottom: 50px;
  }
  .search-box {
    position: absolute;
    top: 60px;
    left: 20px;
  }
  .time-picker_bar {
    text-align: center;
  }
  .publish-page_editor {
    margin-bottom: 20px;
  }
</style>
