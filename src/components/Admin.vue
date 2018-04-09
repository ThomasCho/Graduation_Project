<template>
  <div style="padding: 30px;">
    <div class="admin-page_title">后台管理系统</div>
    <div>
      <el-button type="primary" size="mini" class="admin-page_sign-out" @click="signOut">切换账号</el-button>
      <el-button type="danger" size="mini" class="admin-page_sign-out" @click="getUnAuthEvent">未授权活动</el-button>
      <el-button type="success" size="mini" class="admin-page_sign-out" @click="getAuthEvent">已授权活动</el-button>
    </div>
    <el-card :body-style="{ padding: '0px' }" class="admin-page_card" v-for="item in items">
      <img :src="getImg(item)" class="admin-page_image" @click="viewEvent(item)">
      <div style="padding: 14px;">
        <div>{{item.name}}</div>
        <div class="admin-page_user-name">{{item.owner}}</div>
        <div class="admin-page_bottom clearfix">
          <div><time class="admin-page_time">{{ showTime(item) }}</time></div>
          <el-button type="success" icon="el-icon-check" circle size="medium" title="批准活动"
                     class="admin-page_button" @click="authEvent(item)" v-show="!item.auth"></el-button>
          <el-button type="danger" icon="el-icon-close" circle size="medium" title="驳回活动"
                     class="admin-page_button" @click="unAuthEvent(item)"></el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Admin',
    data () {
      return {
        items: [],
        // 默认为加载未授权活动
        isAuth: 0
      }
    },
    mounted () {
      this.loadEvent()
    },
    methods: {
      loadEvent () {
        this.items = []
        let apiUrl = this.isAuth ? 'api/loadEvent' : 'api/loadUnAuthEvent'
        this.fetch({
          url: apiUrl,
          method: 'get'
        }).then((res) => {
          if (res.data.success) {
            this.items = res.data.message
            this.$message({
              message: this.isAuth ? '已授权活动' : '未授权活动',
              type: 'success'
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getUnAuthEvent () {
        this.isAuth = 0
        this.loadEvent()
      },
      getAuthEvent () {
        this.isAuth = 1
        this.loadEvent()
      },
      getImg (val) {
        return 'http://localhost:3000/img/poster' + val.poster
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
      showTime (item) {
        return this.convertDate(item.date) + '  ' + this.convertTime(item.time[0]) + ' 至 ' + this.convertTime(item.time[1])
      },
      viewEvent (val) {
        localStorage.setItem('currentEvent', JSON.stringify(val))
        this.$router.push({path: '/event'})
      },
      signOut () {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/' })
        })
      },
      authEvent (item) {
        this.fetch({
          url: 'api/authEvent',
          method: 'put',
          data: {
            eventName: item.name
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.loadEvent()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      unAuthEvent (item) {
        this.fetch({
          url: 'api/unAuthEvent',
          method: 'put',
          data: {
            eventName: item.name
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.loadEvent()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }
    }
  }
</script>

<style>
  .admin-page_time {
    font-size: 13px;
    color: #999;
    margin-right: 8px;
  }

  .admin-page_bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .admin-page_button {
    padding: 0;
    float: right;
    width: 15%;
    height: 20px;
    margin: 10px 0 0 10px;
  }

  .admin-page_image {
    width: 100%;
    display: block;
    height: 35vh;
    cursor: pointer;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .admin-page_card {
    width: 20%;
    float: left;
    margin: 0 3% 20px 0;
  }

  .admin-page_card:hover {
    animation: bigborder 0.5s;
    -webkit-animation: bigborder 0.5s;
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards;
  }
  @keyframes bigborder
  {
    from {border: 1px solid #EEEEEE;}
    to {border: 1px solid black;}
  }
  @-webkit-keyframes bigborder
  {
    from {border: 1px solid #EEEEEE;}
    to {border: 1px solid black;}
  }

  .admin-page_user-name {
    margin-top: 10px;
    color: #999999;
    font-size: 0.9rem;
  }

  .admin-page_title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 2rem;
  }

  .admin-page_sign-out {
    margin: 0 15px 30px 38%;
  }
</style>
