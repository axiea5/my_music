<template>
  <div id="app">
    <nav-bar />
    <app-main />
    <play-bar />
  </div>
</template>

<script>
import appMain from '@/layout/components/appMain'
import navBar from '@/layout/components/navBar'
import playBar from '@/layout/components/playBar'
export default {
  name: 'App',
  components: { appMain, navBar, playBar }
}
</script>
