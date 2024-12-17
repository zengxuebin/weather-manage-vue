<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 20px; border: #00796a 1px solid;">
      <div style="padding:0 20px">
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="display: flex; align-items: center;">
              <el-icon size="32" color="#00796a">
                <List />
              </el-icon>
              <span class="alert-time">推送时间：{{ alert.triggerTime }}</span>
            </div>
          </el-col>
          <el-col :span="6" :offset="6" style="line-height: 32px;">
            <div class="alert-status">
              <span style="padding-right: 3px; color: #00796a;">●</span>已推送
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="24">
            <div class="main-container">
              <el-row :gutter="50" class="detail">
                <el-col :span="6">
                  <span>
                    预警标题：
                  </span>
                  {{ alert.alertTitle }}
                </el-col>
                <el-col :span="6">
                  <span>
                    预警单位：
                  </span>
                  {{ alert.alertSource }}
                </el-col>
                <el-col :span="4">
                  <span>
                    预警类型：
                  </span>
                  {{ alert.alertType }}
                </el-col>
                <el-col :span="4">
                  <span>
                    预警级别：
                  </span>
                  {{ alert.alertLevel }}
                </el-col>
                <el-col :span="6">
                  <span>
                    影响区域：
                  </span>
                  {{ alert.alertAreaId }}
                </el-col>
                <el-col :span="7">
                  <span>
                    预警开始时间：
                  </span>
                  {{ alert.startTime }}
                </el-col>
                <el-col :span="7">
                  <span>
                    预警结束时间：
                  </span>
                  {{ alert.endTime }}
                </el-col>
                <el-col :span="7">
                  <span>
                    预警发布时间：
                  </span>
                  {{ alert.triggerTime }}
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24" style="text-indent: 2em; line-height: 30px;">
                  {{ alert.alertDesc }}
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <span style="cursor: pointer;" @click="handleAlertDetails()">
          <el-icon>
            <HelpFilled />
          </el-icon>
          查看详情
        </span>
      </div>
    </el-card>
    <el-drawer v-model="detailDrawer" size="60%" :show-close="false" style="position: absolute">
      <template #header>
        <span class="detail-title">
          <el-icon>
            <HelpFilled />
          </el-icon>
          查看详情
        </span>
      </template>
      <template #default>
        <el-container style="height: 100%;">
          <el-main style="padding: 0;">
            <div class="sub-title">关联预警规则</div>
            <div class="detail-main">
              <el-descriptions :column="3" border>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      预警规则名称
                    </div>
                  </template>
                  蓝色高温预警
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      预警监测指标
                    </div>
                  </template>
                  26
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      比较操作符
                    </div>
                  </template>
                  >=
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      预警规则阈值
                    </div>
                  </template>
                  <el-tag size="small">25</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      预警规则描述
                    </div>
                  </template>
                  当温度达到或超过 28.0 度时触发预警
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="sub-title">关联相关站点</div>
            <div class="detail-main">
              <el-descriptions :column="3" border>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点监测编号
                    </div>
                  </template>
                  {{ station.stationNo }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点所在省份
                    </div>
                  </template>
                  {{ station.stationProvince }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点所在市
                    </div>
                  </template>
                  {{ station.stationCity }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点名称
                    </div>
                  </template>
                  {{ station.stationName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点所在经度
                    </div>
                  </template>
                  {{ station.stationLongitude }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点所在纬度
                    </div>
                  </template>
                  {{ station.stationLatitude }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      站点所在高度
                    </div>
                  </template>
                  {{ station.stationHeight }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div>
                      备注
                    </div>
                  </template>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="sub-title">关联预警流程</div>
            <div class="detail-main">
              <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="date" label="操作时间" width="180" align="center" />
                <el-table-column prop="name" label="操作人" width="180" align="center" />
                <el-table-column prop="address" label="操作结果" align="center" />
              </el-table>
            </div>
          </el-main>
          
        </el-container>

      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { getAllStation } from "@/api/weatherStation";

const props = defineProps({
  alert: {
    type: Object,
    default: {}
  },
})

const station = reactive({
  stationNo: '',
  stationCity: '',
  stationLatitude: '',
  stationLongitude: '',
  stationName: '',
  stationProvince: '',
  statonType: '',
  stationHeight: ''
})

getAllStation().then(res => {
  res.data.forEach((item: any) => {
    if (alert.value.alertAreaId === item.stationNo) {
      station.stationNo = item.stationNo
      station.stationCity = item.stationCity
      station.stationLatitude = item.stationLatitude
      station.stationLongitude = item.stationLongitude
      station.stationName = item.stationName
      station.stationProvince = item.stationProvince
      station.statonType = item.stationType
      station.stationHeight = item.stationHeight
      alert.value.alertAreaId = item.stationProvince + item.stationCity + item.stationName
    }
  })
})


const alert = ref({})
alert.value = props.alert

console.log(alert.value);

const alertId = ref()
const detailDrawer = ref(false)

const handleAlertDetails = () => {
  detailDrawer.value = true
}

const tableData = [
  {
    date: '2024-05-20 13:24:40',
    name: 'admin',
    address: '系统触发',
  },
  {
    date: '2024-05-20 13:26:28',
    name: 'admin',
    address: '已发布',
  },
  {
    date: '2024-05-20 13:27:12',
    name: 'admin',
    address: '已推送',
  },
]

</script>

<style lang="scss" scoped>
.bottom {
  border-top: 1px solid #333;
  padding: 7px 0;
  text-align: center;
}

.alert-time {
  padding-left: 5px;
  font-weight: bold;
  font-size: 16px;
}

.alert-status {
  background: repeating-linear-gradient(to right, #408b7f, #fff);
  border-radius: 20px 0 0 20px;
  float: right;
  width: 85px;
  text-align: right;
  color: #00796a;
}

.el-row {
  margin: 10px 0;
}

.main-container {
  background-color: #c9d9d6;
  border-radius: 5px;
  padding: 10px;
}

.detail .el-col {
  margin: 5px 0;
  border-right: 2px solid #333;

  & span {
    font-weight: bold;
  }
}

.detail-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.sub-title {
  border-left: #00796a solid 5px;
  padding: 5px;
  background-color: #c9d9d6;
  font-size: 16px;
  margin-bottom: 10px;
}

.detail-main {
  margin-bottom: 30px;
}
</style>
