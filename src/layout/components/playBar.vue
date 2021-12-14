<template>
  <div class="playbar df between">
    <div class="df flex1 singInfo">
      <!-- 音乐图片 -->
      <div class="pic mr10" @click="showLry">
        <img :class="rotate&&'rotate'" :src="song.picUrl?song.picUrl:require('../../assets/images/music.jpg')">
        <i class="el-icon-arrow-up" />
      </div>
      <!-- 音乐名、歌手 -->
      <div class="sing">
        <marquee :val="song.title" />
        <marquee2 class="singer" :val="song.artist?song.artist.join('/'):''" />
      </div>
      <!-- 喜欢 -->
      <beatheat :favorate="song.favorate" @changeBeat="changeBeat" />
    </div>
    <!-- 播放 -->
    <playaudio :voice="voice" :song="song" :playing="playing" :play-type="playType" @imgRotate="imgRotate" />

    <!-- 功能性按钮 -->
    <div class="some-btn df">
      <!-- 音质 -->
      <el-tag v-if="song.tone==='local'" size="mini" effect="plain" class="quality">本地</el-tag>
      <el-tag v-else size="mini" effect="plain" class="quality">无损</el-tag>
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
        <img src="./images/duilie.svg" title="打开播放列表" @click="drawerOpen">
      </div>
    </div>
    <el-drawer :visible.sync="drawer" size="40%" :show-close="false" :destroy-on-close="true" class="songList" custom-class="drawerContent" :modal="false" direction="rtl">
      <div slot="title" class="df between">
        <p>
          <b>当前播放</b>
          <i>共{{ songList.length }}首</i>
        </p>
        <el-button type="text" size="mini" @click="clearList">清空列表</el-button>
      </div>
      <div class="drawerBody">
        <el-table ref="singleTable" :data="songList" highlight-current-row stripe :row-class-name="tableRowClassName" tooltip-effect="light" :show-header="false" size="small" style="width: 100%" @row-contextmenu="contextmenu" @row-dblclick="playChoose">
          <el-table-column prop="title" label="音乐标题" sortable show-overflow-tooltip />
          <el-table-column label="歌手" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.artist" :key="item">
                {{ item }}
                <i v-if="i!==scope.row.artist.length-1">/</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="时长" sortable width="70" />
        </el-table>
      </div>
    </el-drawer>
    <!-- 右键菜单 -->
    <ul v-show="isShow" id="menu" ref="menu2">
      <li @click="menuClick(1)"><i class="el-icon-caret-right" /> 播放</li>
      <li @click="menuClick(2)"><i class="el-icon-delete-solid" /> 删除</li>
    </ul>
  </div>
</template>
<script>
import beatheat from '@/components/Beatheart/beatheat'
import playaudio from '@/components/Playaudio/playaudio'
import marquee from '@/components/marquee'
import marquee2 from '@/components/marquee2'
export default {
  components: { beatheat, playaudio, marquee, marquee2 },
  data() {
    return {
      voice: 100,
      drawer: false,
      rotate: false,
      playType: 0,
      songSinger: '',
      songList: [],
      isShow: false,
      playing: false,
      songIndex: 0,
      first: true
    }
  },
  computed: {
    song() {
      if (this.songList.length > 0) {
        return this.songList[this.songIndex]
      } else {
        return {
          favorate: false,
          tone: false,
          path: null,
          size: 0,
          picUrl: require('../../assets/images/music.jpg'),
          title: '',
          album: '',
          duration: '0:00'
        }
      }
    }
  },
  mounted() {
    this.songIndex = this.$playStore.getPlaysIndex()
    this.songList = this.$playStore.getPlays()
    this.playType = this.$playStore.getPlaysType()
  },
  methods: {
    imgRotate(bool) {
      this.rotate = bool
    },
    changeBeat() {
      this.$playStore.editFavorate(this.song.id)
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
      this.$playStore.savePlaysType(this.playType)
    },
    // 右键某一行
    contextmenu(row, column, event) {
      event.preventDefault()
      const clientX = event.clientX
      const clientY = event.clientY
      // 改变自定义菜单的隐藏与显示
      this.isShow = true
      this.choose = row
      // 根据事件对象中鼠标点击的位置，进行定位
      this.$refs.menu2.style.left = clientX > 860 ? '860px' : clientX - 60 + 'px'
      this.$refs.menu2.style.top = clientY + 'px'
      document.addEventListener('click', this.addEvent, false)
    },
    // 监听事件
    addEvent(e) {
      if (!this.$refs.menu2.contains(e.target)) {
        this.isShow = false
        document.removeEventListener('click', this.addEvent, false)
      }
    },
    // 右键选择
    menuClick(key) {
      this.isShow = false
      document.removeEventListener('click', this.addEvent, false)
      switch (key) {
        // 播放
        case 1:
          this.setCurrent(this.choose.index)
          this.$playStore.editPlaysIndex(this.choose.index)
          this.songIndex = this.$playStore.getPlaysIndex()
          this.first = false
          break
        // 删除
        case 2:
          this.$playStore.removePlays(this.choose.id)
          this.songList = this.$playStore.getPlays()
          break
      }
    },
    // 双击播放
    playChoose(row) {
      this.setCurrent(row.index - 1)
      this.$playStore.editPlaysIndex(row.index)
      this.songIndex = this.$playStore.getPlaysIndex()
      this.first = false
      this.playing = true
      console.log(row.index - 1)
    },
    // 清空播放列表
    clearList() {
      this.$playStore.clearPlays()
      this.songList = this.$playStore.getPlays()
      console.log(this.song)
    },
    // 打开播放列表
    drawerOpen() {
      this.drawer = !this.drawer
      if (this.drawer) {
        this.songList = this.$playStore.getPlays()
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 抽屉高亮
    setCurrent(index) {
      this.$refs.singleTable.setCurrentRow(this.songList[index + 1])
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
  .drawerContent {
    #el-drawer__title {
      .df {
        p {
          b {
            font-size: 16px;
          }
          i {
            font-style: normal;
            font-size: 12px;
            color: @themeGray;
            margin-left: 5px;
          }
        }
      }
    }
    .drawerBody {
      width: 100%;
      height: 100%;
      border-top: 1px solid @themeGray;
    }
  }
  #menu {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border: 1px solid #ebeef5;
    width: 150px;
    border-radius: 4px;
    padding: 10px 0;
    font-size: 14px;
    box-sizing: border-box;
    position: absolute;
    z-index: 99999;
    li {
      padding: 5px 15px;
      color: #303030;
      &:hover {
        background-color: #efefef;
      }
      i {
        margin-right: 5px;
      }
    }
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
