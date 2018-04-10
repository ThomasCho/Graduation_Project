<template>
  <div style="padding: 20px">
    <div v-if="!items.length" class="event-card_find-no-items">
      <div>没有活动耶~</div>
      <img src="../../assets/img/no_result.gif" style="width: 200px;" draggable="false">
    </div>
    <el-card :body-style="{ padding: '0px' }" class="event-card_card" v-for="item in items">
      <img :src="getImg(item)" class="event-card_image" @click="viewEvent(item)">
      <div style="padding: 14px;">
        <div>{{item.name}}</div>
        <div class="event-card_user-name">{{item.owner}}</div>
        <div class="event-card_bottom clearfix">
          <div><time class="event-card_time">{{ showTime(item) }}</time></div>
          <div v-show="!user">
            <el-button type="success" icon="el-icon-check" circle size="medium" title="批准活动"
                       class="event-card_button" @click="authEvent(item)" v-show="!item.auth"></el-button>
            <el-button type="danger" icon="el-icon-close" circle size="medium" title="驳回活动"
                       class="event-card_button" @click="unAuthEvent(item)"></el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'EVENT_CARD',
    data () {
      return {
        items: []
      }
    },
    computed: {
      user () {
        return this.$route.params.id
      }
    },
    mounted () {
      // 默认加载已授权的活动
      this.loadEvent(1)
    },
    methods: {
      loadEvent (isAuth) {
        this.items = []
        let apiUrl = isAuth ? 'api/loadEvent' : 'api/loadUnAuthEvent'
        this.fetch({
          url: apiUrl,
          baseURL: '/',
          method: 'get',
          params: {
            pageType: this.user ? 'post' : null,
            user: this.user
          }
        }).then((res) => {
          if (res.data.success) {
            this.items = res.data.message
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getImg (val) {
        return 'http://localhost:3000/img/poster' + val.poster
      },
      viewEvent (val) {
        localStorage.setItem('currentEvent', JSON.stringify(val))
        this.$router.push({path: '/event'})
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
  .event-card_card {
    width: 20%;
    float: left;
    margin: 0 3% 20px 0;
  }

  .event-card_card:hover {
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

  .event-card_image {
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

  .event-card_user-name {
    margin-top: 10px;
    color: #999999;
    font-size: 0.9rem;
  }

  .event-card_time {
    font-size: 13px;
    color: #999;
    margin-right: 8px;
  }

  .event-card_bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .event-card_button {
    padding: 0;
    float: right;
    width: 15%;
    height: 20px;
    margin: 10px 0 0 10px;
  }

  .event-card_find-no-items {
    text-align: center;
    margin-top: 10vh;
  }
</style>
