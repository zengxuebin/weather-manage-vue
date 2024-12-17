import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getRouters } from '@/api/menu'
import Layout from "@/layout/components/Main.vue";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../views/**/*.vue')

export const useRouterStore = defineStore('router', () => {

  const routes = ref([])

  function generateRoutes() {
    return new Promise(resolve => {
      getRouters().then(res => {
        routes.value = formatRouter(res.data)
        routes.value.forEach(item => {
          // router.addRoute(item)
        })
        resolve(routes.value)
      })
    })
  }

  const formatRouter = (router: []) => {
    return router.filter((route: any) => {
      if (route.component === 'Layout') {
        route.component = Layout
      }
      if (route.component) {
        route.component = loadView(route.component)
      }
      if (route.children != null && route.children && route.children.length) {
        formatRouter(route.children)
      }
      return true
    })
  }

  const loadView = (view: string) => {
    let res;
    for (const path in modules) {
      const dir = path.split('views')[1].split('.vue')[0];
      if (dir === view) {
        res = () => modules[path]();
      }
    }
    return res;
  }

  return { generateRoutes }
})

export default useRouterStore
