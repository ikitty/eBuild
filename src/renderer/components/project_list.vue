<template>
<div class="list">
    <div class="side">
        <div class="side_hd">项目列表 <span>&gt;&gt;</span></div>
        <div class="side_list_wrap">
            <ul class="side_list">
                <li v-for="(item, index) in task_list" :key="index" :class="item.name === current_task.name ? 'click' : '' " @click="taskItemClick(item)">&bull;&nbsp; {{item.name}}</li>
            </ul>
        </div>
    </div>

    <div class="main">
        <div class="btns" @click="removeFocusState">
            <el-button type="" icon="menu" @click="localServe">本地预览</el-button>
            <el-button type="" icon="check">规范检测</el-button>
            <el-button type="" icon="upload2" @click="buildTask">编译</el-button>
            <el-button type="" icon="setting" @click="layerSetShow=true">设置</el-button>
            <el-button type="danger" icon="delete2" @click="removeTask">删除</el-button>
        </div>
        <div class="hide_input_wrap">
            <input type="button" id="hideInput" class="" value=""/>
        </div>
        <div class="log_wrap" ref="logWrap">
            <p v-for="(item,index) in logs" :key="index">
                {{item.cont}}
                <i v-if="item.ret=='ok'" class="el-icon-success i_ok"></i>
                <i v-if="item.ret=='fail'" class="el-icon-error i_error"></i>
                <i v-if="item.ret=='info'" class="el-icon-info i_info"></i>
                <!-- <i v-if="item.ret=='loading'" class="el-icon-loading i_info"></i> -->
            </p>
        </div>
        <el-dialog title="编辑该项目配置" :visible.sync="layerSetShow" width="50%" >

            <div class="project_add">
                <div class="row">
                    <p class="row_hd">项目域名 </p>
                    <div class="row_bd">
                        <el-input v-model="taskDomain" type="url">
                            <template slot="append">.qq.com</template>
                        </el-input>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="layerSetShow = false">取 消</el-button>
                <el-button type="primary" @click="updateInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</div>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters, mapActions} from 'vuex'
    import {exec} from 'child_process'
    import gulp from 'gulp'
    import util from '@/utils/'

    const store = window.localStorage
    export default {
        data(){
            return {
                layerSetShow:false,
                taskDomain: '',

                textAreaRows: 16, //arg must be Number type 
                textAreaReadonly: true,
                logs: [
                    {cont:'操作内容', ret: 'ok' }
                    ,{cont:'操作内容', ret: 'fail' }
                    ,{cont:'操作内容', ret: 'info' }
                ]
            }
        }
        ,created(){
        }
        ,mounted(){
            this.taskDomain = this.current_task.domain || ''
        }
        ,computed: {
            ...mapGetters(['current_task', 'task_list'])
        }
        ,methods: {
            ...mapActions(['delTask', 'setCurrentTask', 'updateTask'])

            ,taskItemClick(item){
                this.setCurrentTask(item)
                this.taskDomain = this.current_task.domain || ''
            }
            ,saveLog(v){
                this.logs.push(v)
                let logDOM = this.$refs.logWrap
                Vue.nextTick(()=>{
                    let scrollTop = logDOM.scrollHeight - logDOM.clientHeight
                    logDOM.scrollTop = scrollTop
                })
            }
            ,localServe(){
                if (!this.current_task.name ){
                    this.$alert('choose a task plz :)', '提示');
                    return
                }
                // let path = this.current_task.path
                util.devTask(this.current_task, this.saveLog)
            }
            ,updateInfo(){
                let task = JSON.parse(JSON.stringify(this.current_task))
                task.domain = this.taskDomain
                console.log('new task', task);
                this.updateTask(task)
                this.setCurrentTask(task)
                this.layerSetShow = false
            }
            ,buildTask(){
                console.log('build', 1);
                util.buildTask(this.current_task, this.saveLog)

            }
            ,removeTask(){
                this.saveLog({ cont: '开始删除项目' + this.current_task.name })

                util.deleteTask(this.current_task.path).then(()=>{
                    this.saveLog({ cont: '删除项目' + this.current_task.name, ret: 'ok' })
                    this.delTask(this.current_task)
                    this.setCurrentTask({})
                }).catch(err=>{
                    this.saveLog({cont: '删除项目失败：' + err.message, ret: 'fail'})
                })
            }
            ,removeFocusState(e){
                //remove btn focus status to disable focus style  (bad design in element-ui)
                document.getElementById('hideInput').focus()
            }
        }
    }
</script>

<style scoped>
    .list {padding: 0px 0 ;height: 440px;;overflow: hidden;}
    .side {float:left;width: 200px;height: 100%;background: #f9f9f9;border-right: 1px solid #ddd;}
    .side_hd {height: 40px;font-size:14px;font-weight:700;line-height:40px;padding-left:15px;color: #000; background: #E8E8E8;}
    .side_hd span {font-family: simsun;}
    .side_list_wrap {height:400px;overflow-y:scroll;}
    .side_list {padding-left: 15px;}
    .side_list li {height: 50px;line-height: 50px;border-bottom: 1px dotted #ddd;cursor: pointer;}
    .side_list li.click {color: #39f;cursor: default;}

    .main {float:left;width: 570px;height: 100%;padding: 20px}
    .btns {padding-bottom: 20px;}

    .hide_input_wrap {position: relative;height: 0;overflow: hidden;}
    .hide_input_wrap input {position: absolute;top:0;left: 0;}

    .log_wrap {height: 360px;overflow-y: auto; border: 1px solid #000;border-radius: 3px;padding: 0 10px;background: #333;color: #ddd;word-break: break-all;}
    .log_wrap p {margin: 10px 0 ;}
    .log_wrap .i_ok {color: #67C23A;}
    .log_wrap .i_error {color: #F56C6C;}
    .log_wrap .i_info {color: #E6A23C;}

    .project_add .row { margin: 10px 0; }
    .project_add .row_hd { color: #999; padding: 5px 0; }
    .project_add .row_btn { padding: 15px 0 0; } 
    .project_add .row_btn button { margin-right: 10px; }
</style>
