// 当前播放
const Store = require('electron-store')

// 实现一个本地存储类
class HistoryStore extends Store {
  constructor(settings) {
    super(settings)
    this._historys = this.getHistorys() // 播放列表
  }

  // 保存
  saveHistorys() {
    this.set('historys', this._historys)
    return this
  }

  // 获取
  getHistorys() {
    return this.get('historys') || []
  }

  // 添加
  addHistorys(newArr) {
    const historyList = this._historys
    // 只保留100条历史记录
    if (historyList.length > 0 && historyList.length < 101) {
      for (let index = 0; index < historyList.length; index++) {
        const element = historyList[index]
        // 有这条的话就删除原来的位置，增加到最前面
        if (element.path === newArr.path) {
          historyList.splice(index + 1, 1)
          historyList.unshift(newArr)
        } else { // 没有的话就直接增加到最前面
          historyList.unshift(newArr)
        }
      }
    } else if (historyList.length === 100) { // 100条时先删除最后一条，再新增最前面
      historyList.pop()
      historyList.unshift(newArr)
    } else {
      historyList.unshift(newArr)
    }
    console.log(historyList)
    this.saveHistorys()
    return this.getHistorys()
  }

  // 清空数据
  clearHistorys() {
    this._historys = []
    return this.saveHistorys()
  }
}
module.exports = HistoryStore
