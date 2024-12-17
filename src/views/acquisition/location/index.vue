<template>
  <div>
    <MapEchart :options="mapOption" height="700px"></MapEchart>
  </div>
</template>

<script setup lang="ts">
import MapEchart from "@/components/echarts/index.vue"
import { getAllStation } from "@/api/weatherStation";
import { computed, reactive, ref } from "vue"

const geoCoordMap = reactive<any[]>([]);


getAllStation().then(res => {
  const data = res.data
  data.forEach((item: any) => {
    geoCoordMap.push({
      name: item.stationName,
      value: [
        item.stationLongitude,
        item.stationLatitude,
        item.stationType,
      ]
    })
  })
})

const generalArray = computed(() => geoCoordMap.filter(item => item.value[2] === '一般站'));
const basicArray = computed(() => geoCoordMap.filter(item => item.value[2] === '基本站'));
const benchmarkArray = computed(() => geoCoordMap.filter(item => item.value[2] === '基准站'));

const mapOption = ref({
  geo: {
    map: 'JiangXi',
    top: 0,
    bottom: 0,
    label: {
      show: true,
      color: '#549c8e',
    },
    itemStyle: {
      areaColor: '#e8f2f0',
    },
    emphasis: {
      itemStyle: {
        areaColor: '#e8f2f0',
        borderColor: '#cdcdcd',
      }
    },
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    data: ['一般站', '基本站', '基准站'],
    orient: 'vertical',
    left: 30
  },
  series: [
    {
      name: '一般站',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: generalArray,
      tooltip: {
        formatter: (params: { name: string; }) => {
          const name = params.name || '';
          return `${name} 一般站`;
        }
      }
    },
    {
      name: '基本站',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: basicArray,
      tooltip: {
        formatter: (params: { name: string; }) => {
          const name = params.name || '';
          return `${name} 基本站`;
        }
      }
    },
    {
      name: '基准站',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: benchmarkArray,
      tooltip: {
        formatter: (params: { name: string; }) => {
          const name = params.name || '';
          return `${name} 基准站`;
        }
      }
    },
  ],
})
</script>

<style lang="scss" scoped>
#map_container {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
