<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索框、添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入商品名称进行搜索" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="GoodsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="105px"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="95px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.row)"></el-button>
            </el-tooltip>
          </template>
       </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 20, 50, 100]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      GoodsList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      this.total = res.data.total
      this.GoodsList = res.data.goods
    },
    // 添加商品
    goAddPage() {
      this.$router.push('goods/addGoods')
    },
    // 删除商品
    async del(goodsInfo) {
      const confirmResult = await this.$confirm('是否继续删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `goods/${goodsInfo.goods_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
    },
    // 监听分页的显示数量 size 的事件
    handleSizeChange(NewSize) {
      this.queryInfo.pagesize = NewSize
      this.getGoodsList()
    },
    // 监听页数的 num 事件
    handleCurrentChange(NewPage) {
      this.queryInfo.pagenum = NewPage
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
