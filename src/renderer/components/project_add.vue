<template>
    <div class="project_add">
        <div class="mod_tit">创建项目</div>
        <div class="row">
            <p class="row_hd">选择模版</p>
            <div class="row_bd">
                <el-select v-model="taskTemplate" class="sel" placeholder="请选择模板">
                    <el-option v-for="item in templates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">项目域名 </p>
            <div class="row_bd">
                <el-input v-model="taskDomain" type="url">
                    <template slot="append">.qq.com</template>
                </el-input>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">活动名称 (如: a20171013wuxia)</p>
            <div class="row_bd">
                <el-input v-model="taskName"></el-input>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">项目生成路径 (默认生成到全局工具目录)</p>
            <div class="row_bd">
                <span class="btn_apply" >
                    <span >{{working_dir}} </span>
                    <input type="file" @change="choosePath($event)" webkitdirectory >
                </span>
                <!-- <el-input v-model="working_dir"></el-input> -->
            </div>
        </div>
        <div class="row">
            <div class="row_btn">
                <el-button type="primary" @click="createProj">创建项目</el-button>
                <router-link to="/">
                    <el-button>取消</el-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import util from '@/utils/'

    export default {
        data(){
            return {
                taskDomain: 'pvp',
                taskName: '',
                taskTemplate: 'templateDefault', //todo

                templates: [
                    {value:'templateDefault',label:'默认活动模板'},
                    // {value:'templateXycq',label:'轩辕传奇手游活动模板'}
                ]
            }
        }
        ,created(){
        }
        ,mounted(){

        }
        ,computed: {
            ...mapGetters(['working_dir'])
        }
        ,methods: {
            ...mapActions(['addTask' , 'setWorkingDir'])
            ,createProj() {
                if (!this.taskName || !this.taskDomain || !this.working_dir){
                    this.$alert('所有字段内容不能为空', '提示' );
                    return
                }

                let path = this.working_dir + '/' + this.taskName + '/'
                util.createTask(path)
                this.addTask({name: this.taskName, path: path, domain: this.taskDomain});

                this.$router.push({name: 'projectList'})
            }
            ,choosePath(e){
                let files = e.target.files
                if (files[0]) {
                    let dir = files[0].path
                    this.setWorkingDir(dir)
                }
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
    .project_add .row_btn button { margin-right: 10px; }

    
    .project_add .sel { width: 100%; }


.btn_apply {position: relative; display: inline-block;width: 500px;height: 35px;background: #fff;border: 1px solid #BFCBD9;line-height: 35px;border-radius: 3px;box-sizing: border-box;text-indent: 10px;}
.btn_apply input {position: absolute;top:0;left: 0;width: 100%;height: 100%;opacity: 0;overflow: hidden;cursor: pointer;}
</style>