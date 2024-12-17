<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions" v-on="gridEvent">
      <template #toolbar_buttons>
        <vxe-button status="primary" icon="vxe-icon-send" @click="releaseAlert">发布</vxe-button>
        <vxe-button status="warning" icon="vxe-icon-undo" @click="ignoreAlert">忽略</vxe-button>
        <vxe-button status="primary" icon="vxe-icon-edit" @click="editAlertDesc">编辑</vxe-button>
        <vxe-button status="primary" icon="vxe-icon-delete">删除</vxe-button>
      </template>
      <template #alertStatus="{ row }">
        <el-tag size='large' type="warning">待发布</el-tag>
      </template>
    </vxe-grid>
    <el-dialog v-model="dialogFormVisible" title="预警详情" align-center>
      <el-form :model="descForm">
        <el-form-item label="预警详情">
          <el-input v-model="descForm.alertDesc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="请输入预警详情" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAlertDesc">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { VXETable, VxeGridInstance, VxeGridListeners, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'
import { getPageReleaseAlert, generateReleaseAlert } from "@/api/weatherAlert"
import { getAllStation } from "@/api/weatherStation"
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllAlertRule } from "@/api/alertRule"
import { handleAlertIgnore, handleAlertRelease } from "@/api/weatherAlert";

const xGrid = ref<VxeGridInstance>()

const dialogFormVisible = ref(false)
const descForm = reactive({
  alertDesc: '',
})

const editAlertDesc = () => {
  if (xGrid.value) {
    const rows = xGrid.value.getCheckboxRecords(true)
    if (rows && rows.length == 1) {
      dialogFormVisible.value = true
      descForm.alertDesc = rows[0].alertDesc
    } else {
      ElMessage({
        message: '您只能选择一条预警信息进行编辑',
        type: 'warning',
      })
    }
  }
}

const ignoreAlert = () => {
  if (xGrid.value) {
    const rows = xGrid.value.getCheckboxRecords(true)
    if (rows && rows.length >= 1) {
      ElMessageBox.confirm(
        '此操作将忽略预警信息使其流程结束，此操作不可逆，是否继续？',
        '警告',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          let rowList: any[] = []
          rows.forEach(item => {
            console.log(item);
            rowList.push(item.alertId)
          })
          handleAlertIgnore(rowList).then(res => {
            if (xGrid.value) {
              xGrid.value.commitProxy('query')
            }
            ElMessage({
              type: 'success',
              message: '忽略预警信息成功，所选预警信息流程已终止',
            })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消忽略预警信息',
          })
        })
    } else {
      ElMessage({
        message: '您需要选择需要忽略的预警信息',
        type: 'warning',
      })
    }
  }
}

const releaseAlert = () => {
  if (xGrid.value) {
    const rows = xGrid.value.getCheckboxRecords(true)
    if (rows && rows.length >= 1) {
      ElMessageBox.confirm(
        '此操作将发布预警信息使其流转到待推送状态，是否继续？',
        '发布',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'success',
        }
      )
        .then(() => {
          let rowList: any[] = []
          rows.forEach(item => {
            console.log(item);
            rowList.push(item.alertId)
          })
          handleAlertRelease(rowList).then(res => {
            if (xGrid.value) {
              xGrid.value.commitProxy('query')
            }
            ElMessage({
              type: 'success',
              message: '发布预警信息成功，等待相关工作人员推送',
            })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消发布预警信息',
          })
        })
    } else {
      ElMessage({
        message: '您需要选择需要忽略的预警信息，此操作不可逆',
        type: 'warning',
      })
    }
  }
}

const saveAlertDesc = () => {
  dialogFormVisible.value = false
  ElMessage({
    message: '保存预警详情成功',
    type: 'success',
  })
}

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
    stationItem = formConfig.items[6]
  }
  if (stationItem && stationItem.itemRender) {
    stationItem.itemRender.options = stationList.value
  }
})

const alertRuleList: any = ref([])

getAllAlertRule().then(res => {
  res.data.forEach((item: any) => {
    alertRuleList.value.push({
      value: item.ruleId,
      label: item.ruleName,
    })
  })
  console.log(res.data);

})

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
    keyField: 'alertId',
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
        field: 'alertTitle',
        title: '预警标题',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入预警信息标题'
          }
        }
      },
      {
        field: 'alertType',
        title: '预警类型',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: {
            placeholder: '请选择预警类型'
          }
        }
      },
      {
        field: 'alertStatus',
        title: '预警状态',
        span: 6,
        itemRender: {
          name: '$select',
          options: [
            { label: '待发布', value: '0' }
          ],
          props: {
            placeholder: '请选择预警状态',
          },
          defaultValue: '0'
        }
      },
      {
        field: 'alertLevel',
        title: '预警级别',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '白色', value: '白色' },
            { label: '蓝色', value: '蓝色' },
            { label: '黄色', value: '黄色' },
            { label: '橙色', value: '橙色' },
            { label: '红色', value: '红色' },
          ],
          props: {
            placeholder: '请选择预警级别',
          },
        }
      },
      //       private String alertTitle;
      // private String alertType;
      // private String alertStatus;
      // private String alertLevel;
      // private String alertRuleId;
      // private String alertSource;
      // private String alertAreaId;
      {
        field: 'alertType',
        title: '预警规则',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '台风', value: 'type_01' },
            { label: '暴雨', value: 'type_02' },
            { label: '暴雪', value: 'type_03' },
            { label: '寒潮', value: 'type_04' },
            { label: '大风', value: 'type_05' },
            { label: '沙尘暴', value: 'type_06' },
            { label: '高温', value: 'type_07' },
            { label: '干旱', value: 'type_08' },
            { label: '雷电', value: 'type_09' },
            { label: '冰雹', value: 'type_10' },
            { label: '霜冻', value: 'type_11' },
            { label: '大雾', value: 'type_12' },
            { label: '霾', value: 'type_13' },
            { label: '雷雨大风', value: 'type_14' },
            { label: '空气重污染', value: 'type_15' },
          ],
          props: {
            placeholder: '请选择预警规则',
          },
        }
      },
      {
        field: 'alertSource',
        title: '预警来源',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '国家预警信息发布中心', value: '国家预警信息发布中心' }
          ],
          props: {
            placeholder: '请选择预警来源',
          },
          defaultValue: '国家预警信息发布中心'
        }
      },
      {
        field: 'alertArea',
        title: '影响区域',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '', value: '' }
          ],
          props: {
            placeholder: '请选择影响区域',
          },
        }
      },
      // 功能
      {
        span: 6,
        align: 'center',
        collapseNode: true,
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
              alertTitle: form.alertTitle,
              alertType: form.alertType,
              alertStatus: form.alertStatus,
              alertLevel: form.alertLevel,
              alertRuleId: form.alertRuleId,
              alertSource: form.alertSource,
              alertAreaId: form.alertAreaId,
            }
          }
          generateReleaseAlert().then(res => {
            // 调用方法
            getPageReleaseAlert(data).then(res => {
              const data = res.data
              resolve({
                records: data.records,
                total: data.total
              })
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
      title: '序号',
      type: 'seq',
      align: "center",
      width: 60
    },
    {
      field: 'alertTitle',
      title: '预警信息标题',
      align: "center",
      width: 150,
    },
    {
      field: 'alertAreaId',
      title: '影响区域',
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
      field: 'alertRuleId',
      title: '关联预警规则',
      align: "center",
      width: 180,
      formatter: ({ cellValue }) => {
        let res = ''
        alertRuleList.value.forEach((item: { value: any; label: any }) => {
          if (cellValue === item.value) {
            res = item.label;
          }
        })
        return res
      }
    },
    {
      field: 'triggerValue',
      title: '触发预警监测值',
      align: "center",
      width: 150,
    },
    {
      field: 'alertStatus',
      title: '预警状态',
      align: "center",
      width: 120,
      slots: {
        default: 'alertStatus',
      },
    },
    {
      field: 'alertType',
      title: '预警类型',
      align: "center",
      width: 120,
    },
    {
      field: 'alertLevel',
      title: '预警级别',
      align: "center",
      width: 120,
    },
    {
      field: 'alertSource',
      title: '预警来源',
      align: "center",
      width: 180,
    },
    {
      field: 'triggerTime',
      title: '预警触发时间',
      align: "center",
      width: 180,
    },
    {
      field: 'startTime',
      title: '预警开始时间',
      align: "center",
      width: 180,
    },
    {
      field: 'endTime',
      title: '预警结束时间',
      align: "center",
      width: 180,
    },
  ],
  checkboxConfig: {
    reserve: true,
    highlight: true,
    range: true
  },
})

const gridEvent: VxeGridListeners = {
}

onMounted(() => {
  const typeList = [
    { label: '天气预警', value: '天气预警' },
    { label: '环境预警', value: '环境预警' },
  ]
  const { formConfig } = gridOptions

  if (formConfig && formConfig.items) {
    const sexItem = formConfig.items[1]
    if (sexItem && sexItem.itemRender) {
      sexItem.itemRender.options = typeList
    }
  }
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  padding: 10px 0;
  color: #000;
}

.titleClass {
  font-size: 30px;
  font-weight: lighter;
  color: #000;
}

.main {
  line-height: 25px;
  text-indent: 2em;
  font-size: 16px;
}
</style>
