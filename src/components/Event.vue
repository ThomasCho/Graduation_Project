<template>
  <div style="padding: 20px">
    Event
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
        poster: this.$store.getters.poster
      }
    },
    methods: {

    }
  }
</script>

<style>

</style>
