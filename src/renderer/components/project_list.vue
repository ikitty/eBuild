<template>
<div class="project_add">
    <div class="row">
        <p class="row_hd">模版：</p>
        <div class="row_bd">
            <select name="" ><option>官网模板</option></select>
        </div>
    </div>
    <div class="row">
        <p class="row_hd">名称：</p>
        <div class="row_bd">
            <input type="text">
        </div>
    </div>
    <div class="row">
        <p class="row_hd">路径：</p>
        <div class="row_bd">
            <input type="text">
        </div>
    </div>
    <div class="row">
        <div class="row_btn">
            <span class="btn">create</span>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        methods: {
        }
    }
</script>

<style scoped>
    .project_add {width: 500px;margin: 0 auto;padding: 20px 0; }
    .btn {display: inline-block;padding: 5px 10px; background: #39f;color: #fff;}
</style>
