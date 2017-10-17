<template>
    <div class="project_add">
        <div class="mod_tit">创建项目</div>
        <div class="row">
            <p class="row_hd">选择模版</p>
            <div class="row_bd">
                <el-select v-model="projtemplate" class="sel" placeholder="请选择模板">
                    <el-option v-for="item in templates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">活动名称 (如: a20171013wuxia)</p>
            <div class="row_bd">
                <el-input v-model="projName"></el-input>
            </div>
        </div>
        <div class="row">
            <p class="row_hd">项目生成路径 (默认生成到全局工具目录)</p>
            <div class="row_bd">
                <el-input v-model="projPath"></el-input>
            </div>
        </div>
        <div class="row">
            <div class="row_btn">
                <el-button type="primary" @click="createProj">创建项目</el-button>
                <router-link to="/">
                    <el-button>取消</el-button>
                </router-link>
            </div>

            <br><hr>
            <span>here are some test data:</span>
            <el-button @click="testAdd">testAdd</el-button> <el-button @click="testMinus">testMinus</el-button>
            <ul>
                <li v-for="item in count" :key="item.name">{{item.name}} at: [{{item.path}}]</li>
            </ul>

        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {mapMutations } from 'vuex'

    export default {
        data(){
            return {
                projName: '',
                projPath: '',
                projtemplate: '',
                templates: [
                    {value:'templateDefault',label:'默认活动模板'},
                    {value:'templateXycq',label:'轩辕传奇手游活动模板'}
                ]
            }
        }
        ,created(){
        }
        ,computed: {
            ...mapState({
                count: (state)=> {
                    console.log('Computed State:', state)
                    return state.Core.project_list
                }
            })
        }
        ,methods: {
            ...mapMutations(['AddCount', 'RemoveCount'])
            ,testAdd(){
                this.AddCount({name: 'a2017-' + Math.ceil(Math.random()*1e5), path: 'testPath'});
            }
            ,testMinus(){
                this.RemoveCount();
            }
            ,createProj() {
                if (!this.projName || !this.projPath){
                    this.$alert('请输入字段内容', '提示' );
                    return
                }
                this.AddCount({name: this.projName, path: this.projPath });

                this.$router.push({name: 'projectList'})
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
</style>