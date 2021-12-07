<template>
  <div class="playaudio flex1">
    <audio ref="audio" :src="audioUrl" @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata" />
    <!-- 播放按钮 -->
    <div class="audio-btn">
      <i class="el-icon-caret-left" @click="skipBack" />
      <img v-show="!playing" class="center-btn" src="./images/bofang.png" @click="playMusic">
      <img v-show="playing" src="./images/zanting.png" class="center-btn" @click="playMusic">
      <i class="el-icon-caret-right" @click="skipForward" />
    </div>
    <!-- 播放进度 -->
    <div class="audioprocess center">
      <span class="currentTime">{{ currentTime }}</span>
      <div ref="track" class="progress-bar" @click="handleProgressClick">
        <div class="progress-box" :style="{ width: audioProgressPercent }">
          <div class="play-point" :style="{ transform: 'translateX(' + thumbTranslateX + 'px)' }">
            <i class="el-icon-star-on" />
          </div>
        </div>
      </div>
      <span class="maxTime">{{ maxTime }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    voice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      thumbTranslateX: 0,
      audioProgress: 0,
      songInfo: {},
      songList: [],
      playing: false,
      audioUrl: require('@/assets/最爱.mp3'),
      maxTime: '00:00', // 总时长
      currentTime: '00:00', // 当前时长
      playType: 1 // 播放类型：1-列表循环，2-随机播放，3-单曲循环
    }
  },
  computed: {
    audioProgressPercent() {
      return `${this.audioProgress * 100}%`
    }
  },
  watch: {
    // 声音大小
    voice(newV, oldV) {
      this.$refs.audio.volume = newV / 100
    }
  },
  mounted() {
  },
  methods: {
    playMusic() {
      if (this.playing) {
        // 播放中,点击则为暂停
        this.playing = false
        this.$refs.audio.pause()
        this.$emit('imgRotate', false)
      } else {
        // 暂停中,点击则为播放
        this.playing = true
        setTimeout(() => {
          this.$refs.audio.play()
        }, 100)
        this.$emit('imgRotate', true)
      }
    },
    handleProgressClick(event) {
      const progressL = this.$refs.track.offsetWidth // 进度条总长
      const clickX = event.offsetX
      const time = (clickX / progressL).toFixed(2)
      this.$refs.audio.currentTime = this.$refs.audio.duration * time
    },
    // 前一首
    skipBack() { },
    // 后一首
    skipForward() { },
    // 播放进度
    onTimeupdate() {
      const progressL = this.$refs.track.offsetWidth // 进度条总长
      this.audioProgress = this.$refs.audio.currentTime / this.$refs.audio.duration
      this.thumbTranslateX = (this.audioProgress * progressL).toFixed(3)
      this.currentTime = this.TimeToString(this.$refs.audio.currentTime)
    },
    // 音乐加载完成后获取总时长
    onLoadedmetadata(res) {
      this.maxTime = this.TimeToString(res.target.duration)
    },
    // 秒值转时分秒
    TimeToString(seconds) {
      const param = parseInt(seconds)
      // let hh = ''
      let mm = ''
      let ss = ''
      if (param >= 0 && param < 60) {
        param < 10 ? (ss = '0' + param) : (ss = param)
        return '00:' + ss
      } else if (param >= 60 && param < 3600) {
        mm = parseInt(param / 60)
        mm < 10 ? (mm = '0' + mm) : mm
        param - parseInt(mm * 60) < 10 ? (ss = '0' + String(param - parseInt(mm * 60))) : (ss = param - parseInt(mm * 60))
        return mm + ':' + ss
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/variables.less";
.playaudio {
  height: 100%;
  .audio-btn {
    text-align: center;
    img {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
    i {
      font-size: 36px;
      color: #8a8a8a;
      vertical-align: middle;
      cursor: pointer;
      &:hover {
        color: @themeBlue;
      }
    }
    .center-btn {
      margin: 0 20px;
    }
  }
  .audioprocess {
    width: 460px;
    margin-top: 6px;
    .progress-bar {
      width: 90%;
      height: 3px;
      background: #fff;
      cursor: pointer;
      margin: 0 10px;
      flex-grow: 1;
      .progress-box {
        height: 100%;
        background: @themeBlue;
        position: relative;
        .play-point {
          transition: -webkit-transform 0.2s linear;
          transition: transform 0.2s linear;
          transition: transform 0.2s linear, -webkit-transform 0.2s linear;
          cursor: pointer;
          position: absolute;
          top: -7px;
          left: -8px;
          i {
            color: @themeYellow;
            font-size: 18px;
          }
        }
      }
    }
    span {
      font-size: 12px;
      color: #696969;
    }
    .maxTime {
      right: 0;
    }
    .currentTime {
      left: 0;
    }
  }
}
</style>
