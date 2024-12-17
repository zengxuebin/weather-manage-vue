<template>
  <div>
    <el-row>
      <el-col :span="18" class="weather-location">
        <el-icon>
          <LocationFilled />
        </el-icon>
        <div class="location-item">江西省</div>
        <div class="location-item">
          <el-dropdown trigger="click" @command="handleCity">
            <span class="el-dropdown-link">
              {{ nowCity }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="item in cityList" :key="item.value">
                  <el-dropdown-item :command="item.value">{{ item.label }}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="location-item">
          <el-dropdown trigger="click" ref="cityDropdown" @command="handleWeather">
            <span class="el-dropdown-link">
              {{ nowStation }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="item in stationList" :key="item.value">
                  <el-dropdown-item :command="item.value + '/' + item.label">{{ item.label }}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="6" class="update-time">
        {{ nowWeather.dataCollectTime }} 更新
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="24" class="weather-temp">
        <el-tooltip content="体感温度"><span>{{ nowWeather.temperature }}<sup>℃</sup></span></el-tooltip>
        <span class="status">{{ nowWeather.weather }}</span>
      </el-col>
    </el-row>
    <el-row justify="space-around" class="weather-item">
      <el-col :span="5">
        <el-icon>
          <Compass />
        </el-icon>
        {{ nowWeather.pressure }}<el-tooltip effect="dark" content="气压" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <el-icon>
          <WindPower />
        </el-icon>
        微风 东南风<el-tooltip effect="dark" content="风速风向" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <el-icon>
          <Pouring />
        </el-icon>
        {{ nowWeather.precipitation }}<el-tooltip effect="dark" content="降水量" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <el-icon>
          <Orange />
        </el-icon>
        空气{{ nowWeather.airQualityDesc }} {{ nowWeather.aqi }}<el-tooltip effect="dark" content="空气质量" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row justify="space-around" class="weather-item">
      <el-col :span="5">
        <i class="vxe-icon-indicator"></i>
        最弱<el-tooltip effect="dark" content="紫外线" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <el-icon>
          <Sunset />
        </el-icon>
        {{ nowWeather.comfort }}<el-tooltip effect="dark" content="舒适度" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <i class="vxe-icon-eye-fill"></i>
        {{ nowWeather.visibility }}km<el-tooltip effect="dark" content="能见度" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <el-icon>
          <ToiletPaper />
        </el-icon>
        {{ nowWeather.humidity }}<el-tooltip effect="dark" content="湿度" placement="top">
          <el-icon style="margin-left: 4px" :size="18">
            <Warning />
          </el-icon>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { getAllCity, getStationByCity } from "@/api/weatherStation"
import { getDictListByType } from "@/api/dict"

const props = defineProps({
  height: {
    type: String,
    default: '100%'
  },
  width: {
    type: String,
    default: '100%'
  },
  weatherNow: {
    type: Object,
    default: {}
  }
})
const nowWeather: any = ref({})

const nowCity = ref('南昌市')
const nowStation = ref('青山湖区')

const cityList: any = reactive([])
const stationList: any = reactive([])

getAllCity().then(res => {
  const data = res.data
  cityList.length = 0
  data.forEach((item: any) => {
    cityList.push({
      label: item.station_city,
      value: item.station_city
    })
  })
  console.log(cityList);
})

const cityDropdown = ref()

getStationByCity(nowCity.value).then(res => {
  const data = res.data
  stationList.length = 0
  data.forEach((item: any) => {
    stationList.push({
      label: item.stationName,
      value: item.stationLongitude + ',' + item.stationLatitude
    })
  })
})

const handleCity = (command: string) => {
  nowCity.value = command
  if (!cityDropdown.value) return
  getStationByCity(nowCity.value).then(res => {
    const data = res.data
    stationList.length = 0
    data.forEach((item: any) => {
      stationList.push({
        label: item.stationName,
        value: item.stationLongitude + ',' + item.stationLatitude
      })
    })
    cityDropdown.value.handleOpen()
  })
}

const emit = defineEmits(['nowLocation'])

const handleWeather = (command: string) => {
  nowStation.value = command.split('/')[1]
  emit('nowLocation', command.split('/')[0])
}

watch(() => props.weatherNow, (newWeatherNow) => {
  nowWeather.value = newWeatherNow
  getDictListByType('sys_weather').then(res => {
    console.log(nowWeather.value);
    res.data.forEach((item: any) => {
      if (item.dictValue === nowWeather.value.weather) {
        nowWeather.value.weather = item.dictLabel
      }
    })
  })
}, {
  deep: true
})
</script>

<style lang="scss" scoped>
.weather-location {
  font-size: 32px;
}

.update-time {
  text-align: right;
  font-size: 14px;
}

.location-item {
  padding-left: 20px;
  padding-right: 20px;
  border-right: 2px solid #fff;
  display: inline-block;
  cursor: pointer;
}

.weather-temp {
  text-align: center;
  font-size: 80px;
  margin: 15px auto;
}

.weather-item {
  text-align: center;
  font-size: 24px;
  margin-bottom: 15px;
}

.status {
  font-weight: lighter;
  margin-left: 10px;
  font-size: 50px;
}

.el-dropdown-link {
  color: #fff;
  font-size: 32px;
}
</style>
