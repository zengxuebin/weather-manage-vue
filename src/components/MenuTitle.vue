<template>
  <div class="collapse" @click="handleCollapse(collapse)">
    <el-icon v-if="collapse === 'true'">
      <Expand />
    </el-icon>
    <el-icon v-else>
      <Fold />
    </el-icon>
  </div>
  <div class="container">
    <span>●</span>
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import { computed } from "vue";

const appStore = useAppStore()

const title = computed(() => appStore.activeMenu)
const collapse = computed(() => appStore.collapse)

function handleCollapse(collapse: string) {
  appStore.setCollapse(collapse)
}
</script>

<style lang="scss" scoped>
.container {
  height: 30px;
  font-size: 15px;
  line-height: 30px;
  background-color: #e6f2f0;
  color: #00796a;
  position: absolute;
  top: 5px;
  left: 50px;
  padding: 0 30px;

  span {
    position: absolute;
    left: 10px;
  }
}

.collapse {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
</style>
