<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRoleList } from '~/api/roles'
import { apiUserCreate } from '~/api/users'

const router = useRouter()

const loading = ref(false)
const roleOptionsLoading = ref(false)
const roleOptions = ref([])

const formRef = ref()
const form = reactive({
  username: '',
  displayName: '',
  password: '',
  enabled: true,
  roleCodes: []
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 64, message: '用户名最多 64 个字符', trigger: 'blur' }
  ],
  displayName: [
    { required: true, message: '请输入显示名', trigger: 'blur' },
    { max: 64, message: '显示名最多 64 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 8, message: '密码至少 8 位', trigger: 'blur' }
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

const onSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    const data = await apiUserCreate({
      username: form.username.trim(),
      displayName: form.displayName.trim(),
      password: form.password,
      enabled: form.enabled,
      roleCodes: form.roleCodes
    })
    ElMessage.success('创建成功')
    router.replace(`/admin/users/${data.id}`)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRoles)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>新增用户</span>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width: 720px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="显示名" prop="displayName">
        <el-input v-model="form.displayName" placeholder="displayName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="初始密码" prop="password">
        <el-input v-model="form.password" type="password" show-password autocomplete="new-password" />
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
