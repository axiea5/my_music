/**
 * 秒值转时分秒
 * @name toMinute
 * @example 秒值转时分秒
 * @param {String} seconds 秒
 */
export function toMinute(seconds) {
  const param = parseInt(seconds)
  // let hh = ''
  let mm = ''
  let ss = ''
  if (param >= 0 && param < 60) {
    param < 10 ? (ss = '0' + param) : (ss = param)
    return '00:' + ss
  } else if (param >= 60 && param < 3600) {
    mm = parseInt(param / 60)
    mm < 10 ? (mm = '0' + mm) : mm
    param - parseInt(mm * 60) < 10 ? (ss = '0' + String(param - parseInt(mm * 60))) : (ss = param - parseInt(mm * 60))
    return mm + ':' + ss
  }
}

/**
 * bytes转MB
 * @name formatFileSize
 * @example bytes转MB
 * @param {Number} fileSize bytes
 */
export function formatFileSize(fileSize) {
  var temp
  if (fileSize < 1024) {
    return fileSize + 'B'
  } else if (fileSize < (1024 * 1024)) {
    temp = fileSize / 1024
    temp = temp.toFixed(2)
    return temp + 'KB'
  } else if (fileSize < (1024 * 1024 * 1024)) {
    temp = fileSize / (1024 * 1024)
    temp = temp.toFixed(2)
    return temp + 'MB'
  } else {
    temp = fileSize / (1024 * 1024 * 1024)
    temp = temp.toFixed(2)
    return temp + 'GB'
  }
}

/**
 * 深拷贝（递归）
 * @param {*} source 需要拷贝的值
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
