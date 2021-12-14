<template>
  <div id="marquee-wrap2" @mouseover="startInter">
    <!-- 滚动内容 -->
    <div id="scroll2">
      <p id="marquee2">{{ val }}</p>
      <!-- 文字副本 -->
      <p id="copy2" />
    </div>
    <!-- 为了计算总文本宽度，通过css在页面中隐藏 -->
    <p id="getWidth2">{{ val }}</p>
  </div>
</template>

<script>
export default {
  props: {
    val: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: null,
      lock: true
    }
  },
  beforeDestroy() {
    // 清除计时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    startInter() {
      const maxWidth = document.querySelector('#marquee-wrap2').clientWidth
      // 获取文字text 的计算后宽度 （由于overflow的存在，直接获取不到，需要独立的node计算）
      const width = document.querySelector('#getWidth2').scrollWidth
      // 如果文本内容的宽度小于页面宽度，则表示文字小于等于一行，则不需要滚动
      const scroll = document.querySelector('#scroll2')
      const copy = document.querySelector('#copy2')
      if (width > maxWidth) {
        if (this.lock === true) {
          copy.innerText = this.val // 文字副本填充
          this.lock = false
          const lastWidth = width + 10
          let distance = 0 // 位移距离
          this.timer = setInterval(() => {
            distance -= 1
            // 如果位移超过文字宽度，则回到起点
            if (-distance >= lastWidth) {
              distance = 0 // 距离必须与marquee的margin宽度相同
              this.lock = true
              clearInterval(this.timer)
            }
            scroll.style.transform = 'translateX(' + distance + 'px)'
          }, 50)
        }
      } else {
        return
      }
    }
    // stopInter() {
    //   const scroll = document.querySelector('.scroll')
    //   scroll.style.transform = 'translateX(0px)'
    // }
  }

}
</script>
 <style scoped lang='less'>
#marquee-wrap2 {
  width: 100%;
  overflow: hidden;
  position: relative;
  #scroll2 {
    display: flex;
    p {
      word-break: keep-all; // 不换行
      white-space: nowrap;
      /* 设置前后间隔 */
      &#marquee2 {
        margin-right: 10px;
      }
    }
  }
  /* 仅为了获取宽度，故隐藏掉 */
  #getWidth2 {
    word-break: keep-all; // 不换行
    white-space: nowrap;
    position: absolute;
    opacity: 0;
    top: 0;
  }
}
</style>
