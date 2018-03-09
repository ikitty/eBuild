<template>
<div class="index">
    <router-link to="/project_add">
        <el-button type="primary" >创建项目</el-button>
    </router-link>
    <span class="btn_apply btn" >
        <input type="file" @change="applyProject($event)" webkitdirectory multiple>
        关联项目
    </span>
    <span class="btn_apply" >
        <input type="file" @change="serveProject($event)" webkitdirectory multiple>
        快速预览项目
    </span>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import path from 'path'
import fs from 'fs'
import gulp from 'gulp'
import del from 'del'

export default {
    created(){
            
    }
    ,computed: {
        ...mapGetters(['task_list'])
    }
    ,methods: {
        ...mapActions(['addTask'])

        ,applyProject(e){
            let files = e.target.files
            if (!files[0]) {
                return
            }
            let D = {name: files[0].name, path: files[0].path} 

            //check taskExist
            let inTaskList = (value,key)=>{
                return value.name == D.name 
            }
            if (this.task_list.some(inTaskList)){
                this.$alert('已有同名任务', '提示' );
                return
            }

            //check has srcDir
            let srcPath = path.join(D.path, './src')
            if (!fs.existsSync(srcPath)) {
                fs.mkdirSync(srcPath)
                let srcFiles = [
                    path.join(D.path, './**/*'),
                    path.join(`!${D.path}`, './src'),
                    path.join(`!${D.path}`, './src/**/*')
                ]

                gulp.src(srcFiles)
                    .pipe(gulp.dest(srcPath))
                    .on('end', ()=>{
                        console.log('copy file ', 1);
                        del(srcFiles, {force: true}).then(function () {
                            console.log('rm file', 1);
                        });
                        this.addTask(D)
                        this.$router.push({name: 'projectList'})
                    });

            }else {
                this.addTask(D)
                this.$router.push({name: 'projectList'})
            }
        }

        ,serveProject(e){
            let files = e.target.files
            if (!files[0]) { return }
            let D = {name: files[0].name, path: files[0].path, isPreview: 1} 

            //check taskExist
            let inTaskList = (value,key)=>{
                return value.name == D.name 
            }
            if (this.task_list.some(inTaskList)){
                this.$alert('已有同名任务', '提示' );
                return
            }

            this.addTask(D)
            this.$router.push({name: 'projectList'})
        }
    }
}
</script>

<style scoped>
.index {text-align: center;padding-top: 200px;}
.index .btn {margin: 0 10px;}

.btn_apply {position: relative; display: inline-block;width: 100px;height: 40px;background: #39f;text-align: center;line-height: 40px;border-radius: 3px;color: #fff;cursor: pointer;font-family: simsun;}
.btn_apply input {position: absolute;top:0;left: 0;width: 100%;height: 100%;opacity: 0;overflow: hidden;cursor: pointer;}
</style>
