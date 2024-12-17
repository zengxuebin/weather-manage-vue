<template>
  <div>
    <el-row>
      <el-col :span="24" class="today-weather">
        <TodayWeather @nowLocation="handleLocation" :weatherNow="weatherNow"></TodayWeather>
      </el-col>
    </el-row>
    <el-row justify="space-between">
      <el-col :span="12" style="margin-top: 20px; padding-right: 10px;">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>实时降水预报</span>
            </div>
          </template>
          <TodayEcharts :options="options" height="300px"></TodayEcharts>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 20px; padding-left: 10px">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>实时空气质量</span>
            </div>
          </template>
          <AirQuality :weatherNow="weatherNow"></AirQuality>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import TodayWeather from "@/components/weather/TodayWeather.vue"
import TodayEcharts from "@/components/echarts/index.vue"
import AirQuality from "@/components/weather/AirQuality.vue"
import { getStationByCity } from "@/api/weatherStation"
import { getNowWeather } from "@/api/weatherNow"
import { onMounted, ref } from "vue"
import XEUtils from "xe-utils"
import { getDictListByType } from "@/api/dict"

const location = ref('')

// 降水量
const minutes = ref([Number])
const precipitations = ref([Number])
const weatherNow = ref({})

const handleLocation = (value: string) => {
  location.value = value
  getNowWeather(location.value).then(res => {
    minutes.value.length = 0
    precipitations.value.length = 0
    options.title.text = res.desc
    weatherNow.value = res.weatherNow
    res.precipitation.forEach((item: any) => {
      minutes.value.push(item.minutes);
      precipitations.value.push(item.precipitation);
    })
    console.log(weatherNow.value);
    
  })
}

onMounted(() => {
  getNowWeather('115.949044,28.689292').then(res => {
    minutes.value.length = 0
    precipitations.value.length = 0
    res.precipitation.forEach((item: any) => {
      minutes.value.push(item.minutes)
      precipitations.value.push(item.precipitation)
    })
    weatherNow.value = res.weatherNow
    console.log(weatherNow.value);
    options.title.text = res.desc
  })
})

const options = {
  title: {
    text: '',
    subtext: XEUtils.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    itemGap: 250,
    left: "center",
    subtextStyle: {
      fontSize: 15,
    }
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: 'left'
  },
  toolbox: {
    show: true,
    feature: {
      magicType: { type: ['line', 'bar'] },
    }
  },
  xAxis: {
    name: '时间',
    type: 'category',
    boundaryGap: false,
    data: minutes.value,
  },
  yAxis: [
    {
      name: '降水量',
      type: 'value',
    },
  ],
  series: [
    {
      name: '降水量',
      type: 'line',
      data: precipitations.value,
      areaStyle: {},
      showSymbol: false,
    },
  ]
}
</script>

<style lang="scss" scoped>
.today-weather {
  background: url(@/assets/images/weather_bg.jpg);
  height: 300px;
  color: #fff;
  padding: 20px 40px;
  border-radius: 5px;
}
</style>
