<template>
  <div class="card content-box">
    <el-tabs v-model="activeTabName" style="width: 100%">
      <el-tab-pane label="Server" name="server">
        <div v-if="health.data.code === 200">
          <el-result icon="success" :title="health.data.message" :sub-title="'Code: ' + health.data.code">
            <template #extra>
              <el-button type="primary" @click="gotoAdminUI">Pocketbase Admin UI</el-button>
            </template>
          </el-result>
        </div>
        <div v-else>
          <el-result icon="error" :title="health.data.message" :sub-title="'Code: ' + health.data.code">
            <template #extra>
              <el-button type="primary" @click="gotoAdminUI">Pocketbase Admin UI</el-button>
            </template>
          </el-result>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Octopart" name="octopart">
        <el-form :model="octopartFormData" label-width="140px" style="width: 100%">
          <el-form-item label="Octopart ID :">
            <el-input v-model="octopartFormData.id" clearable />
          </el-form-item>
          <el-form-item label="Octopart Secret :">
            <el-input v-model="octopartFormData.secret" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Save</el-button>
            <el-button @click="getOctopartFormData">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- <el-tab-pane label="Database" name="database"> DB {{ backups }} </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup lang="tsx" name="generalSettings">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
// import { useAuthButtons } from "@/hooks/useAuthButtons";
import { getConfig, patchConfigUpdate, getHealth } from "@/api/modules/components";
import { APIdata, Health } from "@/api/interface/index";

const activeTabName = ref("server");
// const backups = ref<APIdata<Backup.ResGetBackupRecord[]>>({});
const health = ref<APIdata<Health.ResHealth>>({ data: { message: "", code: 0 } });

// do not use same name with ref
const octopartFormData = reactive({
  id: "",
  secret: ""
});

// Page button permission
// const { BUTTONS } = useAuthButtons();

const getOctopartFormData = async () => {
  try {
    let { data } = await getConfig({ category: "octopart" });
    Object.assign(octopartFormData, data);
  } catch (error) {
    console.error(error);
  }
};

const onSubmit = async () => {
  let data = await patchConfigUpdate({ category: "octopart", value: octopartFormData });
  data !== undefined
    ? ElMessage.success("Save Success")
    : ElMessage.error(`Error Saving Settings : octopart - ${JSON.stringify(octopartFormData)}`);
};

const gotoAdminUI = () => {
  window.open(window.location.host + "/_/", "_blank");
};

onMounted(async () => {
  console.log("mounted");
  // backups.value = await getBackupsList();
  health.value = await getHealth();
});

getOctopartFormData();
</script>
