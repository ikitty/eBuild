<template>
    <div class="project_add">
        <div class="mod_tit">创建项目</div>
        <div class="row">
            <p class="row_hd">选择模版</p>
            <div class="row_bd">
                <el-select v-model="taskTemplate" size="medium" class="row_item_main " placeholder="请选择模板">
                    <el-option v-for="item in templates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" class="row_item_side" @click="dialogAddTempVisible=true"  size="medium">添加模板</el-button>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">项目域名 </p>
            <div class="row_bd">
                <el-input v-model="taskDomain" size="medium" type="url">
                    <template slot="append">.qq.com</template>
                </el-input>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">活动名称 (如: a20180505wuxia ，将替换图片的分离路径)</p>
            <div class="row_bd">
                <el-input v-model="taskName" size="medium"></el-input>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">项目生成路径</p>
            <div class="row_bd">
                <span class="btn_apply" >
                    <span >{{working_dir}} </span>
                    <input type="file" size="medium" @change="choosePath($event)" webkitdirectory >
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

        <!-- dialog box for addTemplate -->
        <el-dialog :visible.sync="dialogAddTempVisible">
            <el-form >
                <el-form-item label="模板名称" >
                    <el-input v-model="tplName" class="tpl_name" auto-complete="off" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="选择模板文件夹" >
                    <input type="file" size="medium" @change="chooseTplPath($event)" webkitdirectory >
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddTempVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddTpl">确 定</el-button>
            </div>
        </el-dialog>
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
                taskTemplate: 'templateMobile', 

                templates: [
                    {value:'templateMobile',label:'移动端活动模板'},
                    {value:'templatePc',label:'PC端活动模板'}
                ]
                ,tplName: ''
                ,tplPath: ''
                ,dialogAddTempVisible: false
            }
        }
        ,created(){ }
        ,mounted(){
            // console.log('got tpl', this.tpl);
            this.tpl.forEach(item => {
                this.templates.push(item)
            });
        }
        ,computed: {
            ...mapGetters(['working_dir', 'task_list', 'tpl'])
        }
        ,methods: {
            ...mapActions(['addTask' , 'setWorkingDir' , 'setCurrentTask', 'addTpl'])
            ,createProj() {
                if (!this.taskName || !this.taskDomain || !this.working_dir){
                    this.$alert('所有字段内容不能为空', '提示' );
                    return
                }

                let inTaskList = (value,key)=>{ return value.name == this.taskName }
                if (this.task_list.some(inTaskList)){
                    this.$alert('已有同名任务，如有必要可在项目列表中先删除项目，然后新增项目', '提示' );
                    return
                }

                let path = this.working_dir + '/' + this.taskName + '/'

                util.createTask(path, this.taskTemplate).then(()=>{
                    let item = {name: this.taskName, path: path, domain: this.taskDomain, template: this.taskTemplate}
                    this.addTask(item)
                    this.setCurrentTask(item)
                    this.$router.push({name: 'projectList', query: { action: 'create_proj'} })
                })
            }
            ,choosePath(e){
                let files = e.target.files
                if (files[0]) {
                    let dir = files[0].path
                    this.setWorkingDir(dir)
                }
            }
            ,chooseTplPath(e){
                let files = e.target.files
                if (files[0]) {
                    let dir = files[0].path
                    this.tplPath = dir
                }
            }
            ,doAddTpl(){
                this.dialogAddTempVisible = false
                //todo cp dir and pass new dir 
                // console.log('add tpl', this.tplName, this.tplPath);
                this.addTpl({value: this.tplPath, label: this.tplName})
            }
        }
    }
</script>

<style scoped>
    .mod_tit { padding-top: 10px; font-size: 22px; padding-bottom: 0px; color: #555; }
    
    .project_add { width: 500px; margin: 0 auto; padding: 20px 0; font-size: 14px; }
    .project_add .row { margin: 8px 0; }
    .project_add .row_hd { color: #999; padding: 5px 0; }
    .project_add .row_bd {overflow: hidden;}
    .project_add .row_btn { padding: 15px 0 0; } 
    .project_add .row_btn button { margin-right: 10px; }


    .row_item_main {float: left;width: 80%;}
    .row_item_side {float: right;width: 18%;}

    .btn_apply {position: relative; display: inline-block;width: 500px;height: 35px;background: #fff;border: 1px solid #D8DCE5;line-height: 35px;border-radius: 3px;box-sizing: border-box;text-indent: 10px;color: #555;}
    .btn_apply input {position: absolute;top:0;left: 0;width: 100%;height: 100%;opacity: 0;overflow: hidden;cursor: pointer;}

    .tpl_name {width: 200px;}
</style>