<template>
  <div style="padding: 30px;">
    <div class="admin-page_title">后台管理系统</div>
    <div>
      <el-button type="primary" size="mini" class="admin-page_sign-out" @click="signOut">切换账号</el-button>
      <el-button type="danger" size="mini" class="admin-page_sign-out" @click="getUnAuthEvent">未授权活动</el-button>
      <el-button type="success" size="mini" class="admin-page_sign-out" @click="getAuthEvent">已授权活动</el-button>
      <el-button type="warning" size="mini" class="admin-page_sign-out" @click="viewDataAnalysis">数据统计分析</el-button>
    </div>
    <div class="admin-page_card-container">
      <event-card ref="eventCard"></event-card>
    </div>
  </div>
</template>

<script>
  import eventCard from '@/components/common/event_card'

  export default {
    name: 'Admin',
    data () {
      return {
        items: []
      }
    },
    components: {
      eventCard
    },
    methods: {
      getUnAuthEvent () {
        this.$refs.eventCard.loadEvent(0)
      },
      getAuthEvent () {
        this.$refs.eventCard.loadEvent(1)
      },
      signOut () {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/' })
        })
      },
      viewDataAnalysis () {
        this.$router.push({ path: '/dataAnalysis' })
      }
    }
  }
</script>

<style>
  .admin-page_title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 2rem;
  }

  .admin-page_sign-out {
    margin: 0 15px 30px 38%;
  }

  .admin-page_card-container {
    width: 100%;
  }

  .admin-page_card-container:after {
    display: table;
    content: "";
    clear: both;
  }
</style>
