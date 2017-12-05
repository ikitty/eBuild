<template>
<div class="index">
    <router-link to="/project_add">
        <el-button type="primary" class="btn" >创建项目</el-button>
    </router-link>
    <span class="btn_apply" >
        <input type="file" @change="applyProject($event)" webkitdirectory multiple>
        关联项目
    </span>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
    created(){
            
    }
    ,methods: {
        ...mapActions(['addTask'])

        ,applyProject(e){
            let files = e.target.files
            if (files[0]) {
                let D = {name: files[0].name, path: files[0].path} 
                this.addTask(D)
            }
        }
    }
}
</script>

<style scoped>
.index {text-align: center;padding-top: 200px;}
.index .btn {margin: 0 10px;}

.btn_apply {position: relative; display: inline-block;width: 100px;height: 35px;background: #39f;text-align: center;line-height: 35px;border-radius: 3px;color: #fff}
.btn_apply input {position: absolute;top:0;left: 0;width: 100%;height: 100%;opacity: 0;overflow: hidden;cursor: pointer;}
</style>
