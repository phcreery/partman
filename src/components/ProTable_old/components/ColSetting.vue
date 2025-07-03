<template>
  <!-- Column display settings -->
  <el-drawer title="Column settings" v-model="drawerVisible" size="500px">
    <div class="table" ref="colTableRef">
      <el-table :data="colSetting" :border="true">
        <el-table-column prop="label" label="Column" :align="'center'" />
        <el-table-column prop="name" label="Visibility" v-slot="scope" :align="'center'">
          <el-switch v-model="scope.row.isShow"></el-switch>
        </el-table-column>
        <template #empty>
          <div class="table-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>No data</div>
          </div>
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="colSetting">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
defineProps<{ colSetting: ColumnProps[] }>();
const drawerVisible = ref<boolean>(false);
// Open column settings
const openColSetting = () => {
  drawerVisible.value = true;
};
defineExpose({
  openColSetting
});
</script>

<style scoped lang="scss">
.cursor-move {
  cursor: move;
}
</style>
