<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Warning" width="30%" align-center>
      <span>Open the dialog from the center from the screen</span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: '',
  }
})
</script>

<style lang="scss" scoped></style>
