<template>
  <div class="container">
    <el-row>
      <el-col :span="12">
        <AirEchart :options="options" height="300px"></AirEchart>
      </el-col>
      <el-col :span="12" class="air-item">
        <el-row style="margin-bottom: 10px;">
          <el-col :span="12">
            <el-space direction="vertical">
              <el-text>PM2.5<el-tooltip effect="dark" content="可深入到细支气管和肺泡。可引发心血管病、呼吸道疾病和肺癌" placement="top">
                  <el-icon style="margin-left: 4px" :size="13">
                    <Warning />
                  </el-icon>
                </el-tooltip></el-text>
              <el-text>细颗粒物</el-text>
              <span style="font-weight: bold;">{{ nowWeather.pm25 }}</span>
            </el-space>
          </el-col>
          <el-col :span="12">
            <el-space direction="vertical">
              <el-text>PM10<el-tooltip effect="dark" content="会积累在呼吸系统中，可引发多种疾病，对大气能见度影响很大" placement="top">
                  <el-icon style="margin-left: 4px" :size="13">
                    <Warning />
                  </el-icon>
                </el-tooltip></el-text>
              <el-text>粗颗粒物</el-text>
              <span style="font-weight: bold;">{{ nowWeather.pm10 }}</span>
            </el-space>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="12">
            <el-space direction="vertical">
              <el-text>SO<sub>2</sub><el-tooltip effect="dark" content="可形成烟雾和气溶胶，随呼吸进入肺部，使人呼吸困难， 并损伤肺部" placement="top">
                  <el-icon style="margin-left: 4px" :size="13">
                    <Warning />
                  </el-icon>
                </el-tooltip></el-text>
              <el-text>二氧化硫</el-text>
              <span style="font-weight: bold;">{{ nowWeather.so2 }}</span>
            </el-space>
          </el-col>
          <el-col :span="12">
            <el-space direction="vertical">
              <el-text>NO<sub>2</sub><el-tooltip effect="dark" content="吸入过多易刺激眼睛和上呼吸道，造成咽部不适、干咳等" placement="top">
                  <el-icon style="margin-left: 4px" :size="13">
                    <Warning />
                  </el-icon>
                </el-tooltip></el-text>
              <el-text>二氧化氮</el-text>
              <span style="font-weight: bold;">{{ nowWeather.no2 }}</span>
            </el-space>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-space direction="vertical">
              <el-text>CO<el-tooltip effect="dark" content="可造成头晕、缺氧甚至窒息，对心脏病、贫血和呼吸困难人群伤害大" placement="top">
                  <el-icon style="margin-left: 4px" :size="13">
                    <Warning />
                  </el-icon>
                </el-tooltip></el-text>
              <el-text>一氧化碳</el-text>
              <span style="font-weight: bold;">{{ nowWeather.co }}</span>
            </el-space>
          </el-col>
          <el-col :span="12">
            <el-space direction="vertical">
              <el-text>O<sub>3</sub><el-tooltip effect="dark" content="刺激呼吸道，会造成咽喉肿痛、胸闷、咳嗽、引发支气管炎和肺气肿" placement="top">
                  <el-icon style="margin-left: 4px" :size="13">
                    <Warning />
                  </el-icon>
                </el-tooltip></el-text>
              <el-text>臭氧</el-text>
              <span style="font-weight: bold;">{{ nowWeather.o3 }}</span>
            </el-space>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import AirEchart from "@/components/echarts/index.vue"
import { reactive, ref, watch } from "vue";

const props = defineProps({
  weatherNow: {
    type: Object,
    default: {}
  }
})

const nowWeather: any = ref({})
nowWeather.value = props.weatherNow
const airQuality = reactive({
  aqi: 0,
  airQualityDesc: '',
})

airQuality.aqi = nowWeather.value.aqi
airQuality.airQualityDesc = nowWeather.value.airQualityDesc


const options = ref({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}'
  },
  series: [
    {
      name: 'AQI空气指数',
      type: 'gauge',
      min: 0,
      max: 500,
      splitNumber: 5,
      progress: {
        show: true
      },
      itemStyle: {
        color: '#00796a',
      },
      axisLabel: {
        fontSize: 10
      },
      title: {
        offsetCenter: [0, '30%'],
        color: '#00796a',
        fontSize: 20,
      },
      pointer: {
        show: false
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        color: '#00796a',
        fontSize: 40,
        offsetCenter: [0, 0]
      },
      data: [
        {
          value: airQuality.aqi,
          name: airQuality.airQualityDesc
        }
      ]
    }
  ]
})

watch(() => props.weatherNow, (newWeatherNow) => {
  nowWeather.value = newWeatherNow
  airQuality.aqi = nowWeather.value.aqi
  airQuality.airQualityDesc = nowWeather.value.airQualityDesc
  options.value.series[0].data[0].value = airQuality.aqi
  options.value.series[0].data[0].name = airQuality.airQualityDesc
}, {
  deep: true
})
</script>

<style lang="scss" scoped>
.container {
  border-radius: 5px;
}

.air-item {
  color: #00796a;
  text-align: center;
  padding: 20px;
}
</style>
