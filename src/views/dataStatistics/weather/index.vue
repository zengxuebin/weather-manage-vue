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
      <el-col :span="6" style="border: 1px solid;">
        <MapEchart :options="mapOption" height="380px"></MapEchart>
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
    <el-card class="today-card" style="margin-top: 22px;">
      <template #header>
        <div>
          <span>天气统计</span>
          <span style="float: right;">江西省南昌市</span>
        </div>
      </template>
      <div class="progress">
        <el-progress type="circle" :percentage="30" color="#00796a">
          <el-row>
            <el-col>
              <el-text>晴</el-text>
            </el-col>
            <el-col style="margin-top: 5px;">
              <el-text>42天</el-text>
            </el-col>
          </el-row>
        </el-progress>
        <el-progress type="circle" :percentage="36" color="#00796a">
          <el-row>
            <el-col>
              <el-text>阴</el-text>
            </el-col>
            <el-col style="margin-top: 5px;">
              <el-text>78天</el-text>
            </el-col>
          </el-row>
        </el-progress>
        <el-progress type="circle" :percentage="30" color="#00796a">
          <el-row>
            <el-col>
              <el-text>雨</el-text>
            </el-col>
            <el-col style="margin-top: 5px;">
              <el-text>28天</el-text>
            </el-col>
          </el-row>
        </el-progress>
        <el-progress type="circle" :percentage="0" color="#00796a">
          <el-row>
            <el-col>
              <el-text>雪</el-text>
            </el-col>
            <el-col style="margin-top: 5px;">
              <el-text>0天</el-text>
            </el-col>
          </el-row>
        </el-progress>
        <el-progress type="circle" :percentage="4" color="#00796a">
          <el-row>
            <el-col>
              <el-text>其它</el-text>
            </el-col>
            <el-col style="margin-top: 5px;">
              <el-text>18天</el-text>
            </el-col>
          </el-row>
        </el-progress>
      </div>
    </el-card>
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

const dateRange = '数据自2023-01-01至' + XEUtils.toDateString(new Date(), 'yyyy-MM-dd')

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
