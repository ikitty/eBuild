<template>
<div class="project_add">
    <div class="row">
        <p class="row_hd">模版：</p>
        <div class="row_bd">
            <select name="" ><option>官网模板</option></select>
        </div>
    </div>
    <div class="row">
        <p class="row_hd">名称 (请输入项目名称，如a20171013xycq)</p>
        <div class="row_bd">
            <input type="text" v-model="projname">
        </div>
    </div>
    <div class="row">
        <p class="row_hd">路径：</p>
        <div class="row_bd">
            <input type="text" v-model="projpath">
        </div>
    </div>
    <div class="row">
        <div class="row_btn">
            <span class="btn" @click="createProj">创建项目</span>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        data(){
            return {
                projname: '',
                projpath: ''
            }
        }
        ,methods: {
            createProj() {
                let projData = {name: this.projname, path: this.projpath}
                let store = window.localStorage ; 
                store.setItem('eBuild', JSON.stringify(projData))
                console.log('clicked', JSON.stringify(projData) )
            }
        }
    }
</script>

<style scoped>
    .project_add {width: 500px;margin: 0 auto;padding: 20px 0; }
    .project_add .row_hd {color: #666;padding: 8px 0;}
    .project_add .row select,
    .project_add .row input {padding: 5px;border:1px solid #bbb;border-radius: 2px; }
    .project_add .row input {width: 300px;}
    .project_add .row_btn {padding: 20px 0 0;}

    .btn {display: inline-block;padding: 8px 15px; background: #39f;color: #fff;}
</style>

