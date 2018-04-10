<template>
  <div style="padding: 20px 10% 20px 10%">
    <p class="follow-page_title">{{getTitle()}}</p>
    <div v-if="!items.length" class="follow-wall_find-no-items">
      <div>这里没有人~</div>
      <img src="../assets/img/no_result.gif" style="width: 200px;" draggable="false">
    </div>
    <el-card :body-style="{ padding: '0px' }" v-for="person in items" class="follow-page_card"
             :class="person.gender === '男' ? 'follow-page_card-male' : 'follow-page_card-female'">
      <img v-if="!person.avatar" src="../assets/img/no_avatar.png" class="follow-page_image" @click="getPersonPost(person.email)">
      <img v-else :src="getPersonAvatar(person.avatar)" class="follow-page_image" @click="getPersonPost(person.email)">
      <div style="padding: 14px;">
        <span>{{person.name}}</span>
        <div class="follow-page_bottom follow-page_clearfix">
          <el-button type="text" class="follow-page_button"
                     v-if="currentUserInfo.hasFollow.indexOf(person.email) === -1"
                     @click="followSB(person.email)">关注</el-button>
          <el-button type="text" class="follow-page_button" @click="unfollowSB(person.email)"
                     style="color: palevioletred" v-else>取消关注</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'HasFollow',
    props: {
      type: {
        type: String,
        required: true,
        default: 'hasFollow'
      }
    },
    data () {
      return {
        items: [],
        currentUserInfo: {}
      }
    },
    mounted () {
      this.getCurrentUserInfo()
      this.getItems()
    },
    methods: {
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
      getItems () {
        this.items = []

        this.fetch({
          url: this.type === 'hasFollow' ? 'api/getFollowing' : 'api/getFollower',
          method: 'get',
          params: {
            user: this.$store.getters.email
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
      getPersonAvatar (val) {
        return 'http://localhost:3000/img/avatar/' + val + '?token=' + this.$store.getters.token
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
            this.getItems()
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
            this.getItems()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getTitle () {
        return this.type === 'hasFollow' ? '你已关注的人' : '你被这些人关注'
      },
      getPersonPost (val) {
        this.$router.push('/eventCard/' + val)
      }
    }
  }
</script>

<style>
  .follow-page_card-male {
    line-height: 0px;
    border-radius: 30px;
    border: 2px solid deepskyblue;
  }

  .follow-page_card-female {
    line-height: 0px;
    border-radius: 30px;
    border: 2px solid deeppink;
  }

  .follow-page_image {
    width: 100%;
    display: block;
    height: 8vh;
    cursor: pointer;
  }

  .follow-page_bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .follow-page_button {
    padding: 0;
    float: right;
  }

  .follow-page_clearfix:before,
  .follow-page_clearfix:after {
    display: table;
    content: "";
  }

  .follow-page_clearfix:after {
    clear: both
  }

  .follow-page_card {
    width: 10%;
    float: left;
    margin: 0 3% 20px 0;
  }

  .follow-page_card:hover {
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

  .follow-wall_find-no-items {
    text-align: center;
    margin-top: 10vh;
  }

  .follow-page_title {
    text-align: center;
    font-size: 2rem;
  }
</style>
