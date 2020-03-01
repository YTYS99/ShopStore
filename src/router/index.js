import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import goods from '../components/goods/goods.vue'
import addGoods from '../components/goods/addGoods.vue'
import categories from '../components/goods/categories.vue'
import params from '../components/goods/params.vue'
import orders from '../components/orders/orders.vue'
import reports from '../components/reports/reports.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 路由重定向 打开页面时自动访问 登录界面
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/users', // 子组件的重定向
      children: [
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/goods', component: goods },
        { path: '/goods/addGoods', component: addGoods },
        { path: '/categories', component: categories },
        { path: '/params', component: params },
        { path: '/orders', component: orders },
        { path: '/reports', component: reports }
      ]
    }
  ]
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // 判断跳转的地址，如果是登录页面，直接跳转
  if (to.path === '/login') return next()
  // 如果不是登陆页面，先读取 session 中 是否存在 token
  const token = sessionStorage.getItem('token')
  // 如果不存在 token 则跳转到 登录页面 进行登录
  if (!token) return next('/login')
  // 如果存在 token 则放行
  next()
})

export default router
