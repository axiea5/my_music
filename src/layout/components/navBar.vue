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
      <div class="user center ">
        <el-avatar size="small" class="avatar" :src="require('../../assets/images/avatar.png')" />
        <el-dropdown trigger="click" size="small">
          <p class="el-dropdown-link">
            <span>user</span><i class="el-icon-caret-bottom el-icon--right" />
          </p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- 窗口操作 -->
      <div class="operate">
        <!-- 缩小 -->
        <i class="el-icon-minus" @click="minusWin" />
        <!-- 关闭 -->
        <i class="el-icon-close" @click="closeWin" />
      </div>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = window.require('electron')
export default {
  name: 'NavBar',
  data() {
    return {
      search: ''
    }
  },
  mounted() {
  },
  methods: {
    minusWin() {
      ipcRenderer.send('min-window')
    },
    closeWin() {
      ipcRenderer.send('close-window')
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
}
</style>
