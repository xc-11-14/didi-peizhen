import './assets/main.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import PanelHead from './components/panelHead.vue'
import { useMenuStore } from './store/menu'
// 引入 ECharts 核心和 vue-echarts
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

// 注册所有必须的模块
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

const app = createApp(App)
//挂载element-plus
app.use(ElementPlus)
//挂载panelHead组件
app.component('PanelHead', PanelHead)
//pinia挂载到app上
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//刷新后，动态路由添加
const localData = localStorage.getItem('menu')
const menuStore = useMenuStore()
if (localData) {
  menuStore.dynamicMenu(JSON.parse(localData).routerList)
  // 刷新后，添加动态路由
  menuStore.routerList.forEach((item: any) => {
    router.addRoute('main', item)
  })
}

// 路由守卫 如果没有token，跳转到登录页
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  //判断非登录页面token不存在
  if (to.path !== '/login' && !token) {
    return '/login'
  } else if (to.path === '/login' && token) {
    return '/'
  } else {
    return true
  }
})

//路由挂载到app上
app.use(router)
//挂载echarts组件
app.component('v-chart', VChart)
//挂载到app上
app.mount('#app')