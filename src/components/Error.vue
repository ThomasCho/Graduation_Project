<template>
  <div class="errPage-container">
    <h1 class="errPage-container_text-jumbo">Oops!</h1>
    <h1>你没有权限去该页面</h1>
  </div>
</template>

<script>
  export default {
    name: 'Error'
  }
</script>

<style>
  .errPage-container {
    text-align: center;
  }

  .errPage-container_text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
    margin-bottom: 100px;
  }
</style>
