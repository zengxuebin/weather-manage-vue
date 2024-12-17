<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions"></vxe-grid>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { VXETable, VxeGridInstance, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'
import { getPageUser } from "@/api/user"

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
        field: 'sex',
        title: '用户性别',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: { placeholder: '请选择用户性别' },
        }
      },
      {
        field: 'nickname',
        title: '用户昵称',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入用户昵称'
          }
        }
      },
      {
        field: 'phone',
        title: '手机号码',
        span: 6,
        folding: true,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入手机号码'
          }
        }
      },
      {
        field: 'email',
        title: '电子邮箱',
        span: 6,
        folding: true,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入电子邮箱'
          }
        }
      },
      {
        field: 'deptName',
        title: '所在部门',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '数据监测中心', value: '数据监测中心' },
            { label: '用户中心', value: '用户中心' },
          ],
          props: {
            placeholder: '请选择所在部门'
          }
        }
      },
      {
        span: 6,
        folding: true,
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
    buttons: [
      {
        status: 'primary',
        name: '新增',
        icon: 'vxe-icon-add'
      },
      {
        status: 'primary',
        name: '编辑',
        icon: 'vxe-icon-edit'
      },
      // 删除选中行；会自动触发 ajax.delete 方法
      {
        code: 'delete',
        status: 'danger',
        name: '删除',
        icon: 'vxe-icon-delete'
      },
    ],
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

          console.log(page);

          // 处理排序条件
          const firstSort = sorts[0]
          if (firstSort) {
            queryParams.sort = firstSort.field
            queryParams.order = firstSort.order
          }
          // 请求参数
          const data = {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            entity: {
            }
          }
          console.log(data);
          
          // 调用方法
          getPageUser(data).then(res => {
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
      fixed: 'left',
    },
    {
      type: 'seq',
      title: '序号',
      align: "center",
      width: 60
    },
    {
      field: 'username',
      title: '用户账号',
      align: "center",
      width: 120,
    },
    {
      field: 'nickname',
      title: '用户昵称',
      align: "center",
      width: 150,
    },
    {
      field: 'password',
      title: '用户密码',
      align: "center",
      width: 150,
    },
    {
      field: 'phone',
      title: '手机号码',
      align: "center",
      width: 150,
    },
    {
      field: 'email',
      title: '电子邮箱',
      align: "center",
      width: 180,
    },
    {
      field: 'deptId',
      title: '所在部门',
      align: "center",
      width: 150,
      formatter: ({ cellValue }) => {
        if (cellValue == '100') {
          return '数据监测中心'
        } else {
          return '用户中心'
        }
      }
    },
    {
      field: 'sex',
      title: '性别',
      align: "center",
      width: 80,
      formatter: ({ cellValue }) => {
        if (cellValue === '0') {
          return '男'
        }
        if (cellValue === '1') {
          return '女'
        }
        return '未知'
      }
    },
    {
      field: 'createBy',
      title: '创建者',
      align: "center",
      width: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      align: "center",
      width: 180,
    },
    {
      field: 'updateBy',
      title: '更新者',
      align: "center",
      width: 120,
    },
    {
      field: 'updateTime',
      title: '更新时间',
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

onMounted(() => {
  const sexList = [
    { label: '男', value: '0' },
    { label: '女', value: '1' },
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
