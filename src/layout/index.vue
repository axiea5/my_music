<template>
  <div>
    <navbar />
    <appmain />
  </div>
</template>

<script>
import { Appmain, Navbar } from './components'

export default {
  name: 'Layout',
  components: { Appmain, Navbar }
}
</script>

<style lang="less" scoped>
</style>
