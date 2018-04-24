<template>
  <div>
    <el-form ref="form" label-position="left" label-width="100px" class="event-page_form">
      <el-form-item label="发布人">
        <el-card :body-style="{ padding: '0px' }" class="event-page_owner-info"
                 :class="owner.gender === '男' ? 'event-page_card-male' : 'event-page_card-female'">
          <img :src="owner.avatar" class="event-page_image" @click="getPersonPost(owner.email)">
          <div style="padding: 14px;">
            <span>{{owner.name}}</span>
            <div class="event-page_bottom event-page_clearfix">
              <div v-show="owner.email !== currentUserInfo.email">
                <el-button type="text" class="event-page_button"
                           v-if="currentUserInfo.hasFollow.indexOf(owner.email) === -1"
                           @click="followSB(owner.email)">关注</el-button>
                <el-button type="text" class="event-page_button" @click="unfollowSB(owner.email)"
                           style="color: palevioletred" v-else>取消关注</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-form-item>

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
        {{item.isCharged ? '免费' : '￥' + item.money}}
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
              <img v-if="!person.avatar" src="../assets/img/no_avatar.png" class="event-page_image" @click="getPersonPost(person.email)">
              <img v-else :src="getPersonAvatar(person.avatar)" class="event-page_image" @click="getPersonPost(person.email)">
              <div style="padding: 14px;">
                <span>{{person.name}}</span>
                <div class="event-page_bottom event-page_clearfix">
                  <div v-show="owner.email !== currentUserInfo.email && person.email !== currentUserInfo.email">
                    <el-button type="text" class="event-page_button"
                               v-if="currentUserInfo.hasFollow.indexOf(person.email) === -1"
                               @click="followSB(person.email)">关注</el-button>
                    <el-button type="text" class="event-page_button" @click="unfollowSB(person.email)"
                               style="color: palevioletred" v-else>取消关注</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
      <el-popover
        ref="comment"
        placement="top"
        width="400"
        trigger="click">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="commentWord">
        </el-input>
        <el-button class="event-page_confirm-btn" @click="handleComment" size="small">确定</el-button>
      </el-popover>
      <el-card class="event-page_box-card">
        <div slot="header" class="event-page_clearfix">
          <span>留言区</span>
          <el-button style="float: right; padding: 3px 0" type="text" v-popover:comment>我要留言</el-button>
        </div>
        <div v-if="!item.comment.length" class="event-page_no-comment">无评论</div>
        <div class="event-page_item" v-for="val in item.comment" v-else>
          <span class="event-page_comment-user">{{val | convertUserInComment}}</span>
          <span class="event-page_comment-time">{{val.time}}</span>
          <span class="event-page_comment-word">{{val.word}}</span>
        </div>
      </el-card>
      <div class="event-page_btns">
        <el-button-group>
          <el-button type="success" icon="el-icon-check" round
                     @click="handleJoin" :disabled="isExpired(item)">
            {{canJoin ? '参加' : '撤销参加'}}
          </el-button>
          <el-button type="danger" icon="el-icon-arrow-left" round @click="handleBack">
            返回
          </el-button>
          <el-button type="warning" icon="el-icon-star-off" round
                     @click="handleStar" :disabled="isExpired(item)">
            {{canStar ? '收藏' : '撤销收藏'}}
          </el-button>
        </el-button-group>
        <span class="event-page_expire-text" v-show="isExpired(item)">已过期</span>
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
        zoom: 14,
        owner: {},
        canJoin: true,
        canStar: true,
        commentWord: '',
        currentUserInfo: {}
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
        isCharged: currentEvent.isCharged,
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
        view: currentEvent.view,
        owner: currentEvent.owner,
        comment: currentEvent.comment,
        auth: currentEvent.auth
      }

      this.incView()
      this.getOwnerInfo()
      this.getCurrentUserInfo()
      this.judgeBtnType()
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
        if (this.canJoin) {
          this.joinEvent()
        } else {
          this.unjoinEvent()
        }
      },
      getCurrentUserInfo () {
        this.fetch({
          url: 'api/user/' + this.$store.getters.email,
          method: 'get'
        })
          .then((res) => {
            if (res.data.success) {
              this.currentUserInfo = res.data.message
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(err => {
          this.$message.error(err)
        })
      },
      joinEvent () {
        this.fetch({
          url: 'api/joinEvent',
          method: 'post',
          data: {
            eventName: this.item.name,
            userInfo: {
              avatar: this.currentUserInfo.avatar,
              name: this.currentUserInfo.name,
              email: this.$store.getters.email,
              introduction: this.currentUserInfo.introduction,
              constellation: this.currentUserInfo.constellation,
              phone: this.currentUserInfo.phone,
              gender: this.currentUserInfo.gender,
              birthday: this.currentUserInfo.birthday,
              hobby: this.currentUserInfo.hobby,
              hasFollow: this.currentUserInfo.hasFollow,
              followBy: this.currentUserInfo.followBy
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
      },
      unjoinEvent () {
        this.fetch({
          url: 'api/unjoinEvent',
          method: 'post',
          data: {
            eventName: this.item.name,
            userEmail: this.$store.getters.email
          }
        }).then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.handleBack()
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
        if (this.canStar) {
          this.starEvent()
        } else {
          this.unstarEvent()
        }
      },
      starEvent () {
        this.fetch({
          url: 'api/starEvent',
          method: 'put',
          data: {
            eventName: this.item.name,
            byWho: this.$store.getters.email
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.canStar = false
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      unstarEvent () {
        this.fetch({
          url: 'api/unstarEvent',
          method: 'put',
          data: {
            eventName: this.item.name,
            userEmail: this.$store.getters.email
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.canStar = true
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
      isExpired (item) {
        // 因item.date和item.time是没有关联的，所以有可能会出现item.time的日期部分早于item.date的日期部分，所以要先预处理
        if ((new Date(item.date) - new Date(item.time[0])) > 0) {
          item.time[0] = item.date.slice(0, item.date.indexOf('T')) + item.time[0].slice(item.time[0].indexOf('T'))
        }
        return (new Date() - new Date(item.time[0])) > 0
      },
      getOwnerInfo () {
        this.fetch({
          url: 'api/user/' + this.item.owner,
          method: 'get'
        }).then((res) => {
          if (res.data.success) {
            this.owner = {
              avatar: res.data.message.avatar ? 'http://localhost:3000/img/avatar/' + res.data.message.avatar + '?token=' + this.$store.getters.token : '',
              name: res.data.message.name,
              gender: res.data.message.gender,
              birthday: res.data.message.birthday,
              constellation: res.data.message.constellation,
              phone: res.data.message.phone,
              introduction: res.data.message.introduction,
              hobby: res.data.message.hobby,
              hasFollow: res.data.message.hasFollow,
              followBy: res.data.message.followBy,
              email: res.data.message.email
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      judgeBtnType () {
        this.fetch({
          url: 'api/user/' + this.$store.getters.email,
          method: 'get'
        }).then((res) => {
          if (res.data.success) {
            if (res.data.message.hasJoin.indexOf(this.item.name) !== -1) {
              this.canJoin = false
            }
            if (res.data.message.hasStar.indexOf(this.item.name) !== -1) {
              this.canStar = false
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleComment () {
        this.fetch({
          url: 'api/commentEvent',
          method: 'post',
          data: {
            eventName: this.item.name,
            userName: this.$store.getters.name,
            userEmail: this.$store.getters.email,
            word: this.commentWord
          }
        }).then((res) => {
          if (res.data.success) {
            this.item.comment = res.data.message
            this.$message({
              message: '评论成功',
              type: 'success'
            })
            this.commentWord = ''
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      followSB (sb) {
        this.fetch({
          url: 'api/followSB',
          method: 'put',
          data: {
            from: this.currentUserInfo.email,
            to: sb
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.getCurrentUserInfo()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      unfollowSB (sb) {
        this.fetch({
          url: 'api/unfollowSB',
          method: 'put',
          data: {
            from: this.currentUserInfo.email,
            to: sb
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.getCurrentUserInfo()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getPersonPost (val) {
        this.$router.push('/eventCard/' + val)
      }
    },
    filters: {
      convertType (val) {
        return val.join(' / ')
      },
      convertUserInComment (val) {
        return val.userName + '(' + val.userEmail + ')' + ': '
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
    cursor: pointer;
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
    margin-top: 20px;
  }
  .event-page_expire-text {
    color: red;
    font-weight: bold;
    font-size: 3rem;
    margin-left: 3%;
    border: 10px double red;
    user-select: none;
  }
  .event-page_owner-info {
    width: 7%;
  }
  .event-page_box-card {
    width: 50%;
  }
  .event-page_item {
    margin-bottom: 18px;
  }
  .event-page_comment-user {
    color: red;
    width: 13%;
    display: inline-block;
  }
  .event-page_comment-time {
    float: right;
    font-size: 0.8rem;
  }
  .event-page_comment-word {
    display: block;
    text-indent: 5%;
    margin-top: 10px;
  }
  .event-page_confirm-btn {
    float: right;
    margin-top: 10px;
  }
  .event-page_no-comment {
    text-align: center;
    font-size: 0.9rem;
    color: #999999;
  }
</style>
