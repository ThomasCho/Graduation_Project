<!--用户已发布、已收藏、已参加的活动的展示页面-->
<template>
  <div style="padding: 20px">
    <event-wall :page-type="pageType" ref="eventWall"></event-wall>
  </div>
</template>

<script>
  import EventWall from '@/components/EventWall'

  export default {
    name: 'UserHasPost',
    components: {
      EventWall
    },
    computed: {
      pageType () {
        return this.$route.params.type
      }
    },
    watch: {
      '$route' (to, from) {
        this.$refs.eventWall.loadEvent('', to.params.type)
      }
    }
  }
</script>
