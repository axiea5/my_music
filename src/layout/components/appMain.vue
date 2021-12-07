<template>
  <section class="app-main">
    <!-- 左侧导航 -->
    <div class="leftBar">
      <div class="list-item"></div>
    </div>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="less" scoped>
.app-main {
  /*80 = navbar  */
  min-height: calc(100vh - 140px);
  position: relative;
  overflow: hidden;
}
</style>
