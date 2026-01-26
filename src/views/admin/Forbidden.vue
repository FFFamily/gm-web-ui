<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <el-result
    icon="warning"
    title="403 无权限"
    sub-title="你没有访问该页面的权限。"
  >
    <template #extra>
      <el-button type="primary" @click="router.replace('/admin')">返回后台首页</el-button>
    </template>
  </el-result>
</template>

