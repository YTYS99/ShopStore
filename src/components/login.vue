<template>
    <div id="login">
        <div class="login_box">
          <!-- 头像区 -->
          <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
          </div>
          <!-- 登录表单区 -->
          <el-form ref="form" label-width="0px" :model="form" :rules="rules" class="form_box">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="form.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" show-password v-model="form.password"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="success" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      form: {
        username: '',
        password: ''
      },
      rules: {
        // 表单验证
        // 1. 在 el-form 绑定一个 :rules="rules" 属性
        // 2. 在 data 中指定 rules 验证规则对象
        // 3. 在 el-form-item 赋值给 prop 规则的名称
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        // 通过 axios 来进行用户验证
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 将 token 放入 session 中，方便后面的调用
        sessionStorage.setItem('token', res.data.token)
        // 页面跳转，通过组件的编程式导航跳转实现假跳转
        this.$router.push('/home')
      })
    },
    reset () {
      // 重置表单
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // 头像样式
    .avatar_box {
      height: 130px;
      width: 130px;
      padding: 10px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    // 登录表单样式
    .form_box {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
