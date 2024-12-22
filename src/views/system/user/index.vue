<template>
  <div style="overflow: hidden; width: 100%; height: 100%;">
    <vxe-grid ref='xGrid' v-bind="gridOptions">
      <template #toolbar_buttons>
        <vxe-button status="primary" icon="vxe-icon-add" @click="addData">新增</vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete" @click="deleteData">删除</vxe-button>
      </template>
      <template #operate="{ row }">
        <vxe-button status="info" icon="vxe-icon-edit" @click="editData(row)">编辑</vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete" @click="removeRow(row)">删除</vxe-button>
      </template>
    </vxe-grid>

    <el-dialog v-model="dialogFormVisible" :title=title width="500" align-center @closed="resetForm">
      <el-form ref="ruleFormRef" style="max-width: 500px" :model="userForm" :rules="rules" label-width="auto"
        status-icon>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="userForm.deptId" placeholder="请选择所属部门">
            <el-option label="数据监控中心" value="100" />
            <el-option label="用户中心" value="101" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="pwdDisabled" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入用户昵称（不输与用户名保持一致）" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" :disabled="pwdDisabled" class="pwd" placeholder="请输入密码"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio value="0">男</el-radio>
            <el-radio value="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="userForm.status" active-value="0" inactive-value="1" />
        </el-form-item>
        <div class="footer">
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确认
          </el-button>
          <el-button @click="closeDialog()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import type { VxeGridInstance, VxeGridProps } from 'vxe-table'
import { getPageUser, addUser, updateUser, deleteUser, batchDeleteUser } from '@/api/system/user'

const dialogFormVisible = ref(false)
const pwdDisabled = ref(false)
const title = ref('')

let operateType = ''

const ruleFormRef = ref<FormInstance>()

interface UserForm {
  deptId: string,
  username: string,
  nickname: string,
  password: string,
  phone: string,
  email: string,
  sex: string,
  status: string,
}

const userForm = reactive<UserForm>({
  deptId: '',
  username: '',
  nickname: '',
  password: '',
  phone: '',
  email: '',
  sex: '0',
  status: '0',
})

const resetForm = () => {
  userForm.deptId = ''
  userForm.username = ''
  userForm.nickname = ''
  userForm.password = ''
  userForm.phone = ''
  userForm.email = ''
  userForm.status = '0'
}

const rules = reactive<FormRules<UserForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  deptId: [
    { required: true, message: '请选择所属部门', trigger: 'change', },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  email: [
    { required: true, type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      if (operateType === 'add') {
        addUser(userForm).then(res => {
          dialogFormVisible.value = false
          if (xGrid.value) {
            xGrid.value.commitProxy('query')
          }
          ElMessage({
            message: '新增用户成功',
            type: 'success',
          })
        })
      } else if (operateType === 'update') {
        updateUser(userForm).then(res => {
          dialogFormVisible.value = false
          if (xGrid.value) {
            xGrid.value.commitProxy('query')
          }
          ElMessage({
            message: '更新用户成功',
            type: 'success',
          })
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const closeDialog = () => {
  dialogFormVisible.value = false
}

const addData = () => {
  title.value = '新增用户'
  operateType = 'add'
  dialogFormVisible.value = true
  pwdDisabled.value = false
  console.log('add')
}

const removeRow = (row: any) => {
  console.log(row)
  ElMessageBox.confirm(
    '此操作将删除所选用户记录，此操作不可逆，是否继续？',
    '删除',
    {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'success',
    }
  )
    .then(() => {
      console.log(row.userId);

      deleteUser(row.userId).then(res => {
        if (xGrid.value) {
          xGrid.value.commitProxy('query')
        }
        ElMessage({
          type: 'success',
          message: '删除用户成功！',
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '您取消了该操作',
      })
    })
}

const deleteData = () => {
  if (xGrid.value) {
    const rows = xGrid.value.getCheckboxRecords(true)
    if (rows && rows.length >= 1) {
      ElMessageBox.confirm(
        '此操作将删除所选用户记录，此操作不可逆，是否继续？',
        '删除',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'success',
        }
      )
        .then(() => {
          let userIds: any[] = []
          rows.forEach(item => {
            console.log(item);
            userIds.push(item.userId)
          })
          batchDeleteUser(userIds).then(res => {
            ElMessage({
              type: 'success',
              message: '删除所选用户成功！',
            })
            if (xGrid.value) {
              xGrid.value.commitProxy('query')
            }
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '您取消了该操作',
          })
        })
    } else {
      ElMessage({
        message: '请选择需要删除的用户记录',
        type: 'warning',
      })
    }
  }
}

const editData = (row: any) => {
  title.value = '编辑用户'
  operateType = 'update'
  dialogFormVisible.value = true
  pwdDisabled.value = true
  userForm.deptId = row.deptId
  userForm.username = row.username
  userForm.nickname = row.nickname
  userForm.password = row.password
  userForm.phone = row.phone
  userForm.email = row.email
  userForm.sex = row.sex
  userForm.status = row.status
}

const xGrid = ref<VxeGridInstance | null>(null);

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
        field: 'status',
        title: '用户状态',
        span: 6,
        itemRender: {
          name: '$select',
          options: [
            { label: '启用', value: '0' },
            { label: '停用', value: '1' },
          ],
          props: {
            placeholder: '请选择用户状态'
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
        field: 'deptId',
        title: '所在部门',
        span: 6,
        folding: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '数据监测中心', value: '100' },
            { label: '用户中心', value: '101' },
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
              username: form.username,
              sex: form.sex,
              status: form.status,
              phone: form.phone,
              email: form.email,
              deptId: form.deptId,
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
    {
      title: '操作',
      align: "center",
      width: 200,
      fixed: 'right',
      slots: {
        default: 'operate'
      }
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

<style lang="scss" scoped>
.footer {
  text-align: center;
}
</style>
