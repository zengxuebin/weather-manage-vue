<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="9">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>城市所占气象站点数量统计</span>
            </div>
          </template>
          <StationEchart :options="StationOption" height="300px"></StationEchart>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>气象站点类型统计</span>
            </div>
          </template>
          <StationEchart :options="typeOption" height="300px"></StationEchart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import MapEchart from "@/components/echarts/index.vue"
import StationEchart from "@/components/echarts/index.vue"
import XEUtils from 'xe-utils'
import { onMounted, reactive, ref } from "vue"
import { countStation } from "@/api/weatherStation"

// 数量统计
const citys = ref([String])
const counts = ref([Number])
// 类型统计
const typeCount = reactive([{}])

countStation().then(res => {
  citys.value.length = 0
  counts.value.length = 0
  res.cityCount.forEach((item: any) => {
    citys.value.push(item.stationCity);
    counts.value.push(item.count);
  })
  typeCount.length = 0
  console.log(res);

  res.typeCount.forEach((item: any) => {
    typeCount.push({
      value: item.count,
      name: item.stationType
    });
  });
})

const dateRange = '数据自2024-01-01至' + XEUtils.toDateString(new Date(), 'yyyy-MM-dd')

const nowCity = ref('南昌市')

const mapOption = {
  geo: {
    map: 'JiangXi',
    selectedMode: 'single',
    itemStyle: {
      areaColor: '#e8f2f0',
      color: '#fff',
    },
    select: {
      itemStyle: {
        areaColor: '#00796a',
        color: '#fff',
      },
    },
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    regions: [{
      name: nowCity.value,
      selected: true
    }]
  },
}

const StationOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: '0',
    left: '0',
    right: '3%',
    bottom: '0',
    containLabel: true
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: citys.value
  },
  series: [
    {
      name: '监测站个数',
      type: 'bar',
      data: counts.value
    },
  ]
}

const typeOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '类型统计',
      type: 'pie',
      data: typeCount,
    }
  ]
}

</script>

<style lang="scss" scoped>
.progress {
  text-align: center;
  margin-bottom: 10px;

  & .el-progress--circle {
    margin-right: 30px;
  }
}
</style>
