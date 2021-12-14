<template>
  <div class="home content">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-video-play" @click="playAll('播放全部')">播放全部</el-button>
        <el-button type="primary" size="mini" icon="el-icon-folder-add" @click="insetMusic">导入歌曲</el-button>
        <input id="hide-ipt" type="file" multiple @change="handleFileChange">
      </el-form-item>
      <el-form-item>
        <el-input v-model="localSearch" placeholder="请输入内容" clearable size="mini" @input="searchIpt">
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" highlight-current-row stripe size="small" style="width: 100%" @row-contextmenu="contextmenu" @row-dblclick="playAll('双击')">
      <el-table-column type="index" width="40" :index="zero" />
      <el-table-column prop="title" label="音乐标题" sortable />
      <el-table-column label="歌手" sortable>
        <template slot-scope="scope">
          <span v-for="(item,i) in scope.row.artist" :key="item">
            {{ item }}
            <i v-if="i!==scope.row.artist.length-1">/</i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="album" label="专辑" sortable />
      <el-table-column prop="duration" label="时长" sortable width="70" />
      <el-table-column prop="size" label="大小" sortable width="80" />
    </el-table>
    <!-- 右键菜单 -->
    <ul v-show="isShow" id="menu" ref="menu">
      <li @click="menuClick(1)"><i class="el-icon-caret-right" /> 播放</li>
      <li @click="menuClick(2)"><i class="el-icon-delete-solid" /> 删除</li>
    </ul>
  </div>
</template>

<script>
import * as mm from 'music-metadata'
import { toMinute, formatFileSize, deepClone } from '@/utils/index'
const { v4: uuidv4 } = require('uuid')
export default {
  name: 'Home',
  data() {
    return {
      localSearch: '',
      tableData: [],
      isShow: false,
      isContextmenu: false, // 是否点击了右键
      choose: {} // 右键某条数据
    }
  },
  mounted() {
    this.tableData = this.$localStore.getTracks()
  },
  methods: {
    // 序号补0
    zero(index) {
      return index < 10 ? '0' + (index + 1) : index + 1
    },
    // 添加聚焦
    insetMusic() {
      const ipt = document.getElementById('hide-ipt')
      ipt.click()
    },
    // 右键某一行
    contextmenu(row, column, event) {
      event.preventDefault()
      const clientX = event.clientX
      const clientY = event.clientY - 60
      // 改变自定义菜单的隐藏与显示
      this.isShow = true
      this.choose = row
      // 根据事件对象中鼠标点击的位置，进行定位
      this.$refs.menu.style.left = clientX > 860 ? '860px' : clientX - 60 + 'px'
      this.$refs.menu.style.top = clientY + 'px'
      document.addEventListener('click', this.addEvent, false)
    },
    // 监听事件
    addEvent(e) {
      if (!this.$refs.menu.contains(e.target)) {
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
          this.$playStore.addPlays([this.choose])
          break
        // 删除
        case 2:
          this.$localStore.removeTrack(this.choose.id)
          this.tableData = this.$localStore.getTracks()
          break
      }
    },
    // 文件选择
    handleFileChange(e) {
      const files = e.target.files
      if (files && files[0]) {
        for (let index = 0; index < files.length; index++) {
          const el = files[index]
          const music = { id: uuidv4(), favorate: false, tone: 'local' }
          music.path = 'file://' + el.path
          music.size = formatFileSize(el.size.toFixed(3))
          mm.parseFile(el.path, {}).then(metadata => {
            // 图片
            try {
              const metadataPic = metadata.common.picture[0]
              music.picUrl = `data:${metadataPic.format};base64,${metadataPic.data.toString('base64')}`
            } catch (err) { console.log('noPictrue') }

            // 音乐标题
            music.title = metadata.common.title
            // 专辑
            music.album = metadata.common.album
            // 歌手
            music.artist = metadata.common.artists // 可能会有多个
            // 时长
            music.duration = toMinute(metadata.format.duration)
            new Promise((resolve) => {
              const data = this.$localStore.addTracks(music)
              resolve(data)
            }).then((res) => {
              this.tableData = res
            }).catch(err => {
              this.$notify({
                message: err,
                type: 'warning',
                duration: 2000
              })
            })
          })
        }
      }
    },
    playAll(text) {
      this.$confirm('\'' + text + '\'将替换当前播放列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$playStore.clearPlays()
        const local = this.$localStore.getTracks()
        this.$playStore.addPlays(deepClone(local))
      })
    },
    // 搜索
    searchIpt() {
      const local = this.$localStore.getTracks()
      if (this.localSearch !== '') {
        const options = local.filter(item => {
          return item.title.indexOf(this.localSearch) !== -1
        })
        this.tableData = options
      } else {
        this.tableData = local
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  #hide-ipt {
    display: none;
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
