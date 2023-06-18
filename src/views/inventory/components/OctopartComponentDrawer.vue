<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Octopart Component`">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="80px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <el-form-item label="MPN" prop="mpn">
          <div class="form-item-with-buttons">
            <el-space>
              <el-input v-model="drawerData.rowData!.mpn" placeholder="Please fill in the component name" clearable></el-input>
              <el-button-group>
                <el-button :icon="Search" @click="searchOctopart" />
                <el-button :icon="TopRight" @click="openOctopartSearch" />
              </el-button-group>
            </el-space>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
      </template>
      <el-table :data="searchResults" :border="true" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <!-- {{ props.row }} -->
            <div style="margin: 4%">
              <h2>{{ props.row.part.manufacturer.name }} {{ props.row.part.mpn }}</h2>
              <el-descriptions title="Summary" :column="1" border direction="vertical">
                <template #extra>
                  <el-button :icon="Link" @click="openOctopart(props.row.part)">View</el-button>
                  <el-button :icon="Magnet" type="primary" @click="handleSubmit(props.row.part)">Import</el-button>
                </template>
                <el-descriptions-item>
                  <template #label>
                    <div>Description</div>
                  </template>
                  {{ props.row.part.shortDescription }}
                </el-descriptions-item>
                <el-descriptions-item v-if="props.row.part.category">
                  <template #label>
                    <div>Category</div>
                  </template>
                  {{ props.row.part.category.name }} ({{ props.row.part.category.path }})
                </el-descriptions-item>
              </el-descriptions>

              <el-image
                :src="
                  props.row.part.bestImage && props.row.part.bestImage.url
                    ? props.row.part.bestImage.url
                    : props.row.part.images && props.row.part.images.length > 0 && props.row.part.images[0].url
                    ? props.row.part.images[0].url
                    : undefined
                "
                :zoom-rate="1.2"
                fit="cover"
              ></el-image>

              <h3>Attributes</h3>
              <el-table :data="props.row.part.specs" :border="true">
                <el-table-column label="Attribute" prop="attribute.name" />
                <el-table-column label="Value" prop="value" />
                <el-table-column label="Units" prop="units" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="MPN" prop="part.mpn" width="140" />
        <el-table-column label="Description" prop="part.shortDescription" />
      </el-table>
      <!-- {{ searchResults }} -->
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, Ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Search, Link, TopRight, Magnet } from "@element-plus/icons-vue";
import { Component } from "@/api/interface";
// import { getFootprintsEnum, getComponentStorageLocationEnum, getComponentCategoryEnumTree } from "@/api/modules/components";
import { SupPartResultSet, SupPart } from "@/api/interface/octopart";
import { getPartListByMPN } from "@/api/modules/octopart";

const rules = reactive({
  mpn: [{ required: true, message: "Please input the MPN", trigger: "change" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: Component.ResGetComponentRecord;
  apiUrl?: (params: Partial<Component.ResGetComponentRecord>) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: ""
});

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
  drawerData.value = params;
  drawerVisible.value = true;
  searchResults.value = [];
  // Don't search if initial MPN form item is empty
  // if (params.rowData?.mpn && params.rowData?.mpn !== "")
  searchOctopart();
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = (part: SupPart) => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let component: Partial<Component.ResGetComponentRecord> = {
        mpn: part.mpn,
        manufacturer: part.manufacturer.name,
        specs: part.specs,
        description: part.shortDescription
      };
      await drawerData.value.apiUrl!(component);
      ElMessage.success({ message: `${drawerData.value.title} component success!` });
      drawerData.value.updateTable!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
      ElMessage.error(String(error));
    }
  });
};

const openOctopart = (part: SupPart) => {
  console.log("opening", part.octopartUrl);
  window.open(part.octopartUrl, "_blank");
};

const openOctopartSearch = () => {
  console.log("opening", "https://octopart.com/search?q=" + drawerData.value.rowData?.mpn);
  window.open("https://octopart.com/search?q=" + drawerData.value.rowData?.mpn, "_blank");
};

const searchResults: Ref<SupPartResultSet["results"]> = ref([]);
const searchOctopart = async () => {
  searchResults.value = (await getPartListByMPN(drawerData.value.rowData?.mpn || "")).results;
};

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
  if (openValue) {
  }
});

defineExpose({
  acceptParams
});
</script>

<style lang="scss"></style>
