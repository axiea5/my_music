
import { autoUpdater } from 'electron-updater'
import { ipcMain } from 'electron'
const path = require('path')
const fs = require('fs-extra')

let mainWindow = null

if (process.env.NODE_ENV === 'development') {
  autoUpdater.updateConfigPath = path.join(__filename, '../../dist_electron/win-unpacked/resources/app-update.yml')
}

// 更新前，删除本地安装包 ↓
const updaterCacheDirName = 'my_music-updater'
const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCacheDirName, 'pending')
fs.emptyDir(updatePendingPath)

export function updateHandle(window, feedUrl) {
  mainWindow = window
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }
  // 设置更新包的地址
  autoUpdater.setFeedURL(feedUrl)
  // 监听升级失败事件
  autoUpdater.on('error', function(error) {
    sendUpdateMessage({
      cmd: 'error',
      message: error
    })
  })
  // 监听开始检测更新事件
  autoUpdater.on('checking-for-update', function() {
    sendUpdateMessage({
      cmd: 'checking-for-update',
      message: message.checking
    })
  })
  // 监听发现可用更新事件
  autoUpdater.on('update-available', function() {
    sendUpdateMessage({
      cmd: 'update-available',
      message: message.updateAva
    })
  })
  // 监听没有可用更新事件
  autoUpdater.on('update-not-available', function() {
    sendUpdateMessage({
      cmd: 'update-not-available',
      message: message.updateNotAva
    })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    sendUpdateMessage({
      cmd: 'download-progress',
      message: progressObj
    })
    // mainWindow.webContents.send('downloadProgress', progressObj)
  })
  // 监听下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl) {
    // sendUpdateMessage({
    //   cmd: 'update-downloaded',
    //   message: {
    //     releaseNotes,
    //     releaseName,
    //     releaseDate,
    //     updateUrl
    //   }
    // })
    // // 退出并安装更新包
    // autoUpdater.quitAndInstall()

    /**
     * 和渲染进程通信，如果接收到"isUpdateNow"则调用autoUpdater.quitAndInstall();
     * 退出应用程序并安装
     */
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments)
      console.log('开始更新')
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })

    mainWindow.webContents.send('isUpdateNow')
  })

  // 接收渲染进程消息，开始检查更新
  ipcMain.on('checkForUpdate', (e, arg) => {
    // 执行自动更新检查
    // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
    autoUpdater.checkForUpdates()
  })
}
// 给渲染进程发送消息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}
