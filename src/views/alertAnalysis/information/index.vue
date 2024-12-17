<template>
  <div>
    <vxe-toolbar>
      <template #buttons>
        <span style="font-size: 15px;">{{ dateRange }}</span>
      </template>
    </vxe-toolbar>
    <vxe-table :ref="xTable" round height="680" align="center" :row-config="{ isHover: true }"
      :cell-class-name="cellClassName" :data="tableData" class="alert-table" :expand-config="{}">
      <vxe-column type="seq" width="60" title="编号"></vxe-column>
      <vxe-column field="city" title="地区"></vxe-column>
      <vxe-column field="sort" title="类别" type="expand">
        <template #default="{ row }">
          <span>{{ row.sort }}</span>
        </template>
        <template #content="{ row, rowIndex }">
          <div class="expand-wrapper">
            <vxe-table border=none align="center" :show-header="false" :data="expandTableData"
              :row-class-name="rowClassName" class="alert-expand-table">
              <vxe-column type="seq" width="60"></vxe-column>
              <vxe-column field="name" title="Name"></vxe-column>
              <vxe-column field="name" title="Name"></vxe-column>
              <vxe-column field="name" title="Name"></vxe-column>
              <vxe-column field="name" title="Name"></vxe-column>
              <vxe-column field="sex" title="Sex"></vxe-column>
              <vxe-column field="age" title="Age"></vxe-column>
              <vxe-column field="address" title="Address" show-overflow></vxe-column>
            </vxe-table>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="total" title="总计"></vxe-column>
      <vxe-column field="red" title="红色预警">
        <template #header>
          <div style="background-color: #c63f34;" class="row-header">红</div>
        </template>
      </vxe-column>
      <vxe-column field="orange" title="橙色预警">
        <template #header>
          <div style="background-color: #f19e38;" class="row-header">橙</div>
        </template>
      </vxe-column>
      <vxe-column field="yellow" title="黄色预警">
        <template #header>
          <div style="background-color: #f6bd0e;" class="row-header">黄</div>
        </template>
      </vxe-column>
      <vxe-column field="blue" title="蓝色预警">
        <template #header>
          <div style="background-color: #4064f6;" class="row-header">蓝</div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { VxeButtonEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table'
import XEUtils from 'xe-utils'

const xTable = ref<VxeTableInstance>()

interface RowVO {
  city: string
  sort: string
  total: number
  red: number
  orange: number
  yellow: number
  blue: number
}

const tableData = ref<RowVO[]>([
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
  { city: '南昌市青山湖区', sort: '全部', total: 4, red: 1, orange: 1, yellow: 2, blue: 0 },
])

const expandTableData = ref([
  { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
  { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' }
])

const cellClassName: VxeTablePropTypes.CellClassName = ({ row, column }) => {
  if (column.field === 'red') {
    return 'col-red'
  }
  if (column.field === 'orange') {
    return 'col-orange'
  }
  if (column.field === 'yellow') {
    return 'col-yellow'
  }
  if (column.field === 'blue') {
    return 'col-blue'
  }
  return null
}

const rowClassName: VxeTablePropTypes.RowClassName = ({ rowIndex }) => {
  return 'col-grey'
}

const dateRange = '数据自2024-01-01至' + XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
</script>

<style lang="scss" scoped>
.expand-wrapper {
  background-color: #eeeeee;
  padding: 10px;
}

.row-header {
  width: 22px;
  margin: 0 auto;
  border-radius: 50%;
  color: #fff;
}
</style>
