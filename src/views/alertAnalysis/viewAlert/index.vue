<template>
  <div>
    <el-scrollbar>
    <template v-for="alert in alertList" :key="alert.alertId">
      <AlertPushDetail :alert="alert"></AlertPushDetail>
    </template>
  </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import AlertPushDetail from "@/components/alert/AlertPushDetail.vue"
import { getListPushedAlert } from "@/api/weatherAlert"
import { ref } from "vue";

const alertList = ref([])

getListPushedAlert().then(res => {
  alertList.value = res.data
})
</script>

<style lang="scss" scoped>

</style>
