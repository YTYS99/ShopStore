import Vue from 'vue'
import {
  Button, Form, FormItem, Input,
  Icon, Message, Container, Header,
  Aside, Main, Menu, MenuItem, Submenu,
  MenuItemGroup, Dropdown, DropdownMenu,
  DropdownItem, Avatar, Breadcrumb, BreadcrumbItem,
  Card, Row, Col, Table, TableColumn, Switch, Pagination,
  Tooltip, Dialog, Tag, MessageBox, Tree, Select, Option,
  Cascader, Alert, Tabs, TabPane, Step, Steps
} from 'element-ui'
// 由于 element 版本问题 导致 时间线 没有，自己下载导入
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Cascader)
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// 挂载弹窗组件
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
