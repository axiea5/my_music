import http from '../utils/http'

// 登录
export function login(data) {
  return http.post('/login/cellphone?timestamp=' + new Date().getTime(), data)
}

// 退出
export function logout() {
  return http.post('/logout?timestamp=' + new Date().getTime())
}

// 检测手机号码是否已注册
export function checkPhone(data) {
  return http.post('/cellphone/existence/check?timestamp=' + new Date().getTime(), data)
}

// 获取账号信息
export function account(data) {
  return http.post('/user/account?timestamp=' + new Date().getTime(), data)
}

// 搜索
export function search(data) {
  return http.post('/cloudsearch?timestamp=' + new Date().getTime(), data)
}

// 获取音乐 url
export function getSongUrl(id) {
  return http.get('/song/url', { params: id })
}

// 收藏/取消收藏专辑
export function collectSong(data) {
  return http.post('/album/sub?timestamp=' + new Date().getTime(), data)
}
