'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const PlayStore = require('./store/PlayStore')
const Playstore = new PlayStore({ name: 'Music Data' })

// 引入update.js
import { updateHandle } from './utils/update'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true }}
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1020,
    height: 700,
    frame: false, // 指定false创建一个无框窗口
    resizable: false, // 窗口是否可调整大小
    center: true, // 在屏幕中心显示窗口
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // 重要突破audio不能播放本地音乐的限制！！！
    }
  })
  win.webContents.on('did-finish-load', () => {
    win.send('getPlays', Playstore.getPlays()) // 发送完成渲染事件
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: 'detach' })
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.on('closed', () => {
    win = null
  })

  // 设置版本更新地址，即将打包后的latest.yml文件和exe文件同时放在
  // http://xxxx/test/version/对应的服务器目录下,该地址和package.json的publish中的url保持一致
  const uploadUrl = `http://127.0.0.1:5078/dist_electron/` // 服务器更新包位置
  // 检测版本更新
  updateHandle(win, uploadUrl)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 解决Linux下背景无法透明问题
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals')
  app.disableHardwareAcceleration()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// 关闭窗口
ipcMain.on('close-window', () => win.close())

// 最小化窗口
ipcMain.on('min-window', () => win.minimize())

