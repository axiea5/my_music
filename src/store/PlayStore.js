// 当前播放
const Store = require('electron-store')
const Utils = require('../utils/index')

// 实现一个本地存储类
class PlayStore extends Store {
  constructor(settings) {
    super(settings)
    this.isLocal = false
    this._plays = this.getPlays() // 播放列表
    this._playsIndex = this.getPlaysIndex() // 播放第几首
    this._playType = this.getPlaysType()
  }

  // 保存
  savePlays() {
    this.set('plays', this._plays)
    return this
  }

  // 获取
  getPlays() {
    return this.get('plays') || []
  }

  // 添加
  addPlays(list) {
    const getPlays = this._plays
    if (getPlays.length > 0) {
      for (let k = 0; k < list.length; k++) {
        for (let i = 0; i < getPlays.length; i++) {
          if (list[k].path !== getPlays[i].path) {
            this._plays.push(list[k])
          }
        }
      }
    } else {
      this._plays = Utils.deepClone(list)
    }
    this.savePlays()
    return this.getPlays()
  }

  // 删除某条
  removePlays(id) {
    this._plays = this._plays.filter(play => play.id !== id)
    return this.savePlays()
  }

  // 清空数据
  clearPlays() {
    this._plays = []
    return this.savePlays()
  }

  // 更改index
  savePlayIndex() {
    this.set('playsIndex', this._playsIndex)
    return this
  }

  // 更改index
  editPlaysIndex(id) {
    this._playsIndex = id
    return this.savePlayIndex()
  }

  // 获取index
  getPlaysIndex() {
    return this.get('playsIndex') || 0
  }

  editFavorate(id) {
    this._plays = this._plays.map(item => {
      if (item.id === id) {
        item.favorate = !item.favorate
      }
      return item
    })
    console.log(this._plays)
    return this.savePlays()
  }

  // 获取
  getPlaysType() {
    return this.get('playsType') || 0
  }

  // 保存播放类型 0顺序 1单曲 2随机 3循环
  savePlaysType(type) {
    this.set('playsType', this._playType)
    return this
  }
}
module.exports = PlayStore
