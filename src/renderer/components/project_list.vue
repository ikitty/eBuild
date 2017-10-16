<template>
<div class="list">
    <div class="side">
        <div class="side_hd">项目列表 <span>&gt;&gt;</span></div>
        <div class="side_list_wrap">
            <ul class="side_list">
                <li v-for="(item, index) in projList" :key="index">&bull; {{item.name}}</li>
            </ul>
        </div>
    </div>

    <div class="main">
        <div class="btns">
            <el-button type="" icon="menu">预览</el-button>
            <el-button type="" icon="check">检测</el-button>
            <el-button type="" icon="upload2">同步</el-button>
            <el-button type="" icon="setting">设置</el-button>
            <el-button type="danger" icon="delete2">删除</el-button>
        </div>
        <el-input type="textarea" class="txts" rows=16 resize="none" readonly="true" v-model="consoleInfo"> </el-input>
    </div>
</div>
</template>

<script>
    import {mapState} from 'vuex'

    const store = window.localStorage
    export default {
        data(){
            return {
                projList: [],
                consoleInfo: 'console.log("test")... '
            }
        }
        ,computed: mapState({
            count: 'test'
        })
        ,created(){
            let D = store.getItem('eBuild')
            D = JSON.parse(D) || []
            this.projList = D
        }
        ,methods: {
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
    .side_list li {height: 50px;line-height: 50px;border-bottom: 1px dotted #ddd;}

    .main {float:left;width: 570px;height: 100%;padding: 20px}
    .btns {padding-bottom: 20px;}

</style>
