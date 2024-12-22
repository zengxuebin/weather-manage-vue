import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from "@/stores/user"
import useRouterStore from "@/stores/router"
import { ref } from 'vue'

const isAdmin = ref('')

export const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/resetPwd',
    name: 'ResetPwd',
    component: () => import('@/views/ResetPwd.vue'),
  },
  {
    path: '/index',
    name: 'Index',
    meta: {
      title: '首页',
      icon: 'vxe-icon-home'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/index',
        name: 'index',
        hidden: false,
        meta: {
          title: '首页',
          icon: 'vxe-icon-home'
        },
        component: () => import('@/views/index.vue')
      },
    ]
  },
  {
    path: '/acquist',
    name: 'Acquisit',
    hidden: false,
    meta: {
      title: '气象管理',
      icon: 'vxe-icon-sort'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/acquisition/collect',
        name: 'Collect',
        hidden: false,
        meta: {
          title: '气象采集',
          icon: 'vxe-icon-cloud-upload'
        },
        component: () => import('@/views/acquisition/collect/index.vue')
      },
    ]
  },
  {
    path: '/manager',
    name: 'Manager',
    hidden: false,
    meta: {
      title: '气象管理',
      icon: 'vxe-icon-sort'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/manager/Acquisition',
        name: 'Acquisition',
        hidden: false,
        meta: {
          title: '气象管理',
          icon: 'vxe-icon-chart-line'
        },
        component: () => import('@/views/acquisition/collect/index.vue')
      },
    ]
  },
  {
    path: '/station',
    name: 'station',
    hidden: false,
    meta: {
      title: '气象管理',
      icon: 'vxe-icon-sort'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/station/weatherStation',
        name: 'weatherStation',
        hidden: false,
        meta: {
          title: '站点管理',
          icon: 'vxe-icon-flag-fill'
        },
        component: () => import('@/views/acquisition/weatherStation/index.vue')
      },
    ]
  },
  {
    path: '/display',
    name: 'Display',
    hidden: false,
    meta: {
      title: '数据展示',
      icon: 'vxe-icon-num-list'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/display/weather-history',
        name: 'weatherHistory',
        hidden: false,
        meta: {
          title: '历史天气',
          icon: 'vxe-icon-cloudy'
        },
        component: () => import('@/views/display/weatherHistory/index.vue')
      },
    ]
  },
  {
    path: '/data-statistics',
    name: 'dataStatistics',
    hidden: false,
    meta: {
      title: '数据统计',
      icon: 'vxe-icon-chart-radar'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/data-statistics/weather',
        name: 'data-statistics',
        hidden: false,
        meta: {
          title: '气象数据统计',
          icon: 'vxe-icon-chart-radar'
        },
        component: () => import('@/views/dataStatistics/weather/index.vue')
      },
    ]
  },
  {
    path: '/log',
    name: 'log',
    hidden: false,
    meta: {
      title: '日志',
      icon: 'vxe-icon-chart-radar'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/log/operate',
        name: 'log-operate',
        hidden: false,
        meta: {
          title: '操作日志',
          icon: 'vxe-icon-feedback'
        },
        component: () => import('@/views/system/role/index.vue')
      },
    ]
  },
  {
    path: '/system',
    name: 'System',
    hidden: false,
    meta: {
      title: '系统管理',
      icon: 'vxe-icon-setting'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/system/user',
        name: 'User',
        hidden: false,
        meta: {
          title: '用户管理',
          icon: 'vxe-icon-user'
        },
        component: () => import('@/views/system/user/index.vue')
      },
      {
        path: '/system/cache',
        name: 'Cache',
        hidden: false,
        meta: {
          title: '字典预览',
          icon: 'vxe-icon-table'
        },
        component: () => import('@/views/monitor/cache/index.vue')
      },
      {
        path: '/system/menu',
        name: 'Menu',
        hidden: false,
        meta: {
          title: '菜单预览',
          icon: 'vxe-icon-menu'
        },
        component: () => import('@/views/system/menu/index.vue')
      },
      {
        path: '/system/role',
        name: 'Role',
        hidden: false,
        meta: {
          title: '角色预览',
          icon: 'vxe-icon-user-fill'
        },
        component: () => import('@/views/system/role/index.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const whiteList = ['/login', '/register'];

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token')) {
    if (to.path === '/login') {
      next({ path: '/index' })
    } else {
      if (useUserStore().roles.length === 0) {
        useUserStore().getUserInfo().then(() => {
          // 管理员标志
          isAdmin.value = useUserStore().roles[0]
          useRouterStore().generateRoutes().then((routers: any) => {
            routers.forEach((route: any) => {
              router.addRoute(route)
            })
          })
          next()
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/')
    }
  }
})

export default router
