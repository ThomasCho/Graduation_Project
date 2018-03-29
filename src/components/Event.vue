<template>
  <div>
    <el-form ref="form" label-position="left" label-width="100px" class="event-page_form">
      <el-form-item label="活动海报">
        <div :style="posterStyle"></div>
      </el-form-item>

      <!--<el-form-item label="活动名称">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="活动地点">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="活动时间">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="收费">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="费用" v-if="form.isFree">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="活动性质">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="特殊资源">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="活动形式">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="详情">-->

      <!--</el-form-item>-->
      <!--<el-form-item label="备注">-->

      <!--</el-form-item>-->
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Event',
    data () {
      return {
        item: {}
      }
    },
    computed: {
      posterStyle () {
        return {
          backgroundImage: 'url(http://localhost:3000/img/poster' + this.item.poster + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '50%',
          height: '200px',
          borderRadius: '6px',
          boxShadow: '0px 0px 5px darkgrey'
        }
      }
    },
    mounted () {
      this.item = {
        name: this.$store.getters.Ename,
        date: this.$store.getters.date,
        time: this.$store.getters.time,
        isFree: this.$store.getters.isFree,
        money: this.$store.getters.money,
        type: this.$store.getters.type,
        resource: this.$store.getters.resource,
        desc: this.$store.getters.desc,
        remark: this.$store.getters.remark,
        detail: this.$store.getters.detail,
        region: this.$store.getters.region,
        poster: this.$store.getters.poster,
        participant: this.$store.getters.participant
      }
    },
    methods: {

    }
  }
</script>

<style>
  .event-page_form {
    margin: 20px;
  }
</style>
