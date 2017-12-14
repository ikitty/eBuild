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
            <el-button type="" @click="localServe" icon="menu">预览</el-button>
            <el-button type="" icon="check">检测</el-button>
            <el-button type="" icon="upload2">同步</el-button>
            <el-button type="" icon="setting">设置</el-button>
            <el-button type="danger" @click="removeTask" icon="delete2">删除</el-button>
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
                textAreaRows: 16, //arg must be Number type 
                textAreaReadonly: true,
                logs: [
                    {cont:'操作内容', ret: 'ok' }
                    ,{cont:'操作内容', ret: 'fail' }
                    ,{cont:'操作内容', ret: 'info' }
                ]
            }
        }
        ,computed: {
            ...mapGetters(['current_task', 'task_list'])
        }
        ,created(){
        }
        ,methods: {
            ...mapActions(['delTask', 'setCurrentTask'])
            ,taskItemClick(item){
                this.setCurrentTask(item)
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
</style>
