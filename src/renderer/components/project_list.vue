<template>
<div class="list">
    <div class="side">
        <div class="side_hd">项目列表 <span>&gt;&gt;</span></div>
        <div class="side_list_wrap">
            <ul class="side_list">
                <li v-for="(item, index) in projList" :key="index" :class="item.name === curProject.name ? 'click' : '' " @click="projectItemClick(item)">&bull;&nbsp; {{item.name}}</li>
            </ul>
        </div>
    </div>

    <div class="main">
        <div class="btns" @click="removeFocusState">
            <el-button type="" @click="localServe" icon="menu">预览</el-button>
            <el-button type="" icon="check">检测</el-button>
            <el-button type="" icon="upload2">同步</el-button>
            <el-button type="" icon="setting">设置</el-button>
            <el-button type="danger" icon="delete2">删除</el-button>
        </div>
        <div class="hide_input_wrap">
            <input type="button" id="hideInput" class="" value=""/>
        </div>
        <el-input type="textarea" class="txts" :rows="textAreaRows" :readonly="textAreaReadonly" resize="none" v-model="consoleInfo"> </el-input>
    </div>
</div>
</template>

<script>
    import {mapState} from 'vuex'
    import {mapMutations} from 'vuex'
    import {exec} from 'child_process'

    const store = window.localStorage
    export default {
        data(){
            return {
                textAreaRows: 16, //arg must be Number type 
                textAreaReadonly: true,
                consoleInfo: 'console.log("test")'
            }
        }
        ,computed: {
            ...mapState({
                curProject: (state) => state.Core.current_project
                ,projList: (state) => state.Core.project_list

            })    
        }
        ,created(){
        }
        ,methods: {
            ...mapMutations(['SetCurrentProject'])
            ,projectItemClick(proj){
                this.SetCurrentProject(proj)
            }
            ,localServe(){
                if (!this.curProject.name ){
                    this.$alert('choose a project plz :)', '提示');
                    return
                }
                //npm run try
                // exec('num run try') ;
                // const term = exec('webpack --config  D:\\github\\eBuild\\.electron-vue\\testwp.config.js' , {
                    // cwd: 'D:\\ztest\\eBuildDir'
                // })
                // term.stdout.on('data', function(d){
                    // console.log('terminal stdout data : ', d)
                // })
                //this.$alert('create local server for: ' + this.curProject.name , '提示' );
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
</style>
