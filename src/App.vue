<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import login from './app/login.vue'
export default {
  name: 'login',
  components: {
    login
  }
}
</script>

<style lang="stylus">
	#app
		height 100%
    a.u-link--Active div {
      background-color #f5f5f5
    }
</style>

