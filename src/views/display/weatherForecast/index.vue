<template>
  <div>
    <el-row>
      <el-col :span="24" style="height: 100%;">
        <Title :title="weatherTitle"></Title>
        <div style="margin: 20px 0;">
          <span style="font-weight: bold;">当前所在地：</span> 江西省
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
        </div>
        <el-tabs v-model="activeName" class="weather-item" @tab-click="handleClick" type="border-card">
          <template v-for="item in dayList" :key="item.key">
            <el-tab-pane :label="item.key" :name="item.value">
              <vxe-grid class="reverse-table" ref="xGrid" v-bind="gridOptions"></vxe-grid>
            </el-tab-pane>
          </template>
          <div style="margin-top: 20px;">
            <el-descriptions title="当日概况" :column="2" border>
              <el-descriptions-item label="当天湿度">{{ forecast.humidity }}</el-descriptions-item>
              <el-descriptions-item label="当天温度">{{ forecast.temperature }}</el-descriptions-item>
              <el-descriptions-item label="当天可见度">{{ forecast.visibility }}</el-descriptions-item>
              <el-descriptions-item label="当天云量">{{ forecast.cloudRate }}</el-descriptions-item>
              <el-descriptions-item label="当天气压">{{ forecast.pressure }}</el-descriptions-item>
              <el-descriptions-item label="当天降水量">{{ forecast.precipitation }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import { ref, reactive, nextTick, computed, onMounted } from 'vue'
import Title from "@/components/Title.vue"
import type { VxeGridInstance, VxeGridPropTypes, VxeGridProps } from 'vxe-table'
import { getAllCity, getStationByCity } from "@/api/weatherStation"
import { getForecastWeather } from "@/api/weatherForecast"
import XEUtils from 'xe-utils'
import axios from 'axios'

const weatherTitle = '7日内天气预报（2024/05/09 12:00发布）'
const activeName = ref<any>(XEUtils.toDateString(XEUtils.getWhatDay(new Date(), 1), 'yyyy-MM-dd'))
XEUtils.setup({
  formatStringMatchs: {
    E: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  }
})
const dayList = ref([{
  key: '',
  value: '',
}])

dayList.value.length = 0
for (let index = 0; index < 7; index++) {
  dayList.value.push({
    key: XEUtils.toDateString(XEUtils.getWhatDay(new Date(), index + 1), 'yyyy-MM-dd E'),
    value: XEUtils.toDateString(XEUtils.getWhatDay(new Date(), index + 1), 'yyyy-MM-dd'),
  })
}

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

const cityDropdown = ref()

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

const xGrid = ref<VxeGridInstance>()

const forecastWeatherList = ref<any[]>([]);

const handleWeather = (command: string) => {
  nowStation.value = command.split('/')[1]
  console.log(command);
  getForecastWeather(command.split('/')[0]).then(res => {
    forecastWeatherList.value = res.data
    reverseTable()
  })
}

const forecast = reactive({
  temperature: '',
  precipitation: '',
  pressure: '',
  visibility: '',
  cloudRate: '',
  humidity: '',
})

onMounted(() => {
  getForecastWeather('115.949044,28.689292').then(res => {
    forecastWeatherList.value = res.data
    reverseTable()
  })
})

const selectedDate = ref<string>(activeName.value)
const filteredWeatherData = computed(() => {
  return forecastWeatherList.value.filter(data => {
    // 根据日期进行筛选
    const dataDate = data.datetime.split(' ')[0]
    return dataDate === selectedDate.value
  }).map(data => {
    // 格式化
    const formattedDate = XEUtils.toDateString(data.datetime, 'HH:mm:ss')
    const formattedTemperature = data.temperature + '℃'
    const formattedPrecipitation = data.precipitation + 'mm'
    const formattedPressure = data.pressure + 'hPa'
    const formattedVisibility = data.visibility + 'km'
    const formattedCloudRate = data.cloudRate + '%'
    const formattedHumidity = data.humidity + '%'
    forecast.cloudRate = formattedCloudRate
    forecast.humidity = formattedHumidity
    forecast.precipitation = formattedPrecipitation
    forecast.pressure = formattedPressure
    forecast.temperature = formattedTemperature
    forecast.visibility = formattedVisibility
    return {
      ...data,
      datetime: formattedDate,
      temperature: formattedTemperature,
      precipitation: formattedPrecipitation,
      pressure: formattedPressure,
      visibility: formattedVisibility,
      cloudRate: formattedCloudRate,
      humidity: formattedHumidity,
    }
  })
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  selectedDate.value = tab.paneName as string
  reverseTable()
}

interface RowVO {
  col1: string
  col2: string
  col3: string
  col4: string
  col5: string
  col6: string
  col7: string
}

const gridOptions = reactive<VxeGridProps<RowVO>>({
  showOverflow: true,
  showHeader: false,
  columns: [],
  data: [],
})

const myColumns = [
  { field: 'datetime', title: '时间', className: 'first-field' },
  { field: 'precipitation', title: '降水量' },
  { field: 'temperature', title: '温度' },
  { field: 'pressure', title: '气压' },
  { field: 'visibility', title: '能见度' },
  { field: 'cloudRate', title: '云量' },
  { field: 'humidity', title: '湿度' },
]


const reverseTable = () => {
  const buildData = myColumns.map(column => {
    const item: any = { col0: column.title }
    filteredWeatherData.value.forEach((row, index) => {
      item[`col${index + 1}`] = row[column.field as keyof typeof row];
    })
    return item
  })
  const buildColumns: VxeGridPropTypes.Columns = [{
    field: 'col0',
    fixed: 'left',
    className: 'first-field',
    width: 80
  }]
  filteredWeatherData.value.forEach((item, index) => {
    buildColumns.push({
      field: `col${index + 1}`,
      minWidth: 120
    })
  })
  gridOptions.data = buildData
  gridOptions.columns = buildColumns
}

reverseTable()

</script>

<style lang="scss" scoped>
.weather-item {
  border-radius: 0 0 4px 4px;
}

.location-item {
  padding-left: 20px;
  border-right: 2px solid #fff;
  display: inline-block;
  cursor: pointer;
}

.el-dropdown-link {
  font-size: 15px;
  color: #000;
}

.reverse-table .vxe-body--row .vxe-body--column:first-child {
  background-color: #f8f8f9;
}
</style>
