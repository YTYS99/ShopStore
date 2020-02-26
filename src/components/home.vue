<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- logo -->
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-dropdown @command="handleCommand">
        <!-- 用户头像 -->
        <span class="demo-basic--circle el-dropdown-link">
            <el-avatar size="large" :src="circleUrl"></el-avatar>
        </span>
        <!-- 下拉菜单 -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled><span>用户名：</span>{{ userinfo.username}}</el-dropdown-item>
          <el-dropdown-item disabled><span>电话：</span>{{ userinfo.mobile }}</el-dropdown-item>
          <el-dropdown-item disabled><span>邮箱：</span>{{ userinfo.email }}</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出账户</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-menu :default-active="activePath" unique-opened class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" :collapse="isCollapse" router>
        <!-- 收缩按钮 -->
        <div class="menu-drop" @click="isCollapse = !isCollapse">
          <i class="el-icon-s-unfold" v-if="isCollapse"></i>
          <i class="el-icon-s-fold" v-if="!isCollapse"></i>
        </div>
        <!-- 一级菜单 -->
        <el-submenu :index="item.id+''" v-for='item in menulist' :key="item.id">
          <template slot="title">
            <i :class="iconObj[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="savePath(subitem.path)">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ subitem.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userinfo: '', // 用户信息
      menulist: [], // 左侧菜单
      isCollapse: true, // 是否收起侧边栏
      circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 头像图片
      iconObj: { // 左侧菜单栏的字体图标
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: '' // 左侧菜单的动态路径，为保持菜单高亮
    }
  },
  created() {
    this.getMenuList()
    this.getUserInfo()
    this.activePath = window.sessionStorage.getItem('path')
  },
  methods: {
    // 退出操作
    logout() {
      // 清除 token 令牌
      window.sessionStorage.clear()
      // 返回 登录界面
      this.$router.push('/login')
    },
    // 获取左侧菜单栏
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      this.menulist = res.data
    },
    getUserInfo() {
      // 通过 session 获取用户信息
      const userinfo = sessionStorage.getItem('userinfo')
      this.userinfo = JSON.parse(userinfo)
    },
    // 用户头像下拉菜单事件
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        default:
          break
      }
    },
    savePath(path) {
      const Path = '/' + path
      window.sessionStorage.setItem('path', Path)
      this.activePath = path
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-submenu_title:hover {
  background-color: rgba(14, 221, 240, 0.32) !important;
}
.el-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.32) !important;
}
.iconfont {
  font-size: 18px;
  padding-right: 10px;
}
.el-container {
  height: 100%;

  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
      img {
        width: 50px;
        height: 50px;
        margin-left: -10px;
      }
    }
  }

  .menu-drop {
    height: 30px;
    width: 100%;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 30px;
  }
  .menu-drop:hover {
    background-color: rgb(67, 74, 80);
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>
