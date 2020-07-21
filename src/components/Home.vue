<template>
  <div id="Home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div class="headtitle">
          <img src alt />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <!-- 页面主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px' ">
          <div class="toggle-button" @click="toggleCollapse">| | |</div>
          <!-- 侧边栏菜单区 -->
          <el-menu
            class="elmenu"
            background-color="rgba(51,51,51)"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span class="iconmargin">{{item.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <!-- 一级菜单模板 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-check',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-claim',
        '145': 'el-icon-s-marketing'
      },
      isCollapse: false,
      // 激活的链接地址
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 侧边栏折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保持链接激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped>
#Home,
.home-container {
  height: 100%;
}
.elmenu {
  border-right: none;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  background-color: rgb(38, 47, 62);
}
.headtitle {
  display: flex;
  align-items: center;
}
.headtitle span {
  margin-left: 15px;
}
.toggle-button {
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  background-color: rgb(37, 49, 56);
}
.el-aside {
  background-color: rgb(51, 51, 51);
}
.el-main {
  background-color: rgb(242, 242, 242);
}
.iconmargin {
  margin-left: 5px;
}
</style>