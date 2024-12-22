<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions" v-on="gridEvent">
      <template #cache_status="{ row }">
        <el-tag size='large'>正常</el-tag>
      </template>
    </vxe-grid>
    <vxe-modal v-model="dictDataModal.visible" width="60%" maskClosable>
      <template #title>
        <span>字典数据</span>
      </template>
      <template #default>
        <vxe-table show-overflow height="530" :sync-resize="dictDataModal.visible" :data="dictDataModal.tableData"
          :row-config="{ isHover: true }">
          <!-- { dictCode: 1, dictLabel: '男', dictValue: '0', orderNum: '1', status: '0', isDefault: '0' }, -->
          <vxe-column field="dictCode" title="字典编码" minWidth="80" align="center"></vxe-column>
          <vxe-column field="dictLabel" title="字典标签" minWidth="120" align="center"></vxe-column>
          <vxe-column field="dictValue" title="字典键值" minWidth="120" align="center"></vxe-column>
          <vxe-column field="orderNum" title="字典排序" minWidth="120" align="center"></vxe-column>
          <vxe-column field="status" title="字典状态" minWidth="120" align="center">
            <template #default="{ row }">
              <el-tag size='large'>正常</el-tag>
            </template>
          </vxe-column>
          <vxe-column field="isDefault" title="是否默认" minWidth="120" align="center">
            <template #default="{ row }">
              <el-tag size='large' v-if="row.isDefault === 'Y'">是</el-tag>
              <el-tag size='large' type="warning" v-else>否</el-tag>
            </template>
          </vxe-column>
        </vxe-table>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { VxeGridInstance, VxeGridListeners, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'
import { getPageDict, getDictDataListByDictType } from "@/api/dict"

const xGrid = ref<VxeGridInstance>()

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
    keyField: 'dictId',
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
  cellStyle({ row, column }) {
    if (column.field === 'dictType') {
      return {
        color: '#00796a',
      }
    }
  },
  formConfig: {
    titleAlign: 'right',
    //是否显示标题冒号
    titleColon: true,
    // 标题内容过长时显示为省略号
    titleOverflow: true,
    items: [
      {
        field: 'dictName',
        title: '字典名称',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入字典名称'
          }
        }
      },
      {
        field: 'status',
        title: '字典状态',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: {
            placeholder: '请选择字典状态'
          }
        }
      },
      {
        field: 'dictType',
        title: '字典类型',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入字典类型'
          }
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
              dictName: form.dictName,
              status: form.status,
              dictType: form.dictType,
            }
          }
          console.log(data);
          // 调用方法
          getPageDict(data).then(res => {
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
      title: '序号',
      type: 'seq',
      align: "center",
      width: 60
    },
    {
      field: 'dictName',
      title: '字典名称',
      align: "center",
      width: 130,
    },
    {
      field: 'dictType',
      title: '字典类型',
      align: "center",
      width: 200,
      className: 'cell-click',
    },
    {
      field: 'status',
      title: '字典状态',
      align: "center",
      width: 150,
      slots: {
        default: 'cache_status',
      },
    },
    {
      field: 'remark',
      title: '备注',
      align: "center",
      width: 250,
    },
    {
      field: 'createTime',
      title: '创建时间',
      align: "center",
      width: 200,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      align: "center",
      width: 200,
    },
  ],
  checkboxConfig: {
    reserve: true,
    highlight: true,
    range: true
  },
})

const gridEvent: VxeGridListeners = {
  cellClick({ row, column }) {
    console.log(row)
    console.log(column)
    if (column.field == "dictType") {
      console.log('打开对话框')
      getDictDataListByDictType(row.dictType).then(res => {
        dictDataModal.tableData = res.data
        dictDataModal.visible = true
      })
    }
  },
}

const dictDataModal = reactive({
  visible: false,
  tableData: [],
})

onMounted(() => {
  const statusList = [
    { label: '正常', value: '0' },
    { label: '停用', value: '1' },
  ]
  const { formConfig } = gridOptions

  if (formConfig && formConfig.items) {
    const sexItem = formConfig.items[1]
    if (sexItem && sexItem.itemRender) {
      sexItem.itemRender.options = statusList
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
