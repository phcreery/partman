<template>
  <div>
    <el-dialog v-model="drawerVisible" :title="drawerData.title" width="80%" draggable>
      <el-row :gutter="20" justify="space-between">
        <el-col :span="12">
          <p style="margin-top: 0">
            Merge <b>{{ leftComponent?.mpn }}</b> into <b>{{ rightComponent?.mpn }}</b>
          </p>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button @click="intelligentCheck">Refresh</el-button>
        </el-col>
      </el-row>
      <el-row v-for="(column, index) in mergeColumns" :key="index" :gutter="20">
        <el-col :span="4">
          <p style="display: inline-flex; align-items: center">{{ column.label }}</p>
        </el-col>
        <el-col :span="10">
          <el-checkbox
            v-model="column.checkedLeft"
            v-if="leftComponent![column.prop]"
            :label="0"
            border
            @change="column.checkLeft"
            style="height: auto"
          >
            <p style="white-space: normal">{{ leftComponent![column.prop] }}</p>
          </el-checkbox>
        </el-col>
        <el-col :span="10">
          <el-checkbox
            v-model="column.checkedRight"
            v-if="rightComponent![column.prop]"
            :label="1"
            border
            @change="column.checkRight"
            style="height: auto"
          >
            <p style="white-space: normal">{{ rightComponent![column.prop] }}</p>
          </el-checkbox>
        </el-col>
      </el-row>
      <ComponentDetails title="" :isView="true" :rowData="(mergedComponent as Component.ResGetComponentRecord)" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="drawerVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit"> Save </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="MergeComponentDrawer">
import { ref, reactive, Ref, toRefs, watch, inject, computed } from "vue";
import { Refresh, Plus, Search, Delete } from "@element-plus/icons-vue";
import { Column, ElMessage, FormInstance } from "element-plus";
import { Component } from "@/api/interface";
// import { nestedObjectAssign } from "@/utils/nestedObjectAssign";
import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";

interface DrawerProps {
  title: string;
  leftComponent?: Component.ResGetComponentRecord;
  rightComponent?: Component.ResGetComponentRecord;
  enumMap?: any;
  // apiUrl?: (params: any) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  title: ""
});

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
  drawerData.value = params;
  drawerVisible.value = true;

  console.log("enumMap", drawerData.value.enumMap);
  setLeftComponent(drawerData.value.leftComponent!);
  setRightComponent(drawerData.value.rightComponent!);
  console.log("mergedComponent", mergedComponent);
};

interface MergeColumnOptions {
  prop: keyof Component.ResGetComponentRecord;
  label: string;
  checkedLeft?: boolean;
  checkedRight?: boolean;
  checkLeft?: (e: Event) => void;
  checkRight?: (e: Event) => void;
  single?: boolean;
  required?: boolean;
}

const mergeColumnOptions: MergeColumnOptions[] = [
  { prop: "manufacturer", label: "Manufacturer" },
  // { prop: "mpn", label: "MPN", checkedLeft: false, checkedRight: true, single: true },
  { prop: "description", label: "Description" },
  { prop: "stock", label: "Stock", required: true },
  { prop: "comment", label: "Comment" },
  // { prop: "supplier", label: "Supplier"true, single: true },
  // { prop: "spn", label: "SPN"true, single: true },
  { prop: "category", label: "Category", single: true },
  { prop: "ipn", label: "IPN", single: true },
  { prop: "storage_location", label: "Storage Location", single: true },
  { prop: "footprint", label: "Footprint", single: true },
  { prop: "specs", label: "Specs", single: true }
  // { prop: "image", label: "Image", single: true }
];

// namespace Merger {
interface MergerStateProps {
  mergeColumns: MergeColumnOptions[];
  leftComponent: Component.ResGetComponentRecord | undefined;
  rightComponent: Component.ResGetComponentRecord | undefined;
}
// }

const useMerger = (mergeColumnOptions: MergeColumnOptions[]) => {
  const state = reactive<MergerStateProps>({
    mergeColumns: JSON.parse(JSON.stringify(mergeColumnOptions)), // []
    leftComponent: undefined,
    rightComponent: undefined
  });

  const setLeftComponent = (component: Component.ResGetComponentRecord) => {
    state.leftComponent = component;
    intelligentCheck();
  };

  const setRightComponent = (component: Component.ResGetComponentRecord) => {
    state.rightComponent = component;
    intelligentCheck();
  };

  const intelligentCheck = () => {
    state.mergeColumns.map((column: MergeColumnOptions) => {
      console.log("column", column, column.prop, state.leftComponent, state.leftComponent === undefined);
      if (column.prop === "stock") {
        // check both stock to add quantities together
        column.checkedLeft = true;
        column.checkedRight = true;
      } else if ((state.rightComponent && !state.leftComponent) || (state.leftComponent && !state.leftComponent[column.prop])) {
        // use second component value
        column.checkedLeft = false;
        column.checkedRight = true;
      } else if ((state.leftComponent && !state.rightComponent) || (state.rightComponent && !state.rightComponent[column.prop])) {
        // use first component value
        column.checkedLeft = true;
        column.checkedRight = false;
      } else {
        // use second component value
        column.checkedLeft = false;
        column.checkedRight = true;
      }
      column.checkLeft = (e: Event) => {
        column.single && e ? (column.checkedRight = false) : "";
        !e && column.required ? (column.checkedRight = true) : "";
      };
      column.checkRight = (e: Event) => {
        column.single && e ? (column.checkedLeft = false) : "";
        !e && column.required ? (column.checkedLeft = true) : "";
      };
    });
  };

  const mergedComponent = computed(() => {
    let mergedComponent: Partial<Component.ResGetComponentRecord> = {};
    mergedComponent.id = state.leftComponent?.id;
    for (const column of state.mergeColumns) {
      let leftValue = state.leftComponent![column.prop];
      let rightValue = state.rightComponent![column.prop];
      if (column.checkedLeft && column.checkedRight) {
        if (typeof leftValue === "string") {
          Object.assign(mergedComponent, {
            [column.prop]: leftValue + ", " + rightValue
          });
        } else if (typeof leftValue === "number") {
          Object.assign(mergedComponent, {
            [column.prop]: Number(leftValue) + Number(rightValue)
          });
        }
      } else if (column.checkedLeft) {
        Object.assign(mergedComponent, { [column.prop]: leftValue });
      } else if (column.checkedRight) {
        Object.assign(mergedComponent, { [column.prop]: rightValue });
      }
    }
    return mergedComponent;
  });

  return {
    ...toRefs(state),
    setLeftComponent,
    setRightComponent,
    intelligentCheck,
    mergedComponent
  };
};

const { mergeColumns, leftComponent, rightComponent, setLeftComponent, setRightComponent, intelligentCheck, mergedComponent } =
  useMerger(mergeColumnOptions);

// const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = async () => {
  try {
    await drawerData.value.apiUrl!(drawerData.value.rowData);
    ElMessage.success({ message: `${drawerData.value.title} component success!` });
    drawerData.value.updateTable!();
    drawerVisible.value = false;
  } catch (error) {
    console.error(error);
  }
};

const log = (e: any) => {
  console.log(e);
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss">
.el-row {
  margin-bottom: 12px;
}
</style>