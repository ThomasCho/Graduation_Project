<template>
  <div class="errPage-container">
    <div class="errPage-container_left-div">
      <h1 class="errPage-container_text-jumbo">Oops!</h1>
      <br/>
      <h1>你没有权限去该页面</h1>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Error'
  }
</script>

<style>
  .errPage-container {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh);
    width: calc(100vw);
    background-color: white;
  }

  .errPage-container_left-div {
    margin-right: 100px;
    color: #484848;
    text-align: center;
  }

  .errPage-container_text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
</style>
