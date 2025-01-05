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
      <el-form ref="ruleFormRef" style="max-width: 500px" :model="stationForm" :rules="rules" label-width="auto"
        status-icon>
        <el-form-item label="所在省份" prop="stationProvince">
          <el-select v-model="stationForm.stationProvince" placeholder="请选择所在省份" @change="changeProvince">
            <el-option v-for="item in provinces" :key="item.label" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="stationCity">
          <el-select v-model="stationForm.stationCity" placeholder="请先选择所在省份">
            <el-option v-for="item in stationCitys" :key="item.label" :label="item.label"
              :value="item.value + '#' + item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="站台名称" prop="stationName">
          <el-input v-model="stationForm.stationName" placeholder="请输入站台名称" />
        </el-form-item>
        <el-form-item label="站台类型" prop="stationType">
          <el-select v-model="stationForm.stationType" placeholder="请选择站台类型">
            <el-option label="基本站" value="基本站" />
            <el-option label="一般站" value="一般站" />
            <el-option label="基准站" value="基准站" />
          </el-select>
        </el-form-item>
        <el-form-item label="站台经度" prop="stationLongitude">
          <el-input-number v-model="stationForm.stationLongitude" :precision="6" :step="0.1" :max="99999" />
        </el-form-item>
        <el-form-item label="站台纬度" prop="stationLatitude">
          <el-input-number v-model="stationForm.stationLatitude" :precision="6" :step="0.1" :max="99999" />
        </el-form-item>
        <el-form-item label="站台高度" prop="stationHeight">
          <el-input-number v-model="stationForm.stationHeight" :precision="2" :step="0.1" :max="99999" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="stationForm.remark" :rows="2" type="textarea" placeholder="" />
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { VXETable, VxeGridInstance, VxeGridProps } from 'vxe-table'
import { provinceAndCityData } from 'element-china-area-data'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { addStation, batchDeleteStation, deleteStation, getPageStation, updateStation } from '@/api/weather/weatherStation';
import useUserStore from '@/stores/user';

const isAdmin = ref(false)

// 省市联动
const formData = reactive({
  stationProvince: '',
  stationCity: ''
})
console.log(provinceAndCityData)
const provinces = Object.keys(provinceAndCityData).map(key => ({
  value: provinceAndCityData[Number(key)].value,
  label: provinceAndCityData[Number(key)].label
}))
console.log(provinces)

interface DataItem {
  label: number,
  value: string,
}

const stationCitys = ref<DataItem[]>([]);

const changeProvince = () => {
  const selectedProvinceValue = stationForm.stationProvince
  console.log(selectedProvinceValue);

  if (selectedProvinceValue) {
    const selectedProvince = provinceAndCityData.find(province => province.label === selectedProvinceValue)
    if (selectedProvince && selectedProvince.children) {
      formData.stationCity = selectedProvince.label
      stationCitys.value = selectedProvince.children
    } else {
      stationCitys.value = []
    }
  } else {
    stationCitys.value = []
  }
}

const cities = ref<DataItem[]>([]);
const handleProvinceChange = ({ data, field }) => {
  const selectedProvinceValue = data[field]
  console.log('省份选择变化:', selectedProvinceValue);

  if (selectedProvinceValue) {
    const selectedProvince = provinceAndCityData.find(province => province.value === selectedProvinceValue)
    if (selectedProvince && selectedProvince.children) {
      formData.stationCity = selectedProvince.label
      cities.value = selectedProvince.children
    } else {
      cities.value = []
    }
  } else {
    cities.value = []
  }
  const { formConfig } = gridOptions
  if (formConfig && formConfig.items) {
    const stationTypeItem = formConfig.items[1]
    if (stationTypeItem && stationTypeItem.itemRender) {
      stationTypeItem.itemRender.options = cities.value
      console.log(stationTypeItem.itemRender.options);
    }
  }

}


const dialogFormVisible = ref(false)
const pwdDisabled = ref(false)
const title = ref('')

let operateType = ''

const ruleFormRef = ref<FormInstance>()

interface StationForm {
  stationNo: string,
  stationProvince: string,
  stationCity: string,
  stationName: string,
  stationType: string,
  stationLongitude: string,
  stationLatitude: string,
  stationHeight: string,
  remark: string,
}

const stationForm = reactive<StationForm>({
  stationNo: '',
  stationProvince: '',
  stationCity: '',
  stationName: '',
  stationType: '',
  stationLongitude: '',
  stationLatitude: '',
  stationHeight: '',
  remark: '',
})

const resetForm = () => {
  stationForm.stationNo = ''
  stationForm.stationProvince = ''
  stationForm.stationCity = ''
  stationForm.stationName = ''
  stationForm.stationType = ''
  stationForm.stationLongitude = ''
  stationForm.stationLatitude = ''
  stationForm.stationHeight = ''
  stationForm.remark = ''
}

const rules = reactive<FormRules<StationForm>>({
  stationProvince: [
    { required: true, message: '请选择所在省份', trigger: 'change', },
  ],
  stationCity: [
    { required: true, message: '请选择所在城市', trigger: 'change', },
  ],
  stationName: [
    { required: true, message: '请输入站台名称', trigger: 'blur' },
  ],
  stationType: [
    { required: true, message: '请选择站台类型', trigger: 'change', },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      const [no, city] = stationForm.stationCity.split('#');
      if (no && city) {
        let stationTypeCode = ''
        if (stationForm.stationType == '一般站') {
          stationTypeCode = '01'
        } else if (stationForm.stationType == '基本站') {
          stationTypeCode = '02'
        } else if (stationForm.stationType == '基准站') {
          stationTypeCode = '03'
        }
        stationForm.stationNo = no + stationTypeCode
        stationForm.stationCity = city
      }
      if (operateType === 'add') {
        addStation(stationForm).then(res => {
          dialogFormVisible.value = false
          if (xGrid.value) {
            xGrid.value.commitProxy('query')
          }
          ElMessage({
            message: '新增站点成功',
            type: 'success',
          })
        })
      } else if (operateType === 'update') {
        updateStation(stationForm).then(res => {
          dialogFormVisible.value = false
          if (xGrid.value) {
            xGrid.value.commitProxy('query')
          }
          ElMessage({
            message: '更新站点成功',
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
  title.value = '新增站点'
  operateType = 'add'
  dialogFormVisible.value = true
  pwdDisabled.value = false
  console.log('add')
}

const removeRow = (row: any) => {
  console.log(row)
  ElMessageBox.confirm(
    '此操作将删除所选站点记录，此操作不可逆，是否继续？',
    '删除',
    {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'success',
    }
  )
    .then(() => {
      console.log(row.stationNo);

      deleteStation(row.stationNo).then(res => {
        if (xGrid.value) {
          xGrid.value.commitProxy('query')
        }
        ElMessage({
          type: 'success',
          message: '删除站点成功！',
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
        '此操作将删除所选站点记录，此操作不可逆，是否继续？',
        '删除',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'success',
        }
      )
        .then(() => {
          let stationNos: any[] = []
          rows.forEach(item => {
            console.log(item);
            stationNos.push(item.stationNo)
          })
          batchDeleteStation(stationNos).then(res => {
            ElMessage({
              type: 'success',
              message: '删除所选站点成功！',
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
        message: '请选择需要删除的站点记录',
        type: 'warning',
      })
    }
  }
}

const editData = (row: any) => {
  title.value = '编辑站点'
  operateType = 'update'
  dialogFormVisible.value = true
  pwdDisabled.value = true
  stationForm.stationNo = row.stationNo
  stationForm.stationProvince = row.stationProvince
  stationForm.stationCity = row.stationCity
  stationForm.stationName = row.stationName
  stationForm.stationType = row.stationType
  stationForm.stationLongitude = row.stationLongitude
  stationForm.stationLatitude = row.stationLatitude
  stationForm.stationHeight = row.stationHeight
  stationForm.remark = row.remark
}

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
    keyField: 'stationNo',
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
        field: 'stationProvince',
        title: '所在省份',
        span: 6,
        itemRender: {
          name: '$select',
          options: provinces,
          props: {
            placeholder: '请选择所在省份',
          },
          defaultValue: '',
          events: {
            change: handleProvinceChange
          }
        },
      },
      {
        field: 'stationCity',
        title: '所在城市',
        span: 6,
        itemRender: {
          name: '$select',
          options: cities.value,
          props: {
            placeholder: '请先选择所在省份',
          }
        }
      },
      {
        field: 'stationType',
        title: '站点类型',
        span: 6,
        itemRender: {
          name: '$select',
          options: [],
          props: { placeholder: '请选择站点类型' },
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
      buttons: 'toolbar_buttons',
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
      query: ({ page, sorts, form }) => {
        return new Promise(resolve => {
          const queryParams: any = Object.assign({}, form)
          // 处理排序条件
          const firstSort = sorts[0]
          if (firstSort) {
            queryParams.sort = firstSort.field
            queryParams.order = firstSort.order
          }
          // 请求参数
          const selectedProvince = provinceAndCityData.find(province => province.value === form.stationProvince)
          const selectedCity = cities.value.find(province => province.value === form.stationCity)
          const data = {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            entity: {
              stationProvince: selectedProvince?.label,
              stationCity: selectedCity?.label,
              stationType: form.stationType,
            }
          }
          // 调用方法s
          getPageStation(data).then(res => {
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
      field: 'stationNo',
      title: '站点号',
      align: "center",
      width: 120,
    },
    {
      field: 'stationProvince',
      title: '所在省份',
      align: "center",
      width: 120,
    },
    {
      field: 'stationCity',
      title: '所在城市',
      align: "center",
      width: 120,
    },
    {
      field: 'stationName',
      title: '站点名称',
      align: "center",
      width: 120,
    },
    {
      field: 'stationType',
      title: '站点类型',
      align: "center",
      width: 120,
    },
    {
      field: 'stationLongitude',
      title: '站点经度',
      align: "center",
      width: 150,
    },
    {
      field: 'stationLatitude',
      title: '站点纬度',
      align: "center",
      width: 150,
    },
    {
      field: 'stationHeight',
      title: '站点高度',
      align: "center",
      width: 150,
    },
    {
      field: 'remark',
      title: '备注',
      align: "center",
      width: 200,
    },
    {
      title: '操作',
      align: "center",
      width: 200,
      fixed: 'right',
      visible: isAdmin.value,
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

  const stationTypeList = [
    { label: '基准站', value: '基准站' },
    { label: '基本站', value: '基本站' },
    { label: '一般站', value: '一般站' },
  ]

  const { formConfig, columns } = gridOptions
  if (formConfig && formConfig.items) {
    const stationTypeItem = formConfig.items[2]
    if (stationTypeItem && stationTypeItem.itemRender) {
      stationTypeItem.itemRender.options = stationTypeList
    }
  }
})
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
}
</style>
