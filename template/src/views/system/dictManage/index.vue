<template>
  <div class="table-box">
    <ProTable ref="proTable" v-bind="config" @drag-sort="sortTable">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增字典</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加字典</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">
          导出字典数据
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteDict(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="importRef" />
  </div>
</template>
<script setup lang="tsx">
defineOptions({
  name: 'DictManage',
})
import { getConfig } from './config'
import ProTable from '@/components/ProTable/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import UserDrawer from '@/views/proTable/components/UserDrawer.vue'
import { CirclePlus, Delete, Download, Upload, EditPen } from '@element-plus/icons-vue'
import type { Dict } from '@/api/modules/dict'
import { ref } from 'vue'
import DictAPI from '@/api/modules/dict'

const drawerRef = ref()
const importRef = ref()
const proTable = ref()

const sortTable = () => {}
// eslint-disable-next-line no-unused-vars
const batchDelete = (ids: string[]) => {}
const openDrawer = (title: string, row: Partial<Dict> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? DictAPI.add : title === '编辑' ? DictAPI.edit : undefined,
    getTableList: proTable.value?.getTableList,
  }
  drawerRef.value?.acceptParams(params)
}
const downloadFile = () => {}
const batchAdd = () => {}
// eslint-disable-next-line no-unused-vars
const deleteDict = (item: Dict) => {}

const config = getConfig({
  openDrawer,
  deleteDict,
})
</script>
