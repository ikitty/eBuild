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
            <el-button-group>
                <el-button type="primary" size="medium" @click="localServe">{{localServeStatus ? '停止': '本地'}}预览</el-button>
                <el-button type="primary" size="medium" @click="checkSyntax">检测</el-button>
                <el-button type="primary" size="medium" @click="buildTask">编译</el-button>
                <el-button type="primary" size="medium" @click="layerSetShow=true">设置</el-button>
            </el-button-group>

            <el-button-group>
                <el-button type="info" size="medium" @click="logs = []" >清屏</el-button>
                <el-button type="danger" size="medium" @click="removeTask" >删除</el-button>
            </el-button-group>
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
                        <el-input v-model="taskDomain" type="url" size="mini">
                            <template slot="append">.qq.com</template>
                        </el-input>
                    </div>
                </div>
                <div class="row" style="margin-top:15px;">
                    <el-checkbox v-model="transRem">开启px2rem</el-checkbox>
                    , 1rem = <el-input class="ipt_ratio" v-model="projConfig.remRatio" style="width:70px;" size="mini"></el-input> px
                </div>
                <div class="row">
                    <el-checkbox v-model="projConfig.codeMinify">代码压缩</el-checkbox>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="layerSetShow = false">取 消</el-button>
                <el-button type="primary" @click="saveConfig">确 定</el-button>
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
                logs: [ {cont:'系统初始化完毕', ret: 'ok' } ],
                localServeStatus: false

                ,transRem: false
                ,projConfig: {
                    remRatio: 0,
                    codeMinify: false,
                },
            }
        }
        ,created(){
        }
        ,mounted(){
            this.renderConfig(this.current_task)
        }
        ,computed: {
            ...mapGetters(['current_task', 'task_list', 'config'])
        }
        ,methods: {
            ...mapActions(['delTask', 'setCurrentTask', 'updateTask'])

            ,taskItemClick(item){
                this.setCurrentTask(item)
                this.renderConfig(this.current_task)
            }
            ,renderConfig(task){
                this.taskDomain = task.domain || ''

                let config = task.config || {}
                this.projConfig.remRatio = config.remRatio || 0
                this.projConfig.codeMinify = config.codeMinify || false

                this.transRem = 1*this.projConfig.remRatio ? true : false
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
                if (this.localServeStatus) {
                    util.stopTask(this.saveLog)
                    this.localServeStatus = false
                }else{
                    //todo opt
                    this.saveLog({cont:'~~~~~ Let\'s Go! ~~~~~' })
                    if (this.current_task.isPreview) {
                        util.serveTask(this.current_task, this.saveLog)
                    }else{
                        util.startTask(false, this.current_task, this.config, this.saveLog)
                    }
                    this.localServeStatus = true
                }
            }
            ,saveConfig(){
                let task = JSON.parse(JSON.stringify(this.current_task))
                task.domain = this.taskDomain

                if (!this.transRem) {
                    this.projConfig.remRatio = 0
                }
                if (1*this.projConfig.remRatio == 0) {
                    this.transRem = false
                }

                task.config = task.config || {}
                task.config.remRatio = this.projConfig.remRatio
                task.config.codeMinify = this.projConfig.codeMinify

                this.updateTask(task)
                this.setCurrentTask(task)
                this.layerSetShow = false
            }
            ,buildTask(){
                if (!this.taskDomain) {
                    this.$alert('请点击“设置”按钮配置该项目的域名', '提示');
                    return
                }
                this.saveLog({cont:'~~~~~ Let\'s Go! ~~~~~' })
                util.startTask(true, this.current_task, this.config, this.saveLog)
            }
            ,removeTask(){
                this.$confirm('此操作将删除项目和对应的文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.saveLog({ cont: '开始删除项目' + this.current_task.name })
                    util.deleteTask(this.current_task.path).then(()=>{
                        this.saveLog({ cont: '删除项目' + this.current_task.name, ret: 'ok' })
                        this.delTask(this.current_task)
                        this.setCurrentTask(this.task_list[0])

                    }).catch(err=>{
                        this.saveLog({cont: '删除项目失败：' + err.message, ret: 'fail'})
                    })
                });

            }
            ,removeFocusState(e){
                //remove btn focus status to disable focus style  (bad design in element-ui)
                document.getElementById('hideInput').focus()
            }
            ,checkSyntax(){
                this.saveLog({cont: '开始检测语法...', ret: 'info'})
                //todo imgSize, eslint etc.
            }
        }
    }
</script>

<style scoped>
    .list {padding: 0px 0 ;height: 470px;;overflow: hidden;}
    .side {float:left;width: 220px;height: 100%;background: #f9f9f9;border-right: 1px solid #ddd;}

    .side_hd {display:none;height: 40px;font-size:14px;line-height:40px;padding-left:15px;color: #000; background: #E8E8E8;}
    .side_hd span {font-family: simsun;color: #666;}

    .side_list_wrap {height:470px;padding-top:10px;overflow-y:scroll;background-color: #fdfdfd;}
    .side_list {padding-left: 15px;}
    .side_list li {height: 50px;line-height: 50px;border-bottom: 1px dotted #ddd;cursor: pointer;}
    .side_list li.click {color: #39f;cursor: default;}

    .main {float:left;width: 580px;height: 100%;padding: 20px}
    .btns {padding-bottom: 20px;}
    .el-button-group+.el-button-group {margin-left: 10px;}

    .hide_input_wrap {position: relative;height: 0;overflow: hidden;}
    .hide_input_wrap input {position: absolute;top:0;left: 0;}

    .log_wrap {height: 370px;overflow-y: auto; border: 1px solid #000;border-radius: 3px;padding: 0 10px;background: #333;color: #ddd;word-break: break-all;}
    .log_wrap p {margin: 10px 0 ;}
    .log_wrap .i_ok {color: #67C23A;}
    .log_wrap .i_error {color: #F56C6C;}
    .log_wrap .i_info {color: #E6A23C;}

    .project_add .row { margin: 10px 0; }
    .project_add .row_hd { color: #999; padding: 5px 0; }
    .project_add .row_btn { padding: 15px 0 0; } 
    .project_add .row_btn button { margin-right: 10px; }

    .log_wrap::-webkit-scrollbar { width:10px;}
    .log_wrap::-webkit-scrollbar-track-piece { background:rgba(0,0,0,0.5);border-radius: 5px; }
    .log_wrap::-webkit-scrollbar-thumb{ background:#666; border-radius:5px; }
</style>
