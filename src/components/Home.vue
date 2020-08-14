<template>
  <el-container class="home_container">
    <!-- aside -->
    <el-aside width='200px'>      
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        background-color="#FFFFFF"
        text-color="#2C3E50"
        active-text-color="#42B983"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <!-- 一级列表 -->
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" class="submenu">
          <template slot="title">
            <i :class="iconObj[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级列表 -->
          <el-menu-item
            :index="'/'+subItem.path+''"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveDefaultActive('/'+subItem.path+'')"
          >
            <template slot="title">
              <i class="el-icon-menu" id="special_i"></i>
              <span id="special_span">{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- header -->
      <el-header>
        <div>
          <img src alt />
          <span>活力电商</span>
        </div>
        <el-button round size="medium" type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- main -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- footer -->
      <el-footer></el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-ai-user',
        '103': 'iconfont icon-quanxian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-iconfontpaixingbang'
      },
      // 默认不折叠
      isCollapse: false,
      // 解决左侧导航栏点击不出现颜色问题
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 初始化列表
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      } else {
        this.menuList = res.data
      }
    },
    // 菜单折叠
    tollogeCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveDefaultActive(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-aside {
  background-color: #ffffff;
  .el-menu {
    margin-top: 50px;
    .el-submenu i {
      font-size: 20px;
      color: #2c3e50;
      margin-right: 10px;
    }
    .el-submenu span {
      font-size: 16px;
      font-weight: 600;
    }
    #special_i {
      font-size: 16px;
    }
    #special_span {
      font-size: 13px;
      font-weight: 500;
    }
  }
}
.el-header {
  background-color: #bbe6d6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  height: 70px !important ;
  .el-button {
    background-color: #42b983;
    border: 0px;
  }
  .el-button:hover {
    background-color: #70cca2;
  }
}
.el-main {
  background-color: #c8ebdf;
}
.el-footer {
  background-color: #2c3e51;
  height: 20px !important;
}
.menuButton {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  background-color: #42b983;
  border: 0px;
  letter-spacing: 0.3em;
}
.menuButton:hover {
  background-color: #70cca2;
}
</style>