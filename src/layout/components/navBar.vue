<template>
  <div class="navbar">
    <!-- 左边 -->
    <div class="logo">
      <img src="./images/smile.png" alt="logo">
    </div>
    <!-- 中间 -->
    <div class="center">
      <div class="go df">
        <div @click="$router.go(-1)">
          <i class="el-icon-arrow-left" />
        </div>
        <div @click="$router.go(1)">
          <i class="el-icon-arrow-right" />
        </div>
      </div>
      <el-input v-model="search" placeholder="搜索" prefix-icon="el-icon-search" />
    </div>
    <!-- 右边 -->
    <div class="right center">
      <!-- 消息 -->
      <el-badge is-dot class="message mr10">
        <i class="el-icon-message" />
      </el-badge>
      <!-- 用户 -->
      <div v-if="haslog" class="user center">
        <el-avatar size="small" class="avatar" :src="userInfo.avatarUrl" />
        <el-dropdown trigger="click" size="small" @command="handleCommand">
          <p class="el-dropdown-link">
            <span>{{ userInfo.nickname }}</span><i class="el-icon-caret-bottom el-icon--right" />
          </p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info">个人信息</el-dropdown-item>
            <el-dropdown-item command="set">设置</el-dropdown-item>
            <el-dropdown-item command="out">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-if="!haslog" class="user center">
        <el-avatar size="small" class="avatar" :src="require('../../assets/images/avatar.png')" />
        <p class="el-dropdown-link" @click="registerDialog=true">
          <span>未登录</span><i class="el-icon-caret-bottom el-icon--right" />
        </p>
      </div>

      <!-- 窗口操作 -->
      <div class="operate">
        <!-- 缩小 -->
        <i class="el-icon-minus" @click="minusWin" />
        <!-- 关闭 -->
        <i class="el-icon-close" @click="closeWin" />
      </div>

      <!-- 登录 -->
      <el-dialog :visible.sync="registerDialog" :modal="false" custom-class="registerDialog" width="30%" center>
        <div class="pic">
          <img :src="require('../../assets/images/phone.png')">
        </div>
        <el-form ref="form" v-loading="loading" :model="form" :rules="rules" size="small" class="registerFrom">
          <el-form-item prop="phone">
            <el-input v-model="form.phone" prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" prefix-icon="el-icon-lock" placeholder="请输入密码" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="register">登录/注册</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = window.require('electron')
import { logout, checkPhone, login, account } from '@/api/index'
export default {
  name: 'NavBar',
  data() {
    return {
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      search: '',
      haslog: true,
      registerDialog: false,
      form: {
        phone: '',
        password: ''
      },
      loading: false,
      userInfo: {}
    }
  },
  created() {
    this.haslog = Boolean(window.localStorage.getItem('status'))
    if (this.haslog) {
      this.userInfo.nickname = window.localStorage.getItem('nickname')
      this.userInfo.avatarUrl = window.localStorage.getItem('avatarUrl')
    }
  },
  methods: {
    minusWin() {
      ipcRenderer.send('min-window')
    },
    closeWin() {
      ipcRenderer.send('close-window')
    },
    // 退出
    handleCommand(command) {
      console.log(command)
      switch (command) {
        case 'out':
          logout().then(res => {
            if (res.code === 200) {
              window.localStorage.removeItem('status')
              this.haslog = false
            }
          })
          break
      }
    },
    register() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          // 先验证该手机号有没有注册过
          checkPhone({ phone: this.form.phone }).then(res => {
            console.log(res)
            // 注册过
            if (res.hasPassword) {
              login(this.form).then(res2 => {
                console.log(res2)
                if (res2.loginType === 1) {
                  window.localStorage.setItem('status', 1)
                  account().then(res3 => {
                    console.log(res3)
                    window.localStorage.setItem('nickname', res3.profile.nickname)
                    window.localStorage.setItem('avatarUrl', res3.profile.avatarUrl)
                    window.localStorage.setItem('userId', res3.profile.userId)
                    this.$nextTick(() => {
                      this.userInfo.nickname = res3.profile.nickname
                      this.userInfo.avatarUrl = res3.profile.avatarUrl
                    })
                    this.loading = false
                    this.registerDialog = false
                  })
                }
              }).catch(() => {
                this.loading = false
              })
            } else { // 没有注册过
              // 走注册
              this.registerDialog = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/variables.less";
.navbar {
  background: @themeBlue;
  padding: 12px 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  -webkit-app-region: drag;
  .logo {
    height: 32px;
    width: 68px;
    -webkit-app-region: no-drag;
  }
  .center {
    display: flex;
    -webkit-app-region: no-drag;
    ::v-deep .el-input {
      .el-input__inner {
        height: 32px;
        border-radius: 32px;
        font-size: 12px;
        background-color: rgba(255, 255, 255, 0.2);
        color: #fff;
        &:focus {
          border-color: #fff;
        }
      }
      .el-input__icon {
        line-height: 32px;
      }
    }
    .go {
      > div {
        width: 23px;
        height: 23px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #fff;
        border-radius: 23px;
        background: rgba(255, 255, 255, 0.2);
        margin-right: 10px;
        color: #fff;
        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
  .right {
    flex-shrink: 1;
    -webkit-app-region: no-drag;
    .user {
      .avatar {
        margin-right: 5px;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #fff;
        span {
          display: inline-block;
          max-width: 56px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          vertical-align: middle;
        }
      }
      .el-icon-caret-bottom {
        font-size: 12px;
      }
    }
    .message {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      ::v-deep.el-badge__content.is-dot {
        height: 6px;
        width: 6px;
        right: 5px;
        top: 4px;
      }
    }
    .operate {
      color: #fff;
      font-size: 20px;
      margin-left: 30px;
      -webkit-app-region: no-drag;
      i:first-child {
        margin-right: 10px;
      }
    }
  }
  ::v-deep.el-dialog--center {
    .el-dialog__body {
      padding: 10px 25px 0px !important;
      .pic {
        width: 80%;
        height: 80%;
        margin: 0 auto;
      }
      .registerFrom {
        .el-form-item {
          .el-input {
            .el-input__inner {
              color: #6a60a9;
              &:focus {
                border-color: #6a60a9 !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
