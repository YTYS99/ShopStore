<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置参数!" type="warning" show-icon :closable="false"> </el-alert>
      <!-- 联级选择器 -->
      <el-row class="cat_props">
        <label>选择商品分类：</label>
        <el-cascader :options="CategoriesList" v-model="selectValue"
          :props="{ expandTrigger: 'hover', label: 'cat_name', value:'cat_id' }"
          @change="handleChange" clearable placeholder="请选择第三级分类">
        </el-cascader>
      </el-row>
      <!-- Tab 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="OpenAddDig('many')">添加参数</el-button>
          <!-- 表格 -->
          <el-table :data="ParamsList" border stripe >
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-tag type="primary" closable v-for="item in scope.row.attr_vals" :key="item" @close="removeRoot(scope.row, item)">{{ item }}</el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row, 'many')">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="Del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="OpenAddDig('only')">添加属性</el-button>
          <!-- 表格 -->
          <el-table :data="ParamsList" border stripe >
             <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-tag type="primary" closable v-for="item in scope.row.attr_vals" :key="item" @close="removeRoot(scope.row, item)">{{ item }}</el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row, 'only')">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="Del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 分配权限弹窗 -->
    <el-dialog :title="DigTitle" :visible.sync="dialogVisible" @close="CloseDig">
      <el-form>
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" label-width="120px">
          <el-input v-model="AttrName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="subFlag === true" @click="Add">确 定</el-button>
        <el-button type="primary" v-if="subFlag === false" @click="Edit">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CategoriesList: [], // 商品分类信息
      ParamsList: [], // 商品参数信息
      selectValue: '',
      inputVisible: false, // 添加 tag 标签
      inputValue: '', // tag 标签添加的值
      activeName: 'many', // 指定 Tab 标签页 初始显示的内容
      cascaderKey: [], // 级联选择器的值
      dialogVisible: false, // 弹窗是否打开
      DigTitle: '添加动态参数', // 弹窗标题
      AttrName: '', // 弹窗 输入框 的值
      subFlag: true, // false -- 修改  true --- 确定
      queryInfo: {
        id: '',
        sel: 'many'
      },
      editInfo: {
        attr_name: '',
        attr_id: '',
        attr_vals: ''
      }
    }
  },
  created() {
    this.getCategories()
  },
  computed: {
    isDisabled() {
      if (this.cascaderKey.length !== 3) {
        return true
      }
      return false
    }
  },
  methods: {
    // 获取商品分类信息
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      this.CategoriesList = res.data
    },
    // 获取参数信息
    async getParams() {
      const { data: res } = await this.$http.get(
        `categories/${this.queryInfo.id}/attributes`,
        { params: { sel: this.queryInfo.sel } }
      )
      this.changArr(res.data)
      this.ParamsList = res.data
    },
    // 将 attr_vals 打断成数组
    changArr(obj) {
      obj.forEach(item => {
        // 对数据中的 attr_vals 进行处理
        item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
        item.inputVisible = false // 在数据中添加输入框的状态，让它唯一化
        item.inputValue = '' // 在数据中添加输入框的值，让它唯一化
      })
      return obj
    },
    // 打开 添加动态参数 弹窗
    OpenAddDig(type) {
      this.dialogVisible = true
      this.subFlag = true
      if (type === 'many') {
        this.DigTitle = '添加动态参数'
      } else {
        this.DigTitle = '添加静态属性'
      }
    },
    // 添加
    async Add() {
      const { data: res } = await this.$http.post(
        `categories/${this.queryInfo.id}/attributes`,
        {
          attr_name: this.AttrName,
          attr_sel: this.queryInfo.sel,
          attr_vals: 'asda'
        }
      )
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败！')
      }
      this.dialogVisible = false
      this.$message.success('添加成功！')
      this.getParams()
    },
    // 打开 修改动态参数 弹窗
    OpenEditDig(paramsInfo, type) {
      this.dialogVisible = true
      this.subFlag = false
      this.editInfo.attr_id = paramsInfo.attr_id
      this.editInfo.attr_name = paramsInfo.attr_name
      this.editInfo.attr_vals = paramsInfo.attr_vals.join(',')
      this.AttrName = paramsInfo.attr_name
      if (type === 'many') {
        this.DigTitle = '修改动态参数'
      } else {
        this.DigTitle = '修改静态属性'
      }
    },
    // 修改动态参数
    async Edit() {
      const { data: res } = await this.$http.put(
        `categories/${this.queryInfo.id}/attributes/${this.editInfo.attr_id}`,
        {
          attr_sel: this.queryInfo.sel,
          attr_name: this.AttrName,
          attr_vals: this.editInfo.attr_vals
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败！')
      }
      this.dialogVisible = false
      this.$message.success('更新成功！')
      this.getParams()
    },
    async Del(paramsInfo) {
      const confirmResult = await this.$confirm('是否继续删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.queryInfo.id}/attributes/${paramsInfo.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getParams()
    },
    // 监听 级联选择框的 变化 并获取值
    handleChange(value) {
      if (value.length !== 3) {
        this.ParamsList = []
        this.selectValue = []
        return
      }
      this.cascaderKey = value
      this.queryInfo.id = value[2]
      this.getParams()
    },
    // 监听 tab 标签页 的方法
    handleClick(value) {
      this.queryInfo.sel = value.name
      this.getParams()
    },
    // 展现 输入框
    showInput(row) {
      row.inputVisible = true
      row.inputValue = ''
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 提交并创建新的 tag 标签
    async handleInputConfirm(value) {
      value.inputVisible = false
      if (value.inputValue === '') return
      let flag = false // 判断是否存在重复数据
      value.attr_vals.forEach(item => {
        // 如果有重复的内容 则提示重复了
        if (item === value.inputValue) flag = true
      })
      if (flag) return this.$message.error('该描述已存在')
      const { data: res } = await this.$http.put(
        `categories/${this.queryInfo.id}/attributes/${value.attr_id}`,
        {
          attr_sel: this.queryInfo.sel,
          attr_name: value.attr_name,
          attr_vals: value.attr_vals.length === 0 ? value.inputValue : value.attr_vals.join(',') + ',' + value.inputValue
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败！')
      }
      this.$message.success('更新成功！')
      value.attr_vals = res.data.attr_vals.split(',')
    },
    // 删除 tag 标签
    async removeRoot(value, obj) {
      // 弹窗提示
      const confirmResult = await this.$confirm('是否继续删除该描述?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 循环数组  如果找到相等的  删除
      value.attr_vals.forEach((item, i) => {
        if (item === obj) {
          value.attr_vals.splice(i, 1)
        }
      })
      // 发送修改请求
      const { data: res } = await this.$http.put(
        `categories/${this.queryInfo.id}/attributes/${value.attr_id}`,
        {
          attr_sel: this.queryInfo.sel,
          attr_name: value.attr_name,
          attr_vals:
            value.attr_vals.length === 0 ? [] : value.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败！')
      }
      this.$message.success('更新成功！')
      value.attr_vals = res.data.attr_vals.split(',')
    },
    // 关闭弹窗
    CloseDig() {
      this.AttrName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.cat_props {
  margin: 10px 0;
  .el-cascader {
    width: 300px;
  }
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 100px;
}
</style>
