<template>
  <div class="playaudio flex1">
    <audio ref="audio" :src="song.path" crossOrigin="true" :loop="loop" @timeupdate="onTimeupdate" />
    <!-- 播放按钮 -->
    <div class="audio-btn">
      <i class="iconfont icon-arrow-left" @click="skipBack" />
      <img v-show="!playing" class="center-btn" src="./images/bofang.png" @click="playMusic">
      <img v-show="playing" src="./images/zanting.png" class="center-btn" @click="playMusic">
      <i class="iconfont icon-arrow-right" @click="skipForward" />
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
      <span class="maxTime">{{ song.duration }}</span>
    </div>
  </div>
</template>
<script>
import { toMinute } from '@/utils/index'
export default {
  props: {
    voice: {
      type: Number,
      default: 0
    },
    playing: {
      type: Boolean,
      default: false
    },
    song: {
      type: Object,
      default: () => ({})
    },
    playType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      thumbTranslateX: 0,
      audioProgress: 0,
      currentTime: '00:00', // 当前时长
      loop: false,
      shuffleList: [],
      shuffleIndex: 0,
      first: true // 哎，我也不晓得啷个一进来他就自动播放了
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
    },
    'song.path'() {
      if (!this.$parent.first) {
        this.currentTime = '00:00'
        this.thumbTranslateX = 0
        this.audioProgress = 0
        this.$parent.playing = true
        setTimeout(() => {
          this.$refs.audio.play()
        }, 100)
        this.$emit('imgRotate', true)
      }
    },
    playType(newV) {
      if (newV === 1) {
        this.loop = true
      } else if (newV === 2) {
        const playIndex = this.$parent.songIndex
        const len = this.$parent.songList.length
        this.shuffleList[0] = playIndex
        this.shuffle(this.shuffleList, len)
      }
    }
  },
  created() {
  },
  methods: {
    playMusic() {
      this.$parent.first = false
      if (this.playing) {
        // 播放中,点击则为暂停
        this.$parent.playing = false
        this.$refs.audio.pause()
        this.$emit('imgRotate', false)
      } else {
        // 暂停中,点击则为播放
        this.$parent.playing = true
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
    skipBack() {
      const playList = this.$parent.songList
      const playIndex = this.$parent.songIndex
      switch (this.playType) { // 0顺序 1单曲 2随机 3循环
        case 0: // 0顺序
          if (playIndex !== 0) {
            this.$parent.setCurrent(playIndex - 2)
            this.$playStore.editPlaysIndex(playIndex - 1)
            this.$parent.songIndex = this.$playStore.getPlaysIndex()
          }
          break
        case 2: // 2随机
          if (this.shuffleIndex !== 0) {
            this.shuffleIndex -= 1
          } else {
            this.shuffleList = []
            this.shuffleList[0] = playIndex
            this.shuffle(this.shuffleList, playList.length)
            this.shuffleIndex = 1
          }
          this.$playStore.editPlaysIndex(this.shuffleList[this.shuffleIndex])
          this.$parent.songIndex = this.$playStore.getPlaysIndex()
          this.$parent.setCurrent(this.shuffleList[this.shuffleIndex] - 1)
          break
        case 3: // 3循环
          if (playIndex !== 0) {
            this.$playStore.editPlaysIndex(playIndex - 1)
            this.$parent.setCurrent(playIndex - 1)
          } else {
            this.$playStore.editPlaysIndex(playList.length - 1)
            this.$parent.setCurrent(playList.length - 1)
          }
          this.$parent.songIndex = this.$playStore.getPlaysIndex()
          break
      }
    },
    // 后一首
    skipForward() {
      this.changeType()
    },
    // 播放进度
    onTimeupdate() {
      const progressL = this.$refs.track.offsetWidth // 进度条总长
      this.audioProgress = this.$refs.audio.currentTime / this.$refs.audio.duration
      this.thumbTranslateX = (this.audioProgress * progressL).toFixed(3)
      this.currentTime = toMinute(this.$refs.audio.currentTime)
      if (this.currentTime === this.song.duration) {
        this.$emit('imgRotate', false)
        this.changeType()
      }
    },
    changeType() {
      var playList = this.$parent.songList
      var playIndex = this.$parent.songIndex
      switch (this.playType) { // 0顺序 1单曲 2随机 3循环
        case 0: // 0顺序
          if (playList.length - 1 !== playIndex) {
            this.$playStore.editPlaysIndex(playIndex + 1)
            this.$parent.songIndex = this.$playStore.getPlaysIndex()
            this.$parent.setCurrent(playIndex)
          }
          break
        case 2: // 2随机
          if (playList.length - 1 !== this.shuffleIndex) {
            this.shuffleIndex += 1
          } else {
            this.shuffleList = []
            this.shuffleList[0] = playIndex
            this.shuffle(this.shuffleList, playList.length)
            this.shuffleIndex = 1
          }
          this.$playStore.editPlaysIndex(this.shuffleList[this.shuffleIndex])
          this.$parent.songIndex = this.$playStore.getPlaysIndex()
          this.$parent.setCurrent(this.shuffleList[this.shuffleIndex] - 1)
          break
        case 3: // 3循环
          if (playList.length - 1 !== playIndex) {
            this.$playStore.editPlaysIndex(playIndex + 1)
            this.$parent.setCurrent(playIndex)
          } else {
            this.$playStore.editPlaysIndex(0)
            this.$parent.setCurrent(-1)
          }
          this.$parent.songIndex = this.$playStore.getPlaysIndex()
          break
      }
    },
    // 打乱index，默认第一个为当前index
    shuffle(newArr, len) {
      var indexx = Math.floor(Math.random() * len)
      if (newArr.length === len) {
        return newArr
      } else {
        if (!newArr.includes(indexx)) {
          newArr.push(indexx)
        }
        this.shuffle(newArr, len)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/variables.less";
@import "~@/styles/iconfont.css";
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
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
