<template>
<div class="index">
    <router-link to="/project_add">
        <el-button type="primary" class="btn" >创建项目</el-button>
    </router-link>
    <router-link to="/project_import">
        <el-button type="primary" class="btn" >导入项目</el-button>
    </router-link>
</div>
</template>

<script>
    export default {
        methods: {
        }
    }
</script>

<style scoped>
.index {text-align: center;padding-top: 200px;}
.index .btn {margin: 0 10px;}
</style>
