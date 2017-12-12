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
            <p v-for="(item,index) in logs" :key="index">{{item.cont}} <span :class="'status_' + item.ret">{{item.ret == 'ok'? '成功': item.ret == 'fail' ? '失败' : ''}}</span></p>
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
                let path = this.current_task.path
                util.devTask(path, this.saveLog)
            }
            ,removeTask(){
                util.deleteTask(this.current_task.path, ()=>{
                    this.saveLog({ cont: '删除项目' + this.current_task.name, ret: 'ok' })
                    this.delTask(this.current_task)
                    this.setCurrentTask({})
                })
                // this.$alert('成功删除: ' + this.current_task.name , '提示' );
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
    .log_wrap .status_ok {color: #3f3}
    .log_wrap .status_fail {color: #f60}
</style>
