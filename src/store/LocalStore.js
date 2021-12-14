// 本地音乐存储
const Store = require('electron-store')

// 实现一个本地存储类
class LocalStore extends Store {
  constructor(settings) {
    super(settings)
    this._tracks = this.getTracks() // 保存的列表
  }

  // 保存
  saveTracks() {
    this.set('tracks', this._tracks)
    return this
  }

  // 获取
  getTracks() {
    return this.get('tracks') || []
  }

  // 添加
  addTracks(tracks) {
    return new Promise((resolve, reject) => {
      const getTracks = this._tracks
      const path = getTracks.filter((item) => {
        return item.path === tracks.path
      })
      if (path.length > 0) {
        reject('《' + tracks.title + '》已存在')
      } else {
        this._tracks.push(tracks)
        this.saveTracks()
        resolve(this.getTracks())
      }
    })
  }

  // 删除某条
  removeTrack(id) {
    this._tracks = this._tracks.filter(track => track.id !== id)
    return this.saveTracks()
  }
}
module.exports = LocalStore
