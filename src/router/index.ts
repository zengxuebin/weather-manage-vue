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
    path: '/acquisition',
    name: 'Acquisition',
    hidden: false,
    meta: {
      title: '数据采集',
      icon: 'vxe-icon-sort'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/acquisition/collect',
        name: 'Collect',
        hidden: false,
        meta: {
          title: '数据采集',
          icon: 'vxe-icon-cloud-upload'
        },
        component: () => import('@/views/acquisition/collect/index.vue')
      },
      {
        path: '/acquisition/location',
        name: 'Location',
        hidden: false,
        meta: {
          title: '站点分布',
          icon: 'vxe-icon-location-fill'
        },
        component: () => import('@/views/acquisition/location/index.vue')
      },
      {
        path: '/acquisition/weatherStation',
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
        path: '/display/weather-now',
        name: 'weatherNow',
        hidden: false,
        meta: {
          title: '实时天气',
          icon: 'vxe-icon-heavy-rain'
        },
        component: () => import('@/views/display/weatherNow/index.vue')
      },
      {
        path: '/display/weather-forecast',
        name: 'weatherForecast',
        hidden: false,
        meta: {
          title: '预报天气',
          icon: 'vxe-icon-sunny'
        },
        component: () => import('@/views/display/weatherForecast/index.vue')
      },
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
    path: '/alert-manager',
    name: 'alertManager',
    hidden: false,
    meta: {
      title: '预警管理',
      icon: 'vxe-icon-bell-fill'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/alert-manager/release-alert',
        name: 'alertRelease',
        hidden: false,
        meta: {
          title: '预警信息发布',
          icon: 'vxe-icon-send-fill'
        },
        component: () => import('@/views/alertManager/alertRelease/index.vue')
      },
      {
        path: '/alert-manager/alert-rule',
        name: 'alertRule',
        hidden: false,
        meta: {
          title: '预警规则配置',
          icon: 'vxe-icon-setting-fill'
        },
        component: () => import('@/views/alertManager/alertRule/index.vue')
      },
      {
        path: '/alert-manager/view-alert',
        name: 'ViewAlert',
        hidden: false,
        meta: {
          title: '预警信息查询',
          icon: 'vxe-icon-search'
        },
        component: () => import('@/views/alertManager/viewAlert/index.vue')
      },
    ]
  },
  {
    path: '/alert-push',
    name: 'alertPush',
    hidden: false,
    meta: {
      title: '预警推送',
      icon: 'vxe-icon-flow-branch'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/alert-push/push-alert',
        name: 'pushAlert',
        hidden: false,
        meta: {
          title: '预警信息推送',
          icon: 'vxe-icon-envelope'
        },
        component: () => import('@/views/alertPush/pushAlert/index.vue')
      },
    ]
  },
  {
    path: '/alert-analysis',
    name: 'alertAnalysis',
    hidden: false,
    meta: {
      title: '预警分析',
      icon: 'vxe-icon-chart-line'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/alert-analysis/view-alert-push',
        name: 'viewAlert',
        hidden: isAdmin.value === 'admin',
        meta: {
          title: '查询预警信息',
          icon: 'vxe-icon-search'
        },
        component: () => import('@/views/alertAnalysis/viewAlert/index.vue')
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
        path: '/system/menu',
        name: 'Menu',
        hidden: false,
        meta: {
          title: '菜单管理',
          icon: 'vxe-icon-menu'
        },
        component: () => import('@/views/system/menu/index.vue')
      },
      {
        path: '/system/role',
        name: 'Role',
        hidden: false,
        meta: {
          title: '角色管理',
          icon: 'vxe-icon-user-fill'
        },
        component: () => import('@/views/system/role/index.vue')
      },
    ]
  },
  {
    path: '/monitor',
    name: 'Monitor',
    hidden: false,
    meta: {
      title: '系统监控',
      icon: 'vxe-icon-platform'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/monitor/online',
        name: 'Online',
        hidden: false,
        meta: {
          title: '在线用户',
          icon: 'vxe-icon-cloud-download'
        },
        component: () => import('@/views/monitor/online/index.vue')
      },
      {
        path: '/monitor/cache',
        name: 'Cache',
        hidden: false,
        meta: {
          title: '缓存字典',
          icon: 'vxe-icon-table'
        },
        component: () => import('@/views/monitor/cache/index.vue')
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
