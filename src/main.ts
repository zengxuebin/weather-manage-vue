import { createApp, provide } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// 全局样式
import '@/assets/styles/index.scss'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 引入vxetable
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/assets/styles/vxetable.scss'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(VXETable)
app.mount('#app')
