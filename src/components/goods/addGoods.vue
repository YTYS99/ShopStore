<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧导航 -->
      <el-tabs tab-position="left" v-model="activeName" style="height: auto;" v-if="success === false">
        <el-tab-pane disabled name="0" label="基本信息">
          <el-form v-model="basic" status-icon>
            <el-form-item label="商品名称" label-width="80px">
              <el-input v-model="basic.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" label-width="80px">
              <el-input v-model="basic.goods_price" label=""></el-input>
            </el-form-item>
            <el-form-item label="商品重量" label-width="80px">
              <el-input v-model="basic.goods_weight" label=""></el-input>
            </el-form-item>
            <el-form-item label="商品数量" label-width="80px">
              <el-input v-model="basic.goods_number" label=""></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="down">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane disabled name="1" label="商品参数">
          <el-button type="primary" @click="up">上一步</el-button>
          <el-button type="primary" @click="down">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane disabled name="2" label="商品属性">
          <el-button type="primary" @click="up">上一步</el-button>
          <el-button type="primary" @click="down">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane disabled name="3" label="商品图片">
          <el-button type="primary" @click="up">上一步</el-button>
          <el-button type="primary" @click="down">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane disabled name="4" label="商品内容">
          <el-button type="primary" @click="up">上一步</el-button>
          <el-button type="primary" @click="done">完成</el-button>
        </el-tab-pane>
      </el-tabs>
      <!-- 提交数据 -->
      <el-row class="complete" v-if="success === true">
        <p class="question" v-if="subFlag === false"><i class="el-icon-question"></i></p>
        <p class="success" v-if="subFlag === true"><i class="el-icon-success"></i></p>
        <p v-if="subFlag === false">是否提交数据？</p>
        <p v-if="subFlag === true">数据提交成功！</p>
        <p v-if="subFlag === false">
          <el-button type="primary" @click="goBack">返回上一层</el-button>
          <el-button type="success" @click="submit">提交</el-button>
        </p>
        <p v-if="subFlag === true">
          <el-button type="primary" @click="goList">返回商品列表</el-button>
        </p>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: '',
      activeName: '0',
      subFlag: false,
      success: false,
      basic: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      }
    }
  },
  created() {
    this.active = parseInt(this.activeName)
  },
  methods: {
    // 上一步
    up() {
      if (parseInt(this.activeName) !== 0) {
        this.active = parseInt(this.activeName) - 1
        this.activeName = '' + (parseInt(this.activeName) - 1)
      }
    },
    // 下一步
    down() {
      if (this.active !== 5 && parseInt(this.activeName) !== 5) {
        this.active = parseInt(this.activeName) + 1
        this.activeName = '' + (parseInt(this.activeName) + 1)
      }
    },
    // 跳到确定提交数据界面
    done() {
      this.success = true
      this.active = 5
    },
    // 返回上一步
    goBack() {
      this.success = false
      this.active = 4
      this.activeName = '' + 4
    },
    // 提交数据
    submit() {
      this.active = 6
      this.subFlag = true
    },
    // 数据提交成功 返回商品列表
    goList() {
      this.$router.push('/goods')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 15px 0;
}
.el-form {
  width: 50%;
}
.complete {
  text-align: center;
  p {
    font-size: 24px;
    font-weight: bold;
  }
  .success>i {
    color: lightgreen;
    font-size: 100px;
  }
  .question>i {
    color: red;
    font-size: 100px;
  }
}

</style>
