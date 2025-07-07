<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      pageAuthId="users"
      :columns="columns"
      :requestApi="getUserList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add">New User</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
          v-if="BUTTONS.batchDelete"
        >
          Delete
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- Table operation -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef"></UserDrawer>
  </div>
</template>

<script setup lang="tsx" name="users">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/users/components/UserDrawer.vue";
import { ResList, User } from "@/api/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import {
  getUserList,
  postUserCreate,
  patchUserUpdate,
  deleteUsers
  //getUserEnum
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ResList<User.ResGetUserRecord>) => {
  return {
    list: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};
// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: Partial<ColumnProps>[] = [
  { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "name",
    label: "Name",
    // width: 130,
    sortable: true,
    search: { el: "input" }
  },
  {
    prop: "email",
    label: "Email",
    // width: 130,
    sortable: true,
    search: { el: "input" }
  },
  // {
  // 	prop: "created",
  // 	label: "Created",
  // 	width: 60,
  // 	// search: true,
  // 	// searchType: "text"
  // 	// searchProps: { disabled: true }
  // },
  // {
  //   prop: "created",
  //   label: "Created",
  //   // width: 100,
  //   sortable: true,
  //   search: true,
  //   searchType: "datetimerange",
  //   searchProps: {
  //     disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
  //   },
  //   searchInitParam: ["2022-08-30 00:00:00", "2022-08-20 23:59:59"]
  // },
  {
    prop: "operation",
    label: "Operation",
    width: 100,
    fixed: "right"
  }
];

// Batch delete components
const batchDelete = async (ids: string[]) => {
  await useHandleData(deleteUsers, { ids }, "Delete the selected component(s)");
  proTable.value.refresh();
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<User.ResGetUserRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postUserCreate : title === "Edit" ? patchUserUpdate : title === "Stock" ? patchUserUpdate : "",
    updateTable: proTable.value.refresh
  };
  drawerRef.value!.acceptParams(params);
};
</script>
