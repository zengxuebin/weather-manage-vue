<template>
  <div class='echart' ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, markRaw } from 'vue'
import * as echarts from 'echarts'
import customTheme from './custom-theme.json'

const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<echarts.ECharts>()
const props = defineProps({
  options: {
    type: Object,
    default: {},
    required: true,
  },
  height: {
    type: String,
    default: '100%'
  },
  width: {
    type: String,
    default: '100%'
  },
})

echarts.registerTheme('customTheme', customTheme)

const initChart = () => {
  if (chartRef.value) {
    chartInstance.value = markRaw(echarts.init(chartRef.value, 'customTheme'))
    chartInstance.value.setOption(props.options)
  }
}

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance.value?.dispose()
})

watch(() => props.options, (newOptions) => {
  if (chartInstance.value) {
    chartInstance.value.setOption(newOptions)
    console.log("echarts debug:", props.options)
  }
}, {
  deep: true
})
</script>

<style lang="scss" scoped></style>
