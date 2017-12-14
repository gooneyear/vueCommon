<template id="level">
  <div>
    <div class="gameGrade">
      <ul v-if="level==1">
        <li style="background-color: #1BBE9F"></li>
      </ul>
      <ul v-if="level==2">
        <li style="background-color: #7ED321"></li>
        <li style="background-color: #7ED321"></li>
      </ul>
      <ul v-if="level==3">
        <li style="background-color: #F6A623"></li>
        <li style="background-color: #F6A623"></li>
        <li style="background-color: #F6A623"></li>
      </ul>
      <ul v-if="level==4">
        <li style="background-color: #F67023"></li>
        <li style="background-color: #F67023"></li>
        <li style="background-color: #F67023"></li>
        <li style="background-color: #F67023"></li>
      </ul>
      <ul v-if="level==5">
        <li style="background-color: #D62720"></li>
        <li style="background-color: #D62720"></li>
        <li style="background-color: #D62720"></li>
        <li style="background-color: #D62720"></li>
        <li style="background-color: #D62720"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default ({
    props: ['level']
  })
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .gameGrade
    height 25px
    line-height 25px
    ul
      li
        float left
        background-color #f6a623
        height 4px
        width 20px
        margin 0 0 0 1px
</style>
