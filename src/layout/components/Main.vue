<template>
  <el-container>
    <el-header class="header">
      <MenuTitle></MenuTitle>
    </el-header>
    <el-main class="main">
      <router-view v-slot="{ Component, route }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import MenuTitle from "@/components/MenuTitle.vue"
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  border-radius: 5px 5px 0 0;
  position: relative;
}

.main {
  background-color: #fff;
}

.el-container {
  height: 100%;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
