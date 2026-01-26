<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiRoleCreate } from '~/api/roles'

const router = useRouter()

const loading = ref(false)
const formRef = ref()
const form = reactive({
  roleCode: '',
  roleName: ''
})

const rules = {
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { max: 64, message: '最多 64 个字符', trigger: 'blur' }
  ],
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { max: 64, message: '最多 64 个字符', trigger: 'blur' }
  ]
}

const onSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    const data = await apiRoleCreate({
      roleCode: form.roleCode.trim(),
      roleName: form.roleName.trim()
    })
    ElMessage.success('创建成功')
    router.replace(`/admin/roles/${data.id}`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>新增角色</span>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width: 720px">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="form.roleCode" placeholder="roleCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="roleName" autocomplete="off" />
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
