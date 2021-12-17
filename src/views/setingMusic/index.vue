<template>
  <div class="seting">
    <el-button type="primary" plain size="small" @click="updateCheck">检查更新</el-button>
    <el-dialog custom-class="uploadDialog" :top="'40vh'" :visible.sync="dialogVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
      <p slot="title" class="uploadTitle">正在更新新版本,请稍候...</p>
      <div class="progress">
        <el-progress :percentage="percentage" :show-text="true" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer

export default {
  data() {
    return {
      dialogVisible: false,
      percentage: 0
    }
  },
  mounted() {
    let loadingInstance
    // 接收主进程版本更新消息
    ipcRenderer.on('message', (event, arg) => {
      console.log(arg)
      if (arg.cmd === 'checking-for-update') {
        loadingInstance = this.$loading({
          lock: true,
          text: arg.message,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      } else if (arg.cmd === 'update-available') {
        // 显示升级对话框
        this.dialogVisible = true
      } else if (arg.cmd === 'download-progress') {
        const percent = Math.round(parseFloat(arg.message.percent))
        this.percentage = percent
      } else if (arg.cmd === 'error') {
        loadingInstance.close()
        this.dialogVisible = false
        this.$message.error('更新失败')
      } else if (arg.cmd === 'update-not-available') {
        loadingInstance.close()
        this.$message({
          message: arg.message,
          type: 'success'
        })
      }
    })
    ipcRenderer.on('isUpdateNow', () => {
      loadingInstance.close()
      this.dialogVisible = false
      // 下载完成之后提示用户更新程序
      this.$confirm('更新包下载完成，是否立即安装到最新版本？', '更新包下载完成', {
        confirmButtonText: '立即更新',
        cancelButtonText: '暂时不了',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        ipcRenderer.send('isUpdateNow')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    })
  },
  destroyed() {
    if (process.env.NODE_ENV === 'production') {
      ipcRenderer.removeAll(['message', 'downloadProgress', 'isUpdateNow'])
    }
  },
  methods: {
    updateCheck() {
      setTimeout(() => {
        ipcRenderer.send('checkForUpdate')
      }, 500)
    }
  }
}
</script>
<style lang="less" scoped>
.seting {
  ::v-deep.uploadDialog {
    .el-dialog__body {
      text-align: center;
      padding: 10px 26px 25px;
    }
  }
}
</style>
