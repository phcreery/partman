<template>
  <div>
    <el-dialog v-model="drawerVisible" :title="`${drawerData.title}`">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <el-form-item label="Old Stock Level">
          {{ drawerData.rowData!.stock }}
        </el-form-item>
        <el-form-item label="Stock" prop="stock">
          <el-input-number v-model="drawerData.addStock" />
        </el-form-item>
        <el-form-item label="New Stock Level" style="margin-bottom: 0">
          {{ drawerData.rowData!.stock + drawerData.addStock }}
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ComponentDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Component } from "@/api/interface";

const rules = reactive({
  stock: [{ required: true, message: "Please fill in the stock qty", trigger: "change" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  addStock: number;
  rowData?: Component.ResGetComponentRecord;
  apiUrl?: (params: any) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: "",
  addStock: 0
});

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
  drawerData.value = params;
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (!drawerData.value.rowData) return;
    try {
      drawerData.value.rowData.stock = drawerData.value.rowData?.stock! + drawerData.value.addStock;
      drawerData.value.addStock = 0;
      await drawerData.value.apiUrl!(drawerData.value.rowData);
      ElMessage.success({ message: `${drawerData.value.title} component success!` });
      drawerData.value.updateTable!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss"></style>
