<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRoleList } from '~/api/roles'
import { apiUserDetail, apiUserUpdate } from '~/api/users'

const route = useRoute()
const router = useRouter()

const userId = computed(() => route.params.id)

const loading = ref(false)
const roleOptionsLoading = ref(false)
const roleOptions = ref([])

const formRef = ref()
const form = reactive({
  username: '',
  displayName: '',
  enabled: true,
  roleCodes: []
})

const rules = {
  displayName: [
    { required: true, message: '请输入显示名', trigger: 'blur' },
    { max: 64, message: '显示名最多 64 个字符', trigger: 'blur' }
  ],
  enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const fetchRoles = async () => {
  roleOptionsLoading.value = true
  try {
    const data = await apiRoleList({ page: 1, size: 200 })
    roleOptions.value = data?.records || []
  } finally {
    roleOptionsLoading.value = false
  }
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const data = await apiUserDetail(userId.value)
    form.username = data.username || ''
    form.displayName = data.displayName || ''
    form.enabled = Boolean(data.enabled)
    form.roleCodes = data.roleCodes || []
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    await apiUserUpdate(userId.value, {
      displayName: form.displayName.trim(),
      enabled: form.enabled,
      roleCodes: form.roleCodes
    })
    ElMessage.success('保存成功')
    router.replace(`/admin/users/${userId.value}`)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchRoles(), fetchDetail()])
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>编辑用户</span>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="110px" style="max-width: 720px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item label="显示名" prop="displayName">
        <el-input v-model="form.displayName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="启用" prop="enabled">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="角色" prop="roleCodes">
        <el-select
          v-model="form.roleCodes"
          multiple
          filterable
          collapse-tags
          collapse-tags-tooltip
          :loading="roleOptionsLoading"
          placeholder="可选"
          style="width: 100%"
        >
          <el-option v-for="r in roleOptions" :key="r.id" :label="`${r.roleName} (${r.roleCode})`" :value="r.roleCode" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>
