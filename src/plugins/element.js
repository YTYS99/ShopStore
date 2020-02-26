import Vue from 'vue'
import {
  Button, Form, FormItem, Input,
  Icon, Message, Container, Header,
  Aside, Main, Menu, MenuItem, Submenu,
  MenuItemGroup, Dropdown, DropdownMenu,
  DropdownItem, Avatar, Breadcrumb, BreadcrumbItem,
  Card, Row, Col, Table, TableColumn, Switch, Pagination,
  Tooltip, Dialog
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Avatar)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
// 挂载弹窗组件
Vue.prototype.$message = Message
