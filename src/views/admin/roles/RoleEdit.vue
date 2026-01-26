<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRoleDetail, apiRoleUpdate } from '~/api/roles'

const route = useRoute()
const router = useRouter()
const roleId = computed(() => route.params.id)

const loading = ref(false)
const formRef = ref()
const form = reactive({
  roleCode: '',
  roleName: ''
})

const rules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { max: 64, message: '最多 64 个字符', trigger: 'blur' }
  ]
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const data = await apiRoleDetail(roleId.value)
    form.roleCode = data.roleCode || ''
    form.roleName = data.roleName || ''
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    await apiRoleUpdate(roleId.value, { roleName: form.roleName.trim() })
    ElMessage.success('保存成功')
    router.replace(`/admin/roles/${roleId.value}`)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)
</script>

<template>
  <el-card shadow="never" v-loading="loading">
    <template #header>
      <div class="page-header">
        <span>编辑角色</span>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width: 720px">
      <el-form-item label="角色编码">
        <el-input v-model="form.roleCode" disabled />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" autocomplete="off" />
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
