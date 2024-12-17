<template>
  <div>

    <el-row style="margin: 10px 0;">
      <el-col :span="7" style="padding-top: 8px;">
        <span style="font-weight: bold;">当前所在地：</span>
        <div class="location-item">江西省</div>
        <div class="location-item">
          <el-dropdown trigger="click" @command="handleCommand">
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
        <!-- <el-select v-model="nowCity" placeholder="请选择城市" @change="change">
          <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
      </el-col>
      <el-col :span="6">
        <el-date-picker v-model="dateRange" type="daterange" start-placeholder="检索开始时间" end-placeholder="检索结束时间"
          unlink-panels :shortcuts="shortcuts" :disabled-date="disabledDate" :clearable=false @change="change" />
      </el-col>
    </el-row>
    <el-card class="today-card">
      <template #header>
        <div>
          <span>历史天气（数据库天气数据始于2024-01-01）</span>
        </div>
      </template>
      <el-row :gutter="16" style="text-align: center;">
        <el-col :span="4" class="statistic-card">
          <el-statistic :value="statistics.maxTemp" value-style="color: #ff501b" :formatter="tempFormat">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                最高温度
                <el-tooltip effect="dark" content="给定时间内的最高温度" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4" class="statistic-card">
          <el-statistic :value="statistics.minTemp" value-style="color: #3097fd" :formatter="tempFormat">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                最低温度
                <el-tooltip effect="dark" content="给定时间内的最低温度" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4" class="statistic-card">
          <el-statistic :value="statistics.sumPrecipitation" :formatter="precFormat">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                总降水量
                <el-tooltip effect="dark" content="给定时间内的总降水量" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4" class="statistic-card">
          <el-statistic :value="statistics.maxPrecipitation" :formatter="precFormat">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                日最大降水量
                <el-tooltip effect="dark" content="给定时间内日最大降水量" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4" class="statistic-card">
          <el-statistic :value="statistics.maxVisibility" value-style="color: #23cc72" :formatter="visFormat">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                能见度最高
                <el-tooltip effect="dark" content="给定时间内的能见度最高的指数" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4" class="statistic-card">
          <el-statistic :value="statistics.maxWindSpeed" value-style="color: #f6bd0e" :formatter="speedFormat">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                风速最大
                <el-tooltip effect="dark" content="给定时间内的空气最差的指数" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col>
          <TempEchart :options="tempOptions" height="200px"></TempEchart>
        </el-col>
        <el-col style="margin-top: 10px;">
          <vxe-table size="small" border max-height="250" :row-config="{ isHover: true }" :data="weatherStationList">
            <vxe-column type="seq" minWidth="60" title="序号" align="center"></vxe-column>
            <vxe-column field="stationName" title="站点名称" minWidth="120" align="center"></vxe-column>
            <vxe-column field="stationType" title="站点类型" minWidth="120" align="center"></vxe-column>
            <vxe-column field="stationLongitude" title="站点经度" minWidth="120" align="center"></vxe-column>
            <vxe-column field="stationLatitude" title="站点纬度" minWidth="120" align="center"></vxe-column>
            <vxe-column field="stationHeight" title="站点高度" minWidth="120" align="center"></vxe-column>
          </vxe-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import TempEchart from "@/components/echarts/index.vue"
import { getAllCity, getStationByCity } from "@/api/weatherStation"
import { getHistoryStatistics } from "@/api/weatherHistory"
import XEUtils from 'xe-utils'
import { number } from 'echarts'

const nowCity = ref('南昌市')

const cityList: any = reactive([])

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

const weatherStationList = ref([])

const handleCommand = (command: string) => {
  nowCity.value = command
  change()
}

const change = () => {
  getStationByCity(nowCity.value).then(res => {
    weatherStationList.value = res.data
  })
  getStatistics(nowCity.value, dateRange.value)
}

getStationByCity(nowCity.value).then(res => {
  weatherStationList.value = res.data
})

const dateRange = ref<[Date, Date]>([
  new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000),
  new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
])

const statistics = reactive({
  maxTemp: 0.0,
  maxVisibility: 0.0,
  minTemp: 0.0,
  sumPrecipitation: 0.0,
  maxPrecipitation: 0.0,
  maxWindSpeed: 0.0
})

const historyDates = ref([Number])
const maxTemps = ref([Number])
const minTemps = ref([Number])

const getStatistics = (nowCity: string, dateRange: any) => {
  const date = {
    nowCity: nowCity,
    startDate: XEUtils.toDateString(dateRange[0], 'yyyy-MM-dd'),
    endDate: XEUtils.toDateString(dateRange[1], 'yyyy-MM-dd'),
  }
  getHistoryStatistics(date).then(res => {
    const data = res.statistics
    statistics.maxTemp = data.maxTemp
    statistics.maxPrecipitation = data.maxPrecipitation
    statistics.maxVisibility = data.maxVisibility
    statistics.maxWindSpeed = data.maxWindSpeed
    statistics.minTemp = data.minTemp
    statistics.sumPrecipitation = data.sumPrecipitation

    historyDates.value.length = 0
    maxTemps.value.length = 0
    minTemps.value.length = 0
    res.tempList.forEach((item: any) => {
      historyDates.value.push(item.historyDate);
      maxTemps.value.push(item.maxTemp);
      minTemps.value.push(item.minTemp);
    })

  })
}

getStatistics(nowCity.value, dateRange.value)

const disabledDate = (date: Date) => {
  return date.getTime() > new Date().getTime()
}

const tempFormat = (value: number) => {
  return value + '℃'
}

const precFormat = (value: number) => {
  return value + 'mm'
}

const visFormat = (value: number) => {
  return value + 'km'
}

const speedFormat = (value: number) => {
  return value + 'm/s'
}

const shortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近15天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]


const tempOptions = {
  title: {
    text: '温度瀑布图',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    splitLine: { show: false },
    data: historyDates.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '最高温度',
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent'
      },
      data: maxTemps.value
    },
    {
      name: '最低温度',
      type: 'bar',
      stack: 'Total',
      data: minTemps.value
    }
  ]
}
</script>

<style lang="scss" scoped>
.right-icon {
  padding: 10px;
  position: relative;
  top: 5px;
  color: gray;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 .125rem .125rem -.125rem rgba(31, 27, 45, .08), 0 .25rem .75rem rgba(31, 27, 45, .08) !important;
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
</style>
