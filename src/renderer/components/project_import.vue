<template>
    <div class="project_add">
        <div class="mod_tit">导入项目</div>
        <div class="row">
            <p class="row_hd">请将项目文件夹拖入下方</p>
            <div class="row_bd">
                <el-upload class="upload-demo" drag action="" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件夹拖到此处</div>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {mapMutations } from 'vuex'

    export default {
        data(){
            return {
            }
        }
        ,computed: {
        }
        ,methods: {
            ...mapMutations(['AddCount', 'MinusCount'])
            ,testAdd(){
                this.AddCount({name: 'a2017-' + Math.ceil(Math.random()*1e5), path: 'testPath'});
            }
        }
    }
</script>

<style scoped>
    .mod_tit { padding-top: 20px; font-size: 22px; padding-bottom: 10px; color: #555; }
    
    .project_add { width: 500px; margin: 0 auto; padding: 20px 0; font-size: 14px; }
    
    .project_add .row { margin: 10px 0; } 
    .project_add .row_hd { color: #999; padding: 5px 0; }
    
    .project_add .row_btn { padding: 15px 0 0; } 
    
</style>