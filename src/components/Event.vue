<template>
  <div>
    <el-form ref="form" label-position="left" label-width="100px" class="event-page_form">
      <el-form-item label="活动海报">
        <div :style="posterStyle"></div>
      </el-form-item>

      <el-form-item label="活动名称">
        {{item.name}}
      </el-form-item>
      <el-form-item label="活动地点">
        <div class="amap-page-container">
          <el-amap ref="map" vid="amap" :amap-manager="amapManager"
                   :center="center" :zoom="zoom" class="amap-demo">
            <el-amap-marker :position="center" ></el-amap-marker>
          </el-amap>
        </div>
      </el-form-item>
      <el-form-item label="活动时间">
        {{showTime(item)}}
      </el-form-item>
      <el-form-item label="收费" class="event-page_form-money">
        {{item.isFree ? '免费' : '￥' + item.money}}
      </el-form-item>
      <el-form-item label="活动类型">
        {{item.type | convertType}}
      </el-form-item>
      <el-form-item label="特殊资源">
        {{item.resource}}
      </el-form-item>
      <el-form-item label="活动形式">
        <p>{{item.desc}}</p>
      </el-form-item>
      <el-form-item label="详情">
        <p v-html="item.detail"></p>
      </el-form-item>
      <el-form-item label="备注">
        {{item.remark}}
      </el-form-item>
      <el-form-item label="参与人员">
        <span v-if="!item.participant.length">暂无人员参加</span>
        <el-row v-else>
          <el-col :span="2" v-for="(person, index) in item.participant" :key="person.name"
                  :offset="index > 0 ? 1 : 0">
            <el-card :body-style="{ padding: '0px' }"
                     :class="person.gender === '男' ? 'event-page_card-male' : 'event-page_card-female'">
              <img :src="getPersonAvatar(person.avatar)" class="event-page_image">
              <div style="padding: 14px;">
                <span>{{person.name}}</span>
                <div class="event-page_bottom event-page_clearfix">
                  <el-button type="text" class="event-page_button">关注</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="event-page_btns">
        <el-button-group>
          <el-button type="success" icon="el-icon-check" round @click="handleJoin" :disabled="isExpired(item.time[0])">参加</el-button>
          <el-button type="danger" icon="el-icon-arrow-left" round @click="handleBack" :disabled="isExpired(item.time[0])">返回</el-button>
          <el-button type="warning" icon="el-icon-star-off" round @click="handleStar" :disabled="isExpired(item.time[0])">收藏</el-button>
        </el-button-group>
        <span class="event-page_expire-text" v-show="isExpired(item.time[0])">已过期</span>
      </div>
    </el-form>
  </div>
</template>

<script>
  import VueAMap from 'vue-amap'

  export default {
    name: 'Event',
    data () {
      let amapManager = new VueAMap.AMapManager()

      return {
        item: {},
        amapManager,
        zoom: 14
      }
    },
    computed: {
      posterStyle () {
        return {
          backgroundImage: 'url(http://localhost:3000/img/poster' + this.item.poster + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '40%',
          height: '300px',
          borderRadius: '6px',
          boxShadow: '0px 0px 5px darkgrey'
        }
      },
      center () {
        return [this.item.region[0], this.item.region[1]]
      }
    },
    mounted () {
      let currentEvent = JSON.parse(localStorage.getItem('currentEvent'))
      this.item = {
        name: currentEvent.name,
        date: currentEvent.date,
        time: currentEvent.time,
        isFree: currentEvent.isFree,
        money: currentEvent.money,
        type: currentEvent.type,
        resource: currentEvent.resource,
        desc: currentEvent.desc,
        remark: currentEvent.remark,
        detail: currentEvent.detail,
        region: currentEvent.region,
        poster: currentEvent.poster,
        participant: currentEvent.participant,
        star: currentEvent.star,
        view: currentEvent.view
      }

      this.incView()
    },
    methods: {
      showTime (item) {
        return this.convertDate(item.date) + '  ' + this.convertTime(item.time[0]) + ' 至 ' + this.convertTime(item.time[1])
      },
      convertDate (val) {
        let date = new Date(val)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() + ' '

        return Y + M + D
      },
      convertTime (val) {
        let date = new Date(val)
        let h = date.getHours() + ':'
        let m = date.getMinutes() + ':'
        let s = date.getSeconds()

        return h + m + s
      },
      getPersonAvatar (val) {
        return 'http://localhost:3000/img/avatar/' + val + '?token=' + this.$store.getters.token
      },
      handleJoin () {
        // 先获取当前用户的最新信息，store中存储的可能是久的信息
        this.fetch({
          url: 'api/user/' + this.$store.getters.email,
          method: 'get'
        })
          .then((res) => {
            if (res.data.success) {
              this.fetch({
                url: 'api/joinEvent',
                method: 'post',
                data: {
                  eventName: this.item.name,
                  userInfo: {
                    avatar: res.data.message.avatar,
                    name: res.data.message.name,
                    email: this.$store.getters.email,
                    introduction: res.data.message.introduction,
                    constellation: res.data.message.constellation,
                    phone: res.data.message.phone,
                    gender: res.data.message.gender,
                    birthday: res.data.message.birthday
                  }
                }
              }).then((res) => {
                if (res.data.success) {
                  this.$message({
                    message: '已成功加入活动',
                    type: 'success'
                  })
                  this.handleBack()
                } else {
                  this.$message.error(res.data.message)
                }
              }).catch(err => {
                this.$message.error(err)
              })
            } else {
              this.$message.error(res.data.message)
            }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleBack () {
        this.$router.replace({ path: '/eventWall' })
      },
      handleStar () {
        this.fetch({
          url: 'api/starEvent',
          method: 'put',
          data: {
            eventName: this.item.name
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      incView () {
        this.fetch({
          url: 'api/incView',
          method: 'put',
          data: {
            eventName: this.item.name
          }
        })
      },
      isExpired (val) {
        return ((new Date()) - (new Date(val))) > 0
      }
    },
    filters: {
      convertType (val) {
        return val.join(' / ')
      }
    }
  }
</script>

<style>
  .event-page_form {
    margin: 20px;
  }
  .event-page_form-money {
    color: red;
  }
  .amap-demo {
    width: 500px;
  }
  .amap-page-container {
    width: 500px;
    height: 500px;
    margin-bottom: 50px;
  }

  .event-page_time {
    font-size: 13px;
    color: #999;
  }

  .event-page_bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .event-page_button {
    padding: 0;
    float: right;
  }

  .event-page_image {
    width: 100%;
    display: block;
    height: 8vh;
  }

  .event-page_card-male {
    line-height: 0px;
    border-radius: 30px;
    border: 2px solid deepskyblue;
  }

  .event-page_card-female {
    line-height: 0px;
    border-radius: 30px;
    border: 2px solid deeppink;
  }

  .event-page_clearfix:before,
  .event-page_clearfix:after {
    display: table;
    content: "";
  }

  .event-page_clearfix:after {
    clear: both
  }
  .event-page_btns {
    width: 100%;
    text-align: center;
  }
  .event-page_expire-text {
    color: red;
    font-weight: bold;
    font-size: 3rem;
    margin-left: 3%;
    border: 10px double red;
    user-select: none;
  }
</style>
