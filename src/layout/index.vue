<template>
  <el-container id="layout-container">
    <el-header id="layout-header" height="80px"><layout-header /></el-header>
    <el-container id="layout-section">
      <el-aside id="layout-aside" :width="collapse === 'true' ? '64px' : '200px'"><layout-aside /></el-aside>
      <el-main id="layout-main"><layout-main /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LayoutAside from "@/layout/components/Aside.vue";
import LayoutHeader from "@/layout/components/Header.vue";
import LayoutMain from "@/layout/components/Main.vue";

import { computed } from 'vue'
import useAppStore from '@/stores/app'
const store = useAppStore()

const collapse = computed(() => store.collapse)
</script>

<style lang="scss" scoped>
#layout-container {
  height: 100vh;
  background-color: #e9eaea;
}

#layout-header {
  padding: 0;
  margin-bottom: 10px;
}

#layout-aside {
  background-color: #fff;
  margin-right: 10px;
  border-radius: 5px;
}

#layout-main {
  padding: 0;
}

#layout-section {
  position: relative;
  height: 100%;
  overflow: hidden;
}
</style>
