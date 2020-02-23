<template>
    <div>
        我是主页面
        <el-button type="primary" @click="logout">退出账号</el-button>
    </div>
</template>

<script>
export default {
  data() {},
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
