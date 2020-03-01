<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button type="primary" icon="el-icon-plus" @click="OpenAddDig" size="small">添加角色</el-button>
      <el-table :data="RoleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <p><b>具体权限</b></p>
            <el-row :class="['brbottom','vertical', i1 === 0 ? 'brtop' : '' ]" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" closable @close="removeRoot(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row :class="['vertical', i2 === 0 ? '' : 'brtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRoot(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级菜单 -->
                  <el-col :span="18">
                    <el-tag type="warning" closable v-for="(item3) in item2.children" :key="item3.id" @close="removeRoot(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-s-tools" size="small" @click="control(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改角色信息 弹窗 -->
    <el-dialog :title="DiTitle" :visible.sync="dialogFormVisible" @close="CloseDig">
      <el-form :model="form" status-icon ref="Form">
        <el-form-item label="角色名称：" prop="roleName" label-width="120px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc" label-width="120px">
          <el-input type="textarea" autosize placeholder="请输入内容"  v-model="form.roleDesc" maxlength="30" show-word-limit> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CloseDig">取消</el-button>
        <el-button type="primary" @click="Add" v-if="subFlag">添 加</el-button>
        <el-button type="primary" @click="Edit" v-if="!subFlag">修 改</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
      <!-- 树形组件 -->
      <el-tree :data="rightsList" node-key="id" ref="treeRef" show-checkbox :default-checked-keys="rightsKeys" :props="treeProps" default-expand-all accordion></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="giveRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RoleList: [], // 角色列表
      rightsList: [], // 权限列表
      rightsKeys: [], // 当前角色的权限 数组 定义树形组件勾选的数组
      roleId: '', // 当前 正要 分配权限的 角色id
      dialogVisible: false, // 弹窗是否打开
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      dialogFormVisible: false, // 角色信息弹窗是否打开
      DiTitle: '添加角色', // 弹窗标题
      subFlag: true // true --- 添加  false --- 修改
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      this.RoleList = res.data
    },
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/tree')
      this.rightsList = res.data
    },
    // 确定是否删除 指定权限
    async removeRoot(roleInfo, Id) {
      const confirmResult = await this.$confirm('是否继续删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${roleInfo.id}/rights/${Id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限删除失败！')
      }
      this.$message.success('删除成功')
      // 防止删除权限后 更新时关闭 table 的折叠，直接将当前角色最新的角色数据 赋值 给当前角色的权限数据
      roleInfo.children = res.data
    },
    // 打开 添加 角色弹窗
    OpenAddDig() {
      this.DiTitle = '添加角色'
      this.subFlag = true
      this.dialogFormVisible = true
    },
    // 添加角色
    async Add() {
      const { data: res } = await this.$http.post('roles', this.form)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败！')
      }
      this.dialogFormVisible = false
      this.$message.success('添加角色成功！')
      this.getRoleList()
    },
    // 打开 修改 角色弹窗
    OpenEditDig(roleinfo) {
      this.DiTitle = '修改角色'
      this.subFlag = false
      this.form = {
        id: roleinfo.id,
        roleName: roleinfo.roleName,
        roleDesc: roleinfo.roleDesc
      }
      this.dialogFormVisible = true
    },
    async Edit() {
      const { data: res } = await this.$http.put(
        `roles/${this.form.id}`,
        this.form
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色信息失败！')
      }
      this.dialogFormVisible = false
      this.$message.success('修改角色信息成功！')
      this.getRoleList()
    },
    // 删除角色
    async del(id) {
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getRoleList()
    },
    // 关闭弹窗时 清空输入框
    CloseDig() {
      this.form = { id: '', roleName: '', roleDesc: '' }
      this.dialogFormVisible = false
    },
    // 获取当前角色 拥有的权限 数组
    // 展示分配权限的对话框
    control(role) {
      this.roleId = role.id // 当前 角色 id
      this.getRightsList() // 获取权限列表
      this.rightsKeys = []
      this.getLeafKeys(role, this.rightsKeys)
      this.dialogVisible = true
    },
    // 通过递归 获取第三级权限的 id
    getLeafKeys(node, arr) {
      // 如果 node 节点 不包含 子节点 则为第三节点
      if (!node.children) {
        return arr.push(node.id)
      }

      // 如果不是 第三节点  则继续调用该方法  进行赋值
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 确定分配权限
    async giveRights() {
      // 获取当前选中的节点
      // 获取当前半选中的 节点
      const Ck = this.$refs.treeRef.getCheckedKeys()
      const Hk = this.$refs.treeRef.getHalfCheckedNodes()
      const hk = []
      Hk.forEach(item => {
        hk.push(item.id)
      })
      const key = Ck.concat(hk)
      const keys = key.join(',')
      console.log(keys)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keys }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.brtop {
  border-top: 1px solid #eee;
}
.brbottom {
  border-bottom: 1px solid #eee;
}
.vertical {
  display: flex;
  align-items: center;
}
</style>
