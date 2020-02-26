<template>
  <div id="app">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索框、添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入用户名进行搜索" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="OpenAddDig">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList.users" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="ChangeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-s-tools" size="small" @click="control(scope.row)"></el-button>
            </el-tooltip>
          </template>
       </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[2, 20, 50, 100]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="userList.total">
      </el-pagination>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog :title="DiTitle" :visible.sync="dialogFormVisible" @close="CloseDig">
      <el-form :model="form" status-icon :rules="rules" ref="Form">
        <el-form-item label="用户名称" prop="username" label-width="120px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="120px" v-if="subFlag">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="ChekPass" label-width="120px" v-if="subFlag">
          <el-input v-model="form.ChekPass" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="submit" v-if="subFlag">添 加</el-button>
        <el-button type="primary" @click="edit" v-if="!subFlag">修 改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    // 验证密码是否一致
    var ChekPass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        return callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userList: [],
      queryInfo: {
        // 获取用户信息 提交的查询信息
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      dialogFormVisible: false, // 动态控制弹窗的显示和隐藏
      form: {
        // 添加用户的信息表单
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: '',
        ChekPass: ''
      },
      rules: {
        // 表单验证
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        ChekPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: ChekPass, trigger: 'blur' }
        ]
      },
      subFlag: true, // 决定当前弹窗是 修改 还是 添加  true -- 添加 false -- 修改
      DiTitle: '添加用户' // 动态修改弹窗的标题
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      this.userList = res.data
    },
    // 修改用户状态
    async ChangeStatus(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
      this.getUserList()
    },
    // 打开修改弹窗 同时获取当前用户的信息
    async OpenEditDig(userInfo) {
      // 获取用户信息
      const { data: res } = await this.$http.get(`users/${userInfo.id}`)
      this.form = res.data
      console.log(this.form)
      this.dialogFormVisible = true // 打开弹窗
      this.subFlag = false
      this.DiTitle = '修改用户信息'
    },
    // 修改用户信息
    async edit() {
      const { data: res } = await this.$http.put(`users/${this.form.id}`, this.form)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败！')
      }
      this.$message.success('修改成功！')
      this.reset()
      this.dialogFormVisible = false // 关闭弹窗
      this.getUserList()
    },
    // 删除用户
    async del(userInfo) {
      const { data: res } = await this.$http.delete(`users/${userInfo.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getUserList()
    },
    control(id) {},
    // 监听分页的显示数量 size 的事件
    handleSizeChange(NewSize) {
      this.queryInfo.pagesize = NewSize
      this.getUserList()
    },
    // 监听页数的 num 事件
    handleCurrentChange(NewPage) {
      this.queryInfo.pagenum = NewPage
      this.getUserList()
    },
    // 重置表单
    reset() {
      this.$refs.Form.resetFields()
    },
    // 打开添加用户弹窗
    OpenAddDig() {
      this.dialogFormVisible = true
      this.subFlag = true
      this.DiTitle = '添加用户'
    },
    // 提交表单 添加用户
    async submit() {
      const { data: res } = await this.$http.post('users', this.form)
      if (res.meta.status !== 201) {
        return this.$message.error('添加用户失败！')
      }
      this.$message.success('添加用户成功！')
      this.dialogFormVisible = false
      this.getUserList()
    },
    // 关闭弹窗时发生的事情
    CloseDig() {
      // 将 弹窗中的表单 重置
      this.form.username = ''
      this.form.email = ''
      this.form.mobile = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item label {
  width: 120px;
}
</style>
