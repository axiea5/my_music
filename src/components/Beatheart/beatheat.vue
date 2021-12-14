
<template>
  <div :class="favorate?'heart heartAnimation':'heartl heart'" @click="changeHeart" />
</template>
<script>
export default {
  name: 'Beatheart',
  props: {
    favorate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    changeHeart() {
      this.$emit('changeBeat', this.beat)
    }
  }
}
</script>
<style lang="less" scoped>
.heart {
  background-image: url("./heart_animation.png");
  background-position: left;
  background-repeat: no-repeat;
  height: 80px;
  width: 80px;
  cursor: pointer;
  background-size: 2900%;
  position: relative;
}
.heartl:hover,
.heartl:focus {
  background-position: right;
}

@-webkit-keyframes heartBlast {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}

@keyframes heartBlast {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}

.heartAnimation {
  display: inline-block;
  -webkit-animation-name: heartBlast;
  animation-name: heartBlast;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-timing-function: steps(28);
  animation-timing-function: steps(28);
  background-position: right;
}
.heartl {
  background-position: left;
}
</style>
