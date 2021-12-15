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
