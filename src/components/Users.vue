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

      }
    }
  }
</script>

<style>

</style>
