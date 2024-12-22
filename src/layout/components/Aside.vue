<template>
  <div class="aside">
    <el-scrollbar>
      <el-menu :default-active="currentPath" @open="handleOpen" @close="handleClose" active-text-color="#fff" router
        :collapse="collapse" unique-opened>
        <template v-for="item in routers" :key="item.path">
          <template v-if="!item.hidden">
            <!-- 一级菜单 -->
            <template v-if="hasOnlyChild(item.children)">
              <el-menu-item :index="item.children ? item.children[0].path : ''"
              @click="handleActive(item.children ? item.children[0].meta.title : '')">
                <i :class="item.children ? item.children[0].meta.icon : ''" style="margin-right: 10px;"></i>
                <template #title>{{ item.children && item.children[0].meta.title }}</template>
              </el-menu-item>
            </template>
            <!-- 子级菜单 -->
            <template v-else>
              <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
                <template #title>
                  <i :class="item.meta.icon" style="margin-right: 10px;"></i>
                  <span>{{ item.meta && item.meta.title }}</span>
                </template>
                <template v-for="child in item.children" :key="child.path">
                  <el-menu-item v-if="!child.hidden" :index="child.path" @click="handleActive(child.meta.title)">
                    <i :class="child.meta.icon" style="margin-right: 10px;"></i>
                    <span>{{ child.meta && child.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
            </template>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import { ref, computed } from "vue"
import { routes } from "@/router/index"
import { useRoute } from 'vue-router'
const appStore = useAppStore()
const routers = routes
console.log(routers);


const collapse = computed(() => appStore.collapse === 'true' ? true : false)
const currentPath = computed(() => {
  if (useRoute()) {
    return useRoute().path
  } else {
    return ''
  }
})

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleActive = (title: any) => {
  appStore.setActiveMenu(title)
}

handleActive(useRoute().meta.title)

/**
 * 判断是否只有一个子级菜单
 * @param children 
 */
const hasOnlyChild = (children: any) => {
  if (!children) {
    return false
  }

  const childRouter = children.filter((item: any) => {
    return item.hidden ? false : true;
  })
  // 只有一个子级路由
  if (childRouter.length === 1) {
    return true;
  }
  // 否则
  return false;
}

</script>

<style lang="scss" scoped>
.aside {
  padding: 20px 0;
  height: 100%;
}

.el-sub-menu,
.el-menu-item,
.el-sub-menu__title {
  border-radius: 5px;
  margin: 0 5px;
}

.el-menu-item.is-active {
  background-color: #00796a;
}

.el-menu--collapse {
  border: 0;
}

.el-menu {
  border: 0;
}
</style>
