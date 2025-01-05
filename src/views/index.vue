<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value=userCount>
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                累计用户数量
                <el-tooltip effect="dark" content="累计用户数量" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="stationCount">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                累计气象站点
                <el-tooltip effect="dark" content="系统存在的所有气象站点" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="weatherDataCount">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                累计气象数据总数
                <el-tooltip effect="dark" content="气象站点采集的所有气象数据总和" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    <el-row class="today-weather" justify="space-between">
      <el-col :span="8">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>最新气象数据</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item class="descriptions">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Location />
                  </el-icon>
                  所在地点
                </div>
              </template>
              福建省泉州市
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Calendar />
                  </el-icon>
                  今日日期
                </div>
              </template>
              {{ formattedDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <MostlyCloudy />
                  </el-icon>
                  天气现象
                </div>
              </template>
              多云<i class="vxe-icon-cloudy"></i>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Odometer />
                  </el-icon>
                  平均温度
                </div>
              </template>
              23.75°C
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Compass />
                  </el-icon>
                  平均气压
                </div>
              </template>
              83991.87hPa
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <ToiletPaper />
                  </el-icon>
                  相对湿度
                </div>
              </template>
              0.09%
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>最新气象数据速递</span>
            </div>
          </template>
          <TodayEcharts :options="options" height="260px"></TodayEcharts>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TodayEcharts from '@/components/echarts/index.vue'
import { getHomeInfo } from '@/api/home';

// 定义一个响应式的日期变量
const nowDate = ref(new Date());

// 格式化日期为 yyyy-MM-dd
const formattedDate = ref(formatDate(nowDate.value));

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]; // 返回 yyyy-MM-dd 格式
}

const stationCount = ref(0);
const userCount = ref(0);
const weatherDataCount = ref(0);

getHomeInfo().then(res => {
  stationCount.value = res.stationCount
  userCount.value = res.userCount
  weatherDataCount.value = res.weatherDataCount
})

const options = {
  title: {
    text: formattedDate.value
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      dataView: { readOnly: true },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    name: '日期',
    type: 'category',
    boundaryGap: false,
    data: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
      '20:00', '21:00', '22:00', '23:00', '00:00', '01:00',
      '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    ]
  },
  yAxis: [
    {
      name: '温度',
      type: 'value',
      axisLabel: {
        formatter: '{value} ℃'
      },
    },
    {
      name: '降水量',
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value} mm／h'
      },
    },
  ],
  series: [
    {
      name: '体感温度',
      type: 'line',
      data: [27.3, 27.7, 25.76, 25.41, 24.96, 24.65, 24.49, 24.4, 24.47, 24.47, 24.6,
        25, 24.56, 24.28, 23.77, 23.12, 22.43, 21.68, 20.93, 20.16, 19.26, 19, 19, 19, 19, 19, 19, 19],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      },
      yAxisIndex: 0,
    },
    {
      name: '降水量',
      type: 'line',
      data: [0, 0.0834, 2.3787, 1.1157, 0.2295, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0.1201, 0.076, 0.2455, 0.0909, 0.1234, 0.0931],
      areaStyle: {},
      showSymbol: false,
      yAxisIndex: 1,
    },
  ]
}
</script>

<style lang="scss" scoped>
.el-statistic {
  --el-statistic-content-font-size: 30px;
}

.statistic-card {
  border: 1px solid #34776a;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.item {
  margin-bottom: 10px;
}

.today-weather {
  margin-top: 30px;
  overflow: hidden;
  position: relative;
}

.descriptions {
  background-color: red;
}
</style>
