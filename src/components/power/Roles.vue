<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表区域 -->
    <el-table :data="rolelist" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row
            :class="['bdbottom', index1 === 0 ? 'bdtop' : '','vcenter']"
            v-for="(item1,index1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <!-- for循环嵌套渲染二级权限 -->
              <el-row
                :class="[index2 !== 0 ? 'bdtop' : '','vcenter']"
                v-for="(item2,index2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRightById(scope.row, item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeUserById(scope.row.id)"
          >删除</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showSetRightDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形结构 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 控制显示与隐藏对话框
      setRightDialogVisible: false,
      // 添加用户预验证
      addFormRules: {
        roleName: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          {
            min: 2,
            max: 10,
            message: '描述在 2 到 10 个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 所有权限的数据
      rightslist: [],
      // 树形控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 树形控件默认选中数组
      defKeys: [],
      // 即将分配权限的角色,
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.rolelist = res.data
    },
    // 添加新用户预检验
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加用户网络请求
        const { data: res } = await this.$axios.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新获取数据
        this.getRolesList()
      })
    },
    // 删除用户(销户)
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户确认删除返回字符串confirm
      // 用户取消删除返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }

      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 修改详细权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const cofirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (cofirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data:res } = await this.$axios.get('rights/tree')
      if(res.meta.status !== 200){
        return this.$message.error('获取权限失败')
      }
      this.rightslist = res.data
      // console.log(this.rightslist);
      
      // 递归获取三级节点
      this.getLeafKeys(role,this.defKeys)

      this.setRightDialogVisible = true
    },
    // 递归获得三级权限id
    getLeafKeys(node, arr) {
      if (!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 分配权限函数
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')
      const { data:res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })

      if(res.meta.status !== 200){
        return this.$message.error('更新权限失败')
      }

      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>