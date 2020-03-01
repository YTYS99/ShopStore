<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入商品名称进行搜索" v-model="queryInfo.query" clearable @clear="ordersList">
            <el-button slot="append" icon="el-icon-search" @click="ordersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="OrderList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="105px"> </el-table-column>
        <el-table-column label="是否付款" width="95px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="warning" v-if="scope.row.pay_status === '0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="105px"> </el-table-column>
        <el-table-column prop="add_time" label="下单时间" width="250px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="OpenEditDig(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-s-tools" size="small" @click="OpenProDig(scope.row)"></el-button>
            </el-tooltip>
          </template>
       </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 20, 50, 100]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <!-- 修改地址弹窗 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisible" @close="CloseDig">
      <el-form :model="form" status-icon :rules="rules">
        <el-form-item label="省市区/县" label-width="120px" prop="selectValue">
          <el-cascader :options="citydata" v-model="form.selectValue" clearable style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Edit">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流进度信息 -->
    <el-dialog title="物流进度" :visible.sync="progresVisible">
      <!-- 时间轴 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in Timeline" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from '../../assets/js/citydata.js' // 导入获取省份的 js 文件
import '../../plugins/timeline/timeline.css'
import '../../plugins/timeline-item/timeline-item.css'

export default {
  data() {
    return {
      OrderList: [],
      total: 0,
      dialogVisible: false,
      progresVisible: false,
      Timeline: [],
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      form: {
        selectValue: [],
        address: ''
      },
      rules: {
        selectValue: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      citydata
    }
  },
  created() {
    this.ordersList()
  },
  methods: {
    async ordersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res)
      this.OrderList = res.data.goods
      this.total = res.data.total
    },
    OpenEditDig() {
      this.dialogVisible = true
    },
    Edit() {
      this.form.selectValue = []
      this.form.address = ''
      this.dialogVisible = false
    },
    async OpenProDig() {
      const { data: res } = await this.$http.get('kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.Timeline = res.data
      console.log(res.data)
      this.progresVisible = true
    },
    // 监听分页的显示数量 size 的事件
    handleSizeChange(NewSize) {
      this.queryInfo.pagesize = NewSize
      this.ordersList()
    },
    // 监听页数的 num 事件
    handleCurrentChange(NewPage) {
      this.queryInfo.pagenum = NewPage
      this.ordersList()
    },
    // 关闭弹窗
    CloseDig() {
      this.form.selectValue = []
      this.form.address = ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
