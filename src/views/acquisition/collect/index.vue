<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions">
      <template #toolbar_buttons>
        <vxe-button status="primary" icon="vxe-icon-add" @click="collectData">采集</vxe-button>
        <vxe-button status="primary" icon="vxe-icon-edit">编辑</vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete">删除</vxe-button>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import type { VXETable, VxeGridInstance, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'
import { getNowWeather, getPageWeatherData } from "@/api/weatherData"
import { getAllStation } from "@/api/weatherStation"

const xGrid = ref<VxeGridInstance>()

const stationList: any = ref([])

getAllStation().then(res => {
  res.data.forEach((item: any) => {
    stationList.value.push({
      value: item.stationNo,
      label: item.stationProvince + item.stationCity + item.stationName + '站'
    })
  })
  const { formConfig } = gridOptions
  let stationItem
  if (formConfig?.items) {
    stationItem = formConfig.items[0]
  }
  if (stationItem && stationItem.itemRender) {
    stationItem.itemRender.options = stationList.value
  }
  console.log(stationList.value);
})

const collectData = () => {
  ElMessageBox.confirm(
    '此操作将采集此刻所有气象站的气象数据，是否继续？',
    '数据采集',
    {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const loading = ElLoading.service({
        lock: true,
        text: '正在采集中',
      })
      getNowWeather().then(res => {
        console.log(res);
        loading.close()
        if (xGrid.value) {
          xGrid.value.commitProxy('query')
        }
        ElMessage({
          type: 'success',
          message: '采集成功',
        })
      })
        .catch(() => {
          loading.close()
          if (xGrid.value) {
            xGrid.value.commitProxy('query')
          }
          ElMessage({
            type: 'success',
            message: '采集成功',
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '您已取消采集操作',
      })
    })
}

const editData = () => {
  console.log('编辑按钮被点击');
}

const gridOptions = reactive<VxeGridProps>({
  border: true,
  // 行斑马色
  stripe: true,
  // 设置表头所有内容过长时显示为省略号
  showHeaderOverflow: true,
  // 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
  showOverflow: true,
  height: 'auto',
  // 导出配置项
  exportConfig: {},
  // 行配置信息
  rowConfig: {
    // 自定义行数据唯一主键的字段名（默认自动生成）
    keyField: 'dataId',
    // 当鼠标移到行时，是否要高亮当前行
    isHover: true
  },
  // 列配置信息
  columnConfig: {
    // 每一列是否启用列宽调整
    resizable: true
  },
  // 排序配置项
  sortConfig: {
    trigger: 'cell',
    // 所有列是否使用服务端筛选，如果设置为 true 则不会对数据进行处理
    remote: true
  },
  // 分页配置项
  pagerConfig: {
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100],
    layouts: [
      "PrevJump",
      "PrevPage",
      "JumpNumber",
      "NextPage",
      "NextJump",
      "Sizes",
      "FullJump",
      "Total",
    ], //自定义布布局
    // 带背景颜色
    background: true,
  },
  formConfig: {
    titleAlign: 'right',
    //是否显示标题冒号
    titleColon: true,
    // 标题内容过长时显示为省略号
    titleOverflow: true,
    items: [
      {
        field: 'stationNo',
        title: '站点名称',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: { placeholder: '请选择站点名称' },
        }
      },
      {
        field: 'windDirection',
        title: '风向',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: { placeholder: '请选择风向' },
        }
      },
      {
        field: 'dataCollectDate',
        title: '采集时间',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            type: "date",
            placeholder: "选择时间",
            disabledMethod: disabledDate,
          },
        }
      },
      // 功能
      {
        span: 6,
        align: 'center',
        itemRender: {
          name: '$buttons', children: [
            {
              props: {
                type: 'submit',
                content: '查询',
                status: 'primary',
                icon: 'vxe-icon-search',
              }
            },
            {
              props: {
                type: 'reset',
                content: '重置',
                icon: 'vxe-icon-repeat'
              }
            }
          ]
        }
      }
    ]
  },
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons'
    },
    refresh: true, // 显示刷新按钮
    export: true, // 显示导出按钮
    zoom: true, // 显示全屏按钮
    custom: true // 显示自定义列按钮
  },
  proxyConfig: {
    seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
    form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
    props: {
      // 对应响应结果 Promise<>
      result: 'records', // 配置响应结果列表字段
      total: 'total' // 配置响应结果总页数字段
    },
    // 接收 Promise API
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query: ({ page, sorts, filters, form }) => {
        return new Promise(resolve => {
          const queryParams: any = Object.assign({}, form)
          // 处理排序条件
          const firstSort = sorts[0]
          if (firstSort) {
            queryParams.sort = firstSort.field
            queryParams.order = firstSort.order
          }
          // 处理筛选条件
          filters.forEach(({ field, values }) => {
            queryParams[field] = values.join(',')
          })

          // 请求参数
          const data = {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            entity: {
              stationNo: form.stationNo,
              windDirection: form.windDirection,
            }
          }
          console.log(data);
          // 调用方法
          getPageWeatherData(data).then(res => {
            const data = res.data
            resolve({
              records: data.records,
              total: data.total
            })
          })
        })
      },
      delete: ({ body }) => {
        return new Promise((resolve, reject) => {

        })
      },
    }
  },
  columns: [
    {
      type: 'checkbox',
      width: 60,
      align: "center",
      fixed: 'left'
    },
    {
      type: 'seq',
      title: '序号',
      align: "center",
      width: 60
    },
    {
      field: 'stationNo',
      title: '气象站点',
      align: "center",
      width: 180,
      formatter: ({ cellValue }) => {
        let res = ''
        stationList.value.forEach((item: { value: any; label: any }) => {
          if (cellValue === item.value) {
            res = item.label;
          }
        })
        return res
      }
    },
    {
      field: 'dataCollectTime',
      title: '数据采集时间',
      align: "center",
      width: 180,
    },
    {
      field: 'temperature',
      title: '温度',
      align: "center",
      width: 100,
    },
    {
      field: 'humidity',
      title: '湿度',
      align: "center",
      width: 100,
    },
    {
      field: 'pressure',
      title: '气压',
      align: "center",
      width: 100,
    },
    {
      field: 'windSpeed',
      title: '风速',
      align: "center",
      width: 100,
    },
    {
      field: 'windDirection',
      title: '风向',
      align: "center",
      width: 100,
      formatter: ({ cellValue }) => {
        if (cellValue == '0') {
          return '东北风'
        } else {
          return '东风'
        }
      }
    },
    {
      field: 'precipitation',
      title: '降水量',
      align: "center",
      width: 100,
    },
    {
      field: 'clouds',
      title: '云量',
      align: "center",
      width: 100,
    },
    {
      field: 'visibility',
      title: '能见度',
      align: "center",
      width: 100,
    },
    {
      field: 'aqi',
      title: 'AQI',
      align: "center",
      width: 100,
    },
    {
      field: 'pm25',
      title: 'PM2.5',
      align: "center",
      width: 100,
    },
    {
      field: 'pm10',
      title: 'PM10',
      align: "center",
      width: 100,
    },
    {
      field: 'no2',
      title: 'NO2',
      align: "center",
      width: 100,
    },
    {
      field: 'o3',
      title: 'O3',
      align: "center",
      width: 100,
    },
    {
      field: 'co',
      title: 'CO',
      align: "center",
      width: 100,
    },
  ],
  checkboxConfig: {
    reserve: true,
    highlight: true,
    range: true
  },
})

onMounted(() => {
  const sexList = [
    { label: '东北风', value: '0' },
    { label: '东风', value: '1' },
    { label: '东南风', value: '2' },
    { label: '南风', value: '3' },
    { label: '西南风', value: '4' },
    { label: '西风', value: '5' },
    { label: '西北风', value: '6' },
    { label: '北风', value: '7' },
  ]
  const { formConfig } = gridOptions

  if (formConfig && formConfig.items) {
    const sexItem = formConfig.items[1]
    if (sexItem && sexItem.itemRender) {
      sexItem.itemRender.options = sexList
    }
  }

})

function disabledDate({ date }: any) {
  return date.getTime() > new Date().getTime()
}

</script>

<style lang="scss" scoped></style>
