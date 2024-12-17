<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions">
      <template #menu_status="{ row }">
        <el-tag size='large'>正常</el-tag>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { VXETable, VxeGridInstance, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'
import { getPageMenu } from "@/api/menu"

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
    keyField: 'menuId',
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
        field: 'menuName',
        title: '菜单名称',
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入菜单名称'
          }
        }
      },
      {
        field: 'menuType',
        title: '菜单类型',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: { placeholder: '请选择菜单类型' },
        }
      },
      {
        field: 'visible',
        title: '是否可见',
        span: 6,
        itemRender: {
          name: '$select',
          options: [
            { label: '是', value: '0' },
            { label: '否', value: '1' },
          ],
          props: { placeholder: '请选择是否可见' },
        }
      },
      {
        field: 'status',
        title: '菜单状态',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '正常', value: '0' },
            { label: '停用', value: '1' },
          ],
          props: { placeholder: '请选择菜单状态' },
        }
      },
      {
        field: 'path',
        title: '路由地址',
        folding: true,
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入路由地址'
          }
        }
      },
      {
        field: 'component',
        title: '组件路径',
        folding: true,
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入组件路径'
          }
        }
      },
      {
        field: 'perms',
        title: '权限标识',
        folding: true,
        span: 6,
        itemRender: {
          name: '$input',
          props: {
            placeholder: '请输入权限标识'
          }
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
              menuName: form.menuName,
              menuType: form.menuType,
              visible: form.visible,
            }
          }
          // 调用方法
          getPageMenu(data).then(res => {
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
      field: 'menuId',
      title: '菜单编号',
      align: "center",
      width: 120,
    },
    {
      field: 'menuName',
      title: '菜单名称',
      align: "center",
      width: 150,
    },
    {
      field: 'parentId',
      title: '父菜单编号',
      align: "center",
      width: 120,
    },
    {
      field: 'orderNum',
      title: '显示顺序',
      align: "center",
      width: 120,
    },
    {
      field: 'path',
      title: '路由地址',
      align: "center",
      width: 200,
    },
    {
      field: 'component',
      title: '组件路径',
      align: "center",
      width: 250,
    },
    {
      field: 'menuType',
      title: '菜单类型',
      align: "center",
      width: 120,
      formatter: ({ cellValue }) => {
        if (cellValue === '0') {
          return '目录'
        }
        if (cellValue === '1') {
          return '菜单'
        }
        return '按钮'
      }
    },
    {
      field: 'visible',
      title: '是否可见',
      align: "center",
      width: 120,
      formatter: ({ cellValue }) => {
        if (cellValue === '0') {
          return '显示'
        } else {
          return '隐藏'
        }
      }
    },
    {
      field: 'status',
      title: '菜单状态',
      align: "center",
      width: 120,
      slots: {
        default: 'menu_status',
      },
    },
    {
      field: 'perms',
      title: '权限标识',
      align: "center",
      width: 200,
    },
    {
      field: 'icon',
      title: '菜单图标',
      align: "center",
      width: 120,
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
    // menuId: '120', menuName: '预警统计分析', parentId: '1', orderNum: '0', path: '/weather-foreast',
    // component: '/display/weatherForeast/index', menuType: '2', visible: '0', perms: 'display:weather',
    // icon: 'Display',  createBy: 'admin', createTime: '2024-01-01 00:00:00',
    // updateBy: 'admin', updateTime: '2024-01-01 00:00:00',
  ],
  checkboxConfig: {
    reserve: true,
    highlight: true,
    range: true
  },
})

onMounted(() => {
  const menuTypeList = [
    { label: '目录', value: '0' },
    { label: '菜单', value: '1' },
  ]
  const { formConfig } = gridOptions

  if (formConfig && formConfig.items) {
    const sexItem = formConfig.items[1]
    if (sexItem && sexItem.itemRender) {
      sexItem.itemRender.options = menuTypeList
    }
  }
})
</script>

<style lang="scss" scoped></style>
