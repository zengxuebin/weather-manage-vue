<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="2">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                今日活跃用户数量
                <el-tooltip effect="dark" content="系统中今日登录过的用户数量" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>比昨日新增</span>
              <span class="green">
                0
                <el-icon>
                  <CaretTop />
                </el-icon>
              </span>
              人
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="338">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                累计预警条数
                <el-tooltip effect="dark" content="从2024年1月1日至今系统推送的预警信息数量" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>比昨日下降</span>
              <span class="red">
                56
                <el-icon>
                  <CaretBottom />
                </el-icon>
              </span>
              条
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="111">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                累计气象站点
                <el-tooltip effect="dark" content="从2024年1月1日至今系统存在的所有气象站点" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>比昨日新增</span>
              <span class="green">
                0
                <el-icon>
                  <CaretTop />
                </el-icon>
              </span>
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="1238">
            <template #title>
              <div style="display: inline-flex; align-items: center; font-size: 14px;">
                累计气象数据总数
                <el-tooltip effect="dark" content="从2024年1月1日至今气象站点采集的所有气象数据总和" placement="top">
                  <el-icon style="margin-left: 4px" :size="14">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>比昨日下降</span>
              <span class="red">
                123
                <el-icon>
                  <CaretBottom />
                </el-icon>
              </span>
              条
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="today-weather" justify="space-between">
      <el-col :span="8">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>今日天气速递</span>
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
              江西省南昌市
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
              2024-05-20
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
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <WindPower />
                  </el-icon>
                  风速风向
                </div>
              </template>
              21.61m/s 东南
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Pouring />
                  </el-icon>
                  降水数据
                </div>
              </template>
              0
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <i class="vxe-icon-eye-fill"></i>
                  平均能见度
                </div>
              </template>
              25
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <i class="vxe-icon-indicator"></i>
                  紫外线指数
                </div>
              </template>
              最弱
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Sunset />
                  </el-icon>
                  舒适度指数
                </div>
              </template>
              温暖
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Pouring />
                  </el-icon>
                  感冒指数
                </div>
              </template>
              极易发
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card class="today-card">
          <template #header>
            <div>
              <span>24小时天气速递</span>
            </div>
          </template>
          <TodayEcharts :options="options" height="320px"></TodayEcharts>
        </el-card>
        <el-card class="today-card" style="margin-top: 22px;">
          <template #header>
            <div>
              <span>接收预警消息预览</span>
            </div>
          </template>
          <el-descriptions border :column="5">
            <el-descriptions-item label="白色">0</el-descriptions-item>
            <el-descriptions-item label="蓝色">0</el-descriptions-item>
            <el-descriptions-item label="黄色">0</el-descriptions-item>
            <el-descriptions-item label="橙色">0</el-descriptions-item>
            <el-descriptions-item label="红色">0</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TodayEcharts from '@/components/echarts/index.vue'

const options = {
  title: {
    text: '2024-05-20'
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
}</style>
