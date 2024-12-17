<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
})
</script>

<style lang="scss" scoped>
.title {
  background: #c9d9d6;
  padding: 20px;
  border-left: 5px solid #00796a;
  border-radius: 4px 4px 0 0;
  font-weight: bold;
}
</style>
