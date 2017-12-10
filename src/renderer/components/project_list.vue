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
        <div class="log_wrap">
            <p v-for="(item,index) in logs" :key="index">{{item.cont}} {{item.ret}}</p>
        </div>
    </div>
</div>
</template>

<script>
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
                    {cont:'操作内容', ret: 'OK' }
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
            }
            ,localServe(){
                if (!this.current_task.name ){
                    this.$alert('choose a task plz :)', '提示');
                    return
                }

                let path = this.current_task.path
                
                util.devTask(path, this.saveLog)

                // this.$alert('create local server for: ' + this.current_task.name , '提示' );
            }
            ,removeTask(){
                this.delTask(this.current_task)
                this.$alert('成功删除: ' + this.current_task.name , '提示' );
                //todo remove src
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

    .log_wrap {border: 1px solid #ccc;}
    .log_wrap p {margin: 10px 0 ;}
</style>
