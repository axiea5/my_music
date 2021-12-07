<template>
  <div class="playbar df between">
    <div class="df flex1 singInfo">
      <!-- 音乐图片 -->
      <div class="pic mr10" @click="showLry">
        <img :class="rotate&&'rotate'" :src="require('../../assets/images/music.jpg')">
        <i class="el-icon-arrow-up" />
      </div>
      <!-- 音乐名、歌手 -->
      <div class="sing">
        <!-- <h4>最爱</h4> -->
        <marquee :val="songTitle" />
        <marquee class="singer" :val="songSinger" />
      </div>
      <!-- 喜欢 -->
      <beatheat />
    </div>
    <!-- 播放 -->
    <playaudio :voice="voice" @imgRotate="imgRotate" />

    <!-- 功能性按钮 -->
    <div class="some-btn df flex1">
      <!-- 音质 -->
      <el-tag size="mini" effect="plain" class="quality">无损</el-tag>
      <!-- 音量 -->
      <div class="volume">
        <el-popover placement="top" popper-class="sound" trigger="hover" width="60px">
          <el-slider v-model="voice" vertical :show-tooltip="false" height="100px" />
          <img slot="reference" src="./images/yinliang.svg">
        </el-popover>
      </div>
      <!-- 顺序播放 -->
      <div @click="playTypeChange">
        <img v-show="playType===0" src="./images/shunxu.svg" title="顺序播放">
        <img v-show="playType===1" src="./images/danqu.svg" title="单曲播放">
        <img v-show="playType===2" src="./images/suiji.svg" title="随机播放">
        <img v-show="playType===3" src="./images/xunhuan.svg" title="列表循环">
      </div>
      <!-- 列表 -->
      <div>
        <img src="./images/duilie.svg" title="打开播放列表" @click="drawer?drawer=false:drawer=true">
      </div>
    </div>
    <el-drawer title="当前播放" :visible.sync="drawer" class="songList" :modal="false" direction="rtl">
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>
<script>
import beatheat from '@/components/Beatheart/beatheat'
import playaudio from '@/components/Playaudio/playaudio'
import marquee from '@/components/marquee'
export default {
  components: { beatheat, playaudio, marquee },
  data() {
    return {
      voice: 80,
      drawer: false,
      rotate: false,
      playType: 0,
      songTitle: '最爱',
      songSinger: '阿梨粤'
    }
  },

  mounted() {
  },
  methods: {
    imgRotate(bool) {
      this.rotate = bool
      console.log(bool)
    },
    showLry() {
      // 歌词页面
    },
    playTypeChange() {
      if (this.playType === 3) {
        this.playType = 0
      } else {
        this.playType += 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/variables.less";
.playbar {
  height: 80px;
  background-color: #f0eeff;
  padding: 10px;
  justify-content: space-between;
  .singInfo {
    width: 220px;
  }
  .pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #9e9e9e;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    i {
      display: none;
    }
    &:hover {
      cursor: pointer;
      img {
        filter: blur(2px);
      }
      i {
        position: absolute;
        display: block;
        color: #fff;
        font-size: 23px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .rotate {
    animation: rotatePic 6s infinite linear;
  }
  @keyframes rotatePic {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
  .sing {
    max-width: 120px;
    h4,
    p {
      white-space: nowrap;
      overflow: hidden;
    }
    .singer {
      font-size: 13px;
    }
  }
  .some-btn {
    div {
      width: 26px;
      height: 26px;
      margin-right: 20px;
      cursor: pointer;
    }
    .quality {
      cursor: pointer;
      margin-right: 20px;
    }
  }
  .songList {
    bottom: 80px !important;
  }
}
</style>
<style lang="less">
.el-popover.sound {
  min-width: 20px !important;
  padding: 12px 0 !important;
  .el-slider__button {
    width: 12px;
    height: 12px;
  }
  .popper__arrow {
    left: 36% !important;
  }
}
</style>
