<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions">
      <template #login_status="{ row }">
        <span><el-tag size='large'>在线</el-tag></span>
        <span style="margin-left: 5px;"><el-tag type="warning" size='large'
            v-if="userStore.user.userId === row.userId">本人</el-tag></span>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { VXETable, VxeGridInstance, VxeGridListeners, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'
import { getPageOnlineUser } from "@/api/user"
import useUserStore from "@/stores/user"

const userStore = useUserStore()

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
    keyField: 'userId',
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
        field: 'username',
        title: '用户账号',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入用户账号'
          }
        }
      },
      {
        field: 'deptName',
        title: '所在部门',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: {
            placeholder: '请选择所在部门'
          }
        }
      },
      {
        field: 'loginLocation',
        title: '登录地点',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入登录地点'
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
            }
          }
          console.log(data);
          // 调用方法
          getPageOnlineUser(data).then(res => {
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
      minWidth: 60
    },
    {
      field: 'username',
      title: '用户账号',
      align: "center",
      minWidth: 120,
    },
    {
      field: 'nickname',
      title: '用户昵称',
      align: "center",
      minWidth: 120,
    },
    {
      field: 'status',
      title: '登录状态',
      align: "center",
      minWidth: 120,
      slots: {
        default: 'login_status',
      },
    },
    {
      field: 'deptId',
      title: '所在部门',
      align: "center",
      minWidth: 150,
      formatter: ({ cellValue }) => {
        if (cellValue == '100') {
          return '基准站'
        } else {
          return '基本站'
        }
      }
    },
    {
      field: 'loginIp',
      title: '登录IP',
      align: "center",
      minWidth: 180,
    },
    // userId: 2, username: 'admin', nickname: '普通用户', deptName: '数据监测中心', loginIp: '192.168.102.123',
    // loginLocation: '江西省赣州市', loginTime: '2024-01-01 00:00:00'
    {
      field: 'loginLocation',
      title: '登录地点',
      align: "center",
      minWidth: 180,
    },
    {
      field: 'loginTime',
      title: '登录时间',
      align: "center",
      minWidth: 180,
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
    { label: '基准站', value: '基准站' },
    { label: '基本站', value: '基本站' },
  ]
  const { formConfig } = gridOptions

  if (formConfig && formConfig.items) {
    const sexItem = formConfig.items[1]
    if (sexItem && sexItem.itemRender) {
      sexItem.itemRender.options = sexList
    }
  }
})
</script>

<style lang="scss" scoped></style>
