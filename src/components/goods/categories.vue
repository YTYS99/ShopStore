<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" icon="el-icon-plus" size="small" @click="OpenAddDig">添加分类</el-button>
      <!-- zk-table 表格 -->
      <tree-table :data="CateList" class="treeTable" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#">
        <template slot="deleted" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-if="scope.row.cat_deleted === true" style="color: red"></i>
        </template>
        <template slot="level" slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="control" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="Del(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 20, 50, 100]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加 或 修改 分类 弹窗 -->
    <el-dialog :title="DigTitle" :visible.sync="dialogVisible" @close="handleClose">
      <el-form :model="form" status-icon :rules="rules" ref="Form">
        <el-form-item label="分类名称:" prop="cat_name" label-width="120px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 联级选择器 -->
        <el-form-item label="父级分类:" label-width="120px" v-if="subFlag === true">
          <el-cascader v-model="form.cat_id" :options="parentList"
            :props="{ expandTrigger: 'hover', checkStrictly: true, label: 'cat_name', value:'cat_id' }"
            @change="handleChange" clearable placeholder="请选择父级分类（可单选)">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Add" v-if="subFlag === true">确 定</el-button>
        <el-button type="primary" @click="Edit()" v-if="subFlag === false">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [], // 获取分类所有数据
      parentList: [], // 获取父级数据
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'deleted'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'control'
        }
      ],
      DigTitle: '添加分类',
      subFlag: true, // true -- 添加 false -- 修改
      dialogVisible: false, // 弹窗标识符
      form: {
        cat_id: '',
        cat_name: '',
        cat_pid: 0, // 父级 id 默认为 一级
        cat_level: 0 // 层数 默认为第一层
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    // 获取商品分类列表
    async getCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      this.total = res.data.total
      this.CateList = res.data.result
    },
    // 筛选出又子集的父级数据 给 级联选择框使用
    async getParentList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      this.parentList = res.data
    },
    // 打开添加分类弹窗
    OpenAddDig() {
      this.getParentList()
      this.DigTitle = '添加分类'
      this.subFlag = true
      this.dialogVisible = true
    },
    async Add() {
      const { data: res } = await this.$http.post('categories', this.form)
      this.dialogVisible = false
      if (res.meta.status !== 201) {
        return this.$message.error('添加分类失败！')
      }
      this.$message.success('添加分类成功！')
      this.getCategories()
    },
    OpenEditDig(CateInfo) {
      // 获取当前选中的数据
      this.form = {
        cat_id: CateInfo.cat_id,
        cat_name: CateInfo.cat_name,
        cat_pid: CateInfo.cat_pid,
        cat_level: CateInfo.cat_level
      }
      this.DigTitle = '修改分类'
      this.subFlag = false
      this.dialogVisible = true
    },
    // 修改分类
    async Edit() {
      const { data: res } = await this.$http.put(`categories/${this.form.cat_id}`, this.form)
      if (res.meta.status !== 200) {
        return this.$message.error('更新分类失败！')
      }
      this.$message.success('修改成功！')
      this.dialogVisible = false
      this.getCategories()
    },
    // 删除商品分类
    async Del(CateInfo) {
      const confirmResult = await this.$confirm('是否继续删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${CateInfo.cat_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功!')
      this.getCategories()
    },
    // 监听分页的显示数量 size 的事件
    handleSizeChange(NewSize) {
      this.queryInfo.pagesize = NewSize
      this.getCategories()
    },
    // 监听页数的 num 事件
    handleCurrentChange(NewPage) {
      this.queryInfo.pagenum = NewPage
      this.getCategories()
    },
    handleClose() {
      // 关闭即清空表单
      this.form = { cat_name: '', cat_pid: '', cat_level: '' }
      this.dialogVisible = false
    },
    // 返回联级选择器的值
    handleChange(value) {
      if (value) {
        const le = value.length
        this.form.cat_pid = value[le - 1]
        this.form.cat_level = le
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.treeTable {
  margin: 10px 0;
}
</style>
