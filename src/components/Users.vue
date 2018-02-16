<template>
  <div>
    <ul>
      <li v-for="user in users">
        {{user.name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data () {
      return {
        users: []
      }
    },
    mounted () {
      this.getAllUsers();
    },
    methods: {
      getAllUsers () {
        this.$http.get('/api/user')
          .then(res => {
            this.users = res.data;
          })
          .catch(err => {
            this.$message.error(err.message);
          })
      }
    }
  }
</script>

<style>

</style>
