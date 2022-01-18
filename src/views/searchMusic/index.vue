<template>
  <div class="search-music content">
    <h2>搜索：{{ params.keywords }}</h2>
    <el-table v-loading="loading" :data="tableData" height="calc(100% - 86px)" highlight-current-row stripe size="small" style="width: 100%" @row-contextmenu="contextmenu" @row-dblclick="playNow">
      <el-table-column type="index" width="40" :index="zero" />
      <el-table-column prop="name" label="音乐标题" show-overflow-tooltip />
      <el-table-column label="歌手" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="(item,i) in scope.row.ar" :key="i">
            {{ item.name }}
            <i v-if="i!==scope.row.ar.length-1">/</i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="al.name" label="专辑" show-overflow-tooltip />
      <el-table-column prop="dt" label="时长" width="80" :formatter="toMinu" />
      <el-table-column label="热度" width="100">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.pop" :show-text="false" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background small hide-on-single-page :page-size="100" layout="prev, pager, next" :total="total" @next-click="nextClick" @prev-click="prevClick" @current-change="currentChange" />
    </div>
    <!-- 右键菜单 -->
    <ul v-show="isShow" id="menu" ref="menu">
      <li @click.prevent="menuClick(1)"><i class="el-icon-caret-right" /> 播放</li>
      <li @click.prevent="menuClick(2)"><i class="el-icon-star-on" /> 收藏</li>
      <li @click.prevent="menuClick(3)"><i class="el-icon-download" /> 下载</li>
    </ul>
  </div>
</template>
<script>
import { search, getSongUrl, collectSong } from '@/api/index'
import { toMinute } from '@/utils/index'
export default {
  data() {
    return {
      params: {
        keywords: '',
        limit: 100,
        offset: 1
      },
      tableData: [],
      total: 0,
      loading: false,
      isShow: false,
      choose: {}
    }
  },
  created() {
    if (this.$route.query.keywords) {
      this.params.keywords = this.$route.query.keywords
      this.init(this.params)
    }
  },
  methods: {
    init(params) {
      var that = this
      that.loading = true
      search(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          that.tableData = []
          that.total = res.result.songCount
          that.tableData = res.result.songs
          that.loading = false
        }
      }).catch(() => {
        that.loading = false
      })
    },
    // 格式化序号补0
    zero(index) {
      return index < 9 ? '0' + (index + 1) : index + 1
    },
    // 格式化时长
    toMinu(row, column, cellValue, index) {
      return toMinute(cellValue / 1000)
    },
    // 下一页
    nextClick() {
      this.params.offset += 1
      this.init(this.params)
    },
    // 上一页
    prevClick() {
      this.params.offset -= 1
      this.init(this.params)
    },
    // 点击某页
    currentChange(page) {
      this.params.offset = page
      this.init(this.params)
    },
    // 右键某一行
    contextmenu(row, column, event) {
      console.log(row)
      event.preventDefault()
      const clientX = event.clientX
      const clientY = event.clientY - 60
      // 改变自定义菜单的隐藏与显示
      this.isShow = true
      // 根据事件对象中鼠标点击的位置，进行定位
      this.$refs.menu.style.left = clientX > 860 ? '860px' : clientX - 60 + 'px'
      this.$refs.menu.style.top = clientY + 'px'
      document.addEventListener('click', this.addEvent, false)
      let urlPath = ''
      const artist = []
      row.ar.forEach(el => {
        artist.push(el.name)
      })
      getSongUrl({ id: row.id }).then(res => {
        if (res.data[0].url) {
          urlPath = res.data[0].url
        }
        this.choose = {
          id: row.id,
          favorate: false,
          tone: 'search',
          path: urlPath,
          picUrl: row.al.picUrl,
          artist: artist,
          title: row.name,
          album: row.al.name,
          duration: toMinute(row.dt / 1000)
        }
        console.log(this.choose)
      })
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
      console.log(this.choose.path)
      document.removeEventListener('click', this.addEvent, false)
      if (!this.choose.path) {
        this.$message.error('亲爱的,暂无版权！')
      } else {
        console.log(111)
        switch (key) {
          // 播放
          case 1:
            this.$playStore.addPlays([this.choose])
            break
          // 收藏
          case 2:
            collectSong({ id: this.choose.id }).then(res =>
              console.log(res)
            )
            break
          case 3:
            // 使用获取到的blob对象创建的url
            const filePath = this.choose.path // mp3的地址
            fetch(filePath).then(res => res.blob()).then(blob => {
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style.display = 'none'
              // 使用获取到的blob对象创建的url
              const url = window.URL.createObjectURL(blob)
              a.href = url
              // 指定下载的文件名
              a.download = this.choose.title + '.mp3'
              a.click()
              document.body.removeChild(a)
              // 移除blob对象的url
              window.URL.revokeObjectURL(url)
            })
            break
        }
      }
    },
    playNow() {
      if (this.choose.path === '') {
        this.$message.error('亲爱的,暂无版权！')
      } else {
        this.$playStore.addPlays([this.choose])
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search-music {
  h2 {
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 15px;
    text-align: center;
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
